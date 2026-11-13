# Baymori Cloudflare deployment readiness — November 12, 2026

## Deployment status: NOT DEPLOYED

**Target:** existing Cloudflare Worker `baymori-website` (not `nodera`). No Cloudflare writes were performed.

## Evidence from the uploaded source

- **Framework:** Next.js 15 (`app/` router), React 19, TypeScript and Tailwind 4.
- **Package manager:** npm, based on package.json. No package-lock.json was included in the uploaded ZIP.
- **Architecture:** Static export. `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and unoptimized images. No API routes, dynamic server handlers, or server-only data fetching were found. Public forms are Jotform embeds.
- **Pages:** `/` and `/transfer/`. Images in `public/brand/`.
- **Initial config gap:** No `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml` existed in the uploaded source.
- **Cloudflare read-only check:** Existing `baymori-website` Worker was found; it has no asset bundle and no bindings. Existing `nodera` Worker was also found and was not touched. `baymori-website` had compatibility date 2026-11-12.

## Local-only changes in this audited package

1. Added `wrangler.jsonc`, targeting **only** the exact Worker name `baymori-website`, serving `./out` as Workers Static Assets. No `main` Worker entry point or additional Cloudflare products are configured.
2. Added Wrangler to dev dependencies to support reproducible CLI commands.
3. Added `scripts/verify-static.mjs` and the `npm run verify:static` script to check expected exports and embedded intake links.
4. Added a `typecheck` script. Existing `npm run lint` already runs `tsc --noEmit` (it does not perform ESLint checks).
5. The design and application pages were not changed.

## Checks and limitations

| Check | Result |
| --- | --- |
| Source inventory, package, config, routes, client components | Inspected |
| Static vs server runtime | Static export confirmed in configuration |
| Cloudflare target Worker exists | Confirmed read-only via Cloudflare connector |
| Separate `nodera` Worker left alone | Confirmed no mutations performed |
| New Wrangler JSONC syntax and target name | Locally parsed/checked |
| Verification script syntax | Passed `node --check` |
| `npm install` in this sandbox | Timed out (network / environment restriction) |
| `npm run lint`, `npm run typecheck`, `npm run build` in this sandbox | Blocked by unavailable dependencies |
| Static `out/index.html` in uploaded ZIP | Not present: generated output was not included |
| Local Worker server / browser tests | Not run, because build is unavailable here |
| Wrangler CLI dry-run | Not run, because Wrangler could not be installed here |

**Important independent evidence:** The user's previous Mac Terminal screenshot displayed a successful Next.js 15 build, static pages for `/` and `/transfer`, and `Static export ready`. That is good evidence that the earlier source built on the user's Mac, but it is not a substitute for rerunning checks on this updated local package.

## Safe verification on the user's Mac — all local / nonproduction

In the folder containing package.json:

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run verify:static
npx wrangler deploy --dry-run --config wrangler.jsonc
```

Before authorizing any real deployment, review current Worker settings/routes/domains and back up the Hello World version in the Cloudflare dashboard for rollback. Wrangler can replace configuration managed in the dashboard. Confirm `wrangler whoami` refers to the correct Cloudflare account. Validate the live Jotform submissions in a test session and visual layout on mobile/desktop.

## Production-changing command (DO NOT RUN until explicit approval)

```bash
npx wrangler deploy --config wrangler.jsonc
```

Because `wrangler.jsonc` sets `"name": "baymori-website"`, the command targets the **existing** Worker of that exact name, instead of creating a `baymori-site` Pages project or touching `nodera`. This command is a production change; it is intentionally **not executed**. Only run it after the checks above pass and the user explicitly approves deployment.

## Outstanding blocker

A fresh installation + build, static asset verification, dry run and local preview must be completed on the user's Mac. Verify the actual Cloudflare account and current Worker routing/settings before production deployment.
