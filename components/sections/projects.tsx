"use client"

import { useI18n, type Language } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Monitor, Smartphone } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface Project {
  title: Record<Language, string>
  description: Record<Language, string>
  tags: string[]
  webImages: string[]
  mobileImages?: string[]
  repos: { label: string; url: string }[]
  live?: string
}

export const projects: Project[] = [
  {
    title: {
      en: "Online Pharmacy Platform",
      es: "Plataforma de Farmacia en Línea",
    },
    description: {
      en: "Online medicine trading solution with integration for both web administrators and mobile app clients.",
      es: "Solución de comercio de medicinas online con integración tanto para administradores web como para clientes de la app móvil.",
    },
    webImages: [
      "/Proyectos/FamaYa/Web/FarmaYa Dash.png",
      "/Proyectos/FamaYa/Web/FarmaYaUsers.png",
      "/Proyectos/FamaYa/Web/FarmaYaProfile.png",
      "/Proyectos/FamaYa/Web/FarmaYaDiscount.png",
      "/Proyectos/FamaYa/Web/FarmaYa (1).png",
      "/Proyectos/FamaYa/Web/FarmaYa (2).png",
      "/Proyectos/FamaYa/Web/FarmaYaLogin.png",
    ],
    mobileImages: [
      "/Proyectos/FamaYa/Mobile/Famaya.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa2.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa3.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa5.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa7.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa6.jpg",
      "/Proyectos/FamaYa/Mobile/FarmaYa8.jpg",
    ],
    tags: ["Next.js", "NestJS", "React Native", "PostgreSQL", "Vercel", "Render", "Neon"],
    repos: [
      {
        label: "Backend",
        url: "https://github.com/HamiltonStJJ/FarmaYaBackEnd",
      },
      // TODO: agregar los repos de Frontend y Mobile de FarmaYa cuando estén disponibles
    ],
    live: "https://farmayabackend.onrender.com/farmaya/docs",
  },
  {
    title: {
      en: "Veterinary Management System",
      es: "Sistema de Gestión Veterinaria",
    },
    description: {
      en: "Complete veterinary clinic management system with web admin panel and mobile app for pet owners.",
      es: "Sistema completo de gestión de clínica veterinaria con panel web para administradores y app móvil para dueños de mascotas.",
    },
    webImages: [
      "/Proyectos/HuellitaSoft/Web/HuellitaSoft.png",
      "/Proyectos/HuellitaSoft/Web/HuelliaSoftDash.png",
      "/Proyectos/HuellitaSoft/Web/HuellitaSoftMascotas.png",
      "/Proyectos/HuellitaSoft/Web/HuellitaSoftPets.png",
      "/Proyectos/HuellitaSoft/Web/HuellitaSoftPet.png",
      "/Proyectos/HuellitaSoft/Web/HuellitaSoftVet.png",
    ],
    mobileImages: [
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftLogin.jpg",
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftInicio.jpg",
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoft.jpg",
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftPet.jpg",
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftPetDetail.jpg",
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftCitas.jpg",
      "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftAgendaCite.jpg",
    ],
    tags: ["React + Vite", "Auth0", "Spring Boot", "React Native", "PostgreSQL"],
    repos: [
      {
        label: "Backend",
        url: "https://github.com/W1llAn/Backend_Huellitasoft",
      },
      {
        label: "Frontend",
        url: "https://github.com/W1llAn/Frontend_Huellitasoft",
      },
      { label: "Mobile", url: "https://github.com/W1llAn/HuellitasMobile" },
    ],
  },
  {
    title: { en: "Walk Seguros", es: "Walk Seguros" },
    description: {
      en: "Insurance management system divided into three roles (Administrator, Agent, and Client) for policy management, client registration, and automated document management. This project reflects best practices in architecture and seamless client-server integration, ideal for process automation in insurance environments.",
      es: "Sistema de gestión de seguros dividido en 3 roles (Administrador, Agente y Cliente): manejo de pólizas, registro de clientes y gestión de documentos automatizados. Este proyecto refleja buenas prácticas de arquitectura y una integración fluida entre el cliente y el servidor, ideal para la automatización de procesos en entornos aseguradores.",
    },
    webImages: [
      "/Proyectos/WalkSeguros/WalkSegurosLogin.jpg",
      "/Proyectos/WalkSeguros/WalkAdmin.jpg",
      "/Proyectos/WalkSeguros/WalkAgente.jpg",
      "/Proyectos/WalkSeguros/WalkClient.jpg",
      "/Proyectos/WalkSeguros/WalkBaseDATOS.jpg",
    ],
    tags: ["React + Vite", "JWT", "Spring Boot", "PostgreSQL"],
    repos: [
      {
        label: "Backend",
        url: "https://github.com/IsmaelSailema20/GestionSegurosBackend",
      },
      {
        label: "Frontend",
        url: "https://github.com/IsmaelSailema20/GestionSegurosFrontend",
      },
    ],
    live: "https://gestion-seguros-frontend.vercel.app/",
  },
  {
    title: {
      en: "Hospital Management with Branches",
      es: "Gestión de Hospitales con Sucursales",
    },
    description: {
      en: "Hospital management project that allows you to efficiently manage multiple branches, staff, medical appointments, and patient records nationwide.",
      es: "Proyecto de gestión hospitalaria que permite administrar múltiples sucursales, personal, citas médicas e historiales de pacientes a nivel nacional de manera eficiente.",
    },
    webImages: [
      "/Proyectos/GestionClinicas/Web/GestionClinicaLogin.png",
      "/Proyectos/GestionClinicas/Web/GestionClinica (1).png",
      "/Proyectos/GestionClinicas/Web/GestionClinica (2).png",
      "/Proyectos/GestionClinicas/Web/GestionClinica (3).png",
      "/Proyectos/GestionClinicas/Web/GestionClinica (4).png",
    ],
    tags: ["React + Vite", "ASP.NET Core", "MariaDB", "gRPC"],
    repos: [
      {
        label: "Backend",
        url: "https://github.com/W1llAn/GestionHospitalesBackend",
      },
      {
        label: "Frontend",
        url: "https://github.com/W1llAn/GestionHospitalesFrontend",
      },
    ],
  },
]

