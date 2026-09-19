---
title: "GitHub's New Copilot Engagement Metric Measures Repeat Use, Not Productivity"
description: "GitHub's September 17, 2026 Copilot metrics update adds feature-level engagement to enterprise and organization reports, using a rolling 28-day window and a two-day repeat-use threshold."
excerpt: "The new metric answers a narrower question than productivity: which Copilot features developers repeatedly use. That makes it more useful than a seat count, but it still cannot establish that AI made developers faster or better."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Developer Systems
tags:
  - GitHub Copilot
  - developer metrics
  - AI adoption
  - engineering analytics
  - GitHub API
  - developer productivity
author: Digital Observatory
authorRole: Developer Systems Research
featured: false
coverImage: ""
coverAlt: "GitHub Copilot feature engagement dashboard separating repeated use across coding and agent workflows"
keywords:
  - GitHub Copilot feature engagement September 2026
  - copilot_feature_engagement API
  - GitHub Copilot usage metrics
  - AI coding adoption metrics
  - Copilot impact dashboard
canonicalUrl: "https://observatory.campusloop.space/blog/github-copilot-feature-engagement-metrics"
noIndex: false
sources:
  - label: "GitHub Changelog — Copilot impact dashboard now shows feature engagement"
    url: "https://github.blog/changelog/2026-09-17-copilot-impact-dashboard-now-shows-feature-engagement/"
    note: "Primary September 17, 2026 announcement describing the dashboard and new aggregate reporting fields."
  - label: "GitHub Enterprise Cloud Docs — Data available in Copilot usage metrics"
    url: "https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/copilot-usage-metrics/copilot-usage-metrics"
    note: "Primary API documentation defining the 28-day window, feature fields, overlap rules and limitations."
  - label: "WorkAI.TV — Copilot impact dashboard feature engagement analysis"
    url: "https://workai.tv/2026/09/ai-engineering/copilot-impact-dashboard-now-shows-feature-engagement/"
    note: "Independent analysis of the practical distinction between active users and feature-level adoption."
---

**GitHub's September 17, 2026 Copilot metrics update adds a rolling 28-day feature-engagement measure for enterprise and organization reports, counting a user as engaged with a feature only when they used it on at least two days in that window.** The new data covers code completion, agent edit, passive and active code review, cloud agent, Copilot CLI and the Copilot app.

The important distinction is that this measures **repeat feature use**, not developer productivity, code quality or return on investment. GitHub's own API documentation makes the metric precise enough to use as an adoption signal while leaving those larger questions unanswered.

## What GitHub added

GitHub's Copilot impact dashboard now reports feature-level engagement alongside aggregate adoption data. The same breakdown is available through enterprise and organization 28-day aggregate reports via the `copilot_feature_engagement` object.

The initial feature set contains seven entries:

| Feature | What the metric represents |
| --- | --- |
| Code completion | Repeat engagement with code completion |
| Agent edit | Repeat engagement with agent edits |
| Passive code review | Copilot reviews assigned without a manual request |
| Active code review | Reviews explicitly requested or acted on by the user |
| Cloud agent | Repeat use of the Copilot cloud agent |
| Copilot CLI | Repeat use of the command-line interface |
| Copilot app | Repeat use of the GitHub Copilot app |

GitHub defines an engaged user as someone who used the feature on at least two distinct days in the inclusive 28-day window.

## Why the two-day threshold matters

A seat count answers whether someone has access. A daily active-user count answers whether someone used the product on a particular day. The new engagement measure answers a narrower question: **did the user return to this feature at least once after first using it during the 28-day period?**

That makes it useful for detecting repeated adoption, but it should not be described as a retention metric in the stronger product-analytics sense.

Two days in 28 does not tell us how often a person used the feature, how long they used it, whether the output was accepted, or whether it improved the result.

## The counts overlap

GitHub explicitly warns that users can be counted under more than one feature. Therefore, adding the seven `engaged_user_count` values does not produce a total number of engaged users.

For example, a developer who uses code completion and Copilot CLI can contribute to both feature counts while remaining one person in the active-user population.

