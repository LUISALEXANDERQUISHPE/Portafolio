"use client"

import { useI18n } from "./i18n-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-dark-muted dark:text-dark-muted-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("es")}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === "es"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-dark-muted dark:text-dark-muted-foreground"
        }`}
      >
        ES
      </button>
    </div>
  )
}
