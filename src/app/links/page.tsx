import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { linksPageQuery } from "@/sanity/queries/linksPage";
import { optimizeImg } from "@/lib/sanityImg";
import { RedEmphasis } from "@/lib/redEmphasis";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "OBARE — Links",
  description: "The magazine that's real. Our latest stories, reels, and more.",
  robots: { index: false, follow: true },
};

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
  utmSource?: string;
  utmMedium?: string;
}

/**
 * Append UTM params to a URL for analytics tracking.
 * Skips internal relative links and links that already have UTMs.
 */
function withUtm(url: string, source?: string, medium?: string): string {
  if (!url) return "#";
  if (!source) return url;
  // Internal links don't need UTM (same-site tracking)
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
  const data = (await client.fetch<LinksData | null>(linksPageQuery)) ?? {};
  const {
    headline = "OBARE",
    tagline,
    profileImageUrl,
    profileImageHotspot,
    featuredEnabled,
    featuredTitle,
    featuredSubtitle,
    featuredUrl,
    featuredImageUrl,
    featuredImageHotspot,
    links = [],
    utmSource,
    utmMedium,
  } = data;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 pb-16 pt-14">
        {/* Profile */}
        {profileImageUrl && (
          <div
            className="h-24 w-24 overflow-hidden rounded-full border border-white/15"
            style={{
              backgroundImage: `url(${optimizeImg(profileImageUrl, { w: 240, hotspot: profileImageHotspot })})`,
              backgroundSize: "cover",
              backgroundPosition:
                profileImageHotspot && typeof profileImageHotspot.x === "number"
                  ? `${(profileImageHotspot.x ?? 0.5) * 100}% ${(profileImageHotspot.y ?? 0.5) * 100}%`
                  : "center",
            }}
            aria-hidden
          />
        )}

        <h1 className="mt-5 text-center font-poppins text-xl font-black uppercase tracking-wide">
          <RedEmphasis>{headline}</RedEmphasis>
        </h1>
        {tagline && (
          <p className="mt-2 text-center font-montserrat text-sm leading-relaxed text-white/60">
            <RedEmphasis>{tagline}</RedEmphasis>
          </p>
        )}

        {/* Featured card */}
        {featuredEnabled && featuredUrl && (
          <a
            href={withUtm(featuredUrl, utmSource, utmMedium)}
            target={isExternal(featuredUrl) ? "_blank" : undefined}
            rel={isExternal(featuredUrl) ? "noopener noreferrer" : undefined}
            className="group mt-10 relative block w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition-all hover:border-red"
            style={{ aspectRatio: "16 / 10" }}
          >
            {featuredImageUrl && (
              <div
                className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-[1.03]"
                style={{
                  backgroundImage: `url(${optimizeImg(featuredImageUrl, { w: 800, hotspot: featuredImageHotspot })})`,
                  backgroundPosition:
                    featuredImageHotspot && typeof featuredImageHotspot.x === "number"
                      ? `${(featuredImageHotspot.x ?? 0.5) * 100}% ${(featuredImageHotspot.y ?? 0.5) * 100}%`
                      : "center",
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute left-0 top-0 m-4">
              <span className="rounded-full bg-red px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.3em] text-white">
                Featured
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              {featuredTitle && (
                <h2 className="font-poppins text-lg font-black uppercase leading-tight">
                  <RedEmphasis>{featuredTitle}</RedEmphasis>
                </h2>
              )}
              {featuredSubtitle && (
                <p className="mt-1 font-montserrat text-xs text-white/75">
                  <RedEmphasis>{featuredSubtitle}</RedEmphasis>
                </p>
              )}
            </div>
          </a>
        )}

        {/* Links */}
        <nav className="mt-8 flex w-full flex-col gap-3">
          {links.map((item, i) => {
            const accentCls =
              item.accent === "red"
                ? "bg-red text-white border-red hover:opacity-90"
                : item.accent === "ghost"
                ? "bg-transparent text-white/70 border-white/10 hover:text-white hover:border-white/30"
                : "bg-white/[0.04] text-white border-white/15 hover:bg-white/[0.08] hover:border-white/30";
            const href = withUtm(item.url, utmSource, utmMedium);
            const ext = isExternal(item.url);
            return (
              <a
                key={i}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className={`flex min-h-[56px] items-center justify-between rounded-full border px-6 py-4 font-montserrat text-sm font-bold uppercase tracking-[0.15em] transition-all ${accentCls}`}
              >
                <span className="flex flex-col items-start text-left">
                  <span><RedEmphasis>{item.label}</RedEmphasis></span>
                  {item.sublabel && (
                    <span className="mt-0.5 text-[10px] font-normal normal-case tracking-normal opacity-70">
                      <RedEmphasis>{item.sublabel}</RedEmphasis>
                    </span>
                  )}
                </span>
                <span aria-hidden className="text-xs opacity-70">→</span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <p className="mt-14 font-montserrat text-[10px] uppercase tracking-[0.4em] text-white/30">
          © OBARE Magazine
        </p>
      </div>
    </main>
  );
}
