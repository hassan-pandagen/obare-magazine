"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { optimizeImg } from "@/lib/sanityImg";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  headline?: string;
  subheadline?: string;
  bgImage?: string;
  bgImageMobile?: string;
}

export default function Hero({ headline, subheadline, bgImage, bgImageMobile }: HeroProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement | HTMLImageElement>(null);

  useGSAP(
    () => {
      const loaderAlreadyShown =
        typeof window !== "undefined" &&
        !!sessionStorage.getItem("obare-loader-shown");
      const openingDelay = loaderAlreadyShown ? 0.1 : 0.7;
      const tl = gsap.timeline({ delay: openingDelay });

      if (bgRef.current) {
        gsap.set(bgRef.current, { scale: 1.0 });
        gsap.to(bgRef.current, {
          scale: 1.04,
          duration: 14,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }

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

      if (underlineRef.current) {
        gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left" });
        tl.to(
          underlineRef.current,
          { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
          "-=0.35"
        );
      }

      const words = subtitleRef.current?.querySelectorAll(".slogan-word");
      if (words && words.length) {
        gsap.set(words, { y: 24, opacity: 0 });
        tl.to(
          words,
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" },
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

      if (tickerRef.current) {
        gsap.set(tickerRef.current, { opacity: 0 });
        tl.to(tickerRef.current, { opacity: 1, duration: 0.5 }, "-=0.1");
      }

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
      {/* Background image — CMS image takes priority over static webp fallback */}
      {bgImage ? (
        <picture className="absolute inset-0">
          {bgImageMobile && (
            <source
              media="(max-width: 767px)"
              srcSet={`${optimizeImg(bgImageMobile, { w: 720, q: 70 })} 1x, ${optimizeImg(bgImageMobile, { w: 1080, q: 70 })} 2x`}
            />
          )}
          <img
            ref={bgRef as React.RefObject<HTMLImageElement>}
            src={optimizeImg(bgImage, { w: 1600, q: 75 })}
            srcSet={`${optimizeImg(bgImage, { w: 1200, q: 75 })} 1200w, ${optimizeImg(bgImage, { w: 1600, q: 75 })} 1600w, ${optimizeImg(bgImage, { w: 2000, q: 75 })} 2000w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
      ) : (
        <div
          ref={bgRef}
          className="hero-bg-responsive absolute inset-0 bg-cover bg-[center_center]"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />


      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10 md:pb-14">
        <h1
          ref={headingRef}
          className="overflow-hidden whitespace-nowrap font-archivo font-bold leading-[0.85] tracking-[0.02em] text-white w-full text-center"
          style={{
            perspective: "800px",
            fontStretch: "125%",
            fontSize: "clamp(4.5rem, 18vw, 18vw)",
            transform: "scaleX(1.18)",
            transformOrigin: "center bottom",
          }}
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

        <p
          ref={subtitleRef}
          className="hidden"
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

      {/* Scroll ticker */}
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
                The Magazine That&apos;s Real
              </span>
              <span className="mx-5 h-1.5 w-1.5 rounded-full bg-red md:mx-7" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
