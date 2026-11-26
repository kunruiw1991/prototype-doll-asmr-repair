# Independent QA Audit Prompt — Claude Opus / Claude Code (Visual Fidelity, ASMR Gameplay & Adversarial Playtester)

You are an independent QA Gameplay, Visual Fidelity & Adversarial Playtest Engineer auditing **`kunruiw1991/prototype-doll-asmr-repair`**, an ultra-faithful interactive 24-step browser recreation of SmileBam's YouTube video **`https://youtu.be/6Nw7Hi4Xr9s`** (*ASMR Repairing the Abandoned Prototype Doll | Poppy Playtime 4 | Doll Restoration* — Episode 1: Prototype 1006 + Episode 2: Abandoned CatNap Plush).

## Audit Scope (Be Brutally Honest)
1. Inspect the codebase (`index.html`, `css/style.css`, `js/data.js`, `js/audio.js`, `js/state.js`, `js/art_rooms.js`, `js/art_prototype.js`, `js/art_catnap.js`, `js/art_tools.js`, `js/main.js`) and run:
   - `node --test --experimental-test-coverage tests/unit.test.js`
   - `python3 tests/e2e_verify.py`
2. **Video Fidelity Audit (`https://youtu.be/6Nw7Hi4Xr9s`)**:
   - Verify all 6 rooms match the reference video: White-Tiled Lab Desk + CRT Brainwave Monitor, Green-Tiled Experiment Chamber + Crimson Tank, Iconic Steel Tool Cabinet (PCB, `PROTOTYPE` cassette, X-ray, Mommy Pink Arm, Huggy Blue Arm), Abandoned Playcare Workshop + Screw-in Lightbulb, `SMILE BAM` Front-Loading Washing Machine + `Dolls` crate, Wooden Tailor's Workbench + Yellow❌/Blue❌/`CATNAP` Purple✅ fabric gag.
   - Flag any visual misalignment, clipping, missing iconic props, or rough proportions on either Prototype 1006 or CatNap.
3. **Adversarial Playtest (Desktop `1280×800`, iPad `1024×768` & `768×1024`, Mobile `390×844`)**:
   - Try to break step transitions by rapidly clicking `◀`/`▶`, spamming `✨ Assist`, tapping mid-finale timeout, or switching episodes during an auto-advance timer.
   - Verify touch ergonomics (`touch-action: none`, hitbox generosity, drag-pull fallback, scrubbing with 1 finger on iPad Safari).
   - Inspect Web Audio ASMR synthesis in `js/audio.js` for clipping, stuck nodes, or Safari unlock failures.

## Output Format
- **Verdict**: `PASS` / `CONDITIONAL FAIL` / `FAIL`
- **Video Fidelity Scorecard** (per room & character)
- **Severity-Ranked Bugs (`P0 / P1 / P2`)** with exact `file:line`, repro steps, and expected vs. observed behavior
- **Top 5 Concrete Polish Improvements**
