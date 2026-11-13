import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfer Your Website | Baymori",
  description: "Request a free Baymori website migration assessment. We'll review your current platform and recommend a safe way to move or manage your website.",
};

const FORM_URL = "https://form.jotform.com/263155490983062";

export default function TransferPage() {
  return (
    <main className="transfer-shell">
      <header className="transfer-topbar">
        <a href="/" aria-label="Baymori home"><img src="/brand/baymori-horizontal-black.webp" alt="Baymori" /></a>
        <a href="/">Back to Baymori ↗</a>
      </header>
      <div className="transfer-main">
        <div className="transfer-intro">
          <span className="transfer-kicker">BAYMORI / WEBSITE MIGRATION</span>
          <h1>Switch hosting.<br /><em>Keep moving.</em></h1>
          <p>Already have a website? Tell us where it lives. We'll look at your current setup and recommend a sensible transfer, rebuild, or management plan before any changes are made.</p>
        </div>
        <div className="transfer-benefits">
          <article><strong>Start with an assessment</strong><p>We review compatibility before recommending migration or a rebuild.</p></article>
          <article><strong>Protect what works</strong><p>Website, domain, email, and business-critical integrations are considered.</p></article>
          <article><strong>Stay in control</strong><p>Nothing is transferred or reconfigured without a defined scope and approval.</p></article>
        </div>
        <section className="transfer-form-section" aria-label="Migration assessment request">
          <div className="transfer-form-head"><h2>Tell us about your website.</h2><p>Complete the short form below. No passwords or payment information needed.</p></div>
          <iframe className="transfer-form-frame" title="Baymori website migration assessment form" src={FORM_URL} loading="lazy" />
          <div className="transfer-form-footer"><a href={FORM_URL} target="_blank" rel="noopener noreferrer">Open the form in a new tab ↗</a><p>Submitting this form requests an assessment. It does not authorize a transfer or guarantee zero downtime.</p></div>
        </section>
        <section className="transfer-how" aria-labelledby="transfer-how-title"><h2 id="transfer-how-title">Here's how it works.</h2><div className="transfer-how-grid">
          <article><span>01 / REQUEST</span><h3>Tell us what you have</h3><p>Share your site address, current platform, and what you want to change.</p></article>
          <article><span>02 / REVIEW</span><h3>We map the options</h3><p>We assess technical fit and flag risks involving email, DNS, or functionality.</p></article>
          <article><span>03 / APPROVE</span><h3>Confirm your scope</h3><p>Review the recommendation, estimated cost, and timeline before work begins.</p></article>
          <article><span>04 / MOVE</span><h3>Make the transition</h3><p>We prepare staging and backups, test the site, then coordinate cutover.</p></article>
        </div></section>
        <p className="transfer-warning">Some hosted builders, including Wix and Squarespace, cannot be moved as a complete functioning website to unrelated hosting. Those requests may require rebuilding or keeping the current platform. Do not cancel existing hosting until your migration is verified.</p>
      </div>
      <footer className="transfer-footer">© {new Date().getFullYear()} Baymori. Digital infrastructure, built for growth.</footer>
    </main>
  );
}
