# PRD: Szkoła Barberingu Old Town — landing page v1

| Field | Value |
|---|---|
| Status | Draft v0.3 for review (v0.3: Basia's answers folded in, open decisions narrowed) |
| Date | 2026-09-15 (first draft 2026-09-14) |
| Owner | Bartek (product, build, content maintenance) |
| Business stakeholder | Basia (Barbara Frączek), owner of Barber Shop Old Town, Tarnowskie Góry |
| Related documents | `docs/creative-direction.md` (next step), `docs/technical-solution.md` (after that) |
| Source content | `texts.txt` (manifesto + two course descriptions, written by Basia); `docs/sources/basia-answers-2026-09-15.md` (her answers to the first round of questions) |

## 1. Summary

Barber Shop Old Town is launching a barbering school. It has no online presence for the school yet: no page, no social profiles, no domain. The barbershop's existing site (oldtownbarber.pl) is an outdated static page with an expired SSL certificate, so it cannot carry the school's offer.

This project delivers a **single-page landing page** that presents the school, its two training products and the people behind it, and converts visitors into **inquiries via a contact form** (plus phone). The page is Polish-only, mobile-first, fast, and its content lives in plain files so Bartek can update prices, dates and copy in minutes without a CMS.

The page must also be excellent at being found: classic and local search engine optimisation plus generative engine optimisation, so that Google and AI assistants name the school when someone in Silesia asks where to learn barbering (§8).

The work is split into three documents. This PRD fixes *what* and *why*. The creative-direction document will fix *how it looks and sounds*. The technical-solution document will fix *how it is built, hosted and maintained*.

## 2. Goals and success metrics

### 2.1 Business goals

1. **Generate qualified inquiries** for the two courses (primary).
2. **Establish the school as a credible brand** distinct from, but backed by, the barbershop: "Szkoła Barberingu Old Town" becomes a name Basia can put on Instagram, in the shop and in conversations.
3. **Give Basia one link** to send to anyone who asks about training.
4. **Be the answer** when someone in Silesia asks Google or an AI assistant where to learn barbering: strong classic SEO, local SEO and generative engine optimisation (GEO) are a hard requirement, not a nice-to-have (see §8).

### 2.2 Success metrics (targets to validate with Basia)

| Metric | Target for first 3 months after launch | How measured |
|---|---|---|
| Form submissions (qualified inquiries) | 8–15 per month | Form deliveries + analytics event `form_submit` |
| Phone / WhatsApp clicks | tracked, no target in v1 | Analytics event `phone_click` |
| Visitor-to-inquiry conversion | 3–5 % of unique visitors | Analytics |
| Inquiries that become enrolments | reported by Basia monthly | Manual, spreadsheet |
| Lighthouse (mobile) performance and accessibility | ≥ 90 each | Lighthouse CI or manual run before each release |
| Time for Bartek to change a price or date and publish | ≤ 15 minutes | Observed |
| Indexed by Google and Bing | within 7 days of launch | Search Console, Bing Webmaster Tools |
| Google top 10 for "szkoła barberingu Tarnowskie Góry" and "szkolenie barberskie Tarnowskie Góry" | within 3 months | Search Console average position |
| Google top 20 for "kurs barberski Śląsk" | within 6 months | Search Console average position |
| Named by AI assistants for "szkolenie barberskie Tarnowskie Góry" (ChatGPT, Perplexity, Gemini, Claude) | at least 2 of 4 within 3 months | Monthly manual check, see §8.7 |
| Referrals from AI assistants | tracked, no target in v1 | Analytics referrer segment |

Traffic sources are outside this page's scope but shape it: Instagram bio link and stories, Facebook posts from the shop and from Salon Metamorfoza, Google organic, a QR code on a poster in the shop, and possibly paid social later. The page must therefore load fast on mobile from an in-app browser and support UTM tagging.

## 3. Background

### 3.1 The business (verified online, to confirm with Basia)

- Owner: **Barbara Frączek**. Hairdressing since **2003**; **Salon Fryzjerski Metamorfoza** opened **2008** and still runs; **Barber Shop Old Town** opened **January 2018**. Timeline confirmed by Basia on 2026-09-15.
- Barber Shop Old Town address: **ul. Oświęcimska 1, 42-600 Tarnowskie Góry** (confirmed by Bartek on 2026-09-14; training takes place there). Older directory listings still show ul. Piłsudskiego 10, the previous location, so map links and structured data must use Oświęcimska 1. Phone: 725 404 010.
- Booksy: **5.0 rating from 1,429 reviews** (1,417 five-star). Team listed: Aneta, Basia, Miłosz, Kuba, Nikodem, Ilian. Basia has agreed that reviews may be quoted on the page.
- Trainers: **Basia and Kuba** (both issue the course certificate).
- Basia appeared as a candidate in a Dziennik Zachodni readers' poll, but she does not want it used; it stays off the page.
- Instagram `@barbershopoldtowntg`: 457 followers, bio "Miejsce tylko dla dżentelmenów!". Facebook page for Salon Fryzjerski Metamorfoza has roughly 1,700 likes.
- Interior described in local press (Gwarek, 2020) as industrial, garage-like, deliberately masculine.
- The school has **no** website, domain, or social profile yet.

### 3.2 Existing barbershop website (oldtownbarber.pl)

- Static HTML on cPanel/Apache shared hosting. Sections: O nas, Usługi, Ekipa, Cennik, Galeria, Kontakt. No training content.
- **SSL certificate expired 13 Dec 2022**; browsers show a security warning. Team section is out of date.
- Decision taken: the school gets a **new, separate domain**. The old site is not touched in v1. The SSL issue is flagged to Basia as a separate task (see Appendix A).

### 3.3 Competition and benchmark

| School | Where | Offer | Price | Notes |
|---|---|---|---|---|
| Tarnogórscy Lordowie Barber Shop & Academy | Tarnowskie Góry, Rynek 11 | trains in-shop; sells "training" haircuts to clients for 1 zł | not published | **Direct local competitor.** Modern website (Astro), 4.9 rating from 250+ reviews on aggregators |
| Cut'U School | Katowice, Warszawa | 20 training days, Mon–Sat, groups of 3–6 | 11,000 zł | Day-by-day curriculum, tools included, models from day 6, certificate, post-course support |
| Gentlemen Barber Academy | Katowice + 4 cities | 4-week "od zera do barbera"; advanced modules | 12,000 zł; 950 zł/day advanced | Certificate, "career prospects" section, form CTA |
| Akademia Cyrulika (Cyrulik Śląski) | Katowice | 4-day basic course | not published | |
| Old Craft Barbershop | — | weekend basics course, max 3 people | not published | Exam at the end |
| ZDZ Katowice | Katowice | vocational "Barber" course | not published | Institutional, funded-training channel |

What the market considers table stakes on a training page: who it is for, program outline, duration and schedule, group size, what is included (tools, models, certificate), price or a clear "ask for price", trainer profile, photos of real work, and a form or phone CTA. Several competitors also advertise **public funding** (Urząd Pracy, KFS, BUR).

What Old Town can claim that the big academies cannot: training **inside a working barbershop with real clients**, a mentor who has run salons for 20+ years, and a **thinking-over-schemes** philosophy that Basia's texts express unusually well.

## 4. Target audience

All four personas come directly from Basia's course descriptions.

| Persona | Situation | What they need to hear | Course |
|---|---|---|---|
| **Absolwent szkoły branżowej** | Finished hairdressing vocational school, little real practice, unsure at the chair | Real clients, real pace, someone correcting you | Tygodniowe / dwutygodniowe |
| **Fryzjerka damska** | Works in women's hairdressing, wants to add men's cuts and barbering | Understanding men's cuts, head shapes, fades; fits around a job | Tygodniowe / dwutygodniowe |
| **Po innym kursie, bez pewności** | Did a course elsewhere, knows techniques, afraid of clients | Confidence, fluency, "Jestem gotowy" | Tygodniowe / dwutygodniowe |
| **Od zera / zmiana zawodu** | No experience, considering barbering as a career | What the job really is, full path, price, duration, financing, job after | Od podstaw |

Secondary readers: parents or partners helping to fund the course, and salon owners sending an employee. They need the same facts, stated plainly.

Reader context: mostly **mobile**, often arriving from Instagram or Facebook in an in-app browser, Polish-speaking, Silesia and neighbouring regions. Candidates from further away will ask about accommodation.

## 5. Positioning and messaging

### 5.1 Positioning statement

For people who want to work as barbers and are tired of courses that teach a haircut but not the job, Szkoła Barberingu Old Town is the training that happens inside a real barbershop, with real clients, led by people who have worked behind the chair every day for over 20 years.

### 5.2 Message pillars (in priority order)

1. **Real shop, real clients.** You train in the daily life of Barber Shop Old Town, not in a classroom.
2. **Thinking, not schemes.** Choosing the technique for the hair, the head shape and the person; making decisions instead of replaying a formula.
3. **The whole craft.** Consultation, relationship, organisation, atmosphere: the things that make a client come back.
4. **Mentorship.** Observed, corrected, taught individually; "Każdy uczestnik jest inny".
5. **Proof.** 2003 → 2008 Metamorfoza → 2018 Old Town; thousands of clients; 5.0 on Booksy from 1,400+ reviews.

### 5.3 Tone of voice

Basia's texts already set it: second-person "Ty", warm, direct, honest, a mentor talking rather than a school selling. No hype ("zostań barberem w 5 dni"), no fake urgency. Her own sentences should headline sections, for example "Nie uczymy wyłącznie strzyc. Uczymy, jak zostać barberem." and the closing "Jestem gotowy." The creative-direction document will refine this into copy rules.

## 6. Scope v1: page structure

One page with anchored sections, plus one legal subpage (privacy policy). Content status: **have** (in `texts.txt` or confirmed by Basia), **partial** (some facts known, details pending), **missing** (must come from Basia; see Appendix A).

| # | Section | Purpose | Content source | Status |
|---|---|---|---|---|
| 1 | **Header / nav** | Logo, anchors (Szkolenia, Jak uczymy, O nas, FAQ, Kontakt), phone, CTA button "Zapytaj o szkolenie" | — | needs logo |
| 2 | **Hero** | One-sentence promise, subline, two CTAs (form, call), trust strip (od 2003 · prawdziwy salon · Booksy 5.0) | manifesto | needs hero photo |
| 2a | **W skrócie** | Compact facts block for people and machines (§8.4): what, where, two courses with durations, next cohorts, group size, price (per decision in Appendix A), how to enrol | §6.1 | have, except price |
| 3 | **Dla kogo** | Four persona cards; each links to its course card | course texts | have |
| 4 | **Szkolenia** | Two course cards: quote, for whom, what you learn, format (duration, group size, next cohorts), what is included, certificate, price and deposit, CTA | course texts + §6.1 | have, except price policy, daily hours and exact start dates |
| 5 | **Jak wygląda szkolenie** | A day in the shop as steps: stanowisko → konsultacja → usługa → pożegnanie; real clients; observation and correction | course texts | have; photos missing |
| 6 | **Nasza historia** | Timeline 2003 / 2008 / 2018 / 2026 (school); condensed manifesto | manifesto | have, dates confirmed |
| 7 | **Kto uczy** | Basia and Kuba: name, role, short bio, photo | confirmed trainers | bios and portraits **missing** |
| 8 | **Dowody** | Booksy rating and review count, "tysiące klientów" (or a number if Basia gives one), 3–4 quoted Booksy reviews, link to Instagram | verified online, quoting approved | have; pick the quotes |
| 9 | **FAQ** | 8–10 candidate questions: duration and schedule, next dates, group size and the minimum of two, price and deposit, tools, certificate, minimum age, accommodation, how enrolment works. No question about employment after the course (Basia's decision) and no funding question until funding exists | §6.1 | have, except price, age, hours |
| 10 | **Kontakt / formularz** | Form (see FR-1), phone (the barbershop's number), address with map link, hours, Instagram and Facebook, short "Jak dojechać" note (parking, travel time from Katowice, Bytom, Gliwice) for local SEO | confirmed | school e-mail address pending; directions text |
| 11 | **Footer** | Company legal name, NIP, address, privacy policy link, links to oldtownbarber.pl and Metamorfoza | — | **missing** company data |
| 12 | **Polityka prywatności** (subpage) | RODO information for the form and analytics | template | needs company data |

Graduate testimonials and a gallery of student work are **not** in v1: the school is new and has none. Social proof in v1 leans on the barbershop's reputation and Basia's history. Both sections are planned for v1.1 once the first cohort finishes (see §10).

### 6.1 Course facts confirmed by Basia (2026-09-15)

These are the facts the page states. Anything marked *pending* is listed in Appendix A.

| Fact | Szkolenie od podstaw | Szkolenie tygodniowe i dwutygodniowe |
|---|---|---|
| Length | 21 training days | 10 training days (whether a 5-day variant exists is *pending*; the product may be renamed) |
| Daily hours and weekly pattern | *pending* | *pending* |
| Next cohorts | November 2026, January 2027; exact start dates *pending* | February 2027, March 2027; exact dates *pending* |
| Group size | maximum 3; the cohort runs with at least 2; a single candidate gets an individually arranged format | maximum 3; the same rule assumed, *pending* confirmation |
| Price | policy *pending*: Basia's answer mixed "not shown" with "fixed 11 000 zł, launch promotion 10 000 zł" (see Appendix A, decision 1) | *pending* |
| Deposit | 15 % of the course price on enrolment | 15 % assumed, *pending* |
| Included | all tools and equipment, professional products, use of the whole salon and back rooms, kitchen, coffee and drinks | the same |
| Own tools needed | no | no |
| Certificate | "Certyfikat ukończenia szkolenia Barber od podstaw", issued by the trainer | equivalent certificate, name *pending* |
| Trainers | Basia (Barbara Frączek) and Kuba | the same |
| Minimum age | *pending*: no limit or 16+ (see Appendix A, decision 3) | the same |
| Accommodation | not included; the school recommends a hotel (name *pending*) | the same |
| Public funding (KFS, BUR, Urząd Pracy) | not available yet; formalities in progress; not mentioned on the page in v1 | the same |
| Employment after the course | not mentioned on the page (Basia's decision) | the same |
| Contact | new school e-mail (address *pending*); phone 725 404 010; no WhatsApp | the same |

Consequences for the page: the cohort model replaces the earlier assumption of individually agreed dates. The course card shows the next two start months, the group size and the "minimum two, otherwise individual" rule in plain words. Since dates change twice a year, they live in the content file (FR-10) with a visible "ostatnia aktualizacja" date (§8.4).

## 7. Functional requirements

**FR-1 Contact form.** Fields: imię (required), telefon (required), e-mail (required, validated), interesujące szkolenie (select: od podstaw / 10-dniowe dla osób z doświadczeniem / nie wiem jeszcze; labels follow the final product names), preferowany termin (optional select, populated from the cohort list in the content file), doświadczenie (select: brak / szkoła branżowa / fryzjer(ka) damska / po innym kursie / pracuję jako barber), wiadomość (optional), RODO consent checkbox (required, links to privacy policy). Client-side validation with Polish messages; server-side validation in the form backend.

**FR-2 Form delivery.** Each submission is e-mailed to the school's new mailbox (proposed: an address on the new domain, forwarded to Basia) with a copy to Bartek, within one minute. The backend keeps a log of submissions as a backup. Submission triggers a thank-you state on the page (no redirect needed) and, if cheap to add, an auto-reply e-mail to the candidate.

**FR-3 Spam protection.** Honeypot field plus a minimum-time check; add a captcha only if spam appears. No third-party script that blocks rendering.

**FR-4 Click-to-call and messaging.** The barbershop's phone number as `tel:` link in header, hero and contact section. No WhatsApp (Basia's decision). Instagram and Facebook links open in new tabs.

**FR-5 Analytics.** Privacy-friendly, cookieless analytics (so no cookie banner is required). Events: `form_submit`, `phone_click`, `ig_click`, `cta_click` with section name. UTM parameters preserved. Meta Pixel or Google Ads tags are **not** in v1 because they require a consent banner; see §10.

**FR-6 Search and AI discoverability.** The page must be excellent at classic search engine optimisation, local SEO, and being found and cited by AI assistants (LLM SEO / generative engine optimisation, GEO). This is a hard requirement, specified in full in §8; every item there is a v1 requirement unless marked otherwise.

**FR-7 Mobile-first and in-app browsers.** Layout works from 360 px width up; tap targets ≥ 44 px; the form works in Instagram's and Facebook's in-app browsers.

**FR-8 Accessibility.** WCAG 2.1 AA basics: contrast ≥ 4.5:1 for text, keyboard-operable nav and form, visible focus, alt text on every meaningful image, form errors announced.

**FR-9 Legal.** Privacy policy page in Polish naming the data controller, purpose (answering inquiries), legal basis, retention, and the analytics provider. Footer shows legal name, NIP and address. If any cookie-setting service is added later, a consent banner is added with it.

**FR-10 Content as data.** Courses, FAQ, team, contact details and trust numbers live in structured content files (not inline HTML) so that a price change is a one-line edit. This also allows per-course subpages in v2 without restructuring.

## 8. Search and AI discoverability (SEO, local SEO, GEO)

Added as a hard requirement on 2026-09-14. Classic SEO, local SEO and generative engine optimisation (being found, quoted and recommended by ChatGPT, Perplexity, Gemini, Google AI Overviews and Claude) are mostly the same work: a fast, crawlable, semantically clear page with unambiguous facts, consistent entity data across the web and complete structured data. Where AI answers need something extra, it is called out.

### 8.1 Target phrases and targets

| Tier | Phrases | Where they go |
|---|---|---|
| 1, head | szkolenie barberskie, szkoła barberingu, kurs barberski | title, H1, hero, meta description |
| 2, local | Tarnowskie Góry, Śląsk / na Śląsku, województwo śląskie, koło Katowic, Bytomia, Gliwic, Piekar Śląskich | hero subline, contact, "Jak dojechać", FAQ |
| 3, intent | kurs barberski od podstaw, szkolenie barberskie dla fryzjerów, kurs barbera cena, ile trwa kurs barberski, jak zostać barberem, szkolenie barberskie z prawdziwymi klientami | course H2s, FAQ questions, section openers |

Targets are in §2.2. Search Console data after 60 days decides whether tier 3 phrases need their own URLs (course subpages, see §10 and §13).

### 8.2 Technical SEO (page)

- Static, fully rendered HTML. Every piece of content, including FAQ answers and the full course texts inside expandable blocks, is in the HTML and readable without JavaScript.
- One H1; logical H2/H3 per section; semantic elements (`header`, `nav`, `main`, `section`, `article`, `address`, `footer`); a `lang="pl"` document.
- Title ≤ 60 characters and meta description ≤ 155 characters, each containing a tier 1 phrase and the city.
- Canonical URL, `sitemap.xml`, `robots.txt`, custom 404, HTTPS only, single hostname (www or bare, the other redirects), consistent trailing slashes.
- Open Graph and Twitter card tags with a branded 1200×630 share image.
- Core Web Vitals green on mobile: LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- Descriptive Polish alt text on meaningful images; descriptive ASCII file names; `loading="lazy"` below the fold, hero image preloaded.
- Stable section IDs (for example `#szkolenie-od-podstaw`, `#szkolenie-tygodniowe`) so course sections can be deep-linked now and redirected to subpages later.
- IndexNow ping on every deploy; property registered in Google Search Console and Bing Webmaster Tools on launch day.

### 8.3 Structured data (JSON-LD)

- `Organization` for Szkoła Barberingu Old Town: `parentOrganization` Barber Shop Old Town, `founder` (Person: Barbara Frączek), `sameAs` to Instagram, Facebook, Booksy and oldtownbarber.pl, `logo`, `contactPoint`.
- `LocalBusiness` (subtype `HairSalon` or `EducationalOrganization`, decided in the technical document) with name, address (Oświęcimska 1), `telephone`, `geo`, `openingHoursSpecification`, `areaServed` (Tarnowskie Góry, województwo śląskie).
- `Course`, one per training, with `provider`, `description`, one `hasCourseInstance` per cohort (`courseMode` "Onsite", `location`, `instructor`, `startDate`, `courseWorkload` or `duration`) and `offers` with price and currency if the public-price option is chosen (Appendix A, decision 1); otherwise `offers` is omitted rather than faked. Follows Google's Course rich-result requirements.
- `FAQPage` for the FAQ section. Rich-result eligibility for FAQ is limited, but the markup still improves machine reading.
- `Person` for Basia: `jobTitle`, `worksFor`, `knowsAbout`, `sameAs`.
- `WebSite` and `WebPage` with `dateModified` kept in sync with the visible "aktualizacja" date.
- Validated with Google Rich Results Test and the Schema.org validator; part of the release checklist.

### 8.4 Content written for search and for AI answers

- **Answer-first paragraphs.** Each section opens with one plain sentence that states the fact: what, for whom, how long, where. Assistants quote openers.
- **"W skrócie" block** near the top: school name, where, the two courses with durations and group size, price or "cena ustalana indywidualnie", how to enrol. This is the paragraph an assistant should lift verbatim.
- **Entity consistency (NAP).** The school's name is spelled one way everywhere: "Szkoła Barberingu Old Town". Address, phone and hours match Booksy, Google Business Profile, Facebook, Instagram and oldtownbarber.pl.
- **Self-contained FAQ answers**, 40–80 words each, that make sense out of context, because assistants quote them without the question.
- **Local signals in natural language:** the city, the region, nearby cities and travel times, parking or public transport, in the contact and FAQ sections.
- **E-E-A-T signals:** named trainers with verifiable history (dates, salons), real photos, a link to Booksy reviews, the Gwarek 2020 press mention, a visible "ostatnia aktualizacja" date next to prices and dates.
- Full course texts appear once on the page; no duplicate or thin boilerplate. ASCII slugs and IDs; full Polish diacritics in all visible text.

### 8.5 AI crawler policy and machine-readable summary

- `robots.txt` explicitly allows the crawlers that feed AI answers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Bingbot, Applebot, CCBot. Decision: allow all; being cited is the goal. Hosting-level "block AI bots" toggles must stay off.
- `/llms.txt` (Markdown) at the domain root: one-paragraph description, key facts, section links, contact. Generated at build time from the same content files as the page (FR-10) so it never drifts. `/llms-full.txt` with the full page text is optional and cheap once the first exists.
- No content gated behind interaction: no "click to reveal price" patterns, no text rendered only by JavaScript.

### 8.6 Off-page work required for the goals (not page code)

- **Google Business Profile.** Either add training as a service and post about the school on the barbershop's existing profile, or create a separate profile "Szkoła Barberingu Old Town" at the same address with an education category. Decision with Basia; needs her access (Appendix A). Link the new domain from the profile.
- **Bing Places** listing (feeds Copilot and ChatGPT search).
- **Links from owned properties:** oldtownbarber.pl, Metamorfoza's Facebook page, the barbershop's Instagram bio, Booksy profile description.
- **Citation clean-up:** directories still showing Piłsudskiego 10 (Fresha, freedom-barber, cylex, godziny-otwarcia) should be updated to Oświęcimska 1. Mixed addresses lower entity confidence for both Google and LLMs.
- **One local press mention** of the school's launch (Gwarek covered the shop in 2020). A single credible third-party article is the strongest GEO signal a small local brand can get.
- School social handle, or consistent use of the barbershop's handle plus a school hashtag, decided in the creative-direction document.

### 8.7 Measurement

- Google Search Console and Bing Webmaster Tools from launch day; monthly report of impressions, clicks and positions for tier 1–3 phrases.
- Analytics referrer segment for chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini.google.com and claude.ai; UTM tags on all owned links.
- Monthly manual AI visibility check: ask ChatGPT, Perplexity, Gemini and Claude (web-enabled) the same five Polish questions (for example "Gdzie zrobić szkolenie barberskie w Tarnowskich Górach?", "Kurs barberski od podstaw na Śląsku, gdzie?"), log whether the school is named and which facts are quoted, and correct wrong facts at their source.

## 9. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Lighthouse mobile ≥ 90; LCP < 2.5 s on 4G; first-view page weight ≤ 1.5 MB including the hero image; images served in modern formats and responsive sizes; fonts self-hosted, at most two families |
| Availability | Static hosting with global CDN; no server to patch; HTTPS with auto-renewing certificates (the old site's expired certificate is the cautionary tale) |
| Cost | Target 0 zł/month for hosting and form backend at expected volumes; domain fee only |
| Maintainability | Bartek can change copy, prices, dates and images and publish in ≤ 15 minutes; build reproducible from the repo; no database |
| Future-proofing | Content and design tokens separated from markup so a future CMS, course subpages or online enrolment can be added without a rewrite |
| Language | Polish only; code, identifiers and docs in English |
| Privacy | No personal data stored on the page host beyond the form backend's delivery log; no cookies in v1 |

## 10. Out of scope for v1 and roadmap

**Explicitly out of v1**

- Online enrolment with date selection and payment (decided: future version).
- CMS or admin panel for Basia; she requests changes, Bartek edits files.
- Separate subpages per course, blog, or articles.
- English version.
- Graduate testimonials and gallery of student work (no graduates yet).
- Any statement about employment at Old Town or job placement after the course (Basia's decision).
- Any statement about public funding (KFS, BUR, Urząd Pracy) until the formalities are done.
- Video as a core feature. Basia has plenty of footage, so **one** short muted loop in the hero or a single embedded clip in "Jak wygląda szkolenie" is allowed in v1 if it fits the performance budget (§9); the creative-direction document decides. A gallery of videos is not v1.
- Newsletter, chat widget, Messenger plugin.
- Meta Pixel / Google Ads tags and the consent banner they require.
- Any change to oldtownbarber.pl or the Metamorfoza presence, other than adding a link to the new page.
- Paid search or paid social campaigns. The off-page SEO actions in §8.6 are in scope as a checklist, but they are manual work with Basia, not page code.

**Roadmap after launch**

| Version | Trigger | Content |
|---|---|---|
| v1.1 | first cohort finishes; photos exist; or Search Console shows tier 3 phrases stalling | graduate testimonials, before/after gallery, "absolwenci" section; course subpages with their own URLs if search data warrants; optional Pixel + consent banner if paid ads start |
| v1.2 | Basia confirms funding options | "Dofinansowanie" section (KFS, BUR, Urząd Pracy) with a how-to |
| v2 | inquiries exceed what e-mail handles, or cohorts fill and seat counts matter | course subpages, live seat counts per cohort, online enrolment with the 15 % deposit paid online, possibly Booksy or a booking tool |
| v2+ | if Basia wants autonomy | lightweight CMS on top of the same content files |

## 11. Content inventory and gaps

| Content | Have | Missing / to confirm |
|---|---|---|
| Manifesto and two course descriptions | yes, `texts.txt` | light editing for web (shorter paragraphs, headings) |
| Course facts | lengths, cohort months, group rules, inclusions, certificate, deposit, trainers (§6.1) | price policy and amounts, daily hours, exact start dates, minimum age, 5-day variant yes/no |
| Trainer profiles | trainers named: Basia and Kuba | bios and portrait photos for both |
| Photos | some exist (Basia); more can be shot | selection and gaps decided after the creative direction; shot list in that document |
| Video | plenty exists (Basia) | 3–5 best short clips for selection |
| Logo and brand | Basia will send the logo | colours and fonts if any exist |
| Trust facts | Booksy quoting approved; timeline confirmed | approximate number of clients served (Basia is considering) |
| Contact and legal | address (Oświęcimska 1), phone (725 404 010), no WhatsApp, domain approved | school e-mail address, hours, legal name, NIP, which company invoices the courses (Basia will explain in person) |
| FAQ answers | most (§6.1) | price, age, hours, hotel name |

## 12. Domain and naming

- Brand name in copy: **Szkoła Barberingu Old Town** (as in Basia's texts), with "by Barber Shop Old Town, Tarnowskie Góry" as the descriptor where it helps.
- Domain decision: **szkoleniebarber.pl** (checked free in NASK whois on 2026-09-14). Recommended to register in the same order: `szkolenie-barber.pl`, `szkoleniabarber.pl` and `szkoleniebarber.com` as typo and brand protection, redirecting to the main domain. Register in Basia's name (she is the owner of record), with Bartek as technical contact.
- Alternatives checked and free, kept for reference: `szkolabarberingu.pl`, `szkolabarberinguoldtown.pl`, `oldtownacademy.pl`, `akademiaoldtown.pl`. Taken: `szkoleniabarberskie.pl`, `kursbarberski.pl`.
- Instagram handle for the school is a creative-direction decision; check availability when the name is final.

## 13. Risks and assumptions

| Risk / assumption | Impact | Mitigation |
|---|---|---|
| Remaining facts (price policy, hours, exact dates, legal data) arrive late | Launch slips, or the page launches with "zapytaj o cenę" | Course card designed to work with or without a price; decisions 1–4 in Appendix A closed before the creative direction is final |
| Price presented as "11 000 zł, promocja 10 000 zł" for a never-sold service | Exposure under Polish price-reduction rules (Omnibus: lowest price of the last 30 days must be shown) | Show a single launch price with an end date, no struck-through reference price; see Appendix A, decision 1 |
| Minimum age set at 16 | Contracts with minors, guardian consent, liability for work on real clients | Recommend 18+, with 16–17 admitted only with written guardian consent; decision 3 in Appendix A |
| Cohort does not reach two participants | Candidate told the date moved; trust hit | State the rule plainly on the page ("startujemy od 2 osób, przy jednej osobie ustalamy termin indywidualnie"); keep the next cohort visible |
| No usable photos | Generic look, weaker trust | Plan a 2-hour photo session in the shop; stock is a last resort and must be flagged as such |
| Local competitor already trains and markets | Candidates compare | Lean hard on pillars 1–2 and Basia's history; do not compete on price alone |
| Basia's texts are long for a landing page | Bounce on mobile | Keep full texts accessible via expandable blocks; hero and course cards carry condensed versions |
| The school is new, no graduates | Thin social proof | Use barbershop reputation and timeline; add graduates in v1.1 |
| Legal entity unclear (Old Town vs Metamorfoza) | Wrong data in footer and policy | Ask explicitly (Appendix A) |
| Old site's expired SSL harms brand trust when people google the shop | Spill-over doubt | Recommend Basia renews it with her hosting provider; not part of this project |
| Cohort model confirmed: groups of 2–3 with fixed start months, twice a year per course | Dates on the page go stale if not maintained | Dates live in the content file with a visible update date; Bartek updates them when Basia announces the next cohorts (§6.1, FR-10) |
| One page serves several search intents (od podstaw vs. dla fryzjerów) | Tier 3 phrases may rank below competitors with dedicated pages | Distinct H2 sections with stable anchors and their own answer-first openers; promote course subpages to v1.1 when Search Console data shows the need (§8.1) |
| Off-page signals depend on Basia (Google Business Profile access, press, directories) | Page alone will not reach the AI-visibility target | Put §8.6 on the launch checklist with owners and dates; ask for GBP access early (Appendix A) |
| Hosting or CDN defaults block AI crawlers | Invisible to assistants despite good content | Verify `robots.txt` and bot-protection settings on launch; re-check quarterly |

## 14. Next steps

1. Bartek and Basia close the four decisions in Appendix A (price policy, 10-day course price, minimum age, second course's name and format) and Bartek collects the remaining answers and materials listed there.
2. Bartek and Basia agree the domain and register it (Basia as registrant).
3. Creative direction document: visual identity, layout, imagery plan, copy rules, photo shot list.
4. Technical solution document: stack, hosting, form backend, analytics, deployment, content file formats.
5. Build, review with Basia, then run the launch checklist: structured data validated, `robots.txt` and `llms.txt` verified, Search Console and Bing Webmaster Tools registered, Google Business Profile updated, links from owned properties in place (§8.2, §8.5, §8.6).
6. Launch, then a 30-day metrics check against §2.2 and the first monthly AI visibility check (§8.7).

---

## Appendix A: Otwarte pytania i decyzje (PL)

Lista po polsku, bo trafia do Basi bez tłumaczenia. Pierwsza runda pytań została odpowiedziana 15.09.2026 (odpowiedzi w `docs/sources/basia-answers-2026-09-15.md`). Poniżej zostało tylko to, co nadal jest otwarte.

**Decyzje do podjęcia (Bartek + Basia)**

1. **Cena na stronie.** Odpowiedź była dwuznaczna: „ceny nie będziemy pokazywać” i zaraz potem „stała cena 11 000 zł, promocja 10 000 zł”. Rekomendacja: pokazać cenę. Konkurencja publikuje 11–12 tys. zł, ukryta cena obniża jakość zgłoszeń i utrudnia wyszukiwarkom oraz asystentom AI polecanie szkoły. Uwaga prawna: przekreślone „11 000 → 10 000” dla usługi, która nigdy nie była sprzedawana po 11 000, jest ryzykowne w świetle przepisów o informowaniu o obniżkach (dyrektywa Omnibus, obowiązek podania najniższej ceny z 30 dni). Bezpieczny wariant: „Cena startowa pierwszych edycji: 10 000 zł, zaliczka 15 % (1 500 zł)”, bez ceny przekreślonej, z datą końca oferty startowej.
2. **Cena szkolenia 10-dniowego.** Nieustalona. Dla orientacji: konkurencja liczy ok. 950 zł za dzień doszkalania.
3. **Minimalny wiek.** „Nieważny albo od 16 lat”. Rekomendacja: od 18 lat, osoby 16–17 za pisemną zgodą opiekuna i po rozmowie. Praca brzytwą na prawdziwych klientach i odpowiedzialność za szkody przemawiają za progiem.
4. **Nazwa i format drugiego szkolenia.** Teksty mówią „tygodniowe i dwutygodniowe”, odpowiedź mówi „10 dni”. Czy istnieje wariant 5-dniowy? Jeśli nie, szkolenie dostanie nową roboczą nazwę w dokumencie kreatywnym (np. „Szkolenie 10-dniowe dla fryzjerów i barberów”).

**Do dopytania Basi**

5. Godziny zajęć i układ tygodnia: pon.–pt.? 21 dni to ok. 4 tygodnie robocze; kandydaci pracujący muszą to wiedzieć.
6. Dokładne daty startu edycji: listopad 2026 i styczeń 2027 (od podstaw), luty i marzec 2027 (10-dniowe). Czy „luty, marzec” to dwie edycje, czy jedna?
7. Czy zasada „minimum 2 osoby, przy jednej termin indywidualny” dotyczy też szkolenia 10-dniowego?
8. Jak nazywa się certyfikat po szkoleniu 10-dniowym?
9. Ilu mniej więcej klientów obsłużyliście przez te lata? (Basia się zastanawia; jeśli nie chce podawać liczby, zostaje „tysiące klientów”.)
10. Który hotel lub noclegi polecacie? Jedno–dwa miejsca z nazwą wystarczą do FAQ.
11. Notka o Basi (5–6 zdań) i o Kubie (2–3 zdania): jak zaczęli, co jest dla nich w tym zawodzie najważniejsze. Zdjęcia portretowe obojga.
12. Dane firmy: pełna nazwa, NIP, adres do stopki i polityki prywatności, która firma wystawia faktury za szkolenia. Basia chce to wyjaśnić na spotkaniu.
13. Nowy e-mail szkoły: proponujemy adres w nowej domenie (np. szkolenia@szkoleniebarber.pl) z przekierowaniem na skrzynkę Basi i kopią do Bartka. Zgoda?
14. Profil Firmy w Google salonu: czy Basia ma dostęp? Potrzebny, żeby dodać szkolenia jako usługę, wstawić link i publikować posty.
15. Czy szkoła ma mieć osobny profil na Instagramie i Facebooku, czy komunikujemy ją z kont salonu?
16. Kontakt do lokalnych mediów (Gwarek pisał o salonie w 2020). Jedna notka o starcie szkoły bardzo pomaga w Google i w odpowiedziach AI.

**Materiały do przesłania**

17. Logo Old Town w wektorze (AI, SVG, PDF) lub w najwyższej dostępnej jakości; ustalone kolory lub czcionki, jeśli są.
18. Zdjęcia, które już są: wnętrze, Basia i Kuba przy fotelu, zespół, praca z klientem. Braki uzupełnimy krótką sesją w salonie po wyborze kierunku kreatywnego (lista ujęć w dokumencie kreatywnym).
19. Wideo: 3–5 najlepszych krótkich ujęć z pracy w salonie (pion i poziom), do wyboru materiału na stronę.

**Osobna sprawa, poza projektem**

20. Certyfikat SSL na oldtownbarber.pl wygasł w grudniu 2022 i przeglądarki pokazują ostrzeżenie. Warto zgłosić to do firmy hostingowej (cPanel), zwykle to darmowe odnowienie Let's Encrypt.

## Appendix B: Sources

- Booksy listing of Barber Shop Old Town: https://booksy.com/pl-pl/101117_barber-shop-old-town_barber-shop_12569_tarnowskie-gory
- Fresha listing: https://www.fresha.com/lvp/barber-shop-old-town-pilsudskiego-tarnowskie-gory-wXXPAX
- Gwarek, "Miejsce wyłącznie dla panów" (2020): https://gwarek.com.pl/pl/11_wiadomosci/16952_miejsce-wylacznie-dla-panow.html
- Dziennik Zachodni poll candidate page: https://dziennikzachodni.pl/barbara-fraczek/pk/6414833
- Instagram: https://www.instagram.com/barbershopoldtowntg/
- Existing site: https://oldtownbarber.pl/ (certificate expired 2022-12-13)
- Freedom-barber aggregator: https://freedom-barber.pl/barber-shop-old-town-tarnowskie-gory-166-4-9/
- Tarnogórscy Lordowie Barber Shop & Academy: https://tarnogorscylordowie.pl/ and https://www.facebook.com/TarnogorscyLordowie/
- Cut'U School: https://cutu-school.pl/oferta/kursy-od-podstaw/
- Gentlemen Barber Academy: https://gentlemenbarberacademy.pl/kurs-barberski-katowice/
- Akademia Cyrulika: https://akademiacyrulika.pl/szkolenia/2/barber
- Old Craft Barbershop training: https://oldcraftbarbershop.pl/szkolenia/
- Domain availability: NASK whois (`whois.dns.pl`), checked 2026-09-14
