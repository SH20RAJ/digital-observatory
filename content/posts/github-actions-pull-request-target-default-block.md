---
title: "GitHub Actions Is Turning pull_request_target Into an Explicit Security Exception"
description: "GitHub's September 17, 2026 rollout makes workflow execution protections generally available and introduces a default block for pull_request_target in affected public repositories from November 2."
excerpt: "GitHub is moving a risky GitHub Actions trigger from an easy-to-misconfigure workflow choice toward an explicit policy decision. The change is important for open-source maintainers, especially repositories that process fork pull requests."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Security
tags:
  - GitHub Actions
  - supply chain security
  - CI/CD
  - open source
  - GitHub
  - workflow security
author: Digital Observatory
authorRole: Security & Developer Ecosystems
featured: false
coverImage: ""
coverAlt: "GitHub Actions workflow branching from an untrusted pull request into a guarded security policy gate"
keywords:
  - GitHub Actions workflow execution protections
  - pull_request_target security
  - GitHub Actions pwn requests
  - GitHub Actions security
  - GitHub Actions public repositories
  - CI/CD supply chain security
canonicalUrl: "https://observatory.campusloop.space/blog/github-actions-pull-request-target-default-block"
noIndex: false
sources:
  - label: "GitHub Changelog — Workflow execution protections in GitHub Actions generally available"
    url: "https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/"
    note: "September 17, 2026 announcement covering general availability, workflow file targeting, Insights, REST API policy management, evaluate mode, and the November 2 default enforcement date for pull_request_target in affected public repositories."
  - label: "GitHub Docs — Securely using pull_request_target"
    url: "https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target"
    note: "Current security guidance explaining the elevated trust of pull_request_target, the default policy, affected repository scope, migration choices, and common unsafe checkout patterns."
  - label: "GitHub Security Lab — Preventing pwn requests"
    url: "https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/"
    note: "Security Lab research documenting why executing untrusted fork pull-request code in privileged workflows can expose repository write permissions and secrets."
  - label: "GitHub Blog — How to scan GitHub Actions workflows for security issues"
    url: "https://github.blog/security/application-security/how-to-secure-your-github-actions-workflows-with-codeql/"
    note: "GitHub Security Lab's research on recurring GitHub Actions vulnerability patterns, including pull_request_target misuse, workflow splitting, and untrusted inputs."
  - label: "GitHub Changelog — Safer pull_request_target defaults for GitHub Actions checkout"
    url: "https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout/"
    note: "June 18, 2026 hardening that made actions/checkout refuse common fork pull-request checkout patterns in privileged triggers unless explicitly opted out."
  - label: "GitHub Changelog — Read-only Actions cache for untrusted triggers"
    url: "https://github.blog/changelog/2026-06-26-read-only-actions-cache-for-untrusted-triggers/"
    note: "June 26, 2026 cache hardening that made cache access read-only for applicable untrusted workflow triggers, reducing cache-poisoning privilege-escalation paths."
---

