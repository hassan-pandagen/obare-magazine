"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ScrollIndicator() {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(lineRef.current, {
      scaleY: 0,
      transformOrigin: "top",
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut",
    });
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/40">
        Scroll
      </span>
      <div ref={lineRef} className="h-8 w-[1px] bg-white/30" />
    </div>
  );
}
