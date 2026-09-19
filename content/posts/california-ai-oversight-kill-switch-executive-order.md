---
title: "California's New AI Order Turns Independent Oversight and Emergency Shutdowns Into a Policy Test"
description: "California's September 18, 2026 executive order accelerates independent AI oversight and asks experts to assess emergency shutoff mechanisms for frontier models."
excerpt: "California is moving from creating an AI-auditor framework to testing how independent verification and emergency controls could work in practice."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI Governance
tags:
  - AI governance
  - California
  - AI safety
  - independent evaluation
  - frontier AI
  - regulation
author: Digital Observatory
authorRole: AI Governance & Policy
featured: false
coverImage: ""
coverAlt: "Independent AI oversight workflow with audit, verification, and emergency shutdown controls"
keywords:
  - California AI executive order September 2026
  - California AI kill switch
  - independent AI auditors
  - frontier AI oversight
  - SB 813 AB 1405
canonicalUrl: "https://observatory.campusloop.space/blog/california-ai-oversight-kill-switch-executive-order"
noIndex: false
sources:
  - label: "Governor of California — Executive order on independent AI oversight and emergency shutoff mechanisms"
    url: "https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/"
    note: "Primary September 18, 2026 announcement."
  - label: "Governor of California — SB 813 and AB 1405 signed"
    url: "https://www.gov.ca.gov/2026/09/09/governor-newsom-signs-first-in-the-nation-ai-safeguards-to-protect-californians-calls-on-the-federal-government-to-do-its-part/"
    note: "Primary background on California's independent AI verification framework."
  - label: "The Verge — California AI kill switch proposal"
    url: "https://www.theverge.com/policy/997516/california-governor-newsom-ai-kill-switch"
    note: "Independent September 18, 2026 coverage."
  - label: "The Washington Post — California governor signs order pushing for an AI kill switch"
    url: "https://www.washingtonpost.com/politics/2026/09/18/california-gov-gavin-newsom-ai-executive-order/"
    note: "Independent reporting on the order and expert review."
---

**California's September 18, 2026 executive order does not immediately create a mandatory AI kill switch. It starts a policy and technical process for deciding how independent oversight, emergency shutdowns, and incident reporting should work for frontier AI systems.**

The order accelerates implementation of California's new independent-verification laws and asks a group of experts to produce recommendations within two months. The governor's office also asks agencies to consider embedding independent verification organizations inside frontier AI companies and independently verifying safety frameworks, transparency reports, risk assessments, and the effectiveness of an emergency shutoff.

## What changed on September 18

Governor Gavin Newsom directed California agencies to accelerate implementation of Senate Bill 813 and Assembly Bill 1405, which were signed on September 9. SB 813 created a framework for independent verification organizations that can assess AI systems and models for safety and risk. AB 1405 created a registry for AI auditors and standards for their independence, transparency, and integrity.

The new order asks experts to consider four additional directions:

- embedding a designated independent verification organization inside frontier AI companies;
- having independent organizations verify safety frameworks, transparency reports, and risk assessments;
- advancing an emergency shutoff, or "kill switch," for frontier models and independently checking its effectiveness;
- expanding critical-incident definitions to include loss-of-control events.

