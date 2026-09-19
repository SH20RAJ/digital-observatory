# Content System

## Article contract

Every article is a Markdown file under:

~~~text
content/posts/{slug}.md
~~~

Required frontmatter:

- title
- description
- publishedAt
- status
- category
- author
- authorRole
- sources

Recommended:

- excerpt
- updatedAt
- tags
- keywords
- coverImage
- coverAlt
- featured
- canonicalUrl
- noIndex

## Field meanings

### title

The reader-facing headline. Write for humans first.

### description

A concise explanation used for metadata and social previews. It should describe what the page actually delivers, not promise an unverified conclusion.

### excerpt

A compact card-level summary.

### publishedAt / updatedAt

Use the date of publication and substantive revision. Never change dates simply to make an unchanged article look fresh.

### status

draft or published.

Drafts are invisible to public routes.

### category

One clear editorial lens.

### tags

Specific concepts that help navigation and topical clustering.

### keywords

Useful query language and entity terminology. Do not turn this into a keyword dump.

### sources

Every important external claim should have inspectable provenance.

## Internal linking

A good article should naturally reference:

- earlier observations
- methodology
- category pages
- related tags
- primary sources

Internal links are for the reader first. The secondary benefit is a clearer topical graph for crawlers and AI systems.

## Article structure

A useful default:

1. Answer the main question quickly.
2. Define the subject.
3. Explain the evidence.
4. Add context and comparison.
5. Describe uncertainty and limitations.
6. Link to primary sources.
7. Connect to related Observatory articles.
8. End with the actual implication for the reader.

Do not force a fixed word count. Google's guidance explicitly says there is no preferred word count target. [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

## Quality gate

An article is ready only when it is:

- factually supported
- materially original
- readable
- attributable
- source-linked
- internally linked
- technically indexable
- useful even when read without Google
- honest about uncertainty
