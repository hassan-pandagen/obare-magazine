# Client Final Changes & Requests — 46 Items

## Status Key
- [x] Done
- [ ] Pending
- [~] In Progress

---

## BATCH 1 — Quick wins (typography, colors, text changes)
*Items: 3, 8, 9, 11, 15, 20, 37, 38, 39, 42*

- [x] 1. Drop cap styling — Playfair serif, editorial scale, color from CMS.
  - File: `src/app/globals.css` (drop cap CSS), `src/sanity/schemaTypes/article.ts` (dropCapColor field), `src/sanity/queries/articles.ts`, `src/app/articles/[slug]/page.tsx`

- [x] 2. Article hero arrow thinner + reduce mobile banner height.
  - File: `src/app/articles/[slug]/page.tsx` — strokeWidth 1.5, mobile h-[78vh]

- [x] 3. Remove red lines from FooterCTA (top+bottom) and Footer (bottom bar).
  - File: `src/components/sections/FooterCTA.tsx`, `src/components/layout/Footer.tsx`

- [x] 8. Articles page — only "The Archive" red, card hover titles/CTAs now white.
  - File: `src/app/articles/page.tsx` — removed `group-hover:text-red`, changed to white

- [x] 9. "Get Featured" button stays red — already hardcoded `bg-red`, no change needed.
  - File: `src/components/sections/FooterCTA.tsx` — confirmed safe

- [x] 11. Contact page — "Get in Touch" eyebrow stays red. Email/Editorial/Advertising labels + "Message Sent" changed to white/50.
  - File: `src/components/sections/ContactClient.tsx`

- [x] 15. Next article card — category text changed from `text-red` to `text-white/60`.
  - File: `src/components/portable/NextArticleCard.tsx`

- [x] 20. Ticker speed increased — duration 25s → 12s.
  - File: `src/app/globals.css`

- [x] 37. Removed "Tap the card to continue" text.
  - File: `src/components/portable/NextArticleCard.tsx`

- [x] 38. Removed "Content Guidelines" from footer links.
  - File: `src/components/layout/Footer.tsx`

- [x] 39. Footer label "Submit Work" → "Submissions".
  - File: `src/components/layout/Footer.tsx`

- [x] 42. Sound/mute button hidden on desktop (`md:hidden`) in FolderSection.
  - File: `src/components/sections/FolderSection.tsx`

---

## BATCH 2 — Navbar, hero, mobile fixes
*Items: 4, 6, 26, 28, 34, 44, 46*

- [x] 4. Removed red overlay from homepage hero — clean photo, no color tint.
  - File: `src/components/sections/Hero.tsx`

- [x] 6. Hero spacing balanced after overlay removal — `pb-10` mobile / `pb-14` desktop.
  - File: `src/components/sections/Hero.tsx`

- [x] 26. Mobile navbar stays transparent on scroll — `bg-black/90 backdrop-blur-md` only on `md:` and above.
  - File: `src/components/layout/Navbar.tsx`

- [x] 28. Navbar padding restored to `px-4 py-3` on mobile for proper logo/hamburger alignment.
  - File: `src/components/layout/Navbar.tsx`

