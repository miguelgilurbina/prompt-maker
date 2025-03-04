import {Theme} from "@/lib/types/theme"
  
  export const matrixTheme: Theme = {
    name: "matrix-digital",
    colors: {
      primary: "120 100% 50%",
      secondary: "120 100% 25%",
      accent: "120 100% 75%",
      background: "0 0% 0%",
      text: "120 100% 85%",
      button: {
        background: "120 100% 25%",
        text: "0 0% 0%",
        border: "120 100% 50%",
        hover: "120 100% 30%",
        glow: "none"
      },

      popover: {
        background: "120 100% 3%",
        foreground: "120 100% 85%",
        border: "120 100% 20%",
        shadow: "120 100% 50%"
      }
    
    },
    fonts: {
      sans: "'Source Code Pro', monospace",
      mono: "'Fira Code', monospace"
    },
    spacing: "compact",
    radiuses: "sharp"
  };