This matters when organizations compare the numbers with license counts or try to calculate percentages. The denominator must match the report definition rather than the sum of feature rows.

## The 28-day adoption population also changed

The same update adds `users_in_phase_28d` to aggregate AI adoption-phase reporting. GitHub says this field represents the full rolling 28-day population classified into an adoption phase as of the report day.

That differs from `total_engaged_users`, which counts users in the phase who were active on that individual day.

The distinction is important for trend analysis:

```text
Daily active population
        ≠
Rolling 28-day phase population
```

Using the daily count as the denominator for a 28-day rate can make adoption calculations unstable or misleading. GitHub's documentation specifically recommends using the rolling population when calculating 28-day phase-level rates.

## This is different from a productivity measurement

The Observatory's methodology separates measurement from interpretation. That distinction is especially important here.

**Observed:** GitHub reports how many users engaged with each feature under its defined threshold.

**Calculated:** An organization can calculate a feature-engagement rate if it chooses an appropriate denominator.

**Interpretation:** A higher engagement rate may indicate that a feature has become part of more developers' workflows.

**Not established:** The metric does not by itself prove higher productivity, faster delivery, better code, or a positive return on investment.

Those outcomes require different evidence.

## Why active and passive code review should not be merged

GitHub separates passive and active Copilot code review in the feature taxonomy.

Passive review means Copilot was automatically assigned to review a pull request without the developer actively requesting the review. Active review means the developer deliberately requested Copilot's review or applied a review suggestion.

Those behaviors can have very different meanings for adoption analysis. Passive assignment can indicate organizational configuration; active review is stronger evidence that a developer deliberately used the capability.

Keeping the categories separate makes the metric more informative than a single “code review users” number.

## How this extends the Observatory's Copilot coverage

Digital Observatory recently covered [GitHub's October Copilot model retirements](/blog/github-copilot-october-2026-model-deprecations), which examined model lifecycle as a maintenance dependency.

This update addresses a different layer: **measurement of how developers actually use the product**.

It also complements the Observatory's methodology because the API exposes explicit definitions, a collection window and caveats rather than one opaque adoption score.

## What engineering leaders can use it for

The metric is most defensible for questions such as:

- Which Copilot features are repeatedly used across the organization?
- Are agent-oriented features being adopted beyond basic code completion?
- Which capabilities may need training or configuration work?
- Is feature usage changing over successive 28-day reporting windows?

It is less defensible for questions such as:

- Did Copilot make developers 20% more productive?
- Did the tool improve code quality?
- Is one model better for engineering outcomes?
- Did increased feature engagement create financial ROI?

Those require separate measurements.

## API limitations to keep visible

GitHub says feature engagement is available in enterprise and organization 28-day aggregate reports and is not added to user-level reports. A user can appear under multiple features.

The `copilot_feature_engagement` object can also be absent or null when the calculation is unavailable. The documentation says the initial feature set does not include Copilot Chat or VS Code Agent in this object, and that Copilot Chat is planned for a later release after additional data collection.

These are not minor implementation details. They define what can and cannot be inferred from the dataset.

## Why this matters now

GitHub is moving Copilot analytics from “how many people use AI coding assistance?” toward a more granular question: **which AI-assisted workflows are becoming recurring behavior?**

That is a meaningful measurement improvement because feature-level engagement can distinguish broad product access from repeated use. But the metric should remain what it is: **an adoption and behavior signal, not a productivity score**.

For engineering organizations, the most useful next step is to pair it with outcome measurements such as cycle time, review latency, defect rates, developer surveys and task-level evaluations rather than treating Copilot engagement as an outcome by itself.

## Sources and further reading

- [GitHub Changelog — Copilot impact dashboard now shows feature engagement](https://github.blog/changelog/2026-09-17-copilot-impact-dashboard-now-shows-feature-engagement/)
- [GitHub Enterprise Cloud Docs — Data available in Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/copilot-usage-metrics/copilot-usage-metrics)
- [WorkAI.TV — Copilot impact dashboard feature engagement analysis](https://workai.tv/2026/09/ai-engineering/copilot-impact-dashboard-now-shows-feature-engagement/)
