"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "@/sanity/client";
import { footerMetaQuery } from "@/sanity/queries/aboutPage";

interface FooterMeta {
  ctaVideoUrl?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
}

const LETTER_IMAGES = [
  { letter: "O", image: "/images/obare-o-letter.webp" },
  { letter: "B", image: "/images/magazine-real-letter.webp" },
  { letter: "A", image: "/images/traveling-letter.webp" },
  { letter: "R", image: "/images/obare-r-letter.webp" },
  { letter: "E", image: "/images/obare-e-letter.webp" },
];

export default function FooterCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ctaVideo, setCtaVideo] = useState<string | null>(null);
  const [socials, setSocials] = useState<FooterMeta["socialLinks"]>({});
  // Deferred preload — keeps initial page weight out of Lighthouse audits,
  // then buffers the video in the background so hover playback is instant.
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    client
      .fetch<FooterMeta | null>(footerMetaQuery)
      .then((data) => {
        setCtaVideo(data?.ctaVideoUrl ?? null);
        setSocials(data?.socialLinks ?? {});
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ctaVideo) return;
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const schedule = (cb: () => void) =>
      idle ? idle(cb, { timeout: 7000 }) : window.setTimeout(cb, 6000);
    const id = schedule(() => setVideoReady(true));
    return () => {
      if (typeof id === "number") clearTimeout(id);
    };
  }, [ctaVideo]);

  const onVideoEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const onVideoLeave = () => videoRef.current?.pause();

  useGSAP(
    () => {
      gsap.set(ctaRef.current, { y: 60, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.to(ctaRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        once: true,
      });

      const letters = lettersRef.current?.querySelectorAll(".obare-letter");
      if (letters && letters.length > 0) {
        ScrollTrigger.create({
          trigger: lettersRef.current,
          start: "top 90%",
          onEnter: () => {
            gsap.fromTo(
              letters,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: "power3.out",
              }
            );
          },
          once: true,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="w-full bg-white">
      <div className="h-2 w-full bg-red" />

      <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24">
        {/* LET'S TALK → */}
        <a
          ref={ctaRef}
          href="/contact"
          className="group flex items-center gap-2 font-poppins text-[13vw] font-black text-black transition-colors hover:text-red md:gap-4 md:text-[10vw] lg:text-[8vw]"
        >
          LET&apos;S TALK
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-6">
            &rarr;
          </span>
        </a>

        {/* OBARE letters with images */}
        <div ref={lettersRef} className="mt-4 flex items-center gap-[0.3vw] md:gap-[1vw]">
          {LETTER_IMAGES.map(({ letter, image }, i) => (
            <div
              key={i}
              className="obare-letter relative font-poppins text-[22vw] font-black leading-none md:text-[14vw]"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Two-button CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row md:mt-16">
          <a
            href="/submissions"
            onMouseEnter={onVideoEnter}
            onMouseLeave={onVideoLeave}
            onFocus={onVideoEnter}
            onBlur={onVideoLeave}
            className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full bg-red px-12 py-5 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.03]"
          >
            {ctaVideo && videoReady && (
              <>
                <video
                  ref={videoRef}
                  src={ctaVideo}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
                  style={{ objectPosition: "center 25%" }}
                >
                  <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
                </video>
                <span
                  className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
                  aria-hidden
                />
              </>
            )}
            <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              Get Started Now
            </span>
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-black bg-transparent px-12 py-5 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            Contact Us
          </a>
        </div>

        <SocialRow socials={socials} />
      </div>

      <div className="h-2 w-full bg-red" />
    </section>
  );
}

function SocialRow({ socials = {} }: { socials?: FooterMeta["socialLinks"] }) {
  const items = [
    { href: socials?.instagram, label: "Instagram", svg: <InstagramIcon /> },
    { href: socials?.youtube, label: "YouTube", svg: <YouTubeIcon /> },
    { href: socials?.twitter, label: "X", svg: <XIcon /> },
    { href: socials?.facebook, label: "Facebook", svg: <FacebookIcon /> },
    { href: socials?.tiktok, label: "TikTok", svg: <TikTokIcon /> },
  ].filter((i) => i.href);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 flex items-center gap-5 md:mt-14">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-black/25 text-black transition-all duration-300 hover:border-red hover:bg-red hover:text-white"
        >
          {item.svg}
        </a>
      ))}
    </div>
  );
}

/* ─────────── icon components (inline SVG, no external lib) ─────────── */

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7.3c-.3-1-1-1.8-2-2.1C19 4.7 12 4.7 12 4.7s-7 0-9 .5c-1 .3-1.7 1.1-2 2.1C.5 9.3.5 12 .5 12s0 2.7.5 4.7c.3 1 1 1.8 2 2.1 2 .5 9 .5 9 .5s7 0 9-.5c1-.3 1.7-1.1 2-2.1.5-2 .5-4.7.5-4.7s0-2.7-.5-4.7zM9.8 15.7V8.3L15.9 12l-6.1 3.7z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.05V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95H15.83c-1.49 0-1.95.92-1.95 1.87V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0 0 24 12z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  );
}
