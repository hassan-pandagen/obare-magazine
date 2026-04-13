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

      // Stagger the letters in
      const letters = lettersRef.current?.querySelectorAll(".obare-letter");
      if (letters) {
        gsap.set(letters, { y: 80, opacity: 0 });
        ScrollTrigger.create({
          trigger: lettersRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(letters, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            });
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

      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 md:py-32">
        {/* LET'S TALK → black text on white */}
        <a
          ref={ctaRef}
          href="/contact"
          className="group flex items-center gap-4 font-poppins text-[12vw] font-black text-black transition-colors hover:text-red md:text-[10vw] lg:text-[8vw]"
        >
          LET&apos;S TALK
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-6">
            &rarr;
          </span>
        </a>

        {/* OBARE — each letter has a girl image clipped inside */}
        <div ref={lettersRef} className="mt-4 flex items-center gap-[1vw]">
          {LETTER_IMAGES.map(({ letter, image }, i) => (
            <div
              key={i}
              className="obare-letter relative font-poppins text-[22vw] font-black leading-none md:text-[16vw]"
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
