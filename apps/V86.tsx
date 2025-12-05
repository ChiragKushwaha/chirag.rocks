"use client";

import React, { useEffect, useRef, useState } from "react";
import { fs } from "../lib/FileSystem";

interface V86Props {
  initialFilename?: string;
  initialPath?: string;
  onClose?: () => void;
}

declare global {
  interface Window {
    V86: any;
  }
}

export const V86: React.FC<V86Props> = ({ initialFilename, initialPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const emulatorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (!initialFilename || !initialPath) {
          throw new Error("No file selected");
        }

        // 1. Load V86 Script if not present
        if (!window.V86) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "/lib/v86/libv86.js";
            script.onload = resolve;
            script.onerror = () =>
              reject(new Error("Failed to load V86 script"));
            document.head.appendChild(script);
          });
        }

        console.log("V86 Script loaded.");
        console.log("window.V86:", window.V86);
        console.log("window.V86:", (window as any).V86);

        // Debug globals
        const v86Keys = Object.keys(window).filter((k) =>
          k.toLowerCase().includes("v86")
        );
        console.log("V86 related globals:", v86Keys);

        if (!mounted) return;

        // 2. Load File Data
        const blob = await fs.readFileBlob(initialPath, initialFilename);
        if (!blob) throw new Error("Failed to read file");
        const buffer = await blob.arrayBuffer();

        // 3. Determine config based on extension and size
        const ext = initialFilename.split(".").pop()?.toLowerCase();
        const size = buffer.byteLength;

        const config: any = {
          wasm_path: "/lib/v86/v86.wasm",
          memory_size: 512 * 1024 * 1024,
          vga_memory_size: 8 * 1024 * 1024,
          screen_container: containerRef.current,
          bios: { url: "/lib/v86/seabios.bin" },
          vga_bios: { url: "/lib/v86/vgabios.bin" },
          autostart: true,
        };

        if (ext === "iso") {
          config.cdrom = { buffer };
        } else if (ext === "img") {
          // Heuristic: If size is typical floppy size (< 2.88MB), use fda
          // 2.88MB is 2949120 bytes. Let's send anything < 4MB to floppy to be safe for small OSes
          if (size < 4 * 1024 * 1024) {
            config.fda = { buffer };
          } else {
            config.hda = { buffer };
          }
        } else {
          // Default fallback
          if (size < 4 * 1024 * 1024) {
            config.fda = { buffer };
          } else {
            config.hda = { buffer };
          }
        }

        // 4. Start Emulator
        // @ts-ignore
        emulatorRef.current = new window.V86(config);

        // Setup listeners if needed
        // emulatorRef.current.add_listener("screen-set-mode", (is_graphical: boolean) => {
        //   console.log("Screen mode:", is_graphical);
        // });

        setLoading(false);
      } catch (err: any) {
        console.error("V86 Init Error:", err);
        setError(err.message || "Failed to start emulator");
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      if (emulatorRef.current) {
        try {
          emulatorRef.current.destroy();
        } catch (e) {
          console.error("V86 cleanup error", e);
        }
      }
    };
  }, [initialFilename, initialPath]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-10 bg-black/50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <span>Booting {initialFilename}...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 z-10 bg-black/90 p-4 text-center">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Screen Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center relative bg-black"
        style={{
          // Force white text for text mode
          color: "white",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            whiteSpace: "pre",
            font: "14px monospace",
            lineHeight: "14px",
          }}
        ></div>
        <canvas style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
};
