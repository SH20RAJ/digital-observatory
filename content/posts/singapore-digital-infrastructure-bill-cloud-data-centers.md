---
title: "Singapore's Digital Infrastructure Bill Moves Cloud and Data Centers Into a Licensing Regime"
description: "Singapore's Digital Infrastructure Bill, introduced for first reading on September 8, 2026, proposes licensing regimes for major cloud and data-centre services based on security, resilience, energy efficiency, and operational sustainability."
excerpt: "Singapore is regulating the compute layer underneath the AI economy: the proposed Bill would license major cloud services and data centres instead of regulating AI models directly."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Digital Infrastructure & Policy
tags:
  - Singapore
  - cloud infrastructure
  - data centers
  - digital infrastructure
  - regulation
  - AI infrastructure
author: Digital Observatory
authorRole: Digital Infrastructure & Policy
featured: false
coverImage: ""
coverAlt: "Singapore digital infrastructure licensing model covering cloud services and data centres"
keywords:
  - Singapore Digital Infrastructure Bill
  - Singapore cloud regulation 2026
  - data centre licensing Singapore
  - digital infrastructure regulation
  - cloud resilience Singapore
canonicalUrl: "https://observatory.campusloop.space/blog/singapore-digital-infrastructure-bill-cloud-data-centers"
noIndex: false
sources:
  - label: "Singapore MDDI — Digital Infrastructure Bill"
    url: "https://www.mddi.gov.sg/newsroom/new-digital-infrastructure-bill-to-strengthen-the-foundations-for-singapores-digital-economy/"
    note: "Primary source for the Bill's first reading, licensing regimes, security and sustainability objectives, and implementation approach."
  - label: "Singapore REACH — Public Consultation on the Digital Infrastructure Bill"
    url: "https://www.reach.gov.sg/latest-happenings/public-consultation-pages/2026/public-consultation-on-digital-infrastructure-bill/"
    note: "Primary consultation material describing thresholds, licensing scope, resilience duties, and environmental objectives."
  - label: "CNA — Proposed licensing regimes for data centres and cloud services"
    url: "https://www.channelnewsasia.com/singapore/bill-security-sustainability-data-centres-cloud-services-parliament-6367201"
    note: "Independent reporting on the Bill's scope, thresholds, incident duties, and relationship to Singapore's Cybersecurity Act."
  - label: "The Business Times — Bill after industry feedback"
    url: "https://www.businesstimes.com.sg/companies-markets/singapore-tables-digital-infrastructure-bill-resilience-cloud-data-centres"
    note: "Independent reporting on the September 8 first reading and consultation feedback."
---

**Singapore's Digital Infrastructure Bill moves the regulation of the AI economy one layer below AI models: the September 8, 2026 Bill proposes licensing regimes for major cloud services and data centres based on security, resilience, incident reporting, and environmental sustainability.** It is still a Bill, not enacted law, but its design is significant because it treats the compute infrastructure underneath digital services as regulated infrastructure in its own right.

## What the Bill would regulate

Singapore's Ministry of Digital Development and Information introduced the Digital Infrastructure Bill for first reading in Parliament on September 8, 2026.

The proposal creates two main licensing regimes administered by the Infocomm Media Development Authority (IMDA):

1. a security and resilience regime for major foundational digital infrastructure services; and
2. an environmental sustainability regime for data-centre operations.

The two regimes target different infrastructure thresholds. That separation is important because a facility can be environmentally significant without being systemically important to Singapore's digital services, and vice versa.

## Major cloud and data-centre services would face resilience duties

Under the proposed foundational digital infrastructure regime, a data-centre facility service with at least 10 MW of critical IT load that serves unrelated third parties would fall within scope.

Large cloud providers would also fall within scope when their Infrastructure-as-a-Service (IaaS) or Platform-as-a-Service (PaaS) offerings generate at least S$100 million per year on average from Singapore users over the preceding three years.

The proposed obligations include security risk management, business continuity and disaster recovery planning, and reporting specified incidents and disruptions to IMDA.

CNA reported that Singapore has about 70 data centres and that the government expects roughly two-thirds to fall within one or both licensing regimes.

## A separate regime starts at 3 MW

The environmental side of the proposal reaches more broadly.

Singapore's consultation material says data-centre operators with a critical IT load of at least 3 MW would be subject to a data-centre licensing regime focused initially on baseline environmental sustainability and energy efficiency requirements.

Power Usage Effectiveness (PUE) is one of the mechanisms expected to be used to express those requirements. The framework also leaves room for later requirements covering IT equipment and water efficiency.

That creates an unusually direct connection between digital capacity and physical resource policy.

The country has limited land, electricity and water resources. A data centre therefore becomes a policy object not only because it can fail or be attacked, but because it consumes scarce infrastructure capacity.

## The Bill is not an AI Act

The distinction is important.

Singapore is not using this Bill to decide whether a particular AI model is safe or whether a model provider may train a particular system. Instead, it is regulating the infrastructure that provides compute, storage, connectivity and operational continuity for digital services.

That makes the Bill relevant to AI without being an AI-model law.

The architecture can be represented as:

```text
AI models / applications
          │
          ↓
cloud compute + platforms
          │
          ↓
data centres + power + cooling
          │
          ↓
physical and digital infrastructure policy
```

The proposed legislation is primarily aimed at the bottom two layers.

