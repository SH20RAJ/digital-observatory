# Architecture

Digital Observatory is designed as a modular system. Source adapters should be replaceable without changing editorial or presentation layers.

## High-level flow

```
                  ┌─────────────────────┐
                  │ Public Data Sources │
                  │ APIs · RSS · Feeds  │
                  │ Datasets · Websites │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Source Adapters │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ Normalization   │
                    │ validation      │
                    │ deduplication   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ Canonical Store │
                    │ entities        │
                    │ events          │
                    │ snapshots       │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ Signal Engine   │
                    │ trends          │
                    │ anomalies       │
                    │ correlations    │
                    └────────┬────────┘
                             ▼
             ┌───────────────┴────────────────┐
             ▼                                ▼
      Live dashboards                    Editorial layer
             │                                │
             └───────────────┬────────────────┘
                             ▼
                    Articles / Reports
                             │
                             ▼
                     Public API / RSS
```

## Design principles

1. **Source-first** — every observation retains provenance.
2. **Historical-first** — measurements are snapshots, not overwritten facts.
3. **Idempotent ingestion** — rerunning a collector should not create duplicates.
4. **Schema stability** — normalize source-specific formats into canonical entities.
5. **Failure isolation** — one broken source must not stop the observatory.
6. **Rate-limit awareness** — respect provider limits and back off safely.
7. **Reproducibility** — a published metric should be reconstructable from stored inputs where legally and technically possible.
8. **Human editorial control** — automation proposes; editorial review decides what gets published.
9. **Observable infrastructure** — collectors report health, latency, freshness, and errors.
10. **License awareness** — store and redistribute only what the source terms permit.

## Suggested production stack

- Web: Next.js
- Data/API: TypeScript or Python services
- Database: PostgreSQL
- Queue/cache: Redis-compatible service
- Search: PostgreSQL full-text initially; dedicated search later if needed
- Charts: lightweight SVG/Canvas visualization layer
- Scheduled ingestion: GitHub Actions for lightweight jobs; dedicated workers/cron for production workloads
- Hosting: Cloudflare/Vercel plus managed database, depending on workload

The stack is deliberately not locked in. Interfaces matter more than framework choice.

## Canonical entities

Initial entities:

- `source`
- `entity`
- `repository`
- `package`
- `model`
- `company`
- `paper`
- `release`
- `event`
- `metric`
- `metric_snapshot`
- `signal`
- `observation`
- `article`

## Data lifecycle

```
discover → fetch → validate → normalize → deduplicate → store
→ calculate metrics → detect signals → review → publish → archive
```
