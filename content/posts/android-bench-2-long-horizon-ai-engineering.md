---
title: "Android Bench 2.0 Changes the Question From Code Completion to End-to-End Engineering"
description: "Google's Android Bench 2.0, released September 16, 2026, replaces mostly incremental coding tasks with long-horizon Android work, continuous scoring, and agent evaluations; the new benchmark shows how much harder reliable multi-day software delivery remains."
excerpt: "Android Bench 2.0 is a useful signal because its hardest tasks look more like real engineering projects than isolated coding exercises, and its low full-task pass rate makes that difference measurable."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI Evaluation & Developer Systems
tags:
  - Android Bench
  - AI coding agents
  - AI evaluation
  - software engineering
  - long-horizon tasks
  - Android
  - benchmarks
author: Digital Observatory
authorRole: AI Evaluation & Developer Systems
featured: false
coverImage: ""
coverAlt: "Android Bench 2.0 measuring long-horizon AI coding tasks, agent workflows and continuous completion scores"
keywords:
  - Android Bench 2.0
  - AI coding benchmark 2026
  - long-horizon coding tasks
  - AI coding agents evaluation
  - Android AI benchmark
canonicalUrl: "https://observatory.campusloop.space/blog/android-bench-2-long-horizon-ai-engineering"
noIndex: false
sources:
  - label: "Android Developers — Android Bench 2.0"
    url: "https://android-developers.googleblog.com/2026/09/android-bench-2-long-horizon-tasks.html"
    note: "Primary source for the benchmark design, long-horizon tasks, continuous scoring, agent evaluations, and reported leaderboard results."
  - label: "Android Bench — Google benchmark leaderboard"
    url: "https://developer.android.com/bench"
    note: "Benchmark destination for the published evaluation results and task-level model information."
  - label: "XenoSpectrum — Android Bench 2.0 analysis"
    url: "https://xenospectrum.com/android-bench-2-long-horizon/"
    note: "Independent analysis of the gap between full-task pass rate and continuous completion rate."
---

**Android Bench 2.0 shows that once AI coding evaluations move from small repository edits to multi-day engineering tasks, full-task success becomes much harder to achieve: Google's September 2026 long-horizon suite reports a highest pass rate of about 28%, versus about 91% on its earlier task set.** The change is important because the benchmark is no longer mainly asking whether a model can make a local code change; it is asking whether an AI model or agent can carry a larger engineering task through architecture, implementation, validation and regression avoidance.

## What changed in Android Bench 2.0

Google released Android Bench 2.0 on September 16, 2026. The new version introduces long-horizon tasks designed around work that can take a human engineer multiple days or even a week.

The task types include upgrading dependencies, adding substantial features, building applications from scratch and converting cross-platform applications to Android. Google also added agentic evaluations, initially pairing models with agents from their respective providers.

That is a meaningful change in the unit of measurement.

An incremental benchmark can isolate a coding skill. A long-horizon benchmark tests a chain of decisions in which an early architectural choice can create failures much later.

## Pass rate and completion rate answer different questions

Google says binary pass/fail grading is inadequate for long tasks. An agent can complete most of a substantial refactor yet fail one critical assertion. A binary score treats that run as a total failure even when the system demonstrates useful engineering capability.

Android Bench 2.0 therefore adds continuous completion scoring based on factors including functionality, visual fidelity and regression avoidance, with penalties for violating evaluation instructions or structural constraints.

The distinction can be represented simply:

```text
full-task pass
    = did the run satisfy the benchmark's complete acceptance criteria?

completion score
    = how much of the evaluated work was completed successfully?
```

Those are not interchangeable metrics. A model can have a high completion score while still failing to deliver a production-ready task end to end.

Independent analysis of the initial results highlights this gap: the leading GPT-6 Astra/Codex configuration reportedly reached about 82.2% weighted completion while its full-task pass rate remained 28%. The exact calculation is specific to Google's scoring system and should not be treated as a universal measure of software-engineering ability.

## The benchmark is testing architecture, not just code generation

Google's own observations are especially useful here. Models generally perform better when writing new code than when refactoring existing systems. Deterministic transformations such as Java-to-Kotlin conversion can work well across large codebases, while migrations become harder when framework behavior, runtime validation or architectural dependencies matter.

