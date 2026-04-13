"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Animate progress bar from 0% to 100%
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function () {
          const val = Math.round(this.targets()[0].val);
          setProgress(val);
          if (progressRef.current) {
            progressRef.current.style.width = `${val}%`;
          }
        },
      }
    );

    // Flash the text
    tl.to(textRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.in",
    });

    // Slide the loader up
    tl.to(loaderRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.8,
      ease: "power3.inOut",
      delay: 0.1,
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      {/* Logo text */}
      <h1
        ref={textRef}
        className="font-poppins text-[12vw] font-bold tracking-[0.4em] text-white md:text-[8vw]"
      >
        OBARE
      </h1>

      {/* Progress bar */}
      <div className="mt-8 h-[2px] w-48 overflow-hidden bg-white/20 md:w-64">
        <div
          ref={progressRef}
          className="h-full w-0 bg-red"
        />
      </div>

      {/* Progress number */}
      <span className="mt-4 font-montserrat text-xs tracking-widest text-white/50">
        {progress}%
      </span>
    </div>
  );
}
