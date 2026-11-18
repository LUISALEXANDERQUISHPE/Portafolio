"use client"

import { useI18n } from "@/components/i18n-provider"
import { useEffect, useRef, useState } from "react"

// Textos que muestra el cursor sobre elementos con data-cursor="<clave>"
const labels = {
  en: { view: "View", open: "Open", drag: "Drag", send: "Send" },
  es: { view: "Ver", open: "Abrir", drag: "Arrastra", send: "Enviar" },
}
type LabelKey = keyof (typeof labels)["en"]

// Elementos sobre los que el punto se convierte en un anillo
const INTERACTIVE = "a, button, [role=button], label, summary, select"
// Campos de texto: se oculta el punto y se usa el cursor normal
const TEXT_FIELD = "input, textarea, [contenteditable=true]"
// Cuánto dura la estela que deja el mouse al moverse
const TRAIL_LIFE = 500

// Cursor personalizado: un punto lima que, sobre proyectos y certificados,
// se convierte en una pastilla con una acción ("Ver", "Abrir").
// Solo en equipos con mouse y sin "reducir movimiento"; en móviles no aparece.
export function CustomCursor() {
  const { language } = useI18n()
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<"hidden" | "dot" | "link" | "label">("hidden")
  const [label, setLabel] = useState<LabelKey | null>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const trailCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add("has-custom-cursor")

    const target = { x: -100, y: -100 }
    const position = { x: -100, y: -100 }
    let frame = 0

    // Estela: puntos recientes del mouse que se desvanecen en TRAIL_LIFE ms
    const trail: { x: number; y: number; time: number }[] = []
    const canvas = trailCanvas.current
    const context = canvas?.getContext("2d")
    let color = "#dcec6b"
    const resize = () => {
      if (!canvas || !context) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      color = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || color
    }
    resize()
    // El color cambia con el tema claro/oscuro
    const themeObserver = new MutationObserver(resize)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const drawTrail = (now: number) => {
      if (!canvas || !context) return
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      while (trail.length && now - trail[0].time > TRAIL_LIFE) trail.shift()
      if (trail.length < 3) return
      context.lineCap = "butt"
      context.strokeStyle = color
      // Curva suave que pasa por los puntos medios; cada tramo es más fino y transparente cuanto más viejo
      for (let i = 1; i < trail.length - 1; i++) {
        const a = trail[i - 1]
        const b = trail[i]
        const c = trail[i + 1]
        const life = Math.max(0, 1 - (now - b.time) / TRAIL_LIFE)
        context.globalAlpha = life * 0.9
        context.lineWidth = 0.4 + life * 1.4
        context.beginPath()
        context.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2)
        context.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2)
        context.stroke()
      }
      context.globalAlpha = 1
    }

    // El cursor sigue al mouse con un pequeño retraso suave
    const loop = (now: number) => {
      position.x += (target.x - position.x) * 0.3
      position.y += (target.y - position.y) * 0.3
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      }
      const last = trail[trail.length - 1]
      if (position.x >= 0 && (!last || Math.hypot(position.x - last.x, position.y - last.y) > 0.5)) {
        trail.push({ x: position.x, y: position.y, time: now })
      }
      drawTrail(now)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      target.x = event.clientX
      target.y = event.clientY
      if (position.x < 0) {
        position.x = target.x
        position.y = target.y
      }

      const element = event.target instanceof Element ? event.target : null
      const labelled = element?.closest<HTMLElement>("[data-cursor]")
      if (labelled) {
        setLabel(labelled.dataset.cursor as LabelKey)
        setState("label")
      } else if (element?.closest(TEXT_FIELD)) {
        setState("hidden")
      } else {
        setState(element?.closest(INTERACTIVE) ? "link" : "dot")
      }
    }
    const onLeave = () => setState("hidden")

    window.addEventListener("pointermove", onMove)
    window.addEventListener("resize", resize)
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      themeObserver.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      document.documentElement.classList.remove("has-custom-cursor")
    }
  }, [enabled])

  if (!enabled) return null

  const text = label ? labels[language][label] : null
  return (
    <>
      {/* Estilos en línea a propósito: si el lienzo no queda "fixed" ocupa espacio en la página
          (crea scroll horizontal y un hueco bajo el footer) */}
      <canvas
        ref={trailCanvas}
        className="custom-cursor-trail"
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9998 }}
        aria-hidden="true"
      />
      <div ref={cursor} className="custom-cursor" data-state={state} aria-hidden="true">
        <span className="custom-cursor-label">{state === "label" && text ? `${text} ↗` : ""}</span>
      </div>
    </>
  )
}
