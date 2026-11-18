import type React from "react"
import type { Metadata, Viewport } from "next"
import { Anton, DM_Sans, Instrument_Serif, Mrs_Saint_Delafield, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/components/i18n-provider"
import { SkipLink } from "@/components/skip-link"
import { site } from "@/lib/site"

// Dos fuentes: Space Grotesk (títulos, cifras y etiquetas) y DM Sans (texto)
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" })
// Solo para la pantalla de bienvenida: firma manuscrita y frase en cursiva
const signature = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], variable: "--font-signature" })
// Letra condensada y gruesa para frases grandes de impacto (sección de contacto)
const impact = Anton({ weight: "400", subsets: ["latin"], variable: "--font-impact" })
const serif = Instrument_Serif({ weight: "400", style: "italic", subsets: ["latin"], variable: "--font-serif" })

const description =
  "Portafolio profesional de Luis Quishpe, desarrollador full-stack especializado en React y Next.js. Explora mis proyectos, habilidades y experiencia en desarrollo web."

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description,
  keywords: [
    "portfolio",
    "developer",
    "web development",
    "React",
    "Next.js",
    "full-stack",
    "projects",
    "skills",
    "Luis Quishpe",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description,
    images: ["/profile.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#13222c" },
  ],
}

// Aplica el tema antes de pintar para evitar el parpadeo. Oscuro por defecto.
// También decide si se salta la pantalla de bienvenida (ya vista en esta sesión o "reducir movimiento").
const themeScript = `try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}
try{if(sessionStorage.getItem("intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${signature.variable} ${serif.variable} ${impact.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.fullName,
              url: site.url,
              image: `${site.url}/profile.jpg`,
              jobTitle: site.role,
              sameAs: [site.github, site.linkedin],
              description,
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <I18nProvider>
          <SkipLink />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
