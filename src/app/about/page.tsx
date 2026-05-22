import { serverClient } from "@/sanity/client";
import { aboutPageQuery } from "@/sanity/queries/aboutPage";
import AboutClient, { type AboutData } from "@/components/sections/AboutClient";

export const revalidate = 60;

const FALLBACK: AboutData = {
  heroEyebrow: "About OBARE",
  sections: [],
  pillars: [],
  ctaPrimaryLabel: "Get Started",
  ctaPrimaryLink: "/submissions",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryLink: "/contact",
};

export default async function AboutPage() {
  const data = await serverClient.fetch<AboutData | null>(aboutPageQuery).catch(() => null);
  return <AboutClient data={data ?? FALLBACK} />;
}
