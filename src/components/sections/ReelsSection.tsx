"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { optimizeImg } from "@/lib/sanityImg";
import { RedEmphasis } from "@/lib/redEmphasis";
import ReelModal from "@/components/sections/ReelModal";
import "swiper/css";
import "swiper/css/pagination";

interface Reel {
  id: string | number;
  title: string;
  category: string;
  videoSrc: string;
  posterSrc: string;
  href: string;
}

export default function ReelsSection({ reels = [] }: { reels?: Reel[] }) {
  if (reels.length === 0) return null;
  const sectionRef = useRef<HTMLElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Pause all videos when the section scrolls out of view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          section.querySelectorAll<HTMLVideoElement>("video").forEach((v) => v.pause());
        }
      },
      { threshold: 0 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current || !desktopGridRef.current) return;
      // Desktop-only domino animation. Mobile uses a Swiper (no GSAP).
      if (window.innerWidth < 768) return;

      const fallAngle = 88;
      const items = gsap.utils.toArray<HTMLElement>(
        ".reel-item-desktop",
        desktopGridRef.current
      );

      gsap.set(items, {
        rotationZ: -70,
        xPercent: 35,
        yPercent: 45,
        opacity: 0,
        transformOrigin: "100% 100%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      items.forEach((item, i) => {
        tl.to(
          item,
          {
            rotationZ: 0,
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 1,
          },
          i
        );
      });

      tl.addLabel("exit", 5);

      items.forEach((item, i) => {
        tl.to(
          item,
          {
            rotationZ: fallAngle,
            yPercent: 15,
            opacity: 0,
            ease: "power2.in",
            duration: 0.8,
          },
          `exit+=${i * 0.35}`
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black md:h-[220vh]"
    >
      {/* ===== DESKTOP LAYOUT — sticky scroll + domino animation (unchanged) ===== */}
      {/* items-start + top padding: items-center was clipping the heading on
         laptops where heading + 9:16 grid + footer link totalled > 100vh, so
         the top of "THE MOVING PICTURE" was disappearing above the sticky
         viewport's overflow-hidden boundary. */}
      <div className="sticky top-0 hidden h-screen w-full overflow-hidden md:flex md:items-start md:pt-16 lg:pt-20">
        <div className="mx-auto w-full max-w-[1600px] px-10 lg:px-16">
          <div className="mb-10 lg:mb-12">
            <span className="block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
              In Motion
            </span>
            <h2 className="mt-3 font-poppins text-5xl font-black uppercase leading-[0.9] text-white lg:text-6xl">
              The Moving Picture
            </h2>
          </div>

          <div
            ref={desktopGridRef}
            className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-4"
          >
            {reels.map((reel) => (
              <DesktopReel
                key={reel.id}
                reel={reel}
                onOpen={() => setActiveReel(reel)}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <a
              href="/reels"
              className="group inline-flex items-center gap-3 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:text-red"
            >
              View All Videos
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ===== MOBILE LAYOUT: INSTAGRAM-STYLE SWIPER ===== */}
      <div className="flex w-full flex-col items-center py-14 md:hidden">
        {/* Header */}
        <div className="px-5 text-center">
          <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-red">
            In Motion
          </span>
          <h2 className="mt-2 font-poppins text-3xl font-black uppercase leading-[0.9] text-white">
            The Moving
            <br />
            Picture
          </h2>
        </div>

        {/* Swiper carousel — one reel per view, swipe to advance */}
        <div className="reels-mobile-swiper mt-8 w-full">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.15}
            centeredSlides
            spaceBetween={14}
            pagination={{ clickable: true }}
            onSlideChange={(sw) => setActiveIdx(sw.activeIndex)}
            className="px-5"
          >
            {reels.map((reel, i) => (
              <SwiperSlide key={reel.id}>
                <MobileSwiperReel
                  reel={reel}
                  isActive={activeIdx === i}
                  onOpen={() => setActiveReel(reel)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Active reel info */}
        <div className="mt-6 flex flex-col items-center gap-4 px-5 text-center">
          <div className="min-h-[60px]">
            <span className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.35em] text-red">
              {reels[activeIdx]?.category}
            </span>
            <a
              href={reels[activeIdx]?.href ?? "#"}
              className="mt-2 inline-flex items-baseline gap-2 font-poppins text-xl font-black uppercase text-white"
            >
              <RedEmphasis>{reels[activeIdx]?.title}</RedEmphasis>
              <span className="text-xs">&rarr;</span>
            </a>
          </div>
          <a
            href="/reels"
            className="group inline-flex items-center gap-2 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-white"
          >
            View All Videos
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>
      </div>

      {activeReel && (
        <ReelModal reel={activeReel} onClose={() => setActiveReel(null)} />
      )}
    </section>
  );
}

/* =============== DESKTOP REEL =============== */

function DesktopReel({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
    setIsPaused(false);
  };
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setIsPaused(true);
    setControlsVisible(false);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
  };

  const handleCardClick = () => {
    setControlsVisible((v) => !v);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPaused(false); }
    else { v.pause(); setIsPaused(true); }
    showControls();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    showControls();
  };

  useEffect(() => () => { if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current); }, []);

  return (
    <div ref={itemRef} className="reel-item-desktop">
      <div
        className="relative w-full overflow-hidden rounded-xl bg-zinc-900 cursor-pointer"
        style={{ aspectRatio: "9 / 16" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={optimizeImg(reel.posterSrc, { w: 380 })}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
          {reel.category}
        </span>

        {/* Instagram-style controls — appear on click, auto-hide after 2.5s */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPaused ? "Play" : "Pause"}
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-red ${controlsVisible ? "pointer-events-auto" : ""}`}
          >
            {isPaused ? (
              <svg width="24" height="28" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0L14 8L0 16V0Z" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="0.5" /><rect x="14" y="4" width="4" height="16" rx="0.5" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-red ${controlsVisible ? "pointer-events-auto" : ""}`}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>

        {/* Expand to fullscreen */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition-all hover:bg-red hover:text-white"
          aria-label="Open fullscreen"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>
      <a
        href={reel.href}
        className="group/title mt-4 inline-flex items-baseline gap-2 font-poppins text-lg font-black uppercase leading-tight text-white transition-colors hover:text-red xl:text-xl"
      >
        <RedEmphasis>{reel.title}</RedEmphasis>
        <span className="inline-block text-sm transition-transform duration-500 group-hover/title:translate-x-1">
          &rarr;
        </span>
      </a>
    </div>
  );
}

/* =============== MOBILE SWIPER REEL =============== */

function MobileSwiperReel({
  reel,
  isActive,
  onOpen,
}: {
  reel: Reel;
  isActive: boolean;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) { v.play().catch(() => {}); setIsPaused(false); }
    else { v.pause(); v.currentTime = 0; setControlsVisible(false); }
  }, [isActive]);

  useEffect(() => () => { if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current); }, []);

  const handleTap = () => {
    setControlsVisible((c) => !c);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPaused(false); }
    else { v.pause(); setIsPaused(true); }
    showControls();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    showControls();
  };

  return (
    <div
      onClick={handleTap}
      className="relative w-full overflow-hidden rounded-2xl bg-zinc-900 transition-[opacity,transform] duration-500 cursor-pointer"
      style={{
        aspectRatio: "9 / 16",
        opacity: isActive ? 1 : 0.55,
        transform: isActive ? "scale(1)" : "scale(0.92)",
      }}
    >
      <video
        ref={videoRef}
        src={reel.videoSrc}
        poster={optimizeImg(reel.posterSrc, { w: 500 })}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
        {reel.category}
      </span>

      {/* Instagram-style controls — tap to show, auto-hide after 2.5s */}
      <div className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0"}`}>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPaused ? "Play" : "Pause"}
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-red ${controlsVisible ? "pointer-events-auto" : ""}`}
        >
          {isPaused ? (
            <svg width="24" height="28" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0L14 8L0 16V0Z" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="0.5" /><rect x="14" y="4" width="4" height="16" rx="0.5" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-red ${controlsVisible ? "pointer-events-auto" : ""}`}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>

      {/* Expand button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition-all hover:bg-red hover:text-white"
        aria-label="Open fullscreen"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>

    </div>
  );
}
