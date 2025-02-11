// src/components/theme/ThemeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Theme } from "@/lib/types/theme";
import { themes } from "@/lib/themes";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: Theme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  // Inicializar tema con persistencia
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("current-theme");
      if (savedTheme) {
        try {
          return JSON.parse(savedTheme) as Theme;
        } catch {
          return initialTheme;
        }
      }
    }
    return initialTheme;
  });

  useEffect(() => {
    const root = document.documentElement;

    // Limpiar clases anteriores
    const themeClasses = Object.keys(themes).map((key) =>
      themes[key as keyof typeof themes].name.toLowerCase().replace(/\s+/g, "-")
    );
    root.classList.remove(...themeClasses);

    // Aplicar nueva clase de tema
    const themeClass = theme.name.toLowerCase().replace(/\s+/g, "-");
    root.classList.add(themeClass);
    root.classList.add("theme-transition");

    // Aplicar variables CSS
    const cssVariables = {
      // Colores
      "--primary": theme.colors.primary,
      "--secondary": theme.colors.secondary,
      "--accent": theme.colors.accent,
      "--background": theme.colors.background,
      "--text": theme.colors.text,
      "--foreground": theme.colors.text, // Añadido para compatibilidad

      // Fuentes
      "--font-sans": theme.fonts.sans,
      "--font-mono": theme.fonts.mono,

      // Otros
      "--spacing": theme.spacing,
      "--radius": theme.radiuses,
    };

    // Aplicar variables
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Persistir tema
    localStorage.setItem("current-theme", JSON.stringify(theme));

    // Cleanup
    return () => {
      root.classList.remove(themeClass, "theme-transition");
    };
  }, [theme]);

  // Manejar cambios de tema con validación
  const handleThemeChange = (newTheme: Theme) => {
    // Validar que el tema sea válido
    if (!newTheme || !newTheme.name || !newTheme.colors) {
      console.error("Invalid theme provided");
      return;
    }

    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Utilidad para validar temas
export function isValidTheme(theme: unknown): theme is Theme {
  if (!theme || typeof theme !== "object") return false;

  const themeCheck = theme as Theme;
  return (
    typeof themeCheck.name === "string" &&
    typeof themeCheck.colors === "object" &&
    typeof themeCheck.fonts === "object" &&
    typeof themeCheck.spacing === "string" &&
    typeof themeCheck.radiuses === "string"
  );
}
