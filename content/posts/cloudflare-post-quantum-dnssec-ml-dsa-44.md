---
title: "Cloudflare's Post-Quantum DNSSEC Test Moves Quantum Migration Into the Resolver"
description: "Cloudflare enabled ML-DSA-44 DNSSEC validation on 1.1.1.1 on September 10, 2026, exposing the practical packet-size and downgrade problems that a post-quantum DNS migration must solve."
excerpt: "Cloudflare's 1.1.1.1 resolver can now validate ML-DSA-44 DNSSEC signatures. The important signal is not that DNS is suddenly quantum-safe, but that operators can now measure what 2,420-byte signatures do to the DNS transport and trust chain."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Internet Infrastructure & Security
tags:
  - DNSSEC
  - post-quantum cryptography
  - ML-DSA
  - Cloudflare
  - DNS
  - Internet infrastructure
author: Digital Observatory
authorRole: Internet Infrastructure & Security
featured: false
coverImage: ""
coverAlt: "DNSSEC resolver validating a large post-quantum ML-DSA-44 signature across the Internet"
keywords:
  - Cloudflare 1.1.1.1 post-quantum DNSSEC
  - ML-DSA-44 DNSSEC
  - post-quantum DNSSEC
  - DNSSEC algorithm 18
  - quantum-safe DNS
canonicalUrl: "https://observatory.campusloop.space/blog/cloudflare-post-quantum-dnssec-ml-dsa-44"
noIndex: false
sources:
  - label: "Cloudflare — 1.1.1.1 now supports post-quantum DNSSEC"
    url: "https://blog.cloudflare.com/post-quantum-dnssec-1111/"
    note: "Primary September 10, 2026 engineering announcement describing ML-DSA-44 validation, packet-size constraints, downgrade protection, and the planned authoritative-DNS next step."
  - label: "NIST — FIPS 204: Module-Lattice-Based Digital Signature Standard"
    url: "https://csrc.nist.gov/pubs/fips/204/final"
    note: "Primary standard defining ML-DSA, the post-quantum signature family used by Cloudflare's DNSSEC test."
  - label: "IANA — DNSSEC Algorithm Numbers"
    url: "https://www.iana.org/assignments/dns-sec-alg-numbers/dns-sec-alg-numbers.xhtml"
    note: "Registry context for DNSSEC algorithm assignments, including ML-DSA-44's algorithm number."
  - label: "Cyberpresso — Cloudflare 1.1.1.1 adds post-quantum DNSSEC validation"
    url: "https://cyberpresso.com/blog/cloudflare-1111-pq-dnssec"
    note: "Independent September 13, 2026 explanation of the resolver-side deployment and its migration limits."
---

**Cloudflare has made 1.1.1.1 capable of validating DNSSEC signatures made with ML-DSA-44, but this does not make the DNS hierarchy post-quantum safe.** The September 10, 2026 deployment is better understood as an Internet-scale interoperability test: it lets a major public resolver measure what happens when DNSSEC signatures become thousands of bytes larger and when a resolver must avoid silently falling back to a classical signature.

That distinction matters because DNSSEC is a chain-of-trust system. A post-quantum resolver is only one part of the migration.

## What changed on September 10, 2026

Cloudflare says its 1.1.1.1 resolver now validates DNSSEC signatures generated with **ML-DSA-44**, a post-quantum digital-signature algorithm standardized by the National Institute of Standards and Technology (NIST).

The change is transparent to ordinary 1.1.1.1 users. A zone must publish the relevant DNSSEC records before the resolver can exercise the new validation path.

The immediate engineering goal is to learn how the Internet handles the much larger cryptographic objects required by ML-DSA-44.

## Why a DNS signature suddenly becomes a networking problem

The cryptographic change is unusually visible at the packet layer.

Cloudflare reports these sizes:

| Algorithm | Signature size | Public-key size |
| --- | ---: | ---: |
| ECDSA P-256 | 64 bytes | 64 bytes |
| ML-DSA-44 | 2,420 bytes | 1,312 bytes |

An ML-DSA-44 signature is therefore almost 38 times larger than an ECDSA P-256 signature.

A DNS response carrying that signature can exceed common UDP payload budgets before the rest of the response is included. Cloudflare's test environment therefore demonstrates a practical path in which the UDP answer is truncated and the resolver retries over TCP.

That is not a theoretical concern. DNS software, middleboxes and network paths have accumulated assumptions about message size over decades.

## The migration problem is bigger than the resolver

DNSSEC supports algorithm agility, but replacing a deployed signing algorithm requires coordination across the hierarchy.

