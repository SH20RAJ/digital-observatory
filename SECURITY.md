# Security Policy

## Reporting a vulnerability

Please do not disclose security vulnerabilities in public issues.

Use GitHub's private vulnerability reporting/security advisory mechanism when available.

If private reporting is unavailable, contact the maintainers through a private channel before public disclosure.

## Data-source security

Collectors must never:

- bypass authentication
- bypass CAPTCHAs
- evade access controls
- collect secrets or private data
- expose API credentials
- commit tokens or credentials

## Secrets

Use environment variables or GitHub Actions secrets.

Never commit:

- API keys
- access tokens
- database credentials
- private cookies
- personal authentication material
