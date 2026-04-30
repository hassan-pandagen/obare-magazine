"use client";

import { useRef, useState, useEffect } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/sanity/imageUrl";

function InlineReel({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("9/16");
  const hideTimer = useRef<number | null>(null);

  const handleMetadata = () => {
    const v = videoRef.current;
    if (!v?.videoWidth || !v.videoHeight) return;
    setAspectRatio(`${v.videoWidth}/${v.videoHeight}`);
  };

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  const handleTap = () => {
    setControlsVisible((c) => !c);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2500);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); }
    else { v.pause(); setPaused(true); }
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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) { v.pause(); setPaused(true); } },
      { threshold: 0.2 }
    );
    obs.observe(v);
    return () => { obs.disconnect(); if (hideTimer.current) window.clearTimeout(hideTimer.current); };
  }, []);

  return (
    <figure className="my-10 flex flex-col items-center">
      <div
        className={`relative mx-auto w-full cursor-pointer overflow-hidden rounded-xl bg-black ${(() => { const [w, h] = aspectRatio.split("/").map(Number); return h > w ? "max-w-[320px]" : "max-w-2xl"; })()}`}
        style={{ aspectRatio }}
        onClick={handleTap}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          onLoadedMetadata={handleMetadata}
          className="h-full w-full object-cover"
        />

        {/* Instagram-style controls — tap to show, auto-hide after 2.5s */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${controlsVisible || paused ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={paused ? "Play" : "Pause"}
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-white/20 ${controlsVisible || paused ? "pointer-events-auto" : ""}`}
          >
            {paused ? (
              <svg width="28" height="32" viewBox="0 0 14 16" fill="currentColor" className="ml-1">
                <path d="M0 0L14 8L0 16V0Z" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="0.5" />
                <rect x="14" y="4" width="4" height="16" rx="0.5" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-white/20 ${controlsVisible || paused ? "pointer-events-auto" : ""}`}
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 font-montserrat text-xs italic text-white/40">{caption}</figcaption>
      )}
    </figure>
  );
}

