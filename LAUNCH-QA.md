# Baymori launch quality assurance

## Verified in source
- Primary project inquiry uses https://form.jotform.com/263155617068057.
- Transfer assessment uses https://form.jotform.com/263155490983062.
- Homepage CTAs and service cards route to contact or the dedicated /transfer route.
- Forms include direct-open fallback links.
- The original Dot Field hero is still used in React.
- Responsive styling, reduced-motion media queries, accessible form iframe titles and mobile menu control exist.
- Added keyboard skip link and extra narrow-width safety styling.

## NOT verified
- End-to-end form submission and notification email receipt. Must test in Jotform account.
- Live embedded form rendering, because cross-site frame settings and network are not verified here.
- Next.js production build; npm dependency installation timed out in this environment.
- Real browser visual quality on devices; automated screenshot attempt timed out.
- Custom domain, SSL, DNS, uptime, billing, analytics or live Cloudflare deployment.

## Before publishing
1. `npm install` then `npm run lint` and `npm run build` in a network-enabled development environment.
2. `npm run dev`, inspect desktop 1440, tablet 768, phone 390 and narrow phone 320 widths.
3. Check hero particle performance, scroll transitions, keyboard navigation, reduced-motion, menu toggling and input focus.
4. Submit a test inquiry to both Jotforms. Verify submission storage, owner notifications, confirmation messages and spam measures.
5. Verify external forms are allowed to embed; direct-open fallback must remain visible.
6. Check website domain ownership, Cloudflare DNS and SSL after deployment. Do not change live DNS until approved.
7. Configure search indexing after production hostname is confirmed; set canonical metadata, open graph and sitemap URLs then.
8. Review privacy policy, data handling, service terms, consent wording and claims before accepting live leads.
9. Connect analytics and Search Console with permission.

No production deployment was performed.
