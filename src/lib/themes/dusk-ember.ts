import { Theme } from "@/lib/types/theme";

// Dusk & Ember — tema oscuro principal de Prompt Maker consultora
export const duskEmber: Theme = {
  name: "Dusk & Ember",
  colors: {
    primary: "263 93% 76%",       // violeta suave #A78BFA
    secondary: "240 25% 13%",     // superficie oscura #18182A
    accent: "25 97% 60%",         // naranja caliente #FB923C
    background: "240 33% 6%",     // noche profunda #090910
    text: "250 40% 96%",          // crema violácea #F0EEF8
    button: {
      background: "263 93% 76%",
      text: "240 33% 6%",
      border: "263 93% 76%",
      hover: "263 93% 82%",
      glow: "none",
    },
    popover: {
      background: "240 25% 13%",
      foreground: "250 40% 96%",
      border: "240 20% 19%",
      shadow: "0 8px 32px rgba(0,0,0,0.5)",
    },
  },
  fonts: {
    sans: "'Inter', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  spacing: "compact",
  radiuses: "minimal",
};
