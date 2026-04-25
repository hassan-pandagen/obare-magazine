"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/sanity/imageUrl";
import { RedEmphasis } from "@/lib/redEmphasis";

interface NextArticle {
  title: string;
  slug: { current: string };
  category?: string;
  excerpt?: string;
  coverImage?: { asset: unknown; alt?: string };
  coverImageMobile?: { asset: unknown };
}

/**
 * End-of-article continuation block à la thelinestudio.com.
 *
 * Two animated pieces tied to the same ScrollTrigger:
 *  1. A tall "Next ↓" label with a large animated down-arrow that reveals
 *     as the reader enters this section.
 *  2. A full-width cover-image preview of the next article. The image
 *     scales from 0.85 → 1 and reveals its fill as the user scrolls.
 *  Navigation is click-only — we prefetch on mount so the click feels instant.
 */
export default function NextArticleCard({ next }: { next: NextArticle }) {
  const sectionRef = useRef<HTMLElement>(null);
  const nextLabelRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageFillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  const href = `/articles/${next.slug.current}`;
  const coverSrc = next.coverImage?.asset
    ? urlFor(next.coverImage).width(1800).url()
    : null;
  const coverMobileSrc = next.coverImageMobile?.asset
    ? urlFor(next.coverImageMobile).width(900).url()
    : null;

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Prefetch on mount so auto-navigate feels instant.
      router.prefetch(href);

      // Label + arrow: fade + drop in on enter
      gsap.set([nextLabelRef.current, arrowRef.current], { y: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(nextLabelRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          });
          gsap.to(arrowRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.1,
            ease: "power3.out",
          });
        },
      });

      // Continuous arrow bounce once revealed
      gsap.to(arrowRef.current, {
        y: 14,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });

      // Preview card: scale up + reveal its title as user scrolls into it.
      gsap.set(cardRef.current, { scale: 0.88, opacity: 0.4 });
      gsap.to(cardRef.current, {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          end: "top 35%",
          scrub: 1,
        },
      });

      // Parallax fill inside the preview so it doesn't feel static.
      gsap.fromTo(
        imageFillRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Title slides in from the left as the card settles.
      gsap.set(titleRef.current, { x: -40, opacity: 0 });
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 65%",
        once: true,
        onEnter: () => {
          gsap.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          });
        },
      });

    },
    { scope: sectionRef, dependencies: [href] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black px-6 pt-24 pb-12 md:px-14 md:pt-32 md:pb-16 lg:px-20"
      aria-label={`Next article: ${next.title}`}
    >
      {/* Top rule + eyebrow label + arrow */}
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-6">
        <span
          ref={nextLabelRef}
          className="block font-poppins font-black uppercase leading-[0.9] text-white"
          style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
        >
          Next
        </span>

        <svg
          ref={arrowRef}
          viewBox="0 0 40 120"
          className="h-[60px] w-[28px] shrink-0 text-white md:h-[90px] md:w-[44px] lg:h-[120px] lg:w-[56px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="20" y1="10" x2="20" y2="98" />
          <polyline points="6,78 20,108 34,78" />
        </svg>
      </div>

      {/* Preview card — clickable + parallax + GSAP scroll-scrub */}
      <a
        ref={cardRef}
        href={href}
        className="group relative mx-auto mt-10 block aspect-[16/10] w-full max-w-6xl overflow-hidden rounded-sm bg-zinc-900 md:mt-14 md:aspect-[21/9]"
      >
        {coverSrc ? (
          <picture ref={imageFillRef} className="absolute inset-[-10%] block">
            {coverMobileSrc && (
              <source media="(max-width: 767px)" srcSet={coverMobileSrc} />
            )}
            <img
              src={coverSrc}
              alt={next.coverImage?.alt ?? next.title}
              className="h-full w-full object-cover"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        {/* Gradient overlays for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-red/0 transition-colors duration-500 group-hover:bg-red/20" />

        {/* Bottom-left: category + title */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10 lg:px-14 lg:pb-14">
          <div className="min-w-0">
            {next.category && (
              <span className="mb-3 block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-red md:text-xs">
                {next.category}
              </span>
            )}
            <h3
              ref={titleRef}
              className="font-poppins font-black uppercase leading-[0.9] text-white"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 4rem)" }}
            >
              <RedEmphasis>{next.title}</RedEmphasis>
            </h3>
          </div>

          {/* Bottom-right cue */}
          <span className="hidden shrink-0 items-center gap-2 whitespace-nowrap font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-white/80 transition-colors group-hover:text-red md:flex">
            {next.title.length > 20 ? "Read next" : next.title}
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
              &rarr;
            </span>
          </span>
        </div>
      </a>

      {/* Small hint text below */}
      <p className="mx-auto mt-6 max-w-6xl font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/35 md:mt-10 md:text-xs">
        Tap the card to continue
      </p>
    </section>
  );
}
