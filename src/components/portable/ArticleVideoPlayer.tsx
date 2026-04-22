"use client";

import { useEffect, useRef, useState } from "react";

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
 * OBARE inline video player for article bodies.
 *
 * Behavior:
 * - Shows the poster with a big red PLAY button overlay by default.
 * - Clicking PLAY plays the video WITH sound and shows native controls.
 * - A close (X) button resets the player back to its poster state.
 * - IntersectionObserver pauses the video when it scrolls out of view
 *   so users don't keep hearing audio from a video they can't see.
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
  const [playing, setPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("16 / 9");
  // Detect mobile once on mount to pick the correct source
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  const effectiveSrc = isMobile && srcMobile ? srcMobile : src;
  const effectivePoster = isMobile && posterMobile ? posterMobile : poster;

  // Read the video's natural dimensions once metadata loads so the container
  // matches (portrait videos stop getting squashed into a 16:9 box).
  const onMetadata = () => {
    const v = videoRef.current;
    if (!v?.videoWidth || !v.videoHeight) return;
    setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
  };

  // Fallback: after mount, poll the video element for dimensions every 150ms
  // for up to 3s. Handles browsers that don't fire `loadedmetadata` reliably
  // when preload="metadata" isn't honored.
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

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPlaying(true);
  };

  const close = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  // Pause when the video scrolls out of view
  useEffect(() => {
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
  }, []);

  return (
    <figure ref={figureRef} className="my-12 -mx-6 md:mx-0">
      <div
        className="relative mx-auto w-full overflow-hidden bg-zinc-900 md:rounded-sm"
        style={{ aspectRatio, maxWidth: aspectRatioIsPortrait(aspectRatio) ? "420px" : "100%" }}
      >
        <video
          ref={videoRef}
          key={effectiveSrc}
          src={effectiveSrc}
          poster={effectivePoster}
          playsInline
          onLoadedMetadata={onMetadata}
          onLoadedData={onMetadata}
          onCanPlay={onMetadata}
          // Preload metadata so the first frame shows as a natural poster even when
          // no dedicated poster image is set.
          preload="metadata"
          controls={playing}
          onEnded={() => setPlaying(false)}
          className={`h-full w-full object-contain transition-[filter] duration-500 ${
            playing ? "blur-0" : "blur-[6px] scale-105"
          }`}
        >
          <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
        </video>

        {/* PLAY overlay */}
        {!playing && (
          <button
            type="button"
            onClick={play}
            aria-label="Play video"
            className="group absolute inset-0 flex items-center justify-center"
          >
            {/* Red tint over poster for the editorial mood */}
            <div className="absolute inset-0 bg-red/40 mix-blend-multiply transition-opacity duration-300 group-hover:bg-red/55" />
            {/* Subtle dark layer so the PLAY text stays punchy regardless of image */}
            <div className="absolute inset-0 bg-black/15" />

            {/* Corner brackets (red) */}
            <Bracket position="tl" />
            <Bracket position="tr" />
            <Bracket position="bl" />
            <Bracket position="br" />

            {/* Refined PLAY button — outlined circle with triangle, PLAY lockup */}
            <span className="relative z-10 flex flex-col items-center gap-5 transition-transform duration-500 group-hover:scale-[1.04]">
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full border-[2.5px] border-white/90 backdrop-blur-[1px] transition-all duration-500 group-hover:border-red group-hover:bg-red md:h-28 md:w-28 lg:h-32 lg:w-32">
                {/* Expanding ring on hover */}
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

        {/* Close button while playing */}
        {playing && (
          <button
            type="button"
            onClick={close}
            aria-label="Close video"
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-red hover:text-red md:right-4 md:top-4"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1L13 13M13 1L1 13" />
            </svg>
          </button>
        )}
      </div>

      {caption && (
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
