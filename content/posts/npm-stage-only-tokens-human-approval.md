---
title: "npm's Stage-Only Tokens Put a Human Gate Between CI and Publication"
description: "On September 18, 2026, npm added stage-only granular access tokens that let CI prepare package releases without giving the credential direct publish authority. The change is part of a broader shift toward human approval and short-lived trust for npm publishing."
excerpt: "npm automation can now prepare a release without being able to publish it directly. That small permission change matters because it separates build automation from the final act of putting a package on the public registry."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Open Source
tags:
  - npm
  - supply chain security
  - CI/CD
  - JavaScript
  - open source
  - package registries
author: Digital Observatory
authorRole: Open Source & Developer Ecosystems
featured: true
coverImage: ""
coverAlt: "A software release pipeline stopping at a human approval gate before reaching the npm registry"
keywords:
  - npm stage-only tokens
  - npm staged publishing
  - npm granular access tokens
  - npm CI/CD security
  - npm trusted publishing
  - software supply chain security
canonicalUrl: "https://observatory.campusloop.space/blog/npm-stage-only-tokens-human-approval"
noIndex: false
sources:
  - label: "GitHub Changelog — Stage-only npm tokens for safer automation"
    url: "https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/"
    note: "September 18, 2026 announcement of the Read and write (stage only) npm granular access-token permission, required CLI versions, migration path, and January 2027 direct-publish target."
  - label: "npm Docs — About access tokens"
    url: "https://docs.npmjs.com/about-access-tokens/"
    note: "Current documentation defining stage-only tokens, their retained permissions, the approval flow, and the January 2027 direct-publishing change."
  - label: "npm Docs — npm-stage"
    url: "https://docs.npmjs.com/cli/v11/commands/npm-stage/"
    note: "CLI documentation for staged publishing, proof-of-presence, approval, rejection, token behavior, and best practices."
  - label: "npm Docs — Trusted publishing"
    url: "https://docs.npmjs.com/trusted-publishers/"
    note: "Current documentation for OIDC trusted publishing, short-lived credentials, stage-only trust relationships, and provenance."
  - label: "OpenSSF — Mini Shai-Hulud: Where SLSA’s Boundaries Fall"
    url: "https://openssf.org/blog/2026/06/10/mini-shai-hulud-where-slsas-boundaries-fall/"
    note: "Independent supply-chain-security analysis explaining why valid provenance does not by itself prove that a compromised build process produced a trustworthy artifact."
  - label: "SLSA — Mini Shai-Hulud: Where SLSA’s Boundaries Fall"
    url: "https://slsa.dev/blog/2026/05/mini-shai-hulud-what-slsa-can-and-cannot-do"
    note: "Independent SLSA analysis of the same 2026 npm supply-chain incident and the limits of provenance when the build platform is compromised."
---

