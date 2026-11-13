"use client";

import { useId } from "react";
import { Code2, CalendarDays, Video, NotebookTabs, Workflow, Search, Sparkles } from "lucide-react";

// An adaptation of the supplied connected-integration illustration, themed for Baymori.
// Lines are decorative; capability and platform labels remain accessible as text.
const tools = [
  { name: "Codex", subtitle: "Development", icon: Code2, x: 23, y: 26, path: "M 295 214 V 124 Q 295 109 280 109 H 138" },
  { name: "Claude", subtitle: "Workflows", icon: Sparkles, x: 76, y: 26, path: "M 325 214 V 124 Q 325 109 340 109 H 456" },
  { name: "Grok", subtitle: "AI analysis", icon: Search, x: 79, y: 53, path: "M 349 231 H 474" },
  { name: "Calendly", subtitle: "Scheduling", icon: CalendarDays, x: 76, y: 80, path: "M 325 250 V 321 Q 325 336 340 336 H 456" },
  { name: "Zoom", subtitle: "Meetings", icon: Video, x: 23, y: 80, path: "M 295 250 V 321 Q 295 336 280 336 H 138" },
  { name: "Notion", subtitle: "Workspaces", icon: NotebookTabs, x: 19, y: 53, path: "M 271 231 H 114" },
];

export function IntegrationNetwork() {
  const prefix = useId().replaceAll(":", "");
  return (
    <div className="network-panel" aria-label="Baymori technology workflow network">
      <div className="network-heading"><span className="network-overline">A CONNECTED APPROACH</span><span>Built around your business</span></div>
      <div className="network-art">
        <svg className="network-paths" viewBox="0 0 600 420" aria-hidden="true" preserveAspectRatio="none">
          {tools.map((tool, i) => (
            <g key={tool.name}>
              <path d={tool.path} stroke="#DED2CB" strokeWidth="1.4" fill="none" />
              <path d={tool.path} stroke={`url(#${prefix}-copper)`} strokeWidth="2.6" fill="none" strokeDasharray="20 230" className="network-flow" style={{ animationDelay: `${-i * .66}s` }} />
            </g>
          ))}
          <defs><linearGradient id={`${prefix}-copper`}><stop stopColor="#C5805A" stopOpacity=".08"/><stop offset=".5" stopColor="#BA6F49"/><stop offset="1" stopColor="#C5805A" stopOpacity=".08"/></linearGradient></defs>
        </svg>
        <div className="network-hub" aria-label="Baymori at the center"><img src="/brand/baymori-symbol-black.png" alt="" /><span>Baymori</span></div>
        {tools.map((tool) => { const Icon = tool.icon; return (
          <div key={tool.name} className="network-node" style={{ left: `${tool.x}%`, top: `${tool.y}%` }}>
            <span className="network-node-icon"><Icon size={20} strokeWidth={1.8} /></span>
            <span className="network-node-copy"><strong>{tool.name}</strong><small>{tool.subtitle}</small></span>
          </div>
        ); })}
      </div>
      <div className="network-footnote"><Workflow size={17}/><span>Examples of tools we can work with. Live connections depend on permissions, APIs, and project scope.</span></div>
    </div>
  );
}
