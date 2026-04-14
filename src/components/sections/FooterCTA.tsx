"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Each letter of OBARE gets a different girl image clipped inside it
const LETTER_IMAGES = [
  { letter: "O", image: "/images/hero-bg.png" },
  { letter: "B", image: "/images/magazine-real.png" },
  { letter: "A", image: "/images/traveling.png" },
  { letter: "R", image: "/images/story-portrait.png" },
  { letter: "E", image: "/images/story-tech.png" },
];

export default function FooterCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);

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

      // Stagger the letters in — use fromTo so initial state is reliable
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
    <section
      ref={sectionRef}
      className="w-full bg-white"
    >
      {/* Red accent strip at top */}
      <div className="h-2 w-full bg-red" />

      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-12 md:min-h-[80vh] md:py-32">
        {/* LET'S TALK → black text on white */}
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

        {/* OBARE — each letter has a girl image clipped inside */}
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
      </div>

      {/* Red accent strip at bottom */}
      <div className="h-2 w-full bg-red" />
    </section>
  );
}
