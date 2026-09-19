import type { Source } from "@/lib/content";

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <section className="sources" aria-labelledby="sources-title" id="sources-and-evidence">
      <div className="sources-header">
        <p className="eyebrow">Evidence</p>
        <h2 id="sources-title">Sources &amp; further reading</h2>
        <p className="sources-dek">Primary sources, official disclosures, and external research used to ground this report.</p>
      </div>
      <ol className="sources-list">
        {sources.map((source, idx) => {
          const domain = getDomain(source.url);
          return (
            <li key={source.url} className="source-item">
              <span className="source-num" aria-hidden="true">[{idx + 1}]</span>
              <div className="source-content">
                <a href={source.url} target="_blank" rel="noreferrer" className="source-link">
                  <span className="source-label">{source.label}</span>
                  {domain ? <span className="source-domain">{domain}</span> : null}
                  <svg className="source-ext-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7"/>
                    <path d="M7 7h10v10"/>
                  </svg>
                </a>
                {source.note ? <p className="source-note">{source.note}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}