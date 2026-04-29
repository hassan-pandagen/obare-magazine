"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

      // Curtain: slides straight up as user scrolls, revealing the photo behind
      gsap.to(ref.current, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=80%",
          scrub: 0.8,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
