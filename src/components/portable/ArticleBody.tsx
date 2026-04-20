"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/imageUrl";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 font-montserrat text-base leading-[1.85] text-white/75">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-12 font-poppins text-3xl font-black uppercase leading-tight text-white md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 font-poppins text-2xl font-black uppercase leading-tight text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-8 font-poppins text-xl font-black uppercase text-white">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-red pl-6 font-poppins text-xl font-black italic leading-snug text-white md:text-2xl">
        {children}
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
    // Inline image
    image: ({ value }) => {
      if (!value?.url && !value?.asset) return null;
      const src = value.url ?? urlFor(value).width(1200).url();
      return (
        <figure className="my-10">
          <img
            src={src}
            alt={value.alt ?? ""}
            className="w-full rounded-sm object-cover"
          />
          {value.caption && (
            <figcaption className="mt-3 font-montserrat text-xs text-white/40">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Inline video (landscape / embed)
    inlineVideo: ({ value }) => {
      if (!value?.fileUrl) return null;
      return (
        <figure className="my-10">
          <video
            src={value.fileUrl}
            poster={value.posterUrl}
            controls={!value.autoplay}
            autoPlay={value.autoplay}
            muted={value.autoplay}
            loop={value.autoplay}
            playsInline
            className="w-full rounded-sm"
          />
          {value.caption && (
            <figcaption className="mt-3 font-montserrat text-xs text-white/40">
              {value.caption}
            </figcaption>
          )}
        </figure>
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

    // Image gallery (horizontal scroll on mobile, grid on desktop)
    gallery: ({ value }) => {
      if (!value?.images?.length) return null;
      return (
        <figure className="my-10">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {value.images.map((img: { url: string; alt?: string; _key?: string }, i: number) => (
              <img
                key={img._key ?? i}
                src={img.url}
                alt={img.alt ?? ""}
                className="aspect-square w-full object-cover rounded-sm"
              />
            ))}
          </div>
          {value.caption && (
            <figcaption className="mt-3 font-montserrat text-xs text-white/40">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Pull quote
    pullQuote: ({ value }) => {
      if (!value?.quote) return null;
      return (
        <aside className="my-12 border-y border-white/10 py-10 text-center">
          <p className="font-poppins text-2xl font-black italic leading-snug text-white md:text-3xl">
            &ldquo;{value.quote}&rdquo;
          </p>
          {value.attribution && (
            <p className="mt-4 font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-red">
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
    <div className="mx-auto max-w-2xl">
      <PortableText value={body} components={components} />
    </div>
  );
}