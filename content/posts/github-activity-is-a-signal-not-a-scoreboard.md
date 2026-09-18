---
title: GitHub Activity Is a Signal, Not a Scoreboard
description: A practical framework for reading repository activity without turning public metrics into simplistic rankings.
excerpt: Commits, pull requests, releases, issues, stars, and contributors describe different parts of project activity. They should not be collapsed into one magic number.
publishedAt: "2026-09-12"
updatedAt: "2026-09-12"
status: published
category: Open Source
tags:
  - GitHub
  - open source
  - developer ecosystems
  - signals
author: Digital Observatory
authorRole: Open Source Research
featured: false
coverAlt: GitHub activity signals branching into different dimensions of project activity
keywords:
  - GitHub activity
  - open source metrics
  - repository analytics
  - developer ecosystems
noIndex: false
sources:
  - label: GitHub REST API
    url: https://docs.github.com/en/rest
    note: Official API reference for public repository data.
  - label: GitHub GraphQL API
    url: https://docs.github.com/en/graphql
    note: Useful for related public entities and structured queries.
---

GitHub makes software activity unusually visible.

That visibility is valuable for research, but it also creates a temptation: turn every repository into a score.

Stars become popularity. Commits become productivity. Contributors become health. Pull requests become velocity.

Those measurements are real. The problem is that they answer different questions.

## Commits describe recorded change

Commits tell us that changes were recorded. They do not, by themselves, tell us whether those changes were useful, well-reviewed, or important to users.

Commit volume can be affected by workflow conventions, automation, rebases, generated files, and release processes.

## Pull requests reveal interaction

Pull requests can show review activity, coordination, and proposed changes.

But a repository with few pull requests may be stable, small, or maintained outside GitHub. Again, context matters.

## Stars are attention, not adoption

A star is an observable expression of interest on GitHub.

It is not a reliable standalone measure of production use. Reading stars as a complete adoption metric compresses too much uncertainty into one number.

## Better questions produce better analysis

Instead of asking whether one repository is “better,” ask narrower questions:

- Is contribution activity changing?
- Is the contributor base broadening or concentrating?
- Are releases becoming more frequent?
- Are issue and pull-request cycles changing?
- Are independent signals moving together?

These questions lead to more defensible comparisons.

## A repository is a system, not a score

Good observatory work treats GitHub metrics as a collection of signals.

A useful article should show the measurement window, source, definition, limitations, and relevant context.

The point is not to create a leaderboard.

The point is to make the ecosystem easier to understand.
