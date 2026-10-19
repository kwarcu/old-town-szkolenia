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

## 2. Switch Pages on (once)

Repository → Settings → Pages → Build and deployment → Source: **GitHub Actions**. The workflow `.github/workflows/deploy.yml` runs on every push to `main` and publishes `dist/`.

Or from the terminal:

```bash
gh api -X POST repos/{owner}/old-town-szkolenia/pages -f build_type=workflow
```

## 3. The link for Basia

`https://<owner>.github.io/old-town-szkolenia/` — works on phone and desktop, no login. A private repository can still publish a public Pages site on GitHub Pro/Team; on a free account the repository must be public for Pages to work.

## Later: the real domain

When `szkoleniebarber.pl` is registered: add `CNAME` to `public/`, set `SITE_URL=https://szkoleniebarber.pl` and `BASE_PATH=/` in the workflow, point the DNS at GitHub Pages (or move to Cloudflare Pages, same build).
