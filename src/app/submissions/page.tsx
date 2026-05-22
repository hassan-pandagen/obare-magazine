import { serverClient as client } from "@/sanity/client";
import { submissionsHeroImageQuery, submissionsCopyQuery } from "@/sanity/queries/aboutPage";
import SubmissionsClient, { type SubmissionsCopy } from "@/components/sections/SubmissionsClient";

export const revalidate = 60;

interface HeroBg {
  url: string | null;
  mobileUrl: string | null;
  alt: string | null;
}

export default async function SubmissionsPage() {
  const [hero, copy] = await Promise.all([
    client.fetch<HeroBg | null>(submissionsHeroImageQuery).catch(() => null),
    client.fetch<SubmissionsCopy | null>(submissionsCopyQuery).catch(() => null),
  ]);
  return (
    <SubmissionsClient
      heroBgImage={hero?.url ?? undefined}
      heroBgImageMobile={hero?.mobileUrl ?? undefined}
      heroBgAlt={hero?.alt ?? undefined}
      copy={copy ?? undefined}
    />
  );
}
