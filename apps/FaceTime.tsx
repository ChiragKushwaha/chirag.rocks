import React, { useEffect, useRef, useState } from "react";
import { useSocketStore } from "../store/socketStore";
import { useSystemStore } from "../store/systemStore";

export const FaceTime: React.FC = () => {
  const {
    users,
    isConnected,
    connect,
    socket,
    incomingCall,
    setIncomingCall,
    isCallActive,
    setCallActive,
    me,
  } = useSocketStore();
  const { user } = useSystemStore();

  const [loginName, setLoginName] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  // WebRTC Config
  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    // Handle incoming answer
    if (!socket) return;

    const handleAnswerMade = async (data: {
      signal: any;
      answerId: string;
    }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(data.signal)
        );
      }
    };

    const handleIceCandidate = async (data: { candidate: any }) => {
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    };

    socket.on("answer-made", handleAnswerMade);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("answer-made", handleAnswerMade);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Failed to get local stream", err);
      return null;
    }
  };

  const callUser = async (userId: string) => {
    const stream = await startLocalStream();
    if (!stream) return;

    const peer = new RTCPeerConnection(rtcConfig);
    peerRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket?.emit("call-user", {
      userToCall: userId,
      signalData: offer,
      from: me?.id,
    });

    setCallActive(true);
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    const stream = await startLocalStream();
    if (!stream) return;

    const peer = new RTCPeerConnection(rtcConfig);
    peerRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          to: incomingCall.from,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    await peer.setRemoteDescription(
      new RTCSessionDescription(incomingCall.signal)
    );
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket?.emit("make-answer", {
      signal: answer,
      to: incomingCall.from,
    });

    setCallActive(true);
    setIncomingCall(null);
  };

  // Auto-login
  useEffect(() => {
    if (!isConnected && me?.name !== user.name && user.name) {
      connect(user.name);
    }
  }, [isConnected, user.name, connect, me]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
        <div className="text-3xl font-bold mb-4">FaceTime</div>
        <div className="animate-pulse text-gray-400">
          Connecting as {user.name}...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-900 text-white flex flex-col relative overflow-hidden">
      {/* Incoming Call Overlay */}
      {incomingCall && !isCallActive && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <div className="text-2xl mb-4">{incomingCall.name} is calling...</div>
          <div className="flex gap-4">
            <button
              className="bg-green-500 px-6 py-3 rounded-full font-bold"
              onClick={acceptCall}
            >
              Accept
            </button>
            <button
              className="bg-red-500 px-6 py-3 rounded-full font-bold"
              onClick={() => setIncomingCall(null)}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {isCallActive ? (
        <div className="flex-1 relative">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Local Video (PIP) */}
          <div className="absolute top-4 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              className="bg-red-500 p-4 rounded-full"
              onClick={() => {
                // End Call Logic
                setCallActive(false);
                if (peerRef.current) {
                  peerRef.current.close();
                  peerRef.current = null;
                }
                // Stop local stream
                if (localVideoRef.current && localVideoRef.current.srcObject) {
                  (localVideoRef.current.srcObject as MediaStream)
                    .getTracks()
                    .forEach((track) => track.stop());
                }
              }}
            >
              End
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-700 bg-gray-800 p-4">
            <div className="text-xl font-bold mb-4">Contacts</div>
            {users.length === 0 && (
              <div className="text-gray-400">No one else is online.</div>
            )}
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-gray-700 rounded cursor-pointer"
              >
                <span>{user.name}</span>
                <button
                  className="bg-green-600 px-3 py-1 rounded text-sm"
                  onClick={() => callUser(user.id)}
                >
                  Video
                </button>
              </div>
            ))}
          </div>
          {/* Main Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="text-6xl mb-4">📹</div>
              <div className="text-xl text-gray-400">
                Select a contact to call
              </div>
              <div className="mt-4 w-64 h-48 bg-black rounded-lg overflow-hidden mx-auto border border-gray-700">
                {/* Preview Local Video */}
                <video
                  ref={(ref) => {
                    if (ref && !localVideoRef.current) {
                      navigator.mediaDevices
                        .getUserMedia({ video: true })
                        .then((stream) => {
                          ref.srcObject = stream;
                        })
                        .catch((e) => console.log("Preview error", e));
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
