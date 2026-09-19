---
title: "GitHub Actions' Node 20 Removal Turns Action Maintenance Into a September Deadline"
description: "GitHub will remove the Node 20 runtime from GitHub-hosted Actions runners on September 23, 2026, making action runtime compatibility a separate concern from the Node version used by the application itself."
excerpt: "The upcoming GitHub Actions change affects the JavaScript runtime used by Actions themselves, not the Node version your application runs in."
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
status: published
category: Developer Infrastructure
tags:
  - GitHub Actions
  - Node.js
  - Node 24
  - CI/CD
  - DevOps
  - developer tooling
author: Digital Observatory
authorRole: Developer Infrastructure
featured: false
coverImage: ""
coverAlt: "GitHub Actions workflow showing JavaScript action runtime migration from Node 20 to Node 24"
keywords:
  - GitHub Actions Node 20 removal
  - GitHub Actions Node 24
  - September 23 2026 Node 20
  - JavaScript actions runtime
  - GitHub Actions migration
canonicalUrl: "https://observatory.campusloop.space/blog/github-actions-node20-removal-node24"
noIndex: false
sources:
  - label: "GitHub Changelog — Node 20 deprecation on Actions runners"
    url: "https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
    note: "Primary GitHub lifecycle announcement, updated August 25, 2026, specifying the September 23, 2026 removal date and Node 24 migration guidance."
  - label: "GitHub Actions — upload-artifact Node 24 migration example"
    url: "https://github.com/actions/upload-artifact/actions/runs/23194842454"
    note: "Public GitHub Actions evidence showing a maintained official action migrating to Node 24 and the runner warnings encountered during the transition."
  - label: "Lionster — independent Node 20 removal analysis"
    url: "https://lionster.tech/blog/the-tools-that-ship-your-app-lose-their-engine"
    note: "Independent September 2026 explanation distinguishing an application's Node runtime from the Node runtime embedded in JavaScript Actions."
  - label: "Wiztechnoz — migration guidance"
    url: "https://wiztechnoz.com/blog/how-to-fix-github-actions-before-node-20-is-removed"
    note: "Independent September 2026 guidance covering the temporary opt-out and self-hosted runner considerations."
---

**GitHub will remove Node.js 20 from GitHub-hosted Actions runners on September 23, 2026, so teams need to audit the JavaScript Actions used by their workflows even if their own application already runs on Node 24, Python, Go, or another runtime.** This is a tooling-runtime migration, not an application-runtime migration. [GitHub](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)

## The important distinction: your app is not the Action

A GitHub Actions workflow can run a Node.js application, but the Actions themselves are also programs.

For example:

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- run: npm ci
- run: npm test
```

The `run` command executes your application tooling. The `uses:` steps execute Actions, many of which are JavaScript programs running on a Node runtime supplied by the GitHub Actions runner.

The upcoming removal targets that second layer.

So a repository can have:

```text
application runtime: Node 20 / Node 22 / Node 24

        different layer

GitHub Action runtime: Node 20 → Node 24
```

Updating `package.json` alone does not guarantee that every Action is compatible.

## What GitHub is changing

GitHub's changelog says Node 24 became the default JavaScript Actions runtime on GitHub-hosted runners beginning June 16, 2026. Node 20 remains available temporarily through an opt-out environment variable, but GitHub says that escape hatch ends when Node 20 is removed from runners on September 23.

The relevant controls are:

- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` can be used to test Node 24 before the default migration.
- `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION` temporarily allows continued Node 20 execution after the default changed.
- The latter is explicitly temporary and stops helping once Node 20 is removed.

This creates a short period in which workflows can appear healthy while still depending on the old runtime.

## Why old Actions can break even when the repository is healthy

A JavaScript Action is packaged with assumptions about the runtime APIs available to it.

If an old Action depends on Node 20 behavior, modules, native dependencies, or unsupported platform assumptions, the application code can remain completely correct while the workflow fails before the application's own tests begin.

That makes the failure mode particularly confusing:

```text
source code
   ↓
checkout Action
   ↓
setup Action
   ↓
build Action  ← runtime incompatibility can fail here
   ↓
application tests
```

The repository may not have changed at all. The runner environment changed underneath it.

## The migration is already visible in the ecosystem

