import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverClient } from "@/sanity/client";
import { articleBySlugQuery, adjacentArticlesQuery } from "@/sanity/queries/articles";
import { urlFor } from "@/sanity/imageUrl";
import { RedEmphasis } from "@/lib/redEmphasis";
import ArticleBody from "@/components/portable/ArticleBody";
import NextArticleCard from "@/components/portable/NextArticleCard";
import HeroDeckBox from "@/components/portable/HeroDeckBox";
import ShareButton from "@/components/portable/ShareButton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 60;

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await serverClient.fetch(articleBySlugQuery, { slug });
  if (!article) return { title: "Article Not Found — OBARE Magazine" };

  const title = `${article.title.replace(/\*\*/g, "")} — OBARE Magazine`;
  const description =
    article.excerpt?.replace(/\*\*/g, "")?.slice(0, 160) ??
    `Read ${article.title.replace(/\*\*/g, "")} on OBARE Magazine. The magazine that's real.`;
  const ogImage = article.coverImage?.asset ? urlFor(article.coverImage).width(1200).height(630).url() : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: article.title }] : undefined,
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
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
          className="sticky top-0 z-0 w-full overflow-hidden bg-black h-[78vh] min-h-[520px] md:h-screen md:min-h-[600px]"
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

          <div className="pointer-events-none absolute inset-0 bg-black/30" />
          {article.coverImage?.credit && (
            <div className="absolute bottom-4 right-4 z-10">
              {article.coverImage.creditUrl ? (
                <a href={article.coverImage.creditUrl} target="_blank" rel="noopener noreferrer"
                  className="font-archivo text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 transition-colors hover:text-white/70 md:text-[10px]">
                  Photo by {article.coverImage.credit}
                </a>
              ) : (
                <span className="font-archivo text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 md:text-[10px]">
                  Photo by {article.coverImage.credit}
                </span>
              )}
            </div>
          )}


          {/* Red panel — covers right 55% full height on mobile, large portion on desktop */}
          <div className="absolute bottom-0 right-0 top-0 left-0 overflow-hidden md:top-28 md:left-[18%] lg:top-32 lg:left-[22%]">
            <HeroDeckBox className="absolute bottom-0 left-0 right-0 top-[25%] md:top-0">

              {/* Headline — top of panel */}
              <div className="absolute left-0 right-0 top-[5%] px-4 md:top-[8%] md:px-8 lg:px-12" style={{ bottom: "28%" }}>
                {article.category && (
                  <span className="mb-3 block font-montserrat text-[9px] font-bold uppercase tracking-[0.45em] text-white/70 md:mb-4 md:text-[10px]">
                    {article.category}
                    {article.modelName && (
                      <span className="ml-2 font-normal text-white/40">· {article.modelName}</span>
                    )}
                  </span>
                )}
                <h1
                  className="font-poppins font-black uppercase text-white w-full"
                  style={{
                    fontSize: "clamp(2.4rem, 13vw, 8rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.02em",
                    wordBreak: "break-word",
                    hyphens: "none",
                  }}
                >
                  <RedEmphasis>{article.title}</RedEmphasis>
                </h1>
              </div>

              {/* Arrow — bottom of panel */}
              <a
                href="#article-body"
                aria-label="Scroll to article"
                className="group absolute bottom-[14%] left-5 outline-none focus:outline-none md:bottom-20 md:left-10 lg:bottom-24 lg:left-14"
              >
                <svg
                  viewBox="0 0 24 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[80px] w-[36px] text-white transition-opacity group-hover:opacity-60 md:h-[120px] md:w-[50px]"
                  aria-hidden
                >
                  <line x1="12" y1="2" x2="12" y2="30" />
                  <polyline points="2,20 12,32 22,20" />
                </svg>
              </a>
            </HeroDeckBox>
          </div>
        </section>

        {/* Everything below the hero slides up over the pinned hero like a deck. */}
        <div
          className="relative z-10 bg-black"
          style={(() => {
            const c =
              article.dropCapColor === "custom"
                ? article.dropCapColorCustom
                : article.dropCapColor;
            return c ? ({ ["--dropcap-color" as string]: c } as React.CSSProperties) : undefined;
          })()}
        >

        {/* ── Author strip ───── */}
        <div className="border-b border-white/10 px-6 py-5 md:px-14 md:py-6 lg:px-20">
          {/* Authors row */}
          {article.authors && article.authors.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-5">
              {article.authors.map(
                (a: { name: string; role?: string; photo?: string }, i: number) => (
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
                <time dateTime={article.publishedAt} className="sr-only" itemProp="datePublished">
                  {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              )}
            </div>
          )}
          {/* Share pill — always centered */}
          <ShareButton title={article.title} />
        </div>

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

          {/* Vertical "Go Bare" CTAs on each side — desktop only.
              Right side is aria-hidden since it's a decorative mirror of the left link. */}
          <a
            href="/submissions"
            aria-label="Go Bare — submit your work"
            className="absolute left-6 top-1/2 hidden -translate-y-1/2 select-none font-archivo text-xs font-bold uppercase tracking-[0.4em] text-white/25 transition-colors hover:text-white lg:block"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}
          >
            Go Bare →
          </a>
          <a
            href="/submissions"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute right-6 top-1/2 hidden -translate-y-1/2 select-none font-archivo text-xs font-bold uppercase tracking-[0.4em] text-white/25 transition-colors hover:text-white lg:block"
            style={{ writingMode: "vertical-rl" }}
          >
            Go Bare →
          </a>

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

