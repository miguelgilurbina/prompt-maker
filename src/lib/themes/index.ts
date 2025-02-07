// src/lib/themes/index.ts
export interface Theme {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      sans: string;
      mono: string;
    };
    spacing: string;
    radiuses: string;
  }
  
  export const japaneseMinimal: Theme = {
    name: "wa - Japanese Minimal",
    colors: {
      primary: "220 14% 95%",
      secondary: "0 0% 15%",
      accent: "0 69% 42%",
      background: "0 0% 98%",
      text: "0 0% 20%"
    },
    fonts: {
      sans: "'TAZUGANE GOTHIC', sans-serif",
      mono: "'IBM Plex Mono', monospace"
    },
    spacing: "spacious",
    radiuses: "minimal"
  };

  export const matrixTheme: Theme = {
    name: "matrix-digital",
    colors: {
      primary: "120 100% 50%",    // Verde Matrix
      secondary: "120 100% 25%",  // Verde oscuro
      accent: "120 100% 75%",     // Verde brillante
      background: "0 0% 0%",      // Negro puro
      text: "120 100% 85%"        // Verde claro
    },
    fonts: {
      sans: "'Source Code Pro', monospace",
      mono: "'Fira Code', monospace"
    },
    spacing: "compact",
    radiuses: "sharp"
  };
  
  export const themes = {
    japaneseMinimal,
    matrixTheme,
  } as const;