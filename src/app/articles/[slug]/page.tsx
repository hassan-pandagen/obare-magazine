import { notFound } from "next/navigation";
import { serverClient } from "@/sanity/client";
import { articleBySlugQuery, adjacentArticlesQuery } from "@/sanity/queries/articles";
import { urlFor } from "@/sanity/imageUrl";
import { RedEmphasis } from "@/lib/redEmphasis";
import ArticleBody from "@/components/portable/ArticleBody";
import NextArticleCard from "@/components/portable/NextArticleCard";
import HeroDeckBox from "@/components/portable/HeroDeckBox";
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
  const coverMobileSrc = article.coverImageMobile?.asset
    ? urlFor(article.coverImageMobile).width(900).url()
    : null;

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Hero — sticky deck: pins to viewport top while body slides up over it ── */}
        <section
          className="sticky top-0 z-0 w-full overflow-hidden bg-black"
          style={{ height: "100vh", minHeight: "600px" }}
        >
          {/* Cover media — fills the entire viewport, no borders, no padding */}
          {article.coverVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              {/* Mobile source first so the browser picks it before falling through */}
              {article.coverVideoMobile && (
                <source src={article.coverVideoMobile} media="(max-width: 767px)" type="video/mp4" />
              )}
              <source src={article.coverVideo} type="video/mp4" />
              <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
            </video>
          ) : coverSrc ? (
            <picture className="absolute inset-0 h-full w-full">
              {coverMobileSrc && (
                <source media="(max-width: 767px)" srcSet={coverMobileSrc} />
              )}
              <img
                src={coverSrc}
                alt={article.coverImage?.alt ?? article.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
          ) : (
            <div className="absolute inset-0 bg-zinc-900" />
          )}

          {/* Same global photo darken as homepage hero (Hero.tsx). Applied at section level
              so it darkens the photo on the LEFT (outside the deck box) too. */}
          <div className="pointer-events-none absolute inset-0 bg-black/30" />

          {/* ========== RED VIEWFINDER DECK BOX — rotates as one unit on scroll.
              All three layers (cloned photo + darken + red multiply) live INSIDE the rotating
              wrapper so multiply has a backdrop within its own stacking context (transform creates
              a new stacking context that isolates mix-blend-mode from outer ancestors).
              The cloned photo is sized to the full viewport with negative offsets matching the
              deck box's position, so at rest it aligns pixel-for-pixel with the main section
              photo. As the box rotates, photo + red wash + chrome rotate together. ========== */}
          <HeroDeckBox className="absolute right-0 bottom-0 top-24 left-[12%] overflow-hidden md:top-28 md:left-[18%] lg:top-32 lg:left-[22%]">
              <div className="relative h-full w-full">
                {/* Cloned photo backdrop — extends out of the deck box up & left so it aligns
                    with the main section photo. overflow-hidden on the deck box clips it back. */}
                <div className="pointer-events-none absolute h-screen w-screen -top-24 left-[-12vw] md:-top-28 md:left-[-18vw] lg:-top-32 lg:left-[-22vw]">
                  {article.coverVideo ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    >
                      {article.coverVideoMobile && (
                        <source src={article.coverVideoMobile} media="(max-width: 767px)" type="video/mp4" />
                      )}
                      <source src={article.coverVideo} type="video/mp4" />
                      <track kind="captions" src="/captions/empty.vtt" srcLang="en" label="English" default />
                    </video>
                  ) : coverSrc ? (
                    <picture className="absolute inset-0 h-full w-full">
                      {coverMobileSrc && (
                        <source media="(max-width: 767px)" srcSet={coverMobileSrc} />
                      )}
                      <img
                        src={coverSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </picture>
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                  )}
                  {/* Match the section's bg-black/30 so multiply backdrop is identical inside and out. */}
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                {/* Red multiply — same recipe as homepage hero, blends with the cloned photo above. */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ mixBlendMode: "multiply" }}
                >
                  <img
                    src="/images/red-accent.webp"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>

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
                      {article.modelName && (
                        <span className="ml-3 font-normal text-white/70">
                          | By {article.modelName}
                        </span>
                      )}
                    </span>
                  )}
                  <h1
                    className="font-poppins font-black uppercase leading-[0.9] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] max-w-[85%]"
                    style={{ fontSize: "clamp(2.25rem, 5.5vw, 5.5rem)" }}
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
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[100px] w-[28px] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-colors group-hover:text-white md:h-[140px] md:w-[40px] lg:h-[180px] lg:w-[52px]"
                    aria-hidden
                  >
                    <line x1="20" y1="10" x2="20" y2="118" />
                    <polyline points="6,98 20,128 34,98" />
                  </svg>
                </a>
              </div>
            </HeroDeckBox>
        </section>

        {/* Everything below the hero slides up over the pinned hero like a deck. */}
        <div className="relative z-10 bg-black">

        {/* ── Author strip — sits directly under the full-bleed hero ───── */}
        {article.authors && article.authors.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 border-b border-white/10 px-6 py-5 md:px-14 md:py-6 lg:px-20">
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
              // Hidden but SEO-active — keeps published-time signals for
              // Google, Google News, and screen readers without showing
              // a date to the reader, per client preference.
              <time
                dateTime={article.publishedAt}
                className="sr-only"
                itemProp="datePublished"
              >
                {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
          </div>
        )}

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
            Go Bare
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

        {/* ── Next article — Line Studio-style continuation.
             Falls back to the oldest article so the "Next" loop is endless. ── */}
        {(adjacent.next ?? adjacent.loopBack) && (
          <NextArticleCard next={adjacent.next ?? adjacent.loopBack} />
        )}

        {/* ── Back to all articles (only if there's nothing to loop to either) ── */}
        {!adjacent.next && !adjacent.loopBack && (
          <section className="border-t border-white/10 px-6 py-8 md:px-14 lg:px-20">
            <a
              href="/articles"
              className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white/35 transition-colors hover:text-white"
            >
              ← All Articles
            </a>
          </section>
        )}

        </div>
      </main>

      <Footer />
    </>
  );
}

