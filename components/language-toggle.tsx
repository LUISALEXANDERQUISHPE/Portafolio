"use client"

import { useI18n, type Language } from "./i18n-provider"

const languages: Language[] = ["en", "es"]

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()

  return (
    <div className="flex rounded-lg border border-border p-0.5 font-mono text-xs">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`px-2.5 py-1 rounded-md uppercase transition-colors ${
            language === lang
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
