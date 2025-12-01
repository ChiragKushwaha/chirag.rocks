// types/process.ts
import { ReactNode } from "react";

export interface WindowSize {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Process {
  pid: number; // Unique Process ID (e.g., 1024)
  id: string; // App ID (e.g., 'finder', 'safari')
  title: string; // Window Title
  icon: string; // Icon for the Dock/Window
  component: ReactNode; // The actual React content to render

  // Window State
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number; // Determines visual stacking order
  dimension: WindowSize;

  // Simulated System Resources (for Activity Monitor later)
  memoryUsage: number; // in MB

  // Window Configuration
  windowRequired?: boolean; // If false, renders without WindowFrame (e.g. Launchpad)
}
