// lib/types/theme.ts
export interface Theme {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      button: {
        background: string;
        text: string;
        border: string;
        hover: string;
        glow?: string;
      };
    };
    fonts: {
      sans: string;
      mono: string;
    };
    spacing: 'spacious' | 'compact';  // Añadiendo type safety
    radiuses: 'minimal' | 'sharp';    // Añadiendo type safety
  }
  
 
  

  
