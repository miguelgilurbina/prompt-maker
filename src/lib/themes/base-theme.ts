// lib/themes/base.ts

import {Theme} from "@/lib/types/theme"
export const baseTheme: Theme = {
    name: "base",
    colors: {
      primary: "220 14% 95%",
      secondary: "0 0% 15%",
      accent: "0 69% 42%",
      background: "0 0% 98%",
      text: "0 0% 20%",
      button: {
        background: "0 0% 98%",
        text: "0 0% 20%",
        border: "0 0% 80%",
        hover: "0 0% 95%"
      },

      popover: {
        background: "0 0% 98%",
        foreground: "0 0% 20%",
        border: "0 0% 80%",
        shadow: "0 0% 80%"
      },
    },
    fonts: {
      sans: "'TAZUGANE GOTHIC', sans-serif",
      mono: "'IBM Plex Mono', monospace"
    },
    spacing: "spacious",
    radiuses: "minimal"
  };