const components: PortableTextComponents = {
  block: {
    // Normal paragraph — with the messy-magazine drop cap on the first one.
    // The :first-child selector gives the very first body paragraph a huge red
    // first letter like a print magazine lede.
    normal: ({ children }) => (
      <p className="article-paragraph mb-7 font-montserrat text-[17px] leading-[1.85] text-white/80 md:text-lg">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-6 mt-14 font-poppins text-[10vw] font-black uppercase leading-[0.95] tracking-tight text-white md:text-5xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-12 font-poppins text-3xl font-black uppercase leading-tight text-white md:text-4xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-10 font-poppins text-2xl font-black uppercase text-white md:text-3xl">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-14 mx-auto max-w-3xl text-center font-poppins text-2xl font-black italic leading-[1.2] text-white md:text-3xl lg:text-4xl">
        <span
          aria-hidden
          className="mb-3 block font-poppins font-black text-red"
          style={{ fontSize: "3em", lineHeight: 0.5 }}
        >
          &ldquo;
        </span>
        <span className="block">{children}</span>
        <span aria-hidden className="mx-auto mt-5 block h-[2px] w-16 bg-red" />
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold text-red">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-white underline decoration-red underline-offset-2 transition-colors hover:text-red"
      >
        {children}
      </a>
    ),
  },

  types: {
    // Inline image — contained in text column on desktop, light bleed on mobile.
    // Slight tilt + alternating horizontal offset for the messy-spread feel.
    image: ({ value }) => {
      if (!value?.url && !value?.asset) return null;
      const src = value.url ?? urlFor(value).width(1200).url();
      const mobileSrc =
        value.mobileUrl ??
        (value.imageMobile?.asset ? urlFor(value.imageMobile).width(800).url() : null);
      // Deterministic tilt + horizontal nudge so layout stays stable across renders
      // but images don't all line up in a perfect column.
      const seed = (value.alt ?? " ").charCodeAt(0) || 1;
      const tilt = seed % 2 === 0 ? "-rotate-[1deg]" : "rotate-[1deg]";
      const nudge = seed % 3 === 0 ? "md:ml-auto md:mr-0" : seed % 3 === 1 ? "md:mx-auto" : "md:mr-auto md:ml-0";
      return (
        <figure
          className={`my-14 -mx-6 md:mx-0 md:w-[85%] ${nudge} ${tilt}`}
        >
          <picture>
            {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
            <img
              src={src}
              alt={value.alt ?? ""}
              className="w-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:rounded-sm"
            />
          </picture>
          {(value.caption || value.credit) && (
            <figcaption className="mt-3 flex flex-col gap-1 px-6 md:px-0">
              {value.caption && (
                <span className="font-montserrat text-xs italic text-white/50">
                  {value.caption}
                </span>
              )}
              {value.credit && (
                // Editorial credit line — tiny, uppercase, tracked, right-aligned.
                // Reads like a photographer's chop without competing with the caption.
                <span className="self-end font-archivo text-[9px] font-bold uppercase tracking-[0.35em] text-white/35 md:text-[10px]">
                  Photo &middot; {value.credit}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      );
    },

    // Inline video — same Instagram-style player, aspect ratio detected from the video itself
    inlineVideo: ({ value }) => {
      if (!value?.fileUrl) return null;
      return <InlineReel src={value.fileUrl} poster={value.posterUrl} caption={value.caption} />;
    },

    // Inline reel (9:16 portrait) — Instagram-style tap controls
    inlineReel: ({ value }) => {
      if (!value?.fileUrl) return null;
      return <InlineReel src={value.fileUrl} poster={value.posterUrl} caption={value.caption} />;
    },

    // Image gallery — contained to column width on desktop with collage-style tile tilts
    gallery: ({ value }) => {
      if (!value?.images?.length) return null;
      return (
        <figure className="my-14 -mx-6 md:mx-0">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {value.images.map(
              (img: { url: string; alt?: string; _key?: string }, i: number) => {
                const tilts = ["-rotate-[1.5deg]", "rotate-[0.8deg]", "-rotate-[0.5deg]", "rotate-[1.3deg]"];
                const tilt = tilts[i % tilts.length];
                return (
                  <img
                    key={img._key ?? i}
                    src={img.url}
                    alt={img.alt ?? ""}
                    className={`aspect-square w-full object-cover shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:rounded-sm ${tilt}`}
                  />
                );
              }
            )}
          </div>
          {value.caption && (
            <figcaption className="mt-4 px-6 font-montserrat text-xs italic text-white/50 md:px-0">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Pull quote — slightly rotated, with a big red slash mark for the messy-magazine feel
    pullQuote: ({ value }) => {
      if (!value?.quote) return null;
      const seed = (value.quote ?? "").charCodeAt(0) || 1;
      const tilt = seed % 2 === 0 ? "-rotate-[0.8deg]" : "rotate-[0.8deg]";
      return (
        <aside className={`relative my-16 -mx-4 border-y-2 border-red bg-red/5 py-12 text-center ${tilt}`}>
          <span
            aria-hidden
            className="absolute -left-2 top-1/2 block h-12 w-1 -translate-y-1/2 bg-red md:-left-4 md:h-16"
          />
          <p className="relative z-10 px-8 font-poppins text-2xl font-black italic leading-[1.15] text-white md:text-3xl lg:text-4xl">
            &ldquo;{value.quote}&rdquo;
          </p>
          {value.attribution && (
            <p className="mt-5 font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-red">
              — {value.attribution}
            </p>
          )}
        </aside>
      );
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleBody({ body }: { body: any[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Line Studio-style scroll reveals. Each paragraph, heading, figure,
  // blockquote, pullquote, and gallery fades + rises into place as the
  // reader scrolls it into view. Once it's revealed, it stays put — no
  // re-triggering on scroll-back (that's jarring while re-reading).
  useGSAP(
    () => {
      if (!rootRef.current) return;
      const targets = rootRef.current.querySelectorAll<HTMLElement>(
        ".article-paragraph, h2, h3, h4, figure, blockquote, aside"
      );
      targets.forEach((el) => {
        gsap.set(el, { y: 36, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            });
          },
        });
      });
    },
    { scope: rootRef, dependencies: [body] }
  );

  return (
    <div ref={rootRef} className="mx-auto max-w-3xl lg:max-w-4xl">
      <PortableText value={body} components={components} />
    </div>
  );
}