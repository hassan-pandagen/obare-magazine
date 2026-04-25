"use client";

import { useEffect, useRef } from "react";
import { optimizeImg } from "@/lib/sanityImg";

export interface ReelModalReel {
  videoSrc: string;
  posterSrc: string;
}

/**
 * iPhone/Instagram-style reel viewer.
 *
 * Single primary close gesture: pull down. Drag tracks 1:1, frame scales and
 * backdrop fades in proportion to the pull (so the dismiss "feels" interactive).
 * Release fires onClose if EITHER the displacement crossed 25% of viewport
 * height OR the flick velocity exceeded 0.6 px/ms — matches native iOS sheet
 * dismissal. Otherwise the frame springs back.
 *
 * No <video controls>: tap the frame to toggle play/pause. 95% of reel viewers
 * never scrub; the native control bar was the source of "too many buttons"
 * friction in client feedback.
 *
 * Close affordances:
 *  - Mobile: pull-down gesture only (drag-handle pill hints at it).
 *  - Desktop: Esc key, X button, click backdrop. (No swipe; no drag-handle.)
 *
 * Shared by /reels (ReelsIndexClient) and the homepage (ReelsSection).
 */
export default function ReelModal({
  reel,
  onClose,
}: {
  reel: ReelModalReel;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{
    startY: number;
    startT: number;
    lastY: number;
    lastT: number;
  } | null>(null);
  const tapStartedAtRef = useRef<number>(0);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const resetFrame = (animate: boolean) => {
    if (!frameRef.current || !backdropRef.current) return;
    if (animate) {
      frameRef.current.style.transition = "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)";
      backdropRef.current.style.transition = "opacity 0.28s ease";
    }
    frameRef.current.style.transform = "translateY(0) scale(1)";
    backdropRef.current.style.opacity = "1";
    if (animate) {
      window.setTimeout(() => {
        if (frameRef.current) frameRef.current.style.transition = "";
        if (backdropRef.current) backdropRef.current.style.transition = "";
      }, 300);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const now = performance.now();
    dragRef.current = { startY: t.clientY, startT: now, lastY: t.clientY, lastT: now };
    tapStartedAtRef.current = now;
    if (frameRef.current) frameRef.current.style.transition = "";
    if (backdropRef.current) backdropRef.current.style.transition = "";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current || !frameRef.current || !backdropRef.current) return;
    const t = e.touches[0];
    const delta = t.clientY - dragRef.current.startY;
    dragRef.current.lastY = t.clientY;
    dragRef.current.lastT = performance.now();
    if (delta > 0) {
      const vh = window.innerHeight || 800;
      const progress = Math.min(1, delta / (vh * 0.5));
      const scale = 1 - progress * 0.15;
      const opacity = 1 - progress * 0.85;
      frameRef.current.style.transform = `translateY(${delta}px) scale(${scale})`;
      backdropRef.current.style.opacity = String(opacity);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragRef.current || !frameRef.current) return;
    const drag = dragRef.current;
    dragRef.current = null;
    const endY = e.changedTouches[0].clientY;
    const endT = performance.now();
    const totalDelta = endY - drag.startY;
    const totalDuration = Math.max(1, endT - drag.startT);
    const recentDelta = endY - drag.lastY;
    const recentDuration = Math.max(1, endT - drag.lastT);
    const velocity =
      Math.abs(recentDelta / recentDuration) || Math.abs(totalDelta / totalDuration);

    const vh = window.innerHeight || 800;
    const crossedDistance = totalDelta > vh * 0.25;
    const flickedDown = totalDelta > 30 && velocity > 0.6 && recentDelta > 0;

    if (crossedDistance || flickedDown) {
      onClose();
      return;
    }

    const isTap =
      Math.abs(totalDelta) < 6 && endT - tapStartedAtRef.current < 250;
    if (isTap && videoRef.current) {
      const v = videoRef.current;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    }

    resetFrame(true);
  };

  const handleFrameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragRef.current !== null) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5 backdrop-blur-md md:p-10"
      onClick={onClose}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-4 h-1 w-12 -translate-x-1/2 rounded-full bg-white/30 md:hidden"
      />
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-red md:right-8 md:top-8 md:flex"
        aria-label="Close"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>
      <div
        ref={frameRef}
        className="relative h-full max-h-[90vh] overflow-hidden rounded-xl bg-black will-change-transform"
        style={{ aspectRatio: "9 / 16", transformOrigin: "center center" }}
        onClick={handleFrameClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.posterSrc ? optimizeImg(reel.posterSrc, { w: 500 }) : undefined}
          autoPlay
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
        </video>
      </div>
    </div>
  );
}
