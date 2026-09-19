---
title: "CrowdSec's TanStack Disclosure Shows Why Supply-Chain Response Must Survive the First Compromise"
description: "CrowdSec's September 18, 2026 disclosure links a May TanStack npm compromise to the later copying of about 170 private GitHub repositories, exposing the long tail of stolen developer credentials."
excerpt: "The new fact is not that TanStack was compromised in May; it is that a credential stolen then was later used to copy CrowdSec's private repositories, showing why offboarding and token revocation remain part of supply-chain incident response."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Supply Chain & Security
tags:
  - npm
  - TanStack
  - GitHub
  - supply chain security
  - incident response
  - credential theft
author: Digital Observatory
authorRole: Supply Chain & Security Research
featured: false
coverImage: ""
coverAlt: "A compromised npm package leading from a developer workstation to a retained GitHub credential and private repositories"
keywords:
  - TanStack npm supply chain attack September 2026
  - CrowdSec private GitHub repositories
  - CVE-2026-45321
  - npm credential theft
  - GitHub token incident response
canonicalUrl: "https://observatory.campusloop.space/blog/crowdsec-tanstack-supply-chain-long-tail"
noIndex: false
sources:
  - label: "CrowdSec — TanStack Supply Chain Attack Analysis"
    url: "https://www.crowdsec.net/blog/tanstack-supply-chain-attack-analysis"
    note: "Primary September 18, 2026 incident analysis describing the copied repositories, retained employee access, credential scope, and chronology."
  - label: "GitHub Advisory Database — CVE-2026-45321"
    url: "https://github.com/advisories/GHSA-g7cv-rxg3-hmpx"
    note: "Primary advisory record for the May 11 TanStack package compromise and its credential-stealing mechanism."
  - label: "The Hacker News — CrowdSec repository disclosure"
    url: "https://thehackernews.com/2026/09/crowdsec-says-tanstack-npm-attack-led.html"
    note: "Independent September 19, 2026 reporting corroborating CrowdSec's account and timeline."
---

**CrowdSec's September 18, 2026 disclosure shows that a May npm supply-chain compromise can remain operationally relevant months later when a stolen developer credential survives the original incident.** CrowdSec says an attacker copied about 170 private GitHub repositories on May 22 using the account of a former employee whose machine had been compromised in the TanStack npm attack.

The important new signal is therefore not another retelling of the May TanStack incident. It is the **long tail between package compromise, credential theft, employee offboarding, repository access, and eventual disclosure**.

## What changed in September

CrowdSec says the private repositories were copied on May 22 and their contents appeared on an online forum on September 16. The company published its detailed analysis on September 18. It says the copying account belonged to a former employee whose device had been compromised during the May TanStack campaign.

The company says the attacker copied source code but did not alter its repositories, infrastructure, or databases. CrowdSec also says the only usable credential it identified in the exposed material was an AWS SNS credential limited to publishing to one topic.

That distinction matters: **source-code disclosure is not the same claim as infrastructure compromise**. The public evidence supports the former and CrowdSec explicitly says it found no evidence for the latter.

## The original TanStack compromise created the credential path

The GitHub Advisory Database records the May 11 compromise as CVE-2026-45321. It says 84 malicious versions across 42 `@tanstack/*` packages were published and that the malicious packages could harvest GitHub tokens, cloud credentials, npm credentials, Vault tokens, Kubernetes tokens and SSH keys from affected environments.

That makes the later CrowdSec incident easier to understand as a sequence rather than a single event:

```text
malicious npm package
        ↓
credential theft on developer device
        ↓
credential remains usable
        ↓
employee account retains repository access
        ↓
private repositories copied
        ↓
exposure discovered months later
```

The evidence does **not** establish exactly which TanStack package reached the former employee's machine, and CrowdSec says its report does not contain GitHub's complete findings. Those details remain unknown.

## Why offboarding becomes part of supply-chain security

The most operationally useful lesson is about identity lifecycle management.

CrowdSec says it removed the former employee's GitHub organization account on May 25, three days after the repository copy. It had already removed other access, but the GitHub organization membership had remained because the employee was finishing work.

