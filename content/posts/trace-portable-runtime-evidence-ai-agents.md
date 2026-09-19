---
title: "TRACE Gives AI Agents a Portable Record of What Actually Ran"
description: "TRACE, a Linux Foundation-hosted open specification, defines signed runtime evidence for AI agent runs so third parties can verify what model, code, policy, data class, and tools were involved without relying only on the operator."
excerpt: "TRACE is trying to make AI-agent execution auditable as an artifact: a signed record of what ran, where it ran, under which policy, what data it touched, and which tools it called."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI Infrastructure & Trust
tags:
  - AI agents
  - attestation
  - runtime evidence
  - AI governance
  - open standards
  - Linux Foundation
author: Digital Observatory
authorRole: AI Infrastructure & Trust
featured: false
coverImage: ""
coverAlt: "Signed runtime evidence record connecting an AI agent to its model, policy, data, tools, and execution environment"
keywords:
  - TRACE AI agent attestation
  - runtime evidence AI agents
  - Trust Runtime Attestation Compliance Evidence
  - AI governance evidence
  - hardware attestation
canonicalUrl: "https://observatory.campusloop.space/blog/trace-portable-runtime-evidence-ai-agents"
noIndex: false
sources:
  - label: "TRACE specification — Trust Runtime Attestation and Compliance Evidence"
    url: "https://github.com/agentrust-io/trace-spec"
    note: "Primary specification, schema, implementation and limitations; current public specification is v0.2."
  - label: "Linux Foundation — TRACE joins the Linux Foundation"
    url: "https://www.linuxfoundation.org/press/linux-foundation-welcomes-trace-to-advance-verifiable-runtime-evidence-for-ai-workloads"
    note: "Primary August 25, 2026 announcement of Linux Foundation hosting and industry contributors."
  - label: "HPCwire — Linux Foundation welcomes TRACE"
    url: "https://www.hpcwire.com/aiwire/2026/08/25/linux-foundation-welcomes-trace-to-advance-verifiable-runtime-evidence-for-ai-workloads/"
    note: "Independent technical coverage of the specification's standards composition and governance move."
---

**TRACE is an open specification for signed runtime evidence that lets a verifier inspect claims about an AI agent run—such as the model, runtime, policy, data class, and tools used—without treating the operator's own log as the only source of truth.** The project is hosted by the Linux Foundation and its current public specification is v0.2, released as a developer preview rather than a finished production standard.

That distinction matters. TRACE does not make an AI system trustworthy by itself. It defines a portable evidence format and verification model that can make claims about agent execution easier to transport, compare, and challenge.

## What TRACE is trying to record

An ordinary application log can say that an agent ran a particular model and called a particular tool. TRACE turns similar claims into a structured, signed record.

The current specification maps several questions to explicit fields:

- what model ran;
- where the workload ran;
- which policy bundle applied;
- what data class was involved;
- which tools were called;
- what build provenance was associated with the workload; and
- whether the record is anchored to a transparency system.

The record is designed so that another party can verify its signature and inspect the evidence without simply trusting the service that produced the log.

That is a useful change in the unit of AI governance. Instead of asking only whether a provider says an agent followed a policy, an auditor can ask whether the provider can produce a verifiable artifact describing the execution.

## Why agentic systems make runtime evidence more important

Traditional software assurance already has mechanisms for source provenance, workload identity, secure execution, and audit logs. Agentic AI adds another moving part: the system can dynamically choose tools, retrieve information, invoke services, and act on a user's behalf.

The resulting question is not merely "which model did you deploy?" It is closer to:

```text
model + code + runtime + policy + data + tools + execution evidence
```

TRACE is aimed at the last part of that chain.

This complements the Observatory's earlier coverage of [AI crawling as a policy layer](/blog/ai-crawling-is-becoming-a-policy-layer): once software agents become active participants in digital infrastructure, policy needs to be paired with evidence that the policy was actually applied during execution.

## TRACE composes existing standards instead of replacing them

The project is deliberately built as a composition layer.

