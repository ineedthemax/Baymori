import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('out');
const required = ['index.html', 'transfer/index.html', '404.html', 'privacy/index.html', 'terms/index.html', 'service-terms/index.html', 'cookies/index.html', 'accessibility/index.html'];
const failures = [];
for (const file of required) {
  const path = join(root, file);
  if (!existsSync(path) || !statSync(path).isFile()) failures.push(`Missing route: ${file}`);
}
if (existsSync(join(root, 'index.html'))) {
  const home = readFileSync(join(root, 'index.html'), 'utf8');
  for (const label of ['Less busywork.', 'More business.', 'Continue in email']) {
    if (!home.includes(label)) failures.push(`Missing homepage content: ${label}`);
  }
  const refs = [...home.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]);
  for (const ref of refs) {
    const trimmed = ref.replace(/^\/+/, '');
    const candidate = join(root, trimmed);
    const index = join(candidate, 'index.html');
    if (!existsSync(candidate) && !existsSync(index)) failures.push(`Missing local asset or route: ${ref}`);
  }
}
if (existsSync(join(root, 'transfer/index.html'))) {
  const transfer=readFileSync(join(root, 'transfer/index.html'), 'utf8');
  if (!transfer.includes('Continue in email')) failures.push('Transfer page missing native inquiry form');
}
if (failures.length) {
  console.error('Static export verification failed:\n' + failures.map(x=>' - '+x).join('\n'));
  process.exit(1);
}
console.log('Static export verified: homepage, transfer route, 404 page, forms and homepage asset references');
