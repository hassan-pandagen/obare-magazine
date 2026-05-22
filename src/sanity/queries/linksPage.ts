import { groq } from "next-sanity";

export const linksPageQuery = groq`
  *[_type == "linksPage"][0] {
    headline,
    tagline,
    "profileImageUrl": profileImage.asset->url,
    "profileImageHotspot": profileImage.hotspot { x, y },
    featuredEnabled,
    featuredTitle,
    featuredSubtitle,
    featuredUrl,
    "featuredImageUrl": featuredImage.asset->url,
    "featuredImageHotspot": featuredImage.hotspot { x, y },
    links[active == true] {
      label,
      sublabel,
      url,
      accent
    },
    gridItems[active == true] {
      "imageUrl": image.asset->url,
      "imageHotspot": image.hotspot { x, y },
      alt,
      url,
      caption
    },
    utmSource,
    utmMedium
  }
`;