The primary sources are the [September 18 executive-order announcement](https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/) and the [September 9 legislation announcement](https://www.gov.ca.gov/2026/09/09/governor-newsom-signs-first-in-the-nation-ai-safeguards-to-protect-californians-calls-on-the-federal-government-to-do-its-part/).

## The important shift is from rules to verification

California already had AI rules before this order. The September 9 legislation created the institutional machinery for independent verification. The September 18 order is about making that machinery operational and considering how far it should extend.

That creates three different layers:

**Law** defines obligations and creates legal authority.

**Verification** tests whether a developer's safety claims and controls meet the relevant standards.

**Emergency response** asks whether a frontier system can be reliably disabled when a serious loss-of-control event occurs.

Those layers should not be collapsed into one generic "AI regulation" label. They solve different problems.

## A kill switch is only useful if it is technically real

The interesting engineering question is not whether a button exists. It is whether an emergency mechanism can reliably stop the relevant system under realistic failure conditions.

A useful control would have to answer questions such as:

- What is actually being shut down: a model endpoint, an agent, a training run, or a deployment?
- Who is authorized to activate it?
- Can the system continue through another provider, account, or already-running worker?
- Does the control work when a model has external tools and long-running jobs?
- How quickly does it take effect?
- What happens to in-flight operations?
- How is the control tested without creating a new production risk?

California's order does not answer those questions. It asks experts to work toward recommendations and calls for ongoing independent verification of the switch's efficacy.

That uncertainty is important: the order establishes a **policy test**, not a proven universal technical mechanism.

## Independent auditors change the trust model

California's new laws are more than a compliance checklist. They create an external actor whose job is to evaluate claims made by an AI developer.

The hard part is access.

An evaluator needs enough visibility into model evaluations, safety systems, deployment controls, logs, and incidents to verify a claim. Too little access produces a ceremonial audit. Too much access creates confidentiality, security, and intellectual-property problems.

The proposal to embed evaluators therefore creates a governance question: **how can an evaluator remain independent while operating with employee-like access?**

That question is appearing inside the industry too. On September 18, Anthropic announced an embedded-evaluation partnership with Accenture's Faculty unit. The team will evaluate and red-team models, conduct alignment assessments, and test safeguards. Anthropic and Accenture each expect to invest at least $1 billion over five years.

The California policy and Anthropic partnership are separate. The useful connection is that both make deeper independent access part of the safety model.

## Loss of control is becoming a policy category

The order also proposes adding loss-of-control incidents to California's critical-safety framework.

That matters because conventional software regulation tends to organize around vulnerabilities, privacy incidents, harmful outputs, or other familiar failure categories. A loss-of-control event can instead involve an AI system with tools, credentials, persistence, or autonomy behaving outside its intended operational boundary.

The Observatory recently examined a related measurement problem in [OpenAI's New Misalignment Framework](/blog/openai-misalignment-disclosure-framework), which turns unexpected model behavior into a recurring disclosure category.

California's proposal adds a regulatory layer to that same observation problem.

## What this does not mean yet

Several conclusions would be premature.

**California has not proved that a universal AI kill switch is feasible.** The order asks experts to assess and advance the concept; it does not publish a validated technical design.

**Independent oversight is not automatically independent in practice.** Its effectiveness depends on access, authority, funding, conflict-of-interest rules, and the ability to report meaningful findings.

**The order is not a national AI standard.** Newsom is calling for federal adoption of California's framework, but that is a policy objective rather than a federal requirement. Independent reporting from [The Verge](https://www.theverge.com/policy/997516/california-governor-newsom-ai-kill-switch) and [The Washington Post](https://www.washingtonpost.com/politics/2026/09/18/california-gov-gavin-newsom-ai-executive-order/) likewise describes the order as a state-level initiative.

## What to watch next

The next meaningful signal is the expert guide promised within two months.

A strong implementation would produce testable definitions: what counts as a frontier model, what an independent verifier must inspect, what constitutes a loss-of-control incident, how an emergency shutoff is tested, and what evidence is sufficient to establish that the control works.

A weaker implementation would produce broad principles without measurable requirements.

For developers, the practical implication is to expect more explicit evidence around AI safety controls, not simply more policy documents.

## Why this is meaningfully new

The Observatory already covers AI crawling policy and model-misalignment reporting. This development is different because California is creating a **state-backed verification layer** around frontier AI companies and explicitly considering emergency operational controls.

The durable signal is institutional: AI safety is moving toward a model where safety claims may be independently checked, and where emergency controls may themselves become auditable systems.

That direction is not standardized yet. California's September 18 order nevertheless gives it a concrete policy timeline and a testable next step.

## Sources and further reading

- [California executive order](https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/)
- [California SB 813 and AB 1405](https://www.gov.ca.gov/2026/09/09/governor-newsom-signs-first-in-the-nation-ai-safeguards-to-protect-californians-calls-on-the-federal-government-to-do-its-part/)
- [The Verge](https://www.theverge.com/policy/997516/california-governor-newsom-ai-kill-switch)
- [The Washington Post](https://www.washingtonpost.com/politics/2026/09/18/california-gov-gavin-newsom-ai-executive-order/)
