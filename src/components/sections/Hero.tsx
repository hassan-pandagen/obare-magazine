"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 2.5 });

      const chars = headingRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.set(chars, { y: 150, opacity: 0, rotateX: -90 });
        tl.to(chars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "power3.out",
        });
      }

      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      });

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
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Red accent — covers bottom 55%, multiply blend over image */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5]"
        style={{
          height: "50%",
          top: "53%",
          mixBlendMode: "multiply",
        }}
      >
        <img
          src="/images/red-accent.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content — anchored to bottom, NOT centered */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-[12vh] md:px-10 lg:px-16">
        {/* TEMPORARY — flush left, massive, bleeds off edge */}
        <h1
          ref={headingRef}
          className="-ml-[0.5vw] overflow-hidden font-poppins text-[20vw] font-black leading-[0.85] tracking-tight text-white md:text-[16vw] lg:text-[14vw]"
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

        {/* Subtitle — tight under heading, inside red band area, centered */}
        <p
          ref={subtitleRef}
          className="mt-3 w-full text-center font-montserrat text-base font-bold uppercase tracking-[0.15em] text-white md:text-xl lg:text-2xl"
          style={{ lineHeight: "1.4" }}
        >
          My visual universe is surrealistic, colorful,
          <br />
          and dark at the same time.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <svg
          className="h-8 w-8 text-white/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
