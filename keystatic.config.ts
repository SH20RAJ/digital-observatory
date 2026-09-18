import { config, collection, fields } from "@keystatic/core";

const useGitHub = process.env.KEYSTATIC_STORAGE === "github";

export const showAdminUI = process.env.NODE_ENV !== "production" || useGitHub;

export default config({
  storage: useGitHub
    ? { kind: "github", repo: { owner: "SH20RAJ", name: "digital-observatory" } }
    : { kind: "local" },

  collections: {
    posts: collection({
      label: "Articles",
      slugField: "title",
      path: "content/posts/*",
      entryLayout: "content",
      format: { contentField: "content" },
      columns: ["title", "status", "publishedAt", "category"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "SEO description", multiline: true }),
        excerpt: fields.text({ label: "Card excerpt", multiline: true }),
        publishedAt: fields.date({ label: "Published date", validation: { isRequired: true } }),
        updatedAt: fields.date({ label: "Updated date" }),
        status: fields.select({
          label: "Publishing status",
          options: [
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" }
          ],
          defaultValue: "published"
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "AI", value: "AI" },
            { label: "Open Source", value: "Open Source" },
            { label: "Developers", value: "Developers" },
            { label: "Startups", value: "Startups" },
            { label: "Internet", value: "Internet" },
            { label: "Security", value: "Security" },
            { label: "Experiments", value: "Experiments" },
            { label: "Digital Culture", value: "Digital Culture" },
            { label: "Methodology", value: "Methodology" }
          ],
          defaultValue: "AI"
        }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tags", itemLabel: (props) => props.value || "Tag" }),
        author: fields.text({ label: "Author" }),
        authorRole: fields.text({ label: "Author role" }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        coverImage: fields.image({ label: "Cover image", directory: "public/images/posts", publicPath: "/images/posts/" }),
        coverAlt: fields.text({ label: "Cover alt text" }),
        keywords: fields.array(fields.text({ label: "Keyword" }), { label: "SEO keywords", itemLabel: (props) => props.value || "Keyword" }),
        canonicalUrl: fields.url({ label: "Canonical URL" }),
        noIndex: fields.checkbox({ label: "No index", defaultValue: false }),
        sources: fields.array(
          fields.object({
            label: fields.text({ label: "Source name" }),
            url: fields.url({ label: "Source URL" }),
            note: fields.text({ label: "Note", multiline: true })
          }),
          { label: "Sources", itemLabel: (props) => props.fields.label.value || "Source" }
        ),
        content: fields.markdoc({ label: "Article body", extension: "md" })
      }
    })
  }
});
