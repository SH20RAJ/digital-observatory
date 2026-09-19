---
title: "Quantum Computing Is Starting to Look Like a Heterogeneous Software Stack"
description: "A September 17, 2026 collaboration between France's CEA and Alice & Bob targets software that can route workloads between classical supercomputers and quantum processors through the open-source Qaptiva stack."
excerpt: "The signal is not a new quantum processor. It is the software layer deciding which workloads should run where, a familiar systems problem arriving in quantum computing."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Quantum & Computing
tags:
  - quantum computing
  - Qaptiva
  - hybrid computing
  - open source
  - supercomputing
author: Digital Observatory
authorRole: Computing Infrastructure
featured: false
coverImage: ""
coverAlt: "A hybrid classical and quantum computing workflow sharing one software scheduling layer"
keywords:
  - Qaptiva quantum software
  - CEA Alice and Bob
  - hybrid quantum classical computing
  - quantum software interoperability
canonicalUrl: "https://observatory.campusloop.space/blog/quantum-classical-software-stack-gets-an-open-source-bridge"
noIndex: false
sources:
  - label: "Reuters — CEA and Alice & Bob partnership"
    url: "https://www.reuters.com/technology/frances-cea-alice-bob-partner-on-quantum-supercomputing-software-2026-09-17/"
    note: "Independent September 17, 2026 reporting on the Qaptiva collaboration, open-source software, and hybrid classical/quantum architecture."
  - label: "CEA — Commissariat à l'énergie atomique et aux énergies alternatives"
    url: "https://www.cea.fr/"
    note: "Primary institutional source for the French public research organization and its computing programs."
---

**The September 17, 2026 CEA and Alice & Bob collaboration is really a software-stack story: quantum processors are being integrated into classical supercomputing through an open-source control layer rather than treated as isolated machines.** Reuters reports that the partnership will build on Qaptiva, open-source software developed by Bull, to coordinate classical and quantum resources. [Reuters](https://www.reuters.com/technology/frances-cea-alice-bob-partner-on-quantum-supercomputing-software-2026-09-17/)

## The difficult question is where to run each task

Quantum computing is not replacing classical computing.

The practical architecture is hybrid.

A large scientific workflow may include data preparation, simulation, optimization, and post-processing that remain classical, with only particular operations sent to a quantum processor.

That makes orchestration software a critical layer.

## Qaptiva is the bridge

The collaboration described by Reuters uses Qaptiva as a common software environment.

The goal is to make quantum devices from different providers available inside a larger classical computing workflow.

That resembles existing heterogeneous computing stacks where CPUs, GPUs, accelerators, and specialized chips share one scheduler or runtime.

## Interoperability matters more than any one chip

Quantum hardware ecosystems are still fragmented.

If applications have to be rewritten for every hardware vendor, adoption becomes expensive.

An open software layer can reduce that switching cost.

It can also give public research institutions more leverage when negotiating access to specialized hardware.

## The analogy to AI infrastructure is useful

AI infrastructure already demonstrates why software abstractions matter.

CUDA, ROCm, compiler stacks, distributed runtimes, and Kubernetes all sit between raw compute hardware and applications.

Quantum computing is reaching a similar architectural question earlier in its maturity.

## Limitations

The collaboration is an engineering program, not proof that quantum processors are ready for broad commercial workloads.

The exact workload mix, performance gains, and production timelines remain future questions.

## Observatory interpretation

The important signal is the emergence of a **hybrid scheduling layer** for quantum and classical computing.

When that layer becomes mature, the hardware itself may become less visible to application developers.

## Sources

- [Reuters — CEA and Alice & Bob](https://www.reuters.com/technology/frances-cea-alice-bob-partner-on-quantum-supercomputing-software-2026-09-17/)
- [CEA](https://www.cea.fr/)
