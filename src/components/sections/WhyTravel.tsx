"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WhyTravel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.set(headingRef.current, { y: 60, opacity: 0 });
      gsap.set(subtitleRef.current, { y: 30, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => {
          gsap.to(headingRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(subtitleRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.3,
            ease: "power2.out",
          });
        },
        once: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-full w-full flex-col justify-end bg-black"
    >
      {/* Background image — subtle */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
      />

      <div className="relative z-10 px-6 py-16 md:px-10 md:py-24 lg:px-16">
        {/* WHY TRAVEL MATTERS — one line */}
        <h2
          ref={headingRef}
          className="font-poppins text-[10vw] font-black uppercase leading-[0.95] text-white md:text-[7vw] lg:text-[6vw]"
        >
          WHY TRAVEL MATTERS
        </h2>

        {/* Subtitle — one line, big bold */}
        <p
          ref={subtitleRef}
          className="mt-4 font-montserrat text-xl font-bold uppercase tracking-[0.1em] text-white/60 md:text-2xl lg:text-3xl"
        >
          My visual universe is surrealistic, colorful and dark at the same time.
        </p>

        <div className="mt-6 flex items-center gap-6">
          <span className="font-montserrat text-base text-white/30">
            Bare Models
          </span>
          <span className="text-white/15">|</span>
          <span className="font-montserrat text-base text-white/30">
            By Justin Maki
          </span>
        </div>
      </div>
    </section>
  );
}