A complete post-quantum path would require compatible implementations in cryptographic libraries, authoritative DNS servers, validating resolvers, registrars and registries. The chain ultimately has to reach the DNS root.

Cloudflare's September deployment covers only the resolver side.

Its stated next step is to add ML-DSA-44 signing to Cloudflare Authoritative DNS and corresponding DS-record support to Cloudflare Registrar. That would let the company test more of the path from signature generation to publication and validation.

So the correct description is **post-quantum DNSSEC validation at one large resolver**, not post-quantum DNSSEC across the Internet.

## The downgrade problem is the harder security detail

During a transition, zones may need to publish both conventional and post-quantum signatures so older resolvers continue to work.

That compatibility creates a security question.

If a resolver supports ML-DSA-44 but is willing to accept a forged classical signature whenever one is available, an attacker with a future quantum computer could potentially exploit the weaker path.

Cloudflare says 1.1.1.1 therefore applies a stricter local policy when an authenticated parent DS record signals post-quantum support: a valid ML-DSA-44 validation path is required rather than treating a conventional path as sufficient.

This is an important distinction between **supporting a new algorithm** and **actually enforcing its security property**.

## Why the quantum threat is not an emergency today

Cloudflare explicitly notes that quantum computers capable of breaking today's deployed public-key signatures do not exist today.

DNSSEC also authenticates DNS data rather than providing confidentiality, so the familiar "harvest now, decrypt later" framing for encrypted traffic does not map directly onto DNSSEC.

The reason to start now is migration time.

Changing DNSSEC requires coordination between software, operators and the DNS delegation hierarchy. Waiting until a cryptographically relevant quantum computer exists would leave little time for interoperability testing and global deployment.

## What operators can learn from the test

The useful output of Cloudflare's deployment is operational evidence.

A resolver operator can measure:

- how often ML-DSA-44 responses require TCP after UDP truncation;
- whether DNS implementations correctly handle the larger DNSKEY and RRSIG records;
- whether middleboxes or network paths mishandle the larger responses;
- how dual-algorithm zones behave during migration; and
- whether local downgrade policies work as intended.

Cloudflare has published a test domain, `dnstest.dev`, and a `dig` query that can demonstrate the oversized response and TCP retry behavior through 1.1.1.1.

That makes the deployment unusually observable for an early cryptographic migration.

## How this differs from post-quantum TLS

Cloudflare has worked on post-quantum key agreement for TLS for years, and the Internet has already encountered the deployment cost of larger cryptographic messages.

DNSSEC has a different problem profile.

TLS protects communication confidentiality and integrity between endpoints. DNSSEC authenticates DNS data through a delegation chain. Its migration therefore depends on authoritative servers, parent DS records and the resolver's trust policy.

The shared lesson is that post-quantum cryptography is not only an algorithm-selection problem. It is also a protocol, transport and deployment problem.

## What this does not prove

Cloudflare's announcement does **not** prove that DNSSEC has been migrated to post-quantum cryptography globally.

It does not establish that every resolver, authoritative server, registrar or registry can already handle ML-DSA-44. It also does not mean that a quantum computer capable of breaking today's DNSSEC algorithms exists.

The most defensible observation is narrower: **a major public resolver is now testing the operational consequences of post-quantum DNSSEC at Internet scale, including oversized DNS responses and protection against classical-algorithm fallback.**

## Why this matters for the Internet

The Observatory has tracked how Internet infrastructure is adapting to new policy and security requirements, including [AI crawling becoming a policy layer](/blog/ai-crawling-is-becoming-a-policy-layer).

Post-quantum DNSSEC adds a different kind of infrastructure transition: a cryptographic upgrade that changes the size and behavior of a protocol's messages while requiring coordination across a global trust hierarchy.

The important signal is therefore not a claim that DNS is already quantum-safe. It is that the migration has moved from standards and laboratory discussion into a public resolver where real interoperability costs can be measured.

The next meaningful evidence will be broader authoritative signing, registrar and registry support, measurements from independent resolver operators, and eventually deployment higher in the DNS delegation chain.

## Sources and further reading

- [Cloudflare — 1.1.1.1 now supports post-quantum DNSSEC](https://blog.cloudflare.com/post-quantum-dnssec-1111/)
- [NIST — FIPS 204: Module-Lattice-Based Digital Signature Standard](https://csrc.nist.gov/pubs/fips/204/final)
- [IANA — DNSSEC Algorithm Numbers](https://www.iana.org/assignments/dns-sec-alg-numbers/dns-sec-alg-numbers.xhtml)
- [Cyberpresso — Cloudflare 1.1.1.1 adds post-quantum DNSSEC validation](https://cyberpresso.com/blog/cloudflare-1111-pq-dnssec)
