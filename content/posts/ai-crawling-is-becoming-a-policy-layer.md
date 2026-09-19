---
title: "AI Crawling Is Becoming a Policy Layer, Not Just a robots.txt Setting"
description: "Cloudflare's September 15, 2026 AI-crawling controls, alongside Google, Bing, and an active IETF standardization effort, show the web moving toward explicit preferences for search, training, and agent access."
excerpt: "The important change is not another AI crawler blocklist. Search, model training, and user-directed agents are increasingly being treated as different forms of web access with different permissions."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Internet Infrastructure
tags:
  - AI crawlers
  - web infrastructure
  - robots.txt
  - AI training
  - search
  - AI agents
  - web standards
author: Digital Observatory
authorRole: Internet Infrastructure & AI Ecosystems
featured: true
coverImage: ""
coverAlt: "Web content passing through separate policy gates for search, AI training, and user-directed agents"
keywords:
  - AI crawler controls
  - AI training opt out
  - robots.txt AI crawlers
  - Cloudflare AI crawler controls
  - AI search crawling
  - IETF AI Preferences
  - AI agent web access
canonicalUrl: "https://digital-observatory.dev/blog/ai-crawling-is-becoming-a-policy-layer"
noIndex: false
sources:
  - label: "Cloudflare — Have it both ways: stay discoverable in search while disallowing AI training"
    url: "https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/"
    note: "September 15, 2026 primary announcement of Disallow AI Training, the Accountable designation, crawler transparency requirements, and Cloudflare's measurements of mixed-use crawler traffic."
  - label: "Cloudflare — Your site, your rules: new AI traffic options for all customers"
    url: "https://blog.cloudflare.com/content-independence-day-ai-options/"
    note: "Cloudflare's July 2026 policy announcement describing separate Search, Agent, and Training classifications and the September 15 default-setting change."
  - label: "Cloudflare — Say it once: introducing Bot Preference Sync"
    url: "https://blog.cloudflare.com/bot-preference-sync/"
    note: "Cloudflare's August 2026 description of synchronizing site AI-crawling preferences with robots.txt and its BotBase crawler classification."
  - label: "IETF AI Preferences Working Group"
    url: "https://datatracker.ietf.org/group/aipref/"
    note: "Current IETF working-group status showing an active standards-track vocabulary draft and related work on expressing AI usage preferences."
  - label: "IETF — A Vocabulary For Expressing AI Usage Preferences"
    url: "https://datatracker.ietf.org/doc/html/draft-ietf-aipref-vocab"
    note: "Active Internet-Draft draft-ietf-aipref-vocab-06, published April 28, 2026, defining vocabulary for restrictions or permissions on digital assets used by automated systems."
  - label: "Google — Common crawlers and fetchers"
    url: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
    note: "Current Google documentation describing Google-Extended as a robots.txt token for controlling certain Gemini training and grounding uses without affecting Google Search inclusion."
  - label: "Bing Webmaster Blog — AI Performance in Bing Webmaster Tools"
    url: "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview"
    note: "Microsoft's February 2026 description of AI citation visibility and its statement that Bing respects robots.txt and other supported content-owner controls."
  - label: "TechNode — Cloudflare separates search and AI training controls"
    url: "https://technode.global/2026/09/16/cloudflare-search-ai-training-controls/"
    note: "Independent September 16, 2026 reporting that contextualizes Cloudflare's separation of Search, Training, and Agent controls and notes the platform-specific limits."
---

**AI crawling is becoming a policy layer rather than a single robots.txt decision.** Cloudflare's September 15, 2026 rollout separates website-owner controls for search, AI training, and user-directed AI agents, while Google already exposes a distinct `Google-Extended` control and the IETF is developing a standards-track vocabulary for expressing AI usage preferences. urlCloudflare's September 15 announcementhttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/ urlIETF AI Preferences working grouphttps://datatracker.ietf.org/group/aipref/

The durable signal is not that one provider shipped another crawler toggle. It is that **the web is starting to distinguish why an automated system accesses a page**. Search indexing, model training, and an agent retrieving information for a user can involve the same URL but have different economic and governance implications.

## What changed on September 15, 2026

Cloudflare replaced its broad AI-bot control model with separate controls for **Search**, **Training**, and **Agent** traffic. For new domains, its recommended settings now vary according to whether pages carry advertising. Cloudflare also introduced a **Disallow AI Training** setting intended to let publishers refuse training while remaining available to search crawlers that meet its transparency requirements. urlCloudflare's AI crawling announcementhttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

The distinction matters because a crawler can be used for more than one purpose. Cloudflare says mixed-use crawlers represented **36.6% of verified crawler traffic on its network** in the data behind its announcement. It also reports that fewer than 1% of its sites block search crawlers while 17% use some mechanism to restrict AI training. Those figures describe Cloudflare's observed network, not the entire Internet. urlCloudflare's announcement and measurementshttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

