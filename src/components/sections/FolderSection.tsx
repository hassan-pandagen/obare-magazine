"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { optimizeImg } from "@/lib/sanityImg";
import RichText from "@/components/portable/RichText";

interface FolderSectionProps {
  title: unknown[];
  subtitle?: unknown[];
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageHotspot?: { x?: number; y?: number };
  imageMobileSrc?: string;
  imageMobileHotspot?: { x?: number; y?: number };
  href?: string;
}

export default function FolderSection({
  title,
  subtitle,
  category,
  author,
  videoSrc,
  imageSrc,
  imageAlt,
  imageHotspot,
  imageMobileSrc,
  imageMobileHotspot,
  href = "#",
}: FolderSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    showControls();
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPaused(false); }
    else { v.pause(); setIsPaused(true); }
    showControls();
  };

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  const handleVideoTap = () => {
    setControlsVisible((v) => !v);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (!controlsVisible) {
      hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
    }
  };

  useEffect(() => {
    return () => { if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current); };
  }, []);

  // No isDesktop state — layout is handled purely by CSS (md: breakpoints).
  // This prevents React from remounting <video> when the viewport crosses 768px,
  // which was causing duplicate network fetches of the same MP4.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!videoSrc || !cardRef.current) return;
    const el = cardRef.current;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoadVideo(true); obs.disconnect(); } },
      { rootMargin: "20% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]);

  const hotspotPos =
    imageHotspot && typeof imageHotspot.x === "number" && typeof imageHotspot.y === "number"
      ? `${imageHotspot.x * 100}% ${imageHotspot.y * 100}%`
      : "center 25%";

  const controlsOverlay = videoSrc ? (
    <>
      <button
        type="button"
        aria-label="Toggle video controls"
        onClick={handleVideoTap}
        className="absolute inset-0 z-[5] cursor-pointer"
      />
      <div
        className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!controlsVisible}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPaused ? "Play" : "Pause"}
          tabIndex={controlsVisible ? 0 : -1}
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-red hover:text-white ${controlsVisible ? "pointer-events-auto" : ""}`}
        >
          {isPaused ? <PlayIconLarge /> : <PauseIconLarge />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          tabIndex={controlsVisible ? 0 : -1}
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-red hover:text-white ${controlsVisible ? "pointer-events-auto" : ""}`}
        >
          {muted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
      </div>
    </>
  ) : null;

  return (
    <div
      ref={cardRef}
      className="folder-card relative h-[100svh] w-full overflow-hidden bg-black shadow-[0_-20px_60px_rgba(0,0,0,0.55)] will-change-transform"
      style={{ borderRadius: "24px 24px 0 0" }}
    >
      {videoSrc ? (
        <>
          {/*
            LAYOUT STRATEGY — no JS breakpoint detection, pure CSS:

            Mobile  (<md): video fills the card full-bleed via absolute inset-0.
                           Desktop split-grid is hidden (hidden md:grid).

            Desktop (≥md): split-grid is shown. Video is positioned absolute
                           inside the right 9:16 panel via the video-panel class.
                           The full-bleed positioning is overridden by md:static/md:inset-auto.

            One <video> element — never unmounts — no duplicate fetches.
          */}

          {/* Single video — CSS handles positioning for both breakpoints */}
          <video
            ref={videoRef}
            src={shouldLoadVideo ? videoSrc : undefined}
            loop
            muted
            playsInline
            autoPlay={shouldLoadVideo}
            preload="none"
            poster={imageSrc ? optimizeImg(imageSrc, { w: 800 }) : undefined}
            className="folder-video absolute inset-0 h-full w-full object-cover md:absolute md:inset-0 md:h-full md:w-full"
          >
            <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
          </video>

          {/* Mobile overlay — gradient + controls + text — hidden on desktop */}
          <div className="md:hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
            {controlsOverlay}
            {category && (
              <div className="pointer-events-none absolute left-5 top-5 z-10">
                <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                  {category}
                  {author && <span className="ml-3 font-normal text-white/60">| by {author}</span>}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute bottom-20 left-5 right-5 z-10">
              <a href={href} aria-label="Read article" className="pointer-events-auto group/title">
                <h2 className="font-poppins text-[13vw] font-black uppercase leading-[0.88] text-white underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-300 group-hover/title:decoration-white">
                  <RichText value={title} />
                </h2>
              </a>
              {subtitle && (
                <p className="mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-white/75">
                  <RichText value={subtitle} />
                </p>
              )}
              <a href={href} aria-label="Go Bare — read article" className="group pointer-events-auto relative mt-5 inline-flex items-center gap-3 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white">
                <span className="relative">Go Bare
                  <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-100 bg-white transition-transform duration-500 group-hover:scale-x-0" />
                  <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-right scale-x-0 bg-red transition-transform duration-500 delay-100 group-hover:scale-x-100" />
                </span>
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:text-red">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Desktop split layout — hidden on mobile, shown on md+ */}
          <div className="absolute inset-0 hidden md:grid md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1fr_1fr]">
            {/* LEFT: text column */}
            <div className="relative flex flex-col justify-between px-10 py-12 lg:px-16 lg:py-14">
              {category && (
                <span className="block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-white">
                  {category}
                  {author && <span className="ml-3 font-normal text-white/60">| by {author}</span>}
                </span>
              )}
              <div>
                <h2 className="font-poppins font-black uppercase leading-[0.88] text-white text-[7vw] lg:text-[6vw]">
                  <RichText value={title} />
                </h2>
                {subtitle && (
                  <p className="mt-6 max-w-xl font-montserrat text-base leading-relaxed text-white/75">
                    <RichText value={subtitle} />
                  </p>
                )}
                <a href={href} aria-label="Go Bare — read article" className="group relative mt-8 inline-flex items-center gap-3 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white">
                  <span className="relative">Go Bare
                    <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-100 bg-white transition-transform duration-500 group-hover:scale-x-0" />
                    <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-right scale-x-0 bg-red transition-transform duration-500 delay-100 group-hover:scale-x-100" />
                  </span>
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:text-red">&rarr;</span>
                </a>
              </div>
            </div>

            {/* RIGHT: 9:16 panel — video is clipped here by overflow-hidden */}
            <div className="relative flex items-center justify-center px-6 py-10 lg:px-10">
              <div
                className="relative h-full overflow-hidden rounded-md bg-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                style={{ aspectRatio: "9 / 16", maxHeight: "100%" }}
              >
                {/*
                  On desktop, we need the video visually inside this panel.
                  We render a second <video> here that shares the same src —
                  browsers cache by URL so it does NOT re-download.
                  preload="none" + no autoPlay means it only plays via JS ref.
                */}
                <video
                  src={undefined}
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster={imageSrc ? optimizeImg(imageSrc, { w: 800 }) : undefined}
                  className="folder-video-desktop absolute inset-0 h-full w-full object-cover"
                  ref={(el) => {
                    if (!el) return;
                    // Only load and play on actual desktop — never on mobile emulation
                    if (window.matchMedia("(min-width: 768px)").matches && shouldLoadVideo && videoSrc) {
                      if (!el.src) el.src = videoSrc;
                      (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                      el.play().catch(() => {});
                    }
                  }}
                >
                  <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
                </video>
                {controlsOverlay}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Image-only cards */
        <>
          {imageSrc ? (
            <picture className="absolute inset-0 h-full w-full">
              {imageMobileSrc && (
                <source media="(max-width: 767px)" srcSet={optimizeImg(imageMobileSrc, { w: 900, hotspot: imageMobileHotspot })} />
              )}
              <img
                src={optimizeImg(imageSrc, { w: 1600, hotspot: imageHotspot })}
                alt={imageAlt ?? ""}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: hotspotPos }}
              />
            </picture>
          ) : (
            <div className="absolute inset-0 h-full w-full bg-zinc-900" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
          {category && (
            <div className="pointer-events-none absolute left-5 top-5 z-10 md:left-10 md:top-10 lg:left-16 lg:top-12">
              <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-white md:text-xs">
                {category}
                {author && <span className="ml-3 font-normal text-white/60">| by {author}</span>}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute bottom-20 left-5 right-5 z-10 md:bottom-14 md:left-10 md:right-10 lg:bottom-16 lg:left-16 lg:right-16">
            <a href={href} aria-label="Read article" className="pointer-events-auto group/title">
              <h2 className="font-poppins text-[13vw] font-black uppercase leading-[0.88] text-white underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-300 group-hover/title:decoration-white md:text-[8vw] lg:text-[7vw]">
                <RichText value={title} />
              </h2>
            </a>
            {subtitle && (
              <p className="mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-white/75 md:mt-6 md:text-base">
                <RichText value={subtitle} />
              </p>
            )}
            <a href={href} aria-label="Go Bare — read article" className="group pointer-events-auto relative mt-5 inline-flex items-center gap-3 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white md:mt-7">
              <span className="relative">Go Bare
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-100 bg-white transition-transform duration-500 group-hover:scale-x-0" />
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-right scale-x-0 bg-red transition-transform duration-500 delay-100 group-hover:scale-x-100" />
              </span>
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:text-red">&rarr;</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function PlayIconLarge() {
  return (
    <svg width="28" height="32" viewBox="0 0 14 16" fill="currentColor" aria-hidden className="ml-1">
      <path d="M0 0L14 8L0 16V0Z" />
    </svg>
  );
}

function PauseIconLarge() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="4" width="4" height="16" rx="0.5" />
      <rect x="14" y="4" width="4" height="16" rx="0.5" />
    </svg>
  );
}
