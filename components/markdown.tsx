import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { sanitizeMarkdown } from "@/lib/content";

export function Markdown({ content }: { content: string }) {
  const sanitized = sanitizeMarkdown(content);
  return <div className="prose">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "append" }]]}
      components={{
        a({ href, children }) {
          const external = Boolean(href?.startsWith("http"));
          return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
        },
        img({ src, alt }) { return <img src={src} alt={alt || ""} loading="lazy" />; },
        pre({ children }) { return <pre className="code-block">{children}</pre>; },
        blockquote({ children }) { return <blockquote className="quote">{children}</blockquote>; }
      }}
    >{sanitized}</ReactMarkdown>
  </div>;
}