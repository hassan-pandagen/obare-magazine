import { client } from "@/sanity/client";
import { submissionsHeroImageQuery } from "@/sanity/queries/aboutPage";
import SubmissionsClient from "@/components/sections/SubmissionsClient";

export const revalidate = 60;

interface HeroBg {
  url: string | null;
  mobileUrl: string | null;
  alt: string | null;
}

export default async function SubmissionsPage() {
  const hero = await client.fetch<HeroBg | null>(submissionsHeroImageQuery);
  return (
    <SubmissionsClient
      heroBgImage={hero?.url ?? undefined}
      heroBgImageMobile={hero?.mobileUrl ?? undefined}
      heroBgAlt={hero?.alt ?? undefined}
    />
  );
}
