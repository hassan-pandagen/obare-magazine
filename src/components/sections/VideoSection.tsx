"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlayButton from "@/components/ui/PlayButton";

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useGSAP(
    () => {
      gsap.set(titleRef.current, { y: 50, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => {
          gsap.to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        once: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative flex h-screen items-center justify-center overflow-hidden"
      >
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/who-we-are.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <PlayButton onClick={() => setIsLightboxOpen(true)} />

          <h2
            ref={titleRef}
            className="font-poppins text-4xl font-bold text-white md:text-6xl lg:text-7xl"
          >
            Who We Are
          </h2>
        </div>
      </section>

      {/* Lightbox modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute right-6 top-6 font-montserrat text-sm uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            onClick={() => setIsLightboxOpen(false)}
          >
            Close &times;
          </button>
          <video
            className="max-h-[80vh] max-w-[90vw]"
            src="/videos/who-we-are.mp4"
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
