import { client } from "@/sanity/client";
import { aboutPageQuery } from "@/sanity/queries/aboutPage";
import AboutClient, { type AboutData } from "@/components/sections/AboutClient";

export const revalidate = 60;

const FALLBACK: AboutData = {
  heroEyebrow: "About OBARE",
  heroHeadline: "The Magazine|That's Real",
  heroSubtitle:
    "OBARE is an independent editorial platform dedicated to raw expression, bold creativity, and stories that move people.",
  sections: [],
  pillarsTitle: "Things You Should Know About Us",
  pillars: [],
  ctaHeadline: "Let's Talk",
  ctaPrimaryLabel: "Get Started",
  ctaPrimaryLink: "/submissions",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryLink: "/contact",
};

export default async function AboutPage() {
  const data = (await client.fetch<AboutData | null>(aboutPageQuery)) ?? FALLBACK;
  return <AboutClient data={data} />;
}
