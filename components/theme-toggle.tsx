"use client"

import { useEffect, useState } from "react"

// Interruptor luna/sol (adaptado de Uiverse.io, por vikramsinghnegi).
// Apagado = modo oscuro (luna); encendido = modo claro (sol). Estilos en app/globals.css (.theme-switch).
export function ThemeToggle() {
  // El tema real lo aplica el script de app/layout.tsx antes de pintar
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {}
  }

  return (
    <div className="theme-switch">
      <input
        type="checkbox"
        role="switch"
        checked={!isDark}
        onChange={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <span className="theme-switch-track" aria-hidden="true" />
    </div>
  )
}
