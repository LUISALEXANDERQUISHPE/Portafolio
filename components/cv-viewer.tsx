"use client"

import { useI18n } from "@/components/i18n-provider"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Download, ExternalLink, FileText, X } from "lucide-react"

// Archivo del CV en /public. Para actualizarlo, reemplaza el PDF y cambia este nombre.
export const CV_FILE = "/Luis_Quishpe_CV_SWE_2025.pdf"

const texts = {
  en: { button: "View CV", title: "Curriculum Vitae", download: "Download", open: "Open in new tab", close: "Close" },
  es: {
    button: "Ver CV",
    title: "Currículum Vitae",
    download: "Descargar",
    open: "Abrir en otra pestaña",
    close: "Cerrar",
  },
}

// Botón "Ver CV" que abre el PDF en una ventana flotante con el fondo desenfocado
export function CvViewer({ className = "" }: { className?: string }) {
  const { language } = useI18n()
  const text = texts[language]

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button type="button" className={className} data-cursor="view">
          <FileText className="w-5 h-5" aria-hidden="true" />
          {text.button}
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="cv-overlay fixed inset-0 z-[200] bg-[#0d1a22]/55 backdrop-blur-md" />
        <DialogPrimitive.Content
          className="cv-panel fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(94vw,980px)] h-[min(90svh,1100px)] flex flex-col rounded-2xl overflow-hidden bg-[#13222c] ring-1 ring-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] focus:outline-none"
          aria-describedby={undefined}
        >
          {/* Barra superior */}
          <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-white/10 text-white">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#dcec6b]/15 text-[#dcec6b]">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </span>
            <DialogPrimitive.Title className="font-display font-semibold mr-auto truncate">
              {text.title}
            </DialogPrimitive.Title>
            <a
              href={CV_FILE}
              download
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#dcec6b] text-[#13222c] text-sm font-semibold hover:bg-[#e8f38f] transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{text.download}</span>
            </a>
            <a
              href={CV_FILE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={text.open}
              title={text.open}
              className="grid place-items-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
            <DialogPrimitive.Close
              aria-label={text.close}
              className="grid place-items-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          {/* PDF (en móviles que no muestran PDF incrustados, el navegador ofrece abrirlo) */}
          <iframe src={`${CV_FILE}#view=FitH`} title={text.title} className="flex-1 w-full bg-neutral-200" />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
