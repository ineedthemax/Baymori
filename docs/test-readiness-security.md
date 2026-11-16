# Baymori test readiness and security

Audit date: 2026-11-16. Base: main 1de4a61. This branch does not deploy, merge, collect real leads, send messages or alter nodera.

## What is built

- Current email-draft experience preserved by default. `NEXT_PUBLIC_INTAKE_ENABLED=true` selects saved intake; build also needs the public Turnstile site key.
- Isolated staging Worker configuration and forward D1 migration, bot validation with hostname/action checks, same-origin checks, per-IP rate limiting, streamed body cap, schema/consent validation and parameterized SQL.
- Atomic inquiry/outbox persistence, payload-aware request idempotency, leased retry jobs, finite attempts and dead-letter status. No prospect auto-email to arbitrary supplied addresses. Team alerts contain a reference, not prospect details.
- Operator-controlled one-lead staging-to-Notion sync using the existing Clients schema. Dry run by default; apply requires a separate narrow Notion integration. Not automatic; one operator at a time. On an ambiguous creation failure reconcile the inquiry reference in Notion before rerunning, because the provider does not provide atomic uniqueness here.
- Hash-based script CSP and baseline security headers for exported HTML, including Turnstile/font sources. Inline styles remain allowed for existing design. Hashes generated after every build; do not edit exported HTML afterwards. Browser/runtime verification is still required.
- Security regression tests against actual SQLite migrations and mocked external providers, generated Worker types, dependency override, CI checks and a read-only staging smoke command.
- Notion audit and pilot record templates in the Operations Command Center.

## Verification performed

Passed: clean npm ci; lint/typecheck; 18 security/SQLite/Notion-mapping tests; credential-pattern/current-tree scan; default and saved-intake static builds; static checks; staging Wrangler dry run; npm audit with zero reported vulnerabilities. Common credential/sensitive-filename patterns found no matches among 217 unique repository objects. CI action revisions are pinned.

Limitations observed: Wrangler local dev could not start because uv_interface_addresses is unavailable in this executor. Headless browser testing was attempted but Chromium could not create its process socket (Operation not permitted). No browser test passed, and the local Worker runtime was not exercised. Do not treat build success as UI, CSP or edge runtime validation.

See the PR and Notion audit for remaining command results. Local tests do not exercise real Cloudflare rate-limiter distribution, Turnstile, email inbox receipt, Notion integration credentials or browser challenge rendering. Resend HTTP acceptance is not delivery: `sent` / `delivered_at` in this v1 outbox mean provider accepted only. An inbox test is required.

The rate-limit binding is an abuse-reduction layer, not a strict global cap. Origin is a browser-origin control, not authentication. Never expose D1 reads through a new public route.

## Before staging activation

1. Confirm account 8097ee66502875cd838e6665becb587f, Worker baymori-lead-flow-staging and D1 baymori-leads-staging (835127cf-8468-41dd-95f9-a3bedcce13a0). Production is baymori-website; nodera is excluded.
2. Inspect D1 schema and migration history. The first migration was previously applied manually. Reconcile Wrangler tracking before applying 0002; never run a table rebuild against real data without a reviewed backup. 0002 removes prospect notification jobs deliberately; stage database was previously recorded empty, but recheck before applying.
3. Create a hostname-restricted Turnstile widget for staging. Store the secret only as a Worker secret. Do not use a test-secret bypass: real Siteverify hostname/action checking remains mandatory. Test keys return example.com and no action, so they cannot validate a live end-to-end run with this handler.
4. Configure RESEND_API_KEY as a Worker secret; RESEND_FROM_EMAIL as verified sender and ALERT_EMAIL as internal recipient. Enter credentials through provider/secret controls, never chat or Notion. Verify sender domain, sending permissions and actual inbox receipt.
5. Build with `NEXT_PUBLIC_INTAKE_ENABLED=true` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set to the staging public key. Run security checks before building. Set INTAKE_ENABLED=true only in staging after configuration. Frontend and Worker activation are separate switches.
6. Run local checks and dry run, then deploy only the staging config when authorized. `npm run smoke:staging` is read-only and expects the staging Worker to exist; it does not activate it.
7. Validate mobile/keyboard/browser behavior, CSP/Turnstile, error retries, saved data, inbox receipt, provider failure/recovery, rate limiting and alert routing with synthetic data. Capture timestamps and screenshots.

## Notion sync

`npm run sync:notion:staging -- --lead-id=UUID` reads a local staging inquiry without printing it. Add `--remote` only for staging D1. Add `--apply` only when ready to create/reconcile the Notion lead. Requires the operator's Wrangler authentication and NOTION_API_KEY environment variable on apply. Integration access should be limited to Clients; retrieve/create records only, no broad workspace sharing. Never use this CLI as a public endpoint.

The mapper preserves stage Lead, health Unknown and care None, with an inquiry reference and next action. It does not declare a contract, recurring fee, follow-up date or active service. Detailed records remain internal. Until sync is configured, an authorized operator can reconcile through connected Notion tools using the inquiry reference.

## Monitoring and dead letters

Logs emit only event codes and aggregate backlog counts. Configure provider log alerts or an independent monitor before claiming incidents are watched. External website checks and inbox synthetic tests are separate from the 5-minute notification retry cron. Log output alone does not notify a person. Dead letters require operator investigation; do not retry after the provider's 24-hour dedup window without checking acceptance. Keep scheduled batch sizes bounded.

## Highest-priority remaining gates

- Cloudflare account-wide MFA enforcement is false. Verify individual MFA, then owner-approved enforcement and membership review.
- GitHub branch protection unreadable through connector (403). Inspect required checks/review, deployment token scopes and default branch protection directly.
- Notion sharing and integration permissions not audited by these tools. No public client/incident records. Verify invitation, revocation and least privilege.
- No client portal authentication or tenant authorization exists in current main. The separate dashboard branch is a UI preview only. Do not connect private data until identity, server-side per-client authorization, session handling, IDOR/cross-client tests and recovery controls are implemented.
- Retention schedule, D1 backup/restore test, incident recipient and support terms require owner decisions. No automatic PII deletion was enabled.
- Payment/signature provider setup is not implemented by this branch. Use manual signed scope and provider test-mode payment evidence for the pilot; never mark paid from screenshots.
- Public service terms and draft agreement differ on hosting and Business allowance accounting. Resolve before real-client commitment.

## Sources

- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/turnstile/troubleshooting/testing/
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://developers.notion.com/reference/query-a-data-source

This is a scoped code/configuration review and testing foundation, not a guarantee of zero vulnerabilities or a completed penetration test.

## Existing Cloudflare preview repair

The existing Workers Builds preview command was failing because `wrangler preview` requires a previews block. Added an empty previews block to the static-only main configuration. It introduces no D1 binding, API route or secrets and does not deploy production. Preview URLs are public unless separately protected; this static preview contains no private client records. Both GitHub verification runs passed on the initial PR commit. The preview repair requires a new build result.
