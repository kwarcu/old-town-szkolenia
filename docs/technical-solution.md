# Technical solution — alpha (2026-10-19)

How the landing page is built, hosted and maintained. Decisions made for the alpha; everything here can be revisited before launch.

## Stack

- **Astro 5** (static output). One page (`src/pages/index.astro`), one legal subpage (`src/pages/polityka-prywatnosci.astro`), a generated `/llms.txt` (`src/pages/llms.txt.ts`), `sitemap-index.xml` from `@astrojs/sitemap`, `robots.txt` from `public/`.
- **Content as data** (PRD FR-10): everything that changes lives in `src/content/*.json` and is rendered at build time, so the HTML is complete without JavaScript (PRD §8.2):
  - `site.json` — brand, hero, the "W skrócie" paragraph (`brief`), day-in-the-shop steps, photo strip captions, history, team section copy, FAQ heading, social links, footer.
  - `courses.json` — the two courses: days, cohorts (label + ISO month for structured data), group, audience, learning points, certificate, price, deposit, description for JSON-LD.
  - `team.json` — Basia and Kuba: names, roles, bios, portrait file name, alt text, quote.
  - `faq.json` — questions and self-contained answers (40–80 words, PRD §8.4).
  - `contact.json` — phone, e-mail, address, directions, form options and labels.
  - `reviews.json` — Booksy rating and count with the date they were checked, and the quotes. Only real reviews go here.
- **Design** (`src/styles/global.css`): direction 05 "Warsztat+" ported one-to-one. Fonts self-hosted via `@fontsource` (Big Shoulders Display 600/700/800, Barlow 400/500/600; latin + latin-ext subsets load on demand).
- **Images**: `src/assets/photos/` holds the graded black-and-white selection from the 2026-10-05 session (max 2600 px, JPEG q90). Astro's image service (sharp) emits responsive WebP at build; only photos referenced from the page reach `dist/`. Unused but graded frames sit in `src/assets/photo-pool/` (local only, gitignored; regenerate from the zip with the pipeline in `docs/sources/photos-2026-10-05.md`). Raw frames and the zip are never committed.
- **Structured data**: `EducationalOrganization` (with `parentOrganization` HairSalon), `Person` (Basia), two `Course` objects with `CourseInstance` per cohort and an `Offer` only where a public price exists, `FAQPage`, `WebPage`/`WebSite` with `dateModified` = `site.updated`.
- **Form**: fields per PRD FR-1 with honeypot. In the alpha the form has no backend: client-side validation and an in-place thank-you only. Before launch wire `contact.form.action` to a form backend (Web3Forms, Formspree, or a Cloudflare Worker that e-mails the school's mailbox with a copy to Bartek) and keep the honeypot plus a minimum-time check (FR-3).
- **Analytics**: none in the alpha. Launch candidate: a cookieless provider (Plausible, Umami or Cloudflare Web Analytics) with the four events from FR-5.

## Commands

```bash
npm install          # once
npm run dev          # http://localhost:4321
npm run build        # dist/
node scripts/screenshots.mjs   # screens/{mobile-fold,mobile,desktop-fold,desktop}.png from dist/, for the critic loop
```

Node 24 (`.nvmrc`). Playwright downloads its own Chromium on first use (`npx playwright install chromium`).

## Hosting (alpha): GitHub Pages

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages. It sets `SITE_URL` and `BASE_PATH` for a project site (`https://<owner>.github.io/<repo>/`). When the real domain is attached, set `SITE_URL=https://szkoleniebarber.pl` and `BASE_PATH=/` in the workflow and add the `CNAME`.

Cloudflare Pages is the alternative with the same build (`npm run build`, output `dist`); it serves from the root, so no `BASE_PATH` is needed.

## Maintenance (PRD §9, ≤ 15 minutes per change)

1. Edit the JSON file (price, date, FAQ answer, quote).
2. Bump `updated` and `updatedLabel` in `site.json` (they drive the visible "Stan na" line and `dateModified`).
3. Commit and push to `main`; Pages rebuilds in about two minutes.

## Measured on 2026-10-19 (alpha, local build)

| | Requests | First-view transfer |
|---|---|---|
| Mobile 390 px, 3× | 17 | ~480 kB (the lazy strip photo is fetched early because the page got shorter) |
| Desktop 1440 px | 21 | ~480 kB |

PRD §9 budget is 1.5 MB. Fonts: six Barlow/Big Shoulders woff2 files, ~20 kB each. No console errors, no horizontal overflow at 390 or 1440.

## Open before launch

- Form backend and the school's mailbox (PRD FR-2, Appendix A 13).
- Legal name and NIP in the footer and the privacy policy (Appendix A 12).
- Cookieless analytics (FR-5), Search Console and Bing registration, IndexNow (§8.2).
- Vector logo (the masthead uses a 298 px PNG).
- Daily hours, exact cohort dates, minimum age, the 10-day course price (Appendix A 1–8).
