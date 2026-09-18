# Methodology

The Observatory is built around transparent measurement.

## Observation model

Every observation should separate four layers:

### 1. Measurement

What the source directly reports.

Example:

> Repository X had 14,200 stars at collection time.

### 2. Derived metric

A deterministic calculation.

Example:

> Stars increased by 18.4% over seven days.

### 3. Context

Other documented events occurring around the same period.

Example:

> A major release occurred two days before the increase.

### 4. Interpretation

A cautious explanation of what the evidence may suggest.

Interpretation must not be presented as measurement.

## Signal types

### Growth

Change in a metric over a defined period.

```
growth = current_value - previous_value
```

Percentage growth:

```
growth_rate = (current - previous) / previous
```

If the baseline is zero, report absolute change rather than an undefined percentage.

### Acceleration

Change in the rate of change.

### Activity

A documented count of events such as releases, commits, contributors, or publications.

### Attention

A source-defined measure of public discussion. It must never be described as equivalent to quality or importance.

### Novelty

A measure of how recently an entity/event entered the Observatory's tracked universe.

## Composite indicators

Composite indicators may eventually be used, but they must:

- publish their formula
- publish component metrics
- disclose missing data
- avoid implying objective quality
- include a timestamp and version
- remain reproducible

## Anomaly detection

An anomaly is a statistical property of a measurement, not proof that something important happened.

A signal may trigger when:

- a metric exceeds a historical percentile
- a short-term growth rate deviates from baseline
- several independent sources change together
- a new entity rapidly enters a tracked ecosystem

An anomaly should trigger **investigation**, not automatic publication.

## Uncertainty

Articles should explicitly distinguish:

- observed
- calculated
- reported by a source
- inferred
- unknown

Avoid causal language unless supported by evidence.

## Editorial rule

The stronger the claim, the stronger the evidence required.

A useful test:

> Could a reader reproduce or challenge this claim using the cited evidence?

If not, improve the sourcing or weaken the claim.
