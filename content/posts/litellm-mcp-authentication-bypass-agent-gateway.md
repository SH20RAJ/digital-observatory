---
title: "LiteLLM's MCP Authentication Bypass Shows Why Agent Gateways Are Security Boundaries"
description: "CVE-2026-59822 lets unauthenticated requests reach LiteLLM's MCP tooling on affected versions before 1.84.0, turning an AI gateway's authentication fallback into a direct tool-access boundary."
excerpt: "The LiteLLM flaw is important because the vulnerable component is not the model: it is the gateway that decides whether an external request can establish an MCP session and reach connected tools."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: AI Security & Infrastructure
tags:
  - LiteLLM
  - MCP
  - authentication
  - AI gateways
  - CVE-2026-59822
  - agent security
author: Digital Observatory
authorRole: AI Security & Infrastructure
featured: false
coverImage: ""
coverAlt: "LiteLLM MCP gateway showing authentication, OAuth passthrough and connected tool access"
keywords:
  - LiteLLM CVE-2026-59822
  - LiteLLM MCP authentication bypass
  - MCP security vulnerability
  - AI gateway security
  - LiteLLM 1.84.0
canonicalUrl: "https://observatory.campusloop.space/blog/litellm-mcp-authentication-bypass-agent-gateway"
noIndex: false
sources:
  - label: "BerriAI LiteLLM — security advisory GHSA-7488-6r32-c95q"
    url: "https://github.com/BerriAI/litellm/security/advisories/GHSA-7488-6r32-c95q"
    note: "Primary vendor advisory describing the MCP Streamable HTTP authentication bypass, affected versions, fixed version, and mitigation."
  - label: "NVD — CVE-2026-59822"
    url: "https://nvd.nist.gov/vuln/detail/CVE-2026-59822"
    note: "Public vulnerability record for the CVE identifier and vulnerability metadata."
  - label: "CISA Known Exploited Vulnerabilities Catalog"
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-59822"
    note: "Catalog endpoint for the exploitation-status and federal remediation record; direct retrieval was unavailable during this run, so the catalog status was corroborated through independent public records."
  - label: "Independent CVE tracking — Previdian"
    url: "https://previdian.com/CVE-2026-59822"
    note: "Independent timeline and exploitation-status record used to corroborate the CISA KEV addition and September 2026 exploitation reporting."
---

**CVE-2026-59822 shows why an AI gateway is itself a security boundary: LiteLLM versions before 1.84.0 had an MCP Streamable HTTP authentication bypass that could let an unauthenticated request establish an MCP session using a fabricated Bearer token.** The issue was fixed in LiteLLM 1.84.0, and public vulnerability records place the flaw in CISA's Known Exploited Vulnerabilities catalog in September 2026.

## What LiteLLM is doing in the request path

LiteLLM is commonly deployed as an AI gateway or proxy between applications and model providers. Its job can include authentication, routing, budgets, logging and access to connected tools.

When MCP is exposed through that gateway, the architecture becomes roughly:

```text
client
  ↓
LiteLLM authentication
  ↓
MCP Streamable HTTP endpoint
  ↓
configured MCP tools
  ↓
connected services
```

That means the gateway is not just a convenience layer. It sits between an untrusted network request and capabilities that may have access to other systems.

## What CVE-2026-59822 changed

The LiteLLM advisory says the vulnerable MCP authentication handler supported OAuth2 passthrough for upstream MCP servers. When normal LiteLLM key validation failed, a fallback path could replace the failed validation with an empty `UserAPIKeyAuth()` object.

A request with a fabricated `Authorization` header could therefore reach the MCP tooling without possessing a valid LiteLLM key.

The impact described by the project is concrete: an attacker could list and call configured MCP tools and access connected services exposed through MCP.

The fixed version is **LiteLLM 1.84.0 or later**.

## Why the fallback path matters more than the CVSS number

The advisory assigns the vulnerability a CVSS v4 score of 8.8. That communicates severity, but the architectural lesson is more useful than the score itself.

The dangerous sequence is:

```text
invalid gateway credential
        ↓
OAuth passthrough fallback
        ↓
empty authentication state
        ↓
MCP session
        ↓
connected tools
```

The failure is not that MCP itself is inherently insecure. It is that the gateway's authentication state became ambiguous at the exact point where the system was deciding whether an external request could reach tools.

For an agent gateway, an authentication fallback is therefore part of the tool-security boundary.

## The vulnerability is different from model-layer attacks

AI security discussions often focus on prompt injection, malicious instructions, or unsafe model outputs. Those remain important, but CVE-2026-59822 operates below the model.

The attacker does not need to convince a model to call a tool. The attacker reaches the gateway's MCP interface and exploits an authentication decision before the tool invocation becomes an agent reasoning problem.

