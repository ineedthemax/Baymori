// Public write-only intake. No client listing, admin, upload or execution endpoint.
export type Env = Omit<Cloudflare.Env, 'SITE_ORIGIN' | 'INTAKE_ENABLED'> & {
  SITE_ORIGIN: string; INTAKE_ENABLED?: string;
  TURNSTILE_SECRET: string; RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string; ALERT_EMAIL: string;
};
interface Context { waitUntil(promise: Promise<unknown>): void }
export type Input = {
  kind: 'project' | 'transfer'; firstName: string; lastName: string; email: string;
  business: string; website: string; service: string; details: string;
  consent: true; turnstileToken: string; requestId: string; websiteConfirmation?: string;
};
const MAX_BYTES = 12500;
const MAX_ATTEMPTS = 5;
const headers = {
  'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store',
  'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
};
const json = (body: unknown, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
export function validInput(body: unknown): body is Input {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const x = body as Record<string, unknown>;
  const string = (key: string, max: number, min = 0) => typeof x[key] === 'string' && (x[key] as string).length <= max && (x[key] as string).trim().length >= min && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x[key] as string);
  if (!((x.kind === 'project' || x.kind === 'transfer') && string('firstName',80,1) && string('lastName',80) && string('business',120) && string('website',300) && string('details',2500,10) && string('email',254,3) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.email as string) && ['website','hosting','seo','automation','audit'].includes(String(x.service)) && x.consent === true && string('turnstileToken',2048,1) && string('requestId',36,36) && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x.requestId as string) && (!('websiteConfirmation' in x) || x.websiteConfirmation === ''))) return false;
  if (x.kind === 'transfer' && (!String(x.website).trim() || x.service !== 'hosting')) return false;
  if (x.website) { try { const u = new URL(String(x.website)); if (!['https:','http:'].includes(u.protocol) || u.username || u.password) return false; } catch { return false; } }
  return true;
}
export async function readBounded(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length') || '0') > MAX_BYTES) throw new RangeError('body_limit');
  if (!request.body) throw new SyntaxError('missing_body');
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_BYTES) { await reader.cancel(); throw new RangeError('body_limit'); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const c of chunks) { bytes.set(c,offset); offset += c.length; }
  return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function verifyChallenge(input: Input, env: Env, ip: string): Promise<boolean> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method:'POST', body: new URLSearchParams({ secret:env.TURNSTILE_SECRET,response:input.turnstileToken,remoteip:ip,idempotency_key:input.requestId }), signal:AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('challenge_unavailable');
  const result = await response.json() as {success?:boolean; hostname?:string; action?:string};
  return result.success === true && result.hostname === new URL(env.SITE_ORIGIN).hostname && result.action === 'inquiry';
}
const fingerprint = async (lead: Input) => {
  const canonical = JSON.stringify([lead.kind,lead.firstName.trim(),lead.lastName.trim(),lead.email.trim().toLowerCase(),lead.business.trim(),lead.website.trim(),lead.service,lead.details.trim(),lead.consent]);
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical))),n=>n.toString(16).padStart(2,'0')).join('');
};
export async function flushOutbox(env: Env): Promise<void> {
  // All retries finish within 24h, within provider idempotency-key retention.
  const jobs = await env.LEADS_DB.prepare("SELECT id,lead_id,recipient FROM notification_outbox WHERE status IN ('pending','failed','sending') AND attempts < ? AND datetime(created_at) > datetime('now','-23 hours') AND (retry_after IS NULL OR retry_after <= datetime('now')) ORDER BY created_at LIMIT 20").bind(MAX_ATTEMPTS).all<{id:string;lead_id:string;recipient:string}>();
  for (const job of jobs.results) {
    const lease = crypto.randomUUID();
    const claimed = await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='sending',lease_token=?,attempts=attempts+1,retry_after=datetime('now','+2 minutes') WHERE id=? AND status IN ('pending','failed','sending') AND attempts < ? AND (retry_after IS NULL OR retry_after <= datetime('now')) RETURNING attempts").bind(lease,job.id,MAX_ATTEMPTS).first<{attempts:number}>();
    if (!claimed) continue;
    try {
      const response = await fetch('https://api.resend.com/emails', {method:'POST',signal:AbortSignal.timeout(10000),headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json','Idempotency-Key':job.id},body:JSON.stringify({from:env.RESEND_FROM_EMAIL,to:[job.recipient],subject:'New Baymori inquiry saved',text:`A new inquiry was saved. Reference: ${job.lead_id}\nReview the protected lead store and log the next action in Notion. No prospect details are included in this alert.`})});
      if (!response.ok) throw new Error(`provider_http_${response.status}`);
      const result = await response.json() as {id?:string};
      if (!result.id) throw new Error('provider_invalid_response');
      await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='sent',provider_id=?,delivered_at=datetime('now'),last_error=NULL,lease_token=NULL WHERE id=? AND lease_token=?").bind(result.id,job.id,lease).run();
    } catch (error) {
      const code = error instanceof Error && /^provider_http_\d+$/.test(error.message) ? error.message : 'notification_failed';
      await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='failed',last_error=?,lease_token=NULL,retry_after=datetime('now','+15 minutes') WHERE id=? AND lease_token=?").bind(code,job.id,lease).run();
    }
  }
  await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='dead',lease_token=NULL WHERE status IN ('pending','failed','sending') AND (attempts >= ? OR datetime(created_at) <= datetime('now','-23 hours')) AND (retry_after IS NULL OR retry_after <= datetime('now'))").bind(MAX_ATTEMPTS).run();
  const backlog = await env.LEADS_DB.prepare("SELECT COUNT(*) AS count FROM notification_outbox WHERE status != 'sent'").first<{count:number}>();
  if (backlog?.count) console.warn(JSON.stringify({event:'notification_backlog',count:backlog.count}));
}
export default {
  async fetch(request: Request, env: Env, ctx: Context): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (!path.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (path !== '/api/inquiries') return json({error:'Not found'},404);
    if (request.method !== 'POST') return json({error:'Method not allowed'},405,{allow:'POST'});
    if (env.INTAKE_ENABLED !== 'true' || !env.LEADS_DB || !env.INQUIRY_RATE_LIMITER || !env.TURNSTILE_SECRET || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.ALERT_EMAIL || !env.SITE_ORIGIN) return json({error:'Service unavailable'},503);
    try {
      const origin = new URL(env.SITE_ORIGIN);
      if (origin.protocol !== 'https:' || request.headers.get('origin') !== origin.origin || new URL(request.url).origin !== origin.origin) return json({error:'Invalid origin'},403);
      if (request.headers.get('sec-fetch-site') === 'cross-site') return json({error:'Invalid origin'},403);
      const ip = request.headers.get('cf-connecting-ip');
      if (!ip) return json({error:'Service unavailable'},503);
      const allowed = await env.INQUIRY_RATE_LIMITER.limit({key:ip});
      if (!allowed.success) return json({error:'Please wait before trying again'},429,{'retry-after':'60'});
      if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json({error:'Unsupported content type'},415);
      let body:unknown;
      try { body = await readBounded(request); } catch(e) { return json({error:e instanceof RangeError ? 'Request too large':'Invalid JSON'},e instanceof RangeError ? 413:400); }
      if (!validInput(body)) return json({error:'Please check your answers'},400);
      if (!(await verifyChallenge(body,env,ip))) return json({error:'Security check failed'},400);
      const hash = await fingerprint(body);
      const prior = await env.LEADS_DB.prepare('SELECT payload_hash FROM leads WHERE id=?').bind(body.requestId).first<{payload_hash:string}>();
      if (prior) return prior.payload_hash === hash ? json({received:true,id:body.requestId},200) : json({error:'Please start a fresh inquiry'},409);
      try {
        await env.LEADS_DB.batch([
          env.LEADS_DB.prepare('INSERT INTO leads(id,kind,first_name,last_name,email,business,website,service,details,consent,payload_hash,privacy_version) VALUES(?,?,?,?,?,?,?,?,?,1,?,?)').bind(body.requestId,body.kind,body.firstName.trim(),body.lastName.trim(),body.email.trim().toLowerCase(),body.business.trim(),body.website.trim(),body.service,body.details.trim(),hash,'2026-11-intake-v1'),
          env.LEADS_DB.prepare("INSERT INTO notification_outbox(id,lead_id,purpose,recipient) VALUES(?,?,'team',?)").bind(`${body.requestId}:team`,body.requestId,env.ALERT_EMAIL),
        ]);
      } catch {
        // Concurrent duplicate requests must not lose a saved lead or enqueue twice.
        const winner = await env.LEADS_DB.prepare('SELECT payload_hash FROM leads WHERE id=?').bind(body.requestId).first<{payload_hash:string}>();
        if (!winner || winner.payload_hash !== hash) return json({error:'Unable to save inquiry. Please retry.'},503);
      }
      ctx.waitUntil(flushOutbox(env).catch(()=>console.error(JSON.stringify({event:'outbox_run_failed'}))));
      return json({received:true,id:body.requestId},202);
    } catch { console.error(JSON.stringify({event:'intake_dependency_failure'})); return json({error:'Service temporarily unavailable. Please retry.'},503); }
  },
  async scheduled(_event: unknown,env: Env):Promise<void> {
    if (env.INTAKE_ENABLED !== 'true' || !env.LEADS_DB || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return;
    await flushOutbox(env);
  },
};
