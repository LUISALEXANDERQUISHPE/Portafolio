"use client"

import { useI18n } from "@/components/i18n-provider"
import { site } from "@/lib/site"
import Image from "next/image"
import { useEffect, useId, useRef } from "react"

// Carnet colgado de una cinta. Se puede arrastrar con el mouse (o el dedo): al soltarlo se balancea
// con física de cuerda (Verlet) y, si se lanza de lado, gira. Un clic sin arrastrar lo voltea.
// Al frente: foto, nombre y rol. Atrás: la descripción.

export const badgeTexts = {
  en: {
    id: "Developer ID",
    about: "About me",
    study: "Software Engineering · UTA",
    hint: "Drag the badge · click to flip it",
  },
  es: {
    id: "Carnet de desarrollador",
    about: "Sobre mí",
    study: "Ingeniería de Software · UTA",
    hint: "Arrastra el carnet · clic para voltearlo",
  },
}

const SEGMENTS = 14 // puntos de la cinta
const GRAVITY = 1500 // px/s²
const DAMPING = 0.993 // por paso de física: el balanceo se apaga poco a poco
const STEP = 1 / 120 // la física avanza en pasos fijos y pequeños para que el movimiento sea suave
const FOLLOW = 0.16 // qué tan rápido sigue el carnet al mouse al arrastrarlo (0-1)
const MAX_STRETCH = 1.9 // la cinta es elástica: al jalarla se estira hasta casi el doble

type Point = { x: number; y: number; px: number; py: number }

