import type { Metadata } from "next";
import { serverClient } from "@/sanity/client";
import { linksPageQuery } from "@/sanity/queries/linksPage";
import { optimizeImg } from "@/lib/sanityImg";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "OBARE — Links",
  description: "The magazine that's real.",
  robots: { index: false, follow: true },
};

interface GridItem {
  imageUrl: string;
  imageHotspot?: { x?: number; y?: number };
  url: string;
}

interface LinksData {
  headline?: string;
  tagline?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  gridItems?: GridItem[];
  utmSource?: string;
  utmMedium?: string;
}

function withUtm(url: string, source?: string, medium?: string): string {
  if (!url) return "#";
  if (!source || url.startsWith("/") || url.startsWith("#")) return url;
  try {
    const u = new URL(url);
    if (u.searchParams.has("utm_source")) return url;
    u.searchParams.set("utm_source", source);
    if (medium) u.searchParams.set("utm_medium", medium);
    return u.toString();
  } catch { return url; }
}

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export default async function LinksPage() {
  const data = await serverClient.fetch<LinksData | null>(linksPageQuery).catch(() => null) ?? {};
  const { headline = "OBARE", tagline, profileImageUrl, bannerImageUrl, gridItems, utmSource, utmMedium } = data;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[614px]">

        {/* 1. Circle + name ── */}
        <div className="flex flex-col items-center px-6 pt-10 pb-4">
          {profileImageUrl && (
            <img
              src={optimizeImg(profileImageUrl, { w: 200 })}
              alt={headline}
              width={88}
              height={88}
              className="h-22 w-22 rounded-full object-contain border-2 border-white/30 mb-3 bg-black p-1.5"
              style={{ height: 88, width: 88 }}
            />
          )}
          <p className="font-montserrat text-sm font-bold text-white tracking-wide">
            {headline}
          </p>
          {tagline && (
            <p className="mt-0.5 font-montserrat text-xs text-white/40 tracking-wide">
              {tagline}
            </p>
          )}
        </div>

        {/* 2. Banner image ── */}
        {bannerImageUrl && (
          <div className="w-full bg-black px-0">
            <img
              src={optimizeImg(bannerImageUrl, { w: 1200, q: 90 })}
              alt={headline}
              width={1200}
              height={400}
              className="w-full object-contain"
            />
          </div>
        )}

        {/* 3. Instagram-style 3-column grid ── */}
        {(gridItems ?? []).length > 0 && (
          <div className="grid grid-cols-3" style={{ gap: "3px" }}>
            {(gridItems ?? []).map((item, i) => {
              if (!item.imageUrl) return null;
              const href = withUtm(item.url, utmSource, utmMedium);
              const ext = isExternal(item.url);
              const hotspot = item.imageHotspot;
              const objPos = hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number"
                ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
                : "center";
              return (
                <a
                  key={i}
                  href={href}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  className="group relative block overflow-hidden bg-zinc-900"
                  style={{ aspectRatio: "1 / 1" }}
                  aria-label="View article"
                >
                  <img
                    src={optimizeImg(item.imageUrl, { w: 400 })}
                    alt=""
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ objectPosition: objPos }}
                  />
                </a>
              );
            })}
          </div>
        )}

        <p className="py-6 text-center font-montserrat text-[9px] uppercase tracking-[0.35em] text-white/20">
          © OBARE Magazine
        </p>
      </div>
    </main>
  );
}
