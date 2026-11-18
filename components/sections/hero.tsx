"use client"

import { useI18n } from "@/components/i18n-provider"
import { site } from "@/lib/site"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { ArrowRight, Github, Linkedin, MapPin } from "lucide-react"
import { useState } from "react"
import type { ShapeVariant } from "@/components/hero-scene"
import { IdBadge, badgeTexts } from "@/components/id-badge"
import { CvViewer } from "@/components/cv-viewer"
import { projects } from "@/components/sections/projects"
import { techCount } from "@/components/sections/skills"
import "../../styles/hero.css"

// La escena 3D se carga aparte para no retrasar el texto del hero
const HeroScene = dynamic(() => import("@/components/hero-scene"), { ssr: false })

// Selector de la figura 3D del hero. Por defecto se carga "Red"; el visitante puede cambiarla.
const shapeOptions: { id: ShapeVariant; label: { en: string; es: string } }[] = [
  { id: "blob", label: { en: "Blob", es: "Blob" } },
  { id: "globe", label: { en: "Globe", es: "Globo" } },
  { id: "network", label: { en: "Network", es: "Red" } },
  { id: "wave", label: { en: "Wave", es: "Onda" } },
]

function ShapePicker({
  value,
  onChange,
  className = "",
}: {
  value: ShapeVariant
  onChange: (value: ShapeVariant) => void
  className?: string
}) {
  const { language } = useI18n()
  return (
    <div
      role="group"
      aria-label="3D shape"
      className={`inline-flex gap-1 p-1 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md ${className}`}
    >
      {shapeOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === option.id ? "bg-[#dcec6b] text-neutral-950" : "text-white/75 hover:text-white hover:bg-white/10"
          }`}
        >
          {option.label[language]}
        </button>
      ))}
    </div>
  )
}

export function Hero() {
  const { t, language } = useI18n()
  const [shape, setShape] = useState<ShapeVariant>("network")

  const stats = [
    { value: String(projects.length), label: t("home.stat.projects") },
    { value: String(techCount), label: t("home.stat.tech") },
    { value: t("home.stat.awardValue"), label: t("home.stat.award") },
  ]

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden min-h-[min(100svh,1100px)] flex items-center bg-[#13222c] text-white pt-24 pb-12 lg:pb-0 px-4 sm:px-6 lg:px-8"
      aria-label="Hero section"
    >
      {/* Fondo: degradados + escena 3D */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_78%_50%,rgba(220,236,107,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_90%,rgba(91,111,123,0.25),transparent_70%)]" />
        <HeroScene variant={shape} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#13222c]" />
      </div>

      {/* Carnet (escritorio): cuelga desde arriba en la mitad derecha */}
      <IdBadge desktop className="hidden lg:block absolute inset-y-0 left-1/2 right-0 z-10" />

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
        {/* Carnet (móvil): arriba del texto */}
        <IdBadge className="relative lg:hidden h-[460px] -mt-24" />

        {/* Texto (izquierda); la figura 3D y el carnet quedan a la derecha */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="min-w-0 lg:py-16 text-center lg:text-left"
        >
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/15 text-xs font-medium text-white/85">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              {t("home.available")}
            </span>
            <span className="inline-flex items-center gap-1 text-white/60">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Ecuador
            </span>
          </div>

          {/* Título: el nombre y la foto están en el carnet */}
          <h1 className="relative inline-block text-5xl sm:text-7xl lg:text-[5.25rem] xl:text-8xl font-bold tracking-tight leading-[0.95]">
            <span className="sr-only">{site.name}, </span>
            Full Stack
            <br />
            <span className="relative inline-block bg-gradient-to-r from-[#eef6a6] via-[#dcec6b] to-[#c3d64a] bg-clip-text text-transparent">
              Developer.
              {/* Subrayado dibujado a mano */}
              <svg
                className="absolute left-0 -bottom-3 w-full h-4 text-[#dcec6b]"
                viewBox="0 0 300 16"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 11C50 3 98 3 150 8s98 6 147-3"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <div className="words mt-8 font-mono text-sm sm:text-base text-[#dcec6b]" aria-hidden="true">
            <span className="word">&gt; {t("home.description1")}</span>
            <span className="word">&gt; {t("home.description3")}</span>
            <span className="word">&gt; {t("home.description2")}</span>
            <span className="word">&gt; {t("home.description4")}</span>
          </div>

          <dl className="mt-7 flex flex-wrap gap-y-4 justify-center lg:justify-start divide-x divide-white/15">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 first:pl-0 last:pr-0 flex flex-col-reverse">
                <dt className="text-xs sm:text-sm text-white/60">{stat.label}</dt>
                <dd className="text-3xl sm:text-4xl font-bold tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#dcec6b] text-neutral-950 text-lg font-semibold shadow-lg shadow-[#dcec6b]/25 hover:bg-[#e8f38f] transition-colors"
            >
              {t("home.cta")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-xl border border-white/25 text-white text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              {t("contact.title")}
            </a>
            <CvViewer className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#dcec6b]/40 text-[#dcec6b] text-lg font-semibold hover:bg-[#dcec6b]/10 transition-colors" />
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-white/25 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-white/25 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          {/* Selector de figura (móvil) */}
          <ShapePicker value={shape} onChange={setShape} className="mt-6 lg:hidden" />
        </motion.div>

        {/* Espacio para la figura 3D (se dibuja en el fondo) + selector de figura debajo */}
        <div className="hidden lg:flex min-h-[600px] items-end justify-center pb-6">
          <div className="flex flex-col items-center gap-3">
            <ShapePicker value={shape} onChange={setShape} />
            <p className="text-xs text-white/45">{badgeTexts[language].hint}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
