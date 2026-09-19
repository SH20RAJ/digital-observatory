---
title: "Two Rust Kyber Crates Expose a Post-Quantum Cryptography Trap in Optional SIMD Backends"
description: "RustSec issued high-severity advisories on September 18, 2026 for cosmian_kyber and pqc_kyber: their optional AVX2 backends skip Fujisaki-Okamoto implicit rejection and can enable chosen-ciphertext key recovery."
excerpt: "The advisories are a reminder that post-quantum cryptography can fail at the implementation layer even when the underlying algorithm is intended to provide IND-CCA security."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Cybersecurity & Cryptography
tags:
  - RustSec
  - Kyber
  - ML-KEM
  - post-quantum cryptography
  - AVX2
  - cryptography
author: Digital Observatory
authorRole: Cybersecurity & Cryptography
featured: false
coverImage: ""
coverAlt: "Post-quantum Kyber decapsulation path showing Fujisaki-Okamoto implicit rejection and an unsafe AVX2 backend"
keywords:
  - RUSTSEC-2026-0288
  - RUSTSEC-2026-0290
  - cosmian_kyber
  - pqc_kyber
  - Kyber AVX2 vulnerability
  - ML-KEM chosen ciphertext attack
canonicalUrl: "https://observatory.campusloop.space/blog/rustsec-kyber-avx2-chosen-ciphertext-key-recovery"
noIndex: false
sources:
  - label: "RustSec — RUSTSEC-2026-0288"
    url: "https://rustsec.org/advisories/RUSTSEC-2026-0288.html"
    note: "Primary advisory for cosmian_kyber, issued September 18, 2026, including the AVX2 condition, chosen-ciphertext impact, maintenance status, and mitigation."
  - label: "RustSec — RUSTSEC-2026-0290"
    url: "https://rustsec.org/advisories/RUSTSEC-2026-0290.html"
    note: "Primary advisory for pqc_kyber, issued September 18, 2026, covering the same AVX2 conditional-move defect and key-recovery impact."
  - label: "OSV — RUSTSEC-2026-0288"
    url: "https://osv.dev/vulnerability/RUSTSEC-2026-0288"
    note: "Independent public vulnerability database record and machine-readable provenance for the advisory."
  - label: "OSV — RUSTSEC-2026-0290"
    url: "https://osv.dev/vulnerability/RUSTSEC-2026-0290"
    note: "Independent public vulnerability database record for the pqc_kyber advisory."
  - label: "Argyle-Software/kyber — referenced remediation work"
    url: "https://github.com/Argyle-Software/kyber/pull/121"
    note: "Upstream public pull request referenced by RustSec for the parent-crate defect and technical remediation path."
---

**RustSec's September 18, 2026 advisories show a different kind of post-quantum cryptography failure: two Rust Kyber crates have optional AVX2 backends in which the constant-time conditional-move routine is a no-op, skipping Fujisaki-Okamoto implicit rejection and enabling chosen-ciphertext key recovery.** The affected crates are `cosmian_kyber` and `pqc_kyber`; both advisories currently report no patched release. [RustSec](https://rustsec.org/advisories/RUSTSEC-2026-0288.html)

## The affected crates

RustSec issued two related advisories:

| Advisory | Crate | Affected configuration |
| --- | --- | --- |
| RUSTSEC-2026-0288 | `cosmian_kyber` | x86_64 with the opt-in `avx2` feature |
| RUSTSEC-2026-0290 | `pqc_kyber` | x86_64 with the opt-in `avx2` feature |

Both are forks or descendants of the same Kyber implementation lineage and contain the same class of AVX2 conditional-move defect.

The default reference backend is not affected according to RustSec, and non-x86_64 targets are outside the affected configuration described by the advisories.

## What the cryptographic failure is

Kyber, standardized as ML-KEM, is designed to provide protection against chosen-ciphertext attacks when implemented according to its security construction.

A key part of that construction is the Fujisaki-Okamoto transformation. During decapsulation, the implementation must reject malformed ciphertexts in a way that does not reveal useful information about the secret key.

The affected AVX2 backend breaks that step.

RustSec describes the relevant path as:

```text
attacker-chosen ciphertext
          ↓
       decapsulation
          ↓
   AVX2 conditional move
          ↓
       no-op copy
          ↓
FO implicit rejection skipped
          ↓
shared secret depends on attacker-controlled plaintext
          ↓
chosen-ciphertext oracle
```

That is a cryptographic correctness failure, not merely a performance bug.

## Why an optional CPU feature becomes security-critical

The most useful engineering lesson is that the vulnerability is conditional on an optimization path.

A developer can select an AVX2 feature expecting faster cryptography. The resulting binary can then use a completely different implementation of a security-critical primitive than the reference backend.

The high-level API can remain unchanged:

```text
application
   ↓
Kyber / ML-KEM API
   ↓
backend selection
   ├── reference implementation
   └── AVX2 implementation  ← vulnerable path
```

That makes cryptographic implementation testing especially important. Algorithm-level security claims do not automatically transfer to every optimized backend.

## What the advisories say about exploitation

RustSec assigns both advisories a CVSS 3.1 score of 7.4 and describes the attack as network-reachable with high attack complexity, no privileges and no user interaction.

