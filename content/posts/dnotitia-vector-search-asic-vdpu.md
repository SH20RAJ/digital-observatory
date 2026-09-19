---
title: "Dnotitia's Vector Silicon Bet Moves AI Retrieval From FPGA to ASIC Testing"
description: "Dnotitia says its first Vector Data Processing Unit ASIC samples have returned from fabrication, moving a dedicated vector-search accelerator from FPGA evaluation toward silicon testing in Q4 2026."
excerpt: "The interesting signal in Dnotitia's VDPU is not a proven 10x ASIC result; it is the attempt to give vector retrieval its own silicon layer while the reported 5.77x gain still comes from an FPGA platform."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI Infrastructure
tags:
  - Dnotitia
  - vector search
  - ASIC
  - AI infrastructure
  - RAG
  - agentic AI
  - semiconductor
author: Digital Observatory
authorRole: AI Infrastructure Research
featured: false
coverImage: ""
coverAlt: "Dnotitia Vector Data Processing Unit accelerator moving from FPGA evaluation toward ASIC testing"
keywords:
  - Dnotitia VDPU
  - vector search ASIC
  - vector data processing unit
  - AI retrieval hardware
  - RAG accelerator
  - vector database hardware
canonicalUrl: "https://observatory.campusloop.space/blog/dnotitia-vector-search-asic-vdpu"
noIndex: false
sources:
  - label: "Dnotitia / PR Newswire — VDPU announcement"
    url: "https://www.prnewswire.com/news-releases/dnotitia-brings-dedicated-vector-silicon-to-server-scale-at-ai-infra-summit-2026-302882731.html"
    note: "Primary September 18, 2026 company announcement covering ASIC sample return, FPGA measurements, software integrations and planned Q4 evaluations."
  - label: "HPCwire — Dnotitia vector silicon coverage"
    url: "https://www.hpcwire.com/aiwire/2026/09/18/dnotitia-brings-dedicated-vector-silicon-to-server-scale-at-ai-infra-summit-2026/"
    note: "Independent specialist publication carrying the announcement and emphasizing that the reported performance figures are from the FPGA platform."
  - label: "RuntimeWire — Dnotitia VDPU analysis"
    url: "https://runtimewire.com/article/dnotitia-vdpu-vector-search-asic-back-from-fab"
    note: "Independent September 18, 2026 analysis highlighting that ASIC performance, power and economics remain untested."
---

