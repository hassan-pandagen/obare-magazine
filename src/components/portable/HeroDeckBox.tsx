"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Client wrapper around the article hero's red viewfinder box.
 *
 * Mirrors the homepage folder-card deck motion (HomeClient.tsx) — same 14°
 * corner-pivot rotation, scroll-scrubbed, full opacity — but pivoted from
 * the top-right corner instead of top-left so the box "decks" from the
 * right side of the viewport. The hero <section> stays sticky-pinned and
 * the article body slides up over it from below.
 */
export default function HeroDeckBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const section = ref.current.closest<HTMLElement>("section");
      if (!section) return;

      // Pivot from bottom-left so the box tilts upward (left stays anchored, right lifts)
      gsap.set(ref.current, { transformOrigin: "0% 100%" });

      // Counter-rotate the cloned photo child so it stays flat while the box tilts
      const photoEl = ref.current.querySelector<HTMLElement>("[data-counter-rotate]");

      const st = {
        trigger: section,
        start: "top top",
        end: "+=80%",
        scrub: 0.5,
      };

      gsap.to(ref.current, {
        rotationZ: 8,
        ease: "none",
        scrollTrigger: st,
      });

      if (photoEl) {
        gsap.set(photoEl, { transformOrigin: "0% 100%" });
        gsap.to(photoEl, {
          rotationZ: -8,
          ease: "none",
          scrollTrigger: st,
        });
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
