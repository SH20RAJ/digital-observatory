---
title: "CISA's September 18 KEV Updates Put Three Linux Kernel Flaws on a Three-Day Clock"
description: "CISA added three Linux kernel vulnerabilities to its Known Exploited Vulnerabilities catalog on September 18, 2026, with September 21 remediation deadlines for federal civilian agencies. The three flaws sit in different kernel subsystems and illustrate why KEV timing matters more than CVE age alone."
excerpt: "Three Linux kernel vulnerabilities added to CISA's KEV catalog on September 18 share a September 21 federal deadline, but their technical exposure differs sharply across kTLS, AF_ALG, and ebtables."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Cybersecurity & Infrastructure
tags:
  - Linux kernel
  - CISA KEV
  - vulnerabilities
  - kTLS
  - ebtables
  - AF_ALG
  - vulnerability management
author: Digital Observatory
authorRole: Cybersecurity & Infrastructure
featured: false
coverImage: ""
coverAlt: "Linux kernel vulnerability response showing three CISA KEV additions and their different attack surfaces"
keywords:
  - CISA KEV September 18 2026
  - Linux kernel vulnerabilities 2026
  - CVE-2025-39682
  - CVE-2025-39964
  - CVE-2026-53266
  - Linux kernel active exploitation
canonicalUrl: "https://observatory.campusloop.space/blog/cisa-kev-three-linux-kernel-flaws-september-2026"
noIndex: false
sources:
  - label: "CISA Known Exploited Vulnerabilities catalog tracking"
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
    note: "Authoritative catalog referenced for active-exploitation status and federal remediation deadlines; direct feed access was not required or bypassed."
  - label: "NVD — CVE-2025-39682"
    url: "https://nvd.nist.gov/vuln/detail/CVE-2025-39682"
    note: "Primary public vulnerability record for the Linux kTLS receive-path flaw."
  - label: "Oracle Linux — CVE-2025-39682"
    url: "https://linux.oracle.com/cve/CVE-2025-39682.html"
    note: "Vendor-maintained technical description and affected release information for the kTLS flaw."
  - label: "Oracle Linux — CVE-2025-39964"
    url: "https://linux.oracle.com/cve/CVE-2025-39964.html"
    note: "Vendor-maintained technical description and remediation information for the AF_ALG race condition."
  - label: "Red Hat — CVE-2026-53266"
    url: "https://access.redhat.com/security/cve/cve-2026-53266"
    note: "Vendor advisory for the ebtables SNAT memory-corruption path and supported mitigation."
  - label: "Independent KEV catalog mirror"
    url: "https://requestguard.com/vulnerabilities/known-exploited/"
    note: "Independent catalog mirror used to cross-check the three September 18 Linux kernel additions and dates."
---

**CISA's September 18, 2026 Known Exploited Vulnerabilities updates put three Linux kernel flaws on the same September 21 federal remediation deadline, but the three vulnerabilities are technically very different: CVE-2025-39682 affects kernel TLS handling, CVE-2025-39964 affects concurrent writes through AF_ALG sockets, and CVE-2026-53266 affects a specific ebtables SNAT ARP-rewrite path.** The useful security signal is therefore not simply "three Linux bugs," but that an old vulnerability can become urgent when exploitation evidence moves it into KEV.

## What changed on September 18

Independent tracking of the CISA catalog shows three Linux kernel vulnerabilities added on September 18, 2026:

- **CVE-2025-39964** — a race condition in the Linux kernel's AF_ALG interface.
- **CVE-2026-53266** — an out-of-bounds write in the ebtables SNAT ARP rewrite path.
- **CVE-2025-39682** — an improper check in the Linux kernel's TLS receive path.

The first two appeared in the day's earlier catalog update and the third in a later update. The catalog version remained `2026.09.18` even as the contents changed later that day, according to independent analysis of the public feed.

That detail is operationally important: a security system that keys only on the catalog version string can miss a same-day addition.

## KEV status is about exploitation, not just severity

CISA's Known Exploited Vulnerabilities catalog is designed to identify vulnerabilities for which there is evidence of exploitation in the wild.

That makes KEV membership a different signal from a CVSS score.

A vulnerability can have a high CVSS score without being known to be exploited. Conversely, an older vulnerability with a moderate score can become a high-priority operational problem once exploitation evidence appears.

The September 18 Linux additions are a clear example of that difference. Two of the three CVEs were published in 2025, yet they became an immediate federal remediation priority in September 2026.

For Federal Civilian Executive Branch agencies, the applicable September 21 deadline comes from the current risk-based vulnerability-management regime. Other organizations are not legally bound by that federal deadline, but KEV status is still a useful risk signal.

## CVE-2025-39682: the kTLS receive-path flaw

CVE-2025-39682 concerns Linux kernel TLS handling. The underlying issue involves zero-length records appearing in the kernel's TLS receive queue and interacting incorrectly with the logic used by `recvmsg()`.

The NVD record describes the flaw as an improper check for unusual or exceptional conditions. Oracle's vendor record documents the same underlying kernel fix and provides distribution-specific release information.

This flaw is especially interesting because the technical surface is a specialized kernel feature rather than generic TCP or TLS usage. Systems need the relevant kernel TLS path to be exposed for the vulnerability to matter in practice.

That is why asset inventory should precede generic panic. A server running Linux is not automatically equivalent to a server using every affected kernel subsystem.

At the same time, KEV membership means defenders should not dismiss the flaw simply because it was originally disclosed in 2025.

## CVE-2025-39964: the AF_ALG race condition

CVE-2025-39964 affects the Linux kernel's AF_ALG cryptographic socket interface.

The bug involves concurrent writes to the same AF_ALG socket. The kernel's vulnerable logic could allow writes to interleave unpredictably and create inconsistencies in the socket's internal state.

