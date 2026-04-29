"use client";

import { useState, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/layout/Loader";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FolderSection from "@/components/sections/FolderSection";
import ReelsSection from "@/components/sections/ReelsSection";
import Marquee from "@/components/sections/Marquee";
import EditorialGrid from "@/components/sections/EditorialGrid";
import DebugOverlay from "@/components/DebugOverlay";

export interface HomeProject {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageHotspot?: { x?: number; y?: number };
  imageMobileSrc?: string;
  imageMobileHotspot?: { x?: number; y?: number };
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
  imageMobile?: string;
  imageAlt?: string;
  accent: string;
  href: string;
}

interface Props {
  projects: HomeProject[];
  reels: HomeReel[];
  stories: HomeStory[];
  heroHeadline?: string;
  heroSubheadline?: string;
}

export default function HomeClient({ projects, reels, stories, heroHeadline, heroSubheadline }: Props) {
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
      const tiltAngle = isMobile ? 4 : 14;
      // Mobile uses top-center pivot — the corner-pivot swings the bottom of
      // the card off-screen on narrow viewports and leaves a black wedge.
      // Top-center keeps both edges balanced inside the viewport.
      const tiltOrigin = isMobile ? "50% 0%" : "0% 0%";

      const playOnly = (target: HTMLVideoElement | null) => {
        sections.forEach((s) => {
          const v = s.querySelector<HTMLVideoElement>(".folder-video");
          if (v && v !== target) v.pause();
        });
        target?.play().catch(() => {});
      };

      // First card's video should be buffered eagerly — user sees it immediately.
      // Re-query after any layout change (mobile ↔ desktop) refreshes triggers.
      const warmFirst = () => {
        const v = sections[0]?.querySelector<HTMLVideoElement>(".folder-video");
        if (v) {
          v.preload = "auto";
          v.load();
        }
      };
      warmFirst();

      sections.forEach((section, i) => {
        const card = section.querySelector<HTMLElement>(".folder-card");
        // Resolve video via fresh querySelector INSIDE callbacks below so
        // layout-change remounts (mobile ↔ desktop) still find the right element.
        const hasInitialVideo = section.querySelector<HTMLVideoElement>(".folder-video");

        if (card) gsap.set(card, { force3D: true, willChange: "transform" });

        if (hasInitialVideo) {
          const getVideo = () => section.querySelector<HTMLVideoElement>(".folder-video");

          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            onEnter: () => playOnly(getVideo()),
            onEnterBack: () => playOnly(getVideo()),
            onLeave: () => getVideo()?.pause(),
            onLeaveBack: () => getVideo()?.pause(),
          });

          // Preload-ahead: when THIS card starts entering the viewport,
          // warm up the NEXT card's video so it's buffered before the user gets there.
          const nextSection = sections[i + 1];
          if (nextSection) {
            ScrollTrigger.create({
              trigger: section,
              start: "top 80%",
              once: true,
              onEnter: () => {
                const nv = nextSection.querySelector<HTMLVideoElement>(".folder-video");
                if (nv) {
                  nv.preload = "auto";
                  nv.load();
                }
              },
            });
          }
        }

        if (card && i > 0) {
          gsap.fromTo(
            card,
            { rotationZ: tiltAngle, transformOrigin: tiltOrigin, force3D: true },
            {
              rotationZ: 0,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.3,
                // Recompute start/end after fonts/images load and after the
                // mobile URL bar finishes its first collapse. Without this,
                // mobile triggers were locking in stale positions and the
                // rotation appeared to never run.
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // After all triggers are wired, refresh on the next frame so positions
      // reflect post-loader, post-font-swap layout. Critical on mobile where
      // the loader's clipPath unmount briefly shifts the document height.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: stackContainerRef, dependencies: [isLoaded, projects.length] }
  );

  return (
    <>
      <DebugOverlay />
      {!isLoaded && <Loader onComplete={handleLoadComplete} />}
      <Navbar />

      <main>
        <Hero headline={heroHeadline} subheadline={heroSubheadline} />

        <div ref={stackContainerRef} className="relative">
          {projects.map((project, i) => (
            <section
              key={project.id}
              className="folder-section sticky top-0 h-[110vh] w-full overflow-x-hidden md:h-[130vh]"
              style={{ zIndex: i + 10 }}
            >
              <FolderSection
                title={project.title}
                subtitle={project.subtitle}
                category={project.category}
                author={project.author}
                videoSrc={project.videoSrc}
                imageSrc={project.imageSrc}
                imageAlt={project.imageAlt}
                imageHotspot={project.imageHotspot}
                imageMobileSrc={project.imageMobileSrc}
                imageMobileHotspot={project.imageMobileHotspot}
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
