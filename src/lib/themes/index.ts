// lib/themes/index.ts
import { japaneseMinimal } from './japanese-minimal';
import { matrixTheme } from './matrix';
import { duskEmber } from './dusk-ember';

export const themes = {
  duskEmber,
  japaneseMinimal,
  matrixTheme,
} as const;

export type ThemeVariant = keyof typeof themes;
