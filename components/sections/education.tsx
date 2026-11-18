"use client"

import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import { educationItems, type ItemType } from "@/components/sections/education-data"
import { motion, useScroll, useSpring } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  MapPin,
  Trophy,
  Users,
  ZoomIn,
} from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

type Filter = "all" | "course" | "event"

const icons = { degree: GraduationCap, course: BookOpen, event: Users, award: Trophy }

const labels = {
  en: {
    all: "All",
    course: "Courses",
    event: "Congresses",
    award: "Award",
    featured: "Featured achievement",
    view: "View certificate",
    open: "Open in a new tab",
    previous: "Previous certificate",
    next: "Next certificate",
  },
  es: {
    all: "Todos",
    course: "Cursos",
    event: "Congresos",
    award: "Logro",
    featured: "Logro destacado",
    view: "Ver certificado",
    open: "Abrir en otra pestaña",
    previous: "Certificado anterior",
    next: "Certificado siguiente",
  },
}

const degree = educationItems.find((item) => item.type === "degree")!
const award = educationItems.find((item) => item.type === "award")!
const timelineItems = educationItems.filter((item) => item.type === "course" || item.type === "event")
const count = (type: ItemType) => educationItems.filter((item) => item.type === type).length

export function Education() {
  const { t, language } = useI18n()
  const [filter, setFilter] = useState<Filter>("all")
  // Título (en inglés) del elemento cuyo certificado está abierto
  const [openCertificate, setOpenCertificate] = useState<string | null>(null)
  const timelineRef = useRef<HTMLOListElement>(null)

  // La línea se va rellenando de color a medida que se baja por la lista
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 75%", "end 55%"] })
  const lineFill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  const text = labels[language]
  const visibleItems = filter === "all" ? timelineItems : timelineItems.filter((item) => item.type === filter)
  // Certificados que se pueden recorrer con las flechas del visor
  const certificates = visibleItems.filter((item) => item.certificate)
  const certificateIndex = certificates.findIndex((item) => item.title.en === openCertificate)
  const current = certificateIndex >= 0 ? certificates[certificateIndex] : null
  const stepCertificate = (direction: number) => {
    const next = (certificateIndex + direction + certificates.length) % certificates.length
    setOpenCertificate(certificates[next].title.en)
  }
  const filters: { id: Filter; label: string; total: number }[] = [
    { id: "all", label: text.all, total: timelineItems.length },
    { id: "course", label: text.course, total: count("course") },
    { id: "event", label: text.event, total: count("event") },
  ]
  const stats = [
    { value: count("course"), label: text.course },
    { value: count("event"), label: text.event },
    { value: count("award"), label: text.award },
  ]

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/50" aria-label="Education section">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="03" title={t("education.title")} description={t("education.description")} />

        {/* Destacados: carrera y logro */}
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5 mb-16">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-9"
          >
            <GraduationCap
              className="absolute -right-6 -bottom-8 w-48 h-48 text-foreground/[0.04]"
              strokeWidth={1}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 mb-5 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-alt)]/15 text-[var(--brand-alt)] px-3 py-1 uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  {t("education.degree")}
                </span>
                <span className="text-muted-foreground">{degree.year[language]}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                {degree.title[language]}
              </h3>
              <p className="flex items-center gap-1.5 text-foreground/80 font-medium mb-3">
                <MapPin className="w-4 h-4 text-[var(--brand-alt)]" aria-hidden="true" />
                {degree.institution[language]}
              </p>
              <p className="text-muted-foreground max-w-md">{degree.description?.[language]}</p>

              <dl className="mt-8 flex divide-x divide-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-6 first:pl-0 flex flex-col-reverse">
                    <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                    <dd className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="education-award relative overflow-hidden rounded-3xl p-7 sm:p-9 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[var(--brand)] text-neutral-950 shadow-lg shadow-[var(--brand)]/30">
                <Trophy className="w-7 h-7" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm text-muted-foreground">{award.year[language]}</span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--brand)] mb-2">{text.featured}</p>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              {award.title[language]}
            </h3>
            <p className="text-foreground/80 font-medium mb-4">{award.institution[language]}</p>
            <p className="text-sm text-muted-foreground mt-auto">{award.description?.[language]}</p>
          </motion.article>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label={t("education.title")}>
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                filter === item.id
                  ? "border-[var(--brand)] bg-[var(--brand)] text-neutral-950"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              {item.label}
              <span className="font-mono text-xs opacity-70">{String(item.total).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        {/* Línea de tiempo: en escritorio las tarjetas alternan a cada lado de la línea */}
        <ol ref={timelineRef} className="relative space-y-6 lg:space-y-10">
          <li className="absolute top-0 bottom-0 left-5 lg:left-1/2 w-px -translate-x-1/2 bg-border" aria-hidden="true">
            <motion.div
              style={{ scaleY: lineFill }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--brand)] to-[var(--brand-alt)]"
            />
          </li>

          {visibleItems.map((item, index) => {
            const Icon = icons[item.type]
            const left = index % 2 === 0
            return (
              <motion.li
                key={`${filter}-${item.title.en}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.2) }}
                className="relative grid lg:grid-cols-2 lg:gap-x-20 items-center pl-14 lg:pl-0"
              >
                <span className="absolute left-5 lg:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full border border-border bg-card text-[var(--brand)] shadow-lg">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>

                <article
                  className={`education-card p-6 rounded-2xl border border-border bg-card lg:row-start-1 ${
                    left ? "lg:col-start-1" : "lg:col-start-2"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 font-mono text-xs">
                    <span className="text-[var(--brand)] uppercase tracking-wider">{t(`education.${item.type}`)}</span>
                    <span className="text-muted-foreground lg:hidden">{item.year[language]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.title[language]}</h3>
                  <p className="text-sm text-foreground/75 font-medium">{item.institution[language]}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2">{item.description[language]}</p>
                  )}
                  {item.certificate && (
                    <button
                      type="button"
                      onClick={() => setOpenCertificate(item.title.en)}
                      data-cursor="view"
                      className="education-certificate group mt-4 flex w-full items-center gap-3 rounded-xl border border-border p-2 pr-4 text-left"
                    >
                      <span className="relative block w-20 aspect-[4/3] shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={item.certificate} alt="" fill sizes="80px" className="object-cover" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{text.view}</span>
                      <ZoomIn
                        className="ml-auto w-4 h-4 text-muted-foreground transition-colors group-hover:text-[var(--brand)]"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </article>

                {/* Año grande al otro lado de la línea */}
                <p
                  className={`hidden lg:block lg:row-start-1 font-mono text-6xl font-bold tracking-tight text-foreground/10 ${
                    left ? "lg:col-start-2 text-left" : "lg:col-start-1 text-right"
                  }`}
                  aria-hidden="true"
                >
                  {item.year[language]}
                </p>
              </motion.li>
            )
          })}
        </ol>

        {/* Visor del certificado */}
        <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenCertificate(null)}>
          <DialogContent className="max-w-[94vw]! lg:max-w-5xl! gap-0 p-0 overflow-hidden">
            {current?.certificate && (
              <>
                <div className="px-5 py-4 pr-12 border-b border-border">
                  <DialogTitle className="text-base sm:text-lg font-semibold leading-snug">
                    {current.title[language]}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {current.institution[language]} · {current.year[language]}
                  </p>
                </div>

                <div className="relative bg-neutral-100">
                  <div className="relative w-full h-[min(68vh,62vw)]">
                    <Image
                      key={current.certificate}
                      src={current.certificate}
                      alt={current.title[language]}
                      fill
                      sizes="(min-width: 1024px) 1024px, 94vw"
                      className="object-contain"
                    />
                  </div>
                  {certificates.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => stepCertificate(-1)}
                        aria-label={text.previous}
                        className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/90 text-neutral-900 border border-neutral-300 shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => stepCertificate(1)}
                        aria-label={text.next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/90 text-neutral-900 border border-neutral-300 shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-border text-sm">
                  <span className="font-mono text-muted-foreground">
                    {certificateIndex + 1} / {certificates.length}
                  </span>
                  <a
                    href={current.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-[var(--brand)] transition-colors"
                  >
                    {text.open}
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
