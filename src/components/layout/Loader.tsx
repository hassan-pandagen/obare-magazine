"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "obare-loader-shown";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Skip loader on repeat visits within the same session
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      onComplete();
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Progress bar — minimum duration to keep loader visible but not block LCP
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          const val = Math.round(this.targets()[0].val);
          setProgress(val);
          if (progressRef.current) {
            progressRef.current.style.width = `${val}%`;
          }
        },
      }
    );

    // Slide the loader up immediately after progress fills
    tl.to(loaderRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.35,
      ease: "power3.inOut",
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
