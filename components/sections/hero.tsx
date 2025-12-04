"use client"

import { useI18n } from "@/components/i18n-provider"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import "../../styles/hero.css"
export function Hero() {
  const { t } = useI18n()

  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center bg-[url('/bg-a.png')] bg-no-repeat bg-cover"
      aria-label="Hero section"
    >
      <div className="max-w-6xl mx-auto w-full ">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-80 md:w-96 md:h-[550px]">
              <div className="absolute inset-1  from-primary/20 to-accent/20 dark:from-dark-primary/20 dark:to-dark-accent/20 rounded-2xl blur-2xl" />
              <Image
                src="/profile.jpg"
                alt="Foto profesional"
                width={800}
                height={1000}
                className="relative w-full h-full object-cover rounded-2xl border-2 border-border dark:border-dark-border shadow-lg"
                priority
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-dark-foreground mb-4">
                {t("home.title")}
              </h1>
                <div className="words" >
                  <span className="word">{t("home.description1")}</span>
                  <span className="word">{t("home.description3")}</span>
                  <span className="word">{t("home.description2")}</span>
                  <span className="word">{t("home.description4")}</span>
                </div>
            
            </div>

            <p className="text-lg  text-white dark:text-dark-foreground leading-relaxed">
              {t("home.description")}
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                href="#projects"
                className="px-8 py-3 bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                aria-label="View my work"
              >
                {t("home.cta")}
              </Link>
              <Link
                href="#contact"
                className="px-8 py-3 border-2 text-white dark:border-white dark:text-dark-primary rounded-lg font-semibold hover:bg-white/25 dark:hover:bg-dark-primary/10 transition-colors"
                aria-label="Get in touch"
              >
                {t("contact.title")}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