That difference exposes a limitation of simple coding benchmarks.

A model can know the syntax of a migration and still fail because it cannot reliably reason about the state of the application after the migration. Long-horizon work creates more opportunities for these failures to compound.

## Why agents matter to the result

Android Bench 2.0 does not evaluate only a model in isolation. Google is also testing agent configurations, including GPT-6 Astra through Codex and Gemini 3.8 Flash through Google Antigravity.

This matters because the practical capability of an AI coding system is a property of more than the base model. Tool access, context management, compaction, execution loops, validation, retry behavior and the agent's orchestration policy can all affect whether a task reaches completion.

Google specifically notes that agent design can influence developer outcomes and that it plans to expand the benchmark to more model-and-agent combinations.

That makes the benchmark a measurement of a stack:

```text
model
  +
agent harness
  +
tools and context
  +
execution environment
  +
validation
  ↓
engineering outcome
```

The Observatory's earlier [OpenAI Agents API analysis](/blog/openai-agents-api-moves-agent-infrastructure-into-the-platform) tracks the same architectural shift from model endpoints toward managed execution infrastructure. Android Bench 2.0 provides a way to see why that layer matters: the model alone is not the whole product.

## The benchmark also changes what "good" looks like

The older task set produced much higher pass rates because it measured smaller changes. That does not make the old benchmark useless. It means the two versions answer different questions.

A useful interpretation is:

| Evaluation style | Better at measuring |
| --- | --- |
| Small incremental tasks | Local coding and bug-fixing ability |
| Long-horizon tasks | Multi-step engineering reliability |
| Binary pass/fail | End-to-end acceptance |
| Continuous scoring | Partial completion and quality dimensions |
| Model-only evaluation | Base-model capability |
| Model + agent evaluation | Capability of a practical coding stack |

This is why the headline drop from roughly 91% to 28% should not be described as a sudden collapse in AI coding ability. The task distribution changed substantially.

## What the results actually tell us

The strongest defensible conclusion is narrower: **current frontier coding systems can perform substantial portions of complex Android engineering tasks, but reliably completing the entire task remains difficult even for the leading configurations tested by Google.**

The benchmark also gives developers a more realistic way to compare tools when their work involves migrations, large feature additions or applications built from scratch.

For an engineering team, that changes the question from "Which model has the highest coding score?" to "Which model-and-agent configuration can reliably finish the class of work we actually delegate?"

## What the benchmark does not prove

Android Bench 2.0 is an Android-focused evaluation. Its results should not automatically be generalized to backend engineering, data engineering, infrastructure operations or other software domains.

The benchmark is also maintained by Google, and Google reports the methodology and leaderboard through its own evaluation infrastructure. Independent replication of the full task suite and scoring process would strengthen confidence in cross-provider comparisons.

The pass-rate and completion-rate figures are also properties of this benchmark's task set. They are not estimates of the percentage of all real-world software tasks that AI systems can complete.

## Why this is meaningfully new

The Observatory already tracks AI coding infrastructure and model lifecycle changes, but Android Bench 2.0 adds a different measurement layer: **it raises the unit of evaluation from a code change to a longer engineering outcome and explicitly includes the agent harness in the comparison.**

That makes the September 16 release more than another leaderboard update. It is evidence that AI coding evaluation is moving toward the same systems problem developers face in practice: integrating many correct local decisions into one reliable end-to-end result.

## What to watch next

1. More long-horizon benchmarks outside Android.
2. Independent reproduction of continuous scoring and visual evaluation.
3. Comparisons across the same model with different agent harnesses.
4. Whether full-task pass rates improve faster than completion scores.
5. Whether benchmark gains transfer to production software projects.

## Limitations

This article relies primarily on Google's published benchmark methodology and results, with independent analysis used as context. The benchmark is still new, its task distribution is limited, and agent configurations can change over time. The reported numbers therefore describe a specific September 2026 measurement rather than a permanent ranking of coding ability.

## Sources and further reading

- [Android Developers — Android Bench 2.0](https://android-developers.googleblog.com/2026/09/android-bench-2-long-horizon-tasks.html)
- [Android Bench leaderboard](https://developer.android.com/bench)
- [XenoSpectrum — Android Bench 2.0 analysis](https://xenospectrum.com/android-bench-2-long-horizon/)
