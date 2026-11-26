/* ============================================================================
   js/main.js — Streamlined Wordless Floating-Pill Controller & 60 FPS Stage
   Instant play on load (zero blocking modals), crisp tactile tool pills
   ============================================================================ */
(function (root) {
  'use strict';

  const LOGICAL_W = 1280;
  const LOGICAL_H = 720;

  const { STEPS } = root.ASMRData;
  const { ASMRAudio } = root.ASMRAudioEngine;
  const { RestorationState } = root.ASMRState;
  const { drawRoom } = root.ASMRRooms;
  const { drawPrototype } = root.ASMRPrototype;
  const { drawCatNap } = root.ASMRCatNap;
  const { drawTargetGuide, drawHeldTool, drawParticles } = root.ASMRTools;

  const ROOM_THUMB_MAP = {
    lab_desk: 'assets/room_lab_desk.jpg',
    lab_desk_crt: 'assets/room_crt_closeup.jpg',
    green_chamber: 'assets/room_green_chamber.jpg',
    steel_cabinet: 'assets/room_steel_cabinet.jpg',
    playcare_room: 'assets/room_playcare.jpg',
    laundry_room: 'assets/room_laundry.jpg',
    tailor_bench: 'assets/room_tailor_bench.jpg',
    tailor_bench_closeup: 'assets/room_tailor_bench.jpg'
  };

  const state = new RestorationState(STEPS);
  state.started = true; // Instant play on load — zero blocking intro wall!
  const audio = new ASMRAudio();

  // DOM References
  const canvas = document.getElementById('stage-canvas');
  const ctx = canvas.getContext('2d');
  const btnEpProto = document.getElementById('btn-ep-prototype');
  const btnEpCatnap = document.getElementById('btn-ep-catnap');
  const btnChapters = document.getElementById('btn-chapters');
  const stepCounter = document.getElementById('step-counter');
  const stepProgressFill = document.getElementById('step-progress-fill');
  const btnAudio = document.getElementById('btn-audio');
  const icoSoundOn = btnAudio.querySelector('.ico-sound-on');
  const icoSoundOff = btnAudio.querySelector('.ico-sound-off');
  const btnSpooky = document.getElementById('btn-spooky');
  const spookyIcon = document.getElementById('spooky-icon');
  const btnReset = document.getElementById('btn-reset');
  const resetConfirm = document.getElementById('reset-confirm');
  const btnResetYes = document.getElementById('btn-reset-yes');
  const btnResetNo = document.getElementById('btn-reset-no');
  const toastEl = document.getElementById('toast');
  const toolTray = document.getElementById('tool-tray');
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const btnAssist = document.getElementById('btn-auto-assist');

  const overlayFinale = document.getElementById('overlay-finale');
  const btnFinaleNext = document.getElementById('btn-finale-next');
  const finaleNextEmoji = document.getElementById('finale-next-emoji');
  const btnFinaleReplay = document.getElementById('btn-finale-replay');

  const chapterDrawer = document.getElementById('chapter-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerList = document.getElementById('drawer-list');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');

  // Interactive pointer & particle state
  const pointer = {
    x: null,
    y: null,
    down: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    insideTarget: false
  };
  const particles = [];
  let toastTimer = null;
  let autoAdvanceTimer = null;
  let lastFrameTs = 0;
  let elapsedTime = 0;

  function showToast(symbol) {
    toastEl.textContent = symbol;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 1100);
  }

  function spawnParticles(x, y, toolId, count) {
    const colorMap = {
      foam_gun: '#ffffff',
      water_jet: '#7dd3fc',
      aerosol: '#e2e8f0',
      hairdryer: '#fef08a',
      cotton: '#ffffff',
      airbrush: '#c084fc',
      hairbrush: '#e9d5ff',
      torch: '#fb923c',
      cloth: '#fde047',
      polish_tube: '#fde047',
      wash_start: '#bae6fd',
      spoons: '#4ade80',
      needle: '#c084fc'
    };
    const col = colorMap[toolId] || '#fde047';
    for (let i = 0; i < (count || 6); i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 45 + Math.random() * 145;
      particles.push({
        x: x + (Math.random() - 0.5) * 28,
        y: y + (Math.random() - 0.5) * 28,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 35,
        size: 3 + Math.random() * 6,
        color: col,
        life: 0.45 + Math.random() * 0.45,
        maxLife: 0.9
      });
    }
  }

  function clearAutoAdvance() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  function hideResetConfirm() {
    resetConfirm.classList.add('hidden');
    btnReset.classList.remove('hidden');
  }

  /* ==========================================================================
     UI SYNC (Zero visible words — crisp icon states & progress pill only!)
     ========================================================================== */
  function syncUI() {
    const step = state.getCurrentStep();

    btnEpProto.classList.toggle('active', step.episode === 'prototype');
    btnEpProto.setAttribute('aria-selected', String(step.episode === 'prototype'));
    btnEpCatnap.classList.toggle('active', step.episode === 'catnap');
    btnEpCatnap.setAttribute('aria-selected', String(step.episode === 'catnap'));

    btnAudio.classList.toggle('active-soft', state.audioEnabled);
    btnAudio.setAttribute('aria-pressed', String(state.audioEnabled));
    icoSoundOn.classList.toggle('hidden', !state.audioEnabled);
    icoSoundOff.classList.toggle('hidden', state.audioEnabled);

    btnSpooky.classList.toggle('active-soft', state.spookyFinale);
    btnSpooky.setAttribute('aria-pressed', String(state.spookyFinale));
    spookyIcon.textContent = state.spookyFinale ? '👻' : '✨';

    const numStr = String(state.stepIndex + 1).padStart(2, '0');
    stepCounter.textContent = `${numStr}/${STEPS.length}`;
    stepProgressFill.style.width = `${Math.round(state.getOverallStepProgress() * 100)}%`;

    btnPrev.disabled = state.stepIndex === 0;
    btnNext.disabled = state.stepIndex >= STEPS.length - 1;

    renderToolTray();
    renderDrawerList();
  }

  function renderToolTray() {
    const step = state.getCurrentStep();
    const target = state.getActiveTarget();
    toolTray.innerHTML = '';

    for (const tool of step.tools) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool-btn';
      btn.dataset.toolId = tool.id;
      btn.setAttribute('aria-label', tool.en);
      btn.title = tool.en;
      if (state.activeTool === tool.id) btn.classList.add('active');
      if (target && target.tool === tool.id && !tool.wrongSwatch) btn.classList.add('recommended');
      if (tool.wrongSwatch && state.triedWrongSwatches.has(tool.wrongSwatch)) btn.classList.add('done');

      btn.innerHTML = `<span class="tool-emoji" aria-hidden="true">${tool.emoji}</span>`;
      btn.addEventListener('click', () => {
        audio.unlock();
        const res = state.selectTool(tool.id);
        if (res.gag === 'yellow' || res.gag === 'blue') {
          audio.play('wrongBuzzer');
          btn.classList.add('wrong');
          showToast('❌');
          setTimeout(() => btn.classList.remove('wrong'), 380);
        } else if (res.completedSubstep) {
          audio.play('plushGrab');
          showToast('🟪 ✅');
          spawnParticles(640, 440, 'airbrush', 14);
        } else {
          audio.play('plushGrab');
        }
        syncUI();
      });
      toolTray.appendChild(btn);
    }
  }

  function renderDrawerList() {
    drawerList.innerHTML = '';
    STEPS.forEach((step, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'drawer-item';
      item.setAttribute('aria-label', `${idx + 1}. ${step.title.en}`);
      item.title = `${String(idx + 1).padStart(2, '0')} · ${step.timestamp}`;
      if (idx === state.stepIndex) item.classList.add('current');
      if (state.completedSteps.has(step.id)) item.classList.add('completed');

      const bg = ROOM_THUMB_MAP[step.room] || 'assets/room_steel_cabinet.jpg';
      item.style.backgroundImage = `url('${bg}')`;

      const num = String(idx + 1).padStart(2, '0');
      const badge = state.completedSteps.has(step.id) ? '✓' : num;
      const epEmoji = step.episode === 'prototype' ? '🃏' : '🐱';
      const primaryToolEmoji = step.tools[0] ? step.tools[0].emoji : '✨';

      item.innerHTML = `
        <span class="drawer-num">${badge}</span>
        <span class="drawer-ep-dot" aria-hidden="true">${epEmoji}</span>
        <span class="drawer-ico" aria-hidden="true">${primaryToolEmoji}</span>
      `;
      item.addEventListener('click', () => {
        clearAutoAdvance();
        hideOverlays();
        state.goToStep(idx);
        closeDrawer();
        syncUI();
      });
      drawerList.appendChild(item);
    });
  }

  function openDrawer() {
    chapterDrawer.classList.remove('hidden');
  }

  function closeDrawer() {
    chapterDrawer.classList.add('hidden');
  }

  function hideOverlays() {
    overlayFinale.classList.add('hidden');
  }

  function triggerFinaleUI(episode) {
    audio.play(state.spookyFinale ? 'spookyAwaken' : 'cozyFinale');
    clearAutoAdvance();
    autoAdvanceTimer = setTimeout(() => {
      if (state.finaleActive !== episode) return;
      finaleNextEmoji.textContent = episode === 'prototype' ? '🐱' : '🃏';
      overlayFinale.classList.remove('hidden');
    }, 1500);
  }

  function handleProgressResult(res, fxX, fxY) {
    if (!res) return;
    if (res.completedSubstep) {
      spawnParticles(fxX, fxY, state.activeTool, 16);
      if (res.prevSubKey === 'screw_bulb') audio.play('bulbOn');
      else if (res.sound) audio.play(res.sound);
    }

    if (res.completedStep) {
      if (res.triggersFinale) {
        triggerFinaleUI(res.triggersFinale);
      } else {
        audio.play('stepComplete');
        showToast('✨');
        clearAutoAdvance();
        autoAdvanceTimer = setTimeout(() => {
          state.nextStep();
          syncUI();
        }, 720);
      }
    }
    syncUI();
  }

  /* ==========================================================================
     POINTER & TOUCH INTERACTION ENGINE (Desktop Mouse + iPad Safari Touch)
     ========================================================================== */
  function clientToLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * LOGICAL_W,
      y: ((clientY - rect.top) / rect.height) * LOGICAL_H
    };
  }

  function isInsideTarget(pt, target, pad) {
    const dx = pt.x - target.x;
    const dy = pt.y - target.y;
    const rad = target.r + (pad || 28);
    return dx * dx + dy * dy <= rad * rad;
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (state.finaleActive) return;
    audio.unlock();
    hideResetConfirm();
    canvas.setPointerCapture(e.pointerId);
    const pt = clientToLogical(e.clientX, e.clientY);
    pointer.x = pt.x;
    pointer.y = pt.y;
    pointer.startX = pt.x;
    pointer.startY = pt.y;
    pointer.lastX = pt.x;
    pointer.lastY = pt.y;
    pointer.down = true;

    const step = state.getCurrentStep();
    const target = state.getActiveTarget();
    pointer.insideTarget = isInsideTarget(pt, target, 36);

    if (!pointer.insideTarget) return;

    if (target.tool && state.activeTool !== target.tool && step.mode !== 'fabric') {
      state.selectTool(target.tool);
      syncUI();
    }

    if (step.mode === 'fabric' && state.substepIndex === 0) {
      const res = state.selectTool('swatch_purple');
      if (res.completedSubstep) {
        audio.play('plushGrab');
        showToast('🟪 ✅');
        spawnParticles(pt.x, pt.y, 'airbrush', 14);
        syncUI();
      }
      return;
    }

    if (step.mode !== 'pull' && !target.scrubRequired) {
      audio.play(target.sound);
      const res = state.advanceSubstep();
      handleProgressResult(res, target.x, target.y);
      return;
    }

    if (target.scrubRequired) {
      audio.play(target.sound, 90);
      spawnParticles(pt.x, pt.y, state.activeTool, 5);
      const res = state.addProgress(0.14);
      handleProgressResult(res, pt.x, pt.y);
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const pt = clientToLogical(e.clientX, e.clientY);
    const moveDist = pointer.x != null ? Math.hypot(pt.x - pointer.lastX, pt.y - pointer.lastY) : 0;
    pointer.x = pt.x;
    pointer.y = pt.y;
    pointer.lastX = pt.x;
    pointer.lastY = pt.y;

    if (!pointer.down || state.finaleActive) return;
    const step = state.getCurrentStep();
    const target = state.getActiveTarget();
    pointer.insideTarget = isInsideTarget(pt, target, 55);

    if (step.mode === 'pull') {
      const pullMag = Math.hypot(pt.x - pointer.startX, pt.y - pointer.startY);
      const frac = Math.min(1, pullMag / 115);
      if (frac > state.progress) {
        audio.play(target.sound, 160);
        spawnParticles(pt.x, pt.y, state.activeTool, 3);
        const res = state.addProgress(frac - state.progress);
        handleProgressResult(res, pt.x, pt.y);
      }
      return;
    }

    if (target.scrubRequired && pointer.insideTarget && moveDist > 2) {
      const gain = Math.min(0.08, moveDist / 780);
      audio.play(target.sound, 110);
      if (Math.random() < 0.55) spawnParticles(pt.x, pt.y, state.activeTool, 2);
      const res = state.addProgress(gain);
      handleProgressResult(res, pt.x, pt.y);
    }
  });

  function onPointerRelease() {
    if (pointer.down && !state.finaleActive) {
      const step = state.getCurrentStep();
      if (step.mode === 'pull' && pointer.insideTarget && state.progress < 0.99) {
        const res = state.addProgress(0.36);
        audio.play(step.sound);
        handleProgressResult(res, pointer.x, pointer.y);
      }
    }
    pointer.down = false;
    pointer.insideTarget = false;
  }

  canvas.addEventListener('pointerup', onPointerRelease);
  canvas.addEventListener('pointercancel', onPointerRelease);
  canvas.addEventListener('pointerleave', () => {
    if (!pointer.down) {
      pointer.x = null;
      pointer.y = null;
    }
  });

  /* ==========================================================================
     TOOLBAR BUTTONS & KEYBOARD SHORTCUTS
     ========================================================================== */
  btnEpProto.addEventListener('click', () => {
    clearAutoAdvance();
    audio.unlock();
    hideOverlays();
    hideResetConfirm();
    state.selectEpisode('prototype');
    syncUI();
  });

  btnEpCatnap.addEventListener('click', () => {
    clearAutoAdvance();
    audio.unlock();
    hideOverlays();
    hideResetConfirm();
    state.selectEpisode('catnap');
    syncUI();
  });

  btnPrev.addEventListener('click', () => {
    clearAutoAdvance();
    hideOverlays();
    state.prevStep();
    syncUI();
  });

  btnNext.addEventListener('click', () => {
    clearAutoAdvance();
    hideOverlays();
    state.nextStep();
    syncUI();
  });

  btnAssist.addEventListener('click', () => {
    audio.unlock();
    if (state.finaleActive) return;
    const target = state.getActiveTarget();
    if (target.tool && state.activeTool !== target.tool) {
      state.selectTool(target.tool);
    }
    audio.play(target.sound);
    const res = state.advanceSubstep();
    handleProgressResult(res, target.x, target.y);
  });

  btnAudio.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    audio.setEnabled(state.audioEnabled);
    if (state.audioEnabled) audio.play('plushGrab');
    syncUI();
  });

  btnSpooky.addEventListener('click', () => {
    state.spookyFinale = !state.spookyFinale;
    state.save();
    syncUI();
  });

  // Inline visual-only reset confirmation (zero alert boxes!)
  btnReset.addEventListener('click', () => {
    btnReset.classList.add('hidden');
    resetConfirm.classList.remove('hidden');
  });

  btnResetNo.addEventListener('click', hideResetConfirm);

  btnResetYes.addEventListener('click', () => {
    hideResetConfirm();
    clearAutoAdvance();
    hideOverlays();
    state.resetCurrentEpisode();
    syncUI();
  });

  btnChapters.addEventListener('click', openDrawer);
  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  btnFinaleNext.addEventListener('click', () => {
    clearAutoAdvance();
    const curEp = state.finaleActive || state.getCurrentStep().episode;
    hideOverlays();
    state.selectEpisode(curEp === 'prototype' ? 'catnap' : 'prototype');
    syncUI();
  });

  btnFinaleReplay.addEventListener('click', () => {
    clearAutoAdvance();
    hideOverlays();
    state.resetCurrentEpisode();
    syncUI();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      hideResetConfirm();
    } else if (e.key === 'ArrowRight') {
      clearAutoAdvance();
      hideOverlays();
      state.nextStep();
      syncUI();
    } else if (e.key === 'ArrowLeft') {
      clearAutoAdvance();
      hideOverlays();
      state.prevStep();
      syncUI();
    } else if (e.key === ' ') {
      e.preventDefault();
      btnAssist.click();
    }
  });

  /* ==========================================================================
     60 FPS RENDER LOOP
     ========================================================================== */
  function tick(ts) {
    const dt = lastFrameTs ? Math.min(0.05, (ts - lastFrameTs) / 1000) : 0.016;
    lastFrameTs = ts;
    elapsedTime += dt;

    if (state.wrongSwatchTimer > 0) {
      state.wrongSwatchTimer = Math.max(0, state.wrongSwatchTimer - dt);
      if (state.wrongSwatchTimer === 0) state.wrongSwatchFlash = null;
    }

    if (pointer.down && pointer.insideTarget && !state.finaleActive) {
      const target = state.getActiveTarget();
      if (target.scrubRequired) {
        audio.play(target.sound, 140);
        if (Math.random() < 0.35) spawnParticles(pointer.x, pointer.y, state.activeTool, 1);
        const res = state.addProgress(dt * 0.48);
        if (res.completedSubstep || res.completedStep) {
          handleProgressResult(res, pointer.x, pointer.y);
        } else {
          stepProgressFill.style.width = `${Math.round(state.getOverallStepProgress() * 100)}%`;
        }
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 180 * dt;
    }

    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    const step = state.getCurrentStep();
    const isProto = step.episode === 'prototype';
    const visuals = isProto ? state.getPrototypeVisuals() : state.getCatNapVisuals();

    const activeRoom = (state.finaleActive === 'prototype') ? 'lab_desk' : step.room;
    drawRoom(ctx, LOGICAL_W, LOGICAL_H, activeRoom, visuals, elapsedTime);

    if (isProto) {
      drawPrototype(ctx, LOGICAL_W, LOGICAL_H, visuals, elapsedTime, activeRoom);
    } else {
      drawCatNap(ctx, LOGICAL_W, LOGICAL_H, visuals, elapsedTime, activeRoom);
    }

    if (!state.finaleActive) {
      const target = state.getActiveTarget();
      drawTargetGuide(ctx, target, step.mode, elapsedTime, pointer.down && pointer.insideTarget);
      if (pointer.x != null && pointer.y != null) {
        drawHeldTool(ctx, state.activeTool, pointer.x, pointer.y, pointer.down, elapsedTime);
      }
    }

    drawParticles(ctx, particles);
    requestAnimationFrame(tick);
  }

  const assetsReady = root.ASMRAssets ? root.ASMRAssets.loadAll() : Promise.resolve();

  root.__GAME__ = {
    state,
    audio,
    STEPS,
    assetsReady,
    syncUI,
    goToStep: (idx) => {
      clearAutoAdvance();
      clearTimeout(toastTimer);
      toastEl.classList.remove('show');
      hideOverlays();
      state.goToStep(idx);
      syncUI();
    },
    completeCurrentSubstep: () => {
      const target = state.getActiveTarget();
      const res = state.advanceSubstep();
      handleProgressResult(res, target.x, target.y);
      return res;
    }
  };

  syncUI();
  requestAnimationFrame(tick);
})(window);
