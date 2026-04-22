import { groq } from "next-sanity";

/** Homepage settings — hero, folder stack projects, editorial stories */
export const homepageSettingsQuery = groq`
  *[_type == "settings"][0] {
    siteName,
    heroMedia {
      type,
      headline,
      subheadline,
      "videoUrl": videoFile.asset->url,
      "imageUrl": image.asset->url,
    },
    homepageProjects[] {
      title,
      subtitle,
      category,
      author,
      "videoUrl": videoFile.asset->url,
      "imageUrl": image.asset->url,
      "imageHotspot": image.hotspot { x, y },
      "imageMobileUrl": imageMobile.asset->url,
      "imageMobileHotspot": imageMobile.hotspot { x, y },
      "linkedSlug": linkedArticle->slug.current,
      externalHref,
    },
    editorialStories[] {
      title,
      subtitle,
      category,
      accent,
      "imageUrl": image.asset->url,
      "imageMobileUrl": imageMobile.asset->url,
      "linkedSlug": linkedArticle->slug.current,
    }
  }
`;

/** Reels shown on the homepage, ordered by display order */
export const homepageReelsQuery = groq`
  *[_type == "reel" && showOnHomepage == true] | order(order asc) {
    _id,
    title,
    category,
    "videoUrl": videoFile.asset->url,
    "posterUrl": posterImage.asset->url,
    "linkedSlug": linkedArticle->slug.current,
  }
`;
