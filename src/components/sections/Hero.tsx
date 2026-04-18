"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 2.5 });

      // Letter stagger reveal — punchier
      const chars = headingRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.set(chars, { y: 200, opacity: 0, rotateX: -90, scale: 1.2 });
        tl.to(chars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.06,
          ease: "power4.out",
        });
      }

      // Red underline draws in after letters land
      if (underlineRef.current) {
        gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left" });
        tl.to(underlineRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
        }, "-=0.3");
      }

      // Subtitle fade in
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Scroll ticker marquee
      if (tickerRef.current) {
        gsap.set(tickerRef.current, { opacity: 0 });
        tl.to(tickerRef.current, { opacity: 1, duration: 0.5 }, "-=0.2");
      }

      gsap.to(bgRef.current, {
        scale: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

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

  const headingText = "TEMPORARY";

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
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
        {/* TEMPORARY */}
        <h1
          ref={headingRef}
          className="overflow-hidden whitespace-nowrap font-poppins text-[13vw] font-black leading-[0.85] tracking-tight text-white md:text-[16vw] lg:text-[14vw]"
          style={{ perspective: "800px" }}
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

        {/* Subtitle — exactly 2 lines on both mobile and desktop, centered */}
        <p
          ref={subtitleRef}
          className="mt-4 w-full text-center font-montserrat text-[13px] font-bold uppercase tracking-[0.15em] text-white md:mt-6 md:text-lg lg:text-xl"
          style={{ lineHeight: "1.4" }}
        >
          My visual universe is surrealistic, colorful,
          <br />
          and dark at the same time.
        </p>
      </div>

      {/* Scroll ticker — marquee at the very bottom */}
      <div
        ref={tickerRef}
        className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 overflow-hidden"
      >
        <div className="hero-ticker flex whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center">
              <span className="font-archivo text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 md:text-xs">
                Scroll to explore
              </span>
              <span className="mx-4 h-1 w-1 rounded-full bg-red md:mx-6" />
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
