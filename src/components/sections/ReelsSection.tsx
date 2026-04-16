"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Reel {
  id: number;
  title: string;
  category: string;
  videoSrc: string;
  posterSrc: string;
  href: string;
}

const REELS: Reel[] = [
  {
    id: 1,
    title: "Bare Models",
    category: "Culture",
    videoSrc: "/videos/reels/reel-1.mp4",
    posterSrc: "/videos/reels/reel-1.jpeg",
    href: "/projects/bare-models",
  },
  {
    id: 2,
    title: "Traveling Light",
    category: "Travel",
    videoSrc: "/videos/reels/reel-2.mp4",
    posterSrc: "/videos/reels/reel-2.jpeg",
    href: "/projects/traveling-light",
  },
  {
    id: 3,
    title: "In the Studio",
    category: "Editorial",
    videoSrc: "/videos/reels/reel-3.mp4",
    posterSrc: "/videos/reels/reel-3.jpeg",
    href: "/projects/in-the-studio",
  },
  {
    id: 4,
    title: "Raw Expression",
    category: "Adventure",
    videoSrc: "/videos/reels/reel-4.mp4",
    posterSrc: "/videos/reels/reel-4.jpeg",
    href: "/projects/raw-expression",
  },
];

export default function ReelsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const isMobile = window.innerWidth < 768;

      if (isMobile && wheelRef.current) {
        // ======= MOBILE: SPIN WHEEL =======
        gsap.to(wheelRef.current, {
          rotation: -270,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
              const idx = Math.min(3, Math.round(self.progress * 3));
              setActiveIdx(idx);
            },
          },
        });
      } else if (desktopGridRef.current) {
        // ======= DESKTOP: DOMINOES =======
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
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden h-full w-full md:flex md:items-center">
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
              {REELS.map((reel) => (
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
                View All Reels
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ===== MOBILE LAYOUT: SPIN WHEEL ===== */}
        <div className="flex h-full w-full flex-col items-center justify-between py-10 md:hidden">
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

          {/* Wheel */}
          <div className="relative aspect-square w-[115vw] max-w-none shrink-0">
            {/* Faint guide circle */}
            <div className="absolute inset-[12%] rounded-full border border-white/5" />

            <div
              ref={wheelRef}
              className="absolute inset-0"
              style={{ transformOrigin: "50% 50%" }}
            >
              {REELS.map((reel, i) => (
                <WheelReel
                  key={reel.id}
                  reel={reel}
                  angle={i * 90}
                  isActive={activeIdx === i}
                  onOpen={() => setActiveReel(reel)}
                />
              ))}
            </div>
          </div>

          {/* Active reel info + dots */}
          <div className="flex flex-col items-center gap-5 px-5 text-center">
            <div className="min-h-[60px]">
              <span className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.35em] text-red">
                {REELS[activeIdx].category}
              </span>
              <a
                href={REELS[activeIdx].href}
                className="mt-2 inline-flex items-baseline gap-2 font-poppins text-xl font-black uppercase text-white"
              >
                {REELS[activeIdx].title}
                <span className="text-xs">&rarr;</span>
              </a>
            </div>

            <div className="flex gap-2">
              {REELS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeIdx === i ? "w-6 bg-red" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
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
          poster={reel.posterSrc}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
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
        {reel.title}
        <span className="inline-block text-sm transition-transform duration-500 group-hover/title:translate-x-1">
          &rarr;
        </span>
      </a>
    </div>
  );
}

/* =============== MOBILE WHEEL REEL =============== */

function WheelReel({
  reel,
  angle,
  isActive,
  onOpen,
}: {
  reel: Reel;
  angle: number;
  isActive: boolean;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [isActive]);

  return (
    <button
      onClick={isActive ? onOpen : undefined}
      className="absolute left-1/2 top-1/2 block origin-center overflow-hidden rounded-2xl bg-zinc-900 transition-[opacity,filter] duration-500"
      style={{
        width: "42%",
        aspectRatio: "9 / 16",
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60%)`,
        opacity: isActive ? 1 : 0.55,
        filter: isActive ? "none" : "brightness(0.6) saturate(0.8)",
      }}
      aria-label={`Play ${reel.title}`}
    >
      <video
        ref={videoRef}
        src={reel.videoSrc}
        poster={reel.posterSrc}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {isActive && (
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red/90">
          <svg width="12" height="14" viewBox="0 0 14 16" fill="white">
            <path d="M0 0L14 8L0 16V0Z" />
          </svg>
        </div>
      )}
    </button>
  );
}

/* =============== MODAL =============== */

function ReelModal({ reel, onClose }: { reel: Reel; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5 backdrop-blur-md md:p-10"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-red md:right-8 md:top-8"
        aria-label="Close"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>
      <div
        className="relative h-full max-h-[90vh] overflow-hidden rounded-xl bg-black"
        style={{ aspectRatio: "9 / 16" }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={reel.videoSrc}
          poster={reel.posterSrc}
          autoPlay
          loop
          controls
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}