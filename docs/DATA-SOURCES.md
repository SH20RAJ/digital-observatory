# Data Sources

This document defines the initial source strategy.

## Source hierarchy

### Tier 1 — Official APIs and feeds

Preferred for structured collection.

Examples:

- GitHub API
- npm registry/API
- PyPI metadata and download statistics where available
- Hugging Face APIs
- official project release feeds
- official security advisories
- arXiv APIs/feeds
- Crossref
- Semantic Scholar

### Tier 2 — Public feeds and datasets

Use:

- RSS/Atom feeds
- public datasets
- public archives
- government/open-data sources
- research indexes

### Tier 3 — Permitted web collection

Only where access is permitted and technically responsible.

Requirements:

- respect robots/access policies where applicable
- follow terms of service
- rate-limit requests
- identify the collector when appropriate
- cache responsibly
- do not bypass authentication, CAPTCHAs, paywalls, access controls, or technical restrictions
- store provenance

## Initial source map

| Source | Signals | Cadence | Primary use |
| --- | --- | --- | --- |
| GitHub | stars, forks, releases, commits, issues, contributors | hourly/daily | Open source |
| npm | downloads, versions, package metadata | daily | JavaScript ecosystem |
| PyPI | package metadata and permitted download stats | daily | Python ecosystem |
| Hugging Face | models, downloads, likes, updates | daily | AI |
| Hacker News | stories, points, comments | hourly/daily | developer attention |
| arXiv | papers, categories, metadata | daily | research |
| Crossref | publication metadata | daily | research |
| CISA/NVD | advisories, CVEs | frequent/daily | security |
| Official project feeds | releases and announcements | daily | software |
| Product/startup sources | public launches and announcements | daily | startups |

This table is a planning document, not a guarantee that every provider permits every proposed use.

## Source adapter contract

Each adapter should produce:

```json
{
  "source": "example",
  "collected_at": "ISO-8601 timestamp",
  "records": [],
  "cursor": null,
  "warnings": []
}
```

Every normalized record should preserve:

- source identifier
- source URL
- source timestamp
- collection timestamp
- entity identifier
- raw/derived distinction
- license/usage notes when relevant

## Freshness

Each source should declare an expected freshness window.

Example:

```
expected_interval = 24h
stale_after = 36h
critical_after = 72h
```

The UI should expose stale data instead of silently presenting it as live.

## Provenance

A published observation should be able to answer:

> Where did this number come from?

Minimum provenance:

- source
- source URL or identifier
- collection timestamp
- transformation/version
- metric definition
- time window

## Adding a source

Create an issue or pull request describing:

1. source and official documentation
2. permitted access method
3. rate limits
4. fields collected
5. update frequency
6. licensing/redistribution constraints
7. failure behavior
8. example payload
9. normalization mapping
