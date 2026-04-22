"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/imageUrl";
import ArticleVideoPlayer from "./ArticleVideoPlayer";

const components: PortableTextComponents = {
  block: {
    // Normal paragraph — with the messy-magazine drop cap on the first one.
    // The :first-child selector gives the very first body paragraph a huge red
    // first letter like a print magazine lede.
    normal: ({ children }) => (
      <p className="article-paragraph mb-7 font-montserrat text-[17px] leading-[1.85] text-white/80 md:text-lg">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-6 mt-14 font-poppins text-[10vw] font-black uppercase leading-[0.95] tracking-tight text-white md:text-5xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-12 font-poppins text-3xl font-black uppercase leading-tight text-white md:text-4xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-10 font-poppins text-2xl font-black uppercase text-white md:text-3xl">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-14 mx-auto max-w-3xl text-center font-poppins text-2xl font-black italic leading-[1.2] text-white md:text-3xl lg:text-4xl">
        <span
          aria-hidden
          className="mb-3 block font-poppins font-black text-red"
          style={{ fontSize: "3em", lineHeight: 0.5 }}
        >
          &ldquo;
        </span>
        <span className="block">{children}</span>
        <span aria-hidden className="mx-auto mt-5 block h-[2px] w-16 bg-red" />
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold text-red">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-white underline decoration-red underline-offset-2 transition-colors hover:text-red"
      >
        {children}
      </a>
    ),
  },

  types: {
    // Inline image — contained in text column on desktop, light bleed on mobile.
    // Slight tilt + alternating horizontal offset for the messy-spread feel.
    image: ({ value }) => {
      if (!value?.url && !value?.asset) return null;
      const src = value.url ?? urlFor(value).width(1200).url();
      // Deterministic tilt + horizontal nudge so layout stays stable across renders
      // but images don't all line up in a perfect column.
      const seed = (value.alt ?? " ").charCodeAt(0) || 1;
      const tilt = seed % 2 === 0 ? "-rotate-[1deg]" : "rotate-[1deg]";
      const nudge = seed % 3 === 0 ? "md:ml-auto md:mr-0" : seed % 3 === 1 ? "md:mx-auto" : "md:mr-auto md:ml-0";
      return (
        <figure
          className={`my-14 -mx-6 md:mx-0 md:w-[85%] ${nudge} ${tilt}`}
        >
          <img
            src={src}
            alt={value.alt ?? ""}
            className="w-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:rounded-sm"
          />
          {value.caption && (
            <figcaption className="mt-3 px-6 font-montserrat text-xs italic text-white/50 md:px-0">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Inline video — custom OBARE player with big PLAY overlay + sound + auto-pause on scroll-out
    inlineVideo: ({ value }) => {
      if (!value?.fileUrl) return null;
      return (
        <ArticleVideoPlayer
          src={value.fileUrl}
          srcMobile={value.fileMobileUrl}
          poster={value.posterUrl}
          posterMobile={value.posterMobileUrl}
          caption={value.caption}
        />
      );
    },

    // Inline reel (9:16 portrait)
    inlineReel: ({ value }) => {
      if (!value?.fileUrl) return null;
      return (
        <figure className="my-10 flex flex-col items-center">
          <div className="w-full max-w-xs overflow-hidden rounded-xl" style={{ aspectRatio: "9/16" }}>
            <video
              src={value.fileUrl}
              poster={value.posterUrl}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 font-montserrat text-xs text-white/40">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Image gallery — contained to column width on desktop with collage-style tile tilts
    gallery: ({ value }) => {
      if (!value?.images?.length) return null;
      return (
        <figure className="my-14 -mx-6 md:mx-0">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {value.images.map(
              (img: { url: string; alt?: string; _key?: string }, i: number) => {
                const tilts = ["-rotate-[1.5deg]", "rotate-[0.8deg]", "-rotate-[0.5deg]", "rotate-[1.3deg]"];
                const tilt = tilts[i % tilts.length];
                return (
                  <img
                    key={img._key ?? i}
                    src={img.url}
                    alt={img.alt ?? ""}
                    className={`aspect-square w-full object-cover shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:rounded-sm ${tilt}`}
                  />
                );
              }
            )}
          </div>
          {value.caption && (
            <figcaption className="mt-4 px-6 font-montserrat text-xs italic text-white/50 md:px-0">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Pull quote — slightly rotated, with a big red slash mark for the messy-magazine feel
    pullQuote: ({ value }) => {
      if (!value?.quote) return null;
      const seed = (value.quote ?? "").charCodeAt(0) || 1;
      const tilt = seed % 2 === 0 ? "-rotate-[0.8deg]" : "rotate-[0.8deg]";
      return (
        <aside className={`relative my-16 -mx-4 border-y-2 border-red bg-red/5 py-12 text-center ${tilt}`}>
          <span
            aria-hidden
            className="absolute -left-2 top-1/2 block h-12 w-1 -translate-y-1/2 bg-red md:-left-4 md:h-16"
          />
          <p className="relative z-10 px-8 font-poppins text-2xl font-black italic leading-[1.15] text-white md:text-3xl lg:text-4xl">
            &ldquo;{value.quote}&rdquo;
          </p>
          {value.attribution && (
            <p className="mt-5 font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-red">
              — {value.attribution}
            </p>
          )}
        </aside>
      );
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleBody({ body }: { body: any[] }) {
  return (
    <div className="mx-auto max-w-3xl lg:max-w-4xl">
      <PortableText value={body} components={components} />
    </div>
  );
}