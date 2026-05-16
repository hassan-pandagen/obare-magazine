import type { MetadataRoute } from "next";
import { serverClient } from "@/sanity/client";
import { groq } from "next-sanity";

const SITE_URL = "https://obare.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/submissions`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/event`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/reels`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/links`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic article routes from Sanity
  try {
    const articles = await serverClient.fetch<Array<{ slug: string; publishedAt?: string }>>(
      groq`*[_type == "article" && defined(slug.current)] {
        "slug": slug.current,
        "publishedAt": publishedAt
      }`
    );

    const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: a.publishedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
