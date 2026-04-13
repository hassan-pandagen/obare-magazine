"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProjectSectionProps {
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
  nextImageSrc?: string;
  nextVideoSrc?: string;
  index: number;
}

export default function ProjectSection({
  title,
  subtitle,
  category,
  author,
  videoSrc,
  imageSrc,
  nextImageSrc,
  nextVideoSrc,
  index,
}: ProjectSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      // Title reveal when card scrolls into view
      gsap.set(titleRef.current, { y: 30, opacity: 0 });
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          });
        },
        once: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ zIndex: index }}
    >
      {/* ============================================
          PART 1: The image/video — PINNED (sticky)
          Stays locked while the white card scrolls over it
          ============================================ */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Video or image background */}
          {videoSrc ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : imageSrc ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />
          ) : null}

          {/* "View project →" floating on the image, right side */}
          <div className="absolute right-8 top-1/2 z-10 -translate-y-1/2 md:right-16">
            <span className="font-montserrat text-sm font-bold uppercase tracking-[0.3em] text-white drop-shadow-lg">
              View project &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* ============================================
          PART 2: The white info card — SCROLLS NATURALLY
          It rises up and covers the pinned image above.
          Negative margin pulls it up over the sticky image.
          ============================================ */}
      <div
        className="relative bg-white"
        style={{
          marginTop: "-100vh",
          zIndex: index + 10,
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -40px 100px rgba(0,0,0,0.3)",
        }}
      >
        {/* ---- Viewfinder overlay (barely visible metadata) ---- */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[20px]">
          {/* Outer frame — OVERSCAN */}
          <div className="absolute inset-4 border border-dashed border-black/[0.06] md:inset-8">
            <span className="absolute -top-3 left-0 font-montserrat text-[8px] uppercase tracking-[0.4em] text-black/15">
              Overscan
            </span>
            <span className="absolute -top-3 right-0 font-montserrat text-[8px] text-black/15">
              1920 &times; 1080
            </span>

            {/* Middle frame — CROP */}
            <div className="absolute inset-4 border border-dashed border-black/[0.04] md:inset-8">
              <span className="absolute -top-3 left-0 font-montserrat text-[8px] uppercase tracking-[0.3em] text-black/10">
                Crop
              </span>
              <span className="absolute -top-3 right-0 font-montserrat text-[8px] text-black/10">
                1772 &times; 996
              </span>

              {/* Inner frame — ACTION SAFE */}
              <div className="absolute inset-4 border border-dashed border-black/[0.03] md:inset-6">
                <span className="absolute -top-3 left-0 font-montserrat text-[8px] uppercase tracking-[0.3em] text-black/[0.06]">
                  Action safe
                </span>
              </div>
            </div>
          </div>

          {/* Aspect ratio — top center */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 md:top-8">
            <span className="font-montserrat text-[8px] text-black/10">
              % | 16:9 |
            </span>
          </div>
        </div>

        {/* ---- Crop window cutout showing next project ---- */}
        {(nextImageSrc || nextVideoSrc) && (
          <div className="mx-auto mt-12 w-[85%] overflow-hidden rounded-sm md:mt-16 md:w-[75%]" style={{ aspectRatio: "16/9" }}>
            {nextVideoSrc ? (
              <video
                className="h-full w-full object-cover"
                src={nextVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : nextImageSrc ? (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${nextImageSrc})` }}
              />
            ) : null}
          </div>
        )}

        {/* ---- Card content — BIG BOLD type ---- */}
        <div className="px-8 pb-16 pt-8 md:px-16 md:pb-20 md:pt-12">
          {/* Category + author */}
          <div className="mb-4 flex items-center gap-4">
            {category && (
              <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
                {category}
              </span>
            )}
            {author && (
              <>
                <span className="text-black/15">|</span>
                <span className="font-montserrat text-[10px] text-black/25">
                  by {author}
                </span>
              </>
            )}
          </div>

          {/* Title — massive */}
          <h2
            ref={titleRef}
            className="font-poppins text-[10vw] font-black leading-[0.95] text-black md:text-[7vw] lg:text-[5vw]"
          >
            {title}
          </h2>

          {/* Subtitle + view project */}
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {subtitle && (
              <p className="max-w-lg font-montserrat text-base font-medium leading-relaxed text-black/40 md:text-lg">
                {subtitle}
              </p>
            )}

            <a
              href="#"
              className="group flex shrink-0 items-center gap-3 font-montserrat text-sm font-bold uppercase tracking-widest text-black/40 transition-colors hover:text-red"
            >
              View project
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
