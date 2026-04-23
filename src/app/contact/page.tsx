import { client } from "@/sanity/client";
import { contactHeroImageQuery } from "@/sanity/queries/aboutPage";
import ContactClient from "@/components/sections/ContactClient";

export const revalidate = 60;

interface HeroBg {
  url: string | null;
  mobileUrl: string | null;
  alt: string | null;
}

export default async function ContactPage() {
  const hero = await client.fetch<HeroBg | null>(contactHeroImageQuery);
  return (
    <ContactClient
      heroBgImage={hero?.url ?? undefined}
      heroBgImageMobile={hero?.mobileUrl ?? undefined}
      heroBgAlt={hero?.alt ?? undefined}
    />
  );
}