## Why incident reporting is part of infrastructure regulation

The Bill's resilience regime does not define security only as cybersecurity.

The MDDI says the framework is intended to address operational risks including technical failures, power and cooling problems, fires, and other physical or operational incidents that can interrupt digital services.

That is a useful policy distinction. A cloud service can be unavailable without being hacked, and a data centre can remain digitally uncompromised while still failing as infrastructure.

The Bill therefore treats resilience as a broader systems property.

This is increasingly relevant to AI infrastructure because large model workloads concentrate enormous compute demand in relatively small numbers of facilities. The Observatory's earlier analysis of [AI data centres as flexible grid loads](/blog/ai-data-centers-flexible-grid-loads) covers the energy-system side of that concentration.

## The consultation changed the implementation approach

The Bill followed a public consultation conducted by MDDI and IMDA from July 1 to July 22, 2026. The government says it received feedback from 25 respondents, including data-centre operators, cloud providers, consultants and industry associations.

The September proposal says licensing and reporting processes will be streamlined where possible, existing standards will be recognized where appropriate, and existing facilities will receive transition time.

That matters because regulation of infrastructure has a different implementation problem from regulation of a new software service. Data centres have long-lived physical assets, and changing power, cooling or operational systems can require capital expenditure and engineering work.

## The security regime complements the Cybersecurity Act

The Bill does not replace Singapore's existing Cybersecurity Act.

Instead, the government describes it as covering a broader range of operational resilience risks for major digital infrastructure services.

That produces a layered regulatory model:

| Layer | Existing / proposed role |
| --- | --- |
| Cybersecurity Act | Cybersecurity requirements for designated critical systems |
| Digital Infrastructure Bill | Broader security, resilience and operational continuity for defined major infrastructure |
| DC sustainability regime | Energy-efficiency and environmental requirements for data centres |

The exact boundaries will depend on the final legislation and subsequent codes of practice.

## Why the thresholds matter

Threshold-based regulation avoids treating every cloud service or server room as nationally significant.

The proposed 10 MW / third-party criterion for major data-centre facility services focuses the resilience regime on large facilities whose disruption could affect other organizations.

The S$100 million cloud-revenue threshold uses a different proxy: economic significance to Singapore users.

The 3 MW sustainability threshold is lower because the policy objective is different. Environmental resource consumption can become material before a facility becomes systemically critical to national digital services.

In other words, **the Bill uses different definitions of "important" for security and sustainability.**

That is more precise than applying one blanket definition of critical infrastructure.

## What operators should watch next

The September 8 first reading is not the end of the policy process.

The government still needs to progress the Bill through Parliament, and many technical requirements are expected to be specified later through regulations, standards, and codes of practice.

That means operators should not treat the proposed thresholds as a complete compliance checklist yet.

The useful near-term questions are:

- Which existing facilities will be licensed?
- What evidence will satisfy security-risk-management requirements?
- How will incident reporting timelines be defined?
- Which PUE requirements will apply to existing versus new facilities?
- How much transition time will operators receive?
- How will the regime interact with existing cybersecurity and energy-efficiency standards?

## Why this matters for AI infrastructure

AI increases the strategic importance of compute infrastructure, but compute is still physical infrastructure.

The same data centre can simultaneously be:

- an AI compute facility;
- a major electricity consumer;
- a cloud or colocation service;
- a cybersecurity target;
- a business-continuity dependency; and
- a long-lived physical asset.

Singapore's Bill is notable because it tries to regulate several of those properties through the infrastructure layer instead of creating a single AI-specific statute.

That approach could become a useful template for jurisdictions that want stronger oversight of AI infrastructure without attempting to regulate every model or application directly.

## What is still uncertain

The Bill has only had its first reading and is not yet enacted law. The final legislative text, implementation dates, detailed codes of practice, reporting rules, and technical efficiency thresholds can change.

The proposed licensing thresholds should therefore be read as the current legislative design, not as final obligations.

The environmental requirements also cannot be reduced to one PUE number from the announcement. The detailed technical standards will determine the actual operational burden.

## Why this is meaningfully new

The Observatory already tracks the physical and energy consequences of AI data centres. This Bill adds a different layer: **Singapore is proposing to turn major cloud and data-centre operations themselves into licensed digital infrastructure, with resilience and sustainability as explicit regulatory properties.**

The result is a policy model in which AI infrastructure can be governed without directly governing AI models.

## Limitations

This article is based on the September 8, 2026 first-reading materials and independent reporting. Because the Bill is not yet enacted, the article deliberately avoids treating proposed thresholds or future codes of practice as final law.

## Sources and further reading

- [MDDI — Digital Infrastructure Bill](https://www.mddi.gov.sg/newsroom/new-digital-infrastructure-bill-to-strengthen-the-foundations-for-singapores-digital-economy/)
- [Singapore REACH — consultation material](https://www.reach.gov.sg/latest-happenings/public-consultation-pages/2026/public-consultation-on-digital-infrastructure-bill/)
- [CNA — proposed licensing regimes](https://www.channelnewsasia.com/singapore/bill-security-sustainability-data-centres-cloud-services-parliament-6367201)
- [The Business Times — first reading](https://www.businesstimes.com.sg/companies-markets/singapore-tables-digital-infrastructure-bill-resilience-cloud-data-centres)
