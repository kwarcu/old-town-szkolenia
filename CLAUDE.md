# Project notes for AI agents

## Language
Page copy is Polish (with full diacritics). Code, identifiers, docs, commit messages: English.

## Documents
- `docs/prd.md` — product requirements (what, why, scope). Read it before any design or build work.
- `docs/prompts/` — prompts for the design phases.
- `docs/sources/` — the owner's answers, verbatim.

## Development-only keys
`.env.agents` (gitignored) holds API keys for agents to use during development, for example
`OPENAI_API_KEY` for generating mockup imagery. Use them locally only. Never write a key into
source files, HTML, build output, screenshots or documentation, and never ship them with the product.

## Content rules
- Facts about courses (length, dates, group size, price) come from `docs/prd.md` §6.1 and live in
  content files, never hard-coded in markup.
- Nothing on the page about employment after the course or public funding (owner's decision).
