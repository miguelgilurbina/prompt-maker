// src/components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Theme } from "@/lib/themes";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    // Aplicar variables CSS
    const root = document.documentElement;

    // Colores
    root.style.setProperty("--primary", theme.colors.primary);
    root.style.setProperty("--secondary", theme.colors.secondary);
    root.style.setProperty("--accent", theme.colors.accent);
    root.style.setProperty("--background", theme.colors.background);
    root.style.setProperty("--text", theme.colors.text);

    // Fuentes
    root.style.setProperty("--font-sans", theme.fonts.sans);
    root.style.setProperty("--font-mono", theme.fonts.mono);

    // Clases específicas del tema
    root.className = theme.name.toLowerCase().replace(/\s+/g, "-");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`wa-theme ${theme.name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {children}
      </div>
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
