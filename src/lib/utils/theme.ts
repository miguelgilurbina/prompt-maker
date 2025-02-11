// lib/utils/theme.ts
import { Theme } from '../types/theme';

export const hslToRgb = (hsl: string): string => {
  // Convertir valores HSL a RGB para CSS
  const [h, s, l] = hsl.split(' ').map(val => parseFloat(val));
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const getThemeVariables = (theme: Theme) => {
  return {
    '--color-primary': hslToRgb(theme.colors.primary),
    '--color-secondary': hslToRgb(theme.colors.secondary),
    '--color-accent': hslToRgb(theme.colors.accent),
    '--color-background': hslToRgb(theme.colors.background),
    '--color-text': hslToRgb(theme.colors.text),
    '--font-sans': theme.fonts.sans,
    '--font-mono': theme.fonts.mono,
    '--spacing': theme.spacing === 'spacious' ? '1.5rem' : '1rem',
    '--radius': theme.radiuses === 'minimal' ? '2px' : '0px'
  };
};