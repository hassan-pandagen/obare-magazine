export interface SanityHotspot {
  x?: number;
  y?: number;
}

/**
 * Append Sanity CDN optimization params to an image URL.
 *
 * Sanity's CDN can serve any uploaded image as WebP/AVIF (via `auto=format`)
 * and resize on the fly. This typically cuts payload 70–90% vs raw PNG.
 *
 * When a hotspot is provided, it uses focalpoint cropping so the editor's
 * chosen subject stays in frame regardless of the container's aspect ratio.
 *
 *   optimizeImg(url, { w: 800 })
 *   optimizeImg(url, { w: 800, hotspot: { x: 0.4, y: 0.2 } })
 */
export function optimizeImg(
  url: string | undefined | null,
  {
    w,
    h,
    q = 75,
    hotspot,
  }: { w?: number; h?: number; q?: number; hotspot?: SanityHotspot } = {}
): string {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return url;

  const params = new URLSearchParams();
  params.set("auto", "format");
  params.set("q", String(q));
  if (w) params.set("w", String(w));
  if (h) params.set("h", String(h));

  if (hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number") {
    params.set("fit", "crop");
    params.set("crop", "focalpoint");
    params.set("fp-x", hotspot.x.toFixed(3));
    params.set("fp-y", hotspot.y.toFixed(3));
  }

  return `${url}?${params.toString()}`;
}
