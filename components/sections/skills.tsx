"use client"

import { useI18n } from "@/components/i18n-provider"
import { motion } from "framer-motion"
import { Code2, Database, Palette, Zap } from "lucide-react"

const skillsData = {
  en: [
    { category: "Frontend", icon: Palette, skills: ["React", "Vite", "Angular", "Java Script", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn"] },
    { category: "Backend", icon: Database, skills: ["Springboot", "C# (.NET Core)", "Python", "Java", "Nestjs", "PostgreSQL", "MySQL", "REST APIs", "Grcp"] },
    { category: "Mobile", icon: Database, skills: ["React Native", "Android Studio", ".NET MAUI", "Flutter"] },
    { category: "Tools", icon: Code2, skills: ["Git", , "Github", "Azure", "Trello", "Docker", "Vercel", "Render", "Neon"] },
    { category: "Other", icon: Zap, skills: ["Visual Studio Code", "Visual Studio", "Intellij IDE", "NetBeans", "Scrumb", "Kanban"] },
  ],
  es: [
    { category: "Frontend", icon: Palette, skills: ["React", "Vite", "Angular", "Java Script", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn"] },
    { category: "Backend", icon: Database, skills: ["Springboot", "C# (.NET Core)", "Python", "Java", "Nest.js", "PostgreSQL", "MySQL", "REST APIs", "Grcp"] },
    { category: "Mobile", icon: Database, skills: ["React Native", "Android Studio", ".NET MAUI", "Flutter"] },
    { category: "Herramientas", icon: Code2, skills: ["Git", "Github", "Azure", "Trello", "Docker", "Vercel", "Render", "Neon"] },
    { category: "Otros", icon: Zap, skills: ["Visual Studio Code", "Visual Studio", "Intellij IDE", "NetBeans", "Scrumb", "Kanban"] },
  ],
}

export function Skills() {
  const { t, language } = useI18n()
  const skills = skillsData[language]

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-otro dark:bg-dark-muted" aria-label="Skills section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-dark-foreground mb-4">
            {t("skills.title")}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground">
            {t("skills.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillGroup, index) => {
            const Icon = skillGroup.icon
            return (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-background dark:bg-dark-background p-6 rounded-xl border border-border dark:border-dark-border hover:shadow-lg transition-shadow"
                role="article"
                aria-label={`${skillGroup.category} skills`}
              >
                <Icon className="w-8 h-8 text-primary dark:text-dark-primary mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-4">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-muted-foreground dark:text-dark-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" aria-hidden="true" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
