import { groq } from "next-sanity";

/** Site logo — small query used client-side by the Navbar, cached in sessionStorage. */
export const siteLogoQuery = groq`
  *[_type == "settings"][0] {
    "url": logo.asset->url,
    "alt": logo.alt
  }
`;

/** Homepage settings — hero, folder stack projects, editorial stories */
export const homepageSettingsQuery = groq`
  *[_type == "settings"][0] {
    siteName,
    "logoUrl": logo.asset->url,
    "tickerImageUrl": tickerImage.asset->url,
    heroMedia {
      type,
      headline,
      subheadline,
      imageAlt,
      "videoUrl": videoFile.asset->url,
      "videoMobileUrl": videoFileMobile.asset->url,
      "imageUrl": image.asset->url,
      "imageMobileUrl": imageMobile.asset->url,
    },
    homepageProjects[] {
      title[] { ..., markDefs[] { ..., _type == "highlight" => { color } } },
      subtitle[] { ..., markDefs[] { ..., _type == "highlight" => { color } } },
      category,
      author,
      imageAlt,
      "videoUrl": videoFile.asset->url,
      "imageUrl": image.asset->url,
      "imageHotspot": image.hotspot { x, y },
      "imageMobileUrl": imageMobile.asset->url,
      "imageMobileHotspot": imageMobile.hotspot { x, y },
      "linkedSlug": linkedArticle->slug.current,
      externalHref,
    },
    editorialStories[] {
      title[] { ..., markDefs[] { ..., _type == "highlight" => { color } } },
      subtitle[] { ..., markDefs[] { ..., _type == "highlight" => { color } } },
      category,
      cta,
      imageAlt,
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
    "posterAlt": posterImage.alt,
    "linkedSlug": linkedArticle->slug.current,
  }
`;

/** All reels — used by the /reels index page */
export const allReelsQuery = groq`
  *[_type == "reel"] | order(order asc) {
    _id,
    title,
    category,
    "videoUrl": videoFile.asset->url,
    "posterUrl": posterImage.asset->url,
    "posterAlt": posterImage.alt,
    "linkedSlug": linkedArticle->slug.current,
  }
`;