**Yes: npm automation can now prepare a package release without having the authority to publish that new version directly.** On September 18, 2026, GitHub announced a new **Read and write (stage only)** option for npm granular access tokens. A workflow using that credential can run `npm stage publish`, but a maintainer must later approve the staged version with two-factor authentication (2FA) before it becomes public. [GitHub's September 18 announcement](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/)

That sounds like a small token-permission change. It is more interesting as a software-supply-chain signal: **npm is increasingly separating release preparation from release authorization.** Automation can build and submit the artifact; a human-controlled step remains at the boundary where the version becomes publicly installable.

## What changed on September 18, 2026

The new permission applies to npm **granular access tokens**. Instead of giving a CI credential both the ability to prepare and directly publish a new version, maintainers can choose a stage-only permission.

The resulting flow is:

```text
CI workflow
    ↓
npm stage publish
    ↓
private staged version
    ↓
maintainer inspection
    ↓
2FA approval
    ↓
public npm version
```

npm documents the staged version as unavailable for public access until approval. The maintainer can inspect the stage, download its tarball, approve it, or reject it. The approval step requires 2FA. [npm's staged publishing documentation](https://docs.npmjs.com/cli/v11/commands/npm-stage/)

The new token mode is therefore not another kind of read-only credential. It is a **write credential with a narrower publication boundary**.

## The important distinction: stage is not publish

A normal package-release pipeline often treats these actions as one operation:

1. build the package;
2. authenticate to npm;
3. run `npm publish`;
4. the version is live.

With a stage-only token, step 3 changes. The automation submits the version to npm, but the version stops in a staging state. Direct `npm publish` is rejected for that credential with `E_STAGE_REQUIRED`. npm's documentation also makes clear that stage-only does not remove every write capability: the token can still deprecate versions and move dist-tags. [npm access-token documentation](https://docs.npmjs.com/about-access-tokens/)

That last detail matters for security analysis. A stage-only token is **not** a universal safety boundary. It specifically narrows the ability to put a new package version on the public registry without human approval.

## Why this matters for CI/CD

The traditional problem with a package-publishing secret is straightforward: the workflow needs enough authority to publish, so the credential stored in the CI environment also has enough authority to publish.

If that credential is exposed, an attacker may be able to turn a compromised workflow into a malicious release.

Stage-only publishing changes the failure mode.

A compromised workflow may still be able to prepare a malicious package version and place it in the staging queue. But possession of the stage-only token alone is not enough to make that version public. A maintainer must approve the staged package using 2FA. [npm's access-token documentation](https://docs.npmjs.com/about-access-tokens/)

That is a meaningful reduction in direct publishing authority, even though it does not eliminate the underlying compromise.

## This is part of a larger npm publishing redesign

The September 18 change makes more sense when placed next to npm's other 2026 security changes.

In July, npm announced that granular access tokens configured to bypass 2FA would lose sensitive account and package-management capabilities, and said direct publishing through those tokens would also be removed around January 2027. [GitHub's July npm security announcement](https://github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens/)

On September 3, npm also expanded trusted publishing so a package could have multiple independent OIDC trust configurations. Those configurations can be restricted to staging, and npm recommends keeping trusted-publishing configurations to stage-only when possible. [GitHub's September 3 trusted-publishing update](https://github.blog/changelog/2026-09-03-multiple-trusted-publishing-configurations-for-npm/)

The direction is consistent:

| Release mechanism | Credential model | Can automation directly publish a new version? | Human approval boundary |
| --- | --- | --- | --- |
| Legacy-style bypass-2FA token workflow | Long-lived granular token | Yes, until the planned 2027 change | No |
| Stage-only granular token | Scoped npm token | No | Yes, 2FA approval |
| Trusted publishing | Short-lived OIDC identity | Depends on configured permission | Optional unless configured stage-only |
| Trusted publishing + stage-only permission | Short-lived OIDC identity | No | Yes, 2FA approval |

The table describes the permission model, not a guarantee of overall supply-chain security. npm itself warns that stage-only permissions do not protect every other write operation available to the credential. [npm's current access-token documentation](https://docs.npmjs.com/about-access-tokens/)

## The stronger security pattern is not just “add 2FA”

It is tempting to summarize the change as “npm added another 2FA check.” That misses the architectural point.

The deeper separation is between **machine identity** and **release authorization**.

A CI system is good at repeatable preparation:

- install dependencies;
- run tests;
- build artifacts;
- package files;
- submit a release candidate.

A maintainer is better positioned to authorize a consequential public release when the release boundary deserves human judgment.

Staged publishing makes that boundary explicit in the registry rather than trying to encode the entire decision inside the CI workflow.

That is particularly useful for packages with high downstream impact, where a release is not merely a build artifact but a new input into thousands of other projects.

## But provenance still does not mean “safe”

There is an important limitation here, and the recent supply-chain record makes it concrete.

OpenSSF and SLSA's analyses of the 2026 “Mini Shai-Hulud” incident describe compromised npm artifacts that still carried cryptographically valid provenance because the attacker abused a legitimate CI/OIDC path. The provenance accurately described the compromised build environment; it did not prove that the resulting artifact was benign. [OpenSSF's analysis](https://openssf.org/blog/2026/06/10/mini-shai-hulud-where-slsas-boundaries-fall/) [SLSA's analysis](https://slsa.dev/blog/2026/05/mini-shai-hulud-what-slsa-can-and-cannot-do)

That distinction fits the Observatory's broader rule that **signals are evidence, not truth**. A signed provenance statement is valuable evidence about where an artifact came from. It is not a proof that the build inputs, workflow, or source state were uncompromised.

Stage-only publishing addresses a different part of the chain: it adds an authorization gate between automated preparation and public release.

These controls complement each other rather than replace each other.

## What maintainers should do now

For teams publishing npm packages from automation, the current evidence supports a practical hierarchy.

### Prefer trusted publishing when it fits

npm recommends OIDC trusted publishing over traditional long-lived publishing tokens. Its current documentation describes short-lived, workflow-specific credentials and automatic provenance generation for supported public-repository publishing flows. [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/)

### If you still need a token, remove direct-publish authority

The new stage-only granular token is the migration path npm explicitly describes for token-based automation that cannot yet move to trusted publishing. GitHub says the transition is opt-in today and does not change existing token behavior. [GitHub's stage-only token announcement](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/)

### Treat the January 2027 date as a migration deadline, not a distant idea

npm currently says direct publishing through bypass-2FA granular access tokens will be removed in **January 2027**. The September 18 announcement therefore changes what a migration can look like before that deadline: automation can move to staging now rather than waiting for direct publishing to disappear. [npm's access-token documentation](https://docs.npmjs.com/about-access-tokens/)

### Audit the remaining permissions

A stage-only token can still perform other package write operations. If the goal is strong separation, npm's own guidance recommends moving toward trusted publishing, restricting package-level token publishing, and avoiding unnecessary bypass-2FA credentials. [npm's npm-stage best practices](https://docs.npmjs.com/cli/v11/commands/npm-stage/)

## What this signal does—and does not—prove

**Observed:** On September 18, 2026, GitHub announced stage-only npm granular access tokens. They can stage a version but cannot directly publish a new version; approval with 2FA is required for the staged release. [GitHub's announcement](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/)

**Documented:** npm supports staged publishing through `npm stage publish`, inspection commands, and 2FA-protected approval. [npm-stage documentation](https://docs.npmjs.com/cli/v11/commands/npm-stage/)

**Interpretation:** npm is moving toward a clearer separation between automated release preparation and authorization to publish.

**Unknown:** We do not yet have evidence that stage-only publishing will materially reduce the rate or impact of real-world npm compromises. It can reduce one class of direct-publish failure, but attackers may still compromise source repositories, CI workflows, dependencies, maintainers, or other credentials.

That uncertainty matters. The new permission is a security control, not a proof that the npm supply chain is secure.

## Why this is a meaningful developer-ecosystem signal

The interesting change is not the appearance of one new checkbox in npm's token settings.

It is the emergence of a release model in which **automation prepares, registries hold, and humans authorize**.

That model fits a broader shift in software infrastructure toward short-lived identities, provenance, staged deployment, and explicit approval boundaries. It also gives maintainers a way to make the dangerous part of a package release—placing a new version on a public registry—less dependent on possession of a CI secret.

For the Observatory, the durable signal is therefore narrower than “npm is now secure.” The evidence supports this claim instead:

> **As of September 18, 2026, npm's publishing system gives maintainers a first-class way to let CI stage a package without giving that automation direct authority to publish the new version.**

That is a small interface change with a consequential architectural idea behind it: **the ability to build a release and the authority to release it do not have to belong to the same machine.**

## Related Observatory observations

For the Observatory's framework for separating measurement from interpretation, see [Signals Are Not Truth](/blog/signals-are-not-truth). For the project's approach to reading public developer activity without collapsing different metrics into a single score, see [GitHub Activity Is a Signal, Not a Scoreboard](/blog/github-activity-is-a-signal-not-a-scoreboard). For the broader purpose and methodology of the project, see [What Is a Digital Observatory?](/blog/what-is-a-digital-observatory).

## Sources & further reading

The primary evidence for this observation is GitHub's September 18, 2026 changelog announcement and npm's current access-token and staged-publishing documentation. OpenSSF and SLSA are included as independent security context for the limitations of provenance and CI trust.
