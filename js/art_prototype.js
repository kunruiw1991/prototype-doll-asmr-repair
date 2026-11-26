/* ============================================================================
   js/art_prototype.js — Studio Painterly Composite Renderer for THE PROTOTYPE
   Blends high-detail RGBA sprites with dynamic grime, foam, dagger, brain & limbs
   ============================================================================ */
(function (root) {
  'use strict';

  function getImg(key) {
    return root.ASMRAssets ? root.ASMRAssets.get(key) : null;
  }

  function drawPrototype(ctx, W, H, visuals, time, roomId) {
    // Closed doors on Step 8 substep 0 or full-bleed cinematic spooky finale plate
    if (roomId === 'steel_cabinet' && !visuals.cabinetDoorsOpen) return;
    if (visuals.finaleActive && visuals.spookyFinale && getImg('scene_proto_finale')) return;

    const dmg = getImg('proto_damaged');
    const cleanUp = getImg('proto_clean_upper');
    const chassis = getImg('proto_chassis');
    const full = getImg('proto_restored');
    const brainImg = getImg('prop_brain');
    const mommyImg = getImg('prop_mommy_arm');
    const huggyImg = getImg('prop_huggy_arm');

    // Step 3 CRT Closeup: Prototype peeks in from right side
    if (roomId === 'lab_desk_crt') {
      const sprite = dmg || cleanUp;
      if (sprite) {
        ctx.save();
        ctx.drawImage(sprite, 875, 115, 420, 520);
        if (visuals.newBrainImplanted && brainImg) {
          drawGlowingBrainOverlay(ctx, 975, 222, brainImg, time);
        }
        ctx.restore();
      }
      return;
    }

    // ---- ROOM 1: LAB DESK (Steps 1-4) ----
    if (roomId === 'lab_desk') {
      ctx.save();
      const breath = Math.sin(time * 2.2) * 2.5;
      const sprite = visuals.redHornAttached ? (cleanUp || dmg) : (dmg || cleanUp);
      if (sprite) {
        const sw = visuals.redHornAttached ? 440 : 410;
        const sh = visuals.redHornAttached ? 445 : 505;
        ctx.drawImage(sprite, 640 - sw / 2, 130 + breath, sw, sh);
      }

      // Glowing green fresh brain glow on torn left horn after transplant (Steps 2-4a)
      if (!visuals.redHornAttached && visuals.oldBrainRemoved) {
        if (visuals.newBrainImplanted && brainImg) {
          drawGlowingBrainOverlay(ctx, 558, 222 + breath, brainImg, time);
        } else {
          // Empty dark cavity while waiting for new brain
          ctx.fillStyle = '#181014';
          ctx.beginPath();
          ctx.ellipse(558, 222 + breath, 42, 32, -0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Embedded Forehead Dagger (Step 1 — drags smoothly up-right!)
      if (!visuals.knifeRemoved) {
        const pull = visuals.knifePullFrac;
        ctx.save();
        ctx.translate(675 + pull * 105, 245 - pull * 92);
        ctx.rotate(0.74);
        const blade = ctx.createLinearGradient(-8, 0, 8, 64);
        blade.addColorStop(0, '#e2e8f0');
        blade.addColorStop(1, '#64748b');
        ctx.fillStyle = blade;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 66);
        ctx.lineTo(-9, 0);
        ctx.lineTo(9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#78562b';
        ctx.fillRect(-20, -7, 40, 10);
        ctx.strokeRect(-20, -7, 40, 10);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-7, -46, 14, 39);
        ctx.strokeRect(-7, -46, 14, 39);
        ctx.restore();
      }

      // Sparkling tooth shine once scrubbed in Step 4
      if (visuals.teethCleanFrac > 0.35) {
        drawSparkleBurst(ctx, [[615, 365], [665, 360], [640, 380]], visuals.teethCleanFrac, time);
      }

      // Cozy Finale sparkles if toggled to Cozy
      if (visuals.finaleActive && !visuals.spookyFinale) {
        drawSparkleBurst(ctx, [[510, 180], [770, 195], [530, 420], [750, 410], [640, 120]], 1, time);
      }
      ctx.restore();
      return;
    }

    // ---- ROOM 2: GREEN EXPERIMENT CHAMBER (Steps 5-7) ----
    if (roomId === 'green_chamber') {
      ctx.save();
      const sway = Math.sin(time * 2.0) * 3;
      // Mechanical spine & crimson ribcage progressively installed beneath upper bust!
      if (visuals.spineDropped) {
        drawSpineConnector(ctx, 640, 362 + sway, visuals.spineBoltedFrac);
      }
      if (visuals.coreHarvested || visuals.ribsUpper) {
        // Show rich painterly armored ribcage center cropped from proto_chassis!
        if (chassis) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(640, 520 + sway, 126, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(chassis, 640 - 275, 405 + sway, 550, 270);
          ctx.restore();
        }
        if (!visuals.ribsLower) {
          // Dark shadow masking lower ribs until snapped in!
          ctx.fillStyle = 'rgba(18, 8, 12, 0.78)';
          ctx.beginPath();
          ctx.ellipse(640, 558 + sway, 68, 36, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (cleanUp) {
        ctx.drawImage(cleanUp, 640 - 185, 76 + sway, 370, 375);
      }
      ctx.restore();
      return;
    }

    // ---- ROOM 3: ICONIC STEEL TOOL CABINET (Steps 8-12) ----
    if (roomId === 'steel_cabinet') {
      ctx.save();
      const cx = 640;

      // Grafted Mommy Pink Arm & Huggy Blue Arm hanging beneath ribcage (Step 11+)
      if (visuals.mommyGrafted && mommyImg) {
        ctx.drawImage(mommyImg, cx - 72, 475, 58, 250);
      }
      if (visuals.huggyGrafted && huggyImg) {
        ctx.drawImage(huggyImg, cx + 16, 475, 68, 250);
      }

      if (visuals.leftClawAttached && visuals.rightClawAttached && full) {
        // FULL PAINTERLY RESTORED PROTOTYPE (Steps 9b-12!)
        ctx.drawImage(full, cx - 320, 48, 640, 626);
      } else {
        // Progressive assembly (Steps 8-9a): Spider legs -> Dock torso -> Claws!
        if (chassis) {
          if (visuals.leftSpiderLegs) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 320, cx + 6, 400);
            ctx.clip();
            ctx.drawImage(chassis, cx - 320, 360, 640, 314);
            ctx.restore();
          }
          if (visuals.rightSpiderLegs) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(cx - 6, 320, W - cx + 6, 400);
            ctx.clip();
            ctx.drawImage(chassis, cx - 320, 360, 640, 314);
            ctx.restore();
          }
        }
        if (cleanUp) {
          const dropY = visuals.torsoDocked ? 52 : -55;
          ctx.drawImage(cleanUp, cx - 172, dropY, 344, 348);
        }
        // If left claw attached before right claw
        if (visuals.leftClawAttached && full) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(280, 120, 220, 280);
          ctx.clip();
          ctx.drawImage(full, cx - 320, 48, 640, 626);
          ctx.restore();
        }
      }

      // Realistic Grime + Pink Crayon Scribbles Overlay (visible until washed off in Step 10!)
      if (visuals.grimeAlpha > 0.02 && visuals.torsoDocked) {
        drawGrimeAndCrayonOverlay(ctx, cx, 200, visuals.grimeAlpha);
      }

      // Volumetric Fluffy White ASMR Cleaning Foam (Step 10!)
      if (visuals.foamCoverage > 0.01) {
        drawVolumetricFoam(ctx, cx, 320, visuals.foamCoverage, time);
      }

      // Cassette glow indicator once inserted in Step 12
      if (visuals.cassetteInserted) {
        const g = ctx.createRadialGradient(cx, 280, 4, cx, 280, 46);
        g.addColorStop(0, 'rgba(192, 132, 252, 0.85)');
        g.addColorStop(1, 'rgba(192, 132, 252, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, 280, 46, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gleaming Polish Sparkles (Step 12b)
      if (visuals.polishFrac > 0.1) {
        drawSparkleBurst(ctx, [[565, 165], [715, 165], [520, 260], [760, 260], [640, 95], [640, 495]], visuals.polishFrac, time);
      }
      ctx.restore();
    }
  }

  function drawGlowingBrainOverlay(ctx, bx, by, brainImg, time) {
    const pulse = 1 + Math.sin(time * 4.5) * 0.05;
    const g = ctx.createRadialGradient(bx, by, 8, bx, by, 68);
    g.addColorStop(0, 'rgba(74, 255, 128, 0.82)');
    g.addColorStop(1, 'rgba(74, 255, 128, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx, by, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(pulse, pulse);
    ctx.filter = 'hue-rotate(92deg) saturate(1.9) brightness(1.12)';
    ctx.drawImage(brainImg, -36, -34, 72, 68);
    ctx.restore();
  }

  function drawSpineConnector(ctx, cx, sy, boltedFrac) {
    ctx.save();
    const grad = ctx.createLinearGradient(cx - 22, 0, cx + 22, 0);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#94a3b8');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#090d14';
    ctx.lineWidth = 3;
    ctx.fillRect(cx - 18, sy, 36, 98);
    ctx.strokeRect(cx - 18, sy, 36, 98);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#64748b' : '#334155';
      ctx.fillRect(cx - 24, sy + 10 + i * 22, 48, 10);
      ctx.strokeRect(cx - 24, sy + 10 + i * 22, 48, 10);
    }
    if (boltedFrac > 0.3) {
      const glow = ctx.createRadialGradient(cx, sy + 95, 4, cx, sy + 95, 42);
      glow.addColorStop(0, `rgba(254, 240, 138, ${boltedFrac * 0.8})`);
      glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, sy + 95, 42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGrimeAndCrayonOverlay(ctx, cx, cy, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha * 0.85;
    // Pink crayon scribble eyebrows & nose (from thumb_maxres.jpg!)
    ctx.strokeStyle = '#f43f9c';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 38, cy - 52);
    ctx.lineTo(cx - 8, cy - 58);
    ctx.moveTo(cx + 10, cy - 55);
    ctx.lineTo(cx + 42, cy - 40);
    ctx.stroke();
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 22);
    ctx.lineTo(cx - 12, cy - 6);
    ctx.lineTo(cx + 12, cy - 6);
    ctx.closePath();
    ctx.fill();

    // Soot/mud smudges on face & coat
    ctx.fillStyle = 'rgba(28, 22, 16, 0.55)';
    const spots = [
      [cx - 36, cy - 8, 22], [cx + 38, cy - 12, 18],
      [cx - 60, cy + 120, 32], [cx + 55, cy + 135, 28],
      [cx, cy + 165, 36]
    ];
    for (const [sx, sy, sr] of spots) {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawVolumetricFoam(ctx, cx, cy, coverage, time) {
    ctx.save();
    const blobs = [
      [0, -175, 56], [-48, -145, 48], [52, -142, 50],
      [-18, -95, 56], [28, -92, 54], [0, -35, 62],
      [-70, -5, 50], [70, -5, 50], [-42, 55, 58],
      [42, 55, 58], [0, 108, 60], [-102, 82, 46],
      [102, 82, 46], [0, 175, 56], [-56, 210, 48],
      [56, 210, 48], [0, 248, 56]
    ];
    const count = Math.ceil(blobs.length * coverage);
    for (let i = 0; i < count; i++) {
      const [dx, dy, br] = blobs[i];
      const sc = Math.min(1, coverage * 1.45 - i * 0.03) * (0.96 + 0.04 * Math.sin(time * 4 + i));
      if (sc <= 0.05) continue;
      const r = br * sc;
      const bx = cx + dx;
      const by = cy + dy;
      const g = ctx.createRadialGradient(bx - r * 0.3, by - r * 0.3, r * 0.08, bx, by, r);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      g.addColorStop(0.7, 'rgba(232, 243, 252, 0.92)');
      g.addColorStop(1, 'rgba(186, 204, 220, 0.78)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSparkleBurst(ctx, pts, intensity, time) {
    ctx.save();
    for (let i = 0; i < pts.length; i++) {
      const [sx, sy] = pts[i];
      const s = (0.5 + 0.5 * Math.sin(time * 5.8 + i * 1.4)) * 18 * intensity;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(sx, sy - s);
      ctx.lineTo(sx + s * 0.28, sy - s * 0.28);
      ctx.lineTo(sx + s, sy);
      ctx.lineTo(sx + s * 0.28, sy + s * 0.28);
      ctx.lineTo(sx, sy + s);
      ctx.lineTo(sx - s * 0.28, sy + s * 0.28);
      ctx.lineTo(sx - s, sy);
      ctx.lineTo(sx - s * 0.28, sy - s * 0.28);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  const EXPORT = { drawPrototype };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRPrototype = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
