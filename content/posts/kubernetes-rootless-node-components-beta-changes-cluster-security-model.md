---
title: "Kubernetes 1.37 Makes Rootless Node Components a More Practical Security Model"
description: "Kubernetes 1.37 promotes KubeletInUserNamespace to Beta, allowing kubelet, CRI, CNI plugins, and kube-proxy to run as a non-root host user."
excerpt: "Rootless Kubernetes is moving beyond an experiment: v1.37 gives cluster operators a more mature option for reducing the privileges of node components."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Cloud Native Security
tags:
  - Kubernetes
  - rootless
  - container security
  - user namespaces
  - Linux
author: Digital Observatory
authorRole: Cloud Native & Security
featured: false
coverImage: ""
coverAlt: "Kubernetes node components operating inside a Linux user namespace without host root"
keywords:
  - Kubernetes rootless mode
  - KubeletInUserNamespace
  - Kubernetes 1.37 rootless
  - rootless Kubernetes security
canonicalUrl: "https://digital-observatory.dev/blog/kubernetes-rootless-node-components-beta-changes-cluster-security-model"
noIndex: false
sources:
  - label: "Kubernetes — KubeletInUserNamespace Beta"
    url: "https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/"
    note: "Primary September 4, 2026 documentation for the Beta feature and its security model."
  - label: "Kubernetes — v1.37 release"
    url: "https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/"
    note: "Primary v1.37 release context."
---

**Kubernetes 1.37's promotion of KubeletInUserNamespace to Beta turns rootless node components into a more serious production-security option.** The feature allows kubelet, the container runtime interface, CNI plugins, and kube-proxy to run as a non-root user on the host through Linux user namespaces. [Kubernetes](https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/)

## This is different from rootless Pods

Kubernetes already supports user namespaces for Pods.

KubeletInUserNamespace is different.

It changes the privilege model of the node software itself.

That matters because the node is a larger trust boundary than any single application container.

## Why node privilege matters

If a node component is compromised, host-level permissions can amplify the impact.

Reducing the component's host privileges can therefore shrink the blast radius of certain vulnerabilities.

User namespaces provide a kernel-level boundary that maps the component's internal user identity to a less privileged host identity.

## Beta does not mean turnkey

Kubernetes says the feature can move toward GA depending on feedback and adoption.

That means operators still need to test storage drivers, networking, device access, logging, and runtime integrations.

Security improvements can expose assumptions inside infrastructure that previously relied on root.

## The larger platform trend

Kubernetes is steadily moving more of its node and workload lifecycle toward explicit privilege boundaries.

Rootless node components fit into that direction.

## What the evidence supports

> **Kubernetes 1.37 gives cluster operators a more mature way to reduce node-component host privilege without requiring the entire application stack to abandon Kubernetes.**

## Sources

- [Kubernetes — KubeletInUserNamespace Beta](https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/)
- [Kubernetes v1.37](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/)
