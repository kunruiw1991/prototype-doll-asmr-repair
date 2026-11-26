/* ============================================================================
   js/art_rooms.js — Painterly Studio Background Plates + Live Interactive Props
   Composites high-detail SmileBam-style plates with animated interactive layers
   ============================================================================ */
(function (root) {
  'use strict';

  function getImg(key) {
    return root.ASMRAssets ? root.ASMRAssets.get(key) : null;
  }

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
    const g = ctx.createRadialGradient(W * 0.5, H * 0.48, H * 0.28, W * 0.5, H * 0.5, W * 0.68);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ==========================================================================
     ROOM 1: White-Tile Lab Desk (Steps 1-4 & Prototype Finale)
     ========================================================================== */
  function drawLabDesk(ctx, W, H, visuals, time, isCRTCloseup) {
    // Full cinematic red-alert Prototype finale plate!
    if (visuals.finaleActive && visuals.spookyFinale) {
      const fin = getImg('scene_proto_finale');
      if (fin) {
        const z = 1.03 + Math.sin(time * 2.2) * 0.025;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(z, z);
        ctx.drawImage(fin, -W / 2, -H / 2, W, H);
        ctx.restore();
        // Pulsing red alert wash
        const pulse = 0.14 + 0.12 * Math.sin(time * 6.5);
        ctx.fillStyle = `rgba(220, 20, 35, ${pulse})`;
        ctx.fillRect(0, 0, W, H);
        return;
      }
    }

    if (isCRTCloseup) {
      drawCRTCloseup(ctx, W, H, visuals, time);
      return;
    }

    const bg = getImg('room_lab_desk');
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#bcc4cc';
      ctx.fillRect(0, 0, W, H);
    }

    // Interactive Open Lab Fridge Overlay (right mustard fridge x: 960..1215, y: 150..625)
    if (visuals.fridgeOpen) {
      ctx.save();
      ctx.fillStyle = '#18201b';
      ctx.strokeStyle = '#5c4d24';
      ctx.lineWidth = 4;
      ctx.fillRect(985, 170, 212, 435);
      ctx.strokeRect(985, 170, 212, 435);
      // Shelves inside fridge
      ctx.fillStyle = '#4c4634';
      ctx.fillRect(990, 345, 202, 10);
      ctx.fillRect(990, 470, 202, 10);

      // Glowing green fresh brain vat inside top shelf!
      if (!visuals.newBrainImplanted) {
        const bx = 1090, by = 258;
        const glow = ctx.createRadialGradient(bx, by, 10, bx, by, 95);
        glow.addColorStop(0, 'rgba(74, 255, 120, 0.85)');
        glow.addColorStop(1, 'rgba(74, 255, 120, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(bx, by, 95, 0, Math.PI * 2);
        ctx.fill();

        roundRectPath(ctx, bx - 52, by - 60, 104, 122, 14);
        ctx.fillStyle = 'rgba(110, 255, 140, 0.28)';
        ctx.fill();
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 3;
        ctx.stroke();

        const brainImg = getImg('prop_brain');
        const pulse = Math.sin(time * 4) * 3;
        if (brainImg) {
          ctx.save();
          ctx.filter = 'hue-rotate(95deg) saturate(1.8) brightness(1.15)';
          ctx.drawImage(brainImg, bx - 38, by - 36 + pulse, 76, 84);
          ctx.restore();
        }
        ctx.fillStyle = '#334155';
        ctx.fillRect(bx - 56, by - 68, 112, 14);
      }

      // Open door sliver on far right
      ctx.fillStyle = '#9c863c';
      ctx.fillRect(1198, 165, 36, 448);
      ctx.strokeStyle = '#4a3d16';
      ctx.strokeRect(1198, 165, 36, 448);
      ctx.restore();
    }

    // Metal Bucket on floor when scooping old dried brain
    if (visuals.fridgeOpen && !visuals.newBrainImplanted) {
      ctx.save();
      const bGrad = ctx.createLinearGradient(580, 565, 700, 565);
      bGrad.addColorStop(0, '#475569');
      bGrad.addColorStop(0.5, '#94a3b8');
      bGrad.addColorStop(1, '#334155');
      ctx.fillStyle = bGrad;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(582, 575);
      ctx.lineTo(698, 575);
      ctx.lineTo(682, 692);
      ctx.lineTo(598, 692);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      if (visuals.oldBrainRemoved) {
        ctx.fillStyle = '#9c7834';
        ctx.beginPath();
        ctx.ellipse(640, 578, 34, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Wheelchair behind Prototype (Steps 1–4)
    if (visuals.inWheelchair) {
      drawWheelchair(ctx, 640, 515);
    }

    drawVignette(ctx, W, H, 0.28);
  }

  function drawWheelchair(ctx, cx, cy) {
    ctx.save();
    ctx.fillStyle = '#1f242c';
    ctx.strokeStyle = '#090b0f';
    ctx.lineWidth = 4;
    roundRectPath(ctx, cx - 135, cy - 175, 270, 210, 16);
    ctx.fill();
    ctx.stroke();
    for (const dir of [-1, 1]) {
      const wx = cx + dir * 155;
      ctx.strokeStyle = '#11151c';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.ellipse(wx, cy + 52, 22, 126, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(wx, cy + 52, 14, 102, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCRTCloseup(ctx, W, H, visuals, time) {
    const bg = getImg('room_crt_closeup');
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#bcc4cc';
      ctx.fillRect(0, 0, W, H);
    }

    // Live Glowing Green Dual-Hemisphere Brainwave Monitor inside the CRT screen quad!
    const sync = visuals.crtSyncFrac;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(408, 206);
    ctx.lineTo(616, 216);
    ctx.lineTo(614, 434);
    ctx.lineTo(410, 444);
    ctx.closePath();
    ctx.clip();

    // Phosphor CRT green glow
    const bgGlow = ctx.createRadialGradient(512, 325, 16, 512, 325, 145);
    bgGlow.addColorStop(0, `rgba(18, 92, 52, ${0.55 + sync * 0.35})`);
    bgGlow.addColorStop(1, 'rgba(6, 28, 16, 0.9)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(400, 200, 225, 250);

    // Scanlines
    ctx.fillStyle = 'rgba(74, 255, 140, 0.08)';
    for (let y = 205; y < 445; y += 5) {
      ctx.fillRect(405, y, 215, 2);
    }

    // Dual wireframe brain hemispheres
    for (const bx of [462, 562]) {
      const by = 324;
      const g = ctx.createRadialGradient(bx, by, 4, bx, by, 42);
      g.addColorStop(0, `rgba(74, 255, 130, ${0.45 + sync * 0.4})`);
      g.addColorStop(1, 'rgba(74, 255, 130, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(bx, by, 30, 26, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // EEG Waveform
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 420; x <= 604; x += 5) {
      const y = 324 + Math.sin(x * (0.09 + sync * 0.05) + time * 12) * (10 + sync * 12);
      if (x === 420) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`NEURAL SYNC ${Math.round(sync * 100)}%`, 434, 254);
    ctx.fillStyle = '#0e3b20';
    ctx.fillRect(430, 392, 164, 14);
    ctx.fillStyle = '#34ff8a';
    ctx.fillRect(430, 392, 164 * sync, 14);
    ctx.restore();

    // Animated Teal Rubber Gloves hovering over the painterly keyboard!
    const activeBounce = sync > 0 && sync < 1 ? 11 : 3;
    const bounceL = Math.sin(time * 16) * activeBounce;
    const bounceR = Math.cos(time * 16) * activeBounce;
    for (const h of [{ x: 515, y: 615 + bounceL }, { x: 675, y: 585 + bounceR }]) {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(-0.18);
      const gl = ctx.createLinearGradient(-45, -55, 45, 55);
      gl.addColorStop(0, '#2dd4bf');
      gl.addColorStop(1, '#0f766e');
      ctx.fillStyle = gl;
      ctx.strokeStyle = '#042f2e';
      ctx.lineWidth = 3.5;
      roundRectPath(ctx, -46, -30, 92, 86, 26);
      ctx.fill();
      ctx.stroke();
      for (let f = -2; f <= 2; f++) {
        roundRectPath(ctx, f * 17 - 8, -66 + Math.abs(f) * 5, 15, 44, 7);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    drawVignette(ctx, W, H, 0.25);
  }

  /* ==========================================================================
     ROOM 2: Green-Tiled Experiment Chamber (Steps 5-7)
     ========================================================================== */
  function drawGreenChamber(ctx, W, H, visuals, time) {
    const bg = getImg('room_green_chamber');
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#2d4735';
      ctx.fillRect(0, 0, W, H);
    }

    // Pulsing glowing organic core inside the crimson tank (before harvested!)
    if (!visuals.coreHarvested) {
      const tx = 1125, ty = 355;
      const pulse = 1 + Math.sin(time * 5) * 0.08;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.scale(pulse, pulse);
      const g = ctx.createRadialGradient(0, 0, 6, 0, 0, 58);
      g.addColorStop(0, 'rgba(255, 190, 90, 0.9)');
      g.addColorStop(0.5, 'rgba(255, 60, 70, 0.5)');
      g.addColorStop(1, 'rgba(255, 60, 70, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 58, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Overhead Blue Crane lowering mechanical parts (Step 5)
    if (!visuals.spineDropped || visuals.spineBoltedFrac < 1) {
      const cy = visuals.spineDropped ? 115 : 86 + Math.sin(time * 2.4) * 6;
      ctx.save();
      ctx.translate(925, cy);
      ctx.fillStyle = '#1d4ed8';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      roundRectPath(ctx, -64, 0, 128, 42, 10);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(-42, 42);
      ctx.lineTo(-68, 106);
      ctx.lineTo(-28, 138);
      ctx.moveTo(42, 42);
      ctx.lineTo(68, 106);
      ctx.lineTo(28, 138);
      ctx.stroke();
      ctx.restore();
    }

    // Blue Trophy Locker on right during Step 7 (holding real painterly Huggy & Mommy arms!)
    if (visuals.lockerOpen || visuals.ribsLower) {
      const lx = 1020, ly = 415, lw = 218, lh = 282;
      ctx.save();
      ctx.fillStyle = '#172d4d';
      ctx.strokeStyle = '#0a1628';
      ctx.lineWidth = 4;
      ctx.fillRect(lx, ly, lw, lh);
      ctx.strokeRect(lx, ly, lw, lh);
      if (visuals.lockerOpen) {
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(lx + 12, ly + 12, lw - 24, lh - 24);
        const huggyImg = getImg('prop_huggy_arm');
        const mommyImg = getImg('prop_mommy_arm');
        if (!visuals.gotHuggy && huggyImg) {
          ctx.drawImage(huggyImg, lx + 28, ly + 22, 62, 240);
        }
        if (!visuals.gotMommy && mommyImg) {
          ctx.drawImage(mommyImg, lx + 122, ly + 22, 62, 240);
        }
      } else {
        ctx.fillStyle = '#234a7d';
        ctx.fillRect(lx + 8, ly + 8, lw - 16, lh - 16);
        ctx.fillStyle = '#0e1e36';
        for (let i = 0; i < 6; i++) {
          ctx.fillRect(lx + 30, ly + 36 + i * 22, lw - 60, 8);
        }
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(lx + 24, ly + 190, 14, 52);
      }
      ctx.restore();
    }

    drawVignette(ctx, W, H, 0.25);
  }

  /* ==========================================================================
     ROOM 3: Iconic Steel Repair Cabinet (thumb_maxres.jpg! Steps 8-12)
     ========================================================================== */
  function drawSteelCabinet(ctx, W, H, visuals, time) {
    // Closed Double Steel Doors before Step 8 substep 1
    if (!visuals.cabinetDoorsOpen) {
      ctx.fillStyle = '#090b0f';
      ctx.fillRect(0, 0, W, H);
      for (const side of [0, 1]) {
        const dx = 340 + side * 302;
        const g = ctx.createLinearGradient(dx, 24, dx + 298, 696);
        g.addColorStop(0, '#6e7682');
        g.addColorStop(0.5, '#4c5460');
        g.addColorStop(1, '#313742');
        ctx.fillStyle = g;
        ctx.fillRect(dx, 24, 298, 672);
        ctx.strokeStyle = '#181c24';
        ctx.lineWidth = 5;
        ctx.strokeRect(dx, 24, 298, 672);
        const hx = side === 0 ? dx + 236 : dx + 42;
        ctx.fillStyle = '#1b2029';
        roundRectPath(ctx, hx, 290, 22, 134, 6);
        ctx.fill();
        ctx.fillStyle = '#a3adb9';
        ctx.fillRect(hx + 6, 306, 10, 102);
      }
      drawVignette(ctx, W, H, 0.45);
      return;
    }

    const bg = getImg('room_steel_cabinet');
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#333a44';
      ctx.fillRect(0, 0, W, H);
    }

    // Cover PROTOTYPE cassette slot once inserted in Step 12
    if (visuals.cassetteInserted) {
      ctx.fillStyle = '#484f5a';
      ctx.fillRect(32, 248, 174, 114);
      ctx.strokeStyle = '#252a33';
      ctx.lineWidth = 2;
      ctx.strokeRect(32, 248, 174, 114);
    }

    // Strap real painterly Mommy Pink Arm & Huggy Blue Arm onto right steel door!
    const mommyImg = getImg('prop_mommy_arm');
    const huggyImg = getImg('prop_huggy_arm');
    if (!visuals.mommyGrafted && mommyImg) {
      ctx.drawImage(mommyImg, 1046, 56, 86, 595);
    }
    if (!visuals.huggyGrafted && huggyImg) {
      ctx.drawImage(huggyImg, 1150, 56, 108, 595);
    }
    // Redraw front steel straps cleanly over the hanging arms
    ctx.fillStyle = '#232830';
    ctx.fillRect(1022, 84, 118, 26);
    ctx.fillRect(1134, 268, 132, 42);
    ctx.fillRect(1022, 488, 118, 24);

    // Crimson Forge Blueprint Panel during Step 9 (before claw forged!)
    if (!visuals.clawForged && visuals.torsoDocked) {
      ctx.save();
      const fx = 768, fy = 178, fw = 152, fh = 205;
      const fg = ctx.createLinearGradient(fx, fy, fx, fy + fh);
      fg.addColorStop(0, '#991b1b');
      fg.addColorStop(1, '#450a0a');
      ctx.fillStyle = fg;
      ctx.fillRect(fx, fy, fw, fh);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 4;
      ctx.strokeRect(fx, fy, fw, fh);
      ctx.strokeStyle = 'rgba(254, 202, 202, 0.9)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(fx + 44 + i * 16, fy + 150);
        ctx.lineTo(fx + 32 + i * 24, fy + 38);
        ctx.stroke();
      }
      const flicker = 0.72 + 0.28 * Math.sin(time * 12);
      ctx.fillStyle = `rgba(251, 146, 60, ${flicker})`;
      ctx.fillRect(fx + 14, fy + 165, fw - 28, 26);
      ctx.restore();
    }
  }

  /* ==========================================================================
     ROOM 4: Abandoned Playcare Workshop (CatNap Steps 13-15 & 24)
     ========================================================================== */
  function drawPlaycareRoom(ctx, W, H, visuals, time) {
    // Full cinematic Spooky CatNap Finale plate!
    if (visuals.finaleActive && visuals.spookyFinale) {
      const fin = getImg('scene_catnap_finale');
      if (fin) {
        const z = 1.02 + Math.sin(time * 2.5) * 0.025;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(z, z);
        ctx.drawImage(fin, -W / 2, -H / 2, W, H);
        ctx.restore();
        // Eerie pulsing crimson smoke aura at mouth
        const mg = ctx.createRadialGradient(W * 0.5, H * 0.48, 12, W * 0.5, H * 0.48, 175);
        mg.addColorStop(0, `rgba(239, 30, 50, ${0.22 + 0.14 * Math.sin(time * 4.5)})`);
        mg.addColorStop(1, 'rgba(239, 30, 50, 0)');
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, W, H);
        return;
      }
    }

    const bg = getImg('room_playcare');
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#3d3024';
      ctx.fillRect(0, 0, W, H);
    }

    // Dynamic bulb glow / room darkness as player screws in the bare lightbulb!
    const bulbOn = visuals.bulbBrightness;
    if (bulbOn > 0.3) {
      const glow = ctx.createRadialGradient(640, 170, 16, 640, 260, 520);
      glow.addColorStop(0, `rgba(255, 238, 175, ${bulbOn * 0.24})`);
      glow.addColorStop(1, 'rgba(255, 220, 130, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
    }
    const darkness = 1 - bulbOn;
    if (darkness > 0.04) {
      ctx.fillStyle = `rgba(6, 5, 10, ${Math.min(0.86, darkness * 0.88)})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Step 13 Substep 0: Aged "REPORT" Clipboard held up
    if (!visuals.reportChecked) {
      ctx.save();
      ctx.translate(640, 360 + Math.sin(time * 2) * 4);
      roundRectPath(ctx, -155, -210, 310, 420, 16);
      ctx.fillStyle = '#5c4632';
      ctx.fill();
      ctx.strokeStyle = '#2b1e12';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = '#dfd3ba';
      ctx.fillRect(-132, -178, 264, 362);
      ctx.fillStyle = '#94a3b8';
      roundRectPath(ctx, -56, -222, 112, 36, 8);
      ctx.fill();
      ctx.fillStyle = '#29221a';
      ctx.font = '900 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('REPORT', 0, -130);
      ctx.fillStyle = '#a89678';
      ctx.fillRect(-102, -104, 88, 108);
      ctx.fillRect(14, -104, 88, 108);
      ctx.fillStyle = '#524231';
      ctx.beginPath();
      ctx.arc(-58, -60, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
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
  }

  /* ==========================================================================
     ROOM 5: SMILE BAM Laundry Room (CatNap Steps 16-17)
     ========================================================================== */
  function drawLaundryRoom(ctx, W, H, visuals, time) {
    const bg = getImg('room_laundry');
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#3b3a3d';
      ctx.fillRect(0, 0, W, H);
    }

    // Inside the painted SMILE BAM front-loading porthole drum (cx=640, cy=404, r=104)
    if (visuals.inWasher) {
      const cx = 640, cy = 404, dr = 102;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, dr, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = '#181e27';
      ctx.fillRect(cx - dr, cy - dr, dr * 2, dr * 2);

      // Sloshing blue detergent water!
      if (visuals.detergentPoured || visuals.washSpinFrac > 0) {
        const waveY = cy + 20 - visuals.washSpinFrac * 34;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.62)';
        ctx.beginPath();
        ctx.moveTo(cx - dr, cy + dr);
        for (let x = cx - dr; x <= cx + dr; x += 12) {
          ctx.lineTo(x, waveY + Math.sin(x * 0.09 + time * 11) * 9);
        }
        ctx.lineTo(cx + dr, cy + dr);
        ctx.closePath();
        ctx.fill();
      }

      // Spinning painterly CatNap inside drum!
      const dmg = getImg('catnap_damaged');
      const cln = getImg('catnap_restored');
      ctx.save();
      ctx.translate(cx, cy + 4);
      ctx.rotate(visuals.washSpinFrac > 0 ? time * 7.8 : 0.15);
      if (dmg) {
        ctx.globalAlpha = Math.max(0.15, visuals.dirtAlpha);
        ctx.drawImage(dmg, -62, -98, 124, 196);
      }
      if (cln && visuals.washSpinFrac > 0.1) {
        ctx.globalAlpha = Math.min(1, visuals.washSpinFrac);
        ctx.drawImage(cln, -72, -98, 144, 196);
      }
      ctx.restore();

      // Swirling soapy white bubbles!
      if (visuals.washSpinFrac > 0) {
        for (let b = 0; b < 18; b++) {
          const ang = time * 4.8 + b * 0.85;
          const rad = 22 + (b * 15) % 76;
          const r = 7 + (b % 4) * 4;
          const bx = cx + Math.cos(ang) * rad;
          const by = cy + Math.sin(ang) * rad;
          const bgGrad = ctx.createRadialGradient(bx - r * 0.3, by - r * 0.3, 1, bx, by, r);
          bgGrad.addColorStop(0, 'rgba(255,255,255,0.92)');
          bgGrad.addColorStop(1, 'rgba(186,230,253,0.45)');
          ctx.fillStyle = bgGrad;
          ctx.beginPath();
          ctx.arc(bx, by, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Glossy glass reflection crescent
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.ellipse(cx - 32, cy - 34, 42, 18, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ==========================================================================
     ROOM 6: Wooden Tailor's Workbench (CatNap Steps 18-23)
     ========================================================================== */
  function drawTailorBench(ctx, W, H, visuals, time, isCloseup) {
    const bg = getImg('room_tailor_bench');
    if (bg) {
      if (isCloseup) {
        // Tight cinematic camera zoom into center velvet bay for button-eye cross-stitching!
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(1.65, 1.65);
        ctx.drawImage(bg, -W / 2, -H / 2, W, H);
        ctx.restore();
      } else {
        ctx.drawImage(bg, 0, 0, W, H);
      }
    } else {
      ctx.fillStyle = '#2d1c12';
      ctx.fillRect(0, 0, W, H);
    }

    if (isCloseup) return;

    // Step 20: Unrolled CATNAP Purple Plush Cloth Sheet with Cuttable Dashed Patches!
    if (visuals.purpleClothSelected && visuals.patchesSewnFrac < 1) {
      ctx.save();
      const sx = 742, sy = 198, sw = 248, sh = 318;
      const pGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
      pGrad.addColorStop(0, '#9d56cc');
      pGrad.addColorStop(1, '#6c2d9c');
      ctx.fillStyle = pGrad;
      ctx.strokeStyle = '#3b1557';
      ctx.lineWidth = 4;
      roundRectPath(ctx, sx, sy, sw, sh, 10);
      ctx.fill();
      ctx.stroke();

      // White header strip labeled "CATNAP"
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(sx + 6, sy + 6, sw - 12, 54);
      ctx.fillStyle = '#581c87';
      ctx.font = '900 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CATNAP', sx + sw / 2, sy + 44);

      const cutDone = visuals.patchesCutFrac >= 0.99;
      ctx.setLineDash(cutDone ? [] : [8, 6]);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = cutDone ? '#e2e8f0' : 'rgba(88, 28, 135, 0.35)';
      // Ear triangle patch
      ctx.beginPath();
      ctx.moveTo(sx + 64, sy + 104);
      ctx.lineTo(sx + 106, sy + 190);
      ctx.lineTo(sx + 30, sy + 190);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Torso oval patch
      ctx.beginPath();
      ctx.ellipse(sx + 168, sy + 206, 48, 72, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Wrong swatch gag visual flash (Yellow / Blue cloth held up with shaking red X!)
    if (visuals.wrongSwatchFlash) {
      ctx.save();
      ctx.translate(640, 445);
      ctx.rotate(Math.sin(time * 28) * 0.14);
      ctx.fillStyle = visuals.wrongSwatchFlash === 'yellow' ? '#facc15' : '#3b82f6';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5;
      roundRectPath(ctx, -78, -88, 156, 176, 12);
      ctx.fill();
      ctx.stroke();
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
