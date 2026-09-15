# Prompt: three creative directions for the landing page

Paste everything below the line into a fresh Claude Code session opened in this project. Before you paste, read the "How to tune it" notes at the bottom of this file.

---

I want three distinct creative directions for the landing page of Szkoła Barberingu Old Town, a barbering school run inside a working barbershop in Tarnowskie Góry, Poland. This is an approved design exploration (the Discover phase), not implementation: the PRD is final enough, so do not ask clarifying questions unless something truly blocks you. Build each direction as a working mobile-first HTML mockup, have an independent design critic score it, and give me a comparison I can judge in five minutes.

## Context you must read first

1. `docs/prd.md`, especially §4 (personas), §5 (positioning, message pillars, tone of voice), §6 and §6.1 (page sections and confirmed course facts), §8.4 (the "W skrócie" facts block, answer-first writing), §9 (performance budget).
2. `texts.txt`: the owner's own copy in Polish. Use her sentences as headlines where they fit; do not rewrite her voice.
3. `docs/sources/basia-answers-2026-09-15.md`: confirmed facts (21 training days, 10 training days, groups of 2–3, next cohorts, tools included, certificate, trainers Basia and Kuba).

Facts to respect in the mockups:

- All visible copy is Polish, with full diacritics. Brand name: "Szkoła Barberingu Old Town". No logo exists yet, so set a wordmark in each direction's typography.
- Two courses: "Szkolenie od podstaw" (21 dni, edycje: listopad 2026, styczeń 2027) and "Szkolenie 10-dniowe dla osób z doświadczeniem" (luty i marzec 2027). Groups 2–3 people, everything provided. Price shown as "Cena startowa: 10 000 zł, zaliczka 15 %" for the 21-day course and "Zapytaj o cenę" for the 10-day course. These are mockup values; mark them in the content as easily editable.
- Sections, in order: header, hero, "W skrócie", "Dla kogo" (4 personas), "Szkolenia" (2 course cards), "Jak wygląda szkolenie" (a day in the shop as steps), "Nasza historia" (2003 / 2008 / 2018 / 2026), "Kto uczy" (Basia, Kuba), "Dowody" (Booksy 5.0 from 1 400+ opinii, 3 quoted reviews, placeholder text is fine), FAQ (6 questions), "Kontakt" with the inquiry form, footer. Nothing about employment after the course, nothing about public funding.
- Audience reality: 18–35 years old, in Silesia, arriving from Instagram or Facebook in an in-app browser, on a phone, often at night. They compare with academies in Katowice that charge 11–12 thousand zł and publish day-by-day programs. What only Old Town can say: you train inside a real barbershop with real clients, taught by people who have run salons since 2003, and you learn to think, not to copy schemes.
- Photos and the logo arrive later. For imagery, generate images with the OpenAI Images API using `OPENAI_API_KEY` from the gitignored `.env.agents` file (read it at runtime with a small script; never paste the key into code, HTML, screenshots or docs; use the current image model, `gpt-image-1` or newer). Generate 4–6 images per direction in that direction's visual style: barbershop interior, hands at work with clippers and scissors, tools on a counter, Silesian textures, a training moment seen from behind. No faces that could pass for real people, no text in images, no barber-pole clichés. Save them as optimised JPEG or WebP in `design/directions/<nn>-<slug>/img/` and reference them relatively. If generation fails, draw a clearly labelled placeholder frame with the intended shot written in it ("Basia przy fotelu, światło z okna, plan średni"). Never substitute an image with a gradient blob, an abstract shape or an icon.

## Mobile first, desktop not forgotten

- Design at 390 × 844 first. The first mobile viewport (about 390 × 660 after browser chrome) must contain the wordmark, the promise, the primary CTA and one trust signal, without scrolling.
- A mobile sticky bottom bar with "Zapytaj o szkolenie" and "Zadzwoń" that appears after the hero scrolls away.
- Body text at least 16 px on mobile, tap targets at least 44 px, contrast at least 4.5:1, course cards and persona cards stack, FAQ readable without tapping if possible.
- Then adapt to 1440 × 900. The desktop version must not read as a stretched phone screen: use the width for composition (asymmetry, columns, whitespace, larger imagery), not for more elements. Show every section in both viewports.

## Procedure

Work through the three directions one at a time, each in its own folder `design/directions/<nn>-<slug>/`.

### Step 1: seed and anchor

For each direction, generate a random 64-character alphanumeric string with a shell command (for example `LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64`). Record the string in that direction's `README.md` for reproducibility, but never reveal it in the design. Use the string as a source of decisions the anchor does not settle: read it for sub-patterns, repeated characters, numbers, anything that suggests a colour temperature, a type pairing, a rhythm, a grid, a texture. Let it make choices you would not make by default.

Each direction also has an anchor, a specific inspiration that must be visible in the result. The anchors are deliberately far apart so the three directions cannot converge:

