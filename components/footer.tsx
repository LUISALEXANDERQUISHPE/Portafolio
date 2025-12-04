"use client"

import { useI18n } from "./i18n-provider"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useI18n()

  const socialLinks = [
    { icon: Github, href: "https://github.com/LUISALEXANDERQUISHPE", label: "GitHub" },
    { icon: Linkedin, href: "www.linkedin.com/in/luis-quishpe-lopez-135492230", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-muted dark:bg-dark-muted border-t border-border dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-muted-foreground dark:text-dark-muted-foreground"
          >
            {t("footer.copyright")}
          </motion.p>

          <div className="flex gap-6">
            {socialLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
