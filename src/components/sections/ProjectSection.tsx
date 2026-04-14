"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ProjectSectionProps {
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
}

export default function ProjectSection({
  title,
  subtitle,
  category,
  author,
  videoSrc,
  imageSrc,
}: ProjectSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.set(titleRef.current, { y: 30, opacity: 0 });
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(titleRef.current, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            });
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      if (cardRef.current) observer.observe(cardRef.current);
    },
    { scope: cardRef }
  );

  return (
    <div ref={cardRef} className="flex h-full w-full flex-col">
      {/* Top half — video/image with "View project" */}
      <div className="relative flex-1 overflow-hidden">
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

        <div className="absolute right-8 top-1/2 z-10 -translate-y-1/2 md:right-16">
          <span className="font-montserrat text-sm font-bold uppercase tracking-[0.3em] text-white drop-shadow-lg">
            View project &rarr;
          </span>
        </div>
      </div>

      {/* Bottom half — white info card */}
      <div className="relative bg-white px-8 py-8 md:px-16 md:py-12">
        {/* Viewfinder lines — barely visible */}
        <div className="pointer-events-none absolute inset-4 border border-dashed border-black/[0.04] md:inset-8">
          <span className="absolute -top-3 left-0 font-montserrat text-[8px] uppercase tracking-[0.4em] text-black/10">
            Overscan
          </span>
          <span className="absolute -top-3 right-0 font-montserrat text-[8px] text-black/10">
            1920 &times; 1080
          </span>
        </div>

        {/* Category + author */}
        <div className="mb-3 flex items-center gap-4">
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

        {/* Title */}
        <h2
          ref={titleRef}
          className="font-poppins text-[10vw] font-black leading-[0.95] text-black md:text-[7vw] lg:text-[5vw]"
        >
          {title}
        </h2>

        {/* Subtitle + view project */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
  );
}
