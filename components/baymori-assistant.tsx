"use client";

import { useEffect, useRef, useState } from "react";
import { answerQuestion, emptyAnswers, recommendation, summary, type Answers } from "@/lib/assistant";

export default function BaymoriAssistant() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ ...emptyAnswers });
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (open) heading.current?.focus(); }, [open, step]);
  function close() { setOpen(false); trigger.current?.focus(); }
  function choose(field: keyof Answers, value: string) { setAnswers(a => ({ ...a, [field]: value })); setStep(s => s + 1); setStatus(""); }
  const creator = answers.audience === "A creator";
  const fields: (keyof Answers)[] = ["audience", "need", "goal", "platform"];
  const prompts = ["What are you working on?", "Where could you use a hand?", creator ? "What should your website help your audience do?" : "What should visitors do next?", "What are you using today?"];
  const options = [
    ["A business", "A creator", "Still figuring it out"],
    ["A new website", "Updates to my website", "Hosting or ongoing care", "Help figuring it out"],
    creator ? ["Book me", "Explore my work", "Buy something", "Join my community", "Something else"] : ["Send an inquiry", "Book a service", "Explore what I offer", "Buy something", "Something else"],
    ["No website yet", "Wix", "WordPress", "Squarespace", "Shopify", "Another platform", "I’m not sure"],
  ];
  return <div className="baymori-assistant">
    <button ref={trigger} className="assistant-launch" aria-expanded={open} aria-controls="baymori-assistant" onClick={() => open ? close() : setOpen(true)}>{open ? "Close assistant" : "Ask Baymori ↗"}</button>
    {open && <section id="baymori-assistant" className="assistant-panel" aria-label="Ask Baymori" onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); close(); } }}>
      <header className="assistant-header"><div><strong>Ask Baymori</strong><small>Guided project assistant</small></div><button onClick={close} aria-label="Close Baymori assistant">×</button></header>
      <div className="assistant-body">
        <p className="assistant-intro">Let’s figure out what would make your website work better for you.</p>
        <p className="assistant-progress">{step < 4 ? `Step ${step + 1} of 5` : step === 4 ? "Step 5 of 5" : "Your project brief"}</p>
        <h2 ref={heading} tabIndex={-1}>{step < 4 ? prompts[step] : step === 4 ? "What else should Max know?" : `${answers.name ? `${answers.name}, here` : "Here"}’s a starting point.`}</h2>
        {step < 4 && <div className="assistant-options">{options[step].map(option => <button key={option} onClick={() => choose(fields[step], option)}>{option}<span aria-hidden="true">↗</span></button>)}</div>}
        {step === 4 && <form onSubmit={e => { e.preventDefault(); setStep(5); }}>
          <label>Your name (optional)<input autoComplete="given-name" maxLength={60} value={answers.name} onChange={e => setAnswers(a => ({ ...a, name: e.target.value }))}/></label>
          <label>Project notes (optional)<textarea rows={4} maxLength={800} placeholder="What feels stuck? What would a better website change?" value={answers.details} onChange={e => setAnswers(a => ({ ...a, details: e.target.value }))}/></label>
          <button className="assistant-primary" type="submit">See my project brief ↗</button>
        </form>}
        {step === 5 && <><p>{recommendation(answers)}</p><dl>{fields.map((field, i) => <div key={field}><dt>{["About you", "What you need", "Main goal", "Current platform"][i]}</dt><dd>{answers[field]} <button aria-label={`Edit ${["audience", "service", "goal", "platform"][i]}`} onClick={() => setStep(i)}>Edit</button></dd></div>)}</dl>{answers.details && <p className="assistant-notes">{answers.details}</p>}
          <a className="assistant-primary" href={`mailto:max@kijijimgmt.com?subject=${encodeURIComponent("Baymori project brief")}&body=${encodeURIComponent(summary(answers))}`} onClick={() => setStatus("Your email app should open with your brief. Send the email to complete your inquiry. Nothing has been submitted or saved by Baymori.")}>Prepare email to Baymori ↗</a>
          <button className="assistant-text" onClick={async () => { try { await navigator.clipboard.writeText(summary(answers)); setStatus("Brief copied. You can email it to max@kijijimgmt.com."); } catch { setStatus("Copy is unavailable. You can select the brief or use the email link."); } }}>Copy my brief</button>
          <p>Or email <a href="mailto:max@kijijimgmt.com">max@kijijimgmt.com</a> directly.</p></>}
        {step > 0 && <button className="assistant-text" onClick={() => { setStep(s => s - 1); setStatus(""); }}>← Back</button>}
        <details className="assistant-faq"><summary>Have a question first?</summary><form onSubmit={e => { e.preventDefault(); setReply(answerQuestion(question)); }}><label>Ask about services, payments or timing<input required maxLength={300} value={question} onChange={e => setQuestion(e.target.value)} /></label><button type="submit">Get an answer</button></form><p aria-live="polite">{reply}</p></details>
        <p role="status">{status}</p>
        <p className="assistant-privacy">Answers stay in this page until you open an email draft or copy them. This assistant uses guided questions and preset answers. Please leave out passwords, payment details and sensitive information. <a href="/privacy/">Privacy notice</a></p>
        <button className="assistant-text" onClick={() => { setAnswers({ ...emptyAnswers }); setStep(0); setReply(""); setQuestion(""); setStatus("Answers cleared."); }}>Start over and clear answers</button>
      </div>
    </section>}
  </div>;
}
