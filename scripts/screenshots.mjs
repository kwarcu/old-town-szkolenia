// Full-page screenshots of the built site (dist/) for the design-critic loop.
// Usage: npm run build && node scripts/screenshots.mjs [outDir]
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const dist = resolve('dist');
const out = resolve(process.argv[2] || 'screens');
await mkdir(out, { recursive: true });

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = join(dist, p);
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch();
const shots = [
  { name: 'mobile-fold', viewport: { width: 390, height: 844 }, scale: 2, full: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, scale: 1.5, full: true } /* scale 2 would exceed Chromium's 16384 px capture limit */,
  { name: 'desktop-fold', viewport: { width: 1440, height: 900 }, scale: 1, full: false },
  { name: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1, full: true },
];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, reducedMotion: 'reduce', locale: 'pl-PL' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (s.full) {
    // scroll through so every .reveal is marked in and lazy images load; hide the fixed bar and the sticky header for the full-page capture
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
    await page.evaluate(() => { document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in')); const bar = document.getElementById('bar'); if (bar) bar.style.display = 'none'; const h = document.querySelector('header.site'); if (h) h.style.position = 'static'; });
    await page.waitForTimeout(600);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.screenshot({ path: join(out, `${s.name}.png`), fullPage: s.full });
  console.log(`${s.name}.png${overflow ? '  HORIZONTAL OVERFLOW' : ''}${errors.length ? '  console: ' + errors.join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();
server.close();
