# The content document (for the owner)

`teksty-strony.docx` lists every editable text of the page next to a phone screenshot of its section. Basia edits the right column in Google Docs; the left column carries a key (`site.hero.headline`, `faq[3].a`, …) that brings her text back into `src/content/*.json`.

## Round trip

```bash
npm run build
node scripts/content-doc-crops.mjs      # section screenshots + gallery thumbnails into crops/
node scripts/content-doc.mjs            # → docs/content-doc/teksty-strony.docx
```

Upload the `.docx` to Google Drive, open it as a Google Doc, share it with edit rights. When Basia is done: File → Download → Microsoft Word, then

```bash
node scripts/content-doc-import.mjs ~/Downloads/teksty-strony.docx           # shows the diff
node scripts/content-doc-import.mjs ~/Downloads/teksty-strony.docx --write   # applies it
```

Then bump `updated` / `updatedLabel` in `src/content/site.json`, build, commit, push.

## Rules baked into the document

- Only the right column is read back; labels, keys and screenshots are ignored.
- A cleared field becomes `null` (the page skips optional fields such as the hero quote).
- Empty "new" rows (extra FAQ questions, review quotes) are created only when filled in.
- Numbers (`courses.items[0].days`) must stay numbers.
- Formatting is not transferred; a line break inside a cell becomes a paragraph break in the JSON string.

`crops/` is generated and gitignored; the `.docx` and `.pdf` are kept out of git too (regenerate them).
