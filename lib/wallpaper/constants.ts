import { WallpaperInfo } from "./types";

export const BUILTIN_WALLPAPERS: WallpaperInfo[] = [
  {
    name: "Big Sur Graphic",
    baseName: "WhiteSur",
    variants: {
      standard: "/assets/System/Library/Desktop Pictures/WhiteSur.webp",
      light: "/assets/System/Library/Desktop Pictures/WhiteSur-light.webp",
      dark: "/assets/System/Library/Desktop Pictures/WhiteSur-dark.webp",
      morning: "/assets/System/Library/Desktop Pictures/WhiteSur-morning.webp",
    },
  },
  {
    name: "Big Sur Coast",
    baseName: "BigSurCoast",
    variants: {
      standard: "/assets/System/Library/Desktop Pictures/BigSurCoast.webp",
      light: "/assets/System/Library/Desktop Pictures/BigSurCoast-light.webp",
      dark: "/assets/System/Library/Desktop Pictures/BigSurCoast-dark.webp",
    },
  },
  {
    name: "Big Sur Chroma",
    baseName: "BigSurChroma",
    variants: {
      standard: "/assets/System/Library/Desktop Pictures/BigSurChroma.webp",
      light: "/assets/System/Library/Desktop Pictures/BigSurChroma-light.webp",
      dark: "/assets/System/Library/Desktop Pictures/BigSurChroma-dark.webp",
    },
  },
  {
    name: "Monterey",
    baseName: "Monterey",
    variants: {
      standard: "/assets/System/Library/Desktop Pictures/Monterey.webp",
      light: "/assets/System/Library/Desktop Pictures/Monterey-light.webp",
      dark: "/assets/System/Library/Desktop Pictures/Monterey-dark.webp",
      morning: "/assets/System/Library/Desktop Pictures/Monterey-morning.webp",
    },
  },
];

export const DESKTOP_PICTURES_DIR = "/System/Library/Desktop Pictures";
