"use client";

import { useEffect, useRef } from "react";

interface FolderSectionProps {
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
  href?: string;
}

export default function FolderSection({
  title,
  subtitle,
  category,
  author,
  videoSrc,
  imageSrc,
  href = "#",
}: FolderSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(card);
    return () => io.disconnect();
  }, [videoSrc]);

  return (
    <div
      ref={cardRef}
      className="folder-card relative h-screen w-full overflow-hidden bg-black shadow-[0_-20px_60px_rgba(0,0,0,0.55)]"
      style={{ borderRadius: "24px 24px 0 0" }}
    >
      {/* Full-bleed media */}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-zinc-900" />
      )}

      {/* Legibility gradient — soft top + stronger bottom for the title */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

      {/* Top-left: category + author */}
      {category && (
        <div className="absolute left-5 top-5 z-10 md:left-10 md:top-10 lg:left-16 lg:top-12">
          <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-white md:text-xs">
            {category}
            {author && (
              <span className="ml-3 font-normal text-white/60">
                | by {author}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Bottom-left: title + subtitle + CTA */}
      <div className="absolute bottom-10 left-5 right-5 z-10 md:bottom-14 md:left-10 md:right-10 lg:bottom-16 lg:left-16 lg:right-16">
        <h2 className="font-poppins font-black uppercase leading-[0.88] text-white text-[13vw] md:text-[8vw] lg:text-[7vw]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-white/75 md:mt-6 md:text-base">
            {subtitle}
          </p>
        )}
        <a
          href={href}
          className="group relative mt-5 hidden items-center gap-3 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white md:mt-7 md:inline-flex"
        >
          <span className="relative">
            View Project
            <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-100 bg-white transition-transform duration-500 group-hover:scale-x-0" />
            <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-right scale-x-0 bg-red transition-transform duration-500 delay-100 group-hover:scale-x-100" />
          </span>
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:text-red">
            &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}