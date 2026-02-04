# Mahjong Tutor (GitHub Pages)

This folder contains the static site for the Mahjong Tutor and is deployed via GitHub Pages.

## Features
- Tile Quiz with SVG tiles, Unicode fallback, hover labels, and a focus filter (All/Suits/Honors).
- Hand Coach with grouped vs raw hand views, hints, and retry-on-wrong discards.
- Practice hub with local progress snapshot and a beginner learning path checklist.
- Drill library:
  - Winds, honors, suits, and dragon names.
  - Seat winds + prevailing wind.
  - Meld types, chow completion, pair completion, winning hand recognition.
  - Call priority (chow/pung/kong/win/pass) and discard safety.
- Rules page with interactive turn flow, table view, and wall/dead wall visuals.
- Winning page with visual sequences and rule-set differences.
- Glossary with chess/checkers analogies, Mandarin terms, and color cues.
- History page with cultural context.

## Local Preview
Open `docs/index.html` in a browser.

## Deploy to GitHub Pages
1. Commit the `docs/` folder.
2. In GitHub repo settings, set Pages source to **main /docs**.

## TODO (Next Logical Steps)
- Add scoring primers for popular rule sets (Riichi, Chinese Official, American).
- Add a discard-safety drill that uses live opponent discard pools.
- Add spaced-repetition scheduling for drills.
- Add sound effects and shuffle animation for immersion.
- Add a simple multiplayer “table view” simulator for turn order and claims.
