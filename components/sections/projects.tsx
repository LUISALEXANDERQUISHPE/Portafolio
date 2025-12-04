"use client"

import { useI18n } from "@/components/i18n-provider"
import { motion } from "framer-motion"
import { Github, ExternalLink, Monitor, Smartphone } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { url } from "inspector"

const farmaYaWebImages = [
  "/Proyectos/FamaYa/Web/FarmaYaLogin.png",
  "/Proyectos/FamaYa/Web/FarmaYa Dash.png",
  "/Proyectos/FamaYa/Web/FarmaYaUsers.png",
  "/Proyectos/FamaYa/Web/FarmaYaProfile.png",
  "/Proyectos/FamaYa/Web/FarmaYaDiscount.png",
  "/Proyectos/FamaYa/Web/FarmaYa (1).png",
  "/Proyectos/FamaYa/Web/FarmaYa (2).png",
]

const farmaYaMobileImages = [
  "/Proyectos/FamaYa/Mobile/Farmaya.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa2.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa3.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa5.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa7.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa6.jpg",
  "/Proyectos/FamaYa/Mobile/FarmaYa8.jpg",
]

const huellitaSoftWebImages = [
  "/Proyectos/HuellitaSoft/Web/HuellitaSoft.png",
  "/Proyectos/HuellitaSoft/Web/HuelliaSoftDash.png",
  "/Proyectos/HuellitaSoft/Web/HuellitaSoftMascotas.png",
  "/Proyectos/HuellitaSoft/Web/HuellitaSoftPets.png",
  "/Proyectos/HuellitaSoft/Web/HuellitaSoftPet.png",
  "/Proyectos/HuellitaSoft/Web/HuellitaSoftVet.png",
]

