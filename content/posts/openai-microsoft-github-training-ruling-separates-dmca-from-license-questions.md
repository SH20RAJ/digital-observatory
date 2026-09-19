---
title: "The GitHub AI Training Ruling Separates DMCA Questions From Open-Source License Questions"
description: "A September 16, 2026 U.S. appeals ruling narrowed part of a developer lawsuit against OpenAI and Microsoft, but left separate questions about open-source licensing and AI training unresolved."
excerpt: "The useful legal signal is the separation of different claims: rejecting one DMCA theory does not settle whether model training complied with software licenses or other copyright rules."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI & Software Law
tags:
  - AI training
  - GitHub
  - open source licensing
  - copyright
  - legal infrastructure
author: Digital Observatory
authorRole: AI, Open Source & Digital Policy
featured: false
coverImage: ""
coverAlt: "A legal decision separating software licensing, copyright metadata, and AI training claims"
keywords:
  - OpenAI Microsoft GitHub lawsuit
  - AI training open source licenses
  - DMCA AI code lawsuit
  - Copilot training lawsuit
canonicalUrl: "https://digital-observatory.dev/blog/openai-microsoft-github-training-ruling-separates-dmca-from-license-questions"
noIndex: false
sources:
  - label: "Reuters — OpenAI, Microsoft fend off part of software developer lawsuit"
    url: "https://www.reuters.com/legal/government/openai-microsoft-fend-off-part-software-developer-lawsuit-over-ai-training-2026-09-16/"
    note: "Independent September 16, 2026 report on the Ninth Circuit ruling and the remaining open-source licensing claims."
  - label: "U.S. Court of Appeals — Doe v. GitHub Inc."
    url: "https://cdn.ca9.uscourts.gov/datastore/opinions/"
    note: "Primary court-record source for the appellate decision and docket materials; exact opinion retrieval should follow the Ninth Circuit docket."
---

**The September 16, 2026 appellate ruling involving GitHub, OpenAI, and Microsoft narrows one legal theory without resolving the broader question of how open-source software may be used in AI training.** Reuters reports that the Ninth Circuit agreed with a lower court's reasoning on the DMCA claim while leaving separate licensing allegations for further litigation. [Reuters](https://www.reuters.com/legal/government/openai-microsoft-fend-off-part-software-developer-lawsuit-over-ai-training-2026-09-16/)

## One lawsuit can contain several different legal questions

AI training disputes are often described as one giant "copyright question."

They are not.

The developer case discussed by Reuters included a theory under the Digital Millennium Copyright Act involving removal of copyright-management information.

The appellate court's ruling on that theory does not automatically decide whether other copyright or software-license obligations were satisfied.

## Why the distinction matters to developers

Open-source software licenses can contain conditions around attribution, notices, redistribution, and other uses.

Those obligations are conceptually different from a claim that a model removed metadata or copied material in a legally actionable way.

A legal ruling on one claim therefore does not create a blanket rule for every use of public code in AI systems.

## The unresolved layer is more operational

For developers and AI vendors, the practical question becomes provenance.

Can a company explain:

- where the training data came from?
- which licenses applied?
- what transformations occurred?
- what notices were preserved?
- what outputs may be subject to downstream obligations?

Those are increasingly software-supply-chain questions.

## What this ruling does not prove

It does not establish that AI training on open-source code is generally lawful or unlawful.

It resolves part of one case.

The remaining claims, future cases, and different jurisdictions can produce different outcomes.

## Observatory interpretation

The durable signal is that **AI training law is fragmenting into specific technical and legal questions instead of one universal test**.

That creates pressure for better provenance systems and clearer license-aware data pipelines.

## Related observation

The issue connects directly to [Public Package Registries Are Becoming Enterprise Infrastructure](/blog/package-registries-enterprise-funding-infrastructure): the software supply chain now includes not only publication and distribution, but potential model-training use.

## Sources

- [Reuters — Ninth Circuit case](https://www.reuters.com/legal/government/openai-microsoft-fend-off-part-software-developer-lawsuit-over-ai-training-2026-09-16/)
- [Ninth Circuit opinions](https://cdn.ca9.uscourts.gov/datastore/opinions/)
