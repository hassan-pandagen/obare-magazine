import { serverClient } from "@/sanity/client";
import { allReelsQuery } from "@/sanity/queries/homepage";
import ReelsIndexClient, { type ReelItem } from "@/components/sections/ReelsIndexClient";

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
  const docs = await serverClient.fetch<ReelDoc[]>(allReelsQuery);

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

  return <ReelsIndexClient reels={reels} />;
}