That distinction matters operationally:

| Layer | Example security question |
| --- | --- |
| Model | Can an instruction manipulate the model? |
| Agent | Can the agent be induced to choose an unsafe action? |
| Tool protocol | Can a tool call be invoked outside intended policy? |
| Gateway | Is the caller actually authenticated before tools become reachable? |
| Connected service | What can the tool access after invocation? |

CVE-2026-59822 belongs primarily to the gateway and tool-protocol layers.

## Why MCP makes gateway mistakes consequential

MCP is designed to standardize connections between AI systems and tools. That interoperability is useful precisely because one interface can expose capabilities across different services.

The same property increases the importance of the boundary around the MCP endpoint.

A gateway may expose tools for databases, browsers, internal APIs, code repositories or other services. If the gateway accepts an unauthenticated MCP session, the resulting blast radius depends on the tools configured behind it.

That is why the LiteLLM advisory does not reduce the impact to "an API authentication bug." It specifically describes unauthorized access to configured MCP tools and the services they expose.

## What operators should verify

The immediate remediation is to upgrade affected LiteLLM deployments to **1.84.0 or later**.

Where an upgrade is temporarily unavailable, the project recommends disabling MCP routes or blocking `/mcp/` and related endpoints at a reverse proxy or API gateway.

Operators should also map the actual capability behind every exposed MCP server:

1. Which LiteLLM instances expose MCP?
2. Which network interfaces expose those endpoints?
3. Which versions are running?
4. Which MCP tools are configured?
5. What credentials can those tools access?
6. What logs can show unauthorized MCP sessions or unusual tool calls?

This inventory matters because the vulnerability's consequences depend on what is connected behind the gateway.

## The Observatory's agent-security context

The Observatory's [OpenAI Agents API analysis](/blog/openai-agents-api-moves-agent-infrastructure-into-the-platform) tracks the broader move toward managed agent infrastructure. As more execution capabilities move into platform layers, those layers become security boundaries rather than passive plumbing.

The Observatory's [TRACE analysis](/blog/trace-portable-runtime-evidence-ai-agents) looks at a different side of the same problem: how external systems can obtain evidence about what an agent runtime actually executed. LiteLLM sits earlier in that chain, deciding who can reach the tool interface in the first place.

The recent [GitSpawn research](/blog/gitspawn-ai-coding-agent-git-config-security) provides another lower-level example. There, the model is not the vulnerability either; ordinary developer-tool plumbing becomes the attack surface.

## What the public evidence establishes

The vendor advisory establishes the vulnerable request path, affected versions and 1.84.0 fix. NVD provides the public CVE record. Independent vulnerability tracking records the September 2, 2026 CISA KEV addition and exploitation timeline.

Direct retrieval of the CISA catalog page was blocked by a 403 during this research run, so the KEV status is not presented as a fresh direct scrape of CISA's page. The catalog URL is retained as the authoritative reference, while the status was corroborated through independent public records.

That distinction is important because exploitation status is a stronger claim than simply saying that a vulnerability exists.

## What this does not prove

The CVE does not mean that every LiteLLM deployment is exploitable in the same way. Exposure depends on version, whether the MCP Streamable HTTP endpoint is reachable, how authentication is configured, and which tools are connected.

It also does not mean every MCP deployment has the same blast radius. A read-only tool with narrow permissions is materially different from a tool that can modify production infrastructure.

Finally, the existence of active-exploitation evidence does not by itself identify every attacker, campaign or affected organization. The public records support the vulnerability and exploitation classification, not a complete incident attribution.

## Why this is meaningfully new

The Observatory already covers agent infrastructure and agent misuse, but LiteLLM's MCP flaw adds a concrete security measurement at the **gateway boundary**: authentication must remain authoritative when requests transition from an external protocol endpoint to connected tools.

That is a useful architectural lesson as MCP adoption grows. Security cannot stop at the model or agent prompt. The gateway, protocol endpoint, tool registry and downstream credentials all form part of the agent execution perimeter.

## Limitations

This article relies on the LiteLLM project's security advisory, NVD, the CISA catalog reference and independent vulnerability tracking. The CISA page itself returned 403 during this run, so the KEV status was not directly re-fetched from CISA. Operators should verify the current LiteLLM release and their own MCP exposure before making deployment decisions.

## Sources and further reading

- [LiteLLM security advisory](https://github.com/BerriAI/litellm/security/advisories/GHSA-7488-6r32-c95q)
- [NVD — CVE-2026-59822](https://nvd.nist.gov/vuln/detail/CVE-2026-59822)
- [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-59822)
- [Previdian — CVE-2026-59822 timeline](https://previdian.com/CVE-2026-59822)
