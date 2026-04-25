"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReelModal from "@/components/sections/ReelModal";
import { optimizeImg } from "@/lib/sanityImg";
import { RedEmphasis } from "@/lib/redEmphasis";

export interface ReelItem {
  id: string;
  title: string;
  category: string;
  videoSrc: string;
  posterSrc: string;
  posterAlt?: string;
  href: string;
}

/**
 * /reels index — editorial grid of every reel in the archive.
 * - Hero strip with "In Motion" eyebrow + "The Moving Picture" headline.
 * - Responsive 9:16 grid: 1 col mobile, 2 col sm, 3 col md, 4 col lg.
 * - Each tile plays a muted preview on hover (desktop) or on tap (mobile).
 * - Tap a tile → opens the same ReelModal used on the homepage (fullscreen
 *   player with swipe-down-to-close on mobile, X button on desktop).
 * - Scroll-reveal on each tile via GSAP ScrollTrigger.
 */
export default function ReelsIndexClient({ reels }: { reels: ReelItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const tiles = gridRef.current.querySelectorAll<HTMLElement>(".reel-tile");
      tiles.forEach((tile) => {
        gsap.set(tile, { y: 40, opacity: 0 });
        ScrollTrigger.create({
          trigger: tile,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(tile, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            });
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <>
      <Navbar />

      <main ref={rootRef} className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative px-6 pt-32 pb-12 md:px-14 md:pt-40 md:pb-16 lg:px-20">
          <span className="block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            In Motion
          </span>
          <h1
            className="mt-4 font-poppins font-black uppercase leading-[0.9] text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
          >
            The Moving <span className="text-red">Picture</span>
          </h1>
          <p className="mt-6 max-w-xl font-montserrat text-sm leading-relaxed text-white/55 md:text-base">
            Every reel in the OBARE archive. Short films, behind-the-lens cuts, and
            the stories we couldn&apos;t tell in words alone.
          </p>
        </section>

        {/* Grid */}
        <section className="px-6 pb-24 md:px-14 lg:px-20">
          {reels.length === 0 ? (
            <div className="mx-auto max-w-4xl py-20 text-center">
              <p className="font-montserrat text-sm text-white/50">
                No reels yet. Check back soon.
              </p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
            >
              {reels.map((reel) => (
                <ReelTile
                  key={reel.id}
                  reel={reel}
                  onOpen={() => setActiveReel(reel)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {activeReel && (
        <ReelModal reel={activeReel} onClose={() => setActiveReel(null)} />
      )}

      <Footer />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */

function ReelTile({ reel, onOpen }: { reel: ReelItem; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div className="reel-tile flex flex-col">
      <button
        onClick={onOpen}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative block w-full overflow-hidden rounded-xl bg-zinc-900"
        style={{ aspectRatio: "9 / 16" }}
        aria-label={`Play ${reel.title}`}
      >
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.posterSrc ? optimizeImg(reel.posterSrc, { w: 500 }) : undefined}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        >
          <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
          {reel.category}
        </span>

        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-red">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="white" className="ml-1">
            <path d="M0 0L14 8L0 16V0Z" />
          </svg>
        </div>
      </button>

      <a
        href={reel.href}
        className="group/title mt-4 inline-flex items-baseline gap-2 font-poppins text-lg font-black uppercase leading-tight text-white transition-colors hover:text-red"
      >
        <RedEmphasis>{reel.title}</RedEmphasis>
        <span className="inline-block text-sm transition-transform duration-500 group-hover/title:translate-x-1">
          &rarr;
        </span>
      </a>
    </div>
  );
}
