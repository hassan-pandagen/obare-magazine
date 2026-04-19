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
import ReelsSection from "@/components/sections/ReelsSection";
import Marquee from "@/components/sections/Marquee";
import EditorialGrid from "@/components/sections/EditorialGrid";

export interface HomeProject {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
  imageHotspot?: { x?: number; y?: number };
  href: string;
}

export interface HomeReel {
  id: string;
  title: string;
  category: string;
  videoSrc: string;
  posterSrc: string;
  href: string;
}

export interface HomeStory {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  image: string;
  accent: string;
  href: string;
}

interface Props {
  projects: HomeProject[];
  reels: HomeReel[];
  stories: HomeStory[];
}

export default function HomeClient({ projects, reels, stories }: Props) {
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

      const playOnly = (target: HTMLVideoElement | null) => {
        sections.forEach((s) => {
          const v = s.querySelector<HTMLVideoElement>(".folder-video");
          if (v && v !== target) v.pause();
        });
        target?.play().catch(() => {});
      };

      // First card's video should be buffered eagerly — user sees it immediately
      const firstVideo = sections[0]?.querySelector<HTMLVideoElement>(".folder-video");
      if (firstVideo) {
        firstVideo.preload = "auto";
        firstVideo.load();
      }

      sections.forEach((section, i) => {
        const card = section.querySelector<HTMLElement>(".folder-card");
        const video = section.querySelector<HTMLVideoElement>(".folder-video");

        if (card) gsap.set(card, { force3D: true, willChange: "transform" });

        if (video) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            onEnter: () => playOnly(video),
            onEnterBack: () => playOnly(video),
            onLeave: () => video.pause(),
            onLeaveBack: () => video.pause(),
          });

          // Preload-ahead: when THIS card starts entering the viewport,
          // warm up the NEXT card's video so it's buffered before the user gets there.
          const nextSection = sections[i + 1];
          if (nextSection) {
            const nextVideo = nextSection.querySelector<HTMLVideoElement>(".folder-video");
            if (nextVideo) {
              ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                once: true,
                onEnter: () => {
                  nextVideo.preload = "auto";
                  nextVideo.load();
                },
              });
            }
          }
        }

        if (card && i > 0) {
          gsap.fromTo(
            card,
            { rotationZ: tiltAngle, transformOrigin: "0% 0%", force3D: true },
            {
              rotationZ: 0,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.3,
              },
            }
          );
        }
      });
    },
    { scope: stackContainerRef, dependencies: [isLoaded, projects.length] }
  );

  return (
    <>
      {!isLoaded && <Loader onComplete={handleLoadComplete} />}
      <Navbar />

      <main>
        <Hero />
        <WhyTravel />

        <div ref={stackContainerRef} className="relative">
          {projects.map((project, i) => (
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
                imageHotspot={project.imageHotspot}
                href={project.href}
              />
            </section>
          ))}
        </div>

        <ReelsSection reels={reels} />
        <Marquee />
        <EditorialGrid stories={stories} />
      </main>

      <Footer />
    </>
  );
}
