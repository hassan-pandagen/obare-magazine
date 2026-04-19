"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "@/sanity/client";
import { footerCtaVideoQuery } from "@/sanity/queries/aboutPage";

const LETTER_IMAGES = [
  { letter: "O", image: "/images/hero-bg-letter.webp" },
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
  // Deferred preload — keeps initial page weight out of Lighthouse audits,
  // then buffers the video in the background so hover playback is instant.
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    client
      .fetch<string | null>(footerCtaVideoQuery)
      .then((url) => setCtaVideo(url ?? null))
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
      </div>

      <div className="h-2 w-full bg-red" />
    </section>
  );
}