Public GitHub Actions repositories have been migrating to Node 24 throughout 2026. For example, the official `actions/upload-artifact` repository has a public workflow showing a Node 24 migration, while the runner surfaced warnings about other Actions still using Node 20. [GitHub](https://github.com/actions/upload-artifact/actions/runs/23194842454)

That makes the change more than a theoretical deadline. The ecosystem has already been moving the underlying runtime.

## What to audit before September 23

The useful audit target is every `uses:` reference in workflow files.

Start with:

```text
.github/workflows/*.yml
.github/workflows/*.yaml
```

Then inventory:

1. third-party Actions;
2. reusable workflows;
3. pinned Action versions;
4. organization-level Actions policies;
5. self-hosted runner images;
6. custom JavaScript Actions owned by your team.

For each JavaScript Action, check its repository or release notes for Node 24 compatibility.

The version tag alone is not enough. An Action can keep the same major version while changing the runtime declared in its `action.yml` or build configuration.

## Self-hosted runners are a separate case

GitHub's change is easiest to understand for GitHub-hosted runners, where GitHub controls the installed runtimes.

Self-hosted runners have additional variables. GitHub notes that Node 24 is incompatible with macOS 13.4 and lower versions, and that ARM32 self-hosted runners will no longer be supported after the Node 20 deprecation.

That means a self-hosted environment needs an infrastructure audit as well as an Action audit.

A useful inventory is:

```text
runner OS
runner architecture
runner version
JavaScript Action versions
custom Actions
container images
```

The objective is to distinguish an Action-runtime problem from a runner-host compatibility problem.

## Do not treat the opt-out as the migration

The temporary `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true` setting is useful for emergency continuity, but it is not a durable fix.

GitHub explicitly limits the workaround until Node 20 is removed.

Using it indefinitely creates a false sense of stability because the workflow still depends on the runtime that is scheduled for removal.

The better sequence is:

```text
force Node 24 in testing
        ↓
find incompatible Actions
        ↓
upgrade / replace / rebuild
        ↓
run full CI matrix
        ↓
remove temporary opt-out
```

## Custom Actions need special attention

Organizations that maintain their own JavaScript Actions have the most direct migration work.

Check:

- the `runs.using` field in `action.yml`;
- dependencies and native modules;
- test coverage on Node 24;
- build artifacts committed or generated during release;
- and any documentation that assumes Node 20.

A custom Action that declares an old runtime can become a single point of failure for every repository that consumes it.

That is why the migration has a supply-chain-like property inside CI: one shared Action can break many otherwise independent application repositories.

## The connection to software delivery is broader

The Observatory's [GitHub Copilot task-efficiency analysis](/blog/github-copilot-task-level-agent-efficiency) looks at how developer tooling changes the economics of software work. GitHub Actions adds a different dimension: automation itself has runtime dependencies that need lifecycle management.

Likewise, [Git branching and commit history](/blog/git-branching-and-commit-history) explains the source-control layer that feeds CI. The Node 20 removal sits after that layer: the repository graph can be correct while the automation environment that processes it becomes incompatible.

This is a useful mental model for modern development infrastructure: **CI is software, and software has a runtime lifecycle.**

## What teams should measure

A migration should not stop at "the workflow is green."

Record:

- workflow success rate before and after migration;
- median and p95 job duration;
- failed Action initialization;
- cache behavior;
- self-hosted runner compatibility;
- and any differences in build artifacts.

For critical deployment workflows, run a parallel validation window before the deadline rather than discovering incompatibility on September 23.

## Limitations and uncertainty

GitHub's removal date and supported runtime policy can change, so the GitHub changelog is the authoritative source for the current deadline. Third-party Actions can have their own compatibility schedules and release practices.

Not every Action is necessarily a JavaScript Action, and not every workflow using Node commands is affected in the same way. The relevant question is whether the Action itself depends on the runner-provided Node runtime being removed.

## Why this is meaningfully new

The Observatory already covers developer tooling and AI-assisted engineering. This signal adds a concrete **CI runtime lifecycle boundary**: a GitHub-hosted runner can change underneath a stable repository, making Action compatibility an operational dependency independent of the application's programming language.

The September 23 deadline makes that otherwise invisible dependency measurable and actionable.

## Sources and further reading

- [GitHub Changelog — Node 20 deprecation on Actions runners](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)
- [GitHub Actions — upload-artifact Node 24 migration evidence](https://github.com/actions/upload-artifact/actions/runs/23194842454)
- [Lionster independent analysis](https://lionster.tech/blog/the-tools-that-ship-your-app-lose-their-engine)
- [Wiztechnoz migration guidance](https://wiztechnoz.com/blog/how-to-fix-github-actions-before-node-20-is-removed)
