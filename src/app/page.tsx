"use client";

import { useState, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/layout/Loader";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WhyTravel from "@/components/sections/WhyTravel";
import FolderSection from "@/components/sections/FolderSection";
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
  },
  {
    id: 2,
    title: "Traveling Light",
    subtitle: "Exploring the world through a lens that's authentic and unapologetic.",
    category: "Travel",
    author: "Amara Keita",
    imageSrc: "/images/traveling.png",
  },
  {
    id: 3,
    title: "The Magazine That's Real",
    subtitle: "We believe in raw expression, bold creativity, and stories that move people.",
    category: "About OBARE",
    author: "OBARE Editorial",
    videoSrc: "/videos/who-we-are.mp4",
  },
  {
    id: 4,
    title: "Raw Expression",
    subtitle: "My visual universe is surrealistic, colorful and dark at the same time.",
    category: "Editorial",
    author: "Zara Osei",
    imageSrc: "/images/magazine-real.png",
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

      sections.forEach((section, i) => {
        const card = section.querySelector<HTMLElement>(".folder-card");

        if (card && i > 0) {
          const isMobile = window.innerWidth < 768;
          const tiltAngle = isMobile ? 6 : 10;

          gsap.fromTo(
            card,
            {
              yPercent: 110,
              rotationZ: tiltAngle,
            },
            {
              yPercent: 0,
              rotationZ: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 30%",
                scrub: 0.5,
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

        <div ref={stackContainerRef}>
          {PROJECTS.map((project, i) => (
            <section
              key={project.id}
              className="folder-section relative h-[150vh] w-full"
              style={{ zIndex: i + 10 }}
            >
              <div className="sticky top-0 h-screen w-full overflow-hidden">
                <FolderSection
                  title={project.title}
                  subtitle={project.subtitle}
                  category={project.category}
                  author={project.author}
                  videoSrc={project.videoSrc}
                  imageSrc={project.imageSrc}
                />
              </div>
            </section>
          ))}
        </div>

        <Marquee />
        <EditorialGrid />
        <FooterCTA />
      </main>

      <Footer />
    </>
  );
}