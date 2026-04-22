"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { optimizeImg } from "@/lib/sanityImg";

gsap.registerPlugin(ScrollTrigger);

export interface AboutSection {
  eyebrow?: string;
  title: string;
  body?: string;
  imageUrl?: string;
  imageHotspot?: { x?: number; y?: number };
  imageMobileUrl?: string;
  imageMobileHotspot?: { x?: number; y?: number };
  layout?: "image-left" | "image-right" | "full-bleed";
  redOverlay?: boolean;
}

export interface AboutPillar {
  title: string;
  body?: string;
  imageUrl?: string;
  imageHotspot?: { x?: number; y?: number };
  imageMobileUrl?: string;
  imageMobileHotspot?: { x?: number; y?: number };
}

export interface AboutData {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  heroImageHotspot?: { x?: number; y?: number };
  heroImageMobileUrl?: string;
  heroImageMobileHotspot?: { x?: number; y?: number };
  sections?: AboutSection[];
  pillarsTitle?: string;
  pillars?: AboutPillar[];
  ctaHeadline?: string;
  ctaSubtitle?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryLink?: string;
  ctaHoverVideoUrl?: string;
}

/**
 * Split text into word-level spans for scroll-reveal animations.
 * Supports **word** syntax to paint that word red for emphasis.
 */
function splitWords(str: string) {
  const lines = str.split(/\r?\n/);
  return lines.map((line, li) => (
    <span key={li} className="block">
      {renderLine(line)}
      {li < lines.length - 1 && line.trim() === "" && <br />}
    </span>
  ));
}

function renderLine(line: string) {
  // Split by **red** markers while keeping the tokens
  const tokens = line.split(/(\*\*[^*]+\*\*)/g);
  const nodes: React.ReactNode[] = [];
  tokens.forEach((token, ti) => {
    if (!token) return;
    const redMatch = /^\*\*([^*]+)\*\*$/.exec(token);
    const isRed = !!redMatch;
    const text = isRed ? redMatch![1] : token;
    text.split(/(\s+)/).forEach((part, pi) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        nodes.push(<span key={`${ti}-${pi}-s`}>{part}</span>);
        return;
      }
      nodes.push(
        <span
          key={`${ti}-${pi}-w`}
          className={`word inline-block overflow-hidden align-bottom will-change-transform ${
            isRed ? "text-red" : ""
          }`}
        >
          <span className="inline-block">{part}</span>
        </span>
      );
    });
  });
  return nodes;
}

