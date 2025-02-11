import {Theme} from "@/lib/types/theme"
 
 // lib/themes/japanese-minimal.ts
  export const japaneseMinimal: Theme = {
    name: "wa - Japanese Minimal",
    colors: {
      primary: "220 14% 95%",
      secondary: "0 0% 15%",
      accent: "0 69% 42%",
      background: "0 0% 98%",
      text: "0 0% 20%",
      button: {
        background: "0 0% 98%",     // Fondo claro, similar al background
        text: "0 69% 42%",          // Color accent para el texto
        border: "0 69% 42%",        // Borde en color accent
        hover: "0 69% 42% / 0.1",   // Hover sutíl con transparencia
        glow: "none"                // Sin glow para mantener el minimalismo
      }
    },
    fonts: {
      sans: "'TAZUGANE GOTHIC', sans-serif",
      mono: "'IBM Plex Mono', monospace"
    },
    spacing: "spacious",
    radiuses: "minimal"
  };