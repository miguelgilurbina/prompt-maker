import { useState, useEffect } from 'react'

type ThemeId = 'tech' | 'creative' | 'clean'

const themes = {
  tech: {
    primary: '250 100% 50%',    // Púrpura vibrante
    secondary: '230 20% 40%',   // Gris azulado
    accent: '160 100% 45%'      // Verde tecnológico
  },
  creative: {
    primary: '280 80% 45%',     // Violeta creativo
    secondary: '200 30% 40%',   // Azul grisáceo
    accent: '330 85% 55%'       // Rosa vibrante
  },
  clean: {
    primary: '220 90% 50%',     // Azul eléctrico
    secondary: '210 15% 35%',   // Gris neutro
    accent: '170 90% 40%'       // Turquesa
  }
}

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('tech')

  useEffect(() => {
    const root = document.documentElement
    const theme = themes[currentTheme]
    
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--secondary', theme.secondary)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--ring', theme.primary)
  }, [currentTheme])

  return { currentTheme, setCurrentTheme }
}