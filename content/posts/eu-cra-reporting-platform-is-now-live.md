---
title: "The EU's Cyber Resilience Act Has Turned Vulnerability Reporting Into a Live Platform"
description: "The EU's CRA Single Reporting Platform became operational on September 11, 2026, starting mandatory reporting for manufacturers of actively exploited vulnerabilities and severe incidents."
excerpt: "The Cyber Resilience Act moved from policy text into operating infrastructure this month: manufacturers now have a live EU reporting channel with 24-hour and 72-hour deadlines."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Security & Digital Policy
tags:
  - Cyber Resilience Act
  - ENISA
  - vulnerability disclosure
  - software security
  - EU regulation
author: Digital Observatory
authorRole: Security & Digital Policy
featured: false
coverImage: ""
coverAlt: "A European cybersecurity reporting workflow connecting manufacturers to national authorities"
keywords:
  - Cyber Resilience Act reporting obligations
  - CRA Single Reporting Platform
  - ENISA CRA SRP
  - vulnerability reporting EU
  - 24 hour 72 hour CRA deadline
canonicalUrl: "https://digital-observatory.dev/blog/eu-cra-reporting-platform-is-now-live"
noIndex: false
sources:
  - label: "European Commission — Cyber Resilience Act reporting obligations"
    url: "https://digital-strategy.ec.europa.eu/en/policies/cra-reporting"
    note: "Primary European Commission guidance on the reporting deadlines, scope, and the Single Reporting Platform."
  - label: "ENISA — The CRA Single Reporting Platform is launched"
    url: "https://www.enisa.europa.eu/news/the-cra-single-reporting-platform-is-launched"
    note: "Primary September 11, 2026 launch announcement for the initial operating capability of the platform."
  - label: "ENISA — CRA Single Reporting Platform FAQ"
    url: "https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions"
    note: "FAQ updated September 17, 2026 with current scope, operational status, and reporting-role details."
  - label: "OpenSSF — Grow CRA Readiness"
    url: "https://openssf.org/blog/2026/09/15/grow-cra-readiness-find-your-path-through-the-european-union-cyber-resilience-act/"
    note: "Independent ecosystem guidance for maintainers, software stewards, and manufacturers preparing for CRA obligations."
---

**The EU's Cyber Resilience Act (CRA) has moved into an operational reporting phase.** Since September 11, 2026, manufacturers of products with digital elements must use the EU's CRA Single Reporting Platform to report actively exploited vulnerabilities and severe security incidents. The European Commission says the initial warning is due within 24 hours of awareness and the main notification within 72 hours. [European Commission](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)

This is more consequential than another compliance deadline because the reporting requirement now has a live platform, a workflow, and an operating authority behind it.

## September 11 was the operational milestone

ENISA announced on September 11 that it had deployed the initial operating capability of the CRA Single Reporting Platform, or SRP.