The attack model is materially different from CVE-2025-39682. Vendor and NVD records describe it as a local issue requiring low privileges, while the kTLS flaw has a different exposure profile depending on the kernel and feature configuration.

That difference matters because CVSS numbers alone do not tell an operator whether a flaw is reachable from the network, requires local access, or depends on a particular subsystem being enabled.

## CVE-2026-53266: ebtables SNAT is the narrowest path

CVE-2026-53266 affects the Linux kernel's ebtables SNAT implementation when it performs an optional ARP sender-hardware-address rewrite.

Red Hat describes the problem as a flaw that can let a local attacker improperly modify underlying memory pages when specific bridge netfilter rules are configured. Potential effects include memory corruption, denial of service, and local privilege escalation.

The important qualifier is **specific configuration**.

This is not a claim that every Linux machine using networking is equally exposed. The relevant ebtables bridge SNAT rule and ARP rewrite path have to be present.

That makes configuration inventory a meaningful mitigation step alongside kernel patching.

## Three CVEs, three different operational questions

| CVE | Kernel area | Core issue | Defender's first question |
| --- | --- | --- | --- |
| CVE-2025-39682 | kTLS | Receive-path handling of zero-length records | Is kernel TLS enabled and is the vendor kernel fixed? |
| CVE-2025-39964 | AF_ALG | Concurrent socket writes | Which workloads expose AF_ALG and which kernel packages contain the fix? |
| CVE-2026-53266 | ebtables SNAT | Writable-memory handling during ARP rewrite | Do bridge rules use the affected SNAT + ARP rewrite path? |

This is why "patch the Linux kernel" is necessary but not sufficient as a response description. The actual risk depends on the distribution, backports, kernel configuration, exposed subsystem and workload.

## The age of the CVE is the wrong urgency signal

CVE-2025-39682 was published in September 2025. CVE-2025-39964 was published in October 2025. CVE-2026-53266 was published in June 2026.

None was newly discovered on September 18.

What changed was the exploitation signal reflected by KEV membership.

This creates an important operational pattern:

```text
CVE publication
      ↓
vendor patch / upstream fix
      ↓
months may pass
      ↓
evidence of exploitation
      ↓
KEV addition
      ↓
accelerated remediation
```

A vulnerability-management system that sorts primarily by publication date can therefore miss the moment when the risk changes most sharply.

## The catalog version itself can be misleading

Independent analysis of the September 18 feed found that CISA published more than one catalog update that day while retaining the same `2026.09.18` catalog version.

The first update added two Linux kernel vulnerabilities. A later update added the third.

That means a consumer that stores only:

```text
catalogVersion = 2026.09.18
```

without diffing the actual entries can fail to notice the second update.

The lesson is broader than CISA. Security feeds should be processed as event streams or content snapshots, not as version labels alone.

## What defenders should do

The appropriate response is vendor- and configuration-aware.

1. **Check the distribution kernel.** Linux distributions frequently backport fixes without matching the upstream version number.
2. **Map the affected subsystems.** Inventory kTLS, AF_ALG usage and ebtables bridge SNAT rules rather than assuming every host has the same exposure.
3. **Apply supported vendor fixes.** Use the distribution's security advisory as the authoritative remediation reference.
4. **Review the September 21 federal deadline if you operate FCEB systems.** BOD 26-04 obligations apply specifically to the federal civilian executive branch.
5. **Check for prior compromise where the applicable guidance requires forensic triage.** KEV status changes the question from "should we patch?" to "could exploitation have already occurred?"

The goal is not to turn every KEV into an internet-wide emergency. It is to make exploitation evidence visible in the patch-priority model.

The Observatory's earlier [TanStack/CrowdSec supply-chain analysis](/blog/crowdsec-tanstack-supply-chain-long-tail) illustrates the same operational principle from a different layer: the first technical compromise and the later evidence available to defenders are not always the same event.

## What remains uncertain

KEV membership establishes CISA's exploitation criterion, but it does not by itself identify the attacker, campaign, malware family, number of victims, or exact exploitation volume. The September 18 entries do not provide a public attribution narrative for these three Linux flaws.

Severity scores also differ between sources for some vulnerabilities because scoring authorities use different assumptions. That is why this article does not use a single CVSS number as the primary risk argument.

Finally, distribution kernels can contain backported fixes. Operators should not infer vulnerability solely from the upstream kernel version without checking the vendor's security advisory.

## Why this is meaningfully new

The Observatory already covers software supply-chain and infrastructure security incidents, but the September 18 KEV update adds a distinct measurement signal: **three different Linux kernel subsystems moved into active-exploitation priority on the same day, with the same federal deadline, while the underlying CVEs ranged from roughly a year old to newly disclosed.**

That makes the update useful as a vulnerability-management systems story, not merely a list of three CVEs.

## Limitations

CISA's live KEV feed was not directly retrieved in this run because the public feed endpoint returned an access-denied response; no access control was bypassed. The addition dates and catalog state were cross-checked against independent public catalog mirrors and security reporting, while technical details were checked against NVD and vendor-maintained records.

## Sources and further reading

- [CISA — Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [NVD — CVE-2025-39682](https://nvd.nist.gov/vuln/detail/CVE-2025-39682)
- [Oracle Linux — CVE-2025-39682](https://linux.oracle.com/cve/CVE-2025-39682.html)
- [Oracle Linux — CVE-2025-39964](https://linux.oracle.com/cve/CVE-2025-39964.html)
- [Red Hat — CVE-2026-53266](https://access.redhat.com/security/cve/cve-2026-53266)
- [Independent KEV catalog mirror](https://requestguard.com/vulnerabilities/known-exploited/)
