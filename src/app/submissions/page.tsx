import { client } from "@/sanity/client";
import { submissionsHeroImageQuery } from "@/sanity/queries/aboutPage";
import SubmissionsClient from "@/components/sections/SubmissionsClient";

export const revalidate = 60;

export default async function SubmissionsPage() {
  const heroBgImage = await client.fetch<string | null>(submissionsHeroImageQuery);
  return <SubmissionsClient heroBgImage={heroBgImage ?? undefined} />;
}