The platform is designed to let manufacturers report once rather than separately notifying multiple national authorities. ENISA operates and maintains the service, while the reporting information is routed to the relevant EU cybersecurity response structures. [ENISA](https://www.enisa.europa.eu/news/the-cra-single-reporting-platform-is-launched)

The European Commission describes the same architecture: a manufacturer submits through the SRP, the relevant CSIRT receives the notification, and the information can then be shared with other affected jurisdictions.

This is a meaningful systems change because compliance is no longer only a document-management exercise. It is now a **time-sensitive operational process**.

## The reporting clock is short

For manufacturers covered by Article 14 obligations, the Commission currently specifies:

- an early warning within **24 hours** of becoming aware;
- a main notification within **72 hours**;
- a final report no later than **14 days** after a corrective measure is available for actively exploited vulnerabilities;
- and a final report within **one month** of the 72-hour submission for severe incidents.

[European Commission guidance](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting) is the authoritative reference for the current deadlines.

The important operational implication is that vulnerability response teams need more than a technical patching process. They need **detection, triage, ownership, legal/compliance coordination, and reporting readiness**.

A company that can patch quickly but cannot assemble a complete notification under time pressure still has a process problem.

## The platform currently serves a narrower group than the headline suggests

The CRA is a broad horizontal cybersecurity law, but the September 2026 reporting milestone has a specific starting scope.

ENISA's September 17 FAQ says the current version of the SRP supports mandatory notifications from manufacturers under Article 14. It also says the reporting obligations for open-source software stewards under Article 24(3) take effect on **December 11, 2027**.

That distinction matters.

"CRA is live" does not mean every open-source maintainer has the same reporting obligation today.

The role a company or project plays in the product lifecycle matters. The exact regulatory scope should be checked against the current CRA text and implementation guidance rather than inferred from a general headline.

## The infrastructure changes incident-response architecture

A live reporting platform affects how organizations structure security operations.

A mature process now needs to connect at least four layers:

**security signal → technical triage → regulatory classification → CRA notification**

The earlier each layer is connected, the easier it becomes to meet a 24-hour deadline.

This suggests a practical architecture for product teams:

- maintain a clear inventory of digital products and versions;
- record when a vulnerability becomes actively exploited or otherwise crosses the relevant threshold;
- identify the responsible legal entity and assigned representative;
- preserve the technical evidence needed for the notification;
- predefine escalation paths for security, product, legal, and communications teams;
- exercise the reporting workflow before a real incident arrives.

The SRP does not remove those internal responsibilities. It gives the final reporting step a standardized place to happen.

## The CRA also creates a future open-source signal

The open-source timeline deserves separate attention.

The European Commission and ENISA both say the specific reporting obligation for open-source software stewards under Article 24(3) starts on **December 11, 2027**.

That means the current September 2026 platform launch is also a preparation window for part of the open-source ecosystem.

OpenSSF has already published practical guidance to help maintainers and other software stewards understand where they may fall within the CRA's model.

The useful observation is that the regulation is creating a future reporting boundary that is still more than a year away for some actors, while the technical reporting infrastructure is already live.

## What the CRA platform does not solve

A centralized reporting platform reduces duplication. It does not solve the hard parts of vulnerability response.

Organizations still have to determine:

- whether an event meets the reporting threshold,
- whether it is actively exploited,
- what product and version are affected,
- what corrective measure is available,
- which legal entity has the reporting responsibility,
- and whether another party has already reported related information.

Those are evidence and governance problems.

The platform can route a notification. It cannot manufacture the facts needed to fill that notification accurately.

## What developers should prepare now

### Keep an incident timeline

Record exact discovery, validation, exploitation, containment, and remediation times. CRA reporting uses deadlines relative to when a party becomes aware and when measures become available.

### Identify the reporting owner

Security engineers should know who can actually submit a notification on behalf of the manufacturer or assigned representative.

### Make product inventories current

A vulnerability affecting one package can have a very different regulatory impact depending on whether that package is embedded in a product with digital elements placed on the EU market.

### Test the workflow

The first time an organization uses a reporting portal should not be during a live incident.

## What the evidence does and does not prove

**Observed:** The CRA Single Reporting Platform became operational on September 11, 2026. [ENISA](https://www.enisa.europa.eu/news/the-cra-single-reporting-platform-is-launched)

**Documented:** Manufacturers' reporting obligations under Article 14 apply from September 11, 2026, with 24-hour and 72-hour notification milestones. [European Commission](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)

**Documented:** The ENISA FAQ updated September 17 confirms the platform is operational and that open-source steward reporting under Article 24(3) begins on December 11, 2027. [ENISA FAQ](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions)

**Context:** OpenSSF has published ecosystem guidance aimed at helping open-source participants reason about CRA readiness. [OpenSSF](https://openssf.org/blog/2026/09/15/grow-cra-readiness-find-your-path-through-the-european-union-cyber-resilience-act/)

**Unknown:** The practical burden for any individual project depends on its legal role, product context, and current implementation guidance. This article is an observatory note, not legal advice.

The defensible conclusion is:

> **The CRA has crossed from regulatory text into operational infrastructure: covered manufacturers now have a live EU reporting channel and short, explicit deadlines for qualifying cybersecurity events.**

## Why this belongs in the Observatory

This is a different kind of security signal from a new CVE or attack report.

The interesting event is the creation of an institutional interface between **software incidents and regulatory response**.

That interface will produce its own future dataset: reporting volume, operational friction, implementation clarifications, and eventually changes to how organizations structure vulnerability response.

The Observatory will watch the system through those concrete signals rather than assuming the regulation's existence automatically makes software more secure.

For a parallel view of software-supply-chain controls, see [npm's Stage-Only Tokens Put a Human Gate Between CI and Publication](/blog/npm-stage-only-tokens-human-approval).

## Sources and further reading

- [European Commission — Cyber Resilience Act reporting obligations](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)
- [ENISA — The CRA Single Reporting Platform is launched](https://www.enisa.europa.eu/news/the-cra-single-reporting-platform-is-launched)
- [ENISA — CRA Single Reporting Platform FAQ](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions)
- [OpenSSF — Grow CRA Readiness](https://openssf.org/blog/2026/09/15/grow-cra-readiness-find-your-path-through-the-european-union-cyber-resilience-act/)
