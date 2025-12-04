"use client"

import { useI18n } from "@/components/i18n-provider"
import { motion } from "framer-motion"
import { Calendar, Award } from "lucide-react"

const educationData = {
  en: [
    {
      title: "Start of My Studies in Software Engineering",
      institution: "Technical University of Ambato",
      year: "2021 - Present",
      description: "Focused on web development, mobile development, and software engineering.",
    },
    {
      title: "Python Programming Course Applied to Software Engineering",
      institution: "Technical University of Ambato",
      year: "2023",
      description: "Intensive 40-hour course on Python programming applied to software engineering.(2023)",
    },
    {
      title: "V International Congress of Systems, Electronic and Industrial Engineering (CSEI 2023)",
      institution: "Technical University of Ambato",
      year: "2023",
      description: "",
    },
    {
      title: "Technological Training in Cybersecurity Topics",
      institution: "Pontifical Catholic University of Ecuador",
      year: "2023",
      description: "Training in cybersecurity topics organized by PUCE.(2023)",
    },
    {
      title: "Introduction to Cybersecurity",
      institution: "Cisco Networking Academy",
      year: "2024",
      description: "Introductory course in cybersecurity offered by Cisco Networking Academy.(2024)",
    },
    {
      title: "VI International Congress of Systems, Electronic and Industrial Engineering (CSEI 2024)",
      institution: "Technical University of Ambato",
      year: "2024",
      description: "",
    },
    {
      title: "Advanced Programming Competition",
      institution: "Technical Academy of Ambato",
      year: "2025",
      description: "Achieving 2nd Place in the advanced programming competition organized by the Faculty of Systems, Electronic and Industrial Engineering(2025)",
    },
    {
      title: "VII International Congress of Systems, Electronic and Industrial Engineering (CSEI 2025)",
      institution: "Technical University of Ambato",
      year: "2025",
      description: "",
    },
  ],
  es: [
    {
      title: "Inicio de mis Estudios en Ingeniería de Software",
      institution: "Universidad Técnica de Ambato",
      year: "2021 - Presente",
      description: "Enfocado en desarrollo web, mobile e ingeniería de software.",
    },  
    {
      title: "Curso de Programación con Python Aplicada a la Ingeniería de Software",
      institution: "Universidad Técnica de Ambato",
      year: "2023",
      description: " Curso intensivo de 40 horas sobre programación en Python aplicada a la ingeniería de software.(2023)",
    },
    {
      title: "V Congreso Internacional de Ingeniería en Sistemas, Electrónica e Industrial (CSEI 2025)",
      institution: "Universidad Técnica de Ambato",
      year: "2023",
      description: "",
    },
    {
      title: "Capacitación Tecnologica en Temas de Ciberseguridad",
      institution: "Pontificia Universidad Católica del Ecuador",
      year: "2023",
      description: "Capacitación en temas de ciberseguridad organizada por la PUCE.(2023)",
    },
    {
      title: "Introducción  en Ciberseguridad",
      institution: "Cisco Networking Academy",
      year: "2024",
      description: "Curso introductorio en ciberseguridad ofrecido por Cisco Networking Academy.(2024)",
    },
    {
      title: "VI Congreso Internacional de Ingeniería en Sistemas, Electrónica e Industrial (CSEI 2025)",
      institution: "Universidad Técnica de Ambato",
      year: "2024",
      description: "",
    },
    {
      title: "Concurso de Programación Avanzada",
      institution: "Academia Técnica de Ambato",
      year: "2025",
      description: "Alcanzando el 2do Lugar en el concurso de programación avanzada organizado por la Facultad de Ingeniería en Sistemas Electrónica e Industrial(2025)",
    },
    {
      title: "VII Congreso Internacional de Ingeniería en Sistemas, Electrónica e Industrial (CSEI 2025)",
      institution: "Universidad Técnica de Ambato",
      year: "2025",
      description: "",
    },
  ],
}

export function Education() {
  const { t, language } = useI18n()
  const education = educationData[language]

  return (
    <section
      id="education"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted dark:bg-dark-muted"
      aria-label="Education section"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-dark-foreground mb-4">
            {t("education.title")}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground">
            {t("education.description")}
          </p>
        </motion.div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {education.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background dark:bg-dark-background p-6 rounded-xl border-l-4 border-primary dark:border-dark-primary"
            >
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 text-primary dark:text-dark-primary shrink-0 mt-1" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-1">{item.title}</h3>
                  <p className="text-primary dark:text-dark-primary font-medium mb-2">{item.institution}</p>
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-dark-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {item.year}
                  </div>
                  <p className="text-muted-foreground dark:text-dark-muted-foreground">{item.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
