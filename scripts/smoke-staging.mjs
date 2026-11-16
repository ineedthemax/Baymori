// Read-only checks against the exact staging host. Never submits a lead or sends a message.
const origin='https://baymori-lead-flow-staging.ineedthemax05.workers.dev';
let failures=0;
for(const [path,expected] of [['/',200],['/privacy/',200],['/api/inquiries',405],['/api/leads',404],['/api/admin',404]]){
 try{const r=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(10000)});const missing=path.startsWith('/api/')?[]:['x-content-type-options','x-frame-options','content-security-policy','referrer-policy'].filter(h=>!r.headers.has(h));const pass=r.status===expected&&!missing.length;console.log(JSON.stringify({path,status:r.status,expected,missingHeaders:missing,pass,checkedAt:new Date().toISOString()}));if(!pass)failures++;await r.body?.cancel();}catch{console.log(JSON.stringify({path,pass:false,error:'unreachable'}));failures++;}
}
process.exitCode=failures?1:0;
