"use client"

import type React from "react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"
import { Database, Layers, Palette, Server, Smartphone, Wrench } from "lucide-react"
import type { IconType } from "react-icons"
import { FaJava } from "react-icons/fa"
import {
  SiAndroidstudio,
  SiAngular,
  SiApachenetbeanside,
  SiDocker,
  SiDotnet,
  SiFlutter,
  SiGit,
  SiGithub,
  SiIntellijidea,
  SiJavascript,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRender,
  SiShadcnui,
  SiSharp,
  SiSpringboot,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si"
import { TbApi, TbArrowsExchange, TbBrandVisualStudio, TbLayoutKanban, TbRefresh } from "react-icons/tb"
import { VscAzure, VscVscode } from "react-icons/vsc"

interface Skill {
  name: string
  icon: IconType | React.ComponentType<{ className?: string }>
  // Color de la marca; se muestra al pasar el mouse. Sin color = usa el del texto.
  color?: string
}

interface SkillGroup {
  id: string
  category: { en: string; es: string }
  icon: React.ComponentType<{ className?: string }>
  // Cuántas columnas ocupa en la cuadrícula de escritorio (de 6)
  span: string
  // Columnas de casillas en escritorio, para que las tarjetas de una misma fila queden igual de altas
  columns: string
  skills: Skill[]
}

const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    category: { en: "Frontend", es: "Frontend" },
    icon: Palette,
    span: "lg:col-span-3",
    columns: "lg:grid-cols-4",
    skills: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Angular", icon: SiAngular, color: "#DD0031" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Vite", icon: SiVite, color: "#646CFF" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "shadcn/ui", icon: SiShadcnui },
    ],
  },
  {
    id: "backend",
    category: { en: "Backend", es: "Backend" },
    icon: Server,
    span: "lg:col-span-3",
    columns: "lg:grid-cols-5",
    skills: [
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: "C# (.NET Core)", icon: SiSharp, color: "#9B4F96" },
      { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { name: "Java", icon: FaJava, color: "#F89820" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "REST APIs", icon: TbApi, color: "#22C7D6" },
      { name: "gRPC", icon: TbArrowsExchange, color: "#2DA6B0" },
    ],
  },
  {
    id: "mobile",
    category: { en: "Mobile", es: "Móvil" },
    icon: Smartphone,
    span: "lg:col-span-2",
    columns: "lg:grid-cols-3",
    skills: [
      { name: "React Native", icon: SiReact, color: "#61DAFB" },
      { name: "Flutter", icon: SiFlutter, color: "#54C5F8" },
      { name: ".NET MAUI", icon: SiDotnet, color: "#512BD4" },
      { name: "Android Studio", icon: SiAndroidstudio, color: "#3DDC84" },
    ],
  },
  {
    id: "tools",
    category: { en: "Tools", es: "Herramientas" },
    icon: Wrench,
    span: "lg:col-span-2",
    columns: "lg:grid-cols-3",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Azure", icon: VscAzure, color: "#0078D4" },
      { name: "Vercel", icon: SiVercel },
      { name: "Render", icon: SiRender },
      { name: "Neon", icon: Database, color: "#00E599" },
      { name: "Trello", icon: SiTrello, color: "#0052CC" },
    ],
  },
  {
    id: "other",
    category: { en: "Other", es: "Otros" },
    icon: Layers,
    span: "lg:col-span-2",
    columns: "lg:grid-cols-3",
    skills: [
      { name: "Scrum", icon: TbRefresh, color: "#009FDA" },
      { name: "Kanban", icon: TbLayoutKanban, color: "#F8A51B" },
      { name: "VS Code", icon: VscVscode, color: "#007ACC" },
      { name: "Visual Studio", icon: TbBrandVisualStudio, color: "#9B4F96" },
      { name: "IntelliJ IDEA", icon: SiIntellijidea, color: "#FE315D" },
      { name: "NetBeans", icon: SiApachenetbeanside, color: "#1B6AC6" },
    ],
  },
]

const allSkills = skillGroups.flatMap((group) => group.skills)
const half = Math.ceil(allSkills.length / 2)
const marqueeRows = [allSkills.slice(0, half), allSkills.slice(half)]

// Fila de logos que se desplaza sin fin. La lista va duplicada para que el bucle no tenga corte.
function Marquee({ skills, reverse }: { skills: Skill[]; reverse?: boolean }) {
  return (
    <div className="skills-marquee" data-reverse={reverse ? "" : undefined}>
      <ul className="skills-marquee-track">
        {[...skills, ...skills].map((skill, index) => {
          const Icon = skill.icon
          return (
            <li
              key={`${skill.name}-${index}`}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground/90 whitespace-nowrap"
            >
              <span style={{ color: skill.color }}>
                <Icon className="w-5 h-5" />
              </span>
              {skill.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Tarjeta con un foco de luz que sigue al mouse (ver .spotlight-card en app/globals.css)
function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div onPointerMove={handlePointerMove} className={`spotlight-card ${className ?? ""}`}>
      {children}
    </div>
  )
}

// Total de tecnologías distintas (se muestra en el inicio)
export const techCount = new Set(skillGroups.flatMap((group) => group.skills.map((skill) => skill.name))).size

export function Skills() {
  const { t, language } = useI18n()

  return (
    <section id="skills" className="py-24 bg-muted/50 overflow-hidden" aria-label="Skills section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading index="01" title={t("skills.title")} description={t("skills.description")} />
      </div>

      {/* Cinta de logos a todo el ancho */}
      <div className="space-y-3 mb-14" aria-hidden="true">
        <Marquee skills={marqueeRows[0]} />
        <Marquee skills={marqueeRows[1]} reverse />
      </div>

      {/* Cuadrícula tipo bento por categoría */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-5">
          {skillGroups.map((group, index) => {
            const GroupIcon = group.icon
            const category = group.category[language]
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={group.span}
              >
                <SpotlightCard className="h-full">
                  <article className="relative h-full p-6" aria-label={category}>
                    <header className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
                          <GroupIcon className="w-5 h-5" />
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">
                        {String(group.skills.length).padStart(2, "0")}
                      </span>
                    </header>

                    <ul className={`grid gap-3 grid-cols-3 sm:grid-cols-4 ${group.columns}`}>
                      {group.skills.map((skill) => {
                        const Icon = skill.icon
                        return (
                          <li
                            key={skill.name}
                            className="skill-tile"
                            style={{ "--skill-color": skill.color ?? "var(--foreground)" } as React.CSSProperties}
                          >
                            <Icon className="skill-tile-icon w-7 h-7" />
                            <span className="text-xs font-medium text-center leading-tight">{skill.name}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </article>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
