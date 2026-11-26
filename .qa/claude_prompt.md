# Independent Video-to-Game Reproducibility Audit — Claude Opus / Claude Code

You are an independent QA Gameplay, Visual Reproducibility & Adversarial Playtest Engineer auditing **`kunruiw1991/prototype-doll-asmr-repair`** directly against the **original source YouTube video `https://youtu.be/6Nw7Hi4Xr9s`** (*ASMR Repairing the Abandoned Prototype Doll | Poppy Playtime 4 | Doll Restoration* — 14:41, Episode 1: Prototype 1006 + Episode 2: CatNap Plush).

## Mandatory Step 1: Visually Inspect the Original Video Reference Frames First!
The original video's full sequential storyboard frames (`00:00–14:41`) AND a side-by-side comparison sheet are bundled right inside this repo so you can audit reproducibility with your own eyes:
1. **Side-by-Side Comparison Sheet (Original Video LEFT vs. Our Build RIGHT)**:
   - Open and inspect **`.qa/comparison_grid.png`**!
2. **Full Original Video Frames (`00:00–14:41`)**:
   - Inspect **`.qa/reference/thumb_maxres.jpg`** (1280×720 HD original thumbnail)
   - Inspect **`.qa/reference/sb0_00.jpg`** through **`.qa/reference/sb0_06.jpg`** (all 175 sequential frames from `00:00` to `14:41`!)
3. **Our Game's High-Res Captures & Assets**:
   - Inspect **`screenshots/02_proto_lab_desk.png`** through **`screenshots/15_mobile_portrait.png`** and **`assets/*`**
4. Run automated verification:
   - `node --test --experimental-test-coverage tests/unit.test.js`
   - `python3 tests/e2e_verify.py`

## Audit Criteria (Be Brutally Honest — Do Not Sugarcoat!)
1. **Reproducibility Score (0–100%) per Scene**:
   - Compare each of the 10 pairs in `.qa/comparison_grid.png` (Lab Desk, CRT Brainwave, Green Experiment Chamber, Steel Cabinet ASMR Foam, Steel Cabinet Hero, Prototype Red-Alert Finale, Playcare Broken CatNap, `SMILE BAM` Washer, Tailor Bench Fabric Gag, CatNap Spooky Finale).
   - Call out EVERY visual mismatch vs. the original video: lighting, art consistency, sprite alignment, missing interactive steps/tools, missing camera zooms, or static transitions where the video has tactile animation.
2. **Original Play Feel & Tactile ASMR Fidelity**:
   - Does each of the 24 steps feel like the actual ASMR restoration sequence in `sb0_00..06.jpg` (e.g. scooping brain with dual spoons, snapping individual ribs, foam spraying + pressure-washing pixel-by-pixel, scissor cutting along dashed patch lines, cross-stitching button eyes)?
   - Flag any step that feels too abstract, too fast, or disconnected from the artwork.
3. **Adversarial UX & iPad Touch Audit**:
   - Test Desktop `1280×800`, iPad `1024×768` / `768×1024`, Mobile `390×844` for layout bugs, timer race conditions, or Web Audio issues.

## Required Output Format
- **Overall Reproducibility Score (`X / 100`) & Verdict (`PASS / CONDITIONAL FAIL / FAIL`)**
- **10-Scene Side-by-Side Reproducibility Table** (comparing `.qa/reference/*` vs. our build)
- **Severity-Ranked Bugs & Fidelity Gaps (`P0 / P1 / P2`)** with exact `file:line` and concrete fixes
- **Top 5 Changes to Reach 95%+ Reproducibility**
