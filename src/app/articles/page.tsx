import { serverClient } from "@/sanity/client";
import { allArticlesQuery } from "@/sanity/queries/articles";
import { urlFor } from "@/sanity/imageUrl";
import { RedEmphasis } from "@/lib/redEmphasis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CATEGORIES = [
  "All",
  "Wellness",
  "Movement & Strength",
  "Mental Health",
  "Beauty",
  "Bare Models",
  "Features",
  "Self Improvement",
  "Inner World",
  "Travel",
  "Culture",
  "Editorial",
];

interface ArticleCard {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  modelName?: string;
  publishedAt: string;
  excerpt?: string;
  coverImage?: { asset: unknown; alt?: string };
  coverImageMobile?: { asset: unknown };
  authors?: { name: string; role?: string }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const revalidate = 60;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const articles: ArticleCard[] = await serverClient.fetch(allArticlesQuery);

  const activeCategory = params.category ?? "All";
  const searchQuery = (params.q ?? "").toLowerCase();

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery) ||
      (a.authors ?? []).some((au) => au.name.toLowerCase().includes(searchQuery)) ||
      (a.excerpt ?? "").toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <section className="px-6 pb-10 pt-40 md:px-14 lg:px-20">
          <span className="mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            The Archive
          </span>
          <h1 className="font-poppins text-[12vw] font-black uppercase leading-[0.85] md:text-[7vw]">
            Articles
          </h1>
        </section>

        {/* ── Search + Filter ─────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-6 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <form method="GET" className="relative w-full md:max-w-xs">
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search Obare"
                className="w-full border-b border-white/20 bg-transparent pb-2 pr-8 font-montserrat text-sm text-white outline-none placeholder:text-white/25 focus:border-white"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 font-montserrat text-white/40 hover:text-white"
                aria-label="Search"
              >
                ↵
              </button>
            </form>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={cat === "All" ? "/articles" : `/articles?category=${encodeURIComponent(cat)}`}
                  className={`rounded-full px-4 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                    activeCategory === cat
                      ? "bg-red text-white"
                      : "border border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Article Grid ────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-12 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-montserrat text-sm text-white/40">
                  No articles found{searchQuery ? ` for "${params.q}"` : ""}.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ArticleCard({ article }: { article: ArticleCard }) {
  const imgSrc = article.coverImage?.asset
    ? urlFor(article.coverImage).width(600).height(400).fit("crop").url()
    : null;
  const imgMobileSrc = article.coverImageMobile?.asset
    ? urlFor(article.coverImageMobile).width(500).height(700).fit("crop").url()
    : null;

  const slug = article.slug?.current;
  if (!slug) return null;

  return (
    <a
      href={`/articles/${slug}`}
      className="group flex flex-col"
    >
      {/* Cover */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-900">
        {imgSrc ? (
          <picture>
            {imgMobileSrc && (
              <source media="(max-width: 767px)" srcSet={imgMobileSrc} />
            )}
            <img
              src={imgSrc}
              alt={article.coverImage?.alt ?? article.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        {article.category && (
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
            {article.category}
            {article.modelName && (
              <span className="ml-2 font-normal text-white/70">| By {article.modelName}</span>
            )}
          </span>
        )}
      </div>

      {/* Meta — date is hidden from the reader (client preference) but kept
          in the DOM as a semantic <time> element so Google, Google News,
          social crawlers, and screen readers still pick up the publish date. */}
      <div className="mt-5 flex flex-col flex-1">
        <p className="font-montserrat text-[10px] text-white/35">
          {article.authors?.[0]?.name ?? ""}
        </p>
        {article.publishedAt && (
          <time
            dateTime={article.publishedAt}
            className="sr-only"
            itemProp="datePublished"
          >
            {formatDate(article.publishedAt)}
          </time>
        )}
        <h2 className="mt-2 font-poppins text-xl font-black uppercase leading-tight text-white underline decoration-transparent decoration-2 underline-offset-[6px] transition-[color,text-decoration-color] duration-300 group-hover:text-red group-hover:decoration-red">
          <RedEmphasis>{article.title}</RedEmphasis>
        </h2>
        {article.excerpt && (
          <p className="mt-3 line-clamp-2 font-montserrat text-sm leading-relaxed text-white/50">
            <RedEmphasis>{article.excerpt}</RedEmphasis>
          </p>
        )}
        <span className="mt-4 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white/30 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-300 group-hover:text-red group-hover:decoration-red">
          Read →
        </span>
      </div>
    </a>
  );
}