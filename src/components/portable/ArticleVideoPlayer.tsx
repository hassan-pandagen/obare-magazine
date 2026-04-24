"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

interface Props {
  src: string;
  srcMobile?: string;
  poster?: string;
  posterMobile?: string;
  caption?: string;
}

/** Portrait videos look bad stretched full-width — cap their max width. */
function aspectRatioIsPortrait(ar: string): boolean {
  const [w, h] = ar.split("/").map((n) => parseFloat(n.trim()));
  return !!w && !!h && h > w;
}

/**
 * OBARE inline video player for article bodies (Line Studio-style).
 *
 * Inline → fullscreen FLIP expansion on PLAY.
 * Swipe-down (mobile), X button (desktop), backdrop tap, and ESC all close it.
 */
export default function ArticleVideoPlayer({
  src,
  srcMobile,
  poster,
  posterMobile,
  caption,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("16 / 9");
  const [isMobile, setIsMobile] = useState(false);

  // FLIP state captured synchronously before each state transition.
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  // Swipe-down-to-close tracking (mobile)
  const dragYRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  const effectiveSrc = isMobile && srcMobile ? srcMobile : src;
  const effectivePoster = isMobile && posterMobile ? posterMobile : poster;

  const onMetadata = () => {
    const v = videoRef.current;
    if (!v?.videoWidth || !v.videoHeight) return;
    setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let id: number;
    let attempts = 0;
    const check = () => {
      if (v.videoWidth && v.videoHeight) {
        setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
        return;
      }
      if (++attempts < 20) {
        id = window.setTimeout(check, 150);
      }
    };
    check();
    return () => window.clearTimeout(id);
  }, [effectiveSrc]);

  // After React commits the expanded class change, Flip.from replays the
  // visual transition from the captured rect to the new one.
  useLayoutEffect(() => {
    if (!frameRef.current || !flipStateRef.current) return;

    Flip.from(flipStateRef.current, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: false,
    });
    flipStateRef.current = null;

    if (backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: expanded ? 1 : 0,
        duration: expanded ? 0.4 : 0.3,
        ease: "power2.out",
      });
    }
  }, [expanded]);

  const play = () => {
    const v = videoRef.current;
    if (!v || !frameRef.current) return;

    // CAPTURE FIRST, then mutate state. This is the correct FLIP pattern with React.
    flipStateRef.current = Flip.getState(frameRef.current);

    v.muted = false;
    v.volume = 1;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPlaying(true);
    setExpanded(true);
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    if (!frameRef.current) return;

    flipStateRef.current = Flip.getState(frameRef.current);

    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setPlaying(false);
    setExpanded(false);
    document.documentElement.classList.remove("lenis-stopped");
    document.body.style.overflow = "";
  };

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Pause when inline video scrolls out of view. Disabled while expanded.
  useEffect(() => {
    if (expanded) return;
    const el = figureRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [expanded]);

  // Mobile swipe-down on expanded player
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!expanded) return;
    dragYRef.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!expanded || dragYRef.current === null || !frameRef.current) return;
    const delta = e.touches[0].clientY - dragYRef.current;
    if (delta > 0) {
      const eased = delta > 200 ? 200 + (delta - 200) * 0.35 : delta;
      frameRef.current.style.transform = `translateY(${eased}px)`;
      frameRef.current.style.opacity = String(Math.max(0.4, 1 - delta / 600));
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!expanded || dragYRef.current === null || !frameRef.current) return;
    const delta = e.changedTouches[0].clientY - dragYRef.current;
    dragYRef.current = null;
    if (delta > 90) {
      frameRef.current.style.transform = "";
      frameRef.current.style.opacity = "";
      close();
    } else {
      frameRef.current.style.transition = "transform 0.25s ease, opacity 0.25s ease";
      frameRef.current.style.transform = "translateY(0)";
      frameRef.current.style.opacity = "1";
      setTimeout(() => {
        if (frameRef.current) frameRef.current.style.transition = "";
      }, 260);
    }
  };

  const portrait = aspectRatioIsPortrait(aspectRatio);

  return (
    <figure ref={figureRef} className="my-12 -mx-6 md:mx-0">
      {/* Placeholder container — always holds the inline aspect-ratio slot so
         scroll position stays locked when the frame pops out to fullscreen. */}
      <div
        className="relative mx-auto w-full"
        style={{
          aspectRatio,
          maxWidth: portrait ? "420px" : "100%",
        }}
      >
        {/* Backdrop — fades in when expanded */}
        <div
          ref={backdropRef}
          className="fixed inset-0 z-[99] bg-black/95 backdrop-blur-md"
          style={{
            opacity: 0,
            pointerEvents: expanded ? "auto" : "none",
          }}
          onClick={close}
          aria-hidden
        />

        {/* The FLIP target. Inline: absolute-filled inside the placeholder.
            Expanded: fixed inset-0 at z-[100]. */}
        <div
          ref={frameRef}
          className={
            expanded
              ? "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
              : "absolute inset-0 overflow-hidden bg-zinc-900 md:rounded-sm"
          }
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {expanded && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-3 z-20 h-1 w-12 -translate-x-1/2 rounded-full bg-white/30 md:hidden"
            />
          )}

          <video
            ref={videoRef}
            key={effectiveSrc}
            src={effectiveSrc}
            poster={effectivePoster}
            playsInline
            onLoadedMetadata={onMetadata}
            onLoadedData={onMetadata}
            onCanPlay={onMetadata}
            preload="metadata"
            controls={playing}
            onEnded={close}
            className={
              expanded
                ? "max-h-full max-w-full object-contain"
                : `absolute inset-0 h-full w-full object-contain transition-[filter] duration-500 ${
                    playing ? "blur-0" : "blur-[6px] scale-105"
                  }`
            }
            style={expanded ? { aspectRatio, width: "auto", height: "auto" } : undefined}
          >
            <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
          </video>

          {/* Inline PLAY overlay */}
          {!playing && !expanded && (
            <button
              type="button"
              onClick={play}
              aria-label="Play video"
              className="group absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-red/40 mix-blend-multiply transition-opacity duration-300 group-hover:bg-red/55" />
              <div className="absolute inset-0 bg-black/15" />

              <Bracket position="tl" />
              <Bracket position="tr" />
              <Bracket position="bl" />
              <Bracket position="br" />

              <span className="relative z-10 flex flex-col items-center gap-5 transition-transform duration-500 group-hover:scale-[1.04]">
                <span className="relative flex h-24 w-24 items-center justify-center rounded-full border-[2.5px] border-white/90 backdrop-blur-[1px] transition-all duration-500 group-hover:border-red group-hover:bg-red md:h-28 md:w-28 lg:h-32 lg:w-32">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-white/40 opacity-0 transition-all duration-700 group-hover:scale-[1.3] group-hover:opacity-100"
                  />
                  <PlayTriangle />
                </span>
                <span className="font-archivo text-xs font-bold uppercase tracking-[0.5em] text-white/90 transition-colors duration-500 group-hover:text-white md:text-sm">
                  Play
                </span>
              </span>
            </button>
          )}

          {/* Close button — always visible when expanded. Mobile also supports swipe-down. */}
          {expanded && (
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-red hover:text-red md:right-6 md:top-6"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1L13 13M13 1L1 13" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {caption && !expanded && (
        <figcaption className="mt-3 px-6 font-montserrat text-xs text-white/50 md:px-0">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function PlayTriangle() {
  return (
    <svg
      viewBox="0 0 14 16"
      fill="currentColor"
      className="ml-1 h-7 w-6 text-white md:h-8 md:w-7"
      aria-hidden
    >
      <path d="M0 0L14 8L0 16V0Z" />
    </svg>
  );
}

function Bracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos =
    position === "tl"
      ? "left-4 top-4 border-l-[3px] border-t-[3px]"
      : position === "tr"
      ? "right-4 top-4 border-r-[3px] border-t-[3px]"
      : position === "bl"
      ? "left-4 bottom-4 border-l-[3px] border-b-[3px]"
      : "right-4 bottom-4 border-r-[3px] border-b-[3px]";
  return (
    <span
      aria-hidden
      className={`absolute h-12 w-12 border-red md:h-16 md:w-16 ${pos}`}
    />
  );
}