Cloudflare's new **Accountable** designation is aimed at the mixed-use problem. Its stated criteria include a training opt-out, a mechanism for opting out of AI summaries, URL-level visibility into use, and assurance that refusing training does not affect traditional search. Cloudflare says Apple, Google, and Microsoft meet the criteria or have made time-bound commitments to do so. urlCloudflare's Accountable criteriahttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

## Why one “AI bot” switch is becoming inadequate

A useful way to model the old problem is:

```text
website
  ↓
one crawler identity
  ├── search indexing
  └── AI training
```

If a publisher blocks the crawler to stop training, search visibility can disappear with it.

The newer model is closer to:

```text
website
  ↓
access policy
  ├── Search
  ├── AI Training
  └── AI Agent
```

Those categories are not interchangeable.

**Search** generally exists to help a person discover a page. **Training** uses content as input to model development. **Agents** can retrieve content while acting on a user's request in real time. A publisher may reasonably want different permissions for each even when the same underlying page is involved.

Cloudflare's July 2026 announcement had already established these three classifications; the September release makes the distinction operational for site owners and adds a transparency framework for mixed-use crawlers. urlCloudflare's July AI traffic controls announcementhttps://blog.cloudflare.com/content-independence-day-ai-options/

## Google shows why the distinction is technically possible

Google's current crawling documentation describes **Google-Extended** as a standalone robots.txt product token. It can be used to control certain uses of content crawled by Google for Gemini model training and grounding without affecting a site's inclusion in Google Search. urlGoogle's crawler documentationhttps://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers

That is an important precedent.

The technical question is not simply whether a crawler can be blocked. It is whether the operator can expose a **purpose-specific control** that does not unnecessarily disable other services.

Cloudflare's new controls extend that idea at the network-policy layer: a site owner can express different preferences and, where Cloudflare can identify and enforce the traffic class, have those preferences applied at the edge. urlCloudflare's AI traffic controlshttps://blog.cloudflare.com/content-independence-day-ai-options/

## Robots.txt remains useful, but it is not enforcement by itself

This shift does not make `robots.txt` obsolete.

Cloudflare's **Bot Preference Sync** is explicitly designed to translate site-level Search, Agent, and Training preferences into robots.txt directives while preserving existing rules. Cloudflare says new customers will have the synchronization enabled by default, subject to the product's configuration and crawler classifications. urlCloudflare's Bot Preference Sync announcementhttps://blog.cloudflare.com/bot-preference-sync/

But robots.txt is still a preference signal. It depends on crawler compliance.

Cloudflare makes the distinction explicit: a network provider can identify crawler behavior and block traffic that does not respect a site's preference. That gives the policy an enforcement layer that a text file alone cannot provide. urlCloudflare's September 15 announcementhttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

This creates two separate questions for a publisher:

1. **What do I want automated systems to be allowed to do?**
2. **Which infrastructure can actually enforce that preference?**

They are related, but they are not the same problem.

## The standards layer is catching up

The most important reason to treat this as more than a Cloudflare product story is the parallel standards work.

The IETF's **AI Preferences Working Group** currently lists `draft-ietf-aipref-vocab-06` as an active standards-track Internet-Draft. The draft defines vocabulary for expressing restrictions or permissions around how digital assets are used by automated processing systems. urlIETF AI Preferences working grouphttps://datatracker.ietf.org/group/aipref/ urlIETF AI Preferences vocabulary drafthttps://datatracker.ietf.org/doc/html/draft-ietf-aipref-vocab

That is not a finished Internet standard. The document remains an Internet-Draft and can change before any eventual standardization.

But its existence changes the interpretation of today's product announcements. Cloudflare, Google, Microsoft, and standards participants are converging on the same underlying problem: **web publishers need machine-readable ways to distinguish permitted uses of their content.**

The exact syntax, semantics, enforcement model, and scope are still unsettled.

## Bing adds another piece: measuring AI visibility

Microsoft's Bing Webmaster Tools has already moved in the opposite direction from pure blocking: its **AI Performance** preview gives publishers information about how their pages are cited in AI-generated answers, including citation counts, cited pages, and sampled grounding queries. Bing says the metrics describe citation activity rather than ranking or authority, and that it respects robots.txt and other supported content-owner preferences. urlBing AI Performance documentationhttps://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview

Put together, these developments describe a more complete control loop:

```text
publisher preference
        ↓
crawler policy
        ↓
access / exclusion
        ↓
AI or search use
        ↓
visibility / citation measurement
        ↓
publisher adjusts policy
```

That is much closer to an **Internet governance interface** than a simple crawler blacklist.

## The economic question is changing too

The traditional search relationship is relatively easy to describe: a crawler discovers a page, an index stores information about it, and a search result can send a visitor back to the publisher.

AI systems introduce other outcomes. A page may be used to train a model, summarized directly in an answer, retrieved by an agent, or cited with a link.

Those outcomes do not have identical value to the publisher.

