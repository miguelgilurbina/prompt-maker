  // lib/themes/index.ts
  import { japaneseMinimal } from './japanese-minimal';
  import { matrixTheme } from './matrix';
  
  export const themes = {
    japaneseMinimal,
    matrixTheme,
  } as const;
  
  export type ThemeVariant = keyof typeof themes;