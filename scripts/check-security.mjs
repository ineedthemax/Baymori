import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n');const failures=[];
for(const file of files){if(/(^|\/)\.env($|\.)|(^|\/)\.dev\.vars($|\.)|\.(pem|key)$/.test(file))failures.push(`Sensitive file tracked: ${file}`);if(!/\.(tsx?|mjs|jsonc?|ya?ml|md|sql|txt)$/.test(file))continue;const text=readFileSync(file,'utf8');if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)||/\b(?:ghp_|github_pat_|sk_live_|re_)[A-Za-z0-9_]{24,}\b/.test(text))failures.push(`Potential credential: ${file}`);}
if(process.env.NEXT_PUBLIC_INTAKE_ENABLED==='true'&&!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)failures.push('Saved intake requires public Turnstile site key');
const prod=JSON.parse(readFileSync('wrangler.jsonc','utf8'));if(prod.name!=='baymori-website'||prod.main||prod.d1_databases)failures.push('Production config unexpectedly enables new backend');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log('Credential-pattern and production isolation checks passed (not a complete secret-history audit)');
