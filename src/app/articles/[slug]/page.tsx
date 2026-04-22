import { notFound } from "next/navigation";
import { serverClient } from "@/sanity/client";
import { articleBySlugQuery, adjacentArticlesQuery } from "@/sanity/queries/articles";
import { urlFor } from "@/sanity/imageUrl";
import { RedEmphasis } from "@/lib/redEmphasis";
import ArticleBody from "@/components/portable/ArticleBody";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 60;

interface Params {
  slug: string;
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const article = await serverClient.fetch(articleBySlugQuery, { slug });
  if (!article) notFound();

  const adjacent = await serverClient.fetch(adjacentArticlesQuery, {
    publishedAt: article.publishedAt,
  });

  const coverSrc = article.coverImage?.asset
    ? urlFor(article.coverImage).width(1600).url()
    : null;

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative w-full px-4 pb-8 pt-24 md:px-10 md:pb-12 md:pt-28 lg:px-14">
          {/* Outer container — shows the cover image cleanly, no border */}
          <div className="relative w-full overflow-hidden bg-black shadow-[0_20px_80px_rgba(0,0,0,0.5)]" style={{ minHeight: "75vh" }}>
            {/* Cover media (full-bleed, natural colors) */}
            {article.coverVideo ? (
              <video
                src={article.coverVideo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
              </video>
            ) : coverSrc ? (
              <img
                src={coverSrc}
                alt={article.coverImage?.alt ?? article.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-900" />
            )}

            {/* ========== INNER RED VIEWFINDER BOX — flush right & bottom, offset top & left ========== */}
            <div className="absolute right-0 bottom-0 top-8 left-[12%] md:top-12 md:left-[18%] lg:top-16 lg:left-[22%]">
              <div className="relative h-full w-full overflow-hidden border-[3px] border-red">
                {/* Red tint on just this inner box */}
                <div className="pointer-events-none absolute inset-0 bg-red/40 mix-blend-multiply" />
                {/* Dark gradient so chrome reads */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                {/* Camera UI chrome (inside the red box) */}
                <div className="pointer-events-none absolute inset-0 text-white">
                  <div className="absolute left-4 top-4 flex items-center gap-2 font-archivo text-[10px] font-bold tracking-[0.15em] md:left-6 md:top-6 md:text-xs">
                    <span className="inline-block h-2 w-2 rounded-full bg-red" />
                    2026.4.21
                    <span className="opacity-70">03:50 PM</span>
                  </div>
                  <div className="absolute right-4 top-4 rounded-sm bg-black/40 px-2 py-0.5 font-archivo text-[10px] font-bold tracking-[0.15em] backdrop-blur-sm md:right-6 md:top-6 md:text-xs">
                    200-300
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 font-archivo text-[10px] font-bold tracking-[0.15em] md:bottom-6 md:left-6 md:text-xs">
                    <span>F. 3.2</span>
                    <span className="rounded-sm bg-white/90 px-1.5 py-0.5 text-black">ISO</span>
                    <span>800</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 font-archivo text-[10px] font-bold tracking-[0.15em] md:bottom-6 md:right-6 md:text-xs">
                    <span className="rounded-sm bg-black/40 px-1.5 py-0.5 backdrop-blur-sm">RAW</span>
                    <span>3/10</span>
                  </div>
                </div>

                {/* Headline at top */}
                <div className="absolute left-0 right-0 top-14 px-6 md:top-20 md:px-10 lg:top-24 lg:px-14">
                  {article.category && (
                    <span className="mb-3 block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-red md:text-xs">
                      {article.category}
                    </span>
                  )}
                  <h1
                    className="font-poppins font-black uppercase leading-[0.88] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
                  >
                    <RedEmphasis>{article.title}</RedEmphasis>
                  </h1>
                </div>

                {/* Big pointy scroll-down arrow — left side inside red box */}
                <a
                  href="#article-body"
                  aria-label="Scroll to article"
                  className="group absolute bottom-16 left-6 md:bottom-20 md:left-10 lg:bottom-24 lg:left-14"
                >
                  <svg
                    viewBox="0 0 40 140"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className="h-[100px] w-[28px] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-colors group-hover:text-white md:h-[140px] md:w-[40px] lg:h-[180px] lg:w-[52px]"
                    aria-hidden
                  >
                    <line x1="20" y1="4" x2="20" y2="120" />
                    <polyline points="4,100 20,132 36,100" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Author + date below the frame */}
          {article.authors && article.authors.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4 px-2 md:mt-8">
              {article.authors.map(
                (
                  a: { name: string; role?: string; photo?: string },
                  i: number
                ) => (
                  <div key={i} className="flex items-center gap-2">
                    {a.photo && (
                      <img src={a.photo} alt={a.name} className="h-8 w-8 rounded-full object-cover" />
                    )}
                    <span className="font-montserrat text-xs text-white/70">
                      {a.name}
                      {a.role && <span className="text-white/40"> · {a.role}</span>}
                    </span>
                  </div>
                )
              )}
              {article.publishedAt && (
                <span className="font-montserrat text-xs text-white/35">
                  {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          )}
        </section>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <section id="article-body" className="relative overflow-hidden px-6 py-16 md:px-14 lg:px-20">
          {/* Film grain overlay — subtle editorial texture while reading */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
            }}
          />

          {/* Vertical "IN THE MAGAZINE" flourishes on each side — desktop only */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 select-none font-archivo text-xs font-bold uppercase tracking-[0.4em] text-white/25 lg:block"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}
          >
            In the Magazine
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 select-none font-archivo text-xs font-bold uppercase tracking-[0.4em] text-white/25 lg:block"
            style={{ writingMode: "vertical-rl" }}
          >
            In the Magazine
          </span>

          {/* Big faint red drop-cap flourish at the top of the body */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-6 hidden -translate-x-1/2 select-none font-poppins text-[10vw] font-black leading-none text-red/[0.06] md:block"
          >
            OBARE
          </span>

          <div className="relative z-10">
            {/* Excerpt shown here only on mobile — desktop shows it in the hero already */}
            {article.excerpt && (
              <p className="mx-auto mb-12 max-w-2xl font-poppins text-xl font-black italic leading-snug text-white/60 md:hidden">
                <RedEmphasis>{article.excerpt}</RedEmphasis>
              </p>
            )}
            {article.body && <ArticleBody body={article.body} />}
          </div>
        </section>

        {/* ── Prev / Next ───────────────────────────────────────────────── */}
        {(adjacent.prev || adjacent.next) && (
          <section className="border-t border-white/10 px-6 py-12 md:px-14 lg:px-20">
            <div className="mx-auto flex max-w-4xl justify-between gap-8">
              {adjacent.prev ? (
                <a
                  href={`/articles/${adjacent.prev.slug.current}`}
                  className="group flex max-w-xs flex-col gap-2"
                >
                  <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 transition-colors group-hover:text-red">
                    ← Previous
                  </span>
                  <span className="font-poppins text-sm font-black uppercase leading-tight text-white/60 transition-colors group-hover:text-white">
                    {adjacent.prev.title}
                  </span>
                  {adjacent.prev.category && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/25">
                      {adjacent.prev.category}
                    </span>
                  )}
                </a>
              ) : (
                <div />
              )}

              {adjacent.next ? (
                <a
                  href={`/articles/${adjacent.next.slug.current}`}
                  className="group flex max-w-xs flex-col items-end gap-2 text-right"
                >
                  <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 transition-colors group-hover:text-red">
                    Next →
                  </span>
                  <span className="font-poppins text-sm font-black uppercase leading-tight text-white/60 transition-colors group-hover:text-white">
                    {adjacent.next.title}
                  </span>
                  {adjacent.next.category && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/25">
                      {adjacent.next.category}
                    </span>
                  )}
                </a>
              ) : (
                <div />
              )}
            </div>
          </section>
        )}

        {/* ── Back to articles ─────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-8 md:px-14 lg:px-20">
          <a
            href="/articles"
            className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white/35 transition-colors hover:text-white"
          >
            ← All Articles
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}

