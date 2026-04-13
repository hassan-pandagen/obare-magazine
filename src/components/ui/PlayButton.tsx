"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PlayButton({ onClick }: { onClick: () => void }) {
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Pulse ring animation
    gsap.to(ringRef.current, {
      scale: 1.3,
      opacity: 0,
      duration: 1.5,
      repeat: -1,
      ease: "power2.out",
    });
  });

  return (
    <button
      onClick={onClick}
      className="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 transition-colors hover:border-white md:h-24 md:w-24"
      aria-label="Play video"
    >
      {/* Pulse ring */}
      <div
        ref={ringRef}
        className="absolute inset-0 rounded-full border border-white/20"
      />

      {/* Play triangle */}
      <svg
        className="ml-1 h-6 w-6 text-white transition-transform group-hover:scale-110 md:h-8 md:w-8"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
