---
title: "Kubernetes 1.37 Moves Scheduling Closer to the Workload"
description: "Kubernetes 1.37 graduates workload-aware scheduling and gang scheduling features to Beta, giving AI/ML and batch workloads more native ways to be scheduled as groups rather than isolated Pods."
excerpt: "The important Kubernetes 1.37 scheduling change is architectural: the scheduler can reason about a workload's shape, not only each Pod in isolation."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Cloud & Developer Infrastructure
tags:
  - Kubernetes
  - scheduling
  - AI infrastructure
  - batch workloads
  - gang scheduling
author: Digital Observatory
authorRole: Cloud Native & Developer Infrastructure
featured: false
coverImage: ""
coverAlt: "A Kubernetes workload represented as a coordinated group of Pods moving through a scheduler"
keywords:
  - Kubernetes 1.37 workload aware scheduling
  - Kubernetes gang scheduling
  - workload aware preemption
  - AI ML Kubernetes scheduling
  - Kubernetes CompositePodGroup
canonicalUrl: "https://digital-observatory.dev/blog/kubernetes-137-workload-aware-scheduling"
noIndex: false
sources:
  - label: "Kubernetes Blog — Kubernetes v1.37: Advancing Workload-Aware Scheduling"
    url: "https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/"
    note: "Primary September 8, 2026 explanation of Workload and PodGroup APIs, gang scheduling, workload-aware preemption, CompositePodGroup, and controller integration."
  - label: "Kubernetes Blog — Kubernetes v1.37 Release"
    url: "https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/"
    note: "Primary release overview describing the broader v1.37 feature set and the graduation of gang scheduling to Beta."
  - label: "Kubernetes — HPA scale-to-zero in v1.37"
    url: "https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/"
    note: "Primary September 2, 2026 context on another v1.37 change affecting dynamic workload scheduling."
  - label: "BEX — Kubernetes 1.37 scheduling and AI workloads"
    url: "https://bex.co/blog/2026/09/12/kubernetes-1-37-scheduling-ai-workloads"
    note: "Independent practitioner context on why workload-aware scheduling matters for modern AI and batch workloads."
---

**Kubernetes 1.37 is moving the scheduler closer to thinking about workloads as groups rather than only individual Pods.** The September 8 Kubernetes update says the core Workload and PodGroup APIs, gang scheduling, workload-aware preemption, and shared DRA ResourceClaims for PodGroups have graduated to Beta, while Kubernetes 1.37 also introduces a CompositePodGroup API for more hierarchical scheduling needs. [Kubernetes](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)

That is an architectural signal for teams running AI/ML training, HPC-style jobs, and other coordinated workloads: **scheduling efficiency increasingly depends on the shape of the workload, not just the resource request of each Pod.**

## The old problem: Pods are individually schedulable

The default Kubernetes scheduler historically reasons at the Pod level.

For ordinary web workloads, that model is often fine. A Deployment can gradually place replicas as nodes become available.

Distributed training is different.

A job might need several Pods to be placed together before any of them can make useful progress. If some Pods are scheduled while others remain pending, the cluster can consume resources without actually advancing the workload.

Kubernetes describes this as one of the reasons workload-aware scheduling matters for AI/ML and other distributed workloads. [Kubernetes v1.37 release notes](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/)

## Gang scheduling changes the unit of scheduling

Kubernetes 1.37 graduates native gang-scheduling support to Beta through the Workload and PodGroup APIs.

The basic idea is simple: treat a defined group of Pods as a scheduling unit, with an all-or-nothing or minimum-count requirement rather than allowing the scheduler to place members independently.

This is useful when the workload needs coordination to start.

A training job with eight workers is a better candidate for workload-level placement than for eight unrelated scheduling decisions. The scheduling system can reason about the minimum useful group size, topology constraints, and disruption behavior.

Kubernetes 1.37 also lets a standard Job controller translate explicit scheduling configuration into the corresponding Workload and PodGroup objects. That reduces the need for every higher-level controller to invent its own translation layer. [Kubernetes](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)

## Workload-aware preemption is the other half

Preemption answers a different question: what should happen when the cluster is full?

With individual Pods, it can be possible to free resources for one Pod while leaving the rest of the workload unable to run.

Workload-aware preemption tries to make that decision at the workload level.

The goal is not simply "schedule the next Pod faster." It is to decide whether removing some existing work will actually make another workload capable of making progress.

That is a better match for distributed training and batch systems where partial placement can be nearly as bad as no placement.

## CompositePodGroup hints at the next stage

