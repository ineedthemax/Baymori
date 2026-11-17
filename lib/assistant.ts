export type Answers = { audience: string; need: string; goal: string; platform: string; details: string; name: string };
export const emptyAnswers: Answers = { audience: "", need: "", goal: "", platform: "", details: "", name: "" };
export function recommendation(a: Answers) {
  if (a.need === "A new website") return "A website build may fit. Start by defining the pages and the main action visitors should take. Baymori will confirm the scope with you.";
  if (a.need === "Updates to my website") return "Start with a review of your existing website and the changes you need. Platform compatibility and scope need to be confirmed.";
  if (a.need === "Hosting or ongoing care") return "Start with a hosting and maintenance assessment. Baymori will review your platform before recommending a transfer or care plan.";
  return "Start with a conversation about your main goal. Baymori can help identify whether a website build, updates, hosting or maintenance would help.";
}
export function summary(a: Answers) {
  return [`Name: ${a.name || "Not provided"}`, `About me: ${a.audience}`, `I need: ${a.need}`, `Main goal: ${a.goal}`, `Current platform: ${a.platform}`, `More context: ${a.details || "Not provided"}`, "", `Suggested next step: ${recommendation(a)}`].join("\n");
}
export function answerQuestion(question: string) {
  if (/\b(price|prices|pricing|cost|quote|budget)\b/i.test(question)) return "Pricing is coming soon. Baymori needs to review your project before confirming a quote. I can help you prepare a project summary.";
  if (/\b(deposits?|payments?|pay)\b/i.test(question)) return "Website builds use a 50% payment after signing and before work starts. The remaining 50% is due after you approve the finished site and before launch. Monthly hosting and care are separate and start on the agreed date.";
  if (/\b(time|timelines?|deadlines?|launch|fast|long)\b/i.test(question)) return "Baymori confirms the schedule after reviewing scope, materials, access and availability. I cannot promise a launch date.";
  if (/\b(wix|wordpress|squarespace|shopify|transfer|platform)\b/i.test(question)) return "An existing website needs a platform review before Baymori can confirm support or a transfer. Keep your current hosting in place until a migration plan is agreed.";
  if (/\b(maintenance|care|support|hosting)\b/i.test(question)) return "Baymori offers hosting and monthly maintenance for compatible websites under an agreed plan. Support limits and responsibilities must be confirmed in your agreement. Pricing is coming soon.";
  if (/\b(service|offer|build|website)\b/i.test(question)) return "Baymori helps businesses and creators with website builds, website updates, hosting and monthly maintenance. Your scope is confirmed before work starts.";
  return "I don’t have an approved answer for that yet. Add it to your project notes below and include it in your email to Baymori for a personal response.";
}
