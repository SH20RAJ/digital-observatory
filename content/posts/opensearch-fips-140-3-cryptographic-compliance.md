---
title: "OpenSearch's FIPS 140-3 Mode Moves Cryptographic Compliance Inside the Cluster"
description: "OpenSearch 3.6 adds an opt-in FIPS 140-3 mode that puts validated cryptography inside the search cluster, rather than relying only on a compliant TLS proxy at the network edge."
excerpt: "OpenSearch's new FIPS mode changes the compliance boundary: cryptographic operations performed inside the cluster can use a FIPS-validated provider instead of leaving compliance at the perimeter."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Open Source & Security Infrastructure
tags:
  - OpenSearch
  - FIPS 140-3
  - cryptography
  - compliance
  - observability
  - security infrastructure
author: Digital Observatory
authorRole: Open Source & Security Infrastructure
featured: false
coverImage: ""
coverAlt: "OpenSearch FIPS 140-3 architecture showing validated cryptography inside the search and observability cluster"
keywords:
  - OpenSearch FIPS 140-3
  - OpenSearch 3.6 FIPS mode
  - FIPS compliant OpenSearch
  - Bouncy Castle FIPS OpenSearch
  - cryptographic compliance search cluster
canonicalUrl: "https://observatory.campusloop.space/blog/opensearch-fips-140-3-cryptographic-compliance"
noIndex: false
sources:
  - label: "OpenSearch — FIPS 140-3 support"
    url: "https://opensearch.org/blog/fips-140-3-support-in-opensearch/"
    note: "Primary project announcement and implementation explanation for native FIPS 140-3 support in OpenSearch 3.6."
  - label: "OpenSearch Documentation — FIPS configuration"
    url: "https://docs.opensearch.org/latest/security/configuration/fips/"
    note: "Primary technical documentation for providers, supported JVMs, keystores, password requirements, and configuration."
  - label: "AWS — FIPS 140-3 compliance"
    url: "https://aws.amazon.com/compliance/fips/"
    note: "Independent ecosystem context for FIPS-validated cryptography and AWS's own FIPS endpoints and modules."
  - label: "NIST — Cryptographic Module Validation Program"
    url: "https://csrc.nist.gov/projects/cryptographic-module-validation-program"
    note: "Primary standards authority for the FIPS 140 cryptographic-module validation program."
---

**OpenSearch 3.6 adds an opt-in FIPS 140-3 mode that moves part of the cryptographic compliance boundary inside the search cluster itself: the distribution bundles a FIPS-validated Bouncy Castle provider, restricts cryptographic operations to approved algorithms, and enforces stronger key-storage requirements.** The practical change is not merely another encryption setting; it lets organizations evaluate OpenSearch itself as part of a regulated cryptographic boundary instead of relying only on controls at the network edge.

## What FIPS 140-3 is measuring

FIPS 140-3 is a U.S. government standard for cryptographic modules. It focuses on the components that perform security-relevant cryptographic operations such as encryption, hashing, key handling and random-number generation.

That is different from a generic statement that a product "uses encryption."

A FIPS-oriented deployment needs the cryptographic implementation itself to operate through validated modules and approved algorithms within the relevant boundary.

NIST's Cryptographic Module Validation Program is the formal ecosystem around those validations.

## Why an edge proxy is not always enough

A common compliance architecture is to put a FIPS-validated TLS terminator in front of an application:

```text
client
  ↓
FIPS-validated edge / proxy
  ↓
application cluster
```

That can protect the network boundary, but the application may still perform cryptographic operations internally.

OpenSearch identifies several examples: credentials can be hashed, tokens can be signed, and node-to-node communication can use cryptography inside the cluster.

A proxy cannot make those internal operations FIPS-compliant simply by terminating external TLS.

Native FIPS mode changes the architecture:

```text
client
  ↓
network controls
  ↓
OpenSearch cluster
  ├── validated cryptography
  ├── approved algorithms
  └── compliant key stores
```

The two approaches can coexist. The important difference is where the compliance boundary is drawn.

## What OpenSearch 3.6 changes

OpenSearch says its FIPS support became available starting with version 3.6 and remains opt-in.

The default distribution includes the Bouncy Castle FIPS Java provider. In FIPS mode, OpenSearch uses it in approved-only mode and removes the normal providers that are not part of the validated cryptographic boundary.

The project also changed several surrounding requirements:

- FIPS-compliant keystore and truststore formats are `BCFKS` and `PKCS#11`.
- `JKS` and `PKCS12` are not the compliant choices for the FIPS deployment described by OpenSearch.
- Keystore and key passwords must meet a 112-bit minimum strength requirement, approximately 14 characters.
- OpenSearch runs its test suite under a FIPS JVM in continuous integration to detect regressions.

These details matter because cryptographic compliance is a system property, not a checkbox on one API.

## FIPS mode is available but not silently enabled

OpenSearch deliberately separates capability from enforcement.

