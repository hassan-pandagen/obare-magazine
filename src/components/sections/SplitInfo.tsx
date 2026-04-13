"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SplitInfo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const leftContent = leftRef.current?.querySelectorAll(".reveal-item");
      const rightContent = rightRef.current?.querySelectorAll(".reveal-item");

      if (leftContent) {
        gsap.set(leftContent, { y: 40, opacity: 0 });
        ScrollTrigger.create({
          trigger: leftRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(leftContent, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            });
          },
          once: true,
        });
      }

      if (rightContent) {
        gsap.set(rightContent, { y: 40, opacity: 0 });
        ScrollTrigger.create({
          trigger: rightRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(rightContent, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.2,
            });
          },
          once: true,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left — white background */}
      <div
        ref={leftRef}
        className="flex flex-col justify-center bg-white px-8 py-20 md:px-16 lg:px-20"
      >
        <span className="reveal-item mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.3em] text-grey">
          Who We Are
        </span>
        <h2 className="reveal-item font-poppins text-4xl font-bold leading-tight text-black md:text-5xl lg:text-6xl">
          The Magazine
          <br />
          That&apos;s Real
        </h2>
        <p className="reveal-item mt-6 max-w-md font-montserrat text-base leading-relaxed text-black/70">
          OBARE is a platform for stories that matter. We explore culture,
          wellness, travel, movement, and style through a lens that&apos;s
          authentic and unapologetic.
        </p>

        {/* Stats */}
        <div className="reveal-item mt-12 flex gap-12">
          <div>
            <span className="font-poppins text-3xl font-bold text-red">50+</span>
            <p className="mt-1 font-montserrat text-xs uppercase tracking-widest text-black/50">
              Stories
            </p>
          </div>
          <div>
            <span className="font-poppins text-3xl font-bold text-red">12</span>
            <p className="mt-1 font-montserrat text-xs uppercase tracking-widest text-black/50">
              Countries
            </p>
          </div>
          <div>
            <span className="font-poppins text-3xl font-bold text-red">1M+</span>
            <p className="mt-1 font-montserrat text-xs uppercase tracking-widest text-black/50">
              Readers
            </p>
          </div>
        </div>
      </div>

      {/* Right — red background */}
      <div
        ref={rightRef}
        className="relative flex flex-col justify-center overflow-hidden bg-red px-8 py-20 md:px-16 lg:px-20"
      >
        {/* Giant watermark "O" */}
        <span className="absolute -right-20 top-1/2 -translate-y-1/2 font-poppins text-[40vw] font-bold leading-none text-white/10 lg:text-[20vw]">
          O
        </span>

        <span className="reveal-item mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.3em] text-white/60">
          Our Mission
        </span>
        <h2 className="reveal-item font-poppins text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Celebrate
          <br />
          What&apos;s Real
        </h2>
        <p className="reveal-item mt-6 max-w-md font-montserrat text-base leading-relaxed text-white/80">
          My visual universe is surrealistic, colorful and dark at the same
          time. We believe in raw expression, bold creativity, and stories
          that move people.
        </p>
      </div>
    </section>
  );
}
