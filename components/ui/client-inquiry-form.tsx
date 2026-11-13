"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

type Variant = "project" | "transfer";
type Service = "website" | "hosting" | "seo" | "automation" | "audit";

const serviceOptions: { value: Service; label: string }[] = [
  { value: "website", label: "Website design or development" },
  { value: "hosting", label: "Managed hosting or care" },
  { value: "seo", label: "SEO and search visibility" },
  { value: "automation", label: "Lead capture or workflow automation" },
  { value: "audit", label: "Digital infrastructure audit" },
];

const prompts: Record<Service, { title: string; placeholder: string }> = {
  website: { title: "What would you like your website to help you accomplish?", placeholder: "Tell us about the audience, website, and goals..." },
  hosting: { title: "Where is your website hosted today?", placeholder: "Share your website address, current host, and what needs attention..." },
  seo: { title: "Where do you want to improve visibility?", placeholder: "Share your website and who you want to reach..." },
  automation: { title: "Which repetitive task is slowing your team down?", placeholder: "Tell us what happens today and which tools you already use..." },
  audit: { title: "What's not working smoothly in your digital setup?", placeholder: "Tell us about your website, tools, and biggest challenges..." },
};

type TurnstileAPI = { render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string; remove: (id: string) => void };
type TurnstileWindow = Window & { turnstile?: TurnstileAPI };
const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
function TurnstileCheck({ onToken }: { onToken: (token: string) => void }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sitekey) return;
    let cancelled = false;
    let widgetId: string | undefined;
    const element = anchorRef.current;
    const setup = () => {
      if (cancelled || !element) return;
      const api = (window as TurnstileWindow).turnstile;
      if (!api || widgetId) return;
      widgetId = api.render(element, {
        sitekey,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    const scriptId = "baymori-turnstile-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      document.head.appendChild(script);
    }
    script.addEventListener("load", setup);
    setup();
    const check = window.setInterval(setup, 300);
    return () => { cancelled = true; clearInterval(check); script?.removeEventListener("load", setup); if (widgetId) (window as TurnstileWindow).turnstile?.remove(widgetId); };
  }, [onToken]);
  if (!sitekey) return <p className="guided-error" role="status">Secure submissions are being configured. Please use the backup inquiry link below.</p>;
  return <div className="guided-turnstile" ref={anchorRef} aria-label="Security verification"/>;
}

