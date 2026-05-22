"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "obare-loader-shown";
const DURATION_MS = 1600;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      onComplete();
      return;
    }

    let done = false;
    const startTs = performance.now();

    const interval = window.setInterval(() => {
      if (done) return;
      const elapsed = performance.now() - startTs;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));

      setProgress(pct);
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;

      if (pct >= 100) {
        done = true;
        window.clearInterval(interval);
        const el = loaderRef.current;
        if (el) {
          el.style.transition = "clip-path 0.35s cubic-bezier(0.76, 0, 0.24, 1)";
          el.style.clipPath = "inset(0 0 100% 0)";
        }
        window.setTimeout(() => {
          try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
          onComplete();
        }, 370);
      }
    }, 16);

    return () => {
      done = true;
      window.clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <h1 className="font-poppins text-[12vw] font-bold tracking-[0.4em] text-white md:text-[8vw]">
        OBARE
      </h1>

      <div className="mt-8 h-[2px] w-48 overflow-hidden bg-white/15 md:w-64">
        <div ref={progressRef} className="h-full w-0" style={{ backgroundColor: "#ff3b1f" }} />
      </div>

      <span className="mt-4 font-montserrat text-xs tracking-widest text-white/50">
        {progress}%
      </span>
    </div>
  );
}
