import { serverClient as client } from "@/sanity/client";
import { contactHeroImageQuery, contactCopyQuery } from "@/sanity/queries/aboutPage";
import ContactClient, { type ContactCopy } from "@/components/sections/ContactClient";

export const revalidate = 60;

interface HeroBg {
  url: string | null;
  mobileUrl: string | null;
  alt: string | null;
}

export default async function ContactPage() {
  const [hero, copy] = await Promise.all([
    client.fetch<HeroBg | null>(contactHeroImageQuery).catch(() => null),
    client.fetch<ContactCopy | null>(contactCopyQuery).catch(() => null),
  ]);
  return (
    <ContactClient
      heroBgImage={hero?.url ?? undefined}
      heroBgImageMobile={hero?.mobileUrl ?? undefined}
      heroBgAlt={hero?.alt ?? undefined}
      copy={copy ?? undefined}
    />
  );
}