const huellitaSoftMobileImages = [
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftLogin.jpg",
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftInicio.jpg",
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoft.jpg",
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftPet.jpg",
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftPetDetail.jpg",
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftCitas.jpg",
  "/Proyectos/HuellitaSoft/Mobile/HuellitaSoftAgendaCite.jpg",
]
const walkSeguros = [
  "/Proyectos/WalkSeguros/WalkSegurosLogin.jpg",
  "/Proyectos/WalkSeguros/WalkAdmin.jpg",
  "/Proyectos/WalkSeguros/WalkAgente.jpg",
  "/Proyectos/WalkSeguros/WalkClient.jpg",
  "/Proyectos/WalkSeguros/WalkBaseDATOS.jpg",
]
const gestionClinica = [
  "/Proyectos/GestionClinicas/Web/GestionClinicaLogin.png",
  "/Proyectos/GestionClinicas/Web/GestionClinica (2).png",
  "/Proyectos/GestionClinicas/Web/GestionClinica (3).png",
  "/Proyectos/GestionClinicas/Web/GestionClinica (4).png",
]
const projectsData = {
  en: [
    {
      title: "Online Pharmacy Platform",
      description: "Online medicine trading solution with integration for both web administrators and mobile app clients.",
      mobileImages: farmaYaMobileImages,
      webImages: farmaYaWebImages,
      hasToggle: true,
      tags: ["Next.js", "Nestjs","React Native", "PostgreSQL", "Vercel", "Render", "Neon"],
      githubRepos: [
        { label: "Backend", url: "https://github.com/HamiltonStJJ/FarmaYaBackEnd.git" },
        { label: "Frontend", url: "https://github.com/W1llAn/Frontend_Huellitasoft.git" },
        { label: "Mobile", url: "https://github.com/W1llAn/HuellitasMobile.git  " },
      ],
      live: "https://farmayabackend.onrender.com/farmaya/docs",
    },
    {
      title: "Veterinary Management System",
      description: "Complete veterinary clinic management system with web admin panel and mobile app for pet owners.",
      webImages: huellitaSoftWebImages,
      mobileImages: huellitaSoftMobileImages,
      hasToggle: true,
      tags: ["React + Vite", "Auth0", "Springboot", "React Native", "PostgreSQL"],
      githubRepos: [
        { label: "Backend", url: "https://github.com/W1llAn/Backend_Huellitasoft.git" },
        { label: "Frontend", url: "https://github.com/W1llAn/Frontend_Huellitasoft.git" },
        { label: "Mobile", url: "https://github.com/W1llAn/Mobile_Huellitasoft.git" },
      ],
      live: "https://example.com",
    },
    {
      title: "Walk Seguros",
      description: "Insurance management system divided into three roles (Administrator, Agent, and Client) for policy management, client registration, and automated document management. This project reflects best practices in architecture and seamless client-server integration, ideal for process automation in insurance environments.",
      images: walkSeguros,
      tags: ["React + Vite", "JWT", "Springboot", "PostgreSQL"],
      githubRepos: [
        { label: "Backend", url: "https://github.com/IsmaelSailema20/GestionSegurosBackend.git" },
        { label: "Frontend", url: "https://github.com/IsmaelSailema20/GestionSegurosFrontend.git" },
      ],
      live: "https://gestion-seguros-frontend.vercel.app/",
    },
    {
      title: "Hospital management with branches.",
      description: "Hospital management project that allows you to efficiently manage multiple branches, staff, medical appointments, and patient records nationwide.", images: gestionClinica,
      tags: ["React + Vite ", "ASP.Net Core ", "MariDb", "Grcp"],
      gitHubRepos: [{ label: "Backend", url: "https://github.com/W1llAn/GestionHospitalesBackend.git" },
      { label: "Frontend", url: "https://github.com/W1llAn/GestionHospitalesFrontend.git " }],
    },
  ],
  es: [
    {
      title: "Plataforma de Farmacia en Línea",
      description: "Solución de comercio de medicinas online con integración tanto para administradores web y para clientes app  móviles.",
      mobileImages: farmaYaMobileImages,
      webImages: farmaYaWebImages,
      hasToggle: true,
      tags: ["Next.js", "Nestjs","React Native", "PostgreSQL", "Vercel", "Render", "Neon"],
      githubRepos: [
        { label: "Backend", url: "https://github.com/HamiltonStJJ/FarmaYaBackEnd.git" },
        { label: "Frontend", url: "https://github.com/W1llAn/Frontend_Huellitasoft.git" },
        { label: "Mobile", url: "https://github.com/W1llAn/HuellitasMobile.git  " },
      ],
      live: "https://farmayabackend.onrender.com/farmaya/docs",
    },
    {
      title: "Sistema de Gestión Veterinaria",
      description: "Sistema completo de gestión de clínica veterinaria con panel web para administradores y app móvil para dueños de mascotas.",
      webImages: huellitaSoftWebImages,
      mobileImages: huellitaSoftMobileImages,
      hasToggle: true,
      tags: ["React + Vite", "Auth0", "Springboot", "React Native", "PostgreSQL"],
      githubRepos: [
        { label: "Backend", url: "https://github.com/W1llAn/Backend_Huellitasoft.git" },
        { label: "Frontend", url: "https://github.com/W1llAn/Frontend_Huellitasoft.git" },
        { label: "Mobile", url: "https://github.com/W1llAn/Mobile_Huellitasoft.git" },
      ],
      live: "https://example.com",
    },
    {
      title: "Walk Seguros",
      description: "Sistema de gestión de seguros divido en 3 roles (Administrador, Agente y Cliente) manejo de pólizas, registro de clientes, y gestión de documentos automatizados. Este proyecto refleja buenas prácticas de arquitectura y una integración fluida entre el cliente y el servidor, ideal para la automatización de procesos en entornos aseguradores.",
      images: walkSeguros,
      tags: ["React + Vite", "JWT", "Springboot", "PostgreSQL"],
      githubRepos: [
        { label: "Backend", url: "https://github.com/IsmaelSailema20/GestionSegurosBackend.git" },
        { label: "Frontend", url: "https://github.com/IsmaelSailema20/GestionSegurosFrontend.git" },
      ],
      live: "https://gestion-seguros-frontend.vercel.app/",
    },
    {
      title: "Gestión de Hospitales con sucursales.",
      description: "Proyecto de gestión hospitalaria que permite administrar múltiples sucursales, gestionar personal, gestionar citas médicas, historiales de pacientes a nivel nacional de manera eficiente.",
      images: gestionClinica,
      tags: ["React + Vite ", "ASP.Net Core ", "MariDb", "Grcp"],
      gitHubRepos: [{ label: "Backend", url: "https://github.com/W1llAn/GestionHospitalesBackend.git" },
      { label: "Frontend", url: "https://github.com/W1llAn/GestionHospitalesFrontend.git " }],
      live: "https://example.com",
    },
  ],
}

