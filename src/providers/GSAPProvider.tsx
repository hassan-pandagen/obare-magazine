"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis on touch/mobile — native scroll is smoother there
    const isMobile =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    if (isMobile) {
      // Still need ScrollTrigger to work with native scroll on mobile
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      // lerp gives a natural exponential decay feel; lower = snappier
      lerp: 0.07,
      smoothWheel: true,
      // Don't auto-raf — GSAP ticker drives it so they stay in sync
      autoRaf: false,
    });

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (single rAF loop for both)
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);

    // Don't let GSAP skip frames to catch up — trust Lenis timing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}