/**
 * Append Sanity CDN optimization params to an image URL.
 *
 * Sanity's CDN can serve any uploaded image as WebP/AVIF (via `auto=format`)
 * and resize on the fly. This typically cuts payload 70–90% vs raw PNG.
 *
 *   optimizeImg("https://cdn.sanity.io/.../foo.png", { w: 800 })
 *   // => "https://cdn.sanity.io/.../foo.png?auto=format&q=75&w=800"
 */
export function optimizeImg(
  url: string | undefined | null,
  { w, h, q = 75 }: { w?: number; h?: number; q?: number } = {}
): string {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return url;

  const params = new URLSearchParams();
  params.set("auto", "format");
  params.set("q", String(q));
  if (w) params.set("w", String(w));
  if (h) params.set("h", String(h));

  return `${url}?${params.toString()}`;
}