The specification profiles standards and technologies including RATS and EAT for attestation evidence, SLSA for build provenance, SCITT for transparency anchoring, SPIFFE for workload identity, and EAR for evidence appraisal. It also describes integration with agent execution surfaces such as MCP and A2A.

That approach is important because a new governance format becomes much more useful if it can connect to systems organizations already operate.

The goal is therefore less like inventing another isolated compliance database and more like defining a common envelope in which existing evidence can be carried and verified.

## A signed record is not the same as a true record

This is the most important limitation in the current specification.

A signature can prove that a particular party produced a record and that the record was not altered after signing. It does **not**, by itself, prove that every claim inside the record is true.

TRACE's own documentation makes this distinction explicit. For example, a signed claim about the runtime needs independently verified evidence if a verifier is going to trust the runtime measurement.

The current reference implementation also has boundaries. Its verification flow can check the profile, schema, signature, canonical representation and freshness, but hardware attestation verification is not automatically performed by the basic library. Transparency anchoring is represented as evidence supplied by the producer rather than magically created by the library.

That means TRACE should currently be understood as an evidence framework, not a one-command truth machine.

## Where this could become useful

A portable runtime record could matter in several settings.

### Enterprise AI agents

An enterprise could require agents handling sensitive workloads to emit records showing which model and tools were used and which policy bundle governed the run.

### Cloud and sovereign infrastructure

If evidence travels with a workload, a customer could potentially compare execution claims across different hosts or cloud providers rather than accepting a provider-specific audit format.

### AI incident response

A standardized record could help investigators reconstruct which model, tool, policy and data class were involved in an incident.

### Regulatory evidence

Regulators and auditors increasingly need evidence rather than vendor assertions. A portable format does not solve compliance, but it can make evidence easier to inspect and exchange.

These are potential uses, not proof that TRACE has already achieved broad adoption.

## The governance change matters too

The Linux Foundation announced on August 25, 2026 that TRACE was being hosted as a Linux Foundation project, with development involving companies including AMD, Intel, Microsoft, OPAQUE and TII.

That governance move is part of the signal.

A runtime-attestation format controlled by a single AI vendor could create a trust problem of its own. Moving the project into a neutral open-source governance environment makes participation less dependent on one commercial platform.

HPCwire also reported that the project had recorded nearly 135,000 PyPI downloads within its first ten weeks. That is an ecosystem activity measurement, not evidence of production adoption or security effectiveness.

## What this does not prove

TRACE is still a developer preview and its repository explicitly tells users to review its limitations before relying on it in production.

A portable evidence format does not guarantee honest producers, complete evidence, correct hardware roots of trust, or useful policy definitions. It also does not determine whether an AI agent's decision was safe or appropriate.

Those limitations make the distinction between **measurement** and **interpretation** important. TRACE can standardize a measurement artifact; the governance process still has to decide what evidence is sufficient.

## Why this is meaningfully new for the Observatory

The Observatory already covers independent AI evaluation through [Anthropic's embedded evaluation model](/blog/anthropic-embedded-evaluation-changes-ai-safety-oversight) and the growing need to make frontier-model development observable through [research and development metrics](/blog/anthropic-ai-rd-metrics-make-frontier-development-observable).

TRACE addresses a different system layer: **runtime evidence at the moment an agent acts**.

The useful question to watch is whether standardized runtime evidence moves from a developer preview into interoperable infrastructure used by clouds, agent frameworks, auditors, and regulators.

For now, the strongest conclusion is narrower: **TRACE is an open, Linux Foundation-hosted attempt to make AI-agent execution portable and independently verifiable as structured evidence, but its current preview status means adoption and assurance value remain open questions.**

## Sources and further reading

- [TRACE specification and reference implementation](https://github.com/agentrust-io/trace-spec)
- [Linux Foundation — TRACE joins the Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-welcomes-trace-to-advance-verifiable-runtime-evidence-for-ai-workloads)
- [HPCwire — Linux Foundation welcomes TRACE](https://www.hpcwire.com/aiwire/2026/08/25/linux-foundation-welcomes-trace-to-advance-verifiable-runtime-evidence-for-ai-workloads/)