The impact is stronger than the score alone suggests. RustSec says the chosen-ciphertext oracle can recover the full static secret key when a vulnerable key pair is reused across decapsulation operations.

For the parent `kyber` implementation, the advisory record says the defect was verified end to end on ML-KEM-768 with the full key recovered in 4,272 decapsulation queries. That number is evidence from the referenced reproduction, not a universal attack cost for every protocol or implementation.

## Key reuse is part of the threat model

The advisories distinguish long-lived or reused key pairs from ephemeral-only key shares.

The dangerous architecture is approximately:

```text
long-lived ML-KEM key pair
          ↓
repeated decapsulation requests
          ↓
attacker can submit chosen ciphertexts
          ↓
observe resulting shared-secret behavior
          ↓
recover static secret
```

If a protocol creates a one-time key share and never exposes the same secret key to repeated decapsulation requests, the described key-recovery path does not map directly to that ephemeral model.

That does not make the vulnerable library safe in general. It means exploitability depends on how the primitive is embedded in a protocol.

## The crates are also maintenance risks

RustSec says `cosmian_kyber` is a stale fork whose last published version was 0.1.0 in January 2023 and that no fixed release is expected. `pqc_kyber` is also described as unmaintained, with its last release in 2023.

This creates a second security signal beyond the code defect: **a cryptographic dependency without an active maintenance path is difficult to remediate when a backend-specific flaw appears.**

For security-sensitive cryptography, dependency freshness is therefore part of the implementation risk assessment.

## What this means for post-quantum migration

The Observatory's [Java 27 post-quantum TLS analysis](/blog/java-27-post-quantum-tls-runtime-security) tracks the protocol and runtime adoption side of post-quantum cryptography. The [OpenSearch FIPS analysis](/blog/opensearch-fips-140-3-cryptographic-compliance) examines validated cryptographic implementation inside an application platform.

The Kyber advisories add a lower-level layer: **the security of the implementation and its optimized CPU backend.**

Together, the three layers form a useful migration model:

```text
protocol adoption
      ↓
cryptographic runtime / library
      ↓
optimized implementation backend
      ↓
hardware-specific execution
```

A system can make progress at the first layer while still failing at the third.

## What maintainers should test

A cryptographic library with multiple CPU backends should test security-critical invariants across each backend, not only benchmark performance.

For a Kyber-style implementation, useful checks include:

- malformed-ciphertext rejection behavior;
- constant-time conditional operations;
- equality of security semantics across reference and optimized paths;
- known-answer tests;
- differential testing between backends;
- fuzzing of decapsulation inputs;
- and protocol-level tests with repeated decapsulation.

The exact test suite belongs to the implementation maintainers, but the principle is general: **an optimization must preserve the security invariant it replaces.**

## What users should do

RustSec's immediate guidance is narrow and concrete:

- do not enable the `avx2` feature on affected versions;
- prefer the default reference backend;
- do not reuse a Kyber key pair across decapsulations;
- and, where possible, replace the unmaintained crate with a maintained implementation appropriate to the protocol.

Because the advisories report no patched versions, simply waiting for a normal semver update is not currently a complete mitigation strategy.

Users should also identify whether their dependency graph enables `avx2` transitively or directly rather than assuming the feature is absent.

## What this does not mean

The advisories do **not** establish that Kyber or ML-KEM as a standardized algorithm is broken. They describe implementation defects in specific Rust crates and a specific optional backend.

They also do not show that every binary using those crates is vulnerable. The affected configuration depends on architecture, feature selection, key reuse, and protocol behavior.

Finally, the presence of a CVSS score does not quantify the number of deployed vulnerable systems or the prevalence of exploitation.

## Limitations and uncertainty

The primary evidence is RustSec's advisory database and the referenced upstream remediation work. OSV independently mirrors the advisory data and provides machine-readable provenance, but it is not a separate reproduction of the cryptographic attack.

The reported 4,272-query key-recovery result applies to the referenced ML-KEM-768 reproduction of the parent implementation. Real-world attack feasibility depends on the protocol, oracle exposure, rate limits, key lifetime, and whether the vulnerable AVX2 path is actually enabled.

## Why this is meaningfully new

The Observatory already covers post-quantum TLS and FIPS-oriented cryptographic deployment. This event adds a different system layer: **post-quantum security can fail inside an optimized implementation even when the underlying algorithm and protocol design remain sound.**

That is an important engineering distinction as post-quantum cryptography moves from research and standards into ordinary production dependencies.

## Sources and further reading

- [RustSec — RUSTSEC-2026-0288](https://rustsec.org/advisories/RUSTSEC-2026-0288.html)
- [RustSec — RUSTSEC-2026-0290](https://rustsec.org/advisories/RUSTSEC-2026-0290.html)
- [OSV — RUSTSEC-2026-0288](https://osv.dev/vulnerability/RUSTSEC-2026-0288)
- [OSV — RUSTSEC-2026-0290](https://osv.dev/vulnerability/RUSTSEC-2026-0290)
- [Argyle-Software/kyber remediation pull request](https://github.com/Argyle-Software/kyber/pull/121)