export function IdBadge({ className = "", desktop = false }: { className?: string; desktop?: boolean }) {
  const { t, language } = useI18n()
  const text = badgeTexts[language]
  const strapId = useId().replace(/:/g, "")

  const container = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const strap = useRef<SVGPathElement>(null)
  const strapShadow = useRef<SVGPathElement>(null)

  // Estado de la física (no necesita re-render)
  const sim = useRef({
    points: [] as Point[],
    segment: 0,
    cardWidth: 260,
    angle: 0,
    angleVelocity: 0,
    twist: 0,
    twistVelocity: 0,
    twistTarget: null as number | null, // lado al que debe girar tras un clic (frente o reverso)
    tilt: 0,
    stretch: 1, // cuánto está estirada la cinta (1 = largo normal)
    drag: {
      active: false,
      offsetX: 0,
      offsetY: 0,
      targetX: 0,
      targetY: 0,
      startX: 0,
      startY: 0,
      startTime: 0,
      moved: false,
    },
  })

  useEffect(() => {
    const element = container.current
    if (!element) return
    const state = sim.current

    // Coloca la cinta según el tamaño del contenedor
    const reset = () => {
      const width = element.clientWidth
      if (!width) return
      const anchorX = desktop ? Math.min(1152, width * 2 - 64) * 0.3 : width / 2
      const ropeLength = desktop ? 250 : 130
      state.cardWidth = desktop ? 260 : 220
      state.segment = ropeLength / (SEGMENTS - 1)
      state.points = Array.from({ length: SEGMENTS }, (_, i) => {
        // Empieza un poco desplazada para que entre balanceándose
        const x = anchorX + i * 9
        const y = -30 + i * state.segment * 0.95
        return { x, y, px: x, py: y }
      })
      state.points[0].x = state.points[0].px = anchorX
    }
    reset()
    const resizeObserver = new ResizeObserver(reset)
    resizeObserver.observe(element)

    let frame = 0
    let last = performance.now()
    let running = false

    // Un paso de física de duración fija h
    const simulate = (h: number) => {
      const { points, segment, drag } = state
      const end = points[points.length - 1]

      // 1) Integración Verlet (el primer punto está fijo arriba)
      for (let i = 1; i < points.length; i++) {
        const point = points[i]
        const vx = (point.x - point.px) * DAMPING
        const vy = (point.y - point.py) * DAMPING
        point.px = point.x
        point.py = point.y
        if (i === points.length - 1 && drag.active) {
          // Al arrastrar, el carnet se acerca al mouse con suavidad (no salta) y nunca más lejos
          // de lo que mide la cinta: así no "rebota" de golpe al soltarlo
          const anchor = points[0]
          let targetX = drag.targetX
          let targetY = drag.targetY
          const reach = Math.hypot(targetX - anchor.x, targetY - anchor.y)
          const maxReach = segment * (points.length - 1) * MAX_STRETCH
          if (reach > maxReach) {
            targetX = anchor.x + ((targetX - anchor.x) * maxReach) / reach
            targetY = anchor.y + ((targetY - anchor.y) * maxReach) / reach
          }
          point.x += (targetX - point.x) * FOLLOW
          point.y += (targetY - point.y) * FOLLOW
          continue
        }
        point.x += vx
        point.y += vy + GRAVITY * h * h
      }

      // Estiramiento elástico: al arrastrar se alarga lo necesario; al soltar recupera su largo poco a poco
      const ropeLength = segment * (points.length - 1)
      if (drag.active) {
        const reach = Math.hypot(drag.targetX - points[0].x, drag.targetY - points[0].y)
        const wanted = Math.max(1, Math.min(MAX_STRETCH, reach / ropeLength))
        state.stretch += (wanted - state.stretch) * 0.2
      } else {
        state.stretch += (1 - state.stretch) * 0.035
      }
      const link = segment * state.stretch

      // 2) La cinta no pasa de su largo (estirado o no); sí puede quedar floja
      for (let iteration = 0; iteration < 12; iteration++) {
        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i]
          const b = points[i + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.hypot(dx, dy) || 0.0001
          if (distance <= link) continue
          const difference = (distance - link) / distance
          const isEnd = i + 1 === points.length - 1
          // Pesos: el ancla no se mueve; el carnet pesa más que la cinta; si se arrastra, manda el mouse
          let weightA = i === 0 ? 0 : 0.5
          let weightB = i === 0 ? 1 : 0.5
          if (isEnd && i !== 0) {
            weightA = drag.active ? 1 : 0.85
            weightB = drag.active ? 0 : 0.15
          }
          a.x += dx * difference * weightA
          a.y += dy * difference * weightA
          b.x -= dx * difference * weightB
          b.y -= dy * difference * weightB
        }
      }

      // 3) Inclinación del carnet: sigue el último tramo de la cinta con inercia (resorte amortiguado)
      const before = points[points.length - 2]
      const targetAngle = Math.max(
        -60,
        Math.min(60, (Math.atan2(-(end.x - before.x), end.y - before.y) * 180) / Math.PI),
      )
      state.angleVelocity += ((targetAngle - state.angle) * 90 - state.angleVelocity * 12) * h
      state.angle += state.angleVelocity * h

      // 4) Giro (eje vertical): moverlo de lado lo hace girar un poco; un resorte suave lo deja de frente o de espaldas
      const vx = (end.x - end.px) / h
      state.twistVelocity += vx * 0.22 * h
      // Tras un clic gira hasta el otro lado; si no, se queda en el lado más cercano
      if (state.twistTarget !== null && Math.abs(state.twistTarget - state.twist) < 2) state.twistTarget = null
      const rest = state.twistTarget ?? Math.round(state.twist / 180) * 180
      state.twistVelocity += ((rest - state.twist) * 20 - state.twistVelocity * 4.2) * h
      state.twistVelocity = Math.max(-720, Math.min(720, state.twistVelocity))
      state.twist += state.twistVelocity * h
    }

    let accumulator = 0
    const step = (now: number) => {
      accumulator += Math.min((now - last) / 1000, 0.1)
      last = now
      const { points } = state
      if (points.length) {
        while (accumulator >= STEP) {
          simulate(STEP)
          accumulator -= STEP
        }
        const end = points[points.length - 1]
        // Ladeo hacia adelante/atrás según la velocidad vertical, muy suave
        const vy = (end.y - end.py) / STEP
        state.tilt += (Math.max(-10, Math.min(10, -vy * 0.006)) - state.tilt) * 0.08

        // 5) Pintar
        if (card.current) {
          card.current.style.transform = `translate3d(${end.x - state.cardWidth / 2}px, ${end.y}px, 0) rotate(${state.angle}deg)`
        }
        if (inner.current) {
          inner.current.style.transform = `perspective(1200px) rotateX(${state.tilt}deg) rotateY(${state.twist}deg)`
          // El reflejo del plástico se desliza al inclinarse o girar; la sombra acompaña el balanceo
          const turn = Math.sin((state.twist * Math.PI) / 180)
          inner.current.style.setProperty("--gloss", `${50 + state.angle * 1.4 + turn * 70}%`)
          inner.current.style.setProperty("--shadow-x", `${-state.angle * 0.6 - turn * 12}px`)
        }
        let d = `M ${points[0].x} ${points[0].y}`
        for (let i = 1; i < points.length - 1; i++) {
          const midX = (points[i].x + points[i + 1].x) / 2
          const midY = (points[i].y + points[i + 1].y) / 2
          d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`
        }
        d += ` L ${end.x} ${end.y}`
        strap.current?.setAttribute("d", d)
        strapShadow.current?.setAttribute("d", d)
      }
      frame = requestAnimationFrame(step)
    }

    // Solo anima mientras se ve
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        last = performance.now()
        frame = requestAnimationFrame(step)
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    visibility.observe(element)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibility.disconnect()
    }
  }, [desktop])

  // ---- Arrastre ----
  // Mientras se arrastra se escucha en toda la ventana: así el carnet se suelta aunque el mouse
  // termine fuera de él (por ejemplo, al llegar al límite de la cinta).
  const onPointerDown = (event: React.PointerEvent) => {
    const state = sim.current
    const end = state.points[state.points.length - 1]
    const element = container.current
    if (!end || !element || event.button > 0) return
    event.preventDefault()
    const toLocal = (clientX: number, clientY: number) => {
      const rect = element.getBoundingClientRect()
      return { x: clientX - rect.left, y: clientY - rect.top }
    }
    const point = toLocal(event.clientX, event.clientY)
    const { drag } = state
    Object.assign(drag, {
      active: true,
      offsetX: point.x - end.x,
      offsetY: point.y - end.y,
      targetX: end.x,
      targetY: end.y,
      startX: point.x,
      startY: point.y,
      startTime: performance.now(),
      moved: false,
    })

    const onMove = (moveEvent: PointerEvent) => {
      const current = toLocal(moveEvent.clientX, moveEvent.clientY)
      drag.targetX = current.x - drag.offsetX
      drag.targetY = current.y - drag.offsetY
      if (Math.hypot(current.x - drag.startX, current.y - drag.startY) > 6) drag.moved = true
    }
    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      if (!drag.active) return
      drag.active = false
      // Clic corto sin arrastrar: voltear
      if (!drag.moved && performance.now() - drag.startTime < 400) {
        state.twistTarget = Math.round(state.twist / 180) * 180 + 180
      }
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
  }

  return (
    <div ref={container} className={`pointer-events-none select-none ${className}`}>
      {/* Cinta */}
      <svg className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <path id={strapId} ref={strapShadow} />
        </defs>
        <use href={`#${strapId}`} stroke="rgba(0,0,0,0.35)" strokeWidth="20" fill="none" transform="translate(3 5)" />
        {/* Borde más oscuro + cuerpo lima: da sensación de cinta tejida con volumen */}
        <path ref={strap} stroke="#a3b62c" strokeWidth="18" fill="none" strokeLinecap="round" />
        <use href={`#${strapId}`} stroke="#dcec6b" strokeWidth="14" fill="none" strokeLinecap="round" />
        <use
          href={`#${strapId}`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="3"
          fill="none"
          transform="translate(-3 0)"
        />
        <text fontSize="9" fontWeight="700" letterSpacing="2" fill="#13222c" dy="3" fontFamily="var(--font-display)">
          <textPath href={`#${strapId}`} startOffset="6">
            LUIS QUISHPE • FULL STACK • LUIS QUISHPE • FULL STACK • LUIS QUISHPE •
          </textPath>
        </text>
      </svg>

      {/* Carnet */}
      <div
        ref={card}
        className="absolute left-0 top-0 pointer-events-auto touch-none cursor-grab active:cursor-grabbing"
        style={{ width: desktop ? 260 : 220, transformOrigin: "50% 0", willChange: "transform" }}
        onPointerDown={onPointerDown}
        data-cursor="drag"
        role="img"
        aria-label={`${site.name} — ${site.role}`}
      >
        {/* Pinza metálica */}
        <span className="absolute left-1/2 -top-4 -translate-x-1/2 z-10 flex flex-col items-center" aria-hidden="true">
          <span className="relative grid place-items-center w-7 h-7 rounded-[6px] border border-neutral-500/50 bg-[linear-gradient(160deg,#fafafa_0%,#c9cbcf_45%,#8d9096_100%)] shadow-[0_3px_6px_rgba(0,0,0,0.45)]">
            <span className="w-2 h-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff,#7c7f85)] shadow-[inset_0_0_1px_rgba(0,0,0,0.6)]" />
          </span>
          <span className="-mt-px w-3.5 h-2.5 rounded-b-sm bg-[linear-gradient(180deg,#b9bcc1,#7d8086)]" />
        </span>

        <div ref={inner} className="relative [transform-style:preserve-3d]" style={{ aspectRatio: "5 / 7" }}>
          {/* Canto del carnet: capas entre el frente y el reverso que dan grosor */}
          {[-1.2, -0.4, 0.4, 1.2].map((z) => (
            <div
              key={z}
              className="absolute inset-0 rounded-2xl bg-[#c9ccc0]"
              style={{ transform: `translateZ(${z}px)` }}
              aria-hidden="true"
            />
          ))}

          {/* Frente */}
          <div
            className="badge-face absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden bg-[#f3f4ee] text-[#0d1a22] flex flex-col"
            style={{ transform: "translateZ(2px)" }}
          >
            <div className="h-2 bg-[#dcec6b]" />
            {/* Ranura perforada por donde pasa la pinza */}
            <span className="mx-auto mt-2 w-12 h-2.5 rounded-full bg-[#13222c]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.8)]" />
            <div className="flex items-center justify-between px-4 pt-2">
              <span className="grid place-items-center w-8 h-8 rounded-md bg-[#13222c] text-[#dcec6b] font-display text-xs font-bold">
                LQ
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0d1a22]/55">{text.id}</span>
            </div>
            {/* Foto sin fondo sobre un degradado de la paleta */}
            <div className="relative mx-4 mt-3 aspect-square rounded-xl overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#eef6a6_0%,#c3d64a_55%,#7d8d12_100%)]">
              {/* Foto recortada a 900x900 desde el original; se sirve tal cual (sin recompresión) para que se vea nítida */}
              <Image
                src="/badge-photo.webp"
                alt=""
                fill
                unoptimized
                draggable={false}
                className="object-cover pointer-events-none"
                priority
              />
            </div>
            <div className="px-4 pt-3">
              <p className="font-display text-xl font-bold leading-tight tracking-tight">{site.name}</p>
              <p className="text-[13px] text-[#0d1a22]/70">{site.role}</p>
            </div>
            <div className="mt-auto px-4 pb-3 flex items-end justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t("home.available")}
              </span>
              {/* Código de barras decorativo */}
              <span
                className="h-6 w-20 opacity-70"
                style={{
                  background:
                    "repeating-linear-gradient(90deg,#0d1a22 0 2px,transparent 2px 4px,#0d1a22 4px 5px,transparent 5px 8px)",
                }}
              />
            </div>
            <span className="badge-gloss" aria-hidden="true" />
          </div>

          {/* Reverso: descripción */}
          <div
            className="badge-face absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden bg-[#13222c] text-white ring-1 ring-white/10 flex flex-col"
            style={{ transform: "rotateY(180deg) translateZ(2px)" }}
          >
            <div className="h-2 bg-[#dcec6b]" />
            <span className="mx-auto mt-2 w-12 h-2.5 rounded-full bg-black/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.12)]" />
            <div className="px-4 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#dcec6b]">{text.about}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/80">{t("home.description")}</p>
            </div>
            <div className="mt-auto px-4 pb-3 flex items-center justify-between text-[10px] text-white/55">
              <span>{text.study}</span>
              <span className="font-display font-bold text-[#dcec6b]">LQ</span>
            </div>
            <span className="badge-gloss" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Indicación (en escritorio va debajo del selector de figuras, en hero.tsx) */}
      {!desktop && <p className="absolute inset-x-0 bottom-1 text-center text-xs text-white/45">{text.hint}</p>}
    </div>
  )
}