**GitHub is making `pull_request_target` a policy decision rather than a workflow default.** On September 17, 2026, GitHub made Actions workflow execution protections generally available and introduced a default policy that blocks `pull_request_target` in affected public repositories. The policy is currently evaluated in shadow mode and is scheduled for enforcement on **November 2, 2026**. [GitHub's September 17 announcement](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

This is more significant than another Actions settings update. It moves a long-standing security boundary out of individual workflow authors' judgment and into centrally enforceable policy. For maintainers, the practical question is no longer only "is this workflow written safely?" It is also "does this repository still need a privileged trigger for untrusted pull requests?"

## What changed on September 17, 2026

GitHub's **workflow execution protections** are now generally available for GitHub Enterprise, organizations, and repositories. They allow administrators to define rules about **who** can trigger workflows and **which events** may trigger them. The general-availability release adds three particularly useful capabilities:

- **Workflow file targeting:** a policy can apply to specific workflow files instead of the entire repository.
- **Insights:** administrators can see which runs would be affected before enforcing a rule.
- **REST API management:** execution policies can be created, read, updated, and deleted programmatically, including workflow-path conditions. [GitHub's workflow-execution announcement](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

The same release also introduces a secure default for `pull_request_target` in public repositories that do not already have an applicable Actions event policy. GitHub says that default is initially in **evaluate mode**, so affected workflows can be identified before the rule becomes blocking. [GitHub's security documentation](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

## Why `pull_request_target` is different

The name can make `pull_request_target` sound like a variant of `pull_request`. The security model is materially different.

A workflow triggered by `pull_request_target` runs using the base repository's workflow context. GitHub's current documentation says such jobs receive the base repository's `GITHUB_TOKEN` and access to repository and organization secrets. That elevated trust is useful for legitimate automation such as labeling or authenticated status updates on fork pull requests. [GitHub's pull_request_target security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

The danger appears when that privileged workflow also executes code supplied by the pull request.

For example:

```text
fork pull request
      ↓
pull_request_target workflow
      ↓
privileged token + secrets
      ↓
checkout of fork code
      ↓
build / test / dependency install
      ↓
attacker-controlled execution
```

GitHub Security Lab calls this class of vulnerability a **pwn request**. Its research explains that a malicious pull request can alter build scripts, tests, package configuration, or dependencies so that attacker-controlled commands execute in a workflow with repository privileges. [GitHub Security Lab's pwn-request research](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)

The important distinction is therefore not that `pull_request_target` is inherently malicious. It is that **privileged automation and untrusted code become dangerous when they are allowed to cross the same execution boundary**.

## The November 2 deadline changes the maintenance question

The new default policy is specifically aimed at public repositories that do not already have an applicable event policy. It does not apply to private or internal repositories, and it does not replace an event policy that a repository or organization has already configured. [GitHub's pull_request_target documentation](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

For affected public repositories, GitHub will enforce the default block on **November 2, 2026**. Until then, evaluate mode can expose the workflows that would fail under the new policy. [GitHub's September 17 changelog](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

That creates a useful migration window rather than an overnight breaking change.

Maintainers should inventory workflows that contain:

- `on: pull_request_target`;
- explicit checkout of a pull-request head or merge ref;
- commands that build or test checked-out pull-request code;
- package installation or scripts that can execute repository-controlled content;
- secrets or write-capable `GITHUB_TOKEN` permissions;
- related `workflow_run` or `issue_comment` flows that later execute untrusted artifacts or code.

The last category matters because removing one trigger does not eliminate the broader security problem. GitHub's current documentation explicitly warns that pwn requests can also occur in other privileged events when untrusted code is fetched or executed. [GitHub's security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

## The safer path is often `pull_request`

GitHub's guidance is deliberately pragmatic: if a workflow does not need the elevated trust of `pull_request_target`, use `pull_request` instead. For fork pull requests, `pull_request` runs with a read-only `GITHUB_TOKEN`, withholds other secrets, and applies fork approval protections. [GitHub's security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

That gives a simple decision tree:

| Workflow need | Better default | Reason |
| --- | --- | --- |
| Build or test fork PR code without secrets | `pull_request` | Untrusted code stays in a lower-trust context |
| Label, triage, or comment without executing fork code | `pull_request_target` can be appropriate | The privileged workflow can operate on PR metadata without running its code |
| Build untrusted code and later perform a privileged action | Split the workflows | Keep execution unprivileged and move only the necessary result across the boundary |
| Privileged fork checkout is genuinely required | Explicitly allow and harden it | This is an exception that needs deliberate security review |

GitHub Security Lab has documented the workflow-splitting pattern for cases where untrusted code must be built but a later step needs write access or secrets. The unprivileged `pull_request` workflow produces results, while a separate `workflow_run` workflow handles the privileged operation. The artifacts crossing that boundary must themselves be treated as untrusted data. [GitHub Security Lab's workflow-security research](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)

## This is the third layer of hardening, not the first

The September policy change is easier to understand as part of a sequence of GitHub Actions security controls shipped during 2026.

In June, GitHub changed `actions/checkout` so supported versions refuse common patterns that check out fork pull-request code from `pull_request_target` and related privileged workflows. An explicit `allow-unsafe-pr-checkout` opt-out remains for workflows that genuinely need the behavior. [GitHub's checkout hardening announcement](https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout/)

Later that month, GitHub changed cache behavior for untrusted triggers so applicable workflows receive read-only cache tokens, reducing a class of cache-poisoning privilege-escalation paths. [GitHub's read-only cache announcement](https://github.blog/changelog/2026-06-26-read-only-actions-cache-for-untrusted-triggers/)

The September rollout adds a different layer:

```text
Workflow code hardening
        +
Runtime/cache privilege reduction
        +
Central execution policy
        ↓
Fewer ways for one workflow mistake to become a repository-wide trust failure
```

None of these controls makes GitHub Actions secure by itself. Their value is that they reduce different parts of the attack surface.

## Why centralized policy matters

Traditional Actions security often depends on every workflow author getting several details right simultaneously: the trigger, checkout ref, token permissions, secret exposure, shell handling, dependency execution, and artifact flow.

That is a difficult governance model for an ecosystem containing thousands of independently maintained repositories.

GitHub's new execution protections introduce a higher-level control plane. An organization can restrict workflow events or actors across repositories, and specific workflow files can receive different rules. Policies can also be managed through the REST API, which makes them compatible with infrastructure-as-code and governance tooling. [GitHub's workflow-execution announcement](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

That changes the security unit from **"this YAML file looks safe"** to **"this class of workflow is permitted to execute under these conditions."**

For large organizations, that is a much more scalable control.

## What maintainers should check before November 2

The current evidence supports a short audit rather than a wholesale rewrite.

### 1. Find every `pull_request_target` workflow

Start with the event itself. Then inspect what the workflow actually executes.

A trigger that only labels a pull request is materially different from one that checks out the pull request head and runs `npm install`.

### 2. Use evaluate mode as a migration report

GitHub's policy insights can show which workflow runs would be affected before enforcement. That gives maintainers an evidence-based migration list rather than requiring them to guess which repositories matter. [GitHub's security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

### 3. Prefer least privilege

If the workflow does not need secrets or write access, it probably does not need a privileged event. GitHub's guidance also recommends restricting `GITHUB_TOKEN` permissions and secrets for workflows that legitimately retain `pull_request_target`. [GitHub's security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

### 4. Check for hidden execution

The dangerous operation is not necessarily an obvious `./build.sh` command. GitHub notes that commands such as `npm install` and `npm run build`, configuration files, dependencies, and other build machinery can execute attacker-controlled code after an unsafe checkout. [GitHub's security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

### 5. Treat exceptions as exceptions

If a workflow genuinely needs `pull_request_target`, GitHub allows maintainers to explicitly permit the event through an applicable Actions event policy. The point of the new default is not to make every privileged workflow impossible; it is to make the trust decision explicit. [GitHub's September 17 announcement](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

## What the evidence does—and does not—prove

**Observed:** GitHub made workflow execution protections generally available on September 17, 2026 and introduced a default `pull_request_target` block for affected public repositories, with enforcement scheduled for November 2, 2026. [GitHub's announcement](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

**Documented:** The trigger has elevated access to the base repository's token and secrets, while `pull_request` is designed to process fork contributions with reduced privileges. GitHub documents unsafe checkout-and-execute patterns as a root cause of pwn requests. [GitHub's security guide](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target) [GitHub Security Lab](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)

**Interpretation:** GitHub is shifting Actions security toward centrally enforceable policy and explicit trust boundaries instead of relying solely on workflow authors to avoid dangerous combinations.

**Unknown:** The new default does not establish how many real-world compromises it will prevent, nor does it eliminate every privileged-workflow attack path. Repositories can explicitly allow the event, and other triggers can still become dangerous when they execute untrusted code with elevated permissions.

That limitation is important. The change is a stronger guardrail, not proof that a repository's CI/CD system is secure.

## Why this is a meaningful developer-ecosystem signal

The interesting part is not simply that GitHub is disabling one Actions event by default.

It is that **privileged automation is becoming a governed capability**.

The same ecosystem is also separating package-release preparation from publication authority: npm's September 18 stage-only token change lets CI stage a release without directly publishing the new version. That is a different control, but the architectural direction is similar—reduce the amount of consequential authority any one automated path must possess. See the Observatory's [npm stage-only token observation](/blog/npm-stage-only-tokens-human-approval) for that adjacent signal.

The broader lesson is therefore narrower than "GitHub made Actions safe":

> **As of September 17, 2026, GitHub gives maintainers and organizations a centrally enforceable way to restrict which workflows can execute, while moving `pull_request_target` toward an explicit exception in affected public repositories.**

For open-source maintainers, the immediate implication is concrete: **use the evaluate window before November 2 to discover privileged pull-request workflows, remove unnecessary `pull_request_target` usage, and explicitly justify the workflows that still need it.**

## Related Observatory observations

For the Observatory's framework for separating evidence from interpretation, see [Signals Are Not Truth](/blog/signals-are-not-truth). For how the project reads GitHub activity without collapsing different metrics into one score, see [GitHub Activity Is a Signal, Not a Scoreboard](/blog/github-activity-is-a-signal-not-a-scoreboard). For the adjacent npm publishing-security change, see [npm's Stage-Only Tokens Put a Human Gate Between CI and Publication](/blog/npm-stage-only-tokens-human-approval).

## Sources & further reading

The primary evidence for this observation is GitHub's September 17, 2026 general-availability announcement and current GitHub Actions security documentation. GitHub Security Lab's earlier research provides independent technical context for why `pull_request_target` can become dangerous when privileged workflows execute untrusted pull-request code.