// Componente para tarjeta de proyecto con carrusel
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [viewMode, setViewMode] = useState<"web" | "mobile">("web")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Determinar qué imágenes mostrar
  const currentImages = project.hasToggle
    ? viewMode === "web"
      ? project.webImages
      : project.mobileImages
    : project.images || []

  const singleImage = project.image

  const handleImageClick = (imgIndex: number) => {
    setSelectedImageIndex(imgIndex)
    setIsDialogOpen(true)
  }

  const handleNextImage = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImageIndex((prev) => (prev + 1) % currentImages.length)
      setIsTransitioning(false)
    }, 150)
  }

  const handlePrevImage = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
      setIsTransitioning(false)
    }, 150)
  }

  return (
    <motion.article
      key={project.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-card dark:bg-dark-card rounded-xl overflow-hidden border border-border dark:border-dark-border hover:shadow-lg transition-shadow"
    >
      {/* Toggle buttons for web/mobile */}
      {project.hasToggle && (
        <div className="flex gap-2 p-4 bg-muted/50 dark:bg-dark-muted/50">
          <Button
            size="sm"
            variant={viewMode === "web" ? "default" : "outline"}
            onClick={() => setViewMode("web")}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Web
          </Button>
          <Button
            size="sm"
            variant={viewMode === "mobile" ? "default" : "outline"}
            onClick={() => setViewMode("mobile")}
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Móvil
          </Button>
        </div>
      )}

      {/* Carousel or single image */}
      <div className="relative h-96 overflow-hidden bg-muted dark:bg-dark-muted">
        {currentImages.length > 0 ? (
          <Carousel
            className="w-full h-full"
            opts={{
              loop: true,
              align: "center",
            }}
          >
            <CarouselContent>
              {currentImages.map((image: string, imgIndex: number) => (
                <CarouselItem key={imgIndex}>
                  <div
                    className="relative w-full h-96 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(imgIndex)}
                  >
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${imgIndex + 1}`}
                      fill
                      className="object-contain bg-white dark:bg-gray-900 p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900" />
            <CarouselNext className="right-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900" />
          </Carousel>
        ) : singleImage ? (
          <img
            src={singleImage}
            alt={`${project.title} project screenshot`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
      </div>

      {/* Modal para ver imagen en grande con navegación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[75vw]! h-[92vh] p-0 bg-white dark:bg-white">
          <div className="relative w-full h-full flex items-center justify-center bg-white">
            {/* Imagen actual con transición suave */}
            <div
              className={`relative w-full h-full p-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
            >
              <Image
                key={selectedImageIndex}
                src={currentImages[selectedImageIndex]}
                alt={`${project.title} screenshot ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Botones de navegación */}
            {currentImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-full w-14 h-14 shadow-lg transition-all duration-200"
                  onClick={handlePrevImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-full w-14 h-14 shadow-lg transition-all duration-200"
                  onClick={handleNextImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </>
            )}

            {/* Indicador de posición */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-100 border border-gray-300 px-5 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-lg">
              {selectedImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-2">
          {project.title}
        </h3>
        <p className="text-muted-foreground dark:text-dark-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {/* Múltiples repos de GitHub o uno solo */}
          {project.githubRepos ? (
            project.githubRepos.map((repo: { label: string; url: string }) => (
              <a
                key={repo.label}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary transition-colors"
                aria-label={`View ${project.title} ${repo.label} code on GitHub`}
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                {repo.label}
              </a>
            ))
          ) : project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary transition-colors"
              aria-label={`View ${project.title} code on GitHub`}
            >
              <Github className="w-5 h-5" aria-hidden="true" />
              Code
            </a>
          ) : null}

          {/* Live demo link */}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary transition-colors"
              aria-label={`View ${project.title} live demo`}
            >
              <ExternalLink className="w-5 h-5" aria-hidden="true" />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function Projects() {
  const { t, language } = useI18n()
  const projects = projectsData[language]

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8" aria-label="Projects section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-dark-foreground mb-4">
            {t("projects.title")}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground">
           {t("projects.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
