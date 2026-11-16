# Baymori existing-site audit and upgrade

Scope: existing source on the security/test-readiness baseline, not a new site. Uploaded skill references read in requested order. Impeccable context loaded successfully on retry. Its mechanical detector ran on the changed sources and returned exactly two warnings: overused-font at globals.css line 1 (Google Fonts Geist import) and line 5 (Geist font-family). Both were addressed by switching to Public Sans. Findings below also include the separate source-reviewed audit. No PRODUCT.md or DESIGN.md exists. Browser rendering and touch/keyboard interaction are not verified in this executor.

## Initial Impeccable findings

Provisional source-only scores: accessibility 2/4, performance 2/4, theming 2/4, responsive 2/4, implementation integrity 2/4. Total 10/20. This is not a WCAG certification or rendered audit score.

- P0: saved intake and inbox delivery are unconfigured; default form composes mail only. Preserved honest fallback. Real delivery gate remains open.
- P1: hero scroll-scatter motion and 155svh container exceed requested subtle-motion scope. Replaced only the hero's animated presentation with an ordinary branded heading and retained its main message.
- P1: hero fails to name maintenance and both audiences. Added explicit category/audience description using the user's finish line.
- P1: service categories and public prices conflict with requested finish line. Four requested categories and pricing placeholders now present; removed monetary prices from public service terms too.
- P1: work-examples section absent. Added clearly labeled pending-publication section; no invented work or outcomes.
- P2: service-arrow hit area 34px. Raised to 44px.
- P2: mobile network selector positioned over heading/content. Moved into normal flow on narrow screens.
- P2: broad heading tracking near -.067em. Limited main display tracking to -.035em.
- P2: continuous network-path animation and 5px card lifts. Removed; no parallax, bounce or continuous reveal loops added.
- P2: inconsistent keyboard focus across links/buttons/summary. Added global visible focus outlines.
- P2: repeated kicker labels and noninformative service numbering. Removed homepage kickers and service numbering. Process numbers retained because order matters.
- P2: service body type 13px and dense spacing. Raised to 15px and 1.6 line height.
- P3: mixed hardcoded colors, repeated radius/shadow treatments and multiple CSS override layers. Adjusted affected cards but did not rewrite the stylesheet or invent dark mode.

## Design-taste review

Preserved copper, white, existing logo, page order and substantive offer. Generic patterns identified: oversized abstract slogan without a concrete category line; repeated split headings with colored second lines; all-caps tracked kickers; numbered icon cards with identical layouts; rounded bordered panels plus soft shadows; featured-plan gradient. Fixed category clarity, kickers, numbering, excessive tracking and affected card elevation/gradient. Retained the existing section compositions instead of replacing the site with the skill's starter or randomly dealt design. No fake photography, testimonials, revenue figures or case-study results added.

## Motion

GSAP React cleanup and animation-on-scroll observer patterns applied: dynamically imported GSAP, scoped context, one-shot IntersectionObserver, 12px rise plus opacity, .5s power2.out, teardown of observers/tweens. Reduced-motion disables reveal setup and reverts active tweens on preference change. Content is visible without JS. No service-card scrub, parallax or bounce. Original dot-field file remains available but is not mounted on the homepage.

## Finish line

- PASS: hero names websites/maintenance, businesses/creators and one hero Start a project CTA.
- PASS: Website builds, Website updates, Hosting, Monthly maintenance with Pricing coming soon.
- PASS, PLACEHOLDER: Work examples section exists; approved project assets/details still needed.
- PASS: process section retained.
- FAIL: contact form present but end-to-end delivery not verified. Mail draft requires visitor to send; backend activation remains separate.
- PASS on source scan: no em dashes in app copy.
- PASS on source review: no invented testimonials, statistics or results.
- NOT VERIFIED: rendered mobile layouts, physical touch gestures, keyboard behavior and real inbox receipt.

## Link check boundaries

Static route and fragment checks cover exported HTML internal hrefs. mailto syntax can be checked but is not proof of delivery. Existing ordinary outbound links must be checked without sending messages or making payments. No production deployment is included in this pass.

Internal links: 94 anchor links across 9 exported HTML pages checked, with zero missing route/fragment targets. The only email destination is max@kijijimgmt.com; inbox receipt not tested.

Contrast check: original copper #B86D49 against white is 3.95:1, below AA for normal button text. Button background changed to #975334 (5.83:1). Low-contrast fineprint/secondary text selectors darkened. Remaining combinations need rendered review.
