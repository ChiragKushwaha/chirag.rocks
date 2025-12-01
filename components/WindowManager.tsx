import React from "react";
import { useProcessStore } from "../store/processStore";
import { WindowFrame } from "./window/WindowFrame";

export const WindowManager: React.FC = () => {
  const { processes } = useProcessStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* pointer-events-none allows clicking on desktop items "behind" the window manager layer.
         We re-enable pointer-events inside the WindowFrame.
      */}
      <div className="relative w-full h-full">
        {processes.map((process) =>
          process.windowRequired === false ? (
            <React.Fragment key={process.pid}>
              {process.component}
            </React.Fragment>
          ) : (
            <WindowFrame key={process.pid} process={process} />
          )
        )}
      </div>
    </div>
  );
};
