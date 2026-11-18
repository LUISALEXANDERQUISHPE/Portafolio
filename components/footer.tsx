"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useI18n } from "./i18n-provider"
import { site } from "@/lib/site"
import { Github, Linkedin, Mail } from "lucide-react"

const socialLinks = [
  { icon: Github, href: site.github, label: "GitHub" },
  { icon: Linkedin, href: site.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${site.emails[0]}`, label: "Email" },
]

// Lienzo de las olas, en unidades del viewBox
const WIDTH = 1440
const HEIGHT = 140
const STEP = 16

// Capas de atrás hacia delante. La última tiene el color del cuerpo del footer.
const layers = [
  { base: 74, amplitude: 16, length: 520, speed: 0.9, fill: "var(--brand)", opacity: 0.3, react: 0.5 },
  { base: 84, amplitude: 14, length: 380, speed: -1.2, fill: "var(--brand-alt)", opacity: 0.45, react: 0.7 },
  { base: 94, amplitude: 12, length: 460, speed: 1.5, fill: "var(--brand)", opacity: 0.6, react: 0.85 },
  { base: 106, amplitude: 10, length: 600, speed: -0.8, fill: "var(--brand)", opacity: 1, react: 1 },
]

// Dibuja una capa. `time` mueve la ola; `mouseX` y `strength` levantan una cresta bajo el cursor.
function wavePath(layer: (typeof layers)[number], time: number, mouseX: number, strength: number) {
  let d = `M0 ${HEIGHT}`
  for (let x = 0; x <= WIDTH; x += STEP) {
    const k = (Math.PI * 2) / layer.length
    let y =
      layer.base +
      Math.sin(x * k + time * layer.speed) * layer.amplitude +
      Math.sin(x * k * 0.45 - time * layer.speed * 0.6) * layer.amplitude * 0.5

    if (strength > 0.001) {
      const distance = x - mouseX
      const bump = Math.exp(-((distance / 190) ** 2))
      const ripple = Math.sin(distance * 0.035 - time * 5) * Math.exp(-((distance / 340) ** 2))
      y -= strength * layer.react * (bump * 46 + ripple * 9)
    }

    d += ` L${x} ${y.toFixed(1)}`
  }
  return `${d} L${WIDTH} ${HEIGHT} Z`
}

export function Footer() {
  const { t } = useI18n()
  const footerRef = useRef<HTMLElement>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const mouse = useRef({ x: WIDTH / 2, target: 0, strength: 0 })

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let running = false
    const start = performance.now()

    const tick = (now: number) => {
      const time = (now - start) / 1000
      const m = mouse.current
      // La cresta aparece y desaparece poco a poco
      m.strength += (m.target - m.strength) * 0.08
      layers.forEach((layer, index) => {
        pathRefs.current[index]?.setAttribute("d", wavePath(layer, time, m.x, m.strength))
      })
      frame = requestAnimationFrame(tick)
    }

    // Solo anima mientras el footer está en pantalla
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        frame = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    observer.observe(footer)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * WIDTH
    mouse.current.target = 1
  }

  const handlePointerLeave = () => {
    mouse.current.target = 0
  }

  return (
    <footer
      ref={footerRef}
      className="footer-waves relative bg-background"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <svg
        className="w-full h-24 sm:h-36"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {layers.map((layer, index) => (
          <path
            key={index}
            ref={(element) => {
              pathRefs.current[index] = element
            }}
            d={wavePath(layer, 0, 0, 0)}
            fill={layer.fill}
            fillOpacity={layer.opacity}
          />
        ))}
      </svg>

      <div className="footer-waves-body text-neutral-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-display text-lg font-bold tracking-tight">{site.name}</p>
              <p className="text-sm text-neutral-950/75">
                © {new Date().getFullYear()} · {t("footer.copyright")}
              </p>
            </div>

            <div className="flex gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-950/10 text-neutral-950 hover:bg-neutral-950/25 transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
