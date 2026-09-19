---
title: "Google Cloud Puts BM25 Inside PostgreSQL for Hybrid AI Search"
description: "Google Cloud's September 18, 2026 preview brings BM25 ranking to AlloyDB and Cloud SQL for PostgreSQL 17+ through the open-source pg_textsearch extension, reducing the need for a separate lexical-search backend."
excerpt: "Native BM25 changes the architecture of hybrid retrieval: applications can combine lexical ranking and vector search against the same PostgreSQL data instead of synchronizing two search systems."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI & Data Infrastructure
tags:
  - Google Cloud
  - AlloyDB
  - Cloud SQL
  - PostgreSQL
  - BM25
  - RAG
  - hybrid search
author: Digital Observatory
authorRole: AI & Data Infrastructure
featured: false
coverImage: ""
coverAlt: "Google Cloud PostgreSQL hybrid retrieval architecture combining BM25 keyword ranking and vector search"
keywords:
  - Google Cloud BM25
  - AlloyDB BM25
  - Cloud SQL BM25
  - pg_textsearch
  - PostgreSQL hybrid search
  - RAG keyword vector search
canonicalUrl: "https://observatory.campusloop.space/blog/google-cloud-native-bm25-postgresql-hybrid-search"
noIndex: false
sources:
  - label: "Google Cloud — Native BM25 Ranking in AlloyDB and Cloud SQL"
    url: "https://cloud.google.com/blog/products/databases/native-bm25-search-in-alloydb-and-cloud-sql"
    note: "Primary September 18, 2026 announcement for the PostgreSQL 17+ preview, pg_textsearch integration, hybrid retrieval architecture, and product-specific claims."
  - label: "Google Cloud — pg_textsearch documentation"
    url: "https://docs.cloud.google.com/sql/docs/postgres/pg-textsearch"
    note: "Primary technical documentation for installation, BM25 indexing, hybrid queries, PostgreSQL compatibility, and current limitations."
  - label: "TigerData — pg_textsearch source repository"
    url: "https://github.com/timescale/pg_textsearch"
    note: "Primary open-source implementation and technical reference for BM25 indexes, query operators, performance features, and limitations."
  - label: "AI Stack Current — independent coverage"
    url: "https://www.aistackcurrent.com/news/google-cloud-alloydb-cloud-sql-native-bm25/"
    note: "Independent September 18, 2026 coverage used to corroborate the rollout timeline and architectural significance."
---

**Google Cloud's September 18, 2026 preview puts BM25 keyword ranking directly inside AlloyDB and Cloud SQL for PostgreSQL 17+, letting applications combine lexical retrieval and vector search against the same database instead of maintaining a separate full-text search backend.** The capability uses the open-source `pg_textsearch` extension and is aimed at hybrid search workloads such as RAG and data agents. [Google Cloud](https://cloud.google.com/blog/products/databases/native-bm25-search-in-alloydb-and-cloud-sql)

## What changed

Google Cloud is previewing native BM25 indexes for AlloyDB and Cloud SQL for PostgreSQL 17+. BM25, or Best Matching 25, ranks text by combining inverse document frequency, term-frequency saturation, and document-length normalization.

That matters because vector search and lexical search solve different retrieval problems. Embeddings are useful when the query and document use different words but express similar meaning. Lexical retrieval remains valuable when the query contains exact identifiers, product SKUs, names, codes, or terms whose spelling matters.

The new architecture can therefore look like:

```text
                    application query
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
       vector retrieval             BM25 retrieval
             │                           │
             └─────────────┬─────────────┘
                           ↓
                    result fusion
                           ↓
                    ranked context
```

The important change is that both retrieval paths can live beside the operational data in PostgreSQL.

## Why teams used separate search systems

PostgreSQL has long had full-text search and ranking through functions such as `ts_rank`. But teams building larger hybrid retrieval systems often add a dedicated search engine when they need a particular relevance model or search workload.

That creates another stateful system:

- operational data is stored in PostgreSQL;
- text is copied into the search system;
- embeddings may be stored elsewhere or in the same database;
- ingestion pipelines synchronize changes;
- relevance behavior must be monitored independently.

Google's announcement targets that operational boundary. With `pg_textsearch`, BM25 indexes operate on PostgreSQL storage, so the lexical index and application data can share one transactional system.

This does **not** mean every PostgreSQL application should delete its search cluster. It means one common reason for maintaining a second system becomes optional for workloads that fit the extension's capabilities.

## BM25 is not a replacement for vector search

BM25 and embeddings answer different questions.

Consider a support system searching for `SKU-AX19-5G`.

A semantic embedding can understand the general concept of the request, but exact identifiers can be poorly served by semantic similarity. BM25 gives explicit weight to terms that distinguish one document from another.

The reverse is also true. A semantic query such as "a phone that lasts all day on one charge" may retrieve useful documents even when the documents do not contain those exact words.

The practical pattern is therefore **hybrid retrieval**, not a contest between the two methods.

The Observatory's existing [embeddings and vector search guide](/blog/embeddings-and-vector-search) explains the semantic side of retrieval. The new Google Cloud capability adds the lexical half inside the same database layer.

