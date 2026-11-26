/* ============================================================================
   js/main.js — 60 FPS Interactive Stage Controller, Pointer Engine & HUD Sync
   ============================================================================ */
(function (root) {
  'use strict';

  const LOGICAL_W = 1280;
  const LOGICAL_H = 720;

  const { I18N, STEPS } = root.ASMRData;
  const { ASMRAudio } = root.ASMRAudioEngine;
  const { RestorationState } = root.ASMRState;
  const { drawRoom } = root.ASMRRooms;
  const { drawPrototype } = root.ASMRPrototype;
  const { drawCatNap } = root.ASMRCatNap;
  const { drawTargetGuide, drawHeldTool, drawParticles } = root.ASMRTools;

  const state = new RestorationState(STEPS);
  const audio = new ASMRAudio();

  // DOM References
  const canvas = document.getElementById('stage-canvas');
  const ctx = canvas.getContext('2d');
  const hudTitle = document.getElementById('hud-title');
  const btnEpProto = document.getElementById('btn-ep-prototype');
  const btnEpCatnap = document.getElementById('btn-ep-catnap');
  const btnChapters = document.getElementById('btn-chapters');
  const stepCounter = document.getElementById('step-counter');
  const btnAudio = document.getElementById('btn-audio');
  const audioIcon = document.getElementById('audio-icon');
  const btnSpooky = document.getElementById('btn-spooky');
  const spookyIcon = document.getElementById('spooky-icon');
  const spookyLabel = document.getElementById('spooky-label');
  const btnLang = document.getElementById('btn-lang');
  const langLabel = document.getElementById('lang-label');
  const btnReset = document.getElementById('btn-reset');
  const stepRoomTag = document.getElementById('step-room-tag');
  const stepNameEl = document.getElementById('step-name');
  const stepHintEl = document.getElementById('step-hint');
  const stepProgressFill = document.getElementById('step-progress-fill');
  const toastEl = document.getElementById('toast');
  const toolTray = document.getElementById('tool-tray');
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const btnAssist = document.getElementById('btn-auto-assist');

  const overlayIntro = document.getElementById('overlay-intro');
  const introHeading = document.getElementById('intro-heading');
  const introSub = document.getElementById('intro-sub');
  const btnStartProto = document.getElementById('btn-start-prototype');
  const btnStartCatnap = document.getElementById('btn-start-catnap');
  const introResumeWrap = document.getElementById('intro-resume-wrap');
  const btnResumeSave = document.getElementById('btn-resume-save');

  const overlayFinale = document.getElementById('overlay-finale');
  const finaleTitle = document.getElementById('finale-title');
  const finaleDesc = document.getElementById('finale-desc');
  const btnFinaleNext = document.getElementById('btn-finale-next');
  const finaleNextLabel = document.getElementById('finale-next-label');
  const btnFinaleReplay = document.getElementById('btn-finale-replay');

  const chapterDrawer = document.getElementById('chapter-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerTitle = document.getElementById('drawer-title');
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

  function t(key) {
    const dict = I18N[state.lang] || I18N.zh;
    return dict[key] || key;
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
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

  /* ==========================================================================
     UI SYNC
     ========================================================================== */
  function syncUI() {
    const step = state.getCurrentStep();
    const sub = state.getCurrentSubstep();
    const lang = state.lang;

    hudTitle.textContent = t('appTitle');
    langLabel.textContent = lang === 'zh' ? 'EN' : '中文';
    btnEpProto.classList.toggle('active', step.episode === 'prototype');
    btnEpProto.setAttribute('aria-selected', String(step.episode === 'prototype'));
    btnEpCatnap.classList.toggle('active', step.episode === 'catnap');
    btnEpCatnap.setAttribute('aria-selected', String(step.episode === 'catnap'));

    // Translate static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && I18N[lang][key]) el.textContent = I18N[lang][key];
    });

    // Intro copy
    introHeading.textContent = t('introHeading');
    introSub.textContent = t('introSub');
    btnResumeSave.textContent = t('resumeSave');
    introResumeWrap.hidden = !state.hasSavedProgress();

    // Audio & Spooky toggles
    btnAudio.classList.toggle('active', state.audioEnabled);
    btnAudio.setAttribute('aria-pressed', String(state.audioEnabled));
    audioIcon.textContent = state.audioEnabled ? '🔊' : '🔇';

    btnSpooky.classList.toggle('active', state.spookyFinale);
    btnSpooky.setAttribute('aria-pressed', String(state.spookyFinale));
    spookyIcon.textContent = state.spookyFinale ? '👻' : '✨';
    spookyLabel.textContent = state.spookyFinale ? t('spookyOn') : t('spookyOff');

    // Step counter & banner
    const numStr = String(state.stepIndex + 1).padStart(2, '0');
    stepCounter.textContent = `${numStr}/${STEPS.length}`;
    stepRoomTag.textContent = `${step.roomLabel[lang]} · ${step.timestamp}`;
    stepNameEl.textContent = `${numStr}. ${step.title[lang]}`;
    stepHintEl.textContent = sub ? sub[lang] : step.hint[lang];
    stepProgressFill.style.width = `${Math.round(state.getOverallStepProgress() * 100)}%`;

    btnPrev.disabled = state.stepIndex === 0;
    btnNext.disabled = state.stepIndex >= STEPS.length - 1;

    renderToolTray();
    renderDrawerList();
  }

  function renderToolTray() {
    const step = state.getCurrentStep();
    const target = state.getActiveTarget();
    const lang = state.lang;
    toolTray.innerHTML = '';

    for (const tool of step.tools) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool-btn';
      btn.dataset.toolId = tool.id;
      if (state.activeTool === tool.id) btn.classList.add('active');
      if (target && target.tool === tool.id && !tool.wrongSwatch) btn.classList.add('recommended');
      if (tool.wrongSwatch && state.triedWrongSwatches.has(tool.wrongSwatch)) btn.classList.add('done');

      btn.innerHTML = `<span class="tool-emoji" aria-hidden="true">${tool.emoji}</span><span class="tool-label">${tool[lang]}</span>`;
      btn.addEventListener('click', () => {
        audio.unlock();
        const res = state.selectTool(tool.id);
        if (res.gag === 'yellow') {
          audio.play('wrongBuzzer');
          btn.classList.add('wrong');
          showToast(t('wrongFabricYellow'));
          setTimeout(() => btn.classList.remove('wrong'), 400);
        } else if (res.gag === 'blue') {
          audio.play('wrongBuzzer');
          btn.classList.add('wrong');
          showToast(t('wrongFabricBlue'));
          setTimeout(() => btn.classList.remove('wrong'), 400);
        } else if (res.completedSubstep) {
          audio.play('plushGrab');
          showToast(t('rightFabricPurple'));
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
    const lang = state.lang;
    drawerTitle.textContent = t('drawerTitle');
    drawerList.innerHTML = '';

    const addHeader = (text) => {
      const h = document.createElement('div');
      h.className = 'drawer-section-title';
      h.textContent = text;
      drawerList.appendChild(h);
    };

    addHeader(t('secProto'));
    STEPS.forEach((step, idx) => {
      if (idx === 12) addHeader(t('secCatnap'));
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'drawer-item';
      if (idx === state.stepIndex) item.classList.add('current');
      if (state.completedSteps.has(step.id)) item.classList.add('completed');

      const num = String(idx + 1).padStart(2, '0');
      const check = state.completedSteps.has(step.id) ? '✓' : num;
      item.innerHTML = `
        <span class="drawer-num">${check}</span>
        <span class="drawer-item-text">
          <span class="drawer-item-title">${step.title[lang]}</span>
          <span class="drawer-item-meta">${step.timestamp} · ${step.roomLabel[lang]}</span>
        </span>
      `;
      item.addEventListener('click', () => {
        clearAutoAdvance();
        hideOverlays();
        state.started = true;
        state.goToStep(idx);
        closeDrawer();
        syncUI();
      });
      drawerList.appendChild(item);
    });
  }

  function openDrawer() {
    chapterDrawer.hidden = false;
  }

  function closeDrawer() {
    chapterDrawer.hidden = true;
  }

  function hideOverlays() {
    overlayIntro.classList.remove('visible');
    overlayIntro.hidden = true;
    overlayFinale.classList.remove('visible');
    overlayFinale.hidden = true;
  }

  function triggerFinaleUI(episode) {
    audio.play(state.spookyFinale ? 'spookyAwaken' : 'cozyFinale');
    // Let the dramatic canvas finale animate for 1.8s before showing the clean action card
    clearAutoAdvance();
    autoAdvanceTimer = setTimeout(() => {
      if (state.finaleActive !== episode) return;
      if (episode === 'prototype') {
        finaleTitle.textContent = state.spookyFinale ? t('finaleProtoTitle') : t('finaleProtoCozyTitle');
        finaleDesc.textContent = t('finaleProtoDesc');
        finaleNextLabel.textContent = t('finaleProtoNext');
      } else {
        finaleTitle.textContent = state.spookyFinale ? t('finaleCatnapTitle') : t('finaleCatnapCozyTitle');
        finaleDesc.textContent = t('finaleCatnapDesc');
        finaleNextLabel.textContent = t('finaleCatnapNext');
      }
      overlayFinale.hidden = false;
      requestAnimationFrame(() => overlayFinale.classList.add('visible'));
    }, 1800);
  }

  function handleProgressResult(res, fxX, fxY) {
    if (!res) return;
    if (res.completedSubstep) {
      spawnParticles(fxX, fxY, state.activeTool, 16);
      if (res.prevSubKey === 'open_fridge') showToast(t('fridgeOpened'));
      else if (res.prevSubKey === 'open_locker') showToast(t('lockerOpened'));
      else if (res.prevSubKey === 'open_doors') showToast(t('cabinetOpened'));
      else if (res.prevSubKey === 'check_report') showToast(t('reportChecked'));
      else if (res.prevSubKey === 'pour_detergent') showToast(t('washerLoaded'));
      else if (res.prevSubKey === 'screw_bulb') audio.play('bulbOn');
      else if (res.sound) audio.play(res.sound);
    }

    if (res.completedStep) {
      if (res.triggersFinale) {
        triggerFinaleUI(res.triggersFinale);
      } else {
        audio.play('stepComplete');
        showToast(t('stepComplete'));
        clearAutoAdvance();
        autoAdvanceTimer = setTimeout(() => {
          state.nextStep();
          syncUI();
        }, 780);
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
    if (!state.started || state.finaleActive) return;
    audio.unlock();
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

    // Auto-equip the matching recommended tool if player directly taps the active zone
    if (target.tool && state.activeTool !== target.tool && step.mode !== 'fabric') {
      state.selectTool(target.tool);
      syncUI();
    }

    if (step.mode === 'fabric' && state.substepIndex === 0) {
      // Clicking canvas during fabric selection auto-selects CATNAP purple cleanly
      const res = state.selectTool('swatch_purple');
      if (res.completedSubstep) {
        audio.play('plushGrab');
        showToast(t('rightFabricPurple'));
        spawnParticles(pt.x, pt.y, 'airbrush', 14);
        syncUI();
      }
      return;
    }

    // Immediate discrete action steps (non-scrub, non-pull)
    if (step.mode !== 'pull' && !target.scrubRequired) {
      audio.play(target.sound);
      const res = state.advanceSubstep();
      handleProgressResult(res, target.x, target.y);
      return;
    }

    // For scrub / hold steps, give immediate tactile burst on tap too
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

    if (!pointer.down || !state.started || state.finaleActive) return;
    const step = state.getCurrentStep();
    const target = state.getActiveTarget();
    pointer.insideTarget = isInsideTarget(pt, target, 55);

    if (step.mode === 'pull') {
      const vx = pt.x - pointer.startX;
      const vy = pt.y - pointer.startY;
      const pullMag = Math.hypot(vx, vy);
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
    if (pointer.down && state.started && !state.finaleActive) {
      const step = state.getCurrentStep();
      // Forgiving tap-pull fallback on Step 1 if a kid taps the dagger instead of dragging
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
     BUTTON HANDLERS & KEYBOARD SHORTCUTS
     ========================================================================== */
  btnStartProto.addEventListener('click', () => {
    audio.unlock();
    audio.play('plushGrab');
    state.started = true;
    hideOverlays();
    state.selectEpisode('prototype');
    syncUI();
  });

  btnStartCatnap.addEventListener('click', () => {
    audio.unlock();
    audio.play('plushGrab');
    state.started = true;
    hideOverlays();
    state.selectEpisode('catnap');
    syncUI();
  });

  btnResumeSave.addEventListener('click', () => {
    audio.unlock();
    audio.play('plushGrab');
    state.load();
    state.started = true;
    hideOverlays();
    syncUI();
  });

  btnEpProto.addEventListener('click', () => {
    clearAutoAdvance();
    audio.unlock();
    state.started = true;
    hideOverlays();
    state.selectEpisode('prototype');
    syncUI();
  });

  btnEpCatnap.addEventListener('click', () => {
    clearAutoAdvance();
    audio.unlock();
    state.started = true;
    hideOverlays();
    state.selectEpisode('catnap');
    syncUI();
  });

  btnPrev.addEventListener('click', () => {
    clearAutoAdvance();
    hideOverlays();
    state.started = true;
    state.prevStep();
    syncUI();
  });

  btnNext.addEventListener('click', () => {
    clearAutoAdvance();
    hideOverlays();
    state.started = true;
    state.nextStep();
    syncUI();
  });

  btnAssist.addEventListener('click', () => {
    audio.unlock();
    if (!state.started || state.finaleActive) return;
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

  btnLang.addEventListener('click', () => {
    state.lang = state.lang === 'zh' ? 'en' : 'zh';
    state.save();
    syncUI();
  });

  btnReset.addEventListener('click', () => {
    clearAutoAdvance();
    hideOverlays();
    state.started = true;
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
    if (e.key === 'Escape') closeDrawer();
    if (!state.started) return;
    if (e.key === 'ArrowRight') {
      clearAutoAdvance();
      state.nextStep();
      syncUI();
    } else if (e.key === 'ArrowLeft') {
      clearAutoAdvance();
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

    // Update wrong swatch flash timer
    if (state.wrongSwatchTimer > 0) {
      state.wrongSwatchTimer = Math.max(0, state.wrongSwatchTimer - dt);
      if (state.wrongSwatchTimer === 0) state.wrongSwatchFlash = null;
    }

    // Continuous hold progress for scrub/hold steps (great for iPad single-finger hold!)
    if (pointer.down && pointer.insideTarget && state.started && !state.finaleActive) {
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

    // Update particles
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

    // Render Stage
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    const step = state.getCurrentStep();
    const isProto = step.episode === 'prototype';
    const visuals = isProto ? state.getPrototypeVisuals() : state.getCatNapVisuals();

    // During Prototype Finale, show Lab Desk with Red Alert!
    const activeRoom = (state.finaleActive === 'prototype') ? 'lab_desk' : step.room;
    drawRoom(ctx, LOGICAL_W, LOGICAL_H, activeRoom, visuals, elapsedTime);

    if (isProto) {
      drawPrototype(ctx, LOGICAL_W, LOGICAL_H, visuals, elapsedTime, activeRoom);
    } else {
      drawCatNap(ctx, LOGICAL_W, LOGICAL_H, visuals, elapsedTime, activeRoom);
    }

    // Draw Target Guide & Active Cursor Tool
    if (state.started && !state.finaleActive) {
      const target = state.getActiveTarget();
      drawTargetGuide(ctx, target, step.mode, elapsedTime, pointer.down && pointer.insideTarget);
      if (pointer.x != null && pointer.y != null) {
        drawHeldTool(ctx, state.activeTool, pointer.x, pointer.y, pointer.down, elapsedTime);
      }
    }

    drawParticles(ctx, particles);

    requestAnimationFrame(tick);
  }

  // Expose clean inspection API for E2E tests and QA scripts
  root.__GAME__ = {
    state,
    audio,
    STEPS,
    syncUI,
    goToStep: (idx) => {
      clearAutoAdvance();
      clearTimeout(toastTimer);
      toastEl.classList.remove('show');
      hideOverlays();
      state.started = true;
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

  // Boot
  syncUI();
  requestAnimationFrame(tick);
})(window);
