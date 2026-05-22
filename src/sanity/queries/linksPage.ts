import { groq } from "next-sanity";

export const linksPageQuery = groq`
  *[_type == "linksPage"][0] {
    headline,
    tagline,
    "profileImageUrl": profileImage.asset->url,
    "bannerImageUrl": bannerImage.asset->url,
    gridItems[active == true] {
      "imageUrl": image.asset->url,
      "imageHotspot": image.hotspot { x, y },
      url
    },
    utmSource,
    utmMedium
  }
`;
