import { notFound } from "next/navigation";
import { serverClient } from "@/sanity/client";
import { articleBySlugQuery, adjacentArticlesQuery } from "@/sanity/queries/articles";
import { urlFor } from "@/sanity/imageUrl";
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
        <section className="relative min-h-[70vh] w-full overflow-hidden">
          {/* Cover media */}
          {article.coverVideo ? (
            <video
              src={article.coverVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : coverSrc ? (
            <img
              src={coverSrc}
              alt={article.coverImage?.alt ?? article.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-900" />
          )}

          {/* Gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

          {/* Text */}
          <div className="absolute bottom-10 left-6 right-6 md:bottom-16 md:left-14 lg:bottom-20 lg:left-20 lg:right-20">
            <div className="mx-auto max-w-4xl">
              {article.category && (
                <span className="mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
                  {article.category}
                </span>
              )}
              <h1 className="font-poppins text-[9vw] font-black uppercase leading-[0.88] text-white md:text-[6vw] lg:text-[5vw]">
                {article.title}
              </h1>

              {/* Authors */}
              {article.authors?.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {article.authors.map(
                    (
                      a: { name: string; role?: string; photo?: string },
                      i: number
                    ) => (
                      <div key={i} className="flex items-center gap-2">
                        {a.photo && (
                          <img
                            src={a.photo}
                            alt={a.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        )}
                        <span className="font-montserrat text-xs text-white/70">
                          {a.name}
                          {a.role && (
                            <span className="text-white/40"> · {a.role}</span>
                          )}
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
            </div>
          </div>
        </section>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <section className="px-6 py-16 md:px-14 lg:px-20">
          {article.excerpt && (
            <p className="mx-auto mb-12 max-w-2xl font-poppins text-xl font-black italic leading-snug text-white/60 md:text-2xl">
              {article.excerpt}
            </p>
          )}
          {article.body && <ArticleBody body={article.body} />}
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