import { groq } from "next-sanity";

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    heroEyebrow,
    heroHeadline,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    sections[] {
      eyebrow,
      title,
      body,
      layout,
      redOverlay,
      "imageUrl": image.asset->url
    },
    pillarsTitle,
    pillars[] {
      title,
      body,
      "imageUrl": image.asset->url
    },
    ctaHeadline,
    ctaSubtitle,
    ctaPrimaryLabel,
    ctaPrimaryLink,
    ctaSecondaryLabel,
    ctaSecondaryLink,
    "ctaHoverVideoUrl": ctaHoverVideo.asset->url
  }
`;

export const contactHeroImageQuery = groq`
  *[_type == "settings"][0].contactHeroImage.asset->url
`;

export const submissionsHeroImageQuery = groq`
  *[_type == "settings"][0].submissionsHeroImage.asset->url
`;

export const footerCtaVideoQuery = groq`
  *[_type == "settings"][0].footerCtaVideo.asset->url
`;
