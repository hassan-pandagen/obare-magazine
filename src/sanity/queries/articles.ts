import { groq } from "next-sanity";

export const articleCardFields = groq`
  _id,
  title,
  slug,
  category,
  modelName,
  publishedAt,
  excerpt,
  "coverImage": coverImage { asset, alt },
  "coverImageMobile": coverImageMobile { asset },
  "authors": authors[] { name, role }
`;

/** All articles, newest first */
export const allArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    ${articleCardFields}
  }
`;

/** Articles by category */
export const articlesByCategoryQuery = groq`
  *[_type == "article" && category == $category] | order(publishedAt desc) {
    ${articleCardFields}
  }
`;

/** Single article by slug */
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    modelName,
    publishedAt,
    excerpt,
    "coverImage": coverImage { asset, alt, caption },
    "coverImageMobile": coverImageMobile { asset },
    "coverVideo": coverVideo.asset->url,
    "coverVideoMobile": coverVideoMobile.asset->url,
    authors[] { name, role, "photo": photo.asset->url, "photoAlt": photo.alt },
    body[] {
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "mobileUrl": imageMobile.asset->url,
        "dimensions": asset->metadata.dimensions,
        credit
      },
      _type == "inlineVideo" => {
        ...,
        "fileUrl": file.asset->url,
        "fileMobileUrl": fileMobile.asset->url,
        "posterUrl": posterImage.asset->url,
        "posterMobileUrl": posterImageMobile.asset->url
      },
      _type == "inlineReel" => {
        ...,
        "fileUrl": file.asset->url,
        "posterUrl": posterImage.asset->url
      },
      _type == "gallery" => {
        ...,
        images[] {
          ...,
          "url": asset->url,
          alt
        }
      }
    },
    seo
  }
`;

/**
 * Next article for the end-of-article continuation card.
 *
 * `next` = the chronologically-newer article.
 * `loopBack` = the oldest article — used as a fallback when the reader is on
 * the newest article so the "Next" card always appears (creates a loop back
 * to the start of the archive, matching thelinestudio.com's endless-scroll feel).
 */
export const adjacentArticlesQuery = groq`
{
  "next": *[_type == "article" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    title, slug, category, excerpt,
    "coverImage": coverImage { asset, alt },
    "coverImageMobile": coverImageMobile { asset }
  },
  "loopBack": *[_type == "article" && publishedAt < $publishedAt] | order(publishedAt asc)[0] {
    title, slug, category, excerpt,
    "coverImage": coverImage { asset, alt },
    "coverImageMobile": coverImageMobile { asset }
  }
}
`;

/** Featured articles for homepage */
export const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0...4] {
    ${articleCardFields}
  }
`;