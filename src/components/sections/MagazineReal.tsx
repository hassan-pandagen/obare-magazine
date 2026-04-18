"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MagazineReal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(imageRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.set(headingRef.current, { y: 60, opacity: 0 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.to(headingRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        once: true,
      });

      const items = textRef.current?.querySelectorAll(".reveal-item");
      if (items) {
        gsap.set(items, { y: 30, opacity: 0 });
        ScrollTrigger.create({
          trigger: textRef.current,
          start: "top 75%",
          onEnter: () => {
            gsap.to(items, {
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="grid min-h-screen w-full grid-cols-1 bg-black lg:grid-cols-2"
    >
      {/* Left — Image */}
      <div className="relative aspect-square overflow-hidden lg:aspect-auto">
        <div
          ref={imageRef}
          className="absolute inset-[-10%] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/magazine-real.webp')" }}
        />
      </div>

      {/* Right — Content */}
      <div className="flex flex-col justify-center bg-black px-8 py-16 md:px-16 lg:px-20">
        <div ref={textRef}>
          <span className="reveal-item mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-red">
            About OBARE
          </span>

          <h2
            ref={headingRef}
            className="font-poppins text-4xl font-bold uppercase leading-[0.95] text-white md:text-5xl lg:text-6xl"
          >
            The Magazine
            <br />
            That&apos;s Real
          </h2>

          <p className="reveal-item mt-6 max-w-md font-montserrat text-sm leading-relaxed text-white/60 md:text-base">
            My visual universe is surrealistic, colorful and dark at the same
            time. We believe in raw expression, bold creativity, and stories
            that move people.
          </p>

          <div className="reveal-item mt-10 flex gap-10">
            <div>
              <span className="font-poppins text-3xl font-bold text-red">
                1280
              </span>
              <p className="mt-1 font-montserrat text-[10px] uppercase tracking-widest text-white/40">
                Readers
              </p>
            </div>
            <div>
              <span className="font-poppins text-3xl font-bold text-red">
                832
              </span>
              <p className="mt-1 font-montserrat text-[10px] uppercase tracking-widest text-white/40">
                Followers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
