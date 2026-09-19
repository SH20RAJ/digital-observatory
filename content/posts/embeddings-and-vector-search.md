---
title: "Embeddings and Vector Search: What They Give You That Keyword Search Cannot"
description: "A practical introduction to embeddings, similarity search, chunking, indexing, retrieval, and the limitations of semantic search systems."
excerpt: "Embeddings turn objects such as text into vectors so systems can compare semantic relationships numerically, but similarity is not the same thing as truth."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: "published"
category: "AI & Data"
tags: ["embeddings","vector search","AI","information retrieval","RAG"]
keywords: ["embeddings explained","vector search","semantic search","RAG retrieval"]
author: "Digital Observatory"
authorRole: "Student Research & Engineering"
featured: false
coverImage: ""
coverAlt: "Embeddings and Vector Search: What They Give You That Keyword Search Cannot"
canonicalUrl: "https://observatory.campusloop.space/blog/embeddings-and-vector-search"
noIndex: false
sources:
  - label: "Sentence Transformers Documentation"
    url: "https://www.sbert.net/"
    note: "Practical documentation for text embeddings and semantic search."
  - label: "FAISS Documentation"
    url: "https://faiss.ai/"
    note: "Reference implementation and documentation for efficient vector similarity search."
---

**Embeddings map data into numerical vectors where nearby vectors are intended to represent related content; vector search then retrieves items using a similarity measure over those representations.** The important part is to understand what is measured, what is inferred, and what remains unknown.

## The core idea

Keyword search looks for explicit terms and linguistic matches. Embedding search instead uses a learned representation where related meanings can be close even when the exact words differ. This makes semantic retrieval powerful for discovery, but it also introduces model-specific behavior and a new quality problem: choosing which representation and similarity method actually fit the task.

Treat this as a design problem before treating it as a coding problem. Write the assumptions down. A short experiment can often settle a question that a long argument cannot.

## How it works

An embedding model converts an input into a fixed- or variable-sized numerical representation. Similarity can then be computed using a metric such as cosine similarity or another distance function.

Retrieval systems usually store embeddings in an index so they do not compare a query against every item. Approximate nearest-neighbor methods trade exactness for speed as the corpus grows.

The retrieved text is only as useful as the chunking, metadata, embedding model, and ranking pipeline. A semantically similar passage can still be incomplete, outdated, or wrong.

## A concrete example

A campus knowledge base can embed club descriptions and student questions. A question such as 'Where can I find robotics workshops?' may retrieve pages that never contain the exact word 'workshops' but describe robotics events and labs. A hybrid system can combine semantic retrieval with keywords and filters.

Change one input or one assumption and predict the result before testing it. This is a compact way to turn passive reading into an active learning loop.

## Common mistakes

- Treating the similarity score as a confidence score about truth.
- Creating chunks that are too large to retrieve precisely or too small to preserve context.
- Changing the embedding model without rebuilding the corpus and comparing retrieval behavior.

## A student project that makes it stick

Create a small reproducible experiment around the mechanism. Store the dataset or fixture, the code, the measurement method, and the result. If the experiment cannot be rerun, the lesson is harder to verify later.

## Where it connects

This topic connects to the surrounding engineering stack: data, networking, security, software design, and operations. The most useful concepts are the ones that explain behavior across several layers rather than only one framework.

## What to remember

1. Define the objective before selecting the technique.
2. Make hidden assumptions explicit.
3. Preserve a baseline so improvements are measurable.
4. Inspect failure cases, not only averages.
5. Keep the experiment small enough to understand end to end.

## Limitations

No simplified guide can capture every implementation detail. Results vary with data, versions, hardware, workload, and configuration. The sources below provide the normative or technical reference; use them when a production decision depends on details omitted here.

## Related Observatory reads

- [evaluating ai systems with multiple measures](/blog/evaluating-ai-systems-with-multiple-measures)
- [how a browser loads a web page](/blog/how-a-browser-loads-a-web-page)
- [sql joins group by and aggregation](/blog/sql-joins-group-by-and-aggregation)

## Primary sources

- [Sentence Transformers Documentation](https://www.sbert.net/)
- [FAISS Documentation](https://faiss.ai/)