That creates a security boundary that is easy to overlook: **a stolen token does not need the original endpoint to remain online if the identity behind it still has useful authorization**.

A supply-chain response therefore has to cover at least two layers:

1. **Endpoint containment** — determine whether the developer machine ran a malicious package.
2. **Identity containment** — revoke tokens, sessions, OAuth grants, SSH keys and organization memberships that could have been exposed.

The second layer can outlive the first by weeks or months.

## The blast radius was narrower than the headline suggests

CrowdSec says its infrastructure and databases were not accessed and no source code was modified. It also says the exposed AWS SNS credential was restricted to one topic.

That does not make the incident trivial. The company says the copied material included its web console, data-science scripts and models, automation code, and a consensus algorithm whose thresholds had not previously been public. It also says the archive contained 83 user email addresses and information relating to 51 historical investors.

But those claims should be kept separate:

| Layer | Publicly reported finding |
| --- | --- |
| Private source code | Copied |
| Repository modification | CrowdSec says none |
| Production infrastructure | CrowdSec says no access identified |
| Database access | CrowdSec says no access identified |
| AWS credential | One usable SNS credential identified |
| Customer email addresses | 83 exposed in the archive |
| Historical investor information | Data from a 2020 system exposed |

These are CrowdSec's reported findings, not an independent forensic reconstruction.

## The Observatory already tracks the first half of this pattern

Digital Observatory has already covered the original class of software supply-chain failure in its [Brevo and Cloudflare API-key incident](/blog/brevo-cloudflare-api-key-supply-chain-attack) and the broader [GitLab critical file-read response](/blog/gitlab-cve-2026-85706-forensic-response).

The new CrowdSec evidence adds a different system layer: **identity persistence after endpoint compromise**.

That is why this is not simply another npm-malware article. The useful question is what happens after the package is removed and the immediate endpoint is cleaned.

## What defenders should change

The evidence supports several concrete controls, while not proving that any one control would have prevented this incident.

### Revoke credentials at the start of a supply-chain investigation

Do not wait for proof that a particular token was abused. If a compromised package could read a token, treat that token as exposed until evidence shows otherwise.

### Separate employee offboarding from project handover

Keeping repository access open for unfinished work creates a deliberate exception to normal identity controls. Use time-bounded accounts, temporary access or explicit handover mechanisms instead of leaving a departing identity broadly authorized.

### Audit GitHub access outside the original endpoint

A clean developer laptop does not prove that a stolen OAuth or personal access token was never used elsewhere. Review repository access, token activity and organization membership independently.

### Keep cloud permissions narrow

CrowdSec's report illustrates why a narrowly scoped credential can limit the consequences of later exposure. Least privilege does not prevent theft, but it can constrain what the stolen credential can do.

## What remains uncertain

The public record does not identify the exact malicious TanStack package that compromised the former employee's device. CrowdSec also says the relevant GitHub token was no longer available when the company investigated, limiting what it could see in its own logs.

The public evidence therefore supports a **credible causal chain reported by CrowdSec and corroborated by independent reporting**, but it does not provide a complete forensic reconstruction of every action taken by the attacker.

## Why this matters now

The May TanStack incident was a package-publishing compromise. The September CrowdSec disclosure demonstrates the more difficult operational problem: **stolen developer credentials can turn a short-lived package attack into a much longer identity-and-access incident**.

For organizations, the practical rule is simple: when a software supply-chain incident may expose credentials, incident response should continue until the affected identities, tokens and downstream permissions have been inventoried and revoked—not merely until the malicious package is gone.

## Sources and further reading

- [CrowdSec — TanStack Supply Chain Attack Analysis](https://www.crowdsec.net/blog/tanstack-supply-chain-attack-analysis)
- [GitHub Advisory Database — CVE-2026-45321](https://github.com/advisories/GHSA-g7cv-rxg3-hmpx)
- [The Hacker News — CrowdSec Says TanStack npm Attack Led to Copy of 170 Private GitHub Repositories](https://thehackernews.com/2026/09/crowdsec-says-tanstack-npm-attack-led.html)