export default function AboutClient({ data }: { data: AboutData }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // === Hero headline letter stagger ===
      const heroChars = document.querySelectorAll(".about-hero .char");
      if (heroChars.length) {
        gsap.set(heroChars, { y: 120, opacity: 0, rotateX: -70 });
        gsap.to(heroChars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: "power4.out",
          delay: 0.2,
        });
      }

      // === Hero image card fly-in ===
      const heroImg = document.querySelector<HTMLElement>(".about-hero-image");
      if (heroImg) {
        gsap.fromTo(
          heroImg,
          { scale: 0.8, opacity: 0, y: 60 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }

      // === Section reveals ===
      const sections = gsap.utils.toArray<HTMLElement>(".about-section");
      sections.forEach((section) => {
        const image = section.querySelector<HTMLElement>(".section-image");
        const words = section.querySelectorAll<HTMLElement>(".word > span");
        const eyebrow = section.querySelector<HTMLElement>(".section-eyebrow");
        const rule = section.querySelector<HTMLElement>(".section-rule");

        if (image) {
          gsap.fromTo(
            image,
            { clipPath: "inset(0% 0% 100% 0%)", scale: 1.15 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0, transformOrigin: "left" },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (eyebrow) {
          gsap.fromTo(
            eyebrow,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (words.length) {
          gsap.fromTo(
            words,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // === Pillars cascade ===
      const pillars = gsap.utils.toArray<HTMLElement>(".pillar-card");
      if (pillars.length) {
        gsap.fromTo(
          pillars,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".pillars-section",
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // === CTA scale pulse on enter ===
      const cta = document.querySelector<HTMLElement>(".about-cta");
      if (cta) {
        const ctaChars = cta.querySelectorAll<HTMLElement>(".char");
        if (ctaChars.length) {
          gsap.fromTo(
            ctaChars,
            { y: 150, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: cta,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }
    },
    { scope: rootRef }
  );

  const headline = data.heroHeadline ?? "The Magazine That's Real";

  return (
    <>
      <Navbar />

      <main ref={rootRef} className="relative overflow-hidden bg-black text-white">
        {/* Film grain overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="about-hero relative overflow-hidden px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-40 lg:px-20">
          <div className="absolute left-0 top-0 h-full w-1 bg-red" />

          <div className="relative z-10 grid items-start gap-14 md:grid-cols-[1fr_1.15fr] md:gap-12 lg:gap-16">
            {/* LEFT — text */}
            <div className="about-hero-text md:-mt-6 lg:-mt-10" style={{ transform: "rotate(-3deg)" }}>
              {data.heroEyebrow && (
                <span className="mb-6 inline-block rounded-full border border-red/50 px-4 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.45em] text-red">
                  {data.heroEyebrow}
                </span>
              )}
              <h1
                className="font-poppins font-black uppercase leading-[0.85] text-white"
                style={{ fontSize: "clamp(3rem, 8.5vw, 8.5rem)", perspective: "800px" }}
              >
                {headline.split("|").map((line, lineIdx, arr) => (
                  <span key={lineIdx} className="block">
                    {line.split(/(\s+)/).map((word, wi) => {
                      if (/^\s+$/.test(word)) return <span key={wi}>{word}</span>;
                      const redMatch = /^\*\*([^*]+)\*\*$/.exec(word);
                      const isRed = !!redMatch;
                      const clean = isRed ? redMatch![1] : word;
                      return (
                        <span
                          key={wi}
                          className={`inline-block whitespace-nowrap ${isRed ? "text-red" : ""}`}
                        >
                          {clean.split("").map((c, i) => (
                            <span
                              key={i}
                              className="char inline-block"
                              style={{ transformOrigin: "bottom center" }}
                            >
                              {c}
                            </span>
                          ))}
                        </span>
                      );
                    })}
                    {lineIdx < arr.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              {data.heroSubtitle && (
                <p className="mt-8 max-w-xl font-montserrat text-base leading-relaxed text-white/75 md:text-lg">
                  {data.heroSubtitle}
                </p>
              )}
            </div>

            {/* RIGHT — tilted photo card with camera chrome */}
            {data.heroImageUrl && (
              <div className="relative flex items-center justify-end md:-mr-14 lg:-mr-20">
                <div
                  className="about-hero-image relative aspect-[4/3] w-full overflow-hidden border-[3px] border-red shadow-[0_20px_60px_rgba(0,0,0,0.5)] will-change-transform"
                  style={{ transform: "rotate(-5deg)" }}
                >
                  {/* Mobile hero image layer */}
                  <div
                    className="absolute inset-0 bg-cover md:hidden"
                    style={{
                      backgroundImage: `url('${optimizeImg(
                        data.heroImageMobileUrl ?? data.heroImageUrl,
                        {
                          w: 900,
                          hotspot: data.heroImageMobileHotspot ?? data.heroImageHotspot,
                        }
                      )}')`,
                      backgroundPosition:
                        (data.heroImageMobileHotspot ?? data.heroImageHotspot) &&
                        typeof (data.heroImageMobileHotspot ?? data.heroImageHotspot)!.x === "number"
                          ? `${(data.heroImageMobileHotspot ?? data.heroImageHotspot)!.x! * 100}% ${(data.heroImageMobileHotspot ?? data.heroImageHotspot)!.y! * 100}%`
                          : "center 30%",
                    }}
                  />
                  {/* Desktop hero image layer */}
                  <div
                    className="absolute inset-0 hidden bg-cover md:block"
                    style={{
                      backgroundImage: `url('${optimizeImg(data.heroImageUrl, { w: 1200, hotspot: data.heroImageHotspot })}')`,
                      backgroundPosition:
                        data.heroImageHotspot && typeof data.heroImageHotspot.x === "number"
                          ? `${data.heroImageHotspot.x * 100}% ${data.heroImageHotspot.y! * 100}%`
                          : "center 30%",
                    }}
                  />
                  <div className="absolute inset-0 bg-red/35 mix-blend-multiply" />

                  {/* Camera UI chrome */}
                  <div className="pointer-events-none absolute inset-0 text-white">
                    <div className="absolute left-3 top-3 flex items-center gap-2 font-archivo text-[10px] font-bold tracking-[0.15em] md:left-4 md:top-4 md:text-xs">
                      <span className="inline-block h-2 w-2 rounded-full bg-red" />
                      2026.1.25
                      <span className="opacity-70">03:50 PM</span>
                    </div>
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-sm bg-black/40 px-2 py-0.5 font-archivo text-[10px] font-bold tracking-[0.15em] backdrop-blur-sm md:right-4 md:top-4 md:text-xs">
                      200-300
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-3 font-archivo text-[10px] font-bold tracking-[0.15em] md:bottom-4 md:left-4 md:text-xs">
                      <span>F. 3.2</span>
                      <span className="rounded-sm bg-white/90 px-1.5 py-0.5 text-black">ISO</span>
                      <span>600</span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 font-archivo text-[10px] font-bold tracking-[0.15em] md:bottom-4 md:right-4 md:text-xs">
                      <span className="rounded-sm bg-black/40 px-1.5 py-0.5 backdrop-blur-sm">RAW</span>
                      <span>3/10</span>
                    </div>
                    <div className="absolute left-1/2 bottom-12 flex -translate-x-1/2 items-center gap-2 font-archivo text-[9px] font-bold md:bottom-14">
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-white/60 text-[10px]">⊡</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Narrative sections ──────────────────────────────────────── */}
        {data.sections?.map((section, i) => (
          <AboutSectionBlock key={i} section={section} />
        ))}

        {/* ── Pillars ────────────────────────────────────────────────── */}
        {data.pillars && data.pillars.length > 0 && (
          <section className="pillars-section relative border-t border-white/10 px-6 py-14 md:px-14 md:py-24 lg:px-20">
            {data.pillarsTitle && (
              <h2
                className="mb-16 font-poppins font-black uppercase leading-[0.9]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                {data.pillarsTitle}
              </h2>
            )}
            <div className="grid gap-6 md:grid-cols-3 md:gap-5">
              {data.pillars.map((pillar, i) => (
                <article
                  key={i}
                  className="pillar-card group relative aspect-[4/5] overflow-hidden rounded-md bg-zinc-900"
                >
                  {pillar.imageUrl && (
                    <>
                      {/* Mobile */}
                      <div
                        className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-[1.06] md:hidden"
                        style={{
                          backgroundImage: `url('${optimizeImg(
                            pillar.imageMobileUrl ?? pillar.imageUrl,
                            {
                              w: 600,
                              hotspot: pillar.imageMobileHotspot ?? pillar.imageHotspot,
                            }
                          )}')`,
                        }}
                      />
                      {/* Desktop */}
                      <div
                        className="absolute inset-0 hidden bg-cover transition-transform duration-700 group-hover:scale-[1.06] md:block"
                        style={{
                          backgroundImage: `url('${optimizeImg(pillar.imageUrl, { w: 700, hotspot: pillar.imageHotspot })}')`,
                          backgroundPosition:
                            pillar.imageHotspot && typeof pillar.imageHotspot.x === "number"
                              ? `${pillar.imageHotspot.x * 100}% ${pillar.imageHotspot.y! * 100}%`
                              : "center",
                        }}
                      />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <h3 className="font-poppins text-2xl font-black uppercase leading-tight md:text-3xl">
                      {pillar.title}
                    </h3>
                    {pillar.body && (
                      <p className="mt-3 font-montserrat text-sm leading-relaxed text-white/75">
                        {pillar.body}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function AboutSectionBlock({ section }: { section: AboutSection }) {
  const layout = section.layout ?? "image-right";
  const body = section.body ?? "";

  if (layout === "full-bleed") {
    return (
      <section className="about-section relative border-t border-white/10">
        <span className="section-rule absolute left-0 top-0 block h-px w-full bg-red" />
        <div className="relative h-[85vh] overflow-hidden md:h-[95vh]">
          {section.imageUrl && (
            <>
              <div
                className="section-image absolute inset-0 bg-cover bg-center will-change-transform"
                style={{ backgroundImage: `url('${optimizeImg(section.imageUrl, { w: 1200 })}')` }}
              />
              {section.redOverlay && (
                <div className="absolute inset-0 bg-red/35 mix-blend-multiply" />
              )}
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
          <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-14 md:pb-20 lg:px-20">
            {section.eyebrow && (
              <span className="section-eyebrow mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
                {section.eyebrow}
              </span>
            )}
            <h2
              className="font-poppins font-black uppercase leading-[0.88]"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
            >
              {splitWords(section.title)}
            </h2>
            {body && (
              <div className="mt-8 max-w-2xl space-y-3 font-montserrat text-base leading-relaxed text-white/80 md:text-lg">
                {splitWords(body)}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const imageFirst = layout === "image-left";

  return (
    <section className="about-section relative border-t border-white/10 px-6 py-14 md:px-14 md:py-32 lg:px-20">
      <span className="section-rule absolute left-0 top-0 block h-px w-full bg-red" />
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 md:gap-20 ${
          imageFirst ? "md:grid-cols-[1.1fr_1fr]" : "md:grid-cols-[1fr_1.1fr]"
        }`}
      >
        {imageFirst && <SectionImage section={section} imageFirst={imageFirst} />}
        <div className={imageFirst ? "md:pl-4" : "md:pr-4"}>
          {section.eyebrow && (
            <span className="section-eyebrow mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
              {section.eyebrow}
            </span>
          )}
          <h2
            className="font-poppins font-black uppercase leading-[0.88]"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)" }}
          >
            {splitWords(section.title)}
          </h2>
          {body && (
            <div className="mt-8 space-y-3 font-montserrat text-base leading-relaxed text-white/75 md:text-lg">
              {splitWords(body)}
            </div>
          )}
        </div>
        {!imageFirst && <SectionImage section={section} imageFirst={imageFirst} />}
      </div>
    </section>
  );
}

function SectionImage({
  section,
  imageFirst,
}: {
  section: AboutSection;
  imageFirst: boolean;
}) {
  // Alternate tilt direction based on image side for visual rhythm
  const tilt = imageFirst ? "-4deg" : "4deg";
  const hotspot = section.imageHotspot;
  const bgPosition =
    hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number"
      ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
      : "center 30%";

  if (!section.imageUrl) {
    return <div className="aspect-[4/5] w-full bg-zinc-900 md:aspect-[4/3]" />;
  }

  const mobileUrl = section.imageMobileUrl ?? section.imageUrl;
  const mobileHotspot = section.imageMobileHotspot ?? section.imageHotspot;
  const mobileBgPos =
    mobileHotspot && typeof mobileHotspot.x === "number" && typeof mobileHotspot.y === "number"
      ? `${mobileHotspot.x * 100}% ${mobileHotspot.y * 100}%`
      : "center 30%";

  return (
    <div
      className="section-image relative aspect-[4/5] w-full overflow-hidden border-[3px] border-red shadow-[0_20px_60px_rgba(0,0,0,0.4)] will-change-transform md:aspect-[4/3]"
      style={{ transform: `rotate(${tilt})` }}
    >
      {/* Mobile layer */}
      <div
        className="absolute inset-0 bg-cover md:hidden"
        style={{
          backgroundImage: `url('${optimizeImg(mobileUrl, { w: 900, hotspot: mobileHotspot })}')`,
          backgroundPosition: mobileBgPos,
        }}
      />
      {/* Desktop layer */}
      <div
        className="absolute inset-0 hidden bg-cover md:block"
        style={{
          backgroundImage: `url('${optimizeImg(section.imageUrl, { w: 1200, hotspot })}')`,
          backgroundPosition: bgPosition,
        }}
      />
      {section.redOverlay && (
        <div className="absolute inset-0 bg-red/35 mix-blend-multiply" />
      )}

      {/* Camera UI chrome */}
      <div className="pointer-events-none absolute inset-0 text-white">
        <div className="absolute left-3 top-3 flex items-center gap-2 font-archivo text-[10px] font-bold tracking-[0.15em] md:left-4 md:top-4 md:text-xs">
          <span className="inline-block h-2 w-2 rounded-full bg-red" />
          2026.1.25
          <span className="opacity-70">03:50 PM</span>
        </div>
        <div className="absolute right-3 top-3 rounded-sm bg-black/40 px-2 py-0.5 font-archivo text-[10px] font-bold tracking-[0.15em] backdrop-blur-sm md:right-4 md:top-4 md:text-xs">
          200-300
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-3 font-archivo text-[10px] font-bold tracking-[0.15em] md:bottom-4 md:left-4 md:text-xs">
          <span>F. 3.2</span>
          <span className="rounded-sm bg-white/90 px-1.5 py-0.5 text-black">ISO</span>
          <span>600</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-2 font-archivo text-[10px] font-bold tracking-[0.15em] md:bottom-4 md:right-4 md:text-xs">
          <span className="rounded-sm bg-black/40 px-1.5 py-0.5 backdrop-blur-sm">RAW</span>
          <span>3/10</span>
        </div>
      </div>
    </div>
  );
}
