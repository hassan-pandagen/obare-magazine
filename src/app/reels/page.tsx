import { serverClient } from "@/sanity/client";
import { allReelsQuery } from "@/sanity/queries/homepage";
import { reelsCopyQuery } from "@/sanity/queries/aboutPage";
import ReelsIndexClient, { type ReelItem, type ReelsCopy } from "@/components/sections/ReelsIndexClient";

export const revalidate = 60;

interface ReelDoc {
  _id: string;
  title: string;
  category: string;
  videoUrl?: string;
  posterUrl?: string;
  posterAlt?: string;
  linkedSlug?: string;
}

export default async function ReelsPage() {
  const [docs, copy] = await Promise.all([
    serverClient.fetch<ReelDoc[]>(allReelsQuery),
    serverClient.fetch<ReelsCopy | null>(reelsCopyQuery),
  ]);

  const reels: ReelItem[] = (docs ?? [])
    .filter((r) => r.videoUrl)
    .map((r) => ({
      id: r._id,
      title: r.title,
      category: r.category,
      videoSrc: r.videoUrl!,
      posterSrc: r.posterUrl ?? "",
      posterAlt: r.posterAlt,
      href: r.linkedSlug ? `/articles/${r.linkedSlug}` : "#",
    }));

  return <ReelsIndexClient reels={reels} copy={copy ?? undefined} />;
}
