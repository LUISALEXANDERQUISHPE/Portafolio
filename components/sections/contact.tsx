"use client"

import type React from "react"

import { useI18n } from "@/components/i18n-provider"
import { site } from "@/lib/site"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Check, Mail, MapPin, PenLine, Phone, X } from "lucide-react"
import emailjs from "@emailjs/browser"

const texts = {
  en: {
    question: "Let's work together",
    hint: "Click the envelope to write to me",
    open: "Write me a message",
    to: "To",
    send: "Send message",
    discard: "Discard message",
    sentTitle: "Message sent!",
    sentText: "Thanks for reaching out. I'll read it and reply to your email within 24–48 hours.",
    again: "Send another message",
  },
  es: {
    question: "¿Trabajamos juntos?",
    hint: "Haz clic en el sobre para escribirme",
    open: "Escribirme un mensaje",
    to: "Para",
    send: "Enviar mensaje",
    discard: "Descartar mensaje",
    sentTitle: "¡Mensaje enviado!",
    sentText: "Gracias por escribirme. Lo leeré y te responderé a tu correo en 24–48 horas.",
    again: "Enviar otro mensaje",
  },
}

// closed: sobre cerrado · opening: se abre la solapa · writing: la carta está fuera
// inserting: la carta vuelve al sobre · sealing: se cierra y se sella · flying: sale volando · done: confirmación
// tearing: la carta pasa por una trituradora y luego el sobre se cierra
type Phase = "closed" | "opening" | "writing" | "tearing" | "inserting" | "sealing" | "flying" | "done"
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const paperLabel = "block font-mono text-[11px] uppercase tracking-wider text-[#13222c]/55"
const paperText = "text-[16px] text-[#13222c]"
const LINE = 32 // alto de cada renglón del mensaje
// Trituradora: cantidad de tiras y duración del paso de la carta (ms)
const STRIPS = 30
const SHRED_TIME = 1300
const MAX_LINES = 4 // renglones visibles del mensaje

