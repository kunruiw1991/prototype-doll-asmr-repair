/* ============================================================================
   js/state.js — Deterministic 24-Step Restoration State Machine
   Unit-testable in Node.js and browser; computes exact visual state at any step
   ============================================================================ */
(function (root) {
  'use strict';

  const STORAGE_KEY = 'asmr_prototype_catnap_save_v1';

  class RestorationState {
    constructor(steps, storage) {
      this.steps = steps || (root.ASMRData && root.ASMRData.STEPS) || [];
      this.storage = storage !== undefined ? storage : (typeof localStorage !== 'undefined' ? localStorage : null);
      this.lang = 'zh';
      this.spookyFinale = true;
      this.audioEnabled = true;
      this.started = false;
      this.stepIndex = 0;
      this.substepIndex = 0;
      this.progress = 0; // 0..1 within current step or substep
      this.activeTool = null;
      this.completedSteps = new Set();
      this.finaleActive = null; // null | 'prototype' | 'catnap'
      this.finaleTimer = 0;

      // Special gag & transient states
      this.triedWrongSwatches = new Set();
      this.wrongSwatchFlash = null; // 'yellow' | 'blue' | null
      this.wrongSwatchTimer = 0;
      this.foamSpots = []; // array of {x, y, r, alpha} for Step 10

      this._selectDefaultTool();
    }

    getCurrentStep() {
      return this.steps[this.stepIndex] || this.steps[0];
    }

    getCurrentSubstep() {
      const step = this.getCurrentStep();
      if (step && step.substeps && step.substeps.length > 0) {
        return step.substeps[Math.min(this.substepIndex, step.substeps.length - 1)];
      }
      return null;
    }

    getActiveTarget() {
      const sub = this.getCurrentSubstep();
      if (sub) return { x: sub.x, y: sub.y, r: sub.r, key: sub.key, tool: sub.tool, scrubRequired: Boolean(sub.scrubRequired), sound: sub.sound };
      const step = this.getCurrentStep();
      return {
        x: step.target.x,
        y: step.target.y,
        r: step.target.r,
        dx: step.target.dx || 0,
        dy: step.target.dy || 0,
        tool: step.tools[0].id,
        scrubRequired: step.mode === 'scrub',
        sound: step.sound
      };
    }

    getOverallStepProgress() {
      const step = this.getCurrentStep();
      if (this.completedSteps.has(step.id)) return 1;
      if (step.substeps && step.substeps.length > 0) {
        return Math.min(1, (this.substepIndex + this.progress) / step.substeps.length);
      }
      return Math.min(1, this.progress);
    }

    _selectDefaultTool() {
      const step = this.getCurrentStep();
      if (!step || !step.tools || !step.tools.length) return;
      const sub = this.getCurrentSubstep();
      if (sub && sub.tool) {
        this.activeTool = sub.tool;
      } else {
        const rec = step.tools.find((t) => t.recommended) || step.tools[0];
        this.activeTool = rec.id;
      }
    }

    goToStep(index) {
      const clamped = Math.max(0, Math.min(this.steps.length - 1, index));
      this.stepIndex = clamped;
      this.substepIndex = 0;
      this.progress = 0;
      this.finaleActive = null;
      this.finaleTimer = 0;
      this.foamSpots = [];
      this.wrongSwatchFlash = null;
      this.wrongSwatchTimer = 0;
      this._selectDefaultTool();
      this.save();
      return this.getCurrentStep();
    }

    selectEpisode(ep) {
      const firstIdx = this.steps.findIndex((s) => s.episode === ep);
      if (firstIdx >= 0) {
        this.goToStep(firstIdx);
      }
      return this.getCurrentStep();
    }

    resetCurrentEpisode() {
      const ep = this.getCurrentStep().episode;
      for (const s of this.steps) {
        if (s.episode === ep) this.completedSteps.delete(s.id);
      }
      this.triedWrongSwatches.clear();
      this.selectEpisode(ep);
    }

    selectTool(toolId) {
      const step = this.getCurrentStep();
      const toolDef = step.tools.find((t) => t.id === toolId);
      if (!toolDef) return { ok: false, reason: 'unknown_tool' };

      // Special Step 20 SmileBam Fabric Color Gag!
      if (step.mode === 'fabric' && toolDef.wrongSwatch) {
        this.triedWrongSwatches.add(toolDef.wrongSwatch);
        this.wrongSwatchFlash = toolDef.wrongSwatch;
        this.wrongSwatchTimer = 1.4;
        return { ok: false, gag: toolDef.wrongSwatch };
      }

      this.wrongSwatchFlash = null;
      this.wrongSwatchTimer = 0;
      this.activeTool = toolId;
      // Selecting the purple swatch in Step 20 substep 0 completes substep 0 immediately!
      if (step.mode === 'fabric' && toolId === 'swatch_purple' && this.substepIndex === 0) {
        return this.advanceSubstep();
      }
      return { ok: true, tool: toolDef };
    }

    /**
     * Advance progress on current step/substep by delta (0..1)
     * Returns { completedSubstep, completedStep, triggersFinale, sound }
     */
    addProgress(delta) {
      const step = this.getCurrentStep();
      const target = this.getActiveTarget();
      this.progress = Math.min(1, Math.max(0, this.progress + delta));
      if (this.progress >= 0.999) {
        return this.advanceSubstep();
      }
      return { completedSubstep: false, completedStep: false, triggersFinale: null, sound: target.sound };
    }

    advanceSubstep() {
      const step = this.getCurrentStep();
      const sub = this.getCurrentSubstep();
      const sound = sub ? sub.sound : step.sound;

      if (step.substeps && this.substepIndex + 1 < step.substeps.length) {
        this.substepIndex += 1;
        this.progress = 0;
        this._selectDefaultTool();
        this.save();
        return {
          completedSubstep: true,
          completedStep: false,
          triggersFinale: null,
          prevSubKey: sub ? sub.key : null,
          nextSubKey: this.getCurrentSubstep().key,
          sound
        };
      }

      // Entire step finished!
      this.completedSteps.add(step.id);
      this.progress = 1;
      this.save();

      if (step.triggersFinale) {
        this.finaleActive = step.triggersFinale;
        this.finaleTimer = 0;
        return {
          completedSubstep: true,
          completedStep: true,
          triggersFinale: step.triggersFinale,
          prevSubKey: sub ? sub.key : null,
          sound
        };
      }

      return {
        completedSubstep: true,
        completedStep: true,
        triggersFinale: null,
        prevSubKey: sub ? sub.key : null,
        sound
      };
    }

    nextStep() {
      if (this.stepIndex + 1 < this.steps.length) {
        return this.goToStep(this.stepIndex + 1);
      }
      return this.getCurrentStep();
    }

    prevStep() {
      if (this.stepIndex > 0) {
        return this.goToStep(this.stepIndex - 1);
      }
      return this.getCurrentStep();
    }

    /**
     * Computes deterministic visual state flags for Prototype (Episode 1)
     * so jumping to ANY step (0..11) accurately reflects cumulative restoration!
     */
    getPrototypeVisuals() {
      const idx = this.stepIndex;
      const sub = this.substepIndex;
      const p = this.progress;
      const done = (i) => idx > i || (idx === i && this.completedSteps.has(this.steps[i].id));

      const knifeRemoved = done(0);
      const knifePullFrac = idx === 0 ? p : (knifeRemoved ? 1 : 0);

      const fridgeOpen = idx > 1 || (idx === 1 && sub >= 1);
      const oldBrainRemoved = idx > 1 || (idx === 1 && sub >= 2);
      const newBrainImplanted = done(1);

      const crtSyncFrac = idx > 2 ? 1 : (idx === 2 ? p : 0);

      const redHornAttached = idx > 3 || (idx === 3 && sub >= 1);
      const teethCleanFrac = idx > 3 ? 1 : (idx === 3 && sub === 1 ? p : 0);

      const spineDropped = idx > 4 || (idx === 4 && sub >= 1);
      const spineBoltedFrac = idx > 4 ? 1 : (idx === 4 && sub === 1 ? p : 0);

      const coreHarvested = idx > 5 || (idx === 5 && sub >= 1);
      const ribsUpper = idx > 5 || (idx === 5 && sub >= 2);
      const ribsLower = done(5);

      const lockerOpen = idx > 6 || (idx === 6 && sub >= 1);
      const gotHuggy = idx > 6 || (idx === 6 && sub >= 2);
      const gotMommy = done(6);

      const cabinetDoorsOpen = idx > 7 || (idx === 7 && sub >= 1);
      const leftSpiderLegs = idx > 7 || (idx === 7 && sub >= 2);
      const rightSpiderLegs = idx > 7 || (idx === 7 && sub >= 3);
      const torsoDocked = done(7);

      const clawForged = idx > 8 || (idx === 8 && sub >= 1);
      const leftClawAttached = idx > 8 || (idx === 8 && sub >= 2);
      const rightClawAttached = done(8);

      // Step 10 (index 9): Foam cover -> High-pressure water rinse
      let foamCoverage = 0;
      let grimeAlpha = 1;
      if (idx === 9) {
        if (sub === 0) {
          foamCoverage = p;
          grimeAlpha = 1 - p * 0.25;
        } else {
          foamCoverage = Math.max(0, 1 - p);
          grimeAlpha = Math.max(0, 0.75 * (1 - p));
        }
      } else if (idx > 9) {
        foamCoverage = 0;
        grimeAlpha = 0;
      }

      const mommyGrafted = idx > 10 || (idx === 10 && sub >= 1);
      const huggyGrafted = done(10);

      const cassetteInserted = idx > 11 || (idx === 11 && sub >= 1);
      const polishFrac = idx === 11 && sub === 1 ? p : (done(11) ? 1 : 0);

      return {
        knifeRemoved,
        knifePullFrac,
        fridgeOpen,
        oldBrainRemoved,
        newBrainImplanted,
        crtSyncFrac,
        redHornAttached,
        teethCleanFrac,
        spineDropped,
        spineBoltedFrac,
        coreHarvested,
        ribsUpper,
        ribsLower,
        lockerOpen,
        gotHuggy,
        gotMommy,
        cabinetDoorsOpen,
        leftSpiderLegs,
        rightSpiderLegs,
        torsoDocked,
        clawForged,
        leftClawAttached,
        rightClawAttached,
        foamCoverage,
        grimeAlpha,
        mommyGrafted,
        huggyGrafted,
        cassetteInserted,
        polishFrac,
        inWheelchair: idx <= 3,
        inExperimentChamber: idx >= 4 && idx <= 6,
        inSteelCabinet: idx >= 7 && idx <= 11,
        finaleActive: this.finaleActive === 'prototype',
        spookyFinale: this.spookyFinale
      };
    }

    /**
     * Computes deterministic visual state flags for CatNap (Episode 2)
     * Steps 12..23
     */
    getCatNapVisuals() {
      const idx = this.stepIndex;
      const sub = this.substepIndex;
      const p = this.progress;
      const done = (i) => idx > i || (idx === i && this.completedSteps.has(this.steps[i].id));

      const reportChecked = idx > 12 || (idx === 12 && sub >= 1);
      const bulbBrightness = idx > 12 ? 1 : (idx === 12 && sub === 1 ? 0.18 + p * 0.82 : 0.14);

      const earDebrisCleared = idx > 13 || (idx === 13 && sub >= 1);
      const danglingEyeRemoved = idx > 13 || (idx === 13 && sub >= 2);
      const cheekTagRemoved = done(13);

      const threadsSnipped = idx > 14 || (idx === 14 && sub >= 1);
      const aerosolMistFrac = idx === 14 && sub === 1 ? p : (idx > 14 ? 0 : 0);
      const armWiresCleared = done(14);

      const inWasher = idx === 15 && sub >= 1;
      const detergentPoured = idx === 15 && sub >= 2;
      const washSpinFrac = idx > 15 ? 1 : (idx === 15 && sub === 2 ? p : 0);
      const dirtAlpha = idx > 15 ? 0 : (idx === 15 && sub === 2 ? Math.max(0, 1 - p) : (idx === 14 && sub >= 1 ? 0.72 : 1));

      const wetness = idx === 16 ? Math.max(0, 1 - p) : (idx === 15 && done(15) ? 1 : 0);

      const edgesTrimmed = idx > 17 || (idx === 17 && sub >= 1);
      const foreheadSewn = idx > 17 || (idx === 17 && sub >= 2);
      const redTapeInserted = done(17);

      const cottonStuffedFrac = idx > 18 ? 1 : (idx === 18 ? p : 0);

      const purpleClothSelected = idx > 19 || (idx === 19 && sub >= 1);
      const patchesCutFrac = idx > 19 ? 1 : (idx === 19 && sub === 1 ? p : (idx === 19 && sub >= 2 ? 1 : 0));
      const patchesSewnFrac = idx > 19 ? 1 : (idx === 19 && sub === 2 ? p : 0);

      const leftEyeSewn = idx > 20 || (idx === 20 && sub >= 1);
      const rightEyeSewn = done(20);

      const plushArmAttached = idx > 21 || (idx === 21 && sub >= 1);
      const airbrushBlendFrac = idx > 21 ? 1 : (idx === 21 && sub === 1 ? p : 0);

      const furBrushedFrac = idx > 22 ? 1 : (idx === 22 && sub === 0 ? p : (idx === 22 && sub >= 1 ? 1 : 0));
      const tailAttached = done(22);

      const moonPolishedFrac = idx > 23 ? 1 : (idx === 23 && sub === 0 ? p : (idx === 23 && sub >= 1 ? 1 : 0));
      const capsuleInserted = done(23);

      return {
        reportChecked,
        bulbBrightness,
        earDebrisCleared,
        danglingEyeRemoved,
        cheekTagRemoved,
        threadsSnipped,
        aerosolMistFrac,
        armWiresCleared,
        inWasher,
        detergentPoured,
        washSpinFrac,
        dirtAlpha,
        wetness,
        edgesTrimmed,
        foreheadSewn,
        redTapeInserted,
        cottonStuffedFrac,
        purpleClothSelected,
        patchesCutFrac,
        patchesSewnFrac,
        wrongSwatchFlash: this.wrongSwatchFlash,
        leftEyeSewn,
        rightEyeSewn,
        plushArmAttached,
        airbrushBlendFrac,
        furBrushedFrac,
        tailAttached,
        moonPolishedFrac,
        capsuleInserted,
        finaleActive: this.finaleActive === 'catnap',
        spookyFinale: this.spookyFinale
      };
    }

    save() {
      if (!this.storage) return false;
      try {
        const payload = {
          stepIndex: this.stepIndex,
          substepIndex: this.substepIndex,
          completed: Array.from(this.completedSteps),
          lang: this.lang,
          spookyFinale: this.spookyFinale
        };
        this.storage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return true;
      } catch (_) {
        return false;
      }
    }

    hasSavedProgress() {
      if (!this.storage) return false;
      try {
        const raw = this.storage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return typeof parsed.stepIndex === 'number' && (parsed.stepIndex > 0 || (parsed.completed && parsed.completed.length > 0));
      } catch (_) {
        return false;
      }
    }

    load() {
      if (!this.storage) return false;
      try {
        const raw = this.storage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        if (typeof parsed.stepIndex === 'number') {
          this.stepIndex = Math.max(0, Math.min(this.steps.length - 1, parsed.stepIndex));
        }
        if (typeof parsed.substepIndex === 'number') {
          const step = this.getCurrentStep();
          const maxSub = step.substeps ? step.substeps.length - 1 : 0;
          this.substepIndex = Math.max(0, Math.min(maxSub, parsed.substepIndex));
        }
        if (Array.isArray(parsed.completed)) {
          this.completedSteps = new Set(parsed.completed);
        }
        if (parsed.lang === 'zh' || parsed.lang === 'en') {
          this.lang = parsed.lang;
        }
        if (typeof parsed.spookyFinale === 'boolean') {
          this.spookyFinale = parsed.spookyFinale;
        }
        this._selectDefaultTool();
        return true;
      } catch (_) {
        return false;
      }
    }
  }

  const EXPORT = { RestorationState, STORAGE_KEY };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRState = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
