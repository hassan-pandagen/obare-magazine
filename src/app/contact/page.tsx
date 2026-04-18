import { client } from "@/sanity/client";
import { contactHeroImageQuery } from "@/sanity/queries/aboutPage";
import ContactClient from "@/components/sections/ContactClient";

export const revalidate = 60;

export default async function ContactPage() {
  const heroBgImage = await client.fetch<string | null>(contactHeroImageQuery);
  return <ContactClient heroBgImage={heroBgImage ?? undefined} />;
}
