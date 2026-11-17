# Ask Baymori

Implemented a guided homepage assistant with business and creator paths, service and goal choices, platform selection, optional name and notes, editable project brief, preset service answers, email draft and copy actions. Answers remain in component memory. No API calls, external model, browser storage, credentials or new paid service are involved.

The assistant is explicit about being guided and using preset answers. It cannot review websites, quote prices, confirm compatibility, guarantee a schedule or send inquiries. Existing approved 50/50 website-build payment terms are included. Care limits remain subject to an agreement.

The email action prepares a draft to max@kijijimgmt.com. The visitor must send it. Copy fallback supports users without a configured email app. Unknown questions are referred to project notes for human review. Email-client handling is outside the website.

Validation: TypeScript, static production build, static asset verification and nine assistant logic checks passed. Desktop and mobile rendered interaction testing is still required: the bundled browser executable is missing and the system Chromium fails to launch in this environment. Check 320/390/768/1440 widths, keyboard open/close/Escape/back/edit/reset, creator and business branches, copy denial and email draft content before deployment.

This implementation is local and is not deployed. Reliable server-side inquiry delivery remains a separate unfinished integration. No existing production Worker was modified.