1. **Cięcie** (the cut). The page is composed like a haircut: hard edges, razor-straight diagonals, a strict asymmetric grid, generous negative space, black and off-white with one accent that is not barber-pole red. Typography like enamel shop signage and hand-set letterpress, tight and confident. Motion is minimal: a single decisive reveal per section. Think of the sharpness of a fresh line-up, not of "industrial" clichés.
2. **Zeszyt mentora** (the mentor's notebook). The page is Basia's working notebook: paper, ruled and grid pages, margin notes, corrections in pencil, head-shape sketches, taped-in photos, a stamp for the certificate. Warm and personal, closer to a letter than to a brochure, because the copy already reads like one. Typography mixes a typewriter or monospaced face with a humanist text face. The FAQ and course facts look like filled-in forms.
3. **Śląska robota** (Silesian craft). Tarnowskie Góry is a UNESCO mining town and the shop's interior is garage-like. The page feels like a well-kept workshop: heavy textures (steel, brick, worn leather, oil-dark wood), riveted plates and stencil labels, a palette drawn from those materials, dense but ordered. Typography is a condensed grotesque with a sturdy slab for numbers (21 dni, 2–3 osoby, od 2003). Confident, local, unglamorous in the best sense.

If an anchor and the seed conflict, the anchor wins on the big picture and the seed wins on the details.

### Step 2: build the mockup

- One self-contained `index.html` per direction (inline CSS and JavaScript, Google Fonts allowed for the mockup), all sections, real Polish copy from `texts.txt` condensed where needed, a working form layout (no backend).
- Content that will change later (courses, dates, price, FAQ, team, reviews) goes into a single JavaScript object at the top of the file, rendered into the page, so the same content can be swapped between directions.
- Before you move on, remove everything that does not add value. Do not overexplain. Fewer elements, better placed.
- Do not use any of these: purple or blue-to-pink gradients, glassmorphism, glowing blobs, emoji as icons, three-column icon feature grids, the "text left, illustration right" hero, everything rounded to the same radius, Inter or Roboto as the display face, fake testimonial avatars, stock-looking "diverse team" imagery, decorative animations that fight reading, more than one primary CTA style.

### Step 3: screenshots

Use Playwright with headless Chromium (`npx playwright` with Chromium installed if missing) to capture full-page screenshots at 390 × 844 with device scale 2 and at 1440 × 900, into `design/directions/<nn>-<slug>/screens/mobile.png` and `desktop.png`. Also capture the first mobile viewport only as `mobile-fold.png`. Look at the screenshots yourself before calling the critic; fix anything broken first.

### Step 4: the critic loop

Invoke a design critic as a subagent on the most capable model available, in a fresh context, with only the three screenshots and the critic prompt below. Give it no code, no implementation details, no earlier critiques, no target score. Apply its feedback, re-screenshot, and run the critic once more. Two rounds per direction at this stage, then stop and record both scores and the remaining gaps. Use the identical critic prompt every time.

Critic prompt:

> You are a design critic at a top-tier studio reviewing screenshots of a landing page for a barbering school in Poland. The audience is 18–35-year-old candidates in Silesia, mostly on phones, arriving from Instagram, comparing this school with bigger academies. You see three images: the first mobile viewport, the full mobile page, and the full desktop page. Judge mobile at 60 % weight and desktop at 40 %.
>
> 1. Name, in one line, the aesthetic this design is going for.
> 2. Describe how a top studio would execute that aesthetic for this audience: composition, typography, imagery, rhythm, restraint.
> 3. List the biggest gaps between that execution and what you see, most important first. For each gap: the element, what is wrong, what to do instead. Be tight and specific; no vague prose.
> 4. Call out anything that reads as overdone, excessive or obviously AI-generated, and penalise it in the score.
> 5. Say whether the first mobile viewport alone would make a candidate keep scrolling, and why.
> 6. Give a score out of 10 for how close this is to the studio-level bar. Be bold and opinionated; do not reward safe choices.

### Step 5: the comparison

Produce `design/directions/README.md` with, for each direction: name and one-sentence concept, the anchor and how the seed influenced the details, palette with hex values, type pairing, layout principles, motion, imagery plan as a shot list of 8–10 photos the owner should shoot, how the direction serves each of the four personas, both critic scores and the top three remaining gaps, and the risks (readability, production cost, how it ages). End with a comparison table and your own recommendation with reasons, in no more than 150 words.

Also produce `design/directions/contact-sheet.html`: the three `mobile-fold.png` images side by side at the top, the three full mobile screenshots below them, the three desktop screenshots below those, each column labelled with the direction's name and final critic score. I will open this file first.

When everything is done, tell me the critic scores, the recommendation, and the exact paths to open.

---

## How to tune it (notes for Bartek, not part of the prompt)

- **The anchors carry your taste.** The article's point is that model-generated ideas are average and human-steered ones are not. The three anchors above are my proposals from the brand context. If one does not excite you, replace it with something from your own head, even if it sounds like it cannot work: a specific film, a Silesian tram interior, a boxing gym poster, a 1970s Polish record sleeve. Keep the three far apart.
- **Seeds are logged, so you can rerun.** If a direction is promising but the details feel off, rerun that one direction with a new seed and the same anchor.
- **Two critic rounds are deliberate.** This is exploration, not polish. Once you pick a direction, the next prompt (the Define phase) runs the critic loop until it scores 9/10 or more, adds real photos and video, and removes AI tells.
- **Image generation is wired in.** The OpenAI key lives in the gitignored `.env.agents` and `CLAUDE.md` tells agents it is development-only. Set a spending limit on that key in the OpenAI dashboard before the first run; three directions with 4–6 images each and two critic rounds is roughly 15–20 generations. Since the key was pasted into a chat once, rotate it when the design phase is over.
- **Model choice.** Run the session on the strongest model you have and let the critic use it too; the implementer can be a faster model if cost matters, but not a small one.