## What `pg_textsearch` actually provides

The underlying open-source extension exposes a BM25 index access method and a ranking operator. Its current documentation supports PostgreSQL 17 and 18 and includes configurable `k1` and `b` parameters, expression indexes, partial indexes, multilingual configurations, parallel index builds, and Block-Max WAND optimization. [pg_textsearch](https://github.com/timescale/pg_textsearch)

A simplified index looks like:

```sql
CREATE INDEX docs_bm25
ON documents
USING bm25(content)
WITH (text_config = 'english');
```

A ranked query can then use the extension's operator:

```sql
SELECT *
FROM documents
ORDER BY content <@> 'database system'
LIMIT 10;
```

Google Cloud's managed services abstract away much of the extension installation and infrastructure work, but the database-level semantics still matter to application developers.

## The operational benefit is data locality

The strongest architectural benefit is not simply that BM25 is faster. It is that the search index can live with the data it ranks.

A separate search service often creates a pipeline like:

```text
PostgreSQL
   ↓
change capture / ETL
   ↓
search index
   ↓
retrieval
```

Native BM25 can shorten that path:

```text
PostgreSQL
   ├── operational queries
   ├── vector indexes
   └── BM25 index
```

That can reduce synchronization lag and duplicated storage, but it also concentrates more workload inside the database. Database capacity, index maintenance, query planning, and workload isolation therefore become more important rather than disappearing.

## The preview status matters

Google Cloud labels the capability a **preview**. The Cloud SQL documentation requires PostgreSQL 17 or later for `pg_textsearch`, while product availability and rollout can differ by service and region.

Google's September 18 announcement should therefore not be interpreted as evidence that every AlloyDB or Cloud SQL deployment immediately received the same feature. Product documentation and the account's actual service availability remain the operational source of truth.

The independent timeline also shows why announcement dates need care: Cloud SQL release documentation recorded `pg_textsearch` availability before the cross-product announcement. [Independent analysis](https://www.aistackcurrent.com/news/google-cloud-alloydb-cloud-sql-native-bm25/)

## What this changes for RAG systems

For a retrieval-augmented generation application, the change can remove an architectural decision that previously required another service.

A system can potentially store:

- source documents;
- metadata and access-control fields;
- embeddings;
- BM25 indexes;
- and application state

inside one PostgreSQL-backed service.

That can simplify consistency, but retrieval quality still depends on chunking, tokenization, filters, embedding quality, ranking fusion, and evaluation.

A database that can run both retrieval modes does not automatically produce better answers. It reduces infrastructure fragmentation; the application still has to decide how candidate sets are combined and evaluated.

The Observatory's [AI evaluation framework](/blog/evaluating-ai-systems-with-multiple-measures) is relevant here: retrieval latency, recall, ranking quality, cost, and downstream answer quality should be measured separately rather than collapsed into a single "RAG quality" claim.

## What to measure before replacing a search backend

Teams considering the architecture should compare the existing search path with the PostgreSQL-native path using the same corpus and queries.

Useful measurements include:

1. top-k recall for exact and semantic queries;
2. ranking quality for identifiers and natural-language queries;
3. p50 and p95 retrieval latency;
4. index build and update cost;
5. database CPU, memory, and storage pressure;
6. synchronization delay, if the old architecture used ETL;
7. access-control correctness;
8. and end-to-end answer quality for RAG workloads.

A successful migration is therefore not "BM25 works." It is evidence that the combined database workload is simpler or better for the actual application without creating a new bottleneck.

## Limitations and uncertainty

The new Google Cloud capability is a preview, not a blanket replacement for dedicated search infrastructure. Product limits, regional availability, PostgreSQL versions, index behavior, and pricing should be checked against the current service documentation before production decisions.

`pg_textsearch` itself has documented limitations. For example, BM25 scores are rankings rather than universal quality scores, phrase queries require additional handling, and partitioned indexes can have local corpus statistics. Row-level security also requires careful consideration because corpus statistics can expose frequency information about indexed rows.

Those details matter because moving search into PostgreSQL changes the security and operational boundary rather than eliminating one.

## Why this is meaningfully new

The Observatory already covers semantic retrieval through embeddings. This signal adds a different layer: **Google Cloud is making lexical relevance a first-class managed capability inside the operational PostgreSQL database used by AI applications.**

The meaningful change is architectural. Hybrid retrieval can move from "database plus search cluster" toward "database as both operational and retrieval system" for workloads that fit the preview's constraints.

## Sources and further reading

- [Google Cloud — Native BM25 Ranking in AlloyDB and Cloud SQL](https://cloud.google.com/blog/products/databases/native-bm25-search-in-alloydb-and-cloud-sql)
- [Google Cloud — pg_textsearch documentation](https://docs.cloud.google.com/sql/docs/postgres/pg-textsearch)
- [TigerData — pg_textsearch](https://github.com/timescale/pg_textsearch)
- [AI Stack Current independent coverage](https://www.aistackcurrent.com/news/google-cloud-alloydb-cloud-sql-native-bm25/)
