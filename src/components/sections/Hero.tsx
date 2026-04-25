"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  headline?: string;
  subheadline?: string;
}

export default function Hero({ headline, subheadline }: HeroProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Cinematic opening — runs once after the page loader wraps up.
      // The loader animation takes ~0.85s on first visit, then is skipped
      // entirely on repeat visits via sessionStorage. So we check the same
      // key: if the loader already ran this session, start immediately;
      // otherwise wait just long enough for the loader to slide out.
      const loaderAlreadyShown =
        typeof window !== "undefined" &&
        !!sessionStorage.getItem("obare-loader-shown");
      // On first visit the loader covers the screen for 0.85s, so the 0.7s
      // delay means the hero animation is already mid-motion when the loader
      // slides away — users see the tail-end of the reveal, not a static hero.
      const openingDelay = loaderAlreadyShown ? 0.1 : 0.7;
      const tl = gsap.timeline({ delay: openingDelay });

      // Background ken-burns — starts slightly zoomed out so the opening has
      // motion energy even before the letters land. Independent from scroll scrub.
      if (bgRef.current) {
        gsap.set(bgRef.current, { scale: 1.08 });
        gsap.to(bgRef.current, {
          scale: 1.15,
          duration: 12,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }

      // Letter reveal — mask up from below + rotateX so it reads as "rising
      // into frame". transformOrigin "bottom" pivots the flip at the baseline.
      const chars = headingRef.current?.querySelectorAll(".char");
      if (chars && chars.length) {
        gsap.set(chars, {
          y: 160,
          opacity: 0,
          rotateX: -70,
          scale: 1.15,
          clipPath: "inset(100% 0 0 0)",
        });
        tl.to(chars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          stagger: 0.07,
          ease: "power4.out",
        });
      }

      // Red underline slashes in from left, slightly overlapping last letter.
      if (underlineRef.current) {
        gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left" });
        tl.to(
          underlineRef.current,
          {
            scaleX: 1,
            duration: 0.7,
            ease: "power3.inOut",
          },
          "-=0.35"
        );
      }

      // Slogan — word-by-word reveal so the copy reads like a statement
      // landing, not a paragraph fading.
      const words = subtitleRef.current?.querySelectorAll(".slogan-word");
      if (words && words.length) {
        gsap.set(words, { y: 24, opacity: 0 });
        tl.to(
          words,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.4"
        );
      } else if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
        tl.to(
          subtitleRef.current,
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
      }

      // Ticker fades in last
      if (tickerRef.current) {
        gsap.set(tickerRef.current, { opacity: 0 });
        tl.to(tickerRef.current, { opacity: 1, duration: 0.5 }, "-=0.1");
      }

      // Scroll-linked parallax (heading drifts up, bg continues zooming)
      gsap.to(headingRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const headingText = (headline ?? "OBARE").toUpperCase();

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background image — responsive via CSS media query */}
      <div
        ref={bgRef}
        className="hero-bg-responsive absolute inset-0 bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Red accent — tight strip at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5]"
        style={{
          height: "50%",
          top: "53%",
          mixBlendMode: "multiply",
        }}
      >
        <img
          src="/images/red-accent.webp"
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-3 pb-[12vh] md:px-10 lg:px-16">
        {/* Hero wordmark — same font family as the nav logo (Archivo, bold,
           expanded width) so the two "OBARE" marks read as one identity. */}
        <h1
          ref={headingRef}
          className="overflow-hidden whitespace-nowrap font-archivo text-[13vw] font-bold leading-[0.85] tracking-[0.05em] text-white md:text-[16vw] lg:text-[14vw]"
          style={{ perspective: "800px", fontStretch: "125%" }}
        >
          {headingText.split("").map((char, i) => (
            <span
              key={i}
              className="char inline-block"
              style={{ transformOrigin: "bottom center" }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Red underline — draws in left to right after letters land */}
        <span
          ref={underlineRef}
          className="mt-2 block h-[3px] w-32 bg-red md:h-[4px] md:w-48"
        />

        {/* Subtitle — editable from Sanity. Line breaks in the Studio field
           render as <br>. Each word is wrapped so GSAP can stagger them. */}
        <p
          ref={subtitleRef}
          className="mt-5 w-full text-center font-montserrat text-[15px] font-bold uppercase tracking-[0.18em] text-white md:mt-7 md:text-xl md:tracking-[0.22em] lg:text-2xl"
          style={{ lineHeight: "1.35" }}
        >
          {(subheadline ?? "My visual universe is surrealistic, colorful,\nand dark at the same time.")
            .split(/\r?\n/)
            .map((line, li, lines) => (
              <span key={li} className="inline">
                {line.split(/(\s+)/).map((part, pi) => {
                  if (/^\s+$/.test(part)) return <span key={pi}>{part}</span>;
                  return (
                    <span key={pi} className="slogan-word inline-block will-change-transform">
                      {part}
                    </span>
                  );
                })}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
        </p>
      </div>

      {/* Scroll ticker — marquee at the very bottom. Copy pulls from the
         editorial voice; the ↓ gives it the "keep scrolling" function. */}
      <div
        ref={tickerRef}
        className="pointer-events-none absolute bottom-5 left-0 right-0 z-10 overflow-hidden md:bottom-6"
      >
        <div className="hero-ticker flex whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center">
              <span
                className="font-archivo text-sm font-bold uppercase tracking-[0.35em] text-white/85 md:text-base"
                style={{ fontStretch: "125%" }}
              >
                See What&apos;s Real
              </span>
              <span aria-hidden className="ml-3 font-archivo text-sm font-bold text-red md:ml-4 md:text-base">
                &darr;
              </span>
              <span className="mx-5 h-1.5 w-1.5 rounded-full bg-red md:mx-7" />
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
