# Baymori Lead Flow and Client Operations — Implementation Blueprint

**Status:** Architecture proposal. The native forms in this branch are UI staging, not production-ready submissions. Do **not** merge this branch until submission, anti-spam, durable storage, delivery, and failure alerts are implemented and tested. Jotform remains available as a backup.

## Strategic position

Start with the tools each client already uses. Audit existing CRM, calendar, forms, email, project management and analytics; map gaps; only replace tools when necessary. Baymori builds the connection and documents the support boundary. The customer retains ownership of domain, contact lists and client data.

## Website lead capture v1

- Native project inquiry and transfer assessment forms, first name first, then relevant service/site details, contact information, consent.
- Both currently POST to /api/inquiries. **This endpoint does not exist on the static-export site.**
- Current Next.js config uses `output: "export"`. Next.js API Routes or route handlers aren't deployed as a runtime with the static export alone. Do not assume a source `app/api` directory can receive live requests.
- Implement a Cloudflare Worker entrypoint using Workers Static Assets with API routes, or a separately deployed API Worker only after deliberate architecture review; keep existing `baymori-website` Worker target, never silently switch to Pages.
- The server validates allowed fields, length, types, email address, required consent and origin; verify Cloudflare Turnstile token server-side; reject obvious bot patterns and apply rate limits.
- Use an idempotency key to avoid duplicated leads on retries. Record every accepted inquiry in Cloudflare D1 before acknowledging success. Limit personal data collection and avoid passwords/card details.
- Queue notifications via Cloudflare Queues where feasible, or use a durable retry/outbox pattern in D1. Email delivery provider (e.g. Resend) requires a verified domain, credentials kept in Cloudflare secrets, delivery monitoring and agreed quotas.
- Send the prospect a polite acknowledgement, alert Baymori of a new lead, and route the lead to a tracking record. Do not label as delivered until provider acceptance. Record failures, retries, and terminal alert states.
- Set up a daily check on 'stuck' jobs and a manual resend mechanism.
- Include privacy notice/retention policy and prevent unnecessary PII from entering app logs or public analytics.
- Load-test and test invalid input, duplicate submit, unreachable email provider, blocked spam, and mobile accessibility. Do not remove Jotform fallback until end-to-end tests pass.

## The operational command center

**Use a Notion workspace initially**, not a custom multi-tenant CRM. Notion is for internal records and actions; it is not a replacement for automated uptime, form processing, or billing.

### Core databases, deliberately few

1. **Clients:** name, contact, website, client type (business/creator), owner, account status (lead / discovery / proposal / onboarding / active / paused / offboarded), plan, monthly fee, billing start, next check-in.
2. **Systems:** relates to client, website/domain, hosting provider, repo, integration, owner of access, dependency, renewal date, monitoring link, backup policy, last review, health (healthy / attention / incident / unknown).
3. **Requests & incidents:** relates to client and system, type, severity, owner, state (new / triaging / in progress / waiting on client / resolved), opened/updated timestamps, due date, hours/credits used, incident notes.
4. **Delivery & revenue (optional initially):** proposal accepted, project invoice status, recurring payment status, care-plan renewal; payment data stays in payment provider, not copied manually.

### Dashboard views

- Today: urgent outages, failed submissions, overdue requests and pending client approvals.
- Accounts: onboarding, active, paused, offboarded.
- Health: systems in attention/incident/unknown, and time since last health check.
- Revenue: contracted MRR and upcoming renewals, reconciled with billing platform.
- Weekly review: support load, unresolved incidents, overage hours and failure trends.

### Monitoring and alerts

- Website reachability, SSL expiry and domain expiry: external uptime/domain monitor, checks from outside Cloudflare.
- Cloudflare Worker error rate / deployment failures: Cloudflare Observability and alerting, where plan allows.
- Lead-flow health: daily synthetic form check using a safe test endpoint, delivery failure and backlog alerts, and count of new leads vs notifications delivered.
- Integrations: record last success timestamp, last failure and assigned owner. Avoid sharing raw customer personal information in alerts.
- Alert destinations: owner email initially; later team Slack. Route P1 outages immediately and routine issues to a daily digest.
- Set specific incident response expectations in customer contracts; monitoring existence isn't a 24/7 response guarantee.

## Operating sequence

1. Incoming lead is stored in D1; notification goes to Baymori and optionally creates an internal Notion lead record via a guarded integration.
2. Owner qualifies the lead and audits existing tools before proposing solutions.
3. Signed scope establishes platform support, data ownership, backups, external costs, working hours, incident priority and ongoing maintenance.
4. Onboarding inventory links client's existing accounts and tools, plus monitoring, with access granted through delegated permissions.
5. Each new client has one Notion record; every managed system and active issue is linked to the client.
6. Daily alerts identify urgent items. Weekly review covers open work, renewals, costs and exceptions. Monthly reports cover service delivered, incidents and time allowances.

## Commercial boundaries

- Monthly Essential and Business website care do not include open-ended AI automations or integration rebuilds.
- Initial lead-flow audit and implementation are separately scoped projects.
- Workflow monitoring, vendor/API changes and ongoing break-fix have their own monthly service scope and volume limits.
- Third-party subscriptions generally remain on customer-owned accounts; Baymori gets delegated access.

## Release gate for this branch

1. Implement Cloudflare-compatible server handler and secure storage.
2. Set up Turnstile, email provider, secrets, notification delivery with retries and audit trails.
3. Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm run verify:static`, and `npx wrangler deploy --dry-run --config wrangler.jsonc` locally or in CI.
4. Test success and failure paths end-to-end from a nonproduction preview and validate the mobile UX.
5. Only after acceptance merge into `main`, which auto-deploys to Cloudflare.
