import type { Metadata } from "next";
import { serverClient } from "@/sanity/client";
import { linksPageQuery } from "@/sanity/queries/linksPage";
import { optimizeImg } from "@/lib/sanityImg";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "OBARE — Links",
  description: "The magazine that's real. Our latest stories, reels, and more.",
  robots: { index: false, follow: true },
};

interface GridItem {
  imageUrl: string;
  imageHotspot?: { x?: number; y?: number };
  alt?: string;
  url: string;
  caption?: string;
}

interface LinkItem {
  label: string;
  sublabel?: string;
  url: string;
  accent?: "standard" | "red" | "ghost";
}

interface LinksData {
  headline?: string;
  tagline?: string;
  profileImageUrl?: string;
  profileImageHotspot?: { x?: number; y?: number };
  featuredEnabled?: boolean;
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredUrl?: string;
  featuredImageUrl?: string;
  featuredImageHotspot?: { x?: number; y?: number };
  links?: LinkItem[];
  gridItems?: GridItem[];
  utmSource?: string;
  utmMedium?: string;
}

function withUtm(url: string, source?: string, medium?: string): string {
  if (!url) return "#";
  if (!source) return url;
  if (url.startsWith("/") || url.startsWith("#")) return url;
  try {
    const u = new URL(url);
    if (u.searchParams.has("utm_source")) return url;
    u.searchParams.set("utm_source", source);
    if (medium) u.searchParams.set("utm_medium", medium);
    return u.toString();
  } catch {
    return url;
  }
}

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export default async function LinksPage() {
  const data = await serverClient.fetch<LinksData | null>(linksPageQuery).catch(() => null) ?? {};
  const {
    headline = "OBARE",
    tagline,
    profileImageUrl,
    featuredEnabled,
    featuredTitle,
    featuredSubtitle,
    featuredUrl,
    featuredImageUrl,
    featuredImageHotspot,
    links,
    gridItems,
    utmSource,
    utmMedium,
  } = data;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ── Header ── */}
      <div className="flex flex-col items-center px-6 pt-10 pb-6">
        {profileImageUrl && (
          <img
            src={optimizeImg(profileImageUrl, { w: 160 })}
            alt={headline}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover border border-white/20 mb-4"
          />
        )}
        <h1 className="font-poppins text-2xl font-black uppercase tracking-[0.06em] text-white">
          {headline}
        </h1>
        {tagline && (
          <p className="mt-1 font-montserrat text-xs text-white/50 tracking-[0.2em] uppercase">
            {tagline}
          </p>
        )}
      </div>

      {/* ── Featured hero banner ── */}
      {featuredEnabled && featuredUrl && featuredImageUrl && (
        <a
          href={withUtm(featuredUrl, utmSource, utmMedium)}
          target={isExternal(featuredUrl) ? "_blank" : undefined}
          rel={isExternal(featuredUrl) ? "noopener noreferrer" : undefined}
          className="group relative block w-full overflow-hidden"
          style={{ aspectRatio: "2 / 1" }}
        >
          <img
            src={optimizeImg(featuredImageUrl, { w: 1200, hotspot: featuredImageHotspot })}
            alt={featuredTitle ?? "Featured"}
            width={1200}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {(featuredTitle || featuredSubtitle) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              {featuredTitle && (
                <h2 className="font-poppins text-3xl font-black uppercase leading-tight text-white md:text-5xl">
                  {featuredTitle}
                </h2>
              )}
              {featuredSubtitle && (
                <p className="mt-2 font-montserrat text-sm text-white/70 md:text-base">
                  {featuredSubtitle}
                </p>
              )}
            </div>
          )}
        </a>
      )}

      {/* ── Image grid ── */}
      {(gridItems ?? []).length > 0 && (
        <div className="grid grid-cols-3">
          {(gridItems ?? []).map((item, i) => {
            const href = withUtm(item.url, utmSource, utmMedium);
            const ext = isExternal(item.url);
            const hotspot = item.imageHotspot;
            const bgPos = hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number"
              ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
              : "center";
            return (
              <a
                key={i}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="group relative block overflow-hidden"
                style={{ aspectRatio: "1 / 1" }}
                aria-label={item.caption ?? item.alt ?? "View"}
              >
                <img
                  src={optimizeImg(item.imageUrl, { w: 500 })}
                  alt={item.alt ?? item.caption ?? ""}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  style={{ objectPosition: bgPos }}
                />
                {item.caption && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="w-full p-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                      {item.caption}
                    </p>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}

      {/* ── Link buttons (below grid) ── */}
      {(links ?? []).length > 0 && (
        <nav className="mx-auto flex max-w-sm flex-col gap-3 px-6 py-10">
          {(links ?? []).map((item, i) => {
            const accentCls =
              item.accent === "red"
                ? "bg-red text-white border-red hover:opacity-90"
                : item.accent === "ghost"
                ? "bg-transparent text-white/70 border-white/10 hover:text-white hover:border-white/30"
                : "bg-white/[0.05] text-white border-white/15 hover:bg-white/[0.10] hover:border-white/30";
            const href = withUtm(item.url, utmSource, utmMedium);
            const ext = isExternal(item.url);
            return (
              <a
                key={i}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className={`flex min-h-[52px] items-center justify-between rounded-full border px-6 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.15em] transition-all ${accentCls}`}
              >
                <span className="flex flex-col">
                  <span>{item.label}</span>
                  {item.sublabel && (
                    <span className="mt-0.5 text-[10px] font-normal normal-case tracking-normal opacity-60">
                      {item.sublabel}
                    </span>
                  )}
                </span>
                <span aria-hidden className="opacity-60">→</span>
              </a>
            );
          })}
        </nav>
      )}

      <p className="pb-10 text-center font-montserrat text-[10px] uppercase tracking-[0.4em] text-white/25">
        © OBARE Magazine
      </p>
    </main>
  );
}
