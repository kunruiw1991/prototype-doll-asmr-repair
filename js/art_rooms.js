/* ============================================================================
   js/art_rooms.js — Ultra-Faithful Illustrated Rooms from youtu.be/6Nw7Hi4Xr9s
   6 Distinct Playtime Co. & Playcare Environments with Interactive Props
   ============================================================================ */
(function (root) {
  'use strict';

  function roundRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawVignette(ctx, W, H, strength) {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.48, H * 0.25, W * 0.5, H * 0.5, W * 0.65);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawTileGrid(ctx, W, H, tileW, tileH, baseColor, groutColor, grimeAlpha) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = groutColor;
    ctx.lineWidth = 2;
    for (let y = 0; y <= H; y += tileH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    for (let x = 0; x <= W; x += tileW) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    // Subtle aged ceramic grime streaks
    if (grimeAlpha > 0) {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `rgba(18, 22, 20, ${grimeAlpha})`);
      grad.addColorStop(0.5, `rgba(30, 34, 28, ${grimeAlpha * 0.3})`);
      grad.addColorStop(1, `rgba(10, 14, 12, ${grimeAlpha * 1.15})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ==========================================================================
     ROOM 1: White-Tiled Lab Desk (0:25 - 2:10 & Prototype Finale)
     ========================================================================== */
  function drawLabDesk(ctx, W, H, visuals, time, isCRTCloseup) {
    if (isCRTCloseup) {
      drawLabCRTCloseup(ctx, W, H, visuals, time);
      return;
    }

    drawTileGrid(ctx, W, H, 68, 42, '#cfd6dc', '#9ba4ad', 0.26);

    // Wall Clock (top left)
    ctx.save();
    ctx.translate(105, 118);
    ctx.fillStyle = '#e7ecef';
    ctx.strokeStyle = '#333b44';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 34, Math.sin(a) * 34);
      ctx.lineTo(Math.cos(a) * 41, Math.sin(a) * 41);
      ctx.stroke();
    }
    // Clock hands
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(-0.9) * 24, Math.sin(-0.9) * 24);
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(1.1 + time * 0.06) * 34, Math.sin(1.1 + time * 0.06) * 34);
    ctx.stroke();
    ctx.restore();

    // Left Beige Desk + 90s CRT Computer Monitor
    ctx.fillStyle = '#a89a7a';
    ctx.strokeStyle = '#5c523c';
    ctx.lineWidth = 3;
    ctx.fillRect(0, 468, 430, 28);
    ctx.strokeRect(0, 468, 430, 28);
    ctx.fillStyle = '#8b7f63';
    ctx.fillRect(28, 496, 360, 224);
    // Cardboard box under desk
    ctx.fillStyle = '#7e6a4a';
    ctx.fillRect(105, 540, 140, 128);
    ctx.strokeStyle = '#4b3d28';
    ctx.strokeRect(105, 540, 140, 128);

    // 90s Beige CRT Monitor
    roundRectPath(ctx, 98, 222, 232, 198, 12);
    const crtBody = ctx.createLinearGradient(98, 222, 330, 420);
    crtBody.addColorStop(0, '#dad4be');
    crtBody.addColorStop(1, '#b6ae93');
    ctx.fillStyle = crtBody;
    ctx.fill();
    ctx.strokeStyle = '#6b6452';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Monitor stand
    ctx.fillStyle = '#b9b196';
    ctx.fillRect(156, 420, 116, 22);
    ctx.fillRect(130, 442, 168, 26);

    // CRT Screen
    roundRectPath(ctx, 118, 240, 192, 144, 8);
    ctx.fillStyle = visuals.crtSyncFrac > 0 ? '#0b2218' : '#1b201e';
    ctx.fill();
    ctx.strokeStyle = '#4b473a';
    ctx.stroke();
    if (visuals.crtSyncFrac > 0 || visuals.finaleActive) {
      ctx.save();
      ctx.beginPath();
      roundRectPath(ctx, 118, 240, 192, 144, 8);
      ctx.clip();
      ctx.strokeStyle = '#34ff8a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 124; x < 304; x += 6) {
        const y = 312 + Math.sin(x * 0.08 + time * 6) * 20 * (0.4 + visuals.crtSyncFrac * 0.6);
        if (x === 124) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(visuals.finaleActive ? 'BOOT 100% READY' : `SYNC ${Math.round(visuals.crtSyncFrac * 100)}%`, 132, 266);
      ctx.restore();
    }

    // Keyboard & Pencil Cup
    ctx.fillStyle = '#cbc4ad';
    ctx.fillRect(102, 446, 222, 22);
    ctx.strokeStyle = '#6f6958';
    ctx.strokeRect(102, 446, 222, 22);
    ctx.fillStyle = '#d98a2b';
    ctx.fillRect(38, 396, 44, 72);
    ctx.strokeStyle = '#784610';
    ctx.strokeRect(38, 396, 44, 72);

    // Right Mustard-Yellow Lab Fridge / Cabinet
    const fx = 918, fy = 152, fw = 286, fh = 550;
    ctx.fillStyle = '#423d2e';
    ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = '#26231a';
    ctx.lineWidth = 4;
    ctx.strokeRect(fx, fy, fw, fh);

    // Inside shelves of lab fridge
    ctx.fillStyle = '#5c5540';
    ctx.fillRect(fx + 14, fy + 16, fw - 28, fh - 32);
    for (let s = 1; s <= 3; s++) {
      ctx.fillStyle = '#7d745a';
      ctx.fillRect(fx + 14, fy + s * 130, fw - 28, 12);
    }

    // Glowing Green Brain Vat inside top shelf!
    if (!visuals.newBrainImplanted) {
      const bx = fx + 142, by = fy + 82;
      const glow = ctx.createRadialGradient(bx, by, 10, bx, by, 85);
      glow.addColorStop(0, 'rgba(74, 255, 112, 0.78)');
      glow.addColorStop(1, 'rgba(74, 255, 112, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, by, 85, 0, Math.PI * 2);
      ctx.fill();

      // Glass jar
      roundRectPath(ctx, bx - 44, by - 52, 88, 102, 12);
      ctx.fillStyle = 'rgba(134, 255, 150, 0.32)';
      ctx.fill();
      ctx.strokeStyle = '#7eff96';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Brain lobes inside jar
      const pulse = Math.sin(time * 4) * 3;
      ctx.fillStyle = '#74f56e';
      ctx.beginPath();
      ctx.ellipse(bx - 14, by + 2 + pulse, 20, 26, -0.15, 0, Math.PI * 2);
      ctx.ellipse(bx + 14, by + 2 + pulse, 20, 26, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1f6e27';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Lid
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 48, by - 60, 96, 14);
    }

    // Specimen bottles on lower shelves
    ctx.fillStyle = '#9b3c46';
    roundRectPath(ctx, fx + 44, fy + 178, 52, 82, 8);
    ctx.fill();
    ctx.fillStyle = '#3d6ea3';
    roundRectPath(ctx, fx + 128, fy + 188, 60, 72, 8);
    ctx.fill();
    ctx.fillStyle = '#a48a34';
    roundRectPath(ctx, fx + 62, fy + 312, 120, 78, 6);
    ctx.fill();

    // Mustard Fridge Door (closed or swung open!)
    if (!visuals.fridgeOpen) {
      const doorGrad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
      doorGrad.addColorStop(0, '#c8ba6c');
      doorGrad.addColorStop(1, '#9b8d47');
      ctx.fillStyle = doorGrad;
      ctx.fillRect(fx, fy, fw, fh);
      ctx.strokeStyle = '#5c5328';
      ctx.lineWidth = 4;
      ctx.strokeRect(fx, fy, fw, fh);
      // Top glass window peeking green glow!
      roundRectPath(ctx, fx + 24, fy + 24, fw - 48, 120, 6);
      ctx.fillStyle = !visuals.newBrainImplanted ? 'rgba(74, 240, 110, 0.28)' : 'rgba(40,46,42,0.5)';
      ctx.fill();
      ctx.strokeStyle = '#4a4321';
      ctx.stroke();
      // Handle
      ctx.fillStyle = '#d4d8df';
      roundRectPath(ctx, fx + 22, fy + 235, 16, 110, 6);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.stroke();
    } else {
      // Open door perspective sliver on far right edge
      ctx.fillStyle = '#b4a559';
      ctx.fillRect(fx + fw - 14, fy, 42, fh);
      ctx.strokeStyle = '#5c5328';
      ctx.strokeRect(fx + fw - 14, fy, 42, fh);
    }

    // Metal Bucket when removing old brain
    if (visuals.fridgeOpen && !visuals.newBrainImplanted) {
      ctx.fillStyle = '#8b95a3';
      ctx.strokeStyle = '#38414e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(576, 560);
      ctx.lineTo(704, 560);
      ctx.lineTo(688, 690);
      ctx.lineTo(592, 690);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      if (visuals.oldBrainRemoved) {
        ctx.fillStyle = '#9c7c38';
        ctx.beginPath();
        ctx.ellipse(640, 564, 34, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Wheelchair behind Prototype (Steps 1–4)
    if (visuals.inWheelchair) {
      drawWheelchair(ctx, 640, 495);
    }

    // Finale Crimson Red-Alert Lighting!
    if (visuals.finaleActive && visuals.spookyFinale) {
      const pulse = 0.45 + 0.25 * Math.sin(time * 5.2);
      ctx.fillStyle = `rgba(170, 12, 24, ${pulse})`;
      ctx.fillRect(0, 0, W, H);
    }

    drawVignette(ctx, W, H, 0.42);
  }

  function drawWheelchair(ctx, cx, cy) {
    ctx.save();
    // Backrest frame
    ctx.fillStyle = '#2d3440';
    ctx.strokeStyle = '#11151c';
    ctx.lineWidth = 4;
    roundRectPath(ctx, cx - 122, cy - 170, 244, 190, 14);
    ctx.fill();
    ctx.stroke();

    // Left & Right spoked metal wheels
    for (const dir of [-1, 1]) {
      const wx = cx + dir * 138;
      ctx.strokeStyle = '#181c24';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.ellipse(wx, cy + 55, 22, 118, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(wx, cy + 55, 14, 96, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Armrests
      ctx.fillStyle = '#3b4454';
      roundRectPath(ctx, cx + dir * 116 - 16, cy - 42, 32, 18, 6);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLabCRTCloseup(ctx, W, H, visuals, time) {
    drawTileGrid(ctx, W, H, 88, 52, '#cfd6dc', '#9ba4ad', 0.2);

    // Desk top
    ctx.fillStyle = '#b4a585';
    ctx.fillRect(0, 520, W, 200);
    ctx.strokeStyle = '#6b6047';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 520);
    ctx.lineTo(W, 520);
    ctx.stroke();

    // Pencil cup on left
    ctx.fillStyle = '#d98a2b';
    roundRectPath(ctx, 74, 380, 96, 155, 10);
    ctx.fill();
    ctx.strokeStyle = '#6f400e';
    ctx.stroke();
    // Pencils sticking out
    const penCols = ['#ef4444', '#facc15', '#3b82f6', '#22c55e'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = penCols[i];
      ctx.save();
      ctx.translate(95 + i * 18, 385);
      ctx.rotate(-0.2 + i * 0.13);
      ctx.fillRect(-5, -82, 10, 86);
      ctx.restore();
    }

    // Giant 90s Beige CRT Monitor Center-Left
    const mx = 230, my = 86, mw = 480, mh = 390;
    const mGrad = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
    mGrad.addColorStop(0, '#e3dcc6');
    mGrad.addColorStop(1, '#b7ae92');
    roundRectPath(ctx, mx, my, mw, mh, 18);
    ctx.fillStyle = mGrad;
    ctx.fill();
    ctx.strokeStyle = '#68604e';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Screen recess
    roundRectPath(ctx, mx + 38, my + 34, mw - 76, mh - 104, 14);
    ctx.fillStyle = '#071b11';
    ctx.fill();
    ctx.strokeStyle = '#3f3b31';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Live Green Brainwave Dual-Hemisphere Scan!
    ctx.save();
    roundRectPath(ctx, mx + 38, my + 34, mw - 76, mh - 104, 14);
    ctx.clip();
    // Scanlines
    ctx.fillStyle = 'rgba(52, 255, 138, 0.06)';
    for (let y = my + 36; y < my + mh - 70; y += 6) {
      ctx.fillRect(mx + 38, y, mw - 76, 2);
    }

    // Left & Right wireframe brain hemispheres
    const sync = visuals.crtSyncFrac;
    for (const bx of [mx + 145, mx + 335]) {
      const by = my + 165;
      const g = ctx.createRadialGradient(bx, by, 10, bx, by, 72);
      g.addColorStop(0, `rgba(60, 255, 130, ${0.45 + sync * 0.4})`);
      g.addColorStop(1, 'rgba(60, 255, 130, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, 72, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(bx, by, 54, 46, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = -30; i <= 30; i += 15) {
        ctx.beginPath();
        ctx.arc(bx + i * 0.5, by, 26, 0.3, Math.PI - 0.3);
        ctx.stroke();
      }
    }

    // Center EEG Waveform bar connecting both brains
    ctx.fillStyle = 'rgba(10, 48, 25, 0.85)';
    ctx.fillRect(mx + 100, my + 146, 280, 42);
    ctx.strokeStyle = '#4ade80';
    ctx.strokeRect(mx + 100, my + 146, 280, 42);
    ctx.strokeStyle = '#7dffb2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = mx + 106; x <= mx + 374; x += 6) {
      const freq = 0.08 + sync * 0.06;
      const amp = 14 * (0.35 + sync * 0.65);
      const y = my + 167 + Math.sin(x * freq + time * 12) * amp;
      if (x === mx + 106) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Progress bar & telemetry text
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(`EXP-1006 NEURAL SYNC: ${Math.round(sync * 100)}%`, mx + 92, my + 82);
    ctx.fillStyle = '#0e3b20';
    ctx.fillRect(mx + 88, my + 245, 304, 18);
    ctx.fillStyle = '#34ff8a';
    ctx.fillRect(mx + 88, my + 245, 304 * sync, 18);
    ctx.restore();

    // Keyboard & Teal Gloved Hands typing!
    roundRectPath(ctx, 210, 505, 520, 120, 12);
    ctx.fillStyle = '#d4ccb4';
    ctx.fill();
    ctx.strokeStyle = '#6c6553';
    ctx.lineWidth = 4;
    ctx.stroke();
    // Keys grid
    ctx.fillStyle = '#f2ede0';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 13; col++) {
        ctx.fillRect(232 + col * 36, 520 + row * 24, 30, 18);
      }
    }
    // Iconic Teal Rubber Gloves hovering & typing!
    const bounceL = Math.sin(time * 16) * (sync > 0 && sync < 1 ? 10 : 3);
    const bounceR = Math.cos(time * 16) * (sync > 0 && sync < 1 ? 10 : 3);
    for (const hand of [{ x: 355, y: 610 + bounceL, dir: -1 }, { x: 585, y: 610 + bounceR, dir: 1 }]) {
      ctx.save();
      ctx.translate(hand.x, hand.y);
      ctx.fillStyle = '#14b8a6';
      ctx.strokeStyle = '#0f5c55';
      ctx.lineWidth = 4;
      roundRectPath(ctx, -62, -45, 124, 108, 30);
      ctx.fill();
      ctx.stroke();
      for (let f = -2; f <= 2; f++) {
        roundRectPath(ctx, f * 22 - 10, -82 + Math.abs(f) * 6, 20, 52, 9);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    drawVignette(ctx, W, H, 0.35);
  }

  /* ==========================================================================
     ROOM 2: Green-Tiled Experiment Chamber (2:10 - 4:10)
     ========================================================================== */
  function drawGreenChamber(ctx, W, H, visuals, time) {
    drawTileGrid(ctx, W, H, 54, 46, '#4c7056', '#2b4232', 0.42);

    // Overhead Blue Pipe
    const pipeGrad = ctx.createLinearGradient(0, 36, 0, 74);
    pipeGrad.addColorStop(0, '#5ea1e0');
    pipeGrad.addColorStop(0.5, '#2b6cb0');
    pipeGrad.addColorStop(1, '#1a3c66');
    ctx.fillStyle = pipeGrad;
    ctx.fillRect(0, 38, W, 34);
    ctx.strokeStyle = '#112642';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 38, W, 34);

    // Left Wall: Taped Missing/Experiment Poster
    ctx.save();
    ctx.translate(105, 185);
    ctx.rotate(-0.04);
    ctx.fillStyle = '#dfd2b5';
    ctx.strokeStyle = '#5c4e36';
    ctx.lineWidth = 3;
    ctx.fillRect(-70, -88, 140, 176);
    ctx.strokeRect(-70, -88, 140, 176);
    ctx.fillStyle = '#6b2025';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXPERIMENT', 0, -58);
    // Two faded portrait frames
    ctx.fillStyle = '#b49f7b';
    ctx.fillRect(-52, -40, 44, 54);
    ctx.fillRect(8, -40, 44, 54);
    ctx.fillStyle = '#574632';
    ctx.beginPath();
    ctx.arc(-30, -16, 12, 0, Math.PI * 2);
    ctx.arc(30, -16, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3f3425';
    ctx.fillRect(-48, 28, 96, 6);
    ctx.fillRect(-48, 44, 78, 6);
    ctx.fillRect(-48, 60, 88, 6);
    ctx.restore();

    // Stainless Steel Sink Basin (bottom left)
    ctx.fillStyle = '#7b8794';
    ctx.strokeStyle = '#323c47';
    ctx.lineWidth = 4;
    roundRectPath(ctx, 26, 468, 232, 92, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#52606d';
    ctx.fillRect(46, 560, 192, 160);
    ctx.strokeRect(46, 560, 192, 160);
    // Faucet
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(140, 470);
    ctx.lineTo(140, 422);
    ctx.arc(154, 422, 14, Math.PI, 0);
    ctx.stroke();

    // RGB Traffic-Light Status Panel (center-right)
    const tlx = 815, tly = 432;
    ctx.fillStyle = '#334155';
    roundRectPath(ctx, tlx, tly, 44, 124, 10);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.stroke();
    const lights = ['#ef4444', '#facc15', '#3b82f6'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = lights[i];
      ctx.beginPath();
      ctx.arc(tlx + 22, tly + 24 + i * 38, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Overhead Blue Mechanical Crane (top right — Step 5)
    if (!visuals.spineDropped || visuals.spineBoltedFrac < 1) {
      const craneY = visuals.spineDropped ? 120 : 82 + Math.sin(time * 2.4) * 6;
      ctx.save();
      ctx.translate(965, craneY);
      ctx.fillStyle = '#2563eb';
      ctx.strokeStyle = '#0f295c';
      ctx.lineWidth = 4;
      roundRectPath(ctx, -78, 0, 156, 52, 10);
      ctx.fill();
      ctx.stroke();
      // Mechanical jaws
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(-48, 52);
      ctx.lineTo(-76, 120);
      ctx.lineTo(-34, 155);
      ctx.moveTo(48, 52);
      ctx.lineTo(76, 120);
      ctx.lineTo(34, 155);
      ctx.stroke();
      // Scrap metal parts held in crane if not yet dropped
      if (!visuals.spineDropped) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(-30, 82, 60, 74);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 122, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Crimson Specimen Tank + Yellow GrabPack Hand Console (Step 6)
    const tx = 930, ty = 266;
    // Glass cylinder
    const tankGrad = ctx.createLinearGradient(tx, ty, tx + 170, ty);
    tankGrad.addColorStop(0, '#580d18');
    tankGrad.addColorStop(0.45, '#b81d33');
    tankGrad.addColorStop(1, '#470912');
    roundRectPath(ctx, tx, ty, 172, 212, 16);
    ctx.fillStyle = tankGrad;
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    ctx.stroke();
    // Rising bubbles
    ctx.fillStyle = 'rgba(255, 190, 200, 0.45)';
    for (let b = 0; b < 7; b++) {
      const bx = tx + 24 + (b * 23) % 124;
      const by = ty + 190 - ((time * 38 + b * 31) % 170);
      ctx.beginPath();
      ctx.arc(bx, by, 4 + (b % 3) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Pulsing organic/mechanical core inside tank
    if (!visuals.coreHarvested) {
      const pulse = 1 + Math.sin(time * 5) * 0.08;
      ctx.save();
      ctx.translate(tx + 86, ty + 114);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = '#ff6b4a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 42, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Yellow GrabPack Handprint Console below tank
    ctx.fillStyle = '#d4b83b';
    ctx.strokeStyle = '#5c4e12';
    ctx.lineWidth = 4;
    roundRectPath(ctx, tx - 10, ty + 212, 192, 138, 10);
    ctx.fill();
    ctx.stroke();
    // Green handprint scanner pad
    ctx.fillStyle = visuals.coreHarvested ? '#22c55e' : '#166534';
    ctx.beginPath();
    ctx.arc(tx + 86, ty + 282, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Simple glowing green hand icon
    ctx.fillStyle = '#bbf7d0';
    roundRectPath(ctx, tx + 72, ty + 274, 28, 28, 8);
    ctx.fill();
    for (let f = -1.5; f <= 1.5; f += 1) {
      roundRectPath(ctx, tx + 83 + f * 8, ty + 252, 6, 24, 3);
      ctx.fill();
    }

    // Blue Trophy Parts Locker (bottom-right, Step 7)
    if (visuals.lockerOpen || visuals.ribsLower) {
      const lx = 1098, ly = 445, lw = 158, lh = 260;
      ctx.fillStyle = '#1e3a5f';
      ctx.strokeStyle = '#0c1a2e';
      ctx.lineWidth = 4;
      ctx.fillRect(lx, ly, lw, lh);
      ctx.strokeRect(lx, ly, lw, lh);
      if (visuals.lockerOpen) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(lx + 12, ly + 14, lw - 24, lh - 28);
        if (!visuals.gotHuggy) {
          // Furry Blue Huggy Arm peeking out
          ctx.strokeStyle = '#1d4ed8';
          ctx.lineWidth = 28;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(lx + 118, ly + 62);
          ctx.lineTo(lx + 26, ly + 118);
          ctx.stroke();
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(lx + 18, ly + 122, 18, 0, Math.PI * 2);
          ctx.fill();
        }
        if (!visuals.gotMommy) {
          // Stretchy Pink Mommy Arm peeking out
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 16;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(lx + 124, ly + 150);
          ctx.lineTo(lx + 34, ly + 206);
          ctx.stroke();
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.arc(lx + 26, ly + 210, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Closed vented blue locker door
        ctx.fillStyle = '#2b558c';
        ctx.fillRect(lx + 6, ly + 6, lw - 12, lh - 12);
        ctx.fillStyle = '#122640';
        for (let v = 0; v < 6; v++) {
          ctx.fillRect(lx + 26, ly + 32 + v * 20, lw - 52, 8);
        }
      }
    }

    drawVignette(ctx, W, H, 0.44);
  }

  /* ==========================================================================
     ROOM 3: Iconic Steel Repair Cabinet (thumb_maxres.jpg! 4:10 - 6:20)
     ========================================================================== */
  function drawSteelCabinet(ctx, W, H, visuals, time) {
    // Dark industrial background
    ctx.fillStyle = '#181c22';
    ctx.fillRect(0, 0, W, H);

    // Closed Double Steel Doors (Step 8 substep 0!)
    if (!visuals.cabinetDoorsOpen) {
      ctx.fillStyle = '#090b0f';
      ctx.fillRect(0, 0, W, H);
      for (const side of [0, 1]) {
        const dx = 370 + side * 272;
        const g = ctx.createLinearGradient(dx, 40, dx + 268, 680);
        g.addColorStop(0, '#6e7682');
        g.addColorStop(0.5, '#525a66');
        g.addColorStop(1, '#3b424d');
        ctx.fillStyle = g;
        ctx.fillRect(dx, 32, 268, 656);
        ctx.strokeStyle = '#1f242b';
        ctx.lineWidth = 5;
        ctx.strokeRect(dx, 32, 268, 656);
        // Steel door handle
        const hx = side === 0 ? dx + 206 : dx + 42;
        ctx.fillStyle = '#1f242d';
        roundRectPath(ctx, hx, 300, 22, 118, 6);
        ctx.fill();
        ctx.fillStyle = '#9aa3b2';
        ctx.fillRect(hx + 6, 314, 10, 90);
      }
      drawVignette(ctx, W, H, 0.52);
      return;
    }

    // ---- LEFT STEEL DOOR PANEL (exact props from thumb_maxres.jpg!) ----
    const leftGrad = ctx.createLinearGradient(0, 0, 320, 0);
    leftGrad.addColorStop(0, '#5a606c');
    leftGrad.addColorStop(0.85, '#737a87');
    leftGrad.addColorStop(1, '#4b515c');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(8, 12, 312, 696);
    ctx.strokeStyle = '#252932';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 12, 312, 696);

    // Glowing Neon-Green Circuit Board (top-left!)
    const pcbGlow = ctx.createRadialGradient(112, 148, 20, 112, 148, 125);
    pcbGlow.addColorStop(0, 'rgba(34, 255, 138, 0.55)');
    pcbGlow.addColorStop(1, 'rgba(34, 255, 138, 0)');
    ctx.fillStyle = pcbGlow;
    ctx.fillRect(10, 30, 210, 230);
    // Power cord top
    ctx.strokeStyle = '#0f1318';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 26);
    ctx.quadraticCurveTo(112, -4, 112, 60);
    ctx.stroke();
    ctx.fillStyle = '#093524';
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 3;
    roundRectPath(ctx, 40, 68, 144, 170, 6);
    ctx.fill();
    ctx.stroke();
    // Circuit traces
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(52, 86 + i * 24);
      ctx.lineTo(100 + (i % 3) * 20, 86 + i * 24);
      ctx.lineTo(116 + (i % 2) * 35, 98 + i * 24);
      ctx.stroke();
    }
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(62, 120, 42, 34);
    ctx.fillRect(120, 160, 46, 28);

    // Scalpel + 2 Yellow-Handled Pry Tools
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.moveTo(212, 92);
    ctx.lineTo(222, 120);
    ctx.lineTo(220, 232);
    ctx.lineTo(208, 232);
    ctx.closePath();
    ctx.fill();
    for (const px of [252, 284]) {
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(px - 3, 56, 6, 130);
      ctx.fillStyle = '#ca9a24';
      roundRectPath(ctx, px - 8, 186, 16, 118, 5);
      ctx.fill();
      ctx.strokeStyle = '#5c440c';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Iconic Black Cassette Tape labeled "PROTOTYPE" in RED!
    if (!visuals.cassetteInserted) {
      ctx.save();
      roundRectPath(ctx, 36, 252, 162, 102, 8);
      ctx.fillStyle = '#181c22';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#2d333f';
      ctx.fillRect(48, 264, 138, 62);
      ctx.fillStyle = '#ef4444';
      ctx.font = '900 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PROTOTYPE', 117, 284);
      // Tape reels
      for (const rx of [85, 149]) {
        ctx.fillStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.arc(rx, 304, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#181c22';
        ctx.beginPath();
        ctx.arc(rx, 304, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Adjustable Wrench, Wooden Claw Hammer & Chrome Spray Nozzle (bottom-left)
    // Wrench
    ctx.fillStyle = '#9ca3af';
    ctx.strokeStyle = '#27303d';
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, 42, 390, 26, 105, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1f5e61';
    roundRectPath(ctx, 32, 492, 18, 148, 6);
    ctx.fill();
    roundRectPath(ctx, 64, 492, 18, 148, 6);
    ctx.fill();
    // Claw Hammer
    ctx.fillStyle = '#8b5a2b';
    roundRectPath(ctx, 136, 422, 28, 224, 8);
    ctx.fill();
    ctx.strokeStyle = '#472c12';
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    roundRectPath(ctx, 104, 384, 106, 44, 10);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    // Chrome Foam/Water Spray Nozzle
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    roundRectPath(ctx, 212, 412, 42, 155, 10);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(234, 414);
    ctx.lineTo(324, 336);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    // ---- CENTER WHITEBOARD BAY ----
    const bayGrad = ctx.createLinearGradient(340, 20, 940, 700);
    bayGrad.addColorStop(0, '#d9dce0');
    bayGrad.addColorStop(0.5, '#c5cad1');
    bayGrad.addColorStop(1, '#9ea5af');
    ctx.fillStyle = bayGrad;
    ctx.fillRect(340, 20, 600, 680);
    ctx.strokeStyle = '#383f4a';
    ctx.lineWidth = 8;
    ctx.strokeRect(340, 20, 600, 680);

    // Dual Braided Hanging Ropes
    for (const rx of [490, 756]) {
      ctx.strokeStyle = '#6e471b';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(rx, 20);
      ctx.lineTo(rx, 520);
      ctx.stroke();
      ctx.strokeStyle = '#b47a38';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(rx, 20);
      ctx.lineTo(rx, 520);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Taped Skull X-Ray Photo ("Oliver / EXP 1006" in top right corner of bay!)
    ctx.save();
    ctx.translate(862, 84);
    ctx.rotate(-0.08);
    ctx.fillStyle = '#090c10';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.fillRect(-46, -48, 92, 96);
    ctx.strokeRect(-46, -48, 92, 96);
    // White skull radiograph silhouette
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -8, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
    ctx.beginPath();
    ctx.arc(2, -10, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('OLIVER 1006', -36, -34);
    // Masking tape corners
    ctx.fillStyle = '#b69564';
    ctx.fillRect(-54, -44, 24, 12);
    ctx.fillRect(30, 32, 24, 12);
    ctx.restore();

    // Crimson Forge Blueprint Panel during Step 9 (Forge Claw Hands)
    if (!visuals.clawForged && visuals.torsoDocked) {
      ctx.save();
      const fx = 768, fy = 192, fw = 158, fh = 200;
      const fg = ctx.createLinearGradient(fx, fy, fx, fy + fh);
      fg.addColorStop(0, '#991b1b');
      fg.addColorStop(1, '#450a0a');
      ctx.fillStyle = fg;
      ctx.fillRect(fx, fy, fw, fh);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 4;
      ctx.strokeRect(fx, fy, fw, fh);
      // Blueprint claw lines
      ctx.strokeStyle = 'rgba(254, 202, 202, 0.85)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(fx + 50 + i * 16, fy + 145);
        ctx.lineTo(fx + 38 + i * 24, fy + 38);
        ctx.stroke();
      }
      // Glowing embers box below
      const flicker = 0.7 + 0.3 * Math.sin(time * 12);
      ctx.fillStyle = `rgba(251, 146, 60, ${flicker})`;
      ctx.fillRect(fx + 14, fy + 162, fw - 28, 26);
      ctx.restore();
    }

    // ---- RIGHT STEEL DOOR PANEL (Hacksaw, Mommy Pink Arm, Huggy Blue Arm!) ----
    const rightGrad = ctx.createLinearGradient(960, 0, 1272, 0);
    rightGrad.addColorStop(0, '#4b515c');
    rightGrad.addColorStop(0.15, '#737a87');
    rightGrad.addColorStop(1, '#5a606c');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(960, 12, 312, 696);
    ctx.strokeStyle = '#252932';
    ctx.lineWidth = 6;
    ctx.strokeRect(960, 12, 312, 696);

    // Chrome Hinges on both inner edges
    for (const hx of [302, 922]) {
      for (const hy of [44, 580]) {
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        roundRectPath(ctx, hx, hy, 56, 86, 4);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(hx + 28, hy);
        ctx.lineTo(hx + 28, hy + 86);
        ctx.stroke();
      }
    }

    // Hacksaw
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(1044, 134);
    ctx.lineTo(988, 134);
    ctx.lineTo(988, 344);
    ctx.lineTo(1044, 344);
    ctx.stroke();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(1044, 134);
    ctx.lineTo(1044, 344);
    ctx.stroke();
    ctx.fillStyle = '#9c6c34';
    roundRectPath(ctx, 1030, 346, 28, 118, 10);
    ctx.fill();

    // Mommy Long Legs Pink Stretchy Arm strapped on right panel
    if (!visuals.mommyGrafted) {
      ctx.save();
      ctx.fillStyle = '#d9467a';
      ctx.strokeStyle = '#701a38';
      ctx.lineWidth = 3;
      roundRectPath(ctx, 1094, 48, 28, 492, 14);
      ctx.fill();
      ctx.stroke();
      // Cyan cuff
      ctx.fillStyle = '#38bdf8';
      roundRectPath(ctx, 1084, 526, 48, 18, 8);
      ctx.fill();
      // Red pink hand fingers
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.ellipse(1108, 578, 34, 44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Black retaining straps (remain bolted to cabinet door even after arm grafted)
    ctx.fillStyle = '#272c36';
    ctx.fillRect(1040, 82, 104, 24);
    ctx.fillRect(1040, 488, 104, 24);

    // Huggy Wuggy Furry Blue Arm strapped on far right panel
    if (!visuals.huggyGrafted) {
      ctx.save();
      const blueGrad = ctx.createLinearGradient(1152, 0, 1252, 0);
      blueGrad.addColorStop(0, '#1e3a8a');
      blueGrad.addColorStop(0.5, '#2563eb');
      blueGrad.addColorStop(1, '#172554');
      ctx.fillStyle = blueGrad;
      roundRectPath(ctx, 1158, 52, 92, 512, 44);
      ctx.fill();
      ctx.strokeStyle = '#0f1d45';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Yellow Huggy Hand
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#713f12';
      roundRectPath(ctx, 1162, 548, 84, 92, 24);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    // Steel strap for Huggy bay
    ctx.fillStyle = '#272c36';
    ctx.fillRect(1144, 272, 118, 42);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(1144, 272, 118, 42);

    drawVignette(ctx, W, H, 0.36);
  }

  /* ==========================================================================
     ROOM 4: Abandoned Playcare Workshop (CatNap Steps 13-15 & 24)
     ========================================================================== */
  function drawPlaycareRoom(ctx, W, H, visuals, time) {
    // Dark brown aged workshop walls
    const wallGrad = ctx.createLinearGradient(0, 0, 0, H);
    wallGrad.addColorStop(0, '#3e3226');
    wallGrad.addColorStop(0.7, '#4c3e2f');
    wallGrad.addColorStop(1, '#2b231b');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, H);

    // Colorful Playcare Patchwork Floor Mat
    const matColors = ['#b93b3b', '#3b7bb9', '#4c9458', '#d4a63b', '#6d4c94'];
    const matY = 556;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = matColors[i % matColors.length];
      ctx.fillRect(i * 130, matY, 132, 164);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(i * 130, matY, 132, 164);
    }

    // Taped Wall Sketches ("NIGHTMARE" & Child Subject Poster)
    ctx.save();
    ctx.fillStyle = '#d6cfc2';
    ctx.strokeStyle = '#5c5346';
    ctx.lineWidth = 2;
    ctx.fillRect(320, 124, 114, 148);
    ctx.strokeRect(320, 124, 114, 148);
    ctx.fillStyle = '#1f1b16';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('NIGHTMARE', 340, 256);
    // Spidery CatNap scribble sketch
    ctx.strokeStyle = '#26211c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(377, 178, 24, 0, Math.PI * 2);
    ctx.moveTo(354, 198);
    ctx.lineTo(334, 232);
    ctx.moveTo(400, 198);
    ctx.lineTo(420, 232);
    ctx.stroke();

    // Right wall poster
    ctx.fillStyle = '#d9cfb8';
    ctx.fillRect(928, 86, 136, 176);
    ctx.strokeRect(928, 86, 136, 176);
    ctx.fillStyle = '#8b7e66';
    ctx.fillRect(954, 112, 84, 96);
    ctx.fillStyle = '#473c2e';
    ctx.beginPath();
    ctx.arc(996, 152, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Left Cardboard Box of Toy Scraps
    ctx.fillStyle = '#9c784c';
    ctx.strokeStyle = '#4a361d';
    ctx.lineWidth = 4;
    ctx.fillRect(72, 476, 212, 160);
    ctx.strokeRect(72, 476, 212, 160);
    ctx.fillStyle = '#b48d5d';
    ctx.beginPath();
    ctx.moveTo(72, 476);
    ctx.lineTo(44, 442);
    ctx.lineTo(176, 442);
    ctx.lineTo(188, 476);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Red scrap handle sticking out
    ctx.fillStyle = '#b91c1c';
    ctx.save();
    ctx.translate(215, 456);
    ctx.rotate(0.45);
    ctx.fillRect(-14, -74, 28, 86);
    ctx.restore();

    // Right Blue-Cloth Side Table
    ctx.fillStyle = '#4d6f80';
    ctx.strokeStyle = '#243740';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(860, 448);
    ctx.lineTo(1180, 448);
    ctx.lineTo(1210, 560);
    ctx.lineTo(840, 560);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Overhead Cord + Screw-In Lightbulb!
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(640, 0);
    ctx.lineTo(640, 88);
    ctx.stroke();
    ctx.fillStyle = '#52525b';
    ctx.fillRect(624, 84, 32, 24);

    const bulbOn = visuals.finaleActive && visuals.spookyFinale ? 0.08 : visuals.bulbBrightness;
    // Warm radial bulb glow
    if (bulbOn > 0.2) {
      const glow = ctx.createRadialGradient(640, 128, 12, 640, 260, 620);
      glow.addColorStop(0, `rgba(255, 240, 180, ${bulbOn * 0.45})`);
      glow.addColorStop(0.5, `rgba(255, 210, 130, ${bulbOn * 0.16})`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.fillStyle = bulbOn > 0.4 ? '#fef08a' : '#71717a';
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(640, 128, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Darkness veil when lightbulb isn't screwed in yet (or spooky finale blackout!)
    const darkness = 1 - bulbOn;
    if (darkness > 0.05) {
      ctx.fillStyle = `rgba(6, 5, 9, ${Math.min(0.88, darkness * 0.88)})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Step 13 Substep 0: Aged "REPORT" Clipboard held up!
    if (!visuals.reportChecked) {
      ctx.save();
      ctx.translate(640, 360 + Math.sin(time * 2) * 5);
      // Clipboard wood
      roundRectPath(ctx, -155, -210, 310, 420, 16);
      ctx.fillStyle = '#5c4632';
      ctx.fill();
      ctx.strokeStyle = '#2b1e12';
      ctx.lineWidth = 5;
      ctx.stroke();
      // Paper sheet
      ctx.fillStyle = '#d9ccb2';
      ctx.fillRect(-132, -178, 264, 362);
      // Metal clip
      ctx.fillStyle = '#94a3b8';
      roundRectPath(ctx, -56, -222, 112, 36, 8);
      ctx.fill();
      ctx.fillStyle = '#29221a';
      ctx.font = '900 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('REPORT', 0, -130);
      // Two faded photos
      ctx.fillStyle = '#a89678';
      ctx.fillRect(-102, -104, 88, 108);
      ctx.fillRect(14, -104, 88, 108);
      ctx.fillStyle = '#524231';
      ctx.beginPath();
      ctx.arc(-58, -60, 22, 0, Math.PI * 2);
      ctx.arc(58, -60, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 14px monospace';
      ctx.fillText('SUBJECT #1188 · CATNAP', 0, 38);
      ctx.fillStyle = '#574a38';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-98, 60 + i * 24, 196 - (i % 2) * 32, 8);
      }
      ctx.restore();
    }

    drawVignette(ctx, W, H, 0.42);
  }

  /* ==========================================================================
     ROOM 5: Playtime Co. Laundry Room (SMILE BAM Washer, 8:40 - 9:35)
     ========================================================================== */
  function drawLaundryRoom(ctx, W, H, visuals, time) {
    // Grimy concrete back wall
    ctx.fillStyle = '#3b3a3d';
    ctx.fillRect(0, 0, W, H);
    drawTileGrid(ctx, W, H, 48, 48, '#46454a', '#2d2c30', 0.35);

    // Colorful Playtime Co. Patchwork Tile Side Pillars
    const tileCols = ['#dc2626', '#2563eb', '#eab308', '#f8fafc', '#16a34a'];
    for (const px of [0, W - 156]) {
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.fillStyle = tileCols[(r * 2 + c + (px > 0 ? 2 : 0)) % tileCols.length];
          ctx.fillRect(px + c * 78, r * 72, 76, 70);
          ctx.strokeStyle = '#1f2937';
          ctx.lineWidth = 3;
          ctx.strokeRect(px + c * 78, r * 72, 76, 70);
        }
      }
    }

    // Overhead Rust-Red Pipes
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(156, 36, W - 312, 24);
    ctx.fillRect(250, 0, 22, 165);
    ctx.fillRect(1008, 0, 22, 165);

    // Floor
    ctx.fillStyle = '#29292e';
    ctx.fillRect(156, 616, W - 312, 104);

    // Vintage Cream "SMILE BAM" Front-Loading Washing Machine (Center!)
    const wx = 448, wy = 114, ww = 384, wh = 510;
    const wGrad = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh);
    wGrad.addColorStop(0, '#e9e2d2');
    wGrad.addColorStop(1, '#c4ba9e');
    roundRectPath(ctx, wx, wy, ww, wh, 16);
    ctx.fillStyle = wGrad;
    ctx.fill();
    ctx.strokeStyle = '#5c5344';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Control panel top
    ctx.fillStyle = '#d4cab4';
    ctx.fillRect(wx + 8, wy + 8, ww - 16, 78);
    ctx.strokeStyle = '#6b6151';
    ctx.strokeRect(wx + 8, wy + 8, ww - 16, 78);
    // Brand stamp "SMILE BAM"
    ctx.fillStyle = '#3f382e';
    ctx.font = '900 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SMILE BAM', wx + ww / 2, wy + 124);
    // Dials
    for (const dx of [wx + 66, wx + 292, wx + 340]) {
      ctx.fillStyle = '#4b453c';
      ctx.beginPath();
      ctx.arc(dx, wy + 46, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(dx, wy + 46, 11, 0, Math.PI * 2);
      ctx.fill();
    }

    // Round Washing Drum Porthole
    const cx = wx + ww / 2, cy = wy + 290, dr = 132;
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(cx, cy, dr + 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, dr, 0, Math.PI * 2);
    ctx.clip();
    // Dark stainless steel drum interior
    ctx.fillStyle = '#1b2029';
    ctx.fillRect(cx - dr, cy - dr, dr * 2, dr * 2);

    // If CatNap is inside the washer!
    if (visuals.inWasher) {
      // Water & blue detergent level
      if (visuals.detergentPoured || visuals.washSpinFrac > 0) {
        const waveY = cy + 25 - visuals.washSpinFrac * 35;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.beginPath();
        ctx.moveTo(cx - dr, cy + dr);
        for (let x = cx - dr; x <= cx + dr; x += 14) {
          ctx.lineTo(x, waveY + Math.sin(x * 0.08 + time * 10) * 10);
        }
        ctx.lineTo(cx + dr, cy + dr);
        ctx.closePath();
        ctx.fill();
      }

      // Draw mini spinning CatNap inside drum!
      if (root.ASMRCatNap && root.ASMRCatNap.drawMiniCatNap) {
        ctx.save();
        ctx.translate(cx, cy + 8);
        const spinAngle = visuals.washSpinFrac > 0 ? time * 7.5 : 0;
        ctx.rotate(spinAngle);
        root.ASMRCatNap.drawMiniCatNap(ctx, 0, 0, 0.42, visuals.dirtAlpha);
        ctx.restore();
      }

      // Tumbling soapy white bubbles!
      if (visuals.washSpinFrac > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        for (let b = 0; b < 18; b++) {
          const ang = time * 4.5 + b * 0.85;
          const rad = 28 + (b * 17) % 88;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 8 + (b % 4) * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Glass door reflection sheen
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.ellipse(cx - 42, cy - 42, 54, 24, -0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Left: Blue Liquid Detergent Jug
    ctx.save();
    ctx.translate(292, 520);
    roundRectPath(ctx, -56, -78, 112, 152, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 4;
    ctx.stroke();
    // Cap
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-18, -104, 36, 26);
    // Label
    ctx.fillStyle = '#e0f2fe';
    roundRectPath(ctx, -38, -28, 76, 66, 10);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SOAP', 0, 10);
    ctx.restore();

    // Right: Wooden "Dolls" Crate
    ctx.save();
    ctx.translate(972, 534);
    ctx.fillStyle = '#7c4a24';
    ctx.strokeStyle = '#3b210d';
    ctx.lineWidth = 4;
    ctx.fillRect(-108, -68, 216, 136);
    ctx.strokeRect(-108, -68, 216, 136);
    // Stuffed plush tufts peeking out top
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(-40, -76, 30, Math.PI, 0);
    ctx.arc(28, -74, 36, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#3b1e0a';
    ctx.font = '900 40px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Dolls', 0, 14);
    ctx.restore();

    drawVignette(ctx, W, H, 0.35);
  }

  /* ==========================================================================
     ROOM 6: Wooden Tailor's Workbench (CatNap Steps 18-23)
     ========================================================================== */
  function drawTailorBench(ctx, W, H, visuals, time, isCloseup) {
    // Rich dark mahogany wood cabinet backing
    ctx.fillStyle = '#2d1c12';
    ctx.fillRect(0, 0, W, H);

    // Center Velvet/Dark Timber Tailoring Bay
    const bayX = isCloseup ? 220 : 340;
    const bayW = isCloseup ? 840 : 600;
    const bayGrad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 460);
    bayGrad.addColorStop(0, '#5a3c28');
    bayGrad.addColorStop(1, '#2b1b11');
    ctx.fillStyle = bayGrad;
    ctx.fillRect(bayX, 18, bayW, 684);
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 8;
    ctx.strokeRect(bayX, 18, bayW, 684);

    if (isCloseup) {
      drawVignette(ctx, W, H, 0.38);
      return;
    }

    // ---- LEFT WOODEN COMPARTMENT ----
    ctx.fillStyle = '#473020';
    ctx.fillRect(14, 18, 310, 684);
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 18, 310, 684);

    // Hand-saw on far left
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(36, 98, 22, 450);
    ctx.fillStyle = '#b47a38';
    roundRectPath(ctx, 28, 540, 38, 122, 10);
    ctx.fill();

    // Red Thread Jar (top)
    ctx.fillStyle = 'rgba(226, 232, 240, 0.25)';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    roundRectPath(ctx, 96, 52, 186, 152, 12);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(132, 104);
    ctx.bezierCurveTo(180, 74, 240, 140, 150, 168);
    ctx.bezierCurveTo(120, 180, 230, 190, 250, 146);
    ctx.stroke();

    // "CATNAP" Box Label
    ctx.fillStyle = '#c8b28e';
    ctx.fillRect(98, 228, 184, 72);
    ctx.strokeStyle = '#5c462b';
    ctx.strokeRect(98, 228, 184, 72);
    ctx.fillStyle = '#3b2514';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CATNAP', 190, 272);

    // Silver Pliers & Tailor Scissors hanging bottom-left
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(138, 410);
    ctx.lineTo(156, 610);
    ctx.moveTo(164, 410);
    ctx.lineTo(146, 610);
    ctx.stroke();
    // Tailor Scissors
    ctx.beginPath();
    ctx.moveTo(234, 396);
    ctx.lineTo(256, 590);
    ctx.moveTo(260, 396);
    ctx.lineTo(238, 590);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(232, 608, 22, 0, Math.PI * 2);
    ctx.arc(266, 608, 22, 0, Math.PI * 2);
    ctx.stroke();

    // ---- RIGHT WOODEN COMPARTMENT ----
    ctx.fillStyle = '#473020';
    ctx.fillRect(956, 18, 310, 684);
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 6;
    ctx.strokeRect(956, 18, 310, 684);

    // Purple Thread Spool (top)
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(988, 48, 86, 18);
    ctx.fillRect(988, 152, 86, 18);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(1000, 66, 62, 86);

    // Colored Fabric Swatch Rack (Yellow, Blue, Purple!)
    ctx.fillStyle = '#facc15';
    ctx.fillRect(1110, 52, 46, 128);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(1158, 52, 46, 128);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(1206, 52, 42, 128);
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 2;
    ctx.strokeRect(1110, 52, 138, 128);

    // White Bag of Fluffy Cotton Stuffing (Smiling Critter Icon!)
    roundRectPath(ctx, 982, 224, 146, 198, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(1002, 256, 106, 118);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(1055, 314, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(1045, 308, 4, 0, Math.PI * 2);
    ctx.arc(1065, 308, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1055, 318, 12, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Wooden Oval Hairbrush
    ctx.fillStyle = '#a87952';
    ctx.strokeStyle = '#5c3c22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(1196, 286, 44, 74, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    roundRectPath(ctx, 1180, 356, 32, 108, 12);
    ctx.fill();
    ctx.stroke();

    // Silver Airbrush Gun + Purple Dye Bottle (bottom right)
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.fillRect(988, 522, 232, 20);
    ctx.strokeRect(988, 522, 232, 20);
    // Purple dye cup
    ctx.fillStyle = '#9333ea';
    roundRectPath(ctx, 1086, 476, 34, 46, 6);
    ctx.fill();
    ctx.stroke();

    // Step 20: Unrolled CATNAP Purple Plush Cloth Sheet with Dashed Patch Outlines!
    if (visuals.purpleClothSelected && visuals.patchesSewnFrac < 1) {
      ctx.save();
      const sx = 752, sy = 210, sw = 246, sh = 310;
      ctx.fillStyle = '#8b46b5';
      ctx.strokeStyle = '#4c1d6e';
      ctx.lineWidth = 4;
      roundRectPath(ctx, sx, sy, sw, sh, 8);
      ctx.fill();
      ctx.stroke();
      // White header strip labeled "CATNAP"
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(sx + 6, sy + 6, sw - 12, 52);
      ctx.fillStyle = '#581c87';
      ctx.font = '900 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CATNAP', sx + sw / 2, sy + 44);
      // Cutout patch shapes (solid dashed before cutting, hollow white after cutting!)
      const cutDone = visuals.patchesCutFrac >= 0.99;
      ctx.setLineDash(cutDone ? [] : [8, 6]);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.fillStyle = cutDone ? '#f1f5f9' : 'rgba(126, 34, 206, 0.35)';
      // Ear triangle patch
      ctx.beginPath();
      ctx.moveTo(sx + 62, sy + 102);
      ctx.lineTo(sx + 104, sy + 188);
      ctx.lineTo(sx + 30, sy + 188);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Torso oval patch
      ctx.beginPath();
      ctx.ellipse(sx + 168, sy + 200, 48, 72, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Wrong swatch gag visual flash (Yellow / Blue cloth held up with big red X!)
    if (visuals.wrongSwatchFlash) {
      ctx.save();
      ctx.translate(640, 445);
      ctx.rotate(Math.sin(time * 28) * 0.14);
      ctx.fillStyle = visuals.wrongSwatchFlash === 'yellow' ? '#facc15' : '#3b82f6';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5;
      roundRectPath(ctx, -74, -84, 148, 168, 10);
      ctx.fill();
      ctx.stroke();
      // Big red X
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-48, -48);
      ctx.lineTo(48, 48);
      ctx.moveTo(48, -48);
      ctx.lineTo(-48, 48);
      ctx.stroke();
      ctx.restore();
    }

    drawVignette(ctx, W, H, 0.34);
  }

  function drawRoom(ctx, W, H, roomId, visuals, time) {
    switch (roomId) {
      case 'lab_desk':
        drawLabDesk(ctx, W, H, visuals, time, false);
        break;
      case 'lab_desk_crt':
        drawLabDesk(ctx, W, H, visuals, time, true);
        break;
      case 'green_chamber':
        drawGreenChamber(ctx, W, H, visuals, time);
        break;
      case 'steel_cabinet':
        drawSteelCabinet(ctx, W, H, visuals, time);
        break;
      case 'playcare_room':
        drawPlaycareRoom(ctx, W, H, visuals, time);
        break;
      case 'laundry_room':
        drawLaundryRoom(ctx, W, H, visuals, time);
        break;
      case 'tailor_bench':
        drawTailorBench(ctx, W, H, visuals, time, false);
        break;
      case 'tailor_bench_closeup':
        drawTailorBench(ctx, W, H, visuals, time, true);
        break;
      default:
        ctx.fillStyle = '#11151d';
        ctx.fillRect(0, 0, W, H);
    }
  }

  const EXPORT = { drawRoom };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRRooms = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
