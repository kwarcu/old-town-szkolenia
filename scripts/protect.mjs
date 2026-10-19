// Alpha mode: when ALPHA_PASSWORD is set, encrypt the HTML pages with StatiCrypt so the
// site can sit on a public static host behind a password, and tell crawlers to stay away.
// Without the variable this script does nothing, so the normal build is untouched.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const password = process.env.ALPHA_PASSWORD;
if (!password) { console.log('[protect] ALPHA_PASSWORD not set, leaving dist/ open'); process.exit(0); }

const dist = resolve('dist');
const pages = ['index.html', 'polityka-prywatnosci/index.html'].map((p) => join(dist, p)).filter(existsSync);
// a fixed, non-secret salt keeps the "remember me" hash stable between deploys
const SALT = '2c7a9e4f1b3d5a6c8e0f2a4b6c8d0e1f';
const bin = resolve('node_modules/.bin/staticrypt');

for (const page of pages) {
  const out = mkdtempSync(join(tmpdir(), 'staticrypt-'));
  execFileSync(bin, [page, '-d', out, '-p', password, '-s', SALT, '-c', 'false', '--short', '--remember', '30',
    '--template-title', 'Szkoła Barberingu Old Town — wersja robocza',
    '--template-instructions', 'Strona w przygotowaniu. Wpisz hasło, które dostałeś od Bartka lub Basi.',
    '--template-placeholder', 'Hasło',
    '--template-button', 'Otwórz',
    '--template-remember', 'Zapamiętaj mnie na tym urządzeniu',
    '--template-error', 'Nieprawidłowe hasło',
    '--template-color-primary', '#161615', '--template-color-secondary', '#e7e3d9', '--template-color-title', '#161615',
  ], { stdio: 'inherit' });
  const encrypted = readFileSync(join(out, basename(page)), 'utf8').replace('<head>', '<head><meta name="robots" content="noindex, nofollow">');
  writeFileSync(page, encrypted);
  rmSync(out, { recursive: true, force: true });
}

writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
writeFileSync(join(dist, 'llms.txt'), 'Strona w przygotowaniu.\n');
for (const f of ['sitemap-index.xml', 'sitemap-0.xml']) rmSync(join(dist, f), { force: true });
console.log(`[protect] ${pages.length} page(s) encrypted, crawlers told to stay away`);
