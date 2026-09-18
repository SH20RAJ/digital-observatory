import type { Source } from "@/lib/content";

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return <section className="sources" aria-labelledby="sources-title">
    <div><p className="eyebrow">Evidence</p><h2 id="sources-title">Sources & further reading</h2></div>
    <ol>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>{source.note ? <span>{source.note}</span> : null}</li>)}</ol>
  </section>;
}