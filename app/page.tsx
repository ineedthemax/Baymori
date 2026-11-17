"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X, Globe2, SearchCheck, Zap, ServerCog, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import ScrollReveals from "@/components/scroll-reveals";
import AnimatedHero from "@/components/animated-hero";
import { IntegrationNetwork } from "@/components/ui/integration-network";

import NativeInquiryForm from "@/components/inquiry-form";
import LegalFooter from "@/components/legal-footer";
import BaymoriAssistant from "@/components/baymori-assistant";

const services = [
  { icon: Globe2, id: "websites", number: "01", title: "Website builds", body: "Clean, fast, responsive websites that make it easier for customers to take the next step." },
  { icon: Check, id: "updates", number: "02", title: "Website updates", body: "Minor changes to existing text, images, buttons, and links, with a clear scope before work begins." },
  { icon: ServerCog, id: "hosting-service", number: "03", title: "Hosting", body: "A dependable home for your website, with setup and support tailored to your stack." },
  { icon: ShieldCheck, id: "maintenance", number: "04", title: "Monthly maintenance", body: "Technical checks and defined support for compatible websites under an agreed care plan." },
];

const process = [
  { n: "01", title: "Tell us what you need", body: "We learn about your website, your tools, and where your business is getting stuck." },
  { n: "02", title: "Get a clear plan", body: "We recommend the right scope and outline responsibilities before any work begins." },
  { n: "03", title: "Build, launch & support", body: "We implement, test, and help manage the solution under the agreed service plan." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <main id="top"><BaymoriAssistant/><a className="skip-link" href="#services">Skip to content</a>
    <header className="site-header">
      <nav className="site-nav wrap" aria-label="Main navigation">
        <a href="#top" aria-label="Baymori home" className="logo-link"><img src="/brand/baymori-horizontal-black.webp" alt="Baymori" /></a>
        <div className="nav-links"><a href="#services">Services</a><a href="#work">Work examples</a><a href="#integrations">Integrations</a><a href="#care">Monthly care</a></div>
        <a className="btn btn-copper nav-cta" href="#contact">Start a project <ArrowUpRight size={16}/></a>
        <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={23}/>:<Menu size={23}/>}</button>
      </nav>
      {menuOpen && <div className="mobile-menu" id="mobile-menu"><a href="#services" onClick={()=>setMenuOpen(false)}>Services</a><a href="#hosting" onClick={()=>setMenuOpen(false)}>Hosting & transfers</a><a href="#integrations" onClick={()=>setMenuOpen(false)}>Integrations</a><a href="#care" onClick={()=>setMenuOpen(false)}>Monthly care</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Start a project</a></div>}
    </header>

    <AnimatedHero/>
    <ScrollReveals/>

    <section id="services" className="section surface-white"><div className="wrap">
      <div className="section-head"><div><h2>Built for what<br/><em>comes next.</em></h2></div><p>From a better website to the systems behind it, Baymori gives growing businesses a practical partner for building and maintaining their digital presence.</p></div>
      <div className="service-grid">{services.map(({icon:Icon,id,number,title,body})=><article className="service-card" key={id}><div className="service-meta"><span className="service-icon"><Icon size={23} strokeWidth={1.65}/></span></div><div><h3>{title}</h3><p>{body}</p><p className="pricing-placeholder">Pricing coming soon</p></div><a href="#contact" aria-label={`Inquire about ${title}`} className="service-arrow"><ArrowUpRight size={20}/></a></article>)}</div>
    </div></section>

    <section id="hosting" className="section surface-cream"><div className="wrap hosting-grid"><div><h2>Switch hosting.<br/><em>Keep moving.</em></h2><p className="lead">Already have a website? We’ll look at your existing setup and recommend whether to transfer it, manage it in place, or rebuild it on a compatible platform.</p><div className="action-row"><a href="/transfer" className="btn btn-copper">Get a free migration assessment <ArrowUpRight size={16}/></a><a href="#contact" className="inline-link">Ask about hosting <ArrowRight size={17}/></a></div><p className="fineprint"><ShieldCheck size={15}/> No changes without your approval. Hosting options depend on your website platform and plan.</p></div>
      <div className="hosting-panel"><div className="panel-label">THE BAYMORI TRANSFER PROCESS</div>{[["01","Share your site","Tell us where it lives and what you want to change."],["02","We assess the setup","We review compatibility, email, DNS, and migration risk."],["03","You approve the plan","We agree on scope, cost, and launch steps before moving anything."]].map(([n,t,d])=><div className="hosting-step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><Check size={18}/></div>)}<div className="panel-foot">Migration and hosting care are scoped separately.</div></div>
    </div></section>

    <section id="care" className="section surface-white"><div className="wrap">
      <div className="section-head"><div><h2>A reliable site.<br/><em>A clear plan.</em></h2></div><p>Hosting and maintenance with defined support, designed for businesses and creators who want fewer website headaches. Every plan starts with a compatibility review.</p></div>
      <div className="care-grid">
        <article className="care-card"><div className="care-card-top"><span className="care-label">ESSENTIAL CARE</span><h3>Keep the essentials handled.</h3><p>For eligible websites that need dependable hosting and a technical point of contact.</p></div><div className="care-price">Pricing coming soon</div><ul><li>Managed hosting for one eligible website</li><li>SSL and hosting configuration oversight</li><li>Availability monitoring and routine technical checks</li><li>Hosting-related troubleshooting</li><li>Email support, response target within 2 business days</li></ul><p className="care-limit">Content edits, redesigns, and new features are quoted separately.</p><a className="btn btn-ghost" href="#contact">Ask about Essential <ArrowUpRight size={16}/></a></article>
        <article className="care-card care-card-featured"><div className="care-card-top"><span className="care-label">BUSINESS CARE</span><h3>Stay current as you grow.</h3><p>For active businesses and creators who need occasional updates without an open-ended retainer.</p></div><div className="care-price">Pricing coming soon</div><ul><li>Everything in Essential Care</li><li>Up to 60 minutes of minor edits per month</li><li>Monthly site health and basic form/link checks</li><li>Basic performance and search-health monitoring</li><li>Email support, response target within 1 business day</li></ul><p className="care-limit">Minor edits cover existing text, images, buttons, and links. Unused time does not roll over.</p><a className="btn btn-copper" href="#contact">Ask about Business <ArrowUpRight size={16}/></a></article>
      </div>
      <p className="care-disclaimer">Pricing coming soon. Compatibility and responsibilities are confirmed in a written scope. One plan covers one website. Response times mean acknowledgement and initial assessment, not guaranteed resolution. Third-party fees, migrations, new pages, redesigns, SEO campaigns, automations, and major feature work are separate. Backup and recovery coverage are defined in the agreement, not assumed.</p>
    </div></section>

    <section id="integrations" className="section surface-white"><div className="wrap">
      <div className="section-head"><div><h2>Less chasing.<br/><em>More doing.</em></h2></div><p>See how inquiries, follow-ups, bookings, and project details could move together. Switch between business and creator examples to explore what Baymori can help connect.</p></div>
      <IntegrationNetwork/>
      <div className="integration-summary"><div><h3>Good systems make follow-through easier.</h3><p>These are examples, not prebuilt automations. We'll map the right handoffs and confirm what's practical with the tools you already use.</p></div><a href="#contact" className="inline-link">Discuss your workflow <ArrowUpRight size={17}/></a></div>
    </div></section>

    <section id="work" className="section surface-white"><div className="wrap"><h2>Work examples</h2><p className="work-placeholder">Selected work coming soon. Project examples will be added once approved for publication.</p></div></section>

    <section id="process" className="section surface-cream"><div className="wrap"><div className="section-head"><div><h2>Clear steps.<br/><em>Better systems.</em></h2></div><p>We keep the process straightforward, from the first conversation to launch and ongoing support.</p></div><div className="process-grid">{process.map(s=><article key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></div></section>

    <section id="faq" className="section surface-white"><div className="wrap faq-grid"><div><h2>A few things<br/><em>worth knowing.</em></h2><p>Good partnerships begin with clear expectations.</p></div><div className="faq-items">
      <details><summary>Can you host a website I already have?</summary><p>Possibly. It depends on the platform, domain setup, and features. We assess the site before recommending a transfer, rebuild, or management-in-place. <a href="/transfer">Request an assessment.</a></p></details>
      <details><summary>Is SEO part of every website?</summary><p>New builds include a foundational technical SEO setup. Ongoing SEO strategy, local optimization, content, and reporting are scoped separately.</p></details>
      <details><summary>Do I need to switch all my software?</summary><p>No. We start with your existing tools and only recommend replacements when the benefits justify the change.</p></details>
      <details><summary>What does monthly website care include?</summary><p>Essential Care is available for compatible websites, with managed hosting, monitoring, and defined technical support. Business Care is available and adds up to 60 minutes of minor edits each month. Final pricing and responsibilities are confirmed after an assessment. <a href="#care">Compare care options.</a></p></details>
      <details><summary>Are unlimited edits or new features included?</summary><p>No. Business Care includes a limited monthly allowance for minor changes to existing content. New pages, redesigns, ecommerce changes, SEO campaigns, and automation development are separately scoped and approved before work begins.</p></details>
      <details><summary>How are projects and support priced?</summary><p>Website builds, migrations, ongoing SEO, and automation projects are quoted separately. Monthly website care is available for compatible sites, with exact inclusions set out in the written agreement.</p></details>
    </div></div></section>

    <section id="contact" className="section contact-area"><div className="wrap contact-grid"><div><h2>Tell us what’s<br/><em>slowing you down.</em></h2><p>Start with the challenge you're trying to solve. We'll help shape a sensible next step.</p><div className="contact-trust"><CheckCircle2 size={17}/> Clear scope before work begins</div><div className="contact-trust"><CheckCircle2 size={17}/> Recommendations matched to your needs</div></div><InquiryForm/></div></section>

    <footer className="site-footer"><div className="wrap footer-row"><a href="#top" aria-label="Baymori home"><img src="/brand/baymori-horizontal-black.webp" alt="Baymori"/></a><div><a href="#services">Services</a><a href="/transfer">Transfer your site</a><a href="#contact">Contact</a></div><span>© {new Date().getFullYear()} Baymori</span></div><div className="wrap"><LegalFooter/></div></footer>
  </main>;
}

function InquiryForm(){return <NativeInquiryForm/>;}
