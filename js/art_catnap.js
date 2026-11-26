/* ============================================================================
   js/art_catnap.js — Studio Painterly Composite Renderer for ABANDONED CATNAP
   Seamlessly transitions damaged -> washed -> tailored -> restored RGBA sprites
   ============================================================================ */
(function (root) {
  'use strict';

  function getImg(key) {
    return root.ASMRAssets ? root.ASMRAssets.get(key) : null;
  }

  function drawCatNap(ctx, W, H, visuals, time, roomId) {
    if (roomId === 'playcare_room' && !visuals.reportChecked) return;
    if (roomId === 'laundry_room' && visuals.inWasher) return;
    if (visuals.finaleActive && visuals.spookyFinale && getImg('scene_catnap_finale')) return;

    const dmg = getImg('catnap_damaged');
    const washed = getImg('catnap_washed');
    const cln = getImg('catnap_restored');
    if (!dmg && !washed && !cln) return;

    ctx.save();
    let cx = 640, cy = 415, scale = 0.82;
    if (roomId === 'tailor_bench_closeup') {
      cx = 640; cy = 540; scale = 1.38;
    } else if (roomId === 'laundry_room') {
      cx = 640; cy = 425; scale = 0.78;
    } else if (roomId === 'playcare_room') {
      cx = 640; cy = 435; scale = 0.82;
    }

    const breath = Math.sin(time * 2.2) * 2.5;
    ctx.translate(cx, cy + breath);
    ctx.scale(scale, scale);

    // Subtle ground contact shadow
    if (roomId !== 'tailor_bench_closeup') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      ctx.beginPath();
      ctx.ellipse(0, 325, 145, 28, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crisp 3-stage painterly sprite progression (ZERO ghosting!):
    // Stage A (Steps 13-15): catnap_damaged (mud, dangling eye, cheek tag, splinters)
    // Stage B (Steps 16-20): catnap_washed (spotless purple, hollow black sockets, open chest cavity, wire arm)
    // Stage C (Steps 21-24): catnap_restored (stitched patch, glossy button eyes, plush arm, curled tail!)
    if (visuals.dirtAlpha > 0.25 && dmg) {
      ctx.drawImage(dmg, -205, -350, 410, 700);
    } else if (!visuals.plushArmAttached && visuals.patchesSewnFrac < 0.95 && washed) {
      ctx.drawImage(washed, -205, -350, 410, 700);
      // Overlay purple stitched torso patch progressively on Step 20 substep 2
      if (visuals.patchesSewnFrac > 0.05 && cln) {
        ctx.save();
        ctx.globalAlpha = visuals.patchesSewnFrac;
        ctx.beginPath();
        ctx.rect(-220, -350, 340, 700);
        ctx.clip();
        ctx.drawImage(cln, -196, -350, 508, 700);
        ctx.restore();
      }
    } else if (cln) {
      ctx.save();
      if (!visuals.tailAttached) {
        // Clip out right-side tail until Step 23 attaches it!
        ctx.beginPath();
        ctx.rect(-260, -370, 412, 740);
        ctx.clip();
      }
      ctx.drawImage(cln, -196, -350, 508, 700);
      ctx.restore();
      // If on Step 21 (eyes) before plush arm is attached, keep right wire arm masked cleanly until Step 22
      if (!visuals.plushArmAttached && washed) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(82, 40, 160, 290);
        ctx.clip();
        ctx.drawImage(washed, -205, -350, 410, 700);
        ctx.restore();
      }
    }

    // ---- LIVE INTERACTIVE TAILORING & ASMR OVERLAYS ----

    // 1. Red Voice-Box Cassette visible inside chest during Step 18-19 (before patched!)
    if (visuals.redTapeInserted && visuals.patchesSewnFrac < 0.85) {
      ctx.save();
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.fillRect(14, 72, 68, 46);
      ctx.strokeRect(14, 72, 68, 46);
      ctx.fillStyle = '#fef2f2';
      ctx.beginPath();
      ctx.arc(34, 95, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(62, 95, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Fluffy White Cotton Stuffing Clouds (Step 19-20a!)
    if (visuals.cottonStuffedFrac > 0.02 && visuals.patchesSewnFrac < 0.95) {
      ctx.save();
      ctx.globalAlpha = 1 - visuals.patchesSewnFrac;
      const puffs = [[36, 150, 32], [62, 126, 36], [30, 102, 34], [64, 80, 34], [46, 54, 30]];
      const cnt = Math.ceil(puffs.length * visuals.cottonStuffedFrac);
      for (let i = 0; i < cnt; i++) {
        const [px, py, pr] = puffs[i];
        const g = ctx.createRadialGradient(px - 8, py - 8, 4, px, py, pr);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, '#dce3ec');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Aerosol Spray Mist (Step 15b)
    if (visuals.aerosolMistFrac > 0.02) {
      const mg = ctx.createRadialGradient(0, -40, 20, 0, -40, 220);
      mg.addColorStop(0, `rgba(241, 245, 249, ${visuals.aerosolMistFrac * 0.55})`);
      mg.addColorStop(1, 'rgba(241, 245, 249, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(0, -40, 220, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Wet Shimmer Drops + Warm Steam during Step 17 Hair Dryer!
    if (visuals.wetness > 0.02 && roomId === 'laundry_room') {
      ctx.fillStyle = `rgba(186, 230, 253, ${visuals.wetness * 0.85})`;
      for (let d = 0; d < 14; d++) {
        const dx = -130 + (d * 43) % 260;
        const dy = -210 + ((d * 67 + time * 65) % 440);
        ctx.beginPath();
        ctx.ellipse(dx, dy, 5, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Face Close-up Cross-Stitching Button Eye Highlights (Step 21)
    if (roomId === 'tailor_bench_closeup') {
      for (const side of [{ x: -64, sewn: visuals.leftEyeSewn }, { x: 64, sewn: visuals.rightEyeSewn }]) {
        if (!side.sewn) {
          // Hollow socket waiting for glossy black button eye
          ctx.fillStyle = '#06040a';
          ctx.beginPath();
          ctx.arc(side.x, -162, 46, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 6. Gleaming Golden Crescent Moon Glow (Step 24a!)
    if (visuals.moonPolishedFrac > 0.15) {
      const mg = ctx.createRadialGradient(-8, 108, 6, -8, 108, 72);
      mg.addColorStop(0, `rgba(254, 240, 138, ${visuals.moonPolishedFrac * 0.8})`);
      mg.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(-8, 108, 72, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Dark Circular Red-Smoke Scent Capsule inside smiling mouth (Step 24b!)
    if (visuals.capsuleInserted) {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -64, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -64, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. Silky Fur & Cozy Finale Sparkles
    if (visuals.furBrushedFrac > 0.4 || (visuals.finaleActive && !visuals.spookyFinale)) {
      const pts = [[-145, -190], [150, -180], [-135, 110], [155, 115], [0, -295]];
      const mult = visuals.finaleActive ? 1 : visuals.furBrushedFrac * 0.7;
      for (let i = 0; i < pts.length; i++) {
        const [sx, sy] = pts[i];
        const s = (0.5 + 0.5 * Math.sin(time * 5.2 + i * 1.3)) * 18 * mult;
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
    }

    ctx.restore();
  }

  const EXPORT = { drawCatNap };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRCatNap = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
