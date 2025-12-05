import type React from "react"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { SkipLink } from "@/components/skip-link"

const openSans = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mi portafolio - Luis Quishpe",
  description:
    " Portafolio profesional de Luis Quishpe, desarrollador full-stack especializado en React y Next.js. Explora mis proyectos, habilidades y experiencia en desarrollo web.",
  keywords: ["portfolio", "developer", "web development", "React", "Next.js", "full-stack", "projects", "  skills", "Luis Quishpe"],
  authors: [{ name: "Luis Quishpe" }],
  creator: "Luis Quishpe",
  publisher: " Luis Quishpe",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Luis Alexander Quishpe",
              url: "https://portafolioluisalexandere.vercel.app/",
              image: "https://portafolioluisalexandere.vercel.app/profile.jpg",
              jobTitle: "Full Stack Developer",
              sameAs: [
                "https://github.com/LUISALEXANDERQUISHPE",
                "https://www.linkedin.com/in/luis-alexander-quishpe-chicaiza-940a77264/",
              ],
              description: "Portafolio profesional de Luis Quishpe, desarrollador full-stack especializado en React y Next.js. Explora mis proyectos, habilidades y experiencia en desarrollo web.",
            }),
          }}
        />
      </head>
      <body className={openSans.className}>
        <ThemeProvider>
          <I18nProvider>
            <SkipLink />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
