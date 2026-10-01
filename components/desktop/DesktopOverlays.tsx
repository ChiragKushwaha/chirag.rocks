import React from "react";
import { ContextMenu } from "../Menus";
import { Spotlight } from "../../apps/Spotlight";
import { NotificationCenter } from "../NotificationCenter";
import { FileCopyWindow } from "../FileCopyWindow";

export const DesktopOverlays: React.FC = () => {
  return (
    <>
      <ContextMenu />
      <Spotlight />
      <NotificationCenter />
      <FileCopyWindow />
    </>
  );
};
