---
title: "Secrets Management for Student Projects: API Keys Should Not Live in Git"
description: "A practical guide to environment variables, secret stores, rotation, least privilege, accidental commits, and the difference between configuration and credentials."
excerpt: "A secret is different from ordinary configuration because disclosure can grant access. The engineering goal is to keep secrets out of source control and minimize their blast radius."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: "published"
category: "Security"
tags: ["secrets","API keys","Git","security","DevOps"]
keywords: ["secret management","API key security","environment variables","Git secrets"]
author: "Digital Observatory"
authorRole: "Student Research & Engineering"
featured: false
coverImage: ""
coverAlt: "Secrets Management for Student Projects: API Keys Should Not Live in Git"
canonicalUrl: "https://observatory.campusloop.space/blog/secrets-management-for-student-projects"
noIndex: false
sources:
  - label: "OWASP — Secrets Management Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
    note: "Application and infrastructure secret-management guidance."
  - label: "GitHub Docs — Secret scanning"
    url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning"
    note: "Repository secret-detection and response capabilities."
---

**Keep credentials out of source control, inject them through the deployment environment or a secret manager, and give each secret the narrowest permissions and lifetime practical.** Use the subject as a system to inspect, not a checklist to memorize. The goal is to be able to explain where the trust boundary or failure mode sits when a real project changes.

## The core idea

Student projects often begin with a single API key in a local .env file. The mistake happens when the same value is copied into source code, a public repository, a frontend bundle, a screenshot, or a tutorial snippet. Secret management is primarily about reducing how many places know a credential and how powerful that credential is.

## How it works in practice

Separate public configuration from secrets. A browser-visible environment variable is not secret merely because the source file used an environment variable syntax; anything shipped to the browser should be treated as public.

Use deployment secrets or a dedicated secret store for server-side credentials. Generate distinct credentials per environment so a leaked development key does not automatically compromise production.

Plan rotation. If a key leaks, you should know which service issued it, where it is used, how to revoke it, and how to replace it without rebuilding your entire project from scratch.

## A concrete example

A weather API key used only from a server can remain server-side. A public map token intended for browser use must be treated differently and restricted by origin or quota if the provider supports it. The word 'API key' does not tell you whether a credential is actually secret.

A useful exercise is to predict the attack or failure path before looking at the fix. Then ask whether the control prevents the event, limits its impact, or merely detects it.

## Common mistakes

- Assuming .env files are automatically safe after they are committed to Git once.
- Putting a secret in client-side JavaScript and calling it private.
- Granting one master credential access to every student environment and service.

## A student project that makes it stick

Create a local secrets policy for a student project. List every credential, where it is injected, who needs it, what permissions it has, and how it would be revoked. Add a pre-commit or CI check that blocks common secret patterns.

## Where it connects

Security almost never lives in one file. It crosses browsers, APIs, databases, CI runners, credentials, operating systems, and human workflows. That is why simple architectural diagrams are often more useful than a very long vulnerability list.

## Practical checklist

1. Identify the asset and the trust boundary.
2. Decide what must be prevented and what can instead be detected.
3. Reduce permissions and lifetime wherever possible.
4. Add a test or observable signal for important controls.
5. Revisit the design after dependencies or architecture change.

## Limitations

Security guidance is contextual. A control that fits a public web application may not fit a local CLI tool, and a demo environment may expose different risks from production. Use the primary references below for implementation details and adapt them to the actual system you control.

## Related Observatory reads

- [git branching and commit history](/blog/git-branching-and-commit-history)
- [ci cd as a repeatable software pipeline](/blog/ci-cd-as-a-repeatable-software-pipeline)
- [owasp web security for student projects](/blog/owasp-web-security-for-student-projects)

## Primary sources

- [OWASP — Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Docs — Secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
