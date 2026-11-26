'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { I18N, STEPS } = require('../js/data.js');
const { RestorationState, STORAGE_KEY } = require('../js/state.js');

function createMockStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
}

test('Data integrity: 24 steps across 2 episodes with full CN/EN parity', () => {
  assert.equal(STEPS.length, 24);
  const protoSteps = STEPS.filter((s) => s.episode === 'prototype');
  const catnapSteps = STEPS.filter((s) => s.episode === 'catnap');
  assert.equal(protoSteps.length, 12);
  assert.equal(catnapSteps.length, 12);

  const ids = new Set();
  for (let i = 0; i < STEPS.length; i++) {
    const s = STEPS[i];
    assert.equal(s.index, i);
    assert.ok(!ids.has(s.id), `Duplicate step id: ${s.id}`);
    ids.add(s.id);
    assert.ok(s.title.zh && s.title.en);
    assert.ok(s.hint.zh && s.hint.en);
    assert.ok(s.roomLabel.zh && s.roomLabel.en);
    assert.ok(Array.isArray(s.tools) && s.tools.length > 0);
    for (const tool of s.tools) {
      assert.ok(tool.id && tool.emoji && tool.zh && tool.en);
    }
  }

  // Bilingual I18N key parity
  const zhKeys = Object.keys(I18N.zh).sort();
  const enKeys = Object.keys(I18N.en).sort();
  assert.deepEqual(zhKeys, enKeys);
});

test('Full 24-step playthrough: Prototype Finale + CatNap Finale', () => {
  const storage = createMockStorage();
  const st = new RestorationState(STEPS, storage);

  // Play all 12 Prototype steps
  for (let idx = 0; idx < 12; idx++) {
    assert.equal(st.stepIndex, idx);
    const step = st.getCurrentStep();
    const numSub = step.substeps ? step.substeps.length : 1;
    let lastRes = null;
    for (let s = 0; s < numSub; s++) {
      lastRes = st.addProgress(1.0);
    }
    assert.equal(lastRes.completedStep, true);
    if (idx === 11) {
      assert.equal(lastRes.triggersFinale, 'prototype');
      assert.equal(st.finaleActive, 'prototype');
    } else {
      st.nextStep();
    }
  }

  // Verify fully restored Prototype visuals
  const pv = st.getPrototypeVisuals();
  assert.equal(pv.knifeRemoved, true);
  assert.equal(pv.newBrainImplanted, true);
  assert.equal(pv.redHornAttached, true);
  assert.equal(pv.ribsLower, true);
  assert.equal(pv.leftSpiderLegs, true);
  assert.equal(pv.rightSpiderLegs, true);
  assert.equal(pv.leftClawAttached, true);
  assert.equal(pv.rightClawAttached, true);
  assert.equal(pv.grimeAlpha, 0);
  assert.equal(pv.foamCoverage, 0);
  assert.equal(pv.mommyGrafted, true);
  assert.equal(pv.huggyGrafted, true);
  assert.equal(pv.cassetteInserted, true);
  assert.equal(pv.finaleActive, true);

  // Switch to Episode 2 (CatNap) and play all 12 steps
  st.selectEpisode('catnap');
  assert.equal(st.stepIndex, 12);
  for (let idx = 12; idx < 24; idx++) {
    assert.equal(st.stepIndex, idx);
    const step = st.getCurrentStep();
    const numSub = step.substeps ? step.substeps.length : 1;
    let lastRes = null;
    for (let s = 0; s < numSub; s++) {
      lastRes = st.addProgress(1.0);
    }
    assert.equal(lastRes.completedStep, true);
    if (idx === 23) {
      assert.equal(lastRes.triggersFinale, 'catnap');
      assert.equal(st.finaleActive, 'catnap');
    } else {
      st.nextStep();
    }
  }

  // Verify fully restored CatNap visuals
  const cv = st.getCatNapVisuals();
  assert.equal(cv.bulbBrightness, 1);
  assert.equal(cv.danglingEyeRemoved, true);
  assert.equal(cv.cheekTagRemoved, true);
  assert.equal(cv.dirtAlpha, 0);
  assert.equal(cv.wetness, 0);
  assert.equal(cv.redTapeInserted, true);
  assert.equal(cv.cottonStuffedFrac, 1);
  assert.equal(cv.leftEyeSewn, true);
  assert.equal(cv.rightEyeSewn, true);
  assert.equal(cv.plushArmAttached, true);
  assert.equal(cv.tailAttached, true);
  assert.equal(cv.capsuleInserted, true);
  assert.equal(cv.finaleActive, true);
  assert.equal(st.completedSteps.size, 24);
});

