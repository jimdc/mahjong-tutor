---
summary: >-
  mahjong-tutor is a fully static browser-based Mahjong learning app for
  beginners: tile recognition, meld strategy, discard safety, and table-flow
  concepts are each a visual drill with immediate step-by-step feedback.
  No build step; progress stored in localStorage; deployed via GitHub Pages
  from the docs/ folder.
updated: 2026-07-05
sources:
  - README.md
  - docs/index.html
  - docs/tutor.js
  - docs/coach.js
  - docs/practice-home.js
sources_hash: d90dc4f9559298bd458bc3d7a102943bac63852b1c1836efd6ecab40c8a5be91
---

# mahjong-tutor — architecture

## What & why

mahjong-tutor is a self-paced interactive Mahjong learning app for beginners
who have never played. It fills the gap between static wiki explanations and
actual table play: every concept — tile names, meld types, seat winds, discard
safety — is a drill with immediate feedback and a "why it's called that"
reveal rather than a paragraph to read. It exists because recognition and
decision-making require repetition, and no existing tutorial offered that in a
zero-setup, browser-native form.

## System map

All content is static HTML + vanilla JS in `docs/`. No server, no build tool,
no bundler.

```
docs/index.html     ← entry point; Tile Quiz
  ├─ tutor.js         TILES array (all 36 tiles, SVG paths, group, detail notes)
  │                   quiz engine: shuffle, filter, localStorage stats
  ├─ tile_labels.js   shared tile-label lookup used by multiple drills
  └─ next-up.js       cross-page adaptive mentor card (reads all drill localStorage keys)

docs/coach.html     ← Hand Coach
  └─ coach.js         SCENARIOS array; grouped/raw hand view; hint + retry logic

docs/practice.html  ← Practice Hub
  └─ practice-home.js PRACTICE_DRILLS registry; PATH_STEPS checklist; aggregate stats

docs/practice-*.html + docs/practice-*.js  (12 drills)
  ├─ practice-winds, practice-honors, practice-suits, practice-dragons
  ├─ practice-seats, practice-prevailing
  ├─ practice-melds, practice-sequence (complete-the-chow), practice-pair
  ├─ practice-winning, practice-calls (claim priority), practice-safety

docs/rules.html     ← turn flow, wall/dead-wall visuals  (rules.js)
docs/win.html       ← winning hand structures  (win.js)
docs/story.html     ← mentor-guided narrative sequence  (story.js)
docs/glossary.html  ← chess/checkers analogies, Mandarin terms
docs/history.html   ← cultural + regional context
docs/tiles/         ← SVG tile artwork (~42 files)
docs/styles.css     ← single shared stylesheet
```

## Data stores & schemas

- **localStorage** — each drill persists its own key (`tile-quiz-stats`,
  `practice-winds`, `practice-calls`, etc.) with shape
  `{ correct, attempts, streak, missed? }`. Written by the individual drill JS;
  read by `practice-home.js` and `next-up.js` for aggregate stats and
  recommendations.
- No server-side state; no files written at runtime. The two reference books
  (`designing_interactions.pdf`, `the_truthful_art.epub`) in the project root
  informed design philosophy but are not parsed or served.

## Serving & deploy

- **Local:** open `docs/index.html` directly in a browser — no server required.
- **Production:** GitHub Pages, source set to `main /docs` in the repo
  settings. No CI workflow file; push to main and GitHub Pages picks up the
  `docs/` folder automatically.
  Live at `https://jimdc.github.io/mahjong-tutor/`.

## Surface

Browser pages (all in `docs/`):

- `index.html` — Tile Quiz: SVG tiles, 4-choice quiz, focus filter (All/Suits/Honors), missed-tile tracker
- `coach.html` — Hand Coach: choose discards from preset scenario hands
- `practice.html` — Practice Hub: aggregate stats, beginner path checklist, recommended next drill
- `story.html` — Story Mode: mentor-guided narrative lesson sequence
- `glossary.html` — Glossary with chess/checkers analogies
- `rules.html` — Turn flow with table view, wall/dead-wall visuals
- `win.html` — Winning hand types with visual sequences
- `history.html` — Cultural and regional context
- 12 drill pages (`practice-winds.html` … `practice-safety.html`)

No CLI, no API, no MCP tools.

## Seams

- **Consumes:** nothing external at runtime; fully self-contained static site.
- **Feeds / consumed by:** nothing in the estate directly; standalone project.
- The reference books in the root (`designing_interactions.pdf`,
  `the_truthful_art.epub`) are cangshu-indexed sources for the broader
  estate — this project does not read them programmatically.
