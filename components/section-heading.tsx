"use client"

import { motion } from "framer-motion"

export function SectionHeading({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-14 max-w-2xl"
    >
      <p className="font-mono text-sm text-primary mb-3" aria-hidden="true">
        {index} <span className="text-border">————</span>
      </p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">{title}</h2>
      {description && <p className="text-lg text-muted-foreground">{description}</p>}
    </motion.div>
  )
}