test('Step 20 SmileBam Fabric Color Gag: Yellow/Blue rejected, CATNAP Purple advances', () => {
  const st = new RestorationState(STEPS, createMockStorage());
  st.goToStep(19); // c08_fabric_cut
  assert.equal(st.getCurrentStep().id, 'c08_fabric_cut');

  const yRes = st.selectTool('swatch_yellow');
  assert.equal(yRes.ok, false);
  assert.equal(yRes.gag, 'yellow');
  assert.equal(st.wrongSwatchFlash, 'yellow');
  assert.equal(st.substepIndex, 0);

  const bRes = st.selectTool('swatch_blue');
  assert.equal(bRes.ok, false);
  assert.equal(bRes.gag, 'blue');
  assert.equal(st.triedWrongSwatches.size, 2);

  const pRes = st.selectTool('swatch_purple');
  assert.equal(pRes.completedSubstep, true);
  assert.equal(st.substepIndex, 1);
  assert.equal(st.activeTool, 'tailor_scissors');
  assert.equal(st.getCatNapVisuals().purpleClothSelected, true);
});

test('Step 10 ASMR Foam Cover -> High-Pressure Rinse visual progression', () => {
  const st = new RestorationState(STEPS, createMockStorage());
  st.goToStep(9); // p10_foam_rinse
  assert.equal(st.getPrototypeVisuals().foamCoverage, 0);
  assert.equal(st.getPrototypeVisuals().grimeAlpha, 1);

  st.addProgress(0.5);
  assert.equal(st.getPrototypeVisuals().foamCoverage, 0.5);

  st.addProgress(0.6); // completes foam substep -> switches to water_jet
  assert.equal(st.substepIndex, 1);
  assert.equal(st.activeTool, 'water_jet');
  assert.equal(st.getPrototypeVisuals().foamCoverage, 1);

  st.addProgress(0.5);
  assert.equal(st.getPrototypeVisuals().foamCoverage, 0.5);
  st.addProgress(0.5);
  assert.equal(st.getPrototypeVisuals().foamCoverage, 0);
  assert.equal(st.getPrototypeVisuals().grimeAlpha, 0);
});

test('Persistence: save, load, corrupted JSON guard, clamping & episode reset', () => {
  const storage = createMockStorage();
  const st1 = new RestorationState(STEPS, storage);
  assert.equal(st1.hasSavedProgress(), false);

  st1.goToStep(15);
  st1.lang = 'en';
  st1.spookyFinale = false;
  st1.save();
  assert.equal(st1.hasSavedProgress(), true);

  const st2 = new RestorationState(STEPS, storage);
  assert.equal(st2.load(), true);
  assert.equal(st2.stepIndex, 15);
  assert.equal(st2.lang, 'en');
  assert.equal(st2.spookyFinale, false);

  // Clamping & navigation boundaries
  st2.goToStep(-5);
  assert.equal(st2.stepIndex, 0);
  st2.prevStep();
  assert.equal(st2.stepIndex, 0);
  st2.goToStep(999);
  assert.equal(st2.stepIndex, 23);
  st2.nextStep();
  assert.equal(st2.stepIndex, 23);

  // Unknown tool safety
  assert.equal(st2.selectTool('nonexistent').ok, false);

  // Reset current episode clears only that episode
  st2.completedSteps.add('p01_knife');
  st2.completedSteps.add('c01_lightbulb');
  st2.selectEpisode('catnap');
  st2.resetCurrentEpisode();
  assert.equal(st2.completedSteps.has('p01_knife'), true);
  assert.equal(st2.completedSteps.has('c01_lightbulb'), false);

  // Corrupted storage resilience
  storage.setItem(STORAGE_KEY, '{bad-json');
  assert.equal(st2.hasSavedProgress(), false);
  assert.equal(st2.load(), false);
});
