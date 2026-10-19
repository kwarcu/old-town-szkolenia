# Publishing the alpha on GitHub Pages (run by Bartek)

The repository has no remote yet. These are the commands to run yourself; nothing here is executed by an agent.

## 1. Create the GitHub repository and push

```bash
gh repo create old-town-szkolenia --private --source=/Users/bartek/Dev/old-town-szkolenia --remote=origin
```

Then, from the worktree, push the feature branch and (when you are happy with it) merge it into `main`:

```bash
git -C /Users/bartek/Dev/old-town-szkolenia/.claude/worktrees/alpha-website-photos-46fca4 push -u origin claude/alpha-website-photos-46fca4
```

```bash
git -C /Users/bartek/Dev/old-town-szkolenia merge --ff-only claude/alpha-website-photos-46fca4 && git -C /Users/bartek/Dev/old-town-szkolenia push -u origin main
```

## 2. Password for the alpha (once)

The workflow reads the repository secret `ALPHA_PASSWORD`. When it is set, every HTML page is encrypted with StatiCrypt (client-side AES): visitors see a password prompt, crawlers get `noindex` and a `Disallow: /` robots file, and `llms.txt` and the sitemap are stubbed. Remove the secret to publish the open site.

```bash
gh secret set ALPHA_PASSWORD --repo {owner}/old-town-szkolenia
```

(it prompts for the value; pick something Basia can type on a phone). "Zapamiętaj mnie" keeps the page open on her device for 30 days.

## 3. Switch Pages on (once)

Repository → Settings → Pages → Build and deployment → Source: **GitHub Actions**. The workflow `.github/workflows/deploy.yml` runs on every push to `main` and publishes `dist/`.

Or from the terminal:

```bash
gh api -X POST repos/{owner}/old-town-szkolenia/pages -f build_type=workflow
```

## 4. The link for Basia

`https://kwarcu.org/old-town-szkolenia/` plus the password (the owner's user site has the custom domain kwarcu.org, so project sites hang under it) — works on phone and desktop. On a free GitHub account Pages needs a public repository: the page itself is then encrypted, but the source (texts, photos) is readable on github.com. With GitHub Pro the repository can stay private. Cloudflare Pages (free, private repo, optional Cloudflare Access with e-mail codes) is the alternative if that matters.

## Later: the real domain

When `szkoleniebarber.pl` is registered: add `CNAME` to `public/`, set `SITE_URL=https://szkoleniebarber.pl` and `BASE_PATH=/` in the workflow, point the DNS at GitHub Pages (or move to Cloudflare Pages, same build).
