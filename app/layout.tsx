import type React from "react"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { SkipLink } from "@/components/skip-link"

const openSans = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Professional Portfolio | Developer & Designer",
  description:
    "Explore my professional portfolio showcasing web development projects, skills, and experience. Available in English and Spanish.",
  keywords: ["portfolio", "developer", "web development", "React", "Next.js", "full-stack", "projects"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Professional Portfolio",
    title: "Professional Portfolio | Developer & Designer",
    description: "Explore my professional portfolio showcasing web development projects, skills, and experience.",
    images: [
      {
        url: "https://yourportfolio.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Portfolio | Developer & Designer",
    description: "Explore my professional portfolio showcasing web development projects, skills, and experience.",
    images: ["https://yourportfolio.com/og-image.jpg"],
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: "width=device-width, initial-scale=1",
  alternates: {
    canonical: "https://yourportfolio.com",
    languages: {
      en: "https://yourportfolio.com/en",
      es: "https://yourportfolio.com/es",
    },
  },
    generator: 'v0.app'
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
              name: "Your Name",
              url: "https://yourportfolio.com",
              image: "https://yourportfolio.com/professional-profile-photo-man.jpg",
              jobTitle: "Full Stack Developer",
              sameAs: [
                "https://github.com/yourprofile",
                "https://linkedin.com/in/yourprofile",
                "https://twitter.com/yourhandle",
              ],
              description: "Professional portfolio showcasing web development projects, skills, and experience.",
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
