"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  en: {
    "nav.home": "Home",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.education": "Education",
    "nav.contact": "Contact",
    "home.title": "Hi, I'm Luis !",
    "home.subtitle": "Building beautiful and functional digital experiences",
    "home.description1": "¡Welcome to my portfolio!.",
    "home.description2": "Passionate about technology and web development.",
    "home.description3": "I'm studying Software Engineering.",
    "home.description4": "Ready to create innovative solutions.",
    "home.description": "Software Engineering student (7th semester). I build APIs with Java (Spring Boot) and .NET, and frontends with React/Next. I'm proficient in PostgreSQL/MySQL and Docker; I work with Git/GitHub and Scrum/Kanban methodologies. I'm looking for an internship/junior developer position to contribute to backend or full-stack development. I consider myself sociable, with the ability to work in a team and contribute effective solutions.",
    "home.cta": "View My Work",
    "skills.title": "Skills",
    "skills.description": "Technologies and tools I work with",
    "projects.title": "Projects",
    "education.title": "Education",
    "education.description": "My academic background and certifications",
    "contact.title": "Get In Touch",
    "contact.description": "Let's work together on your next project",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.address": "Location",
    "contact.name": "Name",
    "contact.message": "Message",
    "contact.placeMessage": "Your message...",
    "contact.placeEmail": "example@example.com",
    "contact.placeName": "Your name...",
    "contact.button": "Send Message",
    "footer.copyright": "© 2025 All rights reserved.",
    "projects.description": "Here are some of my projects showcasing my skills and experience in web development.",
  },
  es: {
    "nav.home": "Inicio",
    "nav.skills": "Habilidades",
    "nav.projects": "Proyectos",
    "nav.education": "Educación",
    "nav.contact": "Contacto",
    "home.title": "Hola. Soy Luis!",
    "home.description1": "¡Bienvenido a mi portafolio!",
    "home.description2": "Apasionado por la tecnología y el desarrollo web.",
    "home.description3": "Estudio la carrera de Ingeniería de Software.",
    "home.description4": "Listo para crear soluciones innovadoras.",
    "home.subtitle": "Estudio la carrera de Ingeniería de Software.",
    "home.description": "Soy estudiante de Ing. de Software (7.º semestre). Construyo APIs con Java (Spring Boot) y .NET, y frontends con React/Next. Manejo PostgreSQL/MySQL y Docker; trabajo con Git/GitHub y metodologías Scrum/Kanban. Busco prácticas/desarrollador junior para aportar en backend o full-stack. Me considero sociable, con capacidad para trabajar en equipo y aportar soluciones efectivas.",
    "home.cta": "Ver Mi Trabajo",
    "skills.title": "Habilidades",
    "skills.description": "Tecnologías y herramientas con las que trabajo",
    "projects.title": "Proyectos",
    "projects.description": "Aquí hay algunos de mis proyectos que muestran mis habilidades y experiencia en el desarrollo web.",
    "education.title": "Educación",
    "education.description": "Mi formación académica y certificaciones",
    "contact.title": "Ponte en Contacto",
    "contact.description": "Trabajemos juntos en tu próximo proyecto",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.address": "Dirección",
    "contact.name": "Nombres",
    "contact.message": "Mensaje",
    "contact.placeMessage": "Tu mensaje...",
    "contact.placeEmail": "example@example.com",
    "contact.placeName": " Tu nombre...",
    "contact.button": "Enviar Mensaje",
    "footer.copyright": "© 2025 Todos los derechos reservados.",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = (localStorage.getItem("language") || "en") as Language
    setLanguageState(savedLanguage)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  if (!mounted) return null

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
