"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// iOS Safari fires resize events when the URL bar collapses/expands during
// scroll. Without this, ScrollTrigger refreshes mid-scroll and pinned/scrubbed
// animations stutter or appear to not run at all on mobile.
ScrollTrigger.config({ ignoreMobileResize: true });

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Sanity Studio manages its own scroll — don't hijack it
    if (pathname?.startsWith("/studio")) return;

    // Disable Lenis on touch/mobile — native scroll is smoother there
    const isMobile =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    if (isMobile) {
      // Native scroll on mobile. Refresh once layout/fonts/images settle so
      // ScrollTrigger's stored start/end positions match the final document.
      ScrollTrigger.normalizeScroll(false);
      const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250);
      return () => window.clearTimeout(refreshId);
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
  }, [pathname]);

  return <>{children}</>;
}