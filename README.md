# Digital Observatory

> **Observe the digital world. Turn public signals into transparent observations.**

Digital Observatory is an open-source data and editorial platform for tracking meaningful changes across software, AI, open source, startups, internet infrastructure, cybersecurity, and digital culture.

It is designed to become more than a blog: a continuously updated **digital observatory** with live signals, historical datasets, interactive stories, research, and a public methodology.

## What we are building

- 📡 **Signals** — collect public signals from APIs, feeds, datasets, and permitted web sources.
- 📈 **Trends** — detect growth, change, acceleration, and unusual activity.
- 🔎 **Observations** — turn evidence into explainable stories.
- 🗃️ **History** — preserve snapshots so today's internet can be compared with yesterday's.
- 🧭 **Radar** — surface projects, technologies, research, and developments worth watching.
- 🧪 **Experiments** — run reproducible comparisons and benchmarks.
- 🧩 **Interactive stories** — combine narrative, charts, timelines, maps, and live data.
- 🔌 **Open data** — expose useful derived datasets and APIs where licensing and source terms allow.

## Observatory worlds

| World | What we observe |
| --- | --- |
| AI | Models, agents, research, tools, adoption signals |
| Open Source | Repositories, releases, contributors, package ecosystems |
| Developers | Languages, frameworks, databases, tools |
| Startups | Public launches, funding announcements, products, hiring signals |
| Internet | Web platform, protocols, infrastructure, browsers |
| Security | Vulnerabilities, advisories, incidents, patches |
| Experiments | Benchmarks, controlled tests, data investigations |
| Weird Internet | Unusual projects, forgotten software, strange technical artifacts |

## The editorial principle

**Observation → Evidence → Context → Interpretation → Uncertainty**

We do not manufacture certainty from noisy public data. Every important claim should be traceable to its source, methodology, and collection time.

## Architecture

```
Sources → Ingestion → Normalization → Storage → Signals → Editorial Review → Publication
  │           │             │             │          │             │
 APIs        Jobs       Canonical data   History   Detection     Articles
 RSS         Workers      Entities       Metrics   Anomalies     Charts
 Datasets    Adapters                    Snapshots  Trends       Reports
```

See [ARCHITECTURE.md](ARCHITECTURE.md), [DATA-SOURCES.md](docs/DATA-SOURCES.md), and [METHODOLOGY.md](docs/METHODOLOGY.md).

## Repository status

This repository is currently the **project specification and engineering foundation**. Application code and production collectors will be introduced incrementally.

## Contributing

The project is intentionally open to contributions in:

- source adapters
- data modeling
- anomaly detection
- visualizations
- editorial research
- documentation
- testing
- accessibility
- infrastructure

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT. Source-specific terms, API licenses, rate limits, attribution requirements, and robots/access policies remain applicable to collected data.
