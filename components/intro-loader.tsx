"use client"

import { useI18n } from "@/components/i18n-provider"
import { site } from "@/lib/site"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Pantalla de bienvenida: tu nombre se "escribe" a mano, aparece una frase y un contador
// llega a 100; luego la pantalla sube y deja ver el sitio.
// Solo la primera vez por sesión (lo decide el script de app/layout.tsx antes de pintar).
const DURATION = 3200 // ms hasta que el contador llega a 100
const STORAGE_KEY = "intro-seen"

const taglines = {
  en: "Building the future, line by line.",
  es: "Construyo el futuro, línea a línea.",
}

export function IntroLoader() {
  const { language } = useI18n()
  const [visible, setVisible] = useState(true)
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Ya se vio en esta sesión (o "reducir movimiento"): no se muestra
    if (document.documentElement.classList.contains("intro-seen")) {
      setVisible(false)
      return
    }

    document.documentElement.style.overflow = "hidden"
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      // Arranca rápido y frena al final, como una carga real
      const eased = 1 - Math.pow(1 - progress, 3)
      if (counter.current) counter.current.textContent = String(Math.round(eased * 100)).padStart(3, "0")
      if (progress < 1) frame = requestAnimationFrame(tick)
      else
        setTimeout(() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1")
          } catch {}
          setVisible(false)
        }, 450)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = ""
        document.documentElement.classList.add("intro-seen")
      }}
    >
      {visible && (
        <motion.div
          key="intro"
          className="intro-loader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="relative w-[min(92vw,820px)]">
            <svg viewBox="0 0 1000 330" className="w-full h-auto overflow-visible">
              {/* Nombre: primero se dibuja el contorno de las letras y luego se rellena */}
              <text x="500" y="205" textAnchor="middle" className="intro-signature">
                {site.name}
              </text>
              {/* Trazo final que subraya la firma */}
              <path
                className="intro-swash"
                pathLength={1}
                d="M95 262 C 300 300, 640 300, 860 236 C 900 224, 930 205, 940 188"
              />
              {/* Gotas de tinta al final del trazo */}
              <g className="intro-dots">
                <circle cx="905" cy="262" r="5" />
                <circle cx="925" cy="248" r="2.5" />
                <circle cx="888" cy="276" r="2" />
              </g>
            </svg>
            {/* Sello con las iniciales */}
            <span className="intro-stamp">LQ</span>
          </div>

          <p className="intro-tagline">{taglines[language]}</p>

          <span ref={counter} className="intro-counter">
            000
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
