# Mahjong Tutor — agent instructions

Beginner-first interactive Mahjong learning site: visual drills, guided feedback,
adaptive practice. Static HTML/JS/CSS, no build step — the site lives in `docs/`
(GitHub-Pages layout); open `docs/index.html` or serve `docs/` with any static
server. Design doctrine comes from the two texts in the repo root: *Designing
Interactions* (iterate on the UI) and *The Truthful Art* (honest visual evidence);
follow the existing evidence-panel and stepwise-why patterns when extending drills.

`docs/architecture.md` is the engineer-register context page the estate kanban
reads — keep it current when structure changes (see the architecture-page genre).

## Provenance & governance

- **Origin: built with OpenAI Codex CLI** (Feb 2026, formerly `~/Documents/codex/mahjong-tutor`).
  Migrated to `~/dev/` 2026-07-05. Codex conventions are native here; any harness
  (Codex, Claude Code, opencode) may work on this repo.
- **This file is the single source of truth for agent instructions.** `CLAUDE.md`
  is a shim that imports it — put nothing harness-specific there; add tool-specific
  notes in a clearly-marked section here instead.
- Estate tracking: kanban board scans this repo from `~/dev/`; improvement work
  arrives as waves (`backlog/` task cards) per `~/dev/agentic-engineering-principles/`.
