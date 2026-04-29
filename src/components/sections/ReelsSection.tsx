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
      className="relative w-full bg-black md:h-[300vh]"
    >
      {/* ===== DESKTOP LAYOUT — sticky scroll + domino animation (unchanged) ===== */}
      {/* items-start + top padding: items-center was clipping the heading on
         laptops where heading + 9:16 grid + footer link totalled > 100vh, so
         the top of "THE MOVING PICTURE" was disappearing above the sticky
         viewport's overflow-hidden boundary. */}
      <div className="sticky top-0 hidden h-screen w-full overflow-hidden md:flex md:items-start md:pt-28 lg:pt-32">
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

  // Play only on hover — never autoplay all 4 simultaneously
  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div ref={itemRef} className="reel-item-desktop">
      <button
        onClick={onOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative block w-full overflow-hidden rounded-xl bg-zinc-900"
        style={{ aspectRatio: "9 / 16" }}
        aria-label={`Play ${reel.title}`}
      >
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={optimizeImg(reel.posterSrc, { w: 380 })}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        >
          <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
          {reel.category}
        </span>
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-500 group-hover:bg-red group-hover:scale-110">
          <svg
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="white"
            className="ml-1"
          >
            <path d="M0 0L14 8L0 16V0Z" />
          </svg>
        </div>
      </button>
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

  // Play the video only for the active slide; pause + reset others so audio
  // never plays over the one the user is looking at.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  return (
    <button
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-2xl bg-zinc-900 transition-[opacity,transform] duration-500"
      style={{
        aspectRatio: "9 / 16",
        opacity: isActive ? 1 : 0.55,
        transform: isActive ? "scale(1)" : "scale(0.92)",
      }}
      aria-label={`Play ${reel.title}`}
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
      <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
        {reel.category}
      </span>
      {isActive && (
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red/90 shadow-lg shadow-red/30">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="white" className="ml-0.5">
            <path d="M0 0L14 8L0 16V0Z" />
          </svg>
        </div>
      )}
    </button>
  );
}
