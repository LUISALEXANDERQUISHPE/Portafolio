"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { site } from "@/lib/site"

export type Language = "es" | "en"

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
    "home.greeting": "Hi, I'm",
    "home.description1": "Welcome to my portfolio!",
    "home.description2": "Passionate about technology and web development.",
    "home.description3": "I'm studying Software Engineering.",
    "home.description4": "Ready to create innovative solutions.",
    "home.description":
      `Software Engineering student (${site.semester}th semester). I build APIs with Java (Spring Boot) and .NET, and frontends with React/Next. I'm proficient in PostgreSQL/MySQL and Docker; I work with Git/GitHub and Scrum/Kanban methodologies. I'm looking for an internship/junior developer position to contribute to backend or full-stack development. I consider myself sociable, with the ability to work in a team and contribute effective solutions.`,
    "home.cta": "View My Work",
    "home.available": "Open to work",
    "home.stat.projects": "Projects",
    "home.stat.tech": "Technologies",
    "home.stat.awardValue": "2nd place",
    "home.stat.award": "Programming contest 2025",
    "skills.title": "Skills",
    "skills.description": "Technologies and tools I work with",
    "projects.title": "Projects",
    "projects.description": "Here are some of my projects showcasing my skills and experience in web development.",
    "projects.web": "Web",
    "projects.mobile": "Mobile",
    "projects.live": "Live",
    "education.title": "Education",
    "education.description": "My academic background and certifications",
    "education.degree": "Degree",
    "education.course": "Course",
    "education.event": "Congress",
    "education.award": "Award",
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
    "contact.sending": "Sending...",
    "contact.sent": "Message sent!",
    "contact.error": "The message could not be sent. Please try again.",
    "footer.copyright": "All rights reserved.",
  },
  es: {
    "nav.home": "Inicio",
    "nav.skills": "Habilidades",
    "nav.projects": "Proyectos",
    "nav.education": "Educación",
    "nav.contact": "Contacto",
    "home.greeting": "Hola, soy",
    "home.description1": "¡Bienvenido a mi portafolio!",
    "home.description2": "Apasionado por la tecnología y el desarrollo web.",
    "home.description3": "Estudio la carrera de Ingeniería de Software.",
    "home.description4": "Listo para crear soluciones innovadoras.",
    "home.description":
      `Soy estudiante de Ing. de Software (${site.semester}.º semestre). Construyo APIs con Java (Spring Boot) y .NET, y frontends con React/Next. Manejo PostgreSQL/MySQL y Docker; trabajo con Git/GitHub y metodologías Scrum/Kanban. Busco prácticas/desarrollador junior para aportar en backend o full-stack. Me considero sociable, con capacidad para trabajar en equipo y aportar soluciones efectivas.`,
    "home.cta": "Ver Mi Trabajo",
    "home.available": "Disponible",
    "home.stat.projects": "Proyectos",
    "home.stat.tech": "Tecnologías",
    "home.stat.awardValue": "2.º lugar",
    "home.stat.award": "Concurso de programación 2025",
    "skills.title": "Habilidades",
    "skills.description": "Tecnologías y herramientas con las que trabajo",
    "projects.title": "Proyectos",
    "projects.description": "Aquí hay algunos de mis proyectos que muestran mis habilidades y experiencia en el desarrollo web.",
    "projects.web": "Web",
    "projects.mobile": "Móvil",
    "projects.live": "Demo",
    "education.title": "Educación",
    "education.description": "Mi formación académica y certificaciones",
    "education.degree": "Carrera",
    "education.course": "Curso",
    "education.event": "Congreso",
    "education.award": "Logro",
    "contact.title": "Ponte en Contacto",
    "contact.description": "Trabajemos juntos en tu próximo proyecto",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.address": "Dirección",
    "contact.name": "Nombres",
    "contact.message": "Mensaje",
    "contact.placeMessage": "Tu mensaje...",
    "contact.placeEmail": "example@example.com",
    "contact.placeName": "Tu nombre...",
    "contact.button": "Enviar Mensaje",
    "contact.sending": "Enviando...",
    "contact.sent": "¡Mensaje enviado!",
    "contact.error": "No se pudo enviar el mensaje. Por favor intenta de nuevo.",
    "footer.copyright": "Todos los derechos reservados.",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // El servidor renderiza en inglés; al cargar se aplica el idioma guardado.
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    try {
      if (localStorage.getItem("language") === "es") setLanguageState("es")
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem("language", lang)
    } catch {}
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
