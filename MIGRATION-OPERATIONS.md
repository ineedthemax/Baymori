# Baymori | Internal Website Migration Checklist

**Use for every transfer inquiry.** This is an internal operating procedure, not a promise of zero downtime. Do not ask clients to type passwords into Jotform or send them by email.

## 0. Intake and qualification
- [ ] Record lead and business contact from Jotform submission (only in approved workspace)
- [ ] Identify platform, hosting company, domain registrar, and business email provider
- [ ] Confirm site category: brochure, WordPress, commerce, membership, booking, custom
- [ ] Identify traffic, sales, critical forms, apps, payment systems, DNS services, and site size
- [ ] Determine requested outcome: move as-is, rebuild, or manage in place
- [ ] Decide preliminary path: **compatible migration / rebuild quote / manage-in-place / decline**
- [ ] Confirm who owns the domain, website and content, and who can authorize changes

## 1. Assessment and proposal
- [ ] Audit public pages, technology, responsiveness, uptime issues, link structure, SEO metadata
- [ ] Verify whether the application stack can run in target hosting (e.g., dynamic WordPress requires PHP/database-compatible infrastructure)
- [ ] Inventory webhooks, forms, cron jobs, redirects, CDN, SSL, backups, and ecommerce integrations
- [ ] Assess email risks: MX, SPF, DKIM, DMARC, mail routing
- [ ] Identify third-party licenses and plugin/theme permissions
- [ ] Document material risks, technical unknowns, potential downtime, and rollback feasibility
- [ ] Prepare fixed deliverables, exclusions, migration price, monthly hosting/care scope, and timelines
- [ ] Obtain written approval, service agreement, and agreed payment terms before work

## 2. Secure access and backup
- [ ] Request delegated team access wherever supported, with least privileges
- [ ] Use an approved password manager for any unavoidable credential sharing; enable MFA
- [ ] Verify authorized ownership and access to domain DNS, hosting, CMS, and backup location
- [ ] Create versioned backup of files, database, media, and relevant configuration (if permitted)
- [ ] Test backup completeness and restore approach in a safe environment
- [ ] Record existing DNS zone and TTL values; confirm email service remains intact
- [ ] Capture baseline page screenshots, redirect lists, indexed URLs, analytics and performance

## 3. Build or migrate to staging
- [ ] Create isolated staging environment; restrict indexing and public access appropriately
- [ ] Move code/assets/database via supported tools; handle secrets outside repository
- [ ] Update environment variables and destination-specific settings
- [ ] Verify SSL/TLS, domain routing, caching, redirects and error behavior
- [ ] Confirm page content, images, navigation, fonts, mobile behavior, and accessibility
- [ ] Test contact forms, emails, checkout and transaction flows using safe test modes
- [ ] Verify analytics, sitemap, robots, canonical tags, structured data, and SEO redirects
- [ ] Obtain client approval of staging before cutover

## 4. Cutover and rollback
- [ ] Schedule change window and communicate expected impact and contacts
- [ ] Record rollback owner, trigger conditions, steps, and maximum tolerated interruption
- [ ] Freeze changes if required; take a final backup/data sync for dynamic websites
- [ ] Make only approved DNS and infrastructure changes; double-check MX/TXT and DNSSEC
- [ ] Validate new site on real domain, HTTPS, forms, email, logins, and key transaction paths
- [ ] Monitor errors, redirects, site health and functionality during stabilization
- [ ] If critical checks fail, execute agreed rollback plan
- [ ] Do not cancel old hosting until the new platform and dependent services are verified

## 5. Handoff and ongoing care
- [ ] Provide completion report and changed-config summary
- [ ] Document access owners, backup/restore responsibility, support hours, escalation route
- [ ] Start client-approved subscription only when its activation conditions are met
- [ ] Record renewal dates, vendor charges, and maintenance exclusions
- [ ] Schedule initial post-migration check and ongoing monitoring under contracted plan

## Platform routing quick reference
- **WordPress:** Assess PHP/MySQL, plugins, admin, cron and dynamic functions. Do not assume Cloudflare Pages can host WordPress natively.
- **Wix:** Generally not exportable as a complete functional site to external hosting; quote a rebuild or offer management-in-place.
- **Squarespace:** Content export is limited; design and commerce may need rebuilding.
- **Shopify:** Prefer maintaining Shopify as the commerce backend unless a separately scoped architecture is approved.
- **Static/custom sites:** Verify framework, SSR, backend, API, database, uploads and deployment compatibility individually.

## Tracking fields (Notion or spreadsheet)
Lead ID | Client | Domain | Platform | Registrar | Email provider | Complexity | Migration path | Risk level | Estimate | Proposal status | Access status | Backup status | Staging URL | QA status | Cutover approval | Go-live date | Support plan | Owner

**Access policy:** no passwords in forms, project notes, chat transcripts or source control. No DNS, billing, or production changes without explicit client approval.