- [x] 34. Hero banner clean — red overlay removed, spacing balanced. (covered by #4+#6)

- [x] 44. Deck card title is now a clickable link with hover underline animation.
  - File: `src/components/sections/FolderSection.tsx`

- [x] 46. Desktop nav active dot removed — was causing "HOME" to bleed into logo area.
  - File: `src/components/layout/Navbar.tsx`

---

## BATCH 3 — CMS controls & schema updates
*Items: 25, 30, 31, 32, 35*

- [x] 25. Reels page — added color controls for eyebrow, headline line 1+2, subtitle (red/white each independently).
  - Files: `src/sanity/schemaTypes/settings.ts`, `src/sanity/queries/aboutPage.ts`, `src/components/sections/ReelsIndexClient.tsx`

- [x] 30+31. Highlight color presets added to article portable text — Yellow #f0ff0a, Red 1/2/3, White. Renders via inline `color` style.
  - Files: `src/sanity/schemaTypes/article.ts` (highlight annotation), `src/components/portable/ArticleBody.tsx` (highlight mark renderer)

- [x] 32. Most Popular cards — added optional `cta` label field, removed hardcoded `accent`, all cards now have Title/Category/CTA/optional subtitle.
  - Files: `src/sanity/schemaTypes/settings.ts`, `src/components/sections/EditorialGrid.tsx`, `src/sanity/queries/homepage.ts`, `src/app/page.tsx`, `src/components/sections/HomeClient.tsx`

- [x] 35. Homepage banner image now CMS-controlled — `heroMedia.imageUrl` passed from Sanity through page → HomeClient → Hero and rendered as `<picture>` element.
  - Files: `src/app/page.tsx`, `src/components/sections/HomeClient.tsx`, `src/components/sections/Hero.tsx`

---

## BATCH 4 — Page-level changes
*Items: 5, 7, 10, 12, 13, 17, 19, 21, 22, 23, 24, 27, 29, 33, 36, 40, 41, 45*

- [x] 5. Facebook opens in new tab — already had `target="_blank"` on all social links. No change needed.

- [x] 7. 18+ age gate — custom modal with localStorage persistence, "I am 18+" / "Exit" buttons.
  - New file: `src/components/ui/AgeGate.tsx`, wired into `src/app/layout.tsx`

- [x] 10. About Us — dynamic aspect ratio per section (2:3, 4:5, 3:2, 1:1, 4:3). Red border removed, clean editorial style.
  - Files: `src/sanity/schemaTypes/aboutPage.ts`, `src/sanity/queries/aboutPage.ts`, `src/components/sections/AboutClient.tsx`
  - Upload images in Sanity → About Us Page → Content Sections → Image field. Select aspect ratio per section.

- [x] 12. Newsletter — no change needed. ✅

- [x] 13. Submissions — form completely removed, only email text remains.
  - File: `src/components/sections/SubmissionsClient.tsx`

- [x] 17. Google Analytics + Microsoft Clarity — wired via `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID` env vars.
  - File: `src/app/layout.tsx` — add your IDs to Vercel env vars to activate

- [x] 19. IG bio / link-in-bio exists at `/links`. ✅

- [ ] 21. Hero logo image — needs logo files from client Drive. (Skip for now)

- [x] 22. Deck heading clickable + hover underline. (Done in Batch 2)

- [x] 23. Video autoplay on mobile — added `autoPlay` + `preload="auto"` to FolderSection video.
  - File: `src/components/sections/FolderSection.tsx`

- [x] 24. Unlinked reel tiles — arrow/hover removed when `href` is `"#"`.
  - File: `src/components/sections/ReelsSection.tsx`

- [x] 27. Image credit line with optional link (`creditUrl` field).
  - Files: `src/sanity/schemaTypes/article.ts`, `src/sanity/queries/articles.ts`, `src/components/portable/ArticleBody.tsx`

- [x] 29. "Go Bare →" CTA on both left + right sides of article body as vertical links to `/submissions`.
  - File: `src/app/articles/[slug]/page.tsx`

- [x] 33. Footer credit section — Georgia serif, large, matches HommmeGirls reference. Link kept.
  - File: `src/components/layout/Footer.tsx`

- [x] 36. Submissions form removed, only email text kept.
  - File: `src/components/sections/SubmissionsClient.tsx`

- [x] 40. Events page — "Stay in the loop" notify form below event list, sends to info@ObareMag.com.
  - File: `src/app/event/page.tsx` — `EventNotifyForm` component added

- [x] 41. Red lines removed (done in Batch 1 + Batch 2).

- [x] 45. Article media carousel — swipeable photos + videos, 9:16 format, dot indicators, prev/next nav.
  - Files: `src/sanity/schemaTypes/article.ts` (mediaCarousel block), `src/sanity/queries/articles.ts`, `src/components/portable/ArticleBody.tsx` (MediaCarousel component)

---

## BATCH 5 — Technical / infrastructure
*Items: 16, 18, 43*

- [ ] 16. Article hero arrow thinner (same as #2 — already done).

- [ ] 18. Cross-browser compatibility — iOS Safari, Android Chrome, Samsung Internet.
  - Multiple files — browser audit

- [ ] 43. 301 redirects from SundayMorningView.com → Obaremag.com / obare.vercel.app.
  - File: `next.config.ts` — add redirects array

---

## Notes
- Item 10 requires Google Drive assets (frames/styles) — need access
- Item 21 requires logo files from Google Drive
- Item 35 is a full audit — do last
- Items 3 & 41 are the same red lines in footer — do together
