// Reads an edited teksty-strony.docx (downloaded from Google Docs as .docx) and writes the
// right-column texts back into src/content/*.json by the keys in the left column.
//
// Usage: node scripts/content-doc-import.mjs <file.docx>          # show the diff only
//        node scripts/content-doc-import.mjs <file.docx> --write  # apply it
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const [file, flag] = process.argv.slice(2);
if (!file) { console.error('usage: node scripts/content-doc-import.mjs <file.docx> [--write]'); process.exit(1); }
const xml = execFileSync('unzip', ['-p', file, 'word/document.xml'], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');

const FILES = ['site', 'courses', 'team', 'faq', 'gallery', 'contact', 'reviews'];
const content = Object.fromEntries(FILES.map((n) => [n, JSON.parse(readFileSync(resolve(`src/content/${n}.json`), 'utf8'))]));
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const paraText = (p) => unescape([...p.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\/>|<w:br\/>/g)].map((m) => m[0] === '<w:tab/>' ? '\t' : m[0] === '<w:br/>' ? '\n' : m[1]).join(''));
const cellText = (c) => [...c.matchAll(/<w:p[\s>][\s\S]*?<\/w:p>|<w:p\/>/g)].map((m) => paraText(m[0])).join('\n').replace(/ /g, ' ').trim();

const KEY = /\b(site|courses|team|faq|gallery|contact|reviews)((?:\.[A-Za-z]+|\[\d+\])+)/;
const changes = [];
for (const tr of xml.matchAll(/<w:tr[\s>][\s\S]*?<\/w:tr>/g)) {
  const cells = [...tr[0].matchAll(/<w:tc[\s>][\s\S]*?<\/w:tc>/g)].map((m) => cellText(m[0]));
  if (cells.length < 2) continue;
  const labelCell = cells.length === 3 ? cells[1] : cells[0];
  const m = labelCell.match(KEY);
  if (!m) continue;
  const key = m[0], value = cells[cells.length - 1];
  const [, fileName, rest] = key.match(/^([a-z]+)(.*)$/);
  const path = [...rest.matchAll(/\.([A-Za-z]+)|\[(\d+)\]/g)].map((x) => x[1] ?? Number(x[2]));
  let node = content[fileName];
  for (let i = 0; i < path.length - 1; i++) { if (node[path[i]] == null) node[path[i]] = typeof path[i + 1] === 'number' ? [] : {}; node = node[path[i]]; }
  const last = path[path.length - 1];
  const old = node[last];
  const next = typeof old === 'number' ? Number(value.replace(/\s/g, '')) : value === '' && (old == null) ? old : value;
  if (next === old || (old == null && value === '')) continue;
  if (typeof old === 'number' && Number.isNaN(next)) { console.warn(`skip ${key}: "${value}" is not a number`); continue; }
  changes.push({ key, old, next });
  node[last] = next === '' ? null : next;
}
// drop empty trailing objects the empty rows may have created
content.reviews.quotes = (content.reviews.quotes || []).filter((q) => q && (q.text || q.who));
content.faq = content.faq.filter((f) => f && (f.q || f.a));

if (!changes.length) { console.log('no changes'); process.exit(0); }
for (const c of changes) console.log(`\n${c.key}\n  - ${JSON.stringify(c.old)}\n  + ${JSON.stringify(c.next)}`);
console.log(`\n${changes.length} change(s)`);
if (flag === '--write') {
  const touched = new Set(changes.map((c) => c.key.match(/^[a-z]+/)[0]));
  for (const n of touched) writeFileSync(resolve(`src/content/${n}.json`), JSON.stringify(content[n], null, 2) + '\n');
  console.log(`written: ${[...touched].map((n) => `src/content/${n}.json`).join(', ')}. Remember to bump updated/updatedLabel in site.json.`);
} else {
  console.log('dry run; add --write to apply');
}
