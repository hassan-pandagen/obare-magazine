"use client";

import { useState, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/layout/Loader";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WhyTravel from "@/components/sections/WhyTravel";
import FolderSection from "@/components/sections/FolderSection";
import ReelsSection from "@/components/sections/ReelsSection";
import Marquee from "@/components/sections/Marquee";
import EditorialGrid from "@/components/sections/EditorialGrid";
import FooterCTA from "@/components/sections/FooterCTA";

const PROJECTS = [
  {
    id: 1,
    title: "Bare Models",
    subtitle: "My visual universe is surrealistic, colorful and dark at the same time.",
    category: "Culture",
    author: "Obi Nwachukwu",
    videoSrc: "/videos/reveal-bg.mp4",
    href: "/projects/bare-models",
  },
  {
    id: 2,
    title: "Traveling Light",
    subtitle: "Exploring the world through a lens that's authentic and unapologetic.",
    category: "Travel",
    author: "Amara Keita",
    imageSrc: "/images/traveling.png",
    href: "/projects/traveling-light",
  },
  {
    id: 3,
    title: "The Magazine That's Real",
    subtitle: "We believe in raw expression, bold creativity, and stories that move people.",
    category: "About OBARE",
    author: "OBARE Editorial",
    videoSrc: "/videos/who-we-are.mp4",
    href: "/projects/the-magazine-thats-real",
  },
  {
    id: 4,
    title: "Raw Expression",
    subtitle: "My visual universe is surrealistic, colorful and dark at the same time.",
    category: "Editorial",
    author: "Zara Osei",
    imageSrc: "/images/magazine-real.png",
    href: "/projects/raw-expression",
  },
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const stackContainerRef = useRef<HTMLDivElement>(null);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useGSAP(
    () => {
      if (!stackContainerRef.current) return;

      const sections = gsap.utils.toArray<HTMLElement>(".folder-section");

      const isMobile = window.innerWidth < 768;
      const tiltAngle = isMobile ? 8 : 14;

      sections.forEach((section, i) => {
        const card = section.querySelector<HTMLElement>(".folder-card");

        if (card && i > 0) {
          gsap.fromTo(
            card,
            {
              rotationZ: tiltAngle,
              transformOrigin: "0% 0%",
            },
            {
              rotationZ: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope: stackContainerRef, dependencies: [isLoaded] }
  );

  return (
    <>
      {!isLoaded && <Loader onComplete={handleLoadComplete} />}
      <Navbar />

      <main>
        <Hero />
        <WhyTravel />

        <div ref={stackContainerRef} className="relative">
          {PROJECTS.map((project, i) => (
            <section
              key={project.id}
              className="folder-section sticky top-0 h-[110vh] w-full md:h-[130vh]"
              style={{ zIndex: i + 10 }}
            >
              <FolderSection
                title={project.title}
                subtitle={project.subtitle}
                category={project.category}
                author={project.author}
                videoSrc={project.videoSrc}
                imageSrc={project.imageSrc}
                href={project.href}
              />
            </section>
          ))}
        </div>

        <ReelsSection />
        <Marquee />
        <EditorialGrid />
        <FooterCTA />
      </main>

      <Footer />
    </>
  );
}