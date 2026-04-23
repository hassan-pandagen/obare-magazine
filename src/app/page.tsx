import { client } from "@/sanity/client";
import {
  homepageSettingsQuery,
  homepageReelsQuery,
} from "@/sanity/queries/homepage";
import HomeClient, {
  type HomeProject,
  type HomeReel,
  type HomeStory,
} from "@/components/sections/HomeClient";

export const revalidate = 60;

interface SettingsResult {
  homepageProjects?: Array<{
    title: string;
    subtitle?: string;
    category?: string;
    author?: string;
    imageAlt?: string;
    videoUrl?: string;
    imageUrl?: string;
    imageHotspot?: { x?: number; y?: number };
    imageMobileUrl?: string;
    imageMobileHotspot?: { x?: number; y?: number };
    linkedSlug?: string;
    externalHref?: string;
  }>;
  editorialStories?: Array<{
    title: string;
    subtitle?: string;
    category?: string;
    accent?: string;
    imageAlt?: string;
    imageUrl?: string;
    imageMobileUrl?: string;
    linkedSlug?: string;
  }>;
}

interface ReelResult {
  _id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl?: string;
  linkedSlug?: string;
}

export default async function Home() {
  const [settings, reelDocs] = await Promise.all([
    client.fetch<SettingsResult | null>(homepageSettingsQuery),
    client.fetch<ReelResult[]>(homepageReelsQuery),
  ]);

  const projects: HomeProject[] = (settings?.homepageProjects ?? []).map(
    (p, i) => ({
      id: `project-${i}`,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      author: p.author,
      videoSrc: p.videoUrl,
      imageSrc: p.imageUrl,
      imageAlt: p.imageAlt,
      imageHotspot: p.imageHotspot,
      imageMobileSrc: p.imageMobileUrl,
      imageMobileHotspot: p.imageMobileHotspot,
      href: p.linkedSlug
        ? `/articles/${p.linkedSlug}`
        : p.externalHref ?? "#",
    })
  );

  const reels: HomeReel[] = (reelDocs ?? []).map((r) => ({
    id: r._id,
    title: r.title,
    category: r.category,
    videoSrc: r.videoUrl,
    posterSrc: r.posterUrl ?? "",
    href: r.linkedSlug ? `/articles/${r.linkedSlug}` : "#",
  }));

  const stories: HomeStory[] = (settings?.editorialStories ?? []).map(
    (s, i) => ({
      id: `story-${i}`,
      title: s.title,
      subtitle: s.subtitle,
      category: s.category,
      image: s.imageUrl ?? "",
      imageMobile: s.imageMobileUrl,
      imageAlt: s.imageAlt,
      accent: s.accent ?? "bg-red",
      href: s.linkedSlug ? `/articles/${s.linkedSlug}` : "#",
    })
  );

  return <HomeClient projects={projects} reels={reels} stories={stories} />;
}
