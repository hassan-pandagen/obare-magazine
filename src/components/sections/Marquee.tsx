"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CATEGORIES = [
  "No Cover-Up",
  "Unfiltered",
  "Bare",
  "Natural",
  "Authentic",
];

/**
 * Infinite marquee using GSAP's `modifiers` pattern for a truly seamless loop.
 *
 * Why not pure CSS? A CSS @keyframes animation that goes from 0% → -50%
 * technically repeats, but the browser re-applies the `transform` at the
 * loop boundary, which triggers a sub-pixel snap (visible as a jerk). Worse,
 * `animation-play-state: paused/running` toggles on hover cause the resumed
 * animation to re-compute its start time — that's the "glitch on release"
 * the old version had.
 *
 * GSAP keeps a single tween running forever; the modifier wraps the x value
 * so it stays within `[-setWidth, 0]`. Hover pauses the tween at its exact
 * current position; unhover resumes from that exact spot. No repaint, no snap.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const firstSet = setRef.current;
      if (!track || !firstSet) return;

      // Measure one set's width. Font loading can change this slightly, so
      // we re-measure on resize and font-load events.
      let setWidth = firstSet.offsetWidth;

      const tween = gsap.to(track, {
        x: `-=${setWidth}`,
        duration: 9,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (value) => {
            const num = parseFloat(value);
            // Re-wrap into [-setWidth, 0] so we loop forever without any snap.
            // Use setWidth at call-time so resizes take effect seamlessly.
            const wrapped = ((num % setWidth) + setWidth) % setWidth;
            return `${-wrapped}px`;
          },
        },
      });

      const onEnter = () => tween.timeScale(0);
      const onLeave = () => tween.timeScale(1);
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      const onResize = () => {
        setWidth = firstSet.offsetWidth;
      };
      window.addEventListener("resize", onResize);
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          setWidth = firstSet.offsetWidth;
        });
      }

      return () => {
        tween.kill();
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: trackRef }
  );

  const renderItem = (cat: string, i: number) => (
    <span key={i} className="flex items-center">
      <span className="font-poppins text-[8vw] font-black uppercase text-white/80 md:text-[5vw]">
        {cat}
      </span>
      <span className="mx-4 font-poppins text-[8vw] font-black text-red md:mx-6 md:text-[5vw]">
        &bull;
      </span>
    </span>
  );

  return (
    <section className="w-full overflow-hidden bg-black py-8 md:py-12">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* First set is measured; the other three ensure the track is always
           wider than the viewport at any zoom level so nothing ever looks empty. */}
        <div ref={setRef} className="flex items-center">
          {CATEGORIES.map(renderItem)}
        </div>
        <div className="flex items-center" aria-hidden>
          {CATEGORIES.map(renderItem)}
        </div>
        <div className="flex items-center" aria-hidden>
          {CATEGORIES.map(renderItem)}
        </div>
        <div className="flex items-center" aria-hidden>
          {CATEGORIES.map(renderItem)}
        </div>
      </div>
    </section>
  );
}
