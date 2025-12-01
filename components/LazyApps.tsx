import { lazy } from "react";

// Lazy load heavy apps for better performance
export const LazyFaceTime = lazy(() =>
  import("../apps/FaceTime").then((m) => ({ default: m.FaceTime }))
);
export const LazyTV = lazy(() =>
  import("../apps/TV").then((m) => ({ default: m.TV }))
);
export const LazyMusic = lazy(() =>
  import("../apps/Music").then((m) => ({ default: m.Music }))
);

// Export regular imports for critical apps (loaded immediately)
export { Finder } from "../apps/Finder/Finder";
export { Notes } from "../apps/Notes";
export { Calendar } from "../apps/Calendar";
export { Reminders } from "../apps/Reminders";
export { Messages } from "../apps/Messages";
export { Terminal } from "../apps/Terminal";
export { Calculator } from "../apps/Calculator";
export { TextEdit } from "../apps/TextEdit";
export { Trash } from "../apps/Trash";