export function ClientInquiryForm({ variant = "project" }: { variant?: Variant }) {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState<Service>("website");
  const [details, setDetails] = useState("");
  const [permission, setPermission] = useState(false);
  const [sending, setSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [requestId, setRequestId] = useState("");
  const [websiteConfirmation, setWebsiteConfirmation] = useState("");
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const isTransfer = variant === "transfer";
  const givenName = firstName.trim().split(/\s+/)[0] || "there";
  const canContinue = step === 0 ? firstName.trim().length > 0 : step === 1 ? (isTransfer ? website.trim().length > 0 : true) : true;
  const prompt = isTransfer
    ? { title: `Where is your website hosted, ${givenName}?`, placeholder: "Current platform, hosting provider, any special features, and what you want to change..." }
    : { title: prompts[service].title, placeholder: prompts[service].placeholder };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!permission || !email || !firstName.trim() || !details.trim()) return;
    if (!sitekey || !turnstileToken) { setResult("error"); return; }
    setResult("idle");
    setSending(true);
    const submissionId = requestId || crypto.randomUUID();
    if (!requestId) setRequestId(submissionId);
    try {
      // A production endpoint must validate inputs, verify Turnstile, persist the lead,
      // then queue notification email. Until configured, errors stay visible to users.
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: variant, firstName: firstName.trim(), lastName: lastName.trim(),
          email: email.trim(), business: business.trim(), website: website.trim(),
          service: isTransfer ? "hosting" : service, details: details.trim(),
          consent: permission, turnstileToken, requestId: submissionId, websiteConfirmation,
        }),
      });
      if (!response.ok) throw new Error("Submission unavailable");
      setResult("success");
    } catch {
      setResult("error");
      setTurnstileToken("");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="guided-form" onSubmit={submit}>
      <div className="guided-form-header">
        <span className="form-kicker">{isTransfer ? "WEBSITE TRANSFER ASSESSMENT" : "START A PROJECT"}</span>
        <span className="guided-step-count">STEP {step + 1} OF 3</span>
      </div>
      <div className="guided-progress" aria-label={`Step ${step + 1} of 3`}>
        {[0, 1, 2].map((i) => <span key={i} className={i <= step ? "active" : ""} />)}
      </div>
      {result === "success" ? (
        <div role="status" className="guided-success"><CheckCircle2 size={26}/><h3>Thanks, {givenName}.</h3><p>Your inquiry has been received. We'll review it and get back to you.</p></div>
      ) : (
        <>
          {step === 0 && <fieldset>
            <legend>First things first. What should we call you?</legend>
            <p>We'll use your name to make this a little more personal.</p>
            <label htmlFor={`${variant}-first`}>First name <span aria-hidden="true">*</span></label>
            <input id={`${variant}-first`} autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} maxLength={80} required placeholder="Your first name"/>
          </fieldset>}
          {step === 1 && <fieldset>
            <legend>Nice to meet you, {givenName}.</legend>
            {isTransfer ? <>
              <p>Let's take a look at the website you're considering moving.</p>
              <label htmlFor="transfer-website">Website address <span aria-hidden="true">*</span></label>
              <input id="transfer-website" type="text" value={website} onChange={e => setWebsite(e.target.value)} maxLength={300} required placeholder="yourwebsite.com"/>
              <label htmlFor="transfer-business">Business or creator name (optional)</label>
              <input id="transfer-business" value={business} onChange={e => setBusiness(e.target.value)} maxLength={120} placeholder="Your brand or company"/>
            </> : <>
              <p>What would you like Baymori to help you with?</p>
              <div className="guided-choices">
                {serviceOptions.map(option => <label className={service === option.value ? "selected" : ""} key={option.value}>
                  <input type="radio" name="baymori-service" checked={service === option.value} onChange={() => setService(option.value)}/>
                  <span>{option.label}</span>
                </label>)}
              </div>
            </>}
          </fieldset>}
          {step === 2 && <fieldset>
            <legend>{givenName}, tell us a little more.</legend>
            <p>{prompt.title}</p>
            <label htmlFor={`${variant}-details`}>Project details <span aria-hidden="true">*</span></label>
            <textarea id={`${variant}-details`} value={details} onChange={e => setDetails(e.target.value)} maxLength={2500} required rows={4} placeholder={prompt.placeholder}/>
            {!isTransfer && <>
              <label htmlFor="project-website">Existing website (optional)</label>
              <input id="project-website" value={website} onChange={e => setWebsite(e.target.value)} maxLength={300} placeholder="yourwebsite.com"/>
            </>}
            <div className="guided-contact-fields">
              <div><label htmlFor={`${variant}-last`}>Last name (optional)</label><input id={`${variant}-last`} autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} maxLength={80}/></div>
              <div><label htmlFor={`${variant}-email`}>Email address <span aria-hidden="true">*</span></label><input id={`${variant}-email`} autoComplete="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} placeholder="you@example.com"/></div>
            </div>
            <label className="guided-hidden" aria-hidden="true">Website confirmation<input tabIndex={-1} autoComplete="off" value={websiteConfirmation} onChange={e => setWebsiteConfirmation(e.target.value)} /></label>
            <TurnstileCheck onToken={setTurnstileToken}/>
            <label className="guided-consent"><input type="checkbox" checked={permission} onChange={e => setPermission(e.target.checked)} required/><span>I agree to be contacted about my inquiry.</span></label>
            {result === "error" && <p className="guided-error" role="alert">The form could not be submitted. Your details are still here. Please use the backup contact option below.</p>}
          </fieldset>}
          <div className="guided-actions">
            {step > 0 && <button type="button" className="guided-back" onClick={() => {setStep(v => v - 1); setResult("idle");}}><ArrowLeft size={16}/> Back</button>}
            {step < 2 ? <button type="button" className="btn btn-copper" disabled={!canContinue} onClick={() => setStep(v => v + 1)}>Continue <ArrowRight size={16}/></button>
              : <button className="btn btn-copper" type="submit" disabled={sending || !permission || !details.trim() || !email.trim() || !turnstileToken || !sitekey}>{sending ? "Sending..." : "Send inquiry"} <ArrowRight size={16}/></button>}
          </div>
        </>
      )}
      <p className="guided-privacy"><ShieldCheck size={15}/> Please don't enter passwords or payment details.</p>
    </form>
  );
}