**Dnotitia has moved its Vector Data Processing Unit (VDPU) from FPGA evaluation toward actual ASIC testing: the company says first-generation chip samples returned from fabrication in September 2026, with silicon-based evaluations planned for Q4.** The important distinction is that the headline performance result—up to 5.77x vector-search throughput—comes from an FPGA platform, not the new ASIC. [Dnotitia's announcement](https://www.prnewswire.com/news-releases/dnotitia-brings-dedicated-vector-silicon-to-server-scale-at-ai-infra-summit-2026-302882731.html)

## What VDPU is trying to change

Modern AI retrieval workloads often rely on vector search to find relevant documents, images or other embeddings before a model generates an answer.

The common architecture is roughly:

```text
application
    ↓
retrieval / vector database
    ↓
CPU + memory
    ↓
storage / network
```

Dnotitia is proposing another layer:

```text
application
    ↓
vector database
    ↓
VDPU vector accelerator
    ↓
CPU / memory freed for application work
```

The company's thesis is that retrieval can become a sufficiently important workload to justify dedicated processing rather than treating vector search as another CPU task competing with application logic.

## The September milestone is ASIC samples, not final performance

Dnotitia announced on September 18 that its first-generation VDPU ASIC samples had returned from fabrication and were undergoing chip-level characterization.

The company plans to begin ASIC-based evaluations in Q4 2026.

That is a meaningful hardware milestone, but it is not the same thing as demonstrating final product performance. The ASIC has not yet produced the public benchmark results described for the FPGA platform.

This distinction is central to interpreting the announcement.

## The 5.77x number comes from an FPGA system

Dnotitia reports that a four-card VDPU server achieved up to **5.77x the vector-search throughput** of a dual-socket CPU-only server using the same software stack.

In a separate 4,096-dimensional multimodal workload, the company reports:

- 92% lower host CPU use during index building;
- 73% lower host memory use;
- equal or better recall in the reported vector-search comparison.

HPCwire reproduces the qualification that these results were measured on the FPGA evaluation platform and **do not represent final ASIC performance**.

That makes the benchmark useful as evidence that the architecture can produce a measurable acceleration in one test environment, but not as evidence that the forthcoming ASIC will deliver the same result.

## The software integration is as important as the chip

Dnotitia says its FPGA platform has been validated with FAISS, Milvus and hnswlib across brute-force KNN, IVF, NSW and HNSW indexes.

That matters because a specialized accelerator is only useful if existing retrieval systems can actually send work to it.

The integration stack looks like:

```text
vector database / library
  ├─ Milvus
  ├─ FAISS
  └─ hnswlib
        ↓
      VDPU
        ↓
vector-search acceleration
```

The company's roadmap says it plans broader vector-library and database support for the ASIC.

That makes software compatibility a key future measurement alongside raw throughput.

## Why retrieval deserves its own infrastructure question

The Observatory's recent [Google Cloud BM25 analysis](/blog/google-cloud-native-bm25-postgresql-hybrid-search) looks at retrieval from the database layer: lexical BM25 search moving directly into PostgreSQL so semantic and lexical retrieval can coexist.

VDPU approaches the same broad problem from hardware.

The two developments point in different directions but share an architectural theme: **retrieval is becoming a first-class systems concern rather than an invisible pre-processing step before model inference.**

That is increasingly relevant for agentic applications, where a system may retrieve context repeatedly while an agent plans, calls tools and verifies results.

## The CPU and GPU boundary is part of the bet

Dnotitia argues that dedicated retrieval processing can free host CPU and memory while allowing GPUs to focus on model execution.

That is a systems-level optimization hypothesis, not yet a universally demonstrated result.

If the ASIC performs well, a possible architecture is:

```text
GPU → model inference
VDPU → vector retrieval
CPU → application orchestration
memory → shared working state
```

The advantage would come from specialization and reduced resource contention rather than simply making every component faster.

## The commercial question is still open

Dnotitia is targeting up to 10x vector-search performance versus a CPU-based server with its ASIC-based server.

That figure is a **company target**, not a measured result.

The commercially relevant comparison will eventually need more than throughput:

| Metric | Why it matters |
| --- | --- |
| Throughput | How much retrieval work the system can process |
| Latency | Whether acceleration helps interactive workloads |
| Recall | Whether acceleration preserves retrieval quality |
| Power | Whether the accelerator is efficient at system scale |
| Cost | Whether hardware economics beat general-purpose compute |
| Software compatibility | Whether existing databases can use it without major rewrites |

Until silicon-based measurements exist, the economic case remains unproven.

## Where this fits in the Observatory's hardware map

Dnotitia's approach sits at a different layer from the Observatory's [Huawei Peerium architecture](/blog/huawei-peerium-million-processor-ai-architecture), which addresses extremely large-scale AI compute systems.

It also complements [VIHAAN-I](/blog/vihaan-i-indian-risc-v-networking-soc), which is a networking SoC rather than a retrieval accelerator.

The three examples illustrate a broader hardware stack:

```text
large-scale model compute → Huawei Peerium
network / edge connectivity → VIHAAN-I
vector retrieval → Dnotitia VDPU
```

The interesting trend is not that one architecture replaces another. It is that increasingly specific workloads are being pulled out of general-purpose compute and given specialized hardware paths.

## What to watch in Q4

The next useful evidence is not another announcement. It is silicon-based measurement.

The most informative follow-ups would be:

1. ASIC throughput against the same CPU baseline;
2. latency distributions rather than peak throughput alone;
3. power consumption under representative workloads;
4. recall and ranking-quality comparisons;
5. support for production vector databases;
6. system cost per query or per retrieved vector;
7. behavior under concurrent workloads.

Those measurements can determine whether the FPGA architecture translates into a useful commercial ASIC.

## Limitations and uncertainty

All performance numbers currently discussed publicly are from Dnotitia's FPGA evaluation platform. They are company-reported measurements, not an independent benchmark suite.

The first-generation ASIC is still undergoing characterization, and Dnotitia's target of up to 10x CPU-server performance is a future target rather than a demonstrated result.

Power, silicon cost, final clock rates, production yield and system-level economics were not established by the evidence reviewed for this article.

## Why this is meaningfully new

Digital Observatory already covers vector retrieval through software/database architecture and AI compute through large-scale accelerator systems. Dnotitia adds a distinct layer: **dedicated silicon for the retrieval stage itself**.

The September 2026 milestone is therefore worth tracking not because a 10x result has already been proven, but because vector search is being treated as a hardware workload with its own accelerator path.

## Sources and further reading

- [Dnotitia / PR Newswire — VDPU announcement](https://www.prnewswire.com/news-releases/dnotitia-brings-dedicated-vector-silicon-to-server-scale-at-ai-infra-summit-2026-302882731.html)
- [HPCwire — Dnotitia vector silicon coverage](https://www.hpcwire.com/aiwire/2026/09/18/dnotitia-brings-dedicated-vector-silicon-to-server-scale-at-ai-infra-summit-2026/)
- [RuntimeWire — Dnotitia VDPU analysis](https://runtimewire.com/article/dnotitia-vdpu-vector-search-asic-back-from-fab)
