import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { Skills } from "@/components/sections/skills"
import { Projects } from "@/components/sections/projects"
import { Education } from "@/components/sections/education"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { IntroLoader } from "@/components/intro-loader"

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Navbar />
      <main id="main-content" className="bg-background">
        <Hero />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <CustomCursor />
    </>
  )
}
