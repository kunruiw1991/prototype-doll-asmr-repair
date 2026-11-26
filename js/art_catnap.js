/* ============================================================================
   js/art_catnap.js — Ultra-Faithful Illustrated Renderer for ABANDONED CATNAP
   Matches sb0_03..06: damaged plush, dangling eyeball, wire arm, tailor repairs
   ============================================================================ */
(function (root) {
  'use strict';

  function drawMiniCatNap(ctx, cx, cy, scale, dirtAlpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    // Cute simplified plush silhouette for inside the spinning SMILE BAM washer drum
    ctx.fillStyle = '#7e42b0';
    ctx.strokeStyle = '#2d1245';
    ctx.lineWidth = 6;
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 75, 62, 82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Ears
    ctx.beginPath();
    ctx.moveTo(-70, -45);
    ctx.lineTo(-92, -130);
    ctx.lineTo(-18, -82);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(70, -45);
    ctx.lineTo(92, -130);
    ctx.lineTo(18, -82);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.ellipse(0, -32, 92, 74, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Wide dark smile
    ctx.fillStyle = '#0c0812';
    ctx.beginPath();
    ctx.arc(0, -24, 62, 0.1, Math.PI - 0.1);
    ctx.closePath();
    ctx.fill();
    // Empty sockets
    ctx.beginPath();
    ctx.arc(-34, -46, 16, 0, Math.PI * 2);
    ctx.arc(34, -46, 16, 0, Math.PI * 2);
    ctx.fill();
    // Crescent moon charm
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 56, 20, 0.4, Math.PI * 1.7);
    ctx.fill();
    if (dirtAlpha > 0.05) {
      ctx.fillStyle = `rgba(68, 48, 28, ${dirtAlpha * 0.55})`;
      ctx.beginPath();
      ctx.arc(-28, 35, 34, 0, Math.PI * 2);
      ctx.arc(36, -15, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCatNap(ctx, W, H, visuals, time, roomId) {
    // Hidden behind REPORT clipboard on Step 13 substep 0, or inside washing drum on Step 16 substeps 1-2
    if (roomId === 'playcare_room' && !visuals.reportChecked) return;
    if (roomId === 'laundry_room' && visuals.inWasher) return;

    // Spooky Dark CatNap Finale (sb0_06 f24!)
    if (visuals.finaleActive && visuals.spookyFinale) {
      drawSpookyFinaleCatNap(ctx, W, H, time);
      return;
    }

    ctx.save();
    if (roomId === 'tailor_bench_closeup') {
      ctx.translate(640, 485);
      ctx.scale(1.62, 1.62);
    } else if (roomId === 'laundry_room') {
      ctx.translate(640, 435);
      ctx.scale(0.86, 0.86);
    } else if (roomId === 'playcare_room') {
      ctx.translate(640, 425);
      ctx.scale(0.95, 0.95);
    } else {
      ctx.translate(640, 435);
      ctx.scale(0.92, 0.92);
    }

    drawCatNapBodyAndHead(ctx, visuals, time, roomId);
    ctx.restore();
  }

  function drawCatNapBodyAndHead(ctx, visuals, time, roomId) {
    const isClean = visuals.dirtAlpha < 0.2;
    const basePurple = isClean ? '#8648bd' : '#65358e';
    const lightPurple = isClean ? '#b17ae2' : '#8558ad';
    const darkPurple = '#381857';

    // ---- LONG CURLED PURPLE CAT TAIL (Step 23!) ----
    if (visuals.tailAttached) {
      ctx.save();
      ctx.strokeStyle = basePurple;
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-48, 160);
      ctx.bezierCurveTo(-155, 195, -210, 145, -172, 92);
      ctx.stroke();
      ctx.strokeStyle = darkPurple;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // ---- PLUSH LEGS ----
    for (const dir of [-1, 1]) {
      ctx.save();
      const legGrad = ctx.createLinearGradient(dir * 38 - 30, 140, dir * 38 + 30, 240);
      legGrad.addColorStop(0, lightPurple);
      legGrad.addColorStop(1, basePurple);
      ctx.fillStyle = legGrad;
      ctx.strokeStyle = darkPurple;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.ellipse(dir * 42, 188, 34, 58, dir * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Paw pad
      ctx.fillStyle = '#a876d4';
      ctx.beginPath();
      ctx.ellipse(dir * 44, 224, 24, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ---- LEFT PLUSH ARM ----
    ctx.save();
    ctx.fillStyle = basePurple;
    ctx.strokeStyle = darkPurple;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.ellipse(-96, 86, 28, 72, 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ---- RIGHT ARM: Broken Rusty Wire Skeleton (Steps 13-21) -> New Plush Purple Arm (Step 22+) ----
    ctx.save();
    if (visuals.plushArmAttached) {
      const armGrad = ctx.createLinearGradient(72, 20, 125, 140);
      armGrad.addColorStop(0, lightPurple);
      armGrad.addColorStop(1, basePurple);
      ctx.fillStyle = armGrad;
      ctx.strokeStyle = darkPurple;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.ellipse(96, 86, 28, 72, -0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Subtle seam line that fades as airbrush blends it!
      if (visuals.airbrushBlendFrac < 0.98) {
        ctx.strokeStyle = `rgba(50, 18, 78, ${1 - visuals.airbrushBlendFrac})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(74, 34);
        ctx.lineTo(86, 74);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else {
      // Exposed rusty mechanical skeletal wire arm (exact match to sb0_04 & sb0_05!)
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(72, 42);
      ctx.lineTo(108, 102);
      ctx.lineTo(122, 160);
      ctx.stroke();
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(78, 48);
      ctx.lineTo(116, 154);
      ctx.stroke();
      // Wire claws
      for (const ang of [-0.4, 0, 0.4]) {
        ctx.beginPath();
        ctx.moveTo(122, 160);
        ctx.lineTo(122 + Math.sin(ang) * 26, 184);
        ctx.stroke();
      }
      // Rusty protruding wire pins before Step 15 substep 2
      if (!visuals.armWiresCleared) {
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(96, 86);
        ctx.lineTo(140, 74);
        ctx.moveTo(108, 120);
        ctx.lineTo(152, 114);
        ctx.stroke();
      }
    }
    ctx.restore();

    // ---- TORSO (with Ripped Right Half, Red Voice Cassette, Cotton Stuffing & Purple Patch!) ----
    ctx.save();
    const torsoGrad = ctx.createRadialGradient(-24, 58, 20, 0, 82, 122);
    torsoGrad.addColorStop(0, lightPurple);
    torsoGrad.addColorStop(0.65, basePurple);
    torsoGrad.addColorStop(1, '#4c2073');
    ctx.fillStyle = torsoGrad;
    ctx.strokeStyle = darkPurple;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 86, 82, 104, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lighter lavender belly oval
    ctx.fillStyle = isClean ? '#a774d8' : '#7b51a3';
    ctx.beginPath();
    ctx.ellipse(0, 96, 52, 74, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center zipper seam
    ctx.strokeStyle = '#3b175c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(0, 174);
    ctx.stroke();

    // Ripped Open Right Torso Cavity (visible until Purple Cloth Patch is sewn in Step 20!)
    if (visuals.patchesSewnFrac < 1) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(38, 92, 42, 68, 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#1b0f21';
      ctx.fill();
      ctx.strokeStyle = '#3b154c';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Skeletal wires visible inside empty cavity
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(12, 56 + i * 24);
        ctx.quadraticCurveTo(40, 48 + i * 24, 68, 60 + i * 24);
        ctx.stroke();
      }

      // Red Voice-Box Cassette installed inside torso (Step 18 substep 2!)
      if (visuals.redTapeInserted) {
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 2.5;
        ctx.fillRect(14, 72, 48, 34);
        ctx.strokeRect(14, 72, 48, 34);
        ctx.fillStyle = '#fef2f2';
        ctx.beginPath();
        ctx.arc(28, 89, 5, 0, Math.PI * 2);
        ctx.arc(48, 89, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fluffy White Cotton Stuffing filling cavity (Step 19!)
      if (visuals.cottonStuffedFrac > 0.02) {
        const c = visuals.cottonStuffedFrac;
        ctx.fillStyle = '#f8fafc';
        const puffs = [[28, 128, 22], [48, 114, 24], [24, 92, 24], [50, 78, 24], [36, 56, 22]];
        const count = Math.ceil(puffs.length * c);
        for (let i = 0; i < count; i++) {
          const [px, py, pr] = puffs[i];
          ctx.beginPath();
          ctx.arc(px, py, pr * Math.min(1, c * 1.4), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Purple patch overlaying progressively as stitched in Step 20 substep 2
      if (visuals.patchesSewnFrac > 0.02) {
        ctx.globalAlpha = visuals.patchesSewnFrac;
        ctx.fillStyle = '#8b46b5';
        ctx.beginPath();
        ctx.ellipse(38, 92, 43, 69, 0.08, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Visible patch stitch lines (faded completely once Airbrushed in Step 22!)
    if (visuals.patchesSewnFrac >= 0.5 && visuals.airbrushBlendFrac < 0.98) {
      ctx.save();
      ctx.globalAlpha = 1 - visuals.airbrushBlendFrac;
      ctx.strokeStyle = '#3b1557';
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      ctx.ellipse(38, 92, 43, 69, 0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Loose frayed threads hanging from torso (before Step 15 substep 0)
    if (!visuals.threadsSnipped) {
      ctx.strokeStyle = '#d8b4fe';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(12, 138);
      ctx.quadraticCurveTo(28, 178, 4, 204);
      ctx.moveTo(54, 126);
      ctx.quadraticCurveTo(78, 165, 62, 198);
      ctx.stroke();
    }

    // Golden Crescent Moon Zipper Pendant (Polished gleaming gold in Step 24!)
    ctx.save();
    ctx.translate(0, 54);
    const moonBright = visuals.moonPolishedFrac;
    ctx.fillStyle = moonBright > 0.4 ? '#fde047' : '#ca8a04';
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0.45, Math.PI * 1.65);
    ctx.arc(10, -4, 20, Math.PI * 1.55, 0.55, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (moonBright > 0.15) {
      const mg = ctx.createRadialGradient(-4, 0, 4, 0, 0, 48);
      mg.addColorStop(0, `rgba(254, 240, 138, ${moonBright * 0.72})`);
      mg.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.restore(); // end torso

    // ---- CATNAP HEAD & TRIANGULAR EARS ----
    ctx.save();
    ctx.translate(0, -112);

    // RIGHT EAR (intact)
    drawCatEar(ctx, 1, basePurple, darkPurple, false, true);

    // LEFT EAR (torn tip exposing white cotton & splinters until Step 20 patch!)
    const leftEarFixed = visuals.patchesSewnFrac >= 0.85;
    drawCatEar(ctx, -1, basePurple, darkPurple, !leftEarFixed, visuals.earDebrisCleared);

    // Plush Round-Cheeked Cat Head
    const headGrad = ctx.createRadialGradient(-28, -42, 22, 0, 0, 138);
    headGrad.addColorStop(0, lightPurple);
    headGrad.addColorStop(0.68, basePurple);
    headGrad.addColorStop(1, '#471e6b');
    ctx.fillStyle = headGrad;
    ctx.strokeStyle = darkPurple;
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(-116, -20);
    ctx.bezierCurveTo(-124, -102, 124, -102, 116, -20);
    ctx.bezierCurveTo(132, 42, 86, 102, 0, 102);
    ctx.bezierCurveTo(-86, 102, -132, 42, -116, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Forehead center plush seam (torn before Step 18 substep 1 -> neat stitched seam!)
    ctx.strokeStyle = visuals.foreheadSewn ? '#4c1d73' : '#1b0a29';
    ctx.lineWidth = visuals.foreheadSewn ? 2.5 : 5;
    ctx.beginPath();
    ctx.moveTo(0, -86);
    ctx.lineTo(0, -34);
    ctx.stroke();
    if (!visuals.foreheadSewn) {
      // Torn jagged gap at forehead
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(0, -64, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Small purple triangle cat nose
    ctx.fillStyle = '#3b1557';
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(-14, -38);
    ctx.lineTo(14, -38);
    ctx.closePath();
    ctx.fill();

    // Iconic Giant Black Smiling Crescent Mouth!
    ctx.fillStyle = '#09060d';
    ctx.strokeStyle = '#2d1245';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-90, -14);
    ctx.quadraticCurveTo(0, 12, 90, -14);
    ctx.bezierCurveTo(96, 74, -96, 74, -90, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dark Circular Red-Smoke Scent Capsule inside mouth (Step 24 substep 1!)
    if (visuals.capsuleInserted) {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 26, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 26, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // ---- EYE SOCKETS & GLOSSY BLACK BUTTON EYES (Step 21!) ----
    for (const side of [{ dir: -1, sewn: visuals.leftEyeSewn }, { dir: 1, sewn: visuals.rightEyeSewn }]) {
      const ex = side.dir * 42;
      const ey = -48;
      // Dark socket
      ctx.fillStyle = '#0b0812';
      ctx.beginPath();
      ctx.arc(ex, ey, 22, 0, Math.PI * 2);
      ctx.fill();

      if (side.sewn) {
        // Glossy new black doll button eye with cross-stitch!
        const eg = ctx.createRadialGradient(ex - 7, ey - 7, 3, ex, ey, 22);
        eg.addColorStop(0, '#475569');
        eg.addColorStop(0.4, '#111827');
        eg.addColorStop(1, '#020408');
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(ex, ey, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Cute specular glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(ex - 7, ey - 8, 5.5, 0, Math.PI * 2);
        ctx.fill();
        // Cross-stitch X
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ex - 5, ey - 5);
        ctx.lineTo(ex + 5, ey + 5);
        ctx.moveTo(ex + 5, ey - 5);
        ctx.lineTo(ex - 5, ey + 5);
        ctx.stroke();
      }
    }

    // Dangling Left Eyeball on Red Thread (before Step 14 substep 1!)
    if (!visuals.danglingEyeRemoved) {
      const swing = Math.sin(time * 3.2) * 6;
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-42, -48);
      ctx.quadraticCurveTo(-56, -4, -46 + swing, 28);
      ctx.stroke();
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-46 + swing, 34, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(-50 + swing, 29, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stuck Cheek Tag/Blade on Right Cheek (before Step 14 substep 2!)
    if (!visuals.cheekTagRemoved) {
      ctx.save();
      ctx.translate(92, -16);
      ctx.rotate(0.45);
      ctx.fillStyle = '#e5e7eb';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.fillRect(0, -14, 72, 26);
      ctx.strokeRect(0, -14, 72, 26);
      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('1188', 18, 4);
      ctx.restore();
    }

    // ---- MUD / GRIME STAINS (cleaned completely inside SMILE BAM washer!) ----
    if (visuals.dirtAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = visuals.dirtAlpha * 0.58;
      ctx.fillStyle = '#4a3520';
      const stains = [
        [-62, -6, 28, 18, 0.3],
        [66, 4, 24, 16, -0.2],
        [-18, 185, 36, 22, 0.1],
        [26, 245, 30, 18, -0.3]
      ];
      for (const [sx, sy, rx, ry, rot] of stains) {
        ctx.beginPath();
        ctx.ellipse(sx, sy, rx, ry, rot, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Aerosol Spray Cleaning Mist (Step 15 substep 1)
    if (visuals.aerosolMistFrac > 0.02) {
      ctx.save();
      ctx.fillStyle = `rgba(240, 248, 255, ${visuals.aerosolMistFrac * 0.45})`;
      ctx.beginPath();
      ctx.arc(0, 0, 118, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Wet Shimmer Droplets (Step 17 Hair Dryer!)
    if (visuals.wetness > 0.02 && roomId === 'laundry_room') {
      ctx.save();
      ctx.fillStyle = `rgba(186, 230, 253, ${visuals.wetness * 0.85})`;
      for (let d = 0; d < 12; d++) {
        const dx = -85 + (d * 31) % 170;
        const dy = -65 + ((d * 43 + time * 42) % 290);
        ctx.beginPath();
        ctx.ellipse(dx, dy, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Silky Brushed Plush Fur Highlights (Step 23+ & Cozy Finale!)
    if (visuals.furBrushedFrac > 0.25) {
      ctx.save();
      ctx.globalAlpha = visuals.furBrushedFrac * 0.55;
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-56, -54, 34, Math.PI * 1.1, Math.PI * 1.55);
      ctx.arc(54, -56, 30, Math.PI * 1.5, Math.PI * 1.88);
      ctx.stroke();
      ctx.restore();
    }

    // Cozy Lavender Finale Sparkles!
    if (visuals.finaleActive && !visuals.spookyFinale) {
      const pts = [[-130, -90], [135, -75], [-110, 95], [125, 110], [0, -140]];
      for (let i = 0; i < pts.length; i++) {
        const [sx, sy] = pts[i];
        const r = 8 + 7 * Math.sin(time * 5 + i);
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(sx, sy, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore(); // end head
  }

  function drawCatEar(ctx, dir, basePurple, darkPurple, isTorn, debrisCleared) {
    ctx.save();
    ctx.fillStyle = basePurple;
    ctx.strokeStyle = darkPurple;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(dir * 32, -74);
    if (isTorn) {
      ctx.lineTo(dir * 86, -158);
      ctx.lineTo(dir * 66, -138);
      ctx.lineTo(dir * 102, -130);
      ctx.lineTo(dir * 106, -42);
    } else {
      ctx.lineTo(dir * 116, -172);
      ctx.lineTo(dir * 106, -42);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dark purple inner ear triangle
    ctx.fillStyle = '#4c1d6e';
    ctx.beginPath();
    ctx.moveTo(dir * 46, -72);
    ctx.lineTo(dir * 92, isTorn ? -128 : -144);
    ctx.lineTo(dir * 92, -52);
    ctx.closePath();
    ctx.fill();

    // Cotton & wooden debris splinters inside torn left ear
    if (isTorn) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(dir * 86, -144, 12, 0, Math.PI * 2);
      ctx.fill();
      if (!debrisCleared) {
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(dir * 78, -148);
        ctx.lineTo(dir * 104, -176);
        ctx.moveTo(dir * 88, -136);
        ctx.lineTo(dir * 116, -152);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawSpookyFinaleCatNap(ctx, W, H, time) {
    // Pitch-dark Playcare silhouette with glowing white pinprick pupils, red smoke mouth & spider limbs (sb0_06 f24!)
    ctx.save();
    ctx.fillStyle = 'rgba(4, 3, 7, 0.88)';
    ctx.fillRect(0, 0, W, H);

    ctx.translate(W / 2, H * 0.56);
    const breath = 1 + Math.sin(time * 3.4) * 0.03;
    ctx.scale(breath, breath);

    // Shadowy elongated spider-like nightmare limbs unfurling
    ctx.strokeStyle = '#1b1126';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * 65, 58);
      ctx.quadraticCurveTo(dir * 230, 20, dir * 320, 210);
      ctx.moveTo(dir * 52, 95);
      ctx.quadraticCurveTo(dir * 180, 110, dir * 240, 240);
      ctx.stroke();
    }

    // Silhouetted CatNap Head
    ctx.fillStyle = '#251736';
    ctx.strokeStyle = '#09050f';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-82, -75);
    ctx.lineTo(-142, -210);
    ctx.lineTo(-32, -112);
    ctx.lineTo(32, -112);
    ctx.lineTo(142, -210);
    ctx.lineTo(82, -75);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -18, 146, 126, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing Crimson Red Smoke Mouth!
    const mouthGlow = ctx.createRadialGradient(0, 32, 12, 0, 32, 130);
    mouthGlow.addColorStop(0, 'rgba(239, 35, 60, 0.92)');
    mouthGlow.addColorStop(0.55, 'rgba(153, 27, 27, 0.65)');
    mouthGlow.addColorStop(1, 'rgba(153, 27, 27, 0)');
    ctx.fillStyle = mouthGlow;
    ctx.beginPath();
    ctx.arc(0, 32, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.moveTo(-104, -4);
    ctx.quadraticCurveTo(0, 22, 104, -4);
    ctx.bezierCurveTo(106, 98, -106, 98, -104, -4);
    ctx.closePath();
    ctx.fill();

    // Hollow Black Eyes with Tiny Glowing White Pinprick Pupils!
    for (const ex of [-54, 54]) {
      ctx.fillStyle = '#020204';
      ctx.beginPath();
      ctx.arc(ex, -46, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex, -46, 7 + Math.sin(time * 8) * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const EXPORT = { drawCatNap, drawMiniCatNap };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRCatNap = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
