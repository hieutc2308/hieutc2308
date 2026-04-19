import { SectionNav } from "@/components/ui/section-nav";
import { TechMarquee } from "@/components/ui/tech-marquee";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Reviews" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

export default function HomePage() {
  return (
    <>
      <SectionNav sections={sections} />

      <main className="relative z-10">
        <Hero />
        <About />
        <TechMarquee />
        <Skills />
        <Projects />
        <Testimonials />
        <Certifications />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
