"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function VideoReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: false,
        },
      });

      // Fade out overlay → reveals image
      tl.to(overlayRef.current, { opacity: 0, duration: 1 }, 0);

      // Scale heading, change color
      tl.to(
        headingRef.current,
        { scale: 1.15, color: "#F5F5F0", duration: 1 },
        0
      );

      // Parallax on image
      tl.to(imageRef.current, { y: -80, scale: 1.1, duration: 1 }, 0);

      // Subtitle fades in midway
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.4
      );

      // Push text up and fade at end
      tl.to(headingRef.current, { y: -80, opacity: 0, duration: 0.4 }, 0.7);
      tl.to(subtitleRef.current, { y: -40, opacity: 0, duration: 0.3 }, 0.75);
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background image */}
        <div
          ref={imageRef}
          className="absolute inset-[-10%] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/traveling.png')" }}
        />

        {/* Dark overlay that fades out on scroll */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[1] bg-black"
        />

        {/* Typography layer */}
        <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center">
          <h2
            ref={headingRef}
            className="font-poppins text-[14vw] font-bold leading-[0.85] tracking-tight text-white md:text-[10vw] lg:text-[8vw]"
          >
            WHY TRAVEL
            <br />
            MATTERS
          </h2>

          <p
            ref={subtitleRef}
            className="mt-6 max-w-lg font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white/80 opacity-0 md:text-sm"
          >
            My visual universe is surrealistic, colorful and dark at the same
            time.
          </p>
        </div>
      </div>
    </div>
  );
}
