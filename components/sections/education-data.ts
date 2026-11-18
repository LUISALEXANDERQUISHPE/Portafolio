import type { Language } from "@/components/i18n-provider"
import { site } from "@/lib/site"

export type ItemType = "degree" | "course" | "event" | "award"

export interface EducationItem {
  type: ItemType
  year: Record<Language, string>
  title: Record<Language, string>
  institution: Record<Language, string>
  description?: Record<Language, string>
  /** Imagen del certificado en public/Certificados (se abre al pulsar "Ver certificado") */
  certificate?: string
}

// Del más reciente al más antiguo. La carrera y el logro se muestran destacados;
// los cursos y congresos, en la línea de tiempo.
export const educationItems: EducationItem[] = [
  {
    type: "course",
    year: { en: "2026", es: "2026" },
    title: { en: "JavaScript Essentials 1", es: "JavaScript Essentials 1" },
    institution: { en: "Cisco Networking Academy · JS Institute", es: "Cisco Networking Academy · JS Institute" },
    description: {
      en: "JavaScript fundamentals course from the Cisco Networking Academy program.",
      es: "Curso de fundamentos de JavaScript del programa Cisco Networking Academy.",
    },
    certificate: "/Certificados/cisco-javascript-essentials-1-2026.webp",
  },
  {
    type: "award",
    year: { en: "2025", es: "2025" },
    title: { en: "2nd Place — Advanced Programming Competition", es: "2.º Lugar — Concurso de Programación Avanzada" },
    institution: { en: "Technical Academy of Ambato", es: "Academia Técnica de Ambato" },
    description: {
      en: "Competition organized by the Faculty of Systems, Electronic and Industrial Engineering.",
      es: "Concurso organizado por la Facultad de Ingeniería en Sistemas, Electrónica e Industrial.",
    },
  },
  {
    type: "course",
    year: { en: "2025", es: "2025" },
    title: { en: "Cybersecurity and Ethical Hacking", es: "Ciberseguridad y Ethical Hacking" },
    institution: { en: "Hacker Mentor Cybersecurity Academy", es: "Academia de Ciberseguridad Hacker Mentor" },
    description: {
      en: "8-hour professional development course on cybersecurity and ethical hacking.",
      es: "Curso de 8 horas de desarrollo profesional sobre ciberseguridad y hacking ético.",
    },
    certificate: "/Certificados/hacker-mentor-ethical-hacking-2025.webp",
  },
  {
    type: "course",
    year: { en: "2024", es: "2024" },
    title: { en: "Introduction to Cybersecurity", es: "Introducción a la Ciberseguridad" },
    institution: { en: "Cisco Networking Academy", es: "Cisco Networking Academy" },
    description: {
      en: "Introductory course in cybersecurity offered by Cisco Networking Academy.",
      es: "Curso introductorio en ciberseguridad ofrecido por Cisco Networking Academy.",
    },
    certificate: "/Certificados/cisco-intro-cybersecurity-2024.webp",
  },
  {
    type: "event",
    year: { en: "2024", es: "2024" },
    title: {
      en: "VI International Congress of Systems, Electronic and Industrial Engineering (CSEI 2024)",
      es: "VI Congreso Internacional de Ingeniería en Sistemas, Electrónica e Industrial (CSEI 2024)",
    },
    institution: { en: "Technical University of Ambato", es: "Universidad Técnica de Ambato" },
    certificate: "/Certificados/csei-2024.webp",
  },
  {
    type: "course",
    year: { en: "2023", es: "2023" },
    title: {
      en: "Python Programming Applied to Engineering",
      es: "Programación con Python Aplicada a la Ingeniería",
    },
    institution: { en: "Technical University of Ambato", es: "Universidad Técnica de Ambato" },
    description: {
      en: "Intensive 40-hour course on Python programming applied to engineering.",
      es: "Curso intensivo de 40 horas sobre programación en Python aplicada a la ingeniería.",
    },
    certificate: "/Certificados/python-uta-2023.webp",
  },
  {
    type: "course",
    year: { en: "2023", es: "2023" },
    title: {
      en: "Technological Training in Cybersecurity Topics",
      es: "Capacitación Tecnológica en Temas de Ciberseguridad",
    },
    institution: { en: "Pontifical Catholic University of Ecuador", es: "Pontificia Universidad Católica del Ecuador" },
    description: {
      en: "Training in cybersecurity topics organized by PUCE.",
      es: "Capacitación en temas de ciberseguridad organizada por la PUCE.",
    },
    certificate: "/Certificados/ciberseguridad-puce-2023.webp",
  },
  {
    type: "event",
    year: { en: "2023", es: "2023" },
    title: {
      en: "V International Congress of Systems, Electronic and Industrial Engineering (CSEI 2023)",
      es: "V Congreso Internacional de Ingeniería en Sistemas, Electrónica e Industrial (CSEI 2023)",
    },
    institution: { en: "Technical University of Ambato", es: "Universidad Técnica de Ambato" },
    certificate: "/Certificados/csei-2023.webp",
  },
  {
    type: "course",
    year: { en: "2022", es: "2022" },
    title: {
      en: "Programming and Control from Scratch with Arduino",
      es: "Programación y Control desde Cero con Arduino",
    },
    institution: { en: "Technical University of Ambato", es: "Universidad Técnica de Ambato" },
    description: {
      en: "40-hour course on programming and control with Arduino.",
      es: "Curso de 40 horas sobre programación y control con Arduino.",
    },
    certificate: "/Certificados/arduino-uta-2022.webp",
  },
  {
    type: "degree",
    year: { en: "2021 - Present", es: "2021 - Presente" },
    title: { en: "Software Engineering", es: "Ingeniería de Software" },
    institution: { en: "Technical University of Ambato", es: "Universidad Técnica de Ambato" },
    description: {
      en: `Currently in ${site.semester}th semester. Focused on web development, mobile development, and software engineering.`,
      es: `Actualmente en ${site.semester}.º semestre. Enfocado en desarrollo web, mobile e ingeniería de software.`,
    },
  },
]