Kubernetes 1.37 also introduces CompositePodGroup, aimed at multi-level scheduling structures where one workload contains subgroups with different constraints.

This matters for heterogeneous distributed systems.

A large job can have a coordinator, workers, accelerators, and supporting services that do not all share identical resource or topology requirements. A flat "group of Pods" model can become awkward as those structures get more complex.

The CompositePodGroup work suggests Kubernetes is moving toward a hierarchical vocabulary for these cases rather than treating every scheduling requirement as an extension-specific policy.

## The feature is not "done"

The strongest limitation is feature maturity.

Kubernetes' own documentation says the Workload API, gang scheduling, and workload-aware preemption are Beta and disabled by default. The new advanced capabilities are introduced as Alpha and also require manual enablement. [Kubernetes](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)

That means this is an important direction, not a universal drop-in recommendation.

Beta still means teams should evaluate version compatibility, feature gates, controller behavior, observability, and recovery before using the feature across production fleets.

The architectural direction can be significant before the operational recommendation is "turn it on everywhere."

## Why AI workloads are pulling Kubernetes toward workload semantics

The timing is not accidental.

AI and HPC workloads have several properties that amplify scheduling problems:

- large resource footprints,
- accelerator-specific placement,
- topology sensitivity,
- coordinated startup,
- long-running jobs,
- expensive interruptions,
- and sometimes heterogeneous worker roles.

Traditional web serving is dominated by independent replicas. Distributed training is not.

As Kubernetes becomes a common substrate for those jobs, a scheduler that understands only individual Pods leaves too much semantics to custom controllers.

Workload-aware scheduling is therefore a way to move those semantics into the platform.

## v1.37 also changes autoscaling behavior

Kubernetes 1.37 includes another signal in the same direction: HPA scale-to-zero moves to Beta, allowing supported object and external metrics to drive a workload all the way to zero replicas.

That is useful for demand-driven or event-driven workloads, but it is a different problem from gang scheduling.

The connection is architectural: Kubernetes is becoming more capable of representing the full lifecycle of a workload—how it starts, how many instances it needs, how a group should be placed, and how it can scale down.

The platform is slowly moving from "keep Pods alive" toward "manage workloads."

## What this means for platform teams

The immediate lesson is not to replace every Kubernetes scheduler plugin with native v1.37 features.

A better approach is to inventory where your infrastructure already has workload-level logic.

For example:

- Which controllers already implement gang or quota semantics?
- Which jobs fail because only some workers are scheduled?
- Which AI workloads are sensitive to zone or accelerator topology?
- Which schedulers or queueing layers duplicate Kubernetes concepts?
- Which features are stable enough for your cluster version and operational model?

Those are architecture questions, not just feature-adoption questions.

Kubernetes 1.37 may reduce some custom logic, but the migration cost depends on how much a platform has already built outside the core APIs.

## What the evidence does and does not prove

**Observed:** Kubernetes 1.37 moves Workload and PodGroup APIs, gang scheduling, workload-aware preemption, and shared DRA ResourceClaims to Beta, while adding CompositePodGroup. [Primary Kubernetes source](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)

**Documented limitation:** Several of these features are still disabled by default and require manual feature-gate configuration. [Kubernetes](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)

**Context:** The release team explicitly frames these changes around AI/ML and complex batch workloads. [Kubernetes v1.37 release](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/)

**Independent interpretation:** Practitioner coverage is also connecting the release to the operational needs of modern AI workloads; such commentary should be treated as context rather than a Kubernetes guarantee.

The defensible conclusion is:

> **Kubernetes 1.37 is shifting scheduling semantics upward from individual Pods toward explicit workload groups, but most of the advanced machinery is still in Beta or Alpha and requires deliberate adoption.**

## Why this belongs in the Observatory

The Observatory's job is to notice when a platform abstraction changes.

Kubernetes is not merely adding another scheduler feature here. It is standardizing concepts that higher-level systems have repeatedly implemented themselves: group membership, coordinated placement, topology, preemption, and workload construction.

That is a useful infrastructure signal because platform primitives tend to influence entire ecosystems.

For a broader reminder about interpreting infrastructure metrics without overstating them, see [Signals Are Not Truth](/blog/signals-are-not-truth).

## Sources and further reading

- [Kubernetes v1.37: Advancing Workload-Aware Scheduling](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)
- [Kubernetes v1.37 Release](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/)
- [Kubernetes v1.37 HPA scale-to-zero](https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/)
- [BEX — Kubernetes 1.37 scheduling and AI workloads](https://bex.co/blog/2026/09/12/kubernetes-1-37-scheduling-ai-workloads)
