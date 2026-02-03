# Mahjong Tutor

A fast, static Mahjong learning app designed for GitHub Pages. It focuses on visual recognition, decision practice, a beginner-friendly glossary, and separate rules + winning guides.

## Current Features
- Tile Recognition quiz with real SVG tiles and Unicode fallback.
- Context notes and expandable “Why it’s called that” explanations.
- Hand Coach: interactive discard decisions with feedback and tips.
- Raw vs grouped hand toggle for intuition building.
- Glossary: zero-to-confident concepts with chess/checkers analogies and Mandarin terms.
- Rules: visual turn flow with opponent lane and discard pool.
- Winning: rule-set differences and example hands.
- Fully static site under `docs/` for GitHub Pages.
- Cache-busted CSS/JS via `?v=YYYYMMDD` query strings.

## How To Run (Local)
Open `docs/index.html` in a browser.

## GitHub Pages
In repo settings → Pages:
- Source: Deploy from a branch
- Branch: `main`
- Folder: `/docs`

The site will be available at:
`https://jimdc.github.io/mahjong-tutor/`

## TODO / Next Logical Steps
- Add more Hand Coach scenarios and difficulty tiers.
- Add a real shanten/progress indicator in Hand Coach.
- Add tile filters (suits-only, honors-only, mixed) to the quiz.
- Add a “review missed tiles” mode.
- Add rule-set toggle (Riichi / Chinese / American) for rules + examples.
- Add sound and accessibility options (high-contrast, large tiles).
- Add lightweight analytics (local-only) for streaks and accuracy.

## Notes
This README should be updated whenever features or workflow change.
