import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "auto";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Carregar tema do localStorage ou usar "dark" como padrão
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Aplicar tema ao elemento raiz
    const root = document.documentElement;
    
    if (theme === "auto") {
      // Detectar preferência do sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
      
      // Ouvir mudanças na preferência do sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      root.setAttribute("data-theme", theme);
    }
    
    // Salvar no localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

