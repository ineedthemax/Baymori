// Operator-invoked staging sync. No public read API, browser token or automatic outreach.
import {execFileSync} from 'node:child_process';import {pathToFileURL} from 'node:url';
const source='79924565-d670-4860-a101-d88fc4197979';
export function mapLead(lead){return {parent:{type:'data_source_id',data_source_id:source},properties:{Client:{title:[{text:{content:(lead.business||`${lead.first_name} ${lead.last_name}`).trim()}}]},Stage:{status:{name:'Lead'}},'System Health':{select:{name:'Unknown'}},'Care Plan':{select:{name:'None'}},'Primary Contact':{rich_text:[{text:{content:`${lead.first_name} ${lead.last_name} | ${lead.email}`}}]},'Next Action':{rich_text:[{text:{content:'Review inquiry and assess fit'}}]},Notes:{rich_text:[{text:{content:`Inquiry reference: ${lead.id}\nService: ${lead.service}\n${lead.details}`.slice(0,2000)}}]},...(lead.website?{Website:{url:lead.website}}:{})}};}
async function main(){
 const id=process.argv.find(x=>x.startsWith('--lead-id='))?.slice(10);
 if(!id||!/^[0-9a-f-]{36}$/i.test(id))throw new Error('Provide --lead-id=UUID. Local staging is default; --remote explicitly targets staging D1.');
 const apply=process.argv.includes('--apply');const remote=process.argv.includes('--remote');
 const query=sql=>JSON.parse(execFileSync('node_modules/.bin/wrangler',['d1','execute','baymori-leads-staging','--config','wrangler.lead-flow.staging.jsonc',remote?'--remote':'--local','--command',sql,'--json'],{encoding:'utf8',maxBuffer:1e6,stdio:['ignore','pipe','pipe']}));
 const result=query(`SELECT * FROM leads WHERE id='${id}'`);const lead=result.flatMap(x=>x.results||[])[0];if(!lead)throw new Error('Inquiry not found in selected staging database.');
 if(lead.notion_page_id){console.log('Already linked to a Notion record.');return;}
 if(!apply){console.log('Dry run: matching inquiry exists. Apply would reconcile one Notion lead. No personal information printed.');return;}
 const token=process.env.NOTION_API_KEY;if(!token)throw new Error('Set NOTION_API_KEY securely for an integration limited to the Clients database.');
 const notion=async(path,body)=>{const response=await fetch(`https://api.notion.com/v1/${path}`,{method:body?'POST':'GET',headers:{authorization:`Bearer ${token}`,'Notion-Version':'2025-09-03','content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error(`Notion request failed: HTTP ${response.status}; no automatic create retry. Reconcile by inquiry reference.`);return response.json();};
 const schema=await notion(`data_sources/${source}`);for(const [name,type] of Object.entries({Client:'title',Stage:'status','System Health':'select','Care Plan':'select','Primary Contact':'rich_text','Next Action':'rich_text',Notes:'rich_text',Website:'url'}))if(schema.properties?.[name]?.type!==type)throw new Error(`Notion schema mismatch: ${name}`);
 const match=await notion(`data_sources/${source}/query`,{filter:{property:'Notes',rich_text:{contains:`Inquiry reference: ${id}`}},page_size:2});
 if(match.has_more||match.results.length>1)throw new Error('Multiple matching Notion records; manual reconciliation required.');
 // One operator at a time. On ambiguous create failure, inspect Notion before rerunning.
 const page=match.results[0]||await notion('pages',mapLead(lead));
 if(!/^[0-9a-f-]{36}$/i.test(page.id))throw new Error('Invalid Notion page identifier.');
 query(`UPDATE leads SET notion_page_id='${page.id}' WHERE id='${id}' AND notion_page_id IS NULL`);
 console.log('Staging inquiry reconciled to Notion; next action recorded.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(()=>{console.error('Staging sync stopped. Check configuration/access and reconcile any ambiguous write before retrying. No credentials or lead contents logged.');process.exitCode=1;});