// Las tarjetas se fijan debajo del menú (4rem) y de la barra de acceso directo
const STACK_TOP_REM = 8
// Cuántas tarjetas se ven "asomando" detrás de la actual
const MAX_STACK = 3
// Dónde queda el inicio de un proyecto al saltar a él desde la barra
const JUMP_OFFSET_PX = STACK_TOP_REM * 16

const projectAnchorId = (index: number) => `project-${index + 1}`

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)")
    const update = () => setIsDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return isDesktop
}

// Solo se cargan la captura actual y sus vecinas (para el fundido), no todas a la vez
function isNear(imageIndex: number, current: number, length: number) {
  const distance = Math.abs(imageIndex - current)
  return distance <= 1 || distance === length - 1
}

// Capturas dentro de una ventana de navegador y, si el proyecto tiene app, un teléfono encima
function Mockup({
  project,
  title,
  index,
  onSelect,
  onOpen,
}: {
  project: Project
  title: string
  index: number
  onSelect: (index: number) => void
  onOpen: (set: "web" | "mobile", index: number) => void
}) {
  const web = project.webImages
  const mobile = project.mobileImages
  const mobileIndex = mobile ? index % mobile.length : 0

  return (
    <div className="relative">
      <div className={mobile ? "pr-[8%] pb-[5%]" : ""}>
        {/* Navegador */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 px-3.5 h-9 bg-neutral-800/80">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/90" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/90" />
            <span className="ml-3 flex-1 max-w-64 truncate rounded-md bg-neutral-950/60 px-3 py-1 font-mono text-[11px] text-neutral-400">
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpen("web", index)}
            data-cursor="view"
            className="relative block w-full aspect-[2.05] bg-neutral-950 cursor-zoom-in"
            aria-label={`${title} — web ${index + 1} / ${web.length}`}
          >
            {web.map((image, imageIndex) =>
              isNear(imageIndex, index, web.length) ? (
                <Image
                  key={image}
                  src={image}
                  alt={imageIndex === index ? `${title} — web ${imageIndex + 1}` : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className={`object-contain transition-opacity duration-500 ${
                    imageIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : null,
            )}
          </button>
        </div>
      </div>

      {/* Teléfono */}
      {mobile && (
        <button
          type="button"
          onClick={() => onOpen("mobile", mobileIndex)}
          data-cursor="view"
          className="absolute right-0 bottom-0 w-[21%] aspect-[612/1350] rounded-[1.4rem] overflow-hidden border-[5px] border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/60 ring-1 ring-white/10 cursor-zoom-in"
          aria-label={`${title} — app ${mobileIndex + 1} / ${mobile.length}`}
        >
          {mobile.map((image, imageIndex) =>
            isNear(imageIndex, mobileIndex, mobile.length) ? (
              <Image
                key={image}
                src={image}
                alt={imageIndex === mobileIndex ? `${title} — app ${imageIndex + 1}` : ""}
                fill
                sizes="180px"
                className={`object-cover transition-opacity duration-500 ${
                  imageIndex === mobileIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null,
          )}
        </button>
      )}

      {/* Selector de captura */}
      <div className="mt-4 flex items-center gap-1.5">
        {web.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => onSelect(imageIndex)}
            aria-label={`${imageIndex + 1} / ${web.length}`}
            aria-current={imageIndex === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              imageIndex === index ? "w-8 bg-[var(--brand)]" : "w-3 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  index,
  total,
  progress,
  stacked,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
  stacked: boolean
}) {
  const { t, language } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { amount: 0.5 })
  const [imageIndex, setImageIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState<{
    set: "web" | "mobile"
    index: number
  } | null>(null)

  const title = project.title[language]
  const number = String(index + 1).padStart(2, "0")
  const reversed = index % 2 === 1

  // Al apilarse, las tarjetas de atrás se encogen un poco (con tope, para que funcione con muchos proyectos)
  const scale = useTransform(progress, [index / total, 1], [1, 1 - Math.min(total - 1 - index, MAX_STACK) * 0.035])

  // Las capturas avanzan solas mientras la tarjeta está a la vista
  useEffect(() => {
    if (!inView || paused || lightbox) return
    const timer = setInterval(() => setImageIndex((prev) => (prev + 1) % project.webImages.length), 4500)
    return () => clearInterval(timer)
  }, [inView, paused, lightbox, project.webImages.length])

  const lightboxImages = lightbox ? (lightbox.set === "web" ? project.webImages : project.mobileImages!) : []
  const step = (direction: 1 | -1) => {
    setLightbox((prev) =>
      prev
        ? {
            ...prev,
            index: (prev.index + direction + lightboxImages.length) % lightboxImages.length,
          }
        : prev,
    )
  }

  return (
    <>
      {/* Ancla sin altura: marca dónde empieza el proyecto para la barra de acceso directo */}
      <div id={projectAnchorId(index)} data-project-anchor aria-hidden="true" />
      <div
        ref={cardRef}
        className="lg:sticky mb-8 lg:mb-16 last:mb-0"
        style={{
          top: `calc(${STACK_TOP_REM}rem + ${Math.min(index, MAX_STACK)}rem)`,
        }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <motion.article
          style={{ scale: stacked ? scale : 1 }}
          className="project-card relative origin-top overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/20"
        >
          <div
            className={`grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-10 lg:min-h-[500px] ${
              reversed ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Texto */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-5xl font-bold leading-none text-[var(--brand)]">{number}</span>
                <span className="font-mono text-sm text-muted-foreground">/ {String(total).padStart(2, "0")}</span>
                <span className="ml-auto lg:ml-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                  {t("projects.web")}
                  {project.mobileImages && (
                    <>
                      <span aria-hidden="true">+</span>
                      <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                      {t("projects.mobile")}
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">{title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{project.description[language]}</p>

              <ul className="flex flex-wrap gap-2 mb-7">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2.5">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand)] text-neutral-950 text-sm font-semibold hover:brightness-110 transition"
                    aria-label={`${title} — ${t("projects.live")}`}
                  >
                    {t("projects.live")}
                    <ArrowUpRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}
                {project.repos.map((repo) => (
                  <a
                    key={repo.label}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-sm text-foreground/90 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                    aria-label={`${title} — ${repo.label} (GitHub)`}
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                    {repo.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Capturas */}
            <Mockup
              project={project}
              title={title}
              index={imageIndex}
              onSelect={setImageIndex}
              onOpen={(set, openIndex) => setLightbox({ set, index: openIndex })}
            />
          </div>
        </motion.article>

        {/* Visor de imagen en grande */}
        <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
          <DialogContent className="max-w-[92vw]! md:max-w-[78vw]! h-[88vh] p-0 bg-white text-gray-800">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            {lightbox && (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 p-6 md:p-10">
                  <div className="relative w-full h-full">
                    <Image
                      key={lightboxImages[lightbox.index]}
                      src={lightboxImages[lightbox.index]}
                      alt={`${title} ${lightbox.index + 1}`}
                      fill
                      className="object-contain"
                      sizes="92vw"
                    />
                  </div>
                </div>

                {lightboxImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-lg transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-lg transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-100 border border-gray-300 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {lightbox.index + 1} / {lightboxImages.length}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

// Barra de acceso directo: un botón por proyecto, se queda fija mientras se recorre la sección
function ProjectNav({ active, onJump }: { active: number; onJump: (index: number) => void }) {
  const { language } = useI18n()
  const listRef = useRef<HTMLDivElement>(null)

  // Mantiene a la vista el botón del proyecto activo (la barra se desplaza en horizontal si hay muchos)
  useEffect(() => {
    const list = listRef.current
    const button = list?.children[active] as HTMLElement | undefined
    if (!list || !button) return
    const left = button.offsetLeft - list.clientWidth / 2 + button.clientWidth / 2
    list.scrollTo({ left, behavior: "smooth" })
  }, [active])

  return (
    <nav
      aria-label="Projects"
      className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 mb-8 bg-background/85 backdrop-blur-md border-b border-border/60"
    >
      <div ref={listRef} className="project-nav-list flex gap-2 overflow-x-auto">
        {projects.map((project, index) => (
          <button
            key={project.title.en}
            type="button"
            onClick={() => onJump(index)}
            aria-current={index === active}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm transition-colors ${
              index === active
                ? "border-[var(--brand)] bg-[var(--brand)] text-neutral-950 font-semibold"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
            <span className="max-w-44 truncate">{project.title[language]}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export function Projects() {
  const { t } = useI18n()
  const listRef = useRef<HTMLDivElement>(null)
  const stacked = useIsDesktop()
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  })
  const [active, setActive] = useState(0)

  // El proyecto activo es el último cuya ancla ya pasó por debajo de la barra
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const anchors = Array.from(list.querySelectorAll<HTMLElement>("[data-project-anchor]"))
    let frame = 0
    const update = () => {
      frame = 0
      const limit = JUMP_OFFSET_PX + 40
      let current = 0
      anchors.forEach((anchor, index) => {
        if (anchor.getBoundingClientRect().top <= limit) current = index
      })
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const jumpTo = (index: number) => {
    const anchor = document.getElementById(projectAnchorId(index))
    if (!anchor) return
    const top = anchor.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET_PX
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" })
  }

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8" aria-label="Projects section">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="02" title={t("projects.title")} description={t("projects.description")} />

        <ProjectNav active={active} onJump={jumpTo} />

        {/* En escritorio las tarjetas se quedan fijas y la siguiente se apila encima al bajar */}
        <div ref={listRef}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title.en}
              project={project}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
