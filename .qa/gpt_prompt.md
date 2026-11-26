# Independent Reproducibility, Architecture & Coverage Audit — OpenAI GPT / Codex

You are an independent Principal Game Architecture & Video Reproducibility Auditor reviewing **`kunruiw1991/prototype-doll-asmr-repair`** directly against the **original source YouTube video `https://youtu.be/6Nw7Hi4Xr9s`** (*ASMR Repairing the Abandoned Prototype Doll | Poppy Playtime 4 | Doll Restoration* — 14:41).

## Mandatory Step 1: Inspect the Original Video Reference Pack & Side-by-Side Comparison!
Do NOT audit code in isolation — compare our rendered frames directly against the bundled original video reference frames:
1. Inspect **`.qa/comparison_grid.png`** (10 side-by-side pairs: Original Video LEFT vs. Our Game Build RIGHT).
2. Inspect **`.qa/reference/thumb_maxres.jpg`** and **`.qa/reference/sb0_00.jpg`–`sb0_06.jpg`** (complete 175-frame chronological storyboard of `youtu.be/6Nw7Hi4Xr9s`, `00:00–14:41`).
3. Run the automated test & visual suite:
   - `node --test --experimental-test-coverage tests/unit.test.js`
   - `python3 tests/e2e_verify.py`

## Audit Scope (Be Brutally Honest)
1. **Chronological & Mechanical Reproducibility Audit (`js/data.js`, `js/state.js`, `js/art_*.js`)**:
   - Walk through `sb0_00.jpg` → `sb0_06.jpg` frame-by-frame and verify whether our 24 steps capture every major room, tool, transformation, and gag from `00:00` to `14:41`.
   - Identify any discrepancy where a sprite state (`proto_damaged`, `proto_clean_upper`, `proto_chassis`, `proto_restored`, `catnap_damaged`, `catnap_restored`) jumps abruptly instead of showing the exact sub-step change seen in the original video.
2. **State Machine, Asset Loading & Timer Safety Audit (`js/assets.js`, `js/state.js`, `js/main.js`)**:
   - Audit async asset loading race conditions, `ctx.filter` Safari/iPad compatibility/performance, `ctx.save()`/`ctx.restore()` balance, timer leaks (`autoAdvanceTimer`, `toastTimer`), and `localStorage` error handling.
3. **Test Coverage & Responsive Gate Audit (`tests/unit.test.js`, `tests/e2e_verify.py`)**:
   - Flag untested branches, weak assertions, and mobile/iPad Safari edge cases.

## Required Output Format
- **Reproducibility Score (`X / 100`) & Architecture Matrix (`Pass / Warn / Fail`)**
- **Chronological Video Diff Table** (exact timestamp in `sb0_00..06.jpg` vs. our implementation)
- **Severity-Ranked Bugs & Reproducibility Gaps (`P0 / P1 / P2`)** with exact `file:line` and concrete engineering fixes
