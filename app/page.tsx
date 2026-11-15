"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X, Globe2, SearchCheck, Zap, ServerCog, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { DotField } from "@/components/ui/dot-field";
import { IntegrationNetwork } from "@/components/ui/integration-network";

import NativeInquiryForm from "@/components/inquiry-form";
import LegalFooter from "@/components/legal-footer";

const services = [
  { icon: ServerCog, id: "hosting", number: "01", title: "Website hosting & care", body: "A dependable home for your website, with setup, maintenance, and support matched to your website." },
  { icon: Globe2, id: "websites", number: "02", title: "Website builds", body: "Clear, easy-to-use websites that explain your services and help customers inquire or book." },
  { icon: SearchCheck, id: "seo", number: "03", title: "Help customers find you", body: "Search-friendly page titles, clear content and website setup that help customers understand what you offer." },
  { icon: Zap, id: "automation", number: "04", title: "Connected inquiries & bookings", body: "Connect your inquiry form, calendar and existing tools so handling a new customer takes fewer steps." },
];

const process = [
  { n: "01", title: "Tell us what you need", body: "We learn about your website, your tools, and where your business is getting stuck." },
  { n: "02", title: "Get a clear plan", body: "We recommend the right scope and outline responsibilities before any work begins." },
  { n: "03", title: "Build, launch & support", body: "We implement, test, and help manage the solution under the agreed service plan." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <main id="top"><a className="skip-link" href="#services">Skip to content</a>
    <header className="site-header">
      <nav className="site-nav wrap" aria-label="Main navigation">
        <a href="#top" aria-label="Baymori home" className="logo-link"><img src="/brand/baymori-horizontal-black.webp" alt="Baymori" /></a>
        <div className="nav-links"><a href="#services">Services</a><a href="#hosting">Existing websites</a><a href="#integrations">Connected tools</a><a href="#care">Monthly care</a></div>
        <a className="btn btn-copper nav-cta" href="#contact">Start a project <ArrowUpRight size={16}/></a>
        <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={23}/>:<Menu size={23}/>}</button>
      </nav>
      {menuOpen && <div className="mobile-menu" id="mobile-menu"><a href="#services" onClick={()=>setMenuOpen(false)}>Services</a><a href="#hosting" onClick={()=>setMenuOpen(false)}>Existing websites</a><a href="#integrations" onClick={()=>setMenuOpen(false)}>Connected tools</a><a href="#care" onClick={()=>setMenuOpen(false)}>Monthly care</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Start a project</a></div>}
    </header>

    <DotField className="baymori-hero" style={{height:"155svh"}} headline="Your website, handled." eyebrow="BAYMORI / WEBSITES & ONGOING CARE" description="We build and care for websites for service businesses that depend on inquiries and bookings. We connect the tools you already use and provide ongoing support, with clear pricing and scope." accent="#B86D49" grid={[22,15]} repelRadius={110} scrollScatter scrollHint={{scatter:"Scroll to explore",gather:"Back to the beginning"}} actions={<><a className="btn btn-copper" href="#contact">Start a project <ArrowUpRight size={16}/></a><a className="btn btn-ghost" href="#hosting">Already have a website? <ArrowRight size={16}/></a></>}/>

    <section id="services" className="section surface-white"><div className="wrap">
      <div className="section-head"><div><span className="kicker">WHAT WE DO</span><h2>Built for what<br/><em>comes next.</em></h2></div><p>Your customers need to understand your services, trust your business and know how to reach you. We build and look after the website that helps them take that next step. Website projects start at $2,000.</p></div>
      <div className="service-grid">{services.map(({icon:Icon,id,number,title,body})=><article className="service-card" key={id}><div className="service-meta"><span className="service-icon"><Icon size={23} strokeWidth={1.65}/></span><span>{number} / 04</span></div><div><h3>{title}</h3><p>{body}</p></div><a href="#contact" aria-label={`Inquire about ${title}`} className="service-arrow"><ArrowUpRight size={20}/></a></article>)}</div>
    </div></section>

    <section id="hosting" className="section surface-cream"><div className="wrap hosting-grid"><div><span className="kicker">ALREADY HAVE A WEBSITE?</span><h2>Keep your platform.<br/><em>Get support.</em></h2><p className="lead">Using Wix or another provider? We’ll review your website and recommend what needs attention. If it’s a good fit, we can look after it while you keep your current hosting.</p><div className="action-row"><a href="/transfer" className="btn btn-copper">Ask about your existing site <ArrowUpRight size={16}/></a><a href="#contact" className="inline-link">Discuss website care <ArrowRight size={17}/></a></div><p className="fineprint"><ShieldCheck size={15}/> We review your platform and access before agreeing to care. You keep ownership of your accounts.</p></div>
      <div className="hosting-panel"><div className="panel-label">START WITH YOUR CURRENT WEBSITE</div>{[["01","Share your site","Tell us where it lives and what you want to change."],["02","We assess the setup","We check what your website needs and what we can support."],["03","You approve the plan","We agree on the work, price and responsibilities before making changes."]].map(([n,t,d])=><div className="hosting-step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><Check size={18}/></div>)}<div className="panel-foot">Keeping your host? You pay them directly. Our care fee covers the work we agree to handle.</div></div>
    </div></section>

    <section id="care" className="section surface-white"><div className="wrap">
      <div className="section-head"><div><span className="kicker">MONTHLY WEBSITE CARE</span><h2>A reliable site.<br/><em>A clear plan.</em></h2></div><p>Ongoing care for service businesses that want fewer website headaches. We review your site first and agree on what’s included before you start.</p></div>
      <div className="care-grid">
        <article className="care-card"><div className="care-card-top"><span className="care-label">ESSENTIAL CARE</span><h3>Keep the essentials handled.</h3><p>For businesses that need routine website checks and a clear point of contact.</p></div><div className="care-price">From $99 <span>/ month</span></div><ul><li>Care for one approved website; hosting where agreed</li><li>Website security certificate and hosting setup checks, where supported</li><li>Scheduled website availability and routine checks</li><li>Initial investigation of agreed website issues</li><li>Email support, response target within 2 business days</li></ul><p className="care-limit">Content edits, redesigns, and new features are quoted separately.</p><a className="btn btn-ghost" href="#contact">Ask about Essential <ArrowUpRight size={16}/></a></article>
        <article className="care-card care-card-featured"><div className="care-card-top"><span className="care-label">BUSINESS CARE</span><h3>Stay current as you grow.</h3><p>For service businesses that need occasional content updates with a defined monthly allowance.</p></div><div className="care-price">From $199 <span>/ month</span></div><ul><li>Everything in Essential Care</li><li>Up to 60 minutes of minor edits per month</li><li>Monthly site health and basic form/link checks</li><li>Basic website speed and search setup checks</li><li>Email support, response target within 1 business day</li></ul><p className="care-limit">Minor edits cover existing text, images, buttons, and links. Unused time does not roll over.</p><a className="btn btn-copper" href="#contact">Ask about Business <ArrowUpRight size={16}/></a></article>
      </div>
      <p className="care-disclaimer">Prices are starting estimates for compatible sites, subject to an assessment and written scope. One plan covers one website. Response times mean acknowledgement and initial assessment, not guaranteed resolution. Third-party fees, migrations, new pages, redesigns, SEO campaigns, automations, and major feature work are separate. Backup and recovery coverage are defined in the agreement, not assumed.</p>
    </div></section>

    <section id="integrations" className="section surface-white"><div className="wrap">
      <div className="section-head"><div><span className="kicker">BETTER WORKFLOWS, LESS MANUAL WORK</span><h2>Less chasing.<br/><em>More doing.</em></h2></div><p>See how a customer inquiry could connect to follow-up, a booking and the work that comes next. Explore examples for appointment and project-based businesses.</p></div>
      <IntegrationNetwork/>
      <div className="integration-summary"><div><h3>Good systems make follow-through easier.</h3><p>These are examples, not prebuilt automations. We'll map the right handoffs and confirm what's practical with the tools you already use.</p></div><a href="#contact" className="inline-link">Discuss your booking process <ArrowUpRight size={17}/></a></div>
    </div></section>

    <section id="process" className="section surface-cream"><div className="wrap"><div className="section-head"><div><span className="kicker">HOW WE WORK</span><h2>Clear steps.<br/><em>A better website.</em></h2></div><p>We keep the process straightforward, from the first conversation to launch and ongoing support.</p></div><div className="process-grid">{process.map(s=><article key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></div></section>

    <section id="faq" className="section surface-white"><div className="wrap faq-grid"><div><span className="kicker">COMMON QUESTIONS</span><h2>A few things<br/><em>worth knowing.</em></h2><p>Good partnerships begin with clear expectations.</p></div><div className="faq-items">
      <details><summary>Can I keep Wix or my current hosting?</summary><p>Yes, if we can support your website and get the access needed. We review it first and agree on what we handle. You keep paying your provider directly. Moving the website is a separate decision. <a href="/transfer">Request an assessment.</a></p></details>
      <details><summary>Is SEO part of every website?</summary><p>New builds include a foundational technical SEO setup. Ongoing SEO strategy, local optimization, content, and reporting are scoped separately.</p></details>
      <details><summary>Do I need to switch all my software?</summary><p>No. We start with your existing tools and only recommend replacements when the benefits justify the change.</p></details>
      <details><summary>What does monthly website care include?</summary><p>Essential Care starts at $99/month for compatible websites, with scheduled checks and defined support. Hosting is included only where agreed. Business Care starts at $199/month and adds up to 60 minutes of minor edits each month. Final pricing and responsibilities are confirmed after an assessment. <a href="#care">Compare care options.</a></p></details>
      <details><summary>Are unlimited edits or new features included?</summary><p>No. Business Care includes a limited monthly allowance for minor changes to existing content. New pages, redesigns, ecommerce changes, SEO campaigns, and automation development are separately scoped and approved before work begins.</p></details>
      <details><summary>How are projects and support priced?</summary><p>Website builds start at $2,000. Moving an existing site, ongoing search work and connecting additional tools are quoted separately. Monthly website care starts at $99 or $199 for compatible sites, with exact inclusions set out in the written agreement.</p></details>
    </div></div></section>

    <section id="contact" className="section contact-area"><div className="wrap contact-grid"><div><span className="kicker">LET'S BUILD SOMETHING USEFUL</span><h2>Tell us what’s<br/><em>slowing you down.</em></h2><p>Need a new website? Already have one? Tell us what you do, what you use and what needs to work better. We’ll recommend a practical next step.</p><div className="contact-trust"><CheckCircle2 size={17}/> Clear scope before work begins</div><div className="contact-trust"><CheckCircle2 size={17}/> Recommendations matched to your needs</div></div><InquiryForm/></div></section>

    <footer className="site-footer"><div className="wrap footer-row"><a href="#top" aria-label="Baymori home"><img src="/brand/baymori-horizontal-black.webp" alt="Baymori"/></a><div><a href="#services">Services</a><a href="/transfer">Existing website help</a><a href="#contact">Contact</a></div><span>© {new Date().getFullYear()} Baymori</span></div><div className="wrap"><LegalFooter/></div></footer>
  </main>;
}

function InquiryForm(){return <NativeInquiryForm/>;}
