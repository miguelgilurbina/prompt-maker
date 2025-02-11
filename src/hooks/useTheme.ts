import { useState, useEffect } from 'react'
import { Theme } from '@/lib/types/theme'
import { themes } from '@/lib/themes'

export function useTheme() {

  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.japaneseMinimal)

  useEffect(() => {
    const root = document.documentElement
    
    // Establecer el atributo data-theme
    root.setAttribute('data-theme', currentTheme.name.toLowerCase())
    
    // Aplicar variables CSS
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // Aplicar fuentes
    Object.entries(currentTheme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value)
    })

    // Añadir clase de transición
    root.classList.add('theme-transition')
    
    return () => {
      root.classList.remove('theme-transition')
    }
  }, [currentTheme])

  return { currentTheme, setTheme: setCurrentTheme }
}