Cloudflare's approach explicitly treats them as separate categories and says it wants URL-level visibility into how mixed-use crawlers use content. Its stated longer-term goal is to give site owners more granular control over how much content appears in AI summaries. That future control is a stated goal, not a capability established by the September 15 release. urlCloudflare's announcementhttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

The important analytical point is that **access is becoming multidimensional**. “The bot visited my page” is no longer enough information to describe what happened.

## What website owners should watch

The evidence supports a few practical questions for publishers and developers.

### Separate your intended uses

Decide whether your default position differs for search indexing, AI training, and user-directed agents. A single “block AI” policy may be unnecessarily broad.

### Treat crawler identity and crawler purpose separately

A crawler's name does not necessarily tell you every purpose it serves. Cloudflare's mixed-use crawler work demonstrates why purpose classification matters. urlCloudflare's Accountable crawler frameworkhttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

### Keep machine-readable preferences aligned

If you use robots.txt or another policy mechanism, keep it consistent with the access rules enforced by your infrastructure. Cloudflare's Bot Preference Sync is one implementation of that principle; it is not a universal standard. urlCloudflare's Bot Preference Sync documentationhttps://blog.cloudflare.com/bot-preference-sync/

### Measure the trade-off

A training opt-out may have no direct search effect for a crawler that supports purpose-specific controls, while blocking a mixed-use crawler can have a search-discovery cost. The correct choice depends on the publisher's goals and the behavior of each crawler operator.

### Watch the IETF work before betting on one syntax

The AI Preferences vocabulary is still a draft. Publishers should not treat today's draft vocabulary as a guaranteed permanent interface. urlIETF AI Preferences working grouphttps://datatracker.ietf.org/group/aipref/

## What the evidence does—and does not—prove

**Observed:** Cloudflare launched separate Search, Training, and Agent controls and a Disallow AI Training setting on September 15, 2026. It also introduced an Accountable designation for crawler operators meeting stated transparency criteria. urlCloudflare's primary announcementhttps://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/

**Documented:** Google provides a `Google-Extended` robots.txt control for certain Gemini-related content uses without changing Google Search inclusion, while Bing provides AI citation-performance measurements and says it respects supported publisher controls. urlGoogle crawler documentationhttps://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers urlBing AI Performance documentationhttps://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview

**Standards signal:** The IETF AI Preferences Working Group has an active standards-track vocabulary draft. It is not yet a final Internet standard. urlIETF AI Preferences vocabulary drafthttps://datatracker.ietf.org/doc/html/draft-ietf-aipref-vocab

**Independent confirmation:** TechNode reported on September 16, 2026 that Cloudflare's new controls separate search, training, and agent traffic, while noting that the controls remain platform-specific and that the IETF work is still under development. citeturn1news8

**Interpretation:** The strongest defensible reading is that AI access to the open web is becoming a distinct policy surface with multiple purposes, controls, and measurement needs.

**Unknown:** There is not yet a universal enforcement mechanism for the whole web. Robots.txt remains dependent on crawler compliance, Cloudflare's enforcement applies within its own network, the IETF vocabulary is still a draft, and different crawler operators may implement purpose distinctions differently.

## Why this is meaningfully new

The Observatory already tracks how public technical systems expose signals without treating any one metric as truth. This development adds a new kind of infrastructure signal: **the purpose of machine access itself is becoming observable and configurable**.

That matters because the open web is increasingly being accessed by systems that do more than index pages. Search engines, training crawlers, AI answer systems, and user-directed agents can all consume the same underlying content while creating different outcomes for publishers.

The strongest claim available today is therefore narrower than “AI is taking over the web” or “robots.txt is dead”:

> **As of September 2026, major web-infrastructure and search operators are moving toward purpose-specific controls for search, AI training, and agent access, while the IETF is developing a common vocabulary for expressing AI usage preferences.**

The unresolved question is whether those efforts converge into a portable standard that works across the web rather than a collection of provider-specific controls.

That is the signal worth watching next.

## Related Observatory observations

For the Observatory's framework for separating measured evidence from interpretation, see [Signals Are Not Truth](/blog/signals-are-not-truth). For the broader purpose of the project, see [What Is a Digital Observatory?](/blog/what-is-a-digital-observatory). For a recent example of a developer platform moving toward explicit trust boundaries, see [GitHub Actions Is Turning pull_request_target Into an Explicit Security Exception](/blog/github-actions-pull-request-target-default-block). The npm ecosystem provides a parallel example in [npm's Stage-Only Tokens Put a Human Gate Between CI and Publication](/blog/npm-stage-only-tokens-human-approval).

## Sources & further reading

The primary evidence for this observation comes from Cloudflare's September 15, 2026 product and policy announcements, Google's current crawler documentation, Microsoft's Bing Webmaster documentation, and the IETF AI Preferences working-group and vocabulary draft. TechNode provides independent reporting on the Cloudflare rollout and its platform-specific limitations.
