"use client"

import type React from "react"

import { useI18n } from "@/components/i18n-provider"
import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Phone, MapPin } from "lucide-react"
import emailjs from "@emailjs/browser"

export function Contact() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,       
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,    
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Luis Alexander Quishpe', 
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!       
      )

      setSubmitted(true)
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" })
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Error sending email:', err)
      setError('Error al enviar el mensaje. Por favor intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8" aria-label="Contact section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-dark-foreground mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground">
            {t("contact.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-primary dark:text-dark-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">{t("contact.email")}</h3>
                <a
                  href="mailto:hello@example.com"
                  className="text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary transition-colors"
                  aria-label="Send email to hello@example.com"
                >
                  lquishpe1021@gmail.com
                  <br />
                  lquishpe5771@uta.edu.ec
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-primary dark:text-dark-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">{t("contact.phone")}</h3>
                <a
                  href="tel:+1234567890"
                  className="text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary transition-colors"
                  aria-label="Call +1 (234) 567-890"
                >
                  0967685140
                  <br />
                  0962803404
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary dark:text-dark-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">{t("contact.address")}</h3>
                <p className="text-muted-foreground dark:text-dark-muted-foreground">Victor Hugo - Av.Los Atis <br /> Ambato- Tungurahua - Ecuador </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-label="Contact form"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2"
              >
                {t("contact.name")} <span aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                placeholder={t("contact.placeName")}
                aria-label="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2"
              >
                {t("contact.email")} <span aria-label="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                placeholder={t("contact.placeEmail")}
                aria-label="Your email"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2"
              >
                {t("contact.message")} <span aria-label="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary resize-none"
                placeholder={t("contact.placeMessage")}
                aria-label="Your message"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3 bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-background disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {sending ? "Enviando..." : submitted ? "¡Mensaje Enviado!" : t("contact.button")}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
