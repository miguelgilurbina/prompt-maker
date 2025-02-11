// lib/utils/createTheme.ts
import { Theme } from '../types/theme';
import { baseTheme } from '../themes/base-theme';

export function createTheme(themeConfig: Partial<Theme>): Theme {

    
  return {
    ...baseTheme,
    ...themeConfig,
    colors: {
      ...baseTheme.colors,
      ...themeConfig.colors,
      button: {
        ...baseTheme.colors.button,
        ...themeConfig.colors?.button
      }
    }
  };
}