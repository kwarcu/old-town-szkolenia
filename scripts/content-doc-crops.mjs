// Screenshots of every page section (phone width) plus gallery thumbnails, for the content document.
// Usage: npm run build && node scripts/content-doc-crops.mjs
import { createServer } from 'node:http';
import { readFile, stat, mkdir, readdir } from 'node:fs/promises';
import { extname, join, resolve, basename } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const dist = resolve('dist');
const out = resolve('docs/content-doc/crops');
await mkdir(out, { recursive: true });

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    let file = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce', locale: 'pl-PL' })).newPage();
await page.goto(`http://localhost:${server.address().port}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await page.evaluate(() => { document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in')); document.getElementById('bar').style.display = 'none'; document.querySelector('header.site').style.position = 'static'; });
await page.waitForTimeout(500);

const targets = { hero: '#hero', szkolenia: '#szkolenia', 'jak-uczymy': '#jak-uczymy', trio: '.trio', 'kto-uczy': '#kto-uczy', galeria: '#galeria', opinie: '#opinie', faq: '#faq', kontakt: '#kontakt', footer: 'footer.site' };
for (const [name, sel] of Object.entries(targets)) {
  const png = await page.locator(sel).screenshot({ animations: 'disabled' });
  await sharp(png).resize({ width: 390 }).jpeg({ quality: 85 }).toFile(join(out, `${name}.jpg`));
}
await browser.close();
server.close();

const gallery = resolve('src/assets/gallery');
for (const f of await readdir(gallery)) {
  if (!f.endsWith('.jpg')) continue;
  await sharp(join(gallery, f)).resize(180, 120, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(join(out, `g-${basename(f)}`));
}
console.log(`crops written to ${out}`);
