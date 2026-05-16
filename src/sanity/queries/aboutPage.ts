import { groq } from "next-sanity";

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    heroEyebrow,
    heroHeadline,
    heroSubtitle,
    heroImageAlt,
    "heroImageUrl": heroImage.asset->url,
    "heroImageHotspot": heroImage.hotspot { x, y },
    "heroImageMobileUrl": heroImageMobile.asset->url,
    "heroImageMobileHotspot": heroImageMobile.hotspot { x, y },
    sections[] {
      eyebrow,
      title,
      body,
      layout,
      imageAspectRatio,
      redOverlay,
      imageAlt,
      "imageUrl": image.asset->url,
      "imageHotspot": image.hotspot { x, y },
      "imageMobileUrl": imageMobile.asset->url,
      "imageMobileHotspot": imageMobile.hotspot { x, y }
    },
    pillarsTitle,
    pillars[] {
      title,
      body,
      imageAlt,
      "imageUrl": image.asset->url,
      "imageHotspot": image.hotspot { x, y },
      "imageMobileUrl": imageMobile.asset->url,
      "imageMobileHotspot": imageMobile.hotspot { x, y }
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
  *[_type == "settings"][0] {
    "url": contactHeroImage.asset->url,
    "mobileUrl": contactHeroImageMobile.asset->url,
    "alt": contactHeroImageAlt
  }
`;

export const submissionsHeroImageQuery = groq`
  *[_type == "settings"][0] {
    "url": submissionsHeroImage.asset->url,
    "mobileUrl": submissionsHeroImageMobile.asset->url,
    "alt": submissionsHeroImageAlt
  }
`;

export const submissionsCopyQuery = groq`
  *[_type == "settings"][0].submissionsCopy {
    eyebrow,
    headlineLine1,
    headlineLine2,
    subtitle,
    formEyebrow,
    formHeadline
  }
`;

export const contactCopyQuery = groq`
  *[_type == "settings"][0].contactCopy {
    eyebrow,
    headlineLine1,
    headlineLine2,
    infoHeadline,
    infoSubtitle
  }
`;

export const eventsCopyQuery = groq`
  *[_type == "settings"][0].eventsCopy {
    eyebrow,
    headline
  }
`;

export const reelsCopyQuery = groq`
  *[_type == "settings"][0].reelsCopy {
    eyebrow,
    eyebrowColor,
    headlineLine1,
    headlineLine1Color,
    headlineLine2,
    headlineLine2Color,
    subtitle,
    subtitleColor
  }
`;

export const footerCtaVideoQuery = groq`
  *[_type == "settings"][0].footerCtaVideo.asset->url
`;

export const footerMetaQuery = groq`
  *[_type == "settings"][0] {
    "ctaVideoUrl": footerCtaVideo.asset->url,
    socialLinks {
      instagram,
      youtube,
      twitter,
      facebook,
      tiktok
    }
  }
`;
