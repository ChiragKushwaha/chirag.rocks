import { PhoneOff, Video, VideoOff, Mic, MicOff, Search, User, Phone } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePermission } from "../context/PermissionContext";
import { useSocketStore } from "../store/socketStore";
import { useSystemStore } from "../store/systemStore";
import { useTranslations } from "next-intl";

const avatarGradients = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-orange-500 to-amber-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-cyan-500",
  "from-red-500 to-pink-500",
];

const getAvatarGradient = (id: string) => {
  const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return avatarGradients[hash % avatarGradients.length];
};

export const FaceTime: React.FC = () => {
  const {
    users,
    isConnected,
    connect,
    disconnect,
    socket,
    incomingCall,
    setIncomingCall,
    isCallActive,
    setCallActive,
    me,
  } = useSocketStore();
  const { user } = useSystemStore();
  const { requestPermission } = usePermission();
  const t = useTranslations("FaceTime");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [inputName, setInputName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // WebRTC Config
  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("FaceTime unmounting, cleaning up...");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
      disconnect();
      setCallActive(false);
    };
  }, [disconnect, setCallActive]);

  // Initialize Preview Stream
  useEffect(() => {
    const initStream = async () => {
      if (!localStreamRef.current) {
        try {
          const allowed = await requestPermission(
            t("Permission.AppName"),
            "📷",
            t("Permission.Title"),
            t("Permission.Reason"),
            "camera"
          );

          if (!allowed) return;

          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStreamRef.current = stream;

          // Attach to preview if available
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = stream;
          }
        } catch (e) {
          console.error("Failed to get local stream", e);
        }
      } else {
        // Re-attach if ref changed
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = localStreamRef.current;
        }
      }
    };

    if (!isCallActive && isConnected) {
      initStream();
    }
  }, [isCallActive, isConnected, requestPermission, t]);

  // Attach stream to active call video when it becomes active
  useEffect(() => {
    if (isCallActive && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [isCallActive]);

  useEffect(() => {
    // Handle incoming answer
    if (!socket) return;

    const handleAnswerMade = async (data: {
      signal: RTCSessionDescriptionInit;
      answerId: string;
    }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(data.signal)
        );
      }
    };

    const handleIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
    }) => {
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
    if (localStreamRef.current) return localStreamRef.current;

    try {
      const allowed = await requestPermission(
        t("Permission.AppName"),
        "📷",
        t("Permission.Title"),
        t("Permission.Reason"),
        "camera"
      );

      if (!allowed) return null;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
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
      new RTCSessionDescription(
        incomingCall.signal as RTCSessionDescriptionInit
      )
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

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  // Auto-login
  useEffect(() => {
    if (!isConnected && me?.name !== user.name && user.name) {
      connect(user.name);
    }
  }, [isConnected, user.name, connect, me]);

  // Filter contacts by search query
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If user name is not set and connection hasn't been established, prompt for name
  if (!isConnected && !user.name) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#121212] text-white p-6 select-none">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-green-900/20">
          <Video size={42} className="text-white" strokeWidth={1.5} />
        </div>
        <div className="text-2xl font-bold mb-2 tracking-tight">{t("Title")}</div>
        <p className="text-gray-400 text-sm mb-6 max-w-xs text-center leading-relaxed">
          Please enter a display name to connect and start making calls.
        </p>
        <div className="w-full max-w-xs space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputName.trim()) {
                connect(inputName.trim());
              }
            }}
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-sm"
          />
          <button
            onClick={() => {
              if (inputName.trim()) {
                connect(inputName.trim());
              }
            }}
            disabled={!inputName.trim()}
            className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:opacity-50 text-white font-medium transition-all text-sm shadow-md active:scale-95"
          >
            Connect to FaceTime
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#121212] text-white p-4">
        <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center mb-4 animate-pulse">
          <Video size={32} className="text-white" />
        </div>
        <div className="text-2xl font-bold mb-2">{t("Title")}</div>
        <div className="text-gray-400 text-sm">
          {t("ConnectingAs", { name: user.name || inputName })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#121212] text-white flex select-none overflow-hidden font-sans">
      {/* Incoming Call Overlay */}
      {incomingCall && !isCallActive && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center backdrop-blur-md">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl shadow-green-500/20">
            <Video size={48} className="text-white animate-bounce" />
          </div>
          <div className="text-2xl font-bold mb-2 tracking-wide text-center">
            {t("IncomingCall", { name: incomingCall.name })}
          </div>
          <div className="text-gray-400 text-sm mb-8">FaceTime Video...</div>
          <div className="flex gap-6">
            <button
              className="bg-green-500 hover:bg-green-400 active:scale-95 shadow-lg shadow-green-500/20 px-8 py-3.5 rounded-full font-semibold transition-all text-sm flex items-center gap-2"
              onClick={acceptCall}
            >
              <Phone size={16} />
              {t("Accept")}
            </button>
            <button
              className="bg-red-500 hover:bg-red-400 active:scale-95 shadow-lg shadow-red-500/20 px-8 py-3.5 rounded-full font-semibold transition-all text-sm flex items-center gap-2"
              onClick={() => setIncomingCall(null)}
            >
              <PhoneOff size={16} />
              {t("Decline")}
            </button>
          </div>
        </div>
      )}

      {isCallActive ? (
        <div className="flex-1 h-full relative flex flex-col justify-center items-center bg-black">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            aria-label={t("Aria.RemoteVideo")}
          />

          {/* Local Video (PIP Float) */}
          <div className="absolute top-6 right-6 w-36 h-52 bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-300">
            {isCameraOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500">
                <VideoOff size={24} />
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
                aria-label={t("Aria.LocalVideo")}
              />
            )}
          </div>

          {/* Call Header Overlay (Remote user details) */}
          <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-medium tracking-wide">
              {incomingCall ? incomingCall.name : "FaceTime Active"}
            </span>
          </div>

          {/* Floating Controls Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-full flex gap-6 items-center shadow-2xl animate-fade-in-up">
            {/* Toggle Mic */}
            <button
              onClick={toggleMute}
              className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 ${
                isMuted
                  ? "bg-red-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Toggle Camera */}
            <button
              onClick={toggleCamera}
              className={`p-3.5 rounded-full transition-all duration-200 active:scale-90 ${
                isCameraOff
                  ? "bg-red-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
            >
              {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>

            {/* End Call */}
            <button
              className="bg-red-600 hover:bg-red-500 hover:shadow-red-600/30 hover:shadow-lg p-3.5 rounded-full transition-all duration-200 active:scale-90 text-white"
              onClick={() => {
                setCallActive(false);
                if (peerRef.current) {
                  peerRef.current.close();
                  peerRef.current = null;
                }
                if (localStreamRef.current) {
                  localStreamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
                }
              }}
              aria-label={t("Aria.EndCall")}
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex h-full">
          {/* Glassmorphic Sidebar */}
          <div className="w-80 border-r border-white/10 bg-neutral-900/40 backdrop-blur-xl flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex flex-col gap-3">
              <div className="text-xl font-bold tracking-wide">{t("Title")}</div>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Enter name to search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50 text-white placeholder-neutral-500 transition-all"
                />
              </div>
            </div>

            {/* Contacts list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 tracking-wider">
                {t("Contacts")}
              </div>
              {filteredUsers.length === 0 ? (
                <div className="px-3 py-8 text-neutral-500 text-xs text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  {t("NoContacts")}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    onClick={() => callUser(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(
                          user.id
                        )} flex items-center justify-center text-white text-xs font-bold shadow-inner`}
                      >
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[130px] group-hover:text-green-400 transition-colors">
                        {user.name}
                      </span>
                    </div>
                    <button
                      className="bg-green-600/20 hover:bg-green-600 hover:text-white text-green-400 p-2 rounded-lg transition-all duration-150 flex items-center justify-center shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        callUser(user.id);
                      }}
                      aria-label={t("Aria.VideoCallContact", { name: user.name })}
                    >
                      <Video size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Connected User Footer */}
            <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium truncate max-w-[150px]">
                  {me?.name}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="text-red-400 hover:text-red-300 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Area (Camera Preview) */}
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0d0e] p-6 relative">
            <div className="text-center w-full max-w-lg">
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl mx-auto flex items-center justify-center">
                {/* Preview Local Video */}
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  aria-label={t("Aria.LocalPreview")}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Preview Camera</span>
                </div>
              </div>
              <div className="mt-6 text-sm text-neutral-400 font-medium">
                {t("SelectContact")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
