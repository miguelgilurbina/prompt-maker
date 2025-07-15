import { useState, useEffect } from 'react'
import { Theme } from '@/lib/types/theme'
import { themes } from '@/lib/themes'

type ThemeValue = string | Record<string, string | Record<string, string>>;

export function useTheme() {
  const [currentTheme, setTheme] = useState<Theme>(themes.japaneseMinimal)

  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme attribute
    root.setAttribute('data-theme', currentTheme.name.toLowerCase());
    
    const applyNestedVariables = (obj: ThemeValue, prefix = '') => {
      if (typeof obj === 'string') {
        root.style.setProperty(`--${prefix}`, obj);
        return;
      }

      Object.entries(obj).forEach(([key, value]) => {
        const cssVarName = prefix ? `${prefix}-${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          applyNestedVariables(value, cssVarName);
        } else if (typeof value === 'string') {
          root.style.setProperty(`--${cssVarName}`, value);
        }
      });
    };
  
    // Apply colors and fonts
    applyNestedVariables(currentTheme.colors);
    applyNestedVariables(currentTheme.fonts, 'font');
  
    // Add transition class
    root.classList.add('theme-transition');
    
    return () => {
      root.classList.remove('theme-transition');
    };
  }, [currentTheme]);

  return { currentTheme, setTheme };
}