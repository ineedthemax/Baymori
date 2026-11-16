"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
type API = { render: (el:HTMLElement, options: {sitekey:string;action:string;callback:(token:string)=>void;'expired-callback':()=>void;'error-callback':()=>void})=>string; remove:(id:string)=>void };
type TurnstileWindow = Window & {turnstile?:API};
function Challenge({onToken}:{onToken:(token:string)=>void}) {
 const anchor=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let widget:string|undefined; let cancelled=false;
  const setup=()=>{const api=(window as TurnstileWindow).turnstile;if(!cancelled&&anchor.current&&api&&widget===undefined)widget=api.render(anchor.current,{sitekey:process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY||'',action:'inquiry',callback:onToken,'expired-callback':()=>onToken(''),'error-callback':()=>onToken('')});};
  let script=document.getElementById('baymori-turnstile') as HTMLScriptElement|null;
  if(!script){script=document.createElement('script');script.id='baymori-turnstile';script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.defer=true;document.head.appendChild(script);}
  script.addEventListener('load',setup);setup();const timer=setInterval(setup,300);
  return()=>{cancelled=true;clearInterval(timer);script?.removeEventListener('load',setup);if(widget!==undefined)(window as TurnstileWindow).turnstile?.remove(widget);};
 },[onToken]);
 return <div ref={anchor} aria-label="Security verification"/>;
}
export default function SecureInquiryForm({kind}:{kind:'project'|'transfer'}) {
 const [token,setToken]=useState('');const [challenge,setChallenge]=useState(0);const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');const [saved,setSaved]=useState(false);
 const request=useRef<{id:string;payload:string}|null>(null);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy||!token)return;setBusy(true);setStatus('');
  const data=new FormData(event.currentTarget);
  const payload={kind,firstName:String(data.get('firstName')).trim(),lastName:String(data.get('lastName')||'').trim(),email:String(data.get('email')).trim(),business:String(data.get('business')||'').trim(),website:String(data.get('website')||'').trim(),service:String(data.get('service')),details:String(data.get('details')).trim(),consent:data.get('consent')==='on',websiteConfirmation:String(data.get('websiteConfirmation')||'')};
  const key=JSON.stringify(payload);if(!request.current||request.current.payload!==key)request.current={id:crypto.randomUUID(),payload:key};
  try{const response=await fetch('/api/inquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,turnstileToken:token,requestId:request.current.id}),signal:AbortSignal.timeout(20000)});const result=await response.json() as {received?:boolean;id?:string};if(!response.ok||result.received!==true||result.id!==request.current.id)throw new Error('save_failed');setSaved(true);setStatus('Your inquiry has been saved. We’ll review it and follow up.');}
  catch{setStatus('We couldn’t confirm receipt. Your answers are still here. Try again, or email us directly.');}
  finally{setBusy(false);setToken('');setChallenge(x=>x+1);}
 }
 if(saved)return <section className="native-inquiry form-card" role="status"><h3>Thank you.</h3><p>{status}</p><p>Reference: {request.current?.id}</p></section>;
 return <form className="native-inquiry form-card" onSubmit={submit} aria-busy={busy}>
 <span className="form-kicker">{kind==='transfer'?'MIGRATION ASSESSMENT':'PROJECT INQUIRY'}</span><h3>Start with a conversation.</h3><p>Tell us what you’d like to improve.</p>
 <fieldset disabled={busy} style={{border:0,padding:0,margin:0,display:'grid',gap:16}}>
 <label>First name<input name="firstName" autoComplete="given-name" required maxLength={80}/></label><label>Last name (optional)<input name="lastName" autoComplete="family-name" maxLength={80}/></label>
 <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>Business or creator name<input name="business" autoComplete="organization" maxLength={120}/></label>
 <label>Website {kind==='project'&&'(optional)'}<input name="website" type="url" placeholder="https://" required={kind==='transfer'} maxLength={300}/></label>
 <label>What do you need?<select name="service" defaultValue={kind==='transfer'?'hosting':'website'}>{(kind==='transfer'?[['hosting','Hosting or transfer']]:[['website','Website build'],['hosting','Hosting or transfer'],['seo','SEO foundations'],['automation','Connected tools'],['audit','Not sure yet']]).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
 <label>What would you like to improve?<textarea name="details" rows={4} required minLength={10} maxLength={2500}/></label>
 <label style={{position:'absolute',left:-10000}} aria-hidden="true">Leave empty<input name="websiteConfirmation" tabIndex={-1} autoComplete="off"/></label>
 <label><span><input name="consent" type="checkbox" required/> You may contact me about this inquiry.</span></label>
 </fieldset>
 <p className="form-note">We save your inquiry to review and respond. Please don’t include passwords, payment details or sensitive personal information. <a href="/privacy/">Privacy Notice</a></p>
 {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?<Challenge key={challenge} onToken={setToken}/>:<p>Secure submissions are being configured. Please email us directly.</p>}
 <button className="btn btn-copper" type="submit" disabled={busy||!token}>{busy?'Sending…':'Send inquiry'}</button><p role="status">{status}</p><a href="mailto:max@kijijimgmt.com">Email max@kijijimgmt.com directly ↗</a>
 </form>;
}
