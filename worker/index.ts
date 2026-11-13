// Baymori Lead Flow backend for Cloudflare Workers Static Assets.
// NOTE: Not deployed. Secrets + Turnstile widget and end-to-end verification are required.
// POST /api/inquiries. All other requests served directly by Static Assets.
interface D1Result<T = unknown> { results?: T[]; success: boolean }
interface Statement {
  bind(...params: unknown[]): Statement;
  run(): Promise<unknown>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
interface Database { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<unknown> }
interface Assets { fetch(request: Request): Promise<Response> }
interface Env {
  ASSETS: Assets;
  LEADS_DB: Database;
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  ALERT_EMAIL: string;
  SITE_ORIGIN: string;
}
interface Context { waitUntil(promise: Promise<unknown>): void }
type Input = {
  kind: "project" | "transfer";
  firstName: string; lastName: string; email: string; business: string;
  website: string; service: "website" | "hosting" | "seo" | "automation" | "audit";
  details: string; consent: boolean; turnstileToken: string;
  requestId: string; websiteConfirmation?: string;
};
const json = (obj: unknown, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" },
});
const isValidInput = (body: unknown): body is Input => {
  if (!body || typeof body !== "object") return false;
  const x = body as Record<string, unknown>;
  const str = (k: string, max: number, required = false) =>
    typeof x[k] === "string" && (x[k] as string).length <= max && (!required || (x[k] as string).trim().length > 0);
  return (x.kind === "project" || x.kind === "transfer")
    && str("firstName", 80, true) && str("lastName", 80)
    && str("email", 254, true) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x.email))
    && str("business", 120) && str("website", 300)
    && ["website","hosting","seo","automation","audit"].includes(String(x.service))
    && str("details", 2500, true) && x.consent === true
    && str("turnstileToken", 2048, true)
    && str("requestId", 80, true) && /^[a-zA-Z0-9-]{16,80}$/.test(String(x.requestId))
    && (!("websiteConfirmation" in x) || x.websiteConfirmation === "");
};
const emailText = (value: string) => value.replace(/[<>\r\n]/g, " ").trim();
async function verifyTurnstile(token: string, secret: string, remoteip: string | null): Promise<boolean> {
  const data = new FormData();
  data.set("secret", secret);
  data.set("response", token);
  if (remoteip) data.set("remoteip", remoteip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: data });
  if (!r.ok) return false;
  const x = await r.json() as { success?: boolean };
  return x.success === true;
}
async function sendEmail(env: Env, to: string, subject: string, text: string, idempotency: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json", "Idempotency-Key": idempotency },
    body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [to], subject, text }),
  });
  if (!r.ok) throw new Error(`Email service rejected request (HTTP ${r.status})`);
}
async function flushOutbox(env: Env, leadId: string, lead: Input): Promise<void> {
  const sender = emailText(lead.firstName);
  const notes = `New ${lead.kind} inquiry\nName: ${sender} ${emailText(lead.lastName)}\nEmail: ${emailText(lead.email)}\nBrand: ${emailText(lead.business)}\nWebsite: ${emailText(lead.website)}\nService: ${lead.service}\nDetails: ${lead.details.slice(0,2500)}\nLead ID: ${leadId}`;
  const jobs = [
    { purpose: "team", recipient: env.ALERT_EMAIL, subject: "New Baymori website inquiry", text: notes },
    { purpose: "prospect", recipient: lead.email, subject: "We received your Baymori inquiry", text: `Hi ${sender},\n\nThanks for reaching out to Baymori. We've received your inquiry and will review your request before following up.\n\nBaymori\n\nPlease don't send passwords or sensitive account information by email.` },
  ];
  for (const job of jobs) {
    const id = `${leadId}:${job.purpose}`;
    try {
      const current = await env.LEADS_DB.prepare("SELECT status FROM notification_outbox WHERE id = ?").bind(id).first<{status:string}>();
      if (!current || current.status === "sent") continue;
      await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='pending', attempts=attempts+1 WHERE id = ? AND status != 'sent'").bind(id).run();
      await sendEmail(env, job.recipient, job.subject, job.text, id);
      await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='sent', delivered_at=datetime('now'), last_error=NULL WHERE id=?").bind(id).run();
    } catch (e) {
      // Never put customer PII or provider payloads into public logs.
      await env.LEADS_DB.prepare("UPDATE notification_outbox SET status='failed', last_error=?, retry_after=datetime('now','+15 minutes') WHERE id=?").bind(String(e).slice(0,240), id).run();
    }
  }
}
export default {
  async fetch(request: Request, env: Env, ctx: Context): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/api/inquiries") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if (!env.LEADS_DB || !env.TURNSTILE_SECRET || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.ALERT_EMAIL || !env.SITE_ORIGIN) return json({ error: "Service unavailable" }, 503);
    if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return json({ error: "Unsupported content type" }, 415);
    const origin = request.headers.get("origin");
    if (!origin || new URL(env.SITE_ORIGIN).origin !== origin) return json({ error: "Invalid origin" }, 403);
    if (Number(request.headers.get("content-length") || "0") > 12500) return json({ error: "Request too large" }, 413);
    let body: unknown;
    try { const raw = await request.text(); if (raw.length > 12500) return json({ error: "Request too large" }, 413); body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON" }, 400); }
    if (!isValidInput(body)) return json({ error: "Please check your answers" }, 400);
    const lead = body as Input;
    if (!(await verifyTurnstile(lead.turnstileToken, env.TURNSTILE_SECRET, request.headers.get("CF-Connecting-IP")))) return json({ error: "Security check failed" }, 400);
    const id = lead.requestId;
    try {
      const existing = await env.LEADS_DB.prepare("SELECT id FROM leads WHERE id = ?").bind(id).first();
      if (existing) return json({ received: true, id });
      const records = [
        env.LEADS_DB.prepare("INSERT INTO leads(id,kind,first_name,last_name,email,business,website,service,details,consent) VALUES(?,?,?,?,?,?,?,?,?,1)").bind(id,lead.kind,lead.firstName.trim(),lead.lastName.trim(),lead.email.trim().toLowerCase(),lead.business.trim(),lead.website.trim(),lead.service,lead.details.trim()),
        env.LEADS_DB.prepare("INSERT INTO notification_outbox(id,lead_id,purpose,recipient) VALUES(?,?,?,?)").bind(`${id}:team`,id,"team",env.ALERT_EMAIL),
        env.LEADS_DB.prepare("INSERT INTO notification_outbox(id,lead_id,purpose,recipient) VALUES(?,?,?,?)").bind(`${id}:prospect`,id,"prospect",lead.email.trim().toLowerCase()),
      ];
      await env.LEADS_DB.batch(records);
      ctx.waitUntil(flushOutbox(env, id, lead));
      return json({ received: true, id }, 202);
    } catch { return json({ error: "We couldn't save your request. Please try again." }, 503); }
  },
};