The FIPS-capable libraries are shipped in the standard 3.6 distribution, but administrators must configure the environment and explicitly enable enforcement with:

```text
OPENSEARCH_FIPS_MODE=true
```

That is operationally useful because organizations can stage the migration without forcing every existing OpenSearch deployment to adopt FIPS-specific requirements immediately.

It also means that simply running OpenSearch 3.6 does **not** establish that a cluster is operating in FIPS-enforced mode.

## The JVM becomes part of the compliance story

OpenSearch's FIPS documentation requires a JVM configured to use the validated provider and a Java version for which the relevant Bouncy Castle FIPS module is certified.

This introduces a deployment dependency that is easy to overlook. Application-level configuration alone is insufficient if the underlying runtime is outside the validated configuration.

The same principle applies to keystores and truststores. A FIPS deployment has to use formats and providers that fit the validation boundary rather than simply enabling TLS and assuming that encryption is equivalent to compliance.

## Why the project needed years of engineering work

OpenSearch says community requests for FIPS support date back to the project's early years, including requests opened in 2020 and 2021.

The work eventually became a multi-organization effort involving SAP, SAS and AWS. SAS established early Security-plugin groundwork, SAP developed a broader FIPS 140-3 roadmap and core implementation, and AWS maintainers contributed runtime and build support.

The architecture also had to account for dependencies across repositories. FIPS behavior could not be isolated neatly inside one plugin if the rest of the cluster still performed cryptographic operations through non-validated providers.

That makes the project a useful example of compliance becoming an open-source systems-engineering problem rather than a documentation exercise.

## The connection to OpenSearch's AI and observability stack

The timing is notable because OpenSearch is simultaneously expanding its AI and agent capabilities. OpenSearch 3.8 adds features around vector search, agent execution and agentic memory, while the FIPS work strengthens the cryptographic foundation underneath the platform.

The Observatory has not treated OpenSearch's AI features as equivalent to compliance. They are separate layers.

That distinction matters because regulated deployments may want AI-assisted search or observability without accepting an undefined cryptographic boundary.

## What this means for regulated deployments

For an organization evaluating OpenSearch in a FIPS-required environment, the relevant checklist is broader than "does OpenSearch support FIPS?"

A deployment should establish:

1. Which OpenSearch version is running.
2. Which JVM version and validated provider are in use.
3. Whether FIPS enforcement is actually enabled.
4. Which keystore and truststore formats are configured.
5. Whether passwords satisfy the required strength.
6. Which plugins or integrations perform cryptographic operations.
7. Where the organization's formal compliance boundary is drawn.

The last question is especially important. A FIPS-capable cluster does not automatically make every external component in an architecture compliant.

## Related security infrastructure

The Observatory's [Java 27 post-quantum TLS analysis](/blog/java-27-post-quantum-tls-runtime-security) examines cryptographic migration from the runtime side, while [Cloudflare's post-quantum DNSSEC deployment](/blog/cloudflare-post-quantum-dnssec-ml-dsa-44) looks at the protocol and resolver layer.

OpenSearch FIPS support is different: it is about validating the cryptographic implementation used inside a large open-source application platform.

The distinction is useful because "cryptographic security" can mean different things at different layers: algorithm transition, protocol deployment, or validated implementation.

## What this does not prove

OpenSearch's announcement says FIPS support is available, but it also says development continues in parts of the Security plugin and integration testing. FIPS capability therefore should not be interpreted as a universal certification of every possible OpenSearch deployment configuration.

The project also describes FIPS mode as an explicit deployment choice. Running a standard OpenSearch distribution without enabling the mode does not mean that the cluster is operating under FIPS enforcement.

Finally, FIPS 140-3 is a cryptographic-module standard. It does not by itself certify an entire application, organization, threat model or security program.

## Why this is meaningfully new

The Observatory already covers cryptographic changes at network and language-runtime layers. OpenSearch's September 16 announcement adds a different system layer: **validated cryptography becomes an explicit property of the search and observability cluster itself.**

That matters for open-source infrastructure because regulated adoption often fails at the boundary between an application's internal cryptographic operations and the compliance controls surrounding it. Native FIPS mode narrows that gap, while still leaving deployment-specific validation to operators.

## Limitations

This article relies primarily on OpenSearch's announcement and documentation, with NIST and AWS used for standards and ecosystem context. The project's own documentation states that some FIPS-related work remains in progress. Organizations with formal compliance obligations should validate the exact OpenSearch, JVM, provider, plugin and deployment configuration against their applicable requirements rather than treating product-level support as a blanket certification.

## Sources and further reading

- [OpenSearch — FIPS 140-3 support](https://opensearch.org/blog/fips-140-3-support-in-opensearch/)
- [OpenSearch FIPS configuration documentation](https://docs.opensearch.org/latest/security/configuration/fips/)
- [NIST — Cryptographic Module Validation Program](https://csrc.nist.gov/projects/cryptographic-module-validation-program)
- [AWS — FIPS 140-3](https://aws.amazon.com/compliance/fips/)
