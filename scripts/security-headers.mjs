import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join,relative} from 'node:path';import {createHash} from 'node:crypto';
let output=`/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000\n`;
let count=0;
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())walk(file);else if(file.endsWith('.html')){
 const hashes=new Set();const html=readFileSync(file,'utf8');for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(!/\bsrc\s*=/.test(match[1])&&match[2])hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);}
 const sources=["'self'",'https://challenges.cloudflare.com',...hashes].join(' ');
 const csp=`default-src 'self'; script-src ${sources}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; upgrade-insecure-requests`;
 if(csp.length>1900)throw new Error(`CSP too long for ${file}`);
 const path='/'+relative('out',file);const route=path.endsWith('/index.html')?path.slice(0,-10):path;
 const paths=new Set([path,route,...(route.endsWith('/')&&route!=='/'?[route.slice(0,-1)]:[])]);
 for(const p of paths)output+=`\n${p}\n  Content-Security-Policy: ${csp}\n`;count++;
}}}
walk('out');output+='\nhttps://baymori-lead-flow-staging.ineedthemax05.workers.dev/*\n  X-Robots-Tag: noindex, nofollow\n';writeFileSync('out/_headers',output);console.log(`Security headers generated for ${count} HTML files`);
