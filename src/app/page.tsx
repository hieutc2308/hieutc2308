import { SectionNav } from "@/shared/ui/section-nav";
import { TechMarquee } from "@/shared/ui/tech-marquee";
import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { Experience } from "@/features/portfolio/components/Experience";
import { Skills } from "@/features/portfolio/components/Skills";
import { Projects } from "@/features/portfolio/components/Projects";
import { Testimonials } from "@/features/portfolio/components/Testimonials";
import { Certifications } from "@/features/portfolio/components/Certifications";
import { Contact } from "@/features/portfolio/components/Contact";
import { Footer } from "@/features/portfolio/components/Footer";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Timeline" },
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

      <main className="relative z-10 overflow-x-clip">
        <Hero />
        <About />
        <Experience />
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
