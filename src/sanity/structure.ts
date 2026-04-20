import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("OBARE Magazine")
    .items([
      // ── Content ──────────────────────────────────────────────────────────
      S.listItem()
        .title("Articles")
        .schemaType("article")
        .child(S.documentTypeList("article").title("Articles")),

      S.listItem()
        .title("Reels")
        .schemaType("reel")
        .child(S.documentTypeList("reel").title("Reels")),

      S.divider(),

      // ── Events ───────────────────────────────────────────────────────────
      S.listItem()
        .title("Events")
        .schemaType("event")
        .child(S.documentTypeList("event").title("Events")),

      S.listItem()
        .title("RSVPs")
        .schemaType("rsvp")
        .child(S.documentTypeList("rsvp").title("RSVPs")),

      S.divider(),

      // ── Pages ────────────────────────────────────────────────────────────
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages")),

      S.divider(),

      // ── Submissions ───────────────────────────────────────────────────────
      S.listItem()
        .title("Submissions")
        .schemaType("submission")
        .child(S.documentTypeList("submission").title("Submissions")),

      S.divider(),

      // ── About Us Page (singleton) ─────────────────────────────────────────
      S.listItem()
        .title("About Us Page")
        .child(
          S.editor()
            .id("aboutPage")
            .schemaType("aboutPage")
            .documentId("about-page")
        ),

      // ── Link-in-Bio Page (singleton) ──────────────────────────────────────
      S.listItem()
        .title("Link-in-Bio (/links)")
        .child(
          S.editor()
            .id("linksPage")
            .schemaType("linksPage")
            .documentId("links-page")
        ),

      // ── Site Settings (singleton) ─────────────────────────────────────────
      S.listItem()
        .title("Site Settings")
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("site-settings")
        ),
    ]);