// Campo de una línea: la raya de abajo se dibuja a medida que se escribe (mide lo escrito)
function PaperInput({
  id,
  label,
  value,
  inputRef,
  ...props
}: {
  id: string
  label: string
  value: string
  inputRef?: React.Ref<HTMLInputElement>
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const mirror = useRef<HTMLSpanElement>(null)
  const [textWidth, setTextWidth] = useState(0)
  const [focused, setFocused] = useState(false)

  useLayoutEffect(() => {
    setTextWidth(mirror.current?.offsetWidth ?? 0)
  }, [value])

  const width = value ? textWidth + 8 : focused ? 28 : 0
  return (
    <div>
      <label htmlFor={id} className={paperLabel}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={id}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent border-0 px-0 py-1.5 ${paperText} placeholder:text-[#13222c]/30 focus:outline-none focus:ring-0`}
          {...props}
        />
        <span
          ref={mirror}
          aria-hidden="true"
          className={`invisible absolute left-0 top-0 whitespace-pre py-1.5 ${paperText}`}
        >
          {value}
        </span>
        <span
          aria-hidden="true"
          className="absolute left-0 bottom-0 h-[1.5px] max-w-full rounded-full bg-[#13222c]/45 transition-[width] duration-200 ease-out"
          style={{ width }}
        />
      </div>
    </div>
  )
}

// Mensaje: por cada renglón escrito aparece una línea nueva
function PaperMessage({
  label,
  value,
  ...props
}: { label: string; value: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const area = useRef<HTMLTextAreaElement>(null)
  const [lines, setLines] = useState(0)
  const [focused, setFocused] = useState(false)

  useLayoutEffect(() => {
    const element = area.current
    if (!element) return
    element.style.height = "auto"
    const height = element.scrollHeight
    element.style.height = `${Math.min(Math.max(height, LINE), LINE * MAX_LINES)}px`
    setLines(value ? Math.min(MAX_LINES, Math.round(height / LINE)) : 0)
  }, [value])

  return (
    <div>
      <label htmlFor="message" className={paperLabel}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <div className="relative mt-1">
        <textarea
          ref={area}
          id="message"
          name="message"
          value={value}
          rows={1}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`no-scrollbar block w-full resize-none bg-transparent border-0 p-0 ${paperText} placeholder:text-[#13222c]/30 focus:outline-none focus:ring-0`}
          style={{ lineHeight: `${LINE}px` }}
          {...props}
        />
        {Array.from({ length: lines }, (_, index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            className="absolute left-0 right-0 h-[1.5px] origin-left rounded-full bg-[#13222c]/45 pointer-events-none"
            style={{ top: (index + 1) * LINE - 4 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        ))}
        {!value && focused && (
          <span
            aria-hidden="true"
            className="absolute left-0 h-[1.5px] w-7 bg-[#13222c]/45"
            style={{ top: LINE - 4 }}
          />
        )}
      </div>
    </div>
  )
}

// Medidas del escenario según el ancho y el alto de la pantalla (la carta abierta debe caber en la vista)
function useStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(640)
  const [viewHeight, setViewHeight] = useState(900)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.min(640, entry.contentRect.width)))
    observer.observe(element)
    const onResize = () => setViewHeight(window.innerHeight)
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const envelopeHeight = Math.min(Math.round(width * 0.58), 330)
  // Menú (64) + botones de abajo (~90) + parte visible del sobre (~170)
  const letterHeight = Math.round(Math.min(520, Math.max(430, viewHeight - 330)))
  const letterTop = 8
  const tuck = 76 // parte de la carta que queda dentro del sobre cuando está fuera
  const openTop = letterTop + letterHeight - tuck // posición del sobre con la carta fuera
  const height = openTop + envelopeHeight + 16
  const closedTop = Math.round((height - envelopeHeight) / 2) + 90
  return { ref, width, envelopeHeight, letterHeight, letterTop, openTop, height, closedTop }
}

export function Contact() {
  const { t, language } = useI18n()
  const text = texts[language]
  const reduceMotion = useReducedMotion()
  const stage = useStage()
  const nameInput = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [phase, setPhase] = useState<Phase>("closed")
  const [error, setError] = useState(false)

  const flapOpen = phase === "opening" || phase === "writing" || phase === "inserting" || phase === "tearing"
  const envelopeDown = phase === "writing" || phase === "inserting" || phase === "tearing"
  const letterOut = phase === "writing"
  const tearing = phase === "tearing"
  const sealShown = phase === "closed" || phase === "sealing" || phase === "flying" || phase === "done"
  const ms = (value: number) => (reduceMotion ? 0 : value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openLetter = async () => {
    if (phase !== "closed") return
    setError(false)
    setPhase("opening")
    // Acomoda la vista para que la carta abierta no quede debajo del menú
    const stageTop = stage.ref.current?.getBoundingClientRect().top ?? 0
    window.scrollTo({ top: window.scrollY + stageTop - 72, behavior: reduceMotion ? "auto" : "smooth" })
    await wait(ms(550))
    setPhase("writing")
    await wait(ms(1000))
    nameInput.current?.focus({ preventScroll: true })
  }

  // X: la carta se parte en dos, el sobre se cierra y se borra lo escrito
  const tearLetter = async () => {
    if (phase !== "writing") return
    setError(false)
    setPhase("tearing")
    await wait(ms(SHRED_TIME + 700))
    setFormData({ name: "", email: "", message: "" })
    setPhase("closed")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase !== "writing") return
    setError(false)

    // El correo se envía mientras la carta vuelve al sobre
    const sending = emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: site.fullName,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    )

    setPhase("inserting")
    try {
      await Promise.all([sending, wait(ms(900))])
    } catch (err) {
      // Si falla, la carta vuelve a salir con lo escrito para intentarlo de nuevo
      console.error("Error sending email:", err)
      setError(true)
      setPhase("writing")
      return
    }
    setPhase("sealing")
    await wait(ms(1100))
    setPhase("flying")
    await wait(ms(1000))
    setPhase("done")
    setFormData({ name: "", email: "", message: "" })
  }

  const { envelopeHeight: envH, letterHeight, letterTop, openTop, closedTop } = stage
  const flapHeight = Math.round(envH * 0.62)
  const shredLine = letterTop + letterHeight - 70 // altura de la trituradora (justo sobre la boca del sobre)

  // Copia de la carta (sin campos) para la animación de la trituradora
  const LetterCopy = () => (
    <div className="w-full h-full rounded-lg bg-[#f6f3ea] text-[#13222c] px-6 sm:px-8 pt-5">
      <p className={paperLabel}>{text.to}</p>
      <p className="font-display text-2xl font-bold tracking-tight mb-4">{site.name}</p>
      <div className="space-y-4">
        {[
          [t("contact.name"), formData.name],
          [t("contact.email"), formData.email],
          [t("contact.message"), formData.message],
        ].map(([label, value]) => (
          <div key={label}>
            <p className={paperLabel}>{label}</p>
            <p className={`py-1.5 ${paperText} line-clamp-4 break-words`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
  const wrapperHeight = 2000 // contenedor alto que recorta la carta solo por abajo (dentro del sobre)

  const groupAnimate =
    phase === "flying"
      ? { x: 240, y: -360, rotate: -14, scale: 0.5, opacity: 0 }
      : phase === "done"
        ? { x: 0, y: 0, rotate: 0, scale: 0.9, opacity: 0 }
        : { x: 0, y: envelopeDown ? openTop - closedTop : 0, rotate: 0, scale: 1, opacity: 1 }

  return (
    <section
      id="contact"
      className="min-h-svh flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8"
      aria-label="Contact section"
    >
      <div className="max-w-6xl mx-auto w-full">
        <form onSubmit={handleSubmit} aria-label="Contact form">
          <div ref={stage.ref} className="relative mx-auto w-full max-w-[640px]" style={{ height: stage.height }}>
            {/* Pregunta sobre el sobre cerrado */}
            <AnimatePresence>
              {phase === "closed" && (
                <motion.div
                  className="absolute left-1/2 w-[min(92vw,1000px)] ml-[calc(min(92vw,1000px)/-2)] text-center"
                  // Anclada por abajo, justo encima del sobre: si la frase ocupa más líneas, crece hacia arriba
                  style={{ bottom: stage.height - closedTop + 28 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Título de la sección: aparece letra por letra al llegar (lo dispara el título completo) */}
                  <motion.h2
                    className="font-impact uppercase text-[13vw] sm:text-7xl lg:text-8xl leading-[0.88] text-foreground"
                    aria-label={text.question}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {(() => {
                      let letter = 0 // índice global de la letra, para escalonar la aparición
                      const words = text.question.split(" ")
                      return words.map((word, wordIndex) => (
                        // Cada palabra no se parte al cambiar de línea; cada letra sube desde su recorte
                        <span
                          key={`${language}-${wordIndex}`}
                          aria-hidden="true"
                          className={`inline-block whitespace-nowrap overflow-hidden align-bottom pb-[0.14em] -mb-[0.1em] mr-[0.22em] last:mr-0 ${
                            wordIndex === words.length - 1 ? "text-[var(--brand)]" : ""
                          }`}
                        >
                          {Array.from(word).map((char) => {
                            const order = letter++
                            return (
                              <motion.span
                                key={order}
                                className="inline-block"
                                variants={{
                                  hidden: { y: "110%", opacity: 0 },
                                  show: {
                                    y: "0%",
                                    opacity: 1,
                                    transition: {
                                      duration: ms(550) / 1000,
                                      ease: [0.22, 1, 0.36, 1],
                                      delay: reduceMotion ? 0 : order * 0.045,
                                    },
                                  },
                                }}
                              >
                                {char}
                              </motion.span>
                            )
                          })}
                        </span>
                      ))
                    })()}
                  </motion.h2>
                  <motion.p
                    className="mt-4 text-sm sm:text-base text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduceMotion ? 0 : 1 }}
                  >
                    {text.hint}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 [perspective:1600px]">
              <motion.div
                className="absolute inset-x-0 [transform-style:preserve-3d]"
                style={{ top: closedTop, height: envH }}
                animate={groupAnimate}
                transition={
                  phase === "flying"
                    ? { duration: ms(1000) / 1000, ease: [0.55, 0, 0.75, 0] }
                    : { duration: ms(900) / 1000, ease: [0.65, 0, 0.35, 1] }
                }
              >
                {/* Sombra */}
                <div className="absolute -bottom-7 left-[8%] right-[8%] h-10 rounded-[50%] bg-black/35 blur-xl" />

                {/* Parte de atrás del sobre */}
                <div
                  className="absolute inset-0 rounded-xl bg-[#1b2f3b] ring-1 ring-white/5"
                  style={{ transform: "translateZ(-4px)" }}
                />

                {/* Solapa: cerrada (encima) o abierta (hacia arriba, detrás de la carta) */}
                <motion.div
                  className="absolute inset-x-0 top-0 origin-top"
                  style={{ height: flapHeight }}
                  initial={false}
                  animate={flapOpen ? { rotateX: 180, z: -3 } : { rotateX: 0, z: 6 }}
                  transition={{ duration: ms(600) / 1000, ease: [0.65, 0, 0.35, 1] }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-b from-[#2f4d5e] to-[#243d4d]"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                </motion.div>

                {/* Carta: sale por arriba; lo que queda abajo se recorta dentro del sobre */}
                <div
                  className="absolute left-[5%] right-[5%] overflow-hidden"
                  style={{ bottom: 10, height: wrapperHeight, transform: "translateZ(1px)" }}
                >
                  <motion.div
                    className="absolute inset-x-0 rounded-lg bg-[#f6f3ea] text-[#13222c] shadow-2xl px-6 sm:px-8 pt-5"
                    style={{ top: wrapperHeight - envH + 26, height: letterHeight }}
                    initial={false}
                    animate={{ y: letterOut || tearing ? letterTop - openTop - 16 : 0, opacity: tearing ? 0 : 1 }}
                    transition={{
                      y: { duration: ms(850) / 1000, ease: [0.65, 0, 0.35, 1], delay: letterOut ? ms(150) / 1000 : 0 },
                      opacity: { duration: 0 },
                    }}
                  >
                    {/* Sello postal */}
                    <div className="absolute top-5 right-5 rotate-6" aria-hidden="true">
                      <div className="envelope-stamp grid place-items-center w-16 h-20 bg-[#dcec6b] text-[#13222c]">
                        <span className="font-display text-lg font-bold leading-none">LQ</span>
                        <span className="font-mono text-[9px] -mt-3">{new Date().getFullYear()}</span>
                      </div>
                      <svg
                        className="absolute -left-7 top-6 w-16 h-10 text-[#13222c]/35"
                        viewBox="0 0 64 40"
                        fill="none"
                      >
                        <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M30 14c6-4 10 4 16 0s10 4 16 0M30 20c6-4 10 4 16 0s10 4 16 0M30 26c6-4 10 4 16 0s10 4 16 0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    {/* X: romper la carta */}
                    <button
                      type="button"
                      onClick={tearLetter}
                      disabled={phase !== "writing"}
                      aria-label={text.discard}
                      title={text.discard}
                      className="absolute top-4 right-[6.5rem] grid place-items-center w-8 h-8 rounded-full text-[#13222c]/45 hover:text-[#13222c] hover:bg-[#13222c]/10 transition-colors"
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>

                    <p className={paperLabel}>{text.to}</p>
                    <p className="font-display text-2xl font-bold tracking-tight mb-4">{site.name}</p>

                    <div className="space-y-4 pr-1">
                      <PaperInput
                        inputRef={nameInput}
                        id="name"
                        label={t("contact.name")}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        disabled={phase !== "writing"}
                        placeholder={t("contact.placeName")}
                      />
                      <PaperInput
                        id="email"
                        type="email"
                        label={t("contact.email")}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        disabled={phase !== "writing"}
                        placeholder={t("contact.placeEmail")}
                      />
                      <PaperMessage
                        label={t("contact.message")}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={phase !== "writing"}
                        placeholder={t("contact.placeMessage")}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Frente del sobre (bolsillo en V) */}
                <div className="absolute inset-0" style={{ transform: "translateZ(3px)" }}>
                  <div
                    className="w-full h-full rounded-b-xl bg-gradient-to-br from-[#284352] via-[#22394a] to-[#1b2f3b]"
                    style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }}
                  />
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M0 0 L50 55 L100 0" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" fill="none" />
                    <path d="M0 100 L42 50 M100 100 L58 50" stroke="rgba(0,0,0,0.25)" strokeWidth="0.4" fill="none" />
                  </svg>
                  <p className="absolute bottom-4 left-5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/35">
                    {site.location}
                  </p>
                </div>

                {/* Sello de lacre (en la punta de la solapa) */}
                <motion.div
                  className="absolute left-1/2 -ml-8 grid place-items-center w-16 h-16 rounded-full bg-[radial-gradient(circle_at_35%_30%,#eef6a6,#c3d64a_45%,#8a9b1a)] text-[#13222c] font-display font-bold shadow-[0_6px_14px_rgba(0,0,0,0.45),inset_0_-3px_6px_rgba(0,0,0,0.25)]"
                  style={{ top: flapHeight - 40, z: 8 }}
                  initial={false}
                  animate={sealShown ? { scale: 1, opacity: 1, rotate: -8 } : { scale: 1.6, opacity: 0, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  aria-hidden="true"
                >
                  LQ
                  {phase === "closed" && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-[#dcec6b] animate-ping" />
                  )}
                </motion.div>

                {/* Todo el sobre cerrado es el botón para abrir */}
                {phase === "closed" && (
                  <button
                    type="button"
                    onClick={openLetter}
                    aria-label={text.open}
                    data-cursor="open"
                    className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                    style={{ transform: "translateZ(10px)" }}
                  />
                )}
              </motion.div>
            </div>

            {/* Sello de lacre en el sobre abierto: es el botón para sellar y enviar */}
            <AnimatePresence>
              {(phase === "writing" || phase === "inserting") && (
                <motion.div
                  className="absolute inset-x-0 z-30 flex flex-col items-center pointer-events-none"
                  style={{ top: openTop + Math.round(envH * 0.5) - 36 }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                >
                  <button
                    type="submit"
                    disabled={phase !== "writing"}
                    aria-label={text.send}
                    data-cursor="send"
                    className="group pointer-events-auto relative grid place-items-center w-[72px] h-[72px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#eef6a6,#c3d64a_45%,#8a9b1a)] text-[#13222c] font-display text-lg font-bold shadow-[0_8px_18px_rgba(0,0,0,0.5),inset_0_-4px_8px_rgba(0,0,0,0.25)] transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[#22394a] focus-visible:ring-[var(--brand)] disabled:cursor-wait"
                  >
                    {/* Borde irregular del lacre */}
                    <span className="absolute -inset-1.5 rounded-full bg-[#b4c63a]/60 -z-10 [clip-path:polygon(50%_0,62%_6%,75%_3%,82%_15%,95%_20%,94%_35%,100%_50%,94%_64%,96%_80%,82%_85%,76%_97%,62%_94%,50%_100%,37%_94%,24%_97%,18%_85%,4%_80%,6%_64%,0_50%,6%_35%,4%_20%,17%_15%,25%_3%,38%_6%)]" />
                    {phase === "writing" && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-[#dcec6b] animate-ping" />
                    )}
                    LQ
                  </button>
                  <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                    {phase === "writing" ? text.send : t("contact.sending")}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trituradora en la boca del sobre: la carta baja y sale en tiras que caen */}
            <AnimatePresence>
              {tearing && (
                <motion.div
                  key="shredder"
                  aria-hidden="true"
                  className="absolute inset-0 z-20 pointer-events-none"
                  exit={{ opacity: 0 }}
                >
                  {/* Parte de la carta que aún no entra (recortada en la línea de corte) */}
                  <div className="absolute left-[5%] right-[5%] top-0 overflow-hidden" style={{ height: shredLine }}>
                    <motion.div
                      className="absolute inset-x-0"
                      style={{ top: letterTop, height: letterHeight }}
                      initial={{ y: 0 }}
                      animate={{ y: letterHeight }}
                      transition={{ duration: ms(SHRED_TIME) / 1000, ease: "linear", delay: 0.15 }}
                    >
                      <LetterCopy />
                    </motion.div>
                  </div>

                  {/* Tiras: cada una muestra su franja de la carta y cae balanceándose */}
                  <div className="absolute left-[5%] right-[5%]" style={{ top: shredLine, height: letterHeight + 200 }}>
                    {Array.from({ length: STRIPS }, (_, index) => (
                      <motion.div
                        key={index}
                        className="absolute top-0 overflow-hidden"
                        style={{
                          left: `calc(${(index / STRIPS) * 100}% + 1.5px)`,
                          width: `calc(${100 / STRIPS}% - 3px)`,
                          height: letterHeight,
                          transformOrigin: "50% 0",
                        }}
                        initial={{ rotate: 0, y: 0, opacity: 1 }}
                        animate={{
                          rotate: [0, (((index * 37) % 7) - 3) * 0.5, (((index * 53) % 9) - 4) * 0.7],
                          y: [0, 0, 160 + (index % 4) * 30],
                          opacity: [1, 1, 0],
                        }}
                        transition={{ duration: ms(SHRED_TIME + 600) / 1000, times: [0, 0.7, 1], delay: 0.15 }}
                      >
                        <motion.div
                          className="absolute top-0"
                          style={{ left: `${-index * 100}%`, width: `${STRIPS * 100}%`, height: letterHeight }}
                          initial={{ y: -letterHeight }}
                          animate={{ y: 0 }}
                          transition={{ duration: ms(SHRED_TIME) / 1000, ease: "linear", delay: 0.15 }}
                        >
                          <LetterCopy />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Máquina trituradora */}
                  <motion.div
                    className="absolute left-[2%] right-[2%] h-10 rounded-xl bg-gradient-to-b from-[#2a3f4c] to-[#0d1a22] shadow-[0_10px_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex items-center justify-end px-4"
                    style={{ top: shredLine - 20, transformOrigin: "50% 50%" }}
                    initial={{ scaleX: 0.3, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1, x: [0, -1.5, 1.5, -1, 1, 0] }}
                    transition={{
                      scaleX: { type: "spring", stiffness: 300, damping: 20 },
                      opacity: { duration: 0.15 },
                      x: { duration: 0.18, repeat: Infinity, delay: 0.15 },
                    }}
                  >
                    {/* Ranura con cuchillas */}
                    <span className="absolute left-5 right-10 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-black/70 bg-[repeating-linear-gradient(90deg,#3d5463_0_3px,transparent_3px_7px)]" />
                    <span className="relative w-2.5 h-2.5 rounded-full bg-[#dcec6b] shadow-[0_0_10px_#dcec6b] animate-pulse" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirmación */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                >
                  <span className="grid place-items-center w-16 h-16 rounded-full bg-[var(--brand)] text-[#13222c] mb-5">
                    <Check className="w-8 h-8" aria-hidden="true" />
                  </span>
                  <p className="font-display text-3xl font-bold tracking-tight text-foreground">{text.sentTitle}</p>
                  <p className="mt-2 text-muted-foreground max-w-xs">{text.sentText}</p>
                  <button
                    type="button"
                    onClick={() => setPhase("closed")}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-medium hover:border-[var(--brand)] transition-colors"
                  >
                    <PenLine className="w-4 h-4" aria-hidden="true" />
                    {text.again}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 mx-auto max-w-[640px] p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm"
            >
              {t("contact.error")}
            </div>
          )}
        </form>

        {/* Datos de contacto */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3 border-t border-border pt-10">
          <div className="flex gap-4">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-primary/10 text-primary">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{t("contact.email")}</h3>
              {site.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="block truncate text-muted-foreground hover:text-primary transition-colors"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-primary/10 text-primary">
              <Phone className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t("contact.phone")}</h3>
              {site.phones.map((phone) => (
                <a
                  key={phone.tel}
                  href={`tel:${phone.tel}`}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {phone.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-primary/10 text-primary">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t("contact.address")}</h3>
              <p className="text-muted-foreground">{site.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
