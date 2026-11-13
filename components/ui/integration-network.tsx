"use client";

import { useId, useState } from "react";
import { Bell, CalendarCheck2, ClipboardList, FolderKanban, Handshake, ListTodo, MailCheck, MessageSquareText, Send, Workflow } from "lucide-react";

// Outcome-first examples. Keep the original Baymori hub, node positions,
// animated copper pathways, background texture, and card treatment.
const paths = [
  { x: 23, y: 26, path: "M 295 214 V 124 Q 295 109 280 109 H 138" },
  { x: 76, y: 26, path: "M 325 214 V 124 Q 325 109 340 109 H 456" },
  { x: 79, y: 53, path: "M 349 231 H 474" },
  { x: 76, y: 80, path: "M 325 250 V 321 Q 325 336 340 336 H 456" },
  { x: 23, y: 80, path: "M 295 250 V 321 Q 295 336 280 336 H 138" },
  { x: 19, y: 53, path: "M 271 231 H 114" },
];

const examples = {
  business: [
    { name: "New inquiry", subtitle: "Customer reaches out", icon: MessageSquareText },
    { name: "Lead captured", subtitle: "Details organized", icon: ClipboardList },
    { name: "Follow-up", subtitle: "Next steps sent", icon: Send },
    { name: "Booking", subtitle: "Time confirmed", icon: CalendarCheck2 },
    { name: "Work tracked", subtitle: "Tasks stay visible", icon: ListTodo },
    { name: "Team updated", subtitle: "Everyone aligned", icon: Bell },
  ],
  creator: [
    { name: "Brand inquiry", subtitle: "Partnership request", icon: Handshake },
    { name: "Brief captured", subtitle: "Details organized", icon: ClipboardList },
    { name: "Follow-up", subtitle: "Next steps sent", icon: MailCheck },
    { name: "Call booked", subtitle: "Calendar updated", icon: CalendarCheck2 },
    { name: "Deliverables", subtitle: "Deadlines tracked", icon: FolderKanban },
    { name: "Partner updated", subtitle: "Progress shared", icon: Bell },
  ],
} as const;

type Audience = keyof typeof examples;

export function IntegrationNetwork() {
  const prefix = useId().replaceAll(":", "");
  const [audience, setAudience] = useState<Audience>("business");
  const nodes = examples[audience];

  return (
    <div className="network-panel" aria-label="Examples of Baymori business and creator workflows">
      <div className="network-heading">
        <span className="network-overline">A CONNECTED APPROACH</span>
        <span>Built around your work</span>
      </div>
      <div className="network-switch" role="group" aria-label="Choose a workflow example">
        <button type="button" className={audience === "business" ? "is-active" : ""} aria-pressed={audience === "business"} onClick={() => setAudience("business")}>Business</button>
        <button type="button" className={audience === "creator" ? "is-active" : ""} aria-pressed={audience === "creator"} onClick={() => setAudience("creator")}>Creator</button>
      </div>
      <div className="network-art">
        <svg className="network-paths" viewBox="0 0 600 420" aria-hidden="true" preserveAspectRatio="none">
          {paths.map((node, i) => (
            <g key={i}>
              <path d={node.path} stroke="#DED2CB" strokeWidth="1.4" fill="none" />
              <path d={node.path} stroke={`url(#${prefix}-copper)`} strokeWidth="2.6" fill="none" strokeDasharray="20 230" className="network-flow" style={{ animationDelay: `${-i * .66}s` }} />
            </g>
          ))}
          <defs><linearGradient id={`${prefix}-copper`}><stop stopColor="#C5805A" stopOpacity=".08"/><stop offset=".5" stopColor="#BA6F49"/><stop offset="1" stopColor="#C5805A" stopOpacity=".08"/></linearGradient></defs>
        </svg>
        <div className="network-hub" aria-label="Baymori at the center"><img src="/brand/baymori-symbol-black.png" alt="" /><span>Baymori</span></div>
        {nodes.map((node, i) => { const Icon = node.icon; const point = paths[i]; return (
          <div key={node.name} className="network-node" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
            <span className="network-node-icon"><Icon size={20} strokeWidth={1.8} /></span>
            <span className="network-node-copy"><strong>{node.name}</strong><small>{node.subtitle}</small></span>
          </div>
        ); })}
      </div>
      <div className="network-footnote"><Workflow size={17}/><span>Illustrative workflows, not live client case studies. Each system is scoped to your needs, tools, and permissions.</span></div>
    </div>
  );
}
