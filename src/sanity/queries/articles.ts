import { groq } from "next-sanity";

export const articleCardFields = groq`
  _id,
  title,
  slug,
  category,
  publishedAt,
  excerpt,
  "coverImage": coverImage { asset, alt },
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
    publishedAt,
    excerpt,
    "coverImage": coverImage { asset, alt, caption },
    "coverVideo": coverVideo.asset->url,
    authors[] { name, role, "photo": photo.asset->url },
    body[] {
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "dimensions": asset->metadata.dimensions
      },
      _type == "inlineVideo" => {
        ...,
        "fileUrl": file.asset->url,
        "posterUrl": posterImage.asset->url
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

/** Previous and next articles for navigation */
export const adjacentArticlesQuery = groq`
{
  "prev": *[_type == "article" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
    title, slug, category
  },
  "next": *[_type == "article" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    title, slug, category
  }
}
`;

/** Featured articles for homepage */
export const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0...4] {
    ${articleCardFields}
  }
`;