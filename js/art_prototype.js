/* ============================================================================
   js/art_prototype.js — Ultra-Faithful Illustrated Renderer for THE PROTOTYPE
   Experiment 1006 Jester Spider Doll matching thumb_maxres.jpg & sb0_00..03
   ============================================================================ */
(function (root) {
  'use strict';

  function drawPrototype(ctx, W, H, visuals, time, roomId) {
    // Hidden behind closed steel cabinet doors (Step 8 substep 0)
    if (roomId === 'steel_cabinet' && !visuals.cabinetDoorsOpen) return;

    // On CRT closeup, Prototype peeks cleanly from the far right edge (sb0_00 f19-20!)
    if (roomId === 'lab_desk_crt') {
      ctx.save();
      ctx.translate(1060, 390);
      ctx.scale(1.15, 1.15);
      drawUpperTorsoAndHead(ctx, visuals, time, true);
      ctx.restore();
      return;
    }

    // Spooky Red-Alert Prototype Finale Zoom (sb0_03 f4!)
    if (visuals.finaleActive && visuals.spookyFinale) {
      ctx.save();
      const tilt = -0.28 + Math.sin(time * 2.2) * 0.06;
      ctx.translate(640, 375);
      ctx.rotate(tilt);
      ctx.scale(1.48, 1.48);
      drawUpperTorsoAndHead(ctx, visuals, time, false, true);
      ctx.restore();
      return;
    }

    ctx.save();
    // Position & scale cleanly by room
    if (roomId === 'lab_desk') {
      ctx.translate(640, 415);
      ctx.scale(1.06, 1.06);
      drawUpperTorsoAndHead(ctx, visuals, time, false);
    } else if (roomId === 'green_chamber') {
      ctx.translate(640, 290);
      ctx.scale(0.88, 0.88);
      drawSpiderAndRibcage(ctx, visuals, time, false);
      drawMechanicalSpine(ctx, visuals, time);
      drawUpperTorsoAndHead(ctx, visuals, time, false);
    } else if (roomId === 'steel_cabinet') {
      ctx.translate(640, 345);
      ctx.scale(0.92, 0.92);
      drawSpiderAndRibcage(ctx, visuals, time, true);
      if (visuals.torsoDocked) {
        drawMechanicalSpine(ctx, visuals, time);
        drawUpperTorsoAndHead(ctx, visuals, time, false);
      } else {
        // Torso suspended slightly higher waiting to be hammered/docked
        ctx.save();
        ctx.translate(0, -145);
        drawUpperTorsoAndHead(ctx, visuals, time, false);
        ctx.restore();
      }
    }

    // Fluffy White ASMR Foam Layer (Step 10!)
    if (visuals.foamCoverage > 0.01 && roomId === 'steel_cabinet') {
      drawASMRFoamOverlay(ctx, visuals.foamCoverage, time);
    }

    // Sparkle Polish Stars (Step 12 & Cozy Finale)
    if (visuals.polishFrac > 0.1 || (visuals.finaleActive && !visuals.spookyFinale)) {
      drawPolishSparkles(ctx, visuals.finaleActive ? 1 : visuals.polishFrac, time);
    }

    ctx.restore();
  }

  function drawMechanicalSpine(ctx, visuals, time) {
    if (!visuals.spineDropped && !visuals.torsoDocked) return;
    ctx.save();
    // Ribbed steel column descending from torso to ribcage
    const spineY = 120;
    const spineH = 128;
    const grad = ctx.createLinearGradient(-22, 0, 22, 0);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.5, '#94a3b8');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(-20, spineY, 40, spineH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(-20, spineY, 40, spineH);

    // Articulated metallic rings
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#64748b' : '#334155';
      ctx.fillRect(-26, spineY + 8 + i * 20, 52, 10);
      ctx.strokeRect(-26, spineY + 8 + i * 20, 52, 10);
    }

    // Pelvis Headlight Joint (glows brighter once bolted!)
    const bolted = visuals.spineBoltedFrac > 0.5 || visuals.torsoDocked;
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(0, spineY + spineH - 8, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = bolted ? '#fef08a' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(0, spineY + spineH - 8, 16, 0, Math.PI * 2);
    ctx.fill();
    if (bolted) {
      const g = ctx.createRadialGradient(0, spineY + spineH - 8, 4, 0, spineY + spineH - 8, 48);
      g.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
      g.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, spineY + spineH - 8, 48, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSpiderAndRibcage(ctx, visuals, time, showSpiderLegs) {
    const cy = 278;

    // 6 Articulated Heavy Mechanical Spider Legs (Step 8+)
    if (showSpiderLegs) {
      const drawSideLegs = (dir) => {
        ctx.save();
        for (let i = 0; i < 3; i++) {
          const sway = Math.sin(time * 2.2 + i * 1.1 + dir) * 4;
          const kneeX = dir * (168 + i * 34);
          const kneeY = cy - 42 + i * 28 + sway;
          const footX = dir * (252 + i * 28);
          const footY = cy + 128 + i * 14;

          // Dark metallic leg tube
          ctx.strokeStyle = '#1e242d';
          ctx.lineWidth = 22 - i * 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(dir * 70, cy - 12 + i * 16);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // Steel bevel highlight
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(dir * 70, cy - 15 + i * 16);
          ctx.lineTo(kneeX, kneeY - 3);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // Crimson hydraulic cable along spider leg
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(dir * 76, cy + i * 14);
          ctx.quadraticCurveTo(kneeX - dir * 10, kneeY + 24, footX - dir * 24, footY - 26);
          ctx.stroke();

          // Joint bolt
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        ctx.restore();
      };

      if (visuals.leftSpiderLegs) drawSideLegs(-1);
      if (visuals.rightSpiderLegs) drawSideLegs(1);
    }

    // Crimson Armored Ribcage Carapace (Step 6+)
    if (visuals.coreHarvested || visuals.ribsUpper || showSpiderLegs) {
      ctx.save();
      ctx.translate(0, cy);
      // Outer crimson armor shell
      const shellGrad = ctx.createLinearGradient(-115, -75, 115, 85);
      shellGrad.addColorStop(0, '#7f1d28');
      shellGrad.addColorStop(0.5, '#a82939');
      shellGrad.addColorStop(1, '#4c0d16');
      ctx.fillStyle = shellGrad;
      ctx.strokeStyle = '#1f0b10';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 106, 82, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dark internal chest cavity
      ctx.fillStyle = '#180d11';
      ctx.beginPath();
      ctx.ellipse(0, 6, 74, 58, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing harvested core pulsing inside cavity
      if (visuals.coreHarvested) {
        const pulse = 0.8 + 0.2 * Math.sin(time * 5);
        const cg = ctx.createRadialGradient(0, 6, 6, 0, 6, 52);
        cg.addColorStop(0, `rgba(255, 90, 70, ${pulse})`);
        cg.addColorStop(1, 'rgba(255, 60, 60, 0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(0, 6, 52, 0, Math.PI * 2);
        ctx.fill();
      }

      // White Curved Bone Ribs (Row 1 + Row 2)
      const drawRibPair = (ry, w) => {
        ctx.strokeStyle = '#ebe5d5';
        ctx.lineWidth = 11;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-w, ry - 12);
        ctx.quadraticCurveTo(-w * 0.45, ry + 14, -8, ry + 6);
        ctx.moveTo(w, ry - 12);
        ctx.quadraticCurveTo(w * 0.45, ry + 14, 8, ry + 6);
        ctx.stroke();
        ctx.strokeStyle = '#6b6354';
        ctx.lineWidth = 2;
        ctx.stroke();
      };
      if (visuals.ribsUpper) {
        drawRibPair(-24, 68);
        drawRibPair(-2, 74);
      }
      if (visuals.ribsLower) {
        drawRibPair(20, 68);
        drawRibPair(42, 54);
      }

      // Grafted Mommy Long Legs Pink Arm & Huggy Wuggy Blue Arm (Step 11!)
      if (visuals.mommyGrafted) {
        ctx.strokeStyle = '#e11d6b';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-26, 26);
        ctx.lineTo(-34, 152);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-48, 128, 28, 10);
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(-34, 158, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visuals.huggyGrafted) {
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(28, 24);
        ctx.lineTo(38, 148);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(38, 160, 22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawUpperTorsoAndHead(ctx, visuals, time, isSidePeek, isSpookyClose) {
    ctx.save();

    // ---- ARMS & ICONIC NEEDLE-CLAW HANDS (thumb_maxres.jpg!) ----
    for (const dir of [-1, 1]) {
      const hasClaw = dir === -1 ? visuals.leftClawAttached : visuals.rightClawAttached;
      ctx.save();
      // Sleeves (navy + red flare cuff + gold trim)
      ctx.strokeStyle = '#20364c';
      ctx.lineWidth = 42;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(dir * 78, 18);
      ctx.lineTo(dir * 144, 104);
      ctx.stroke();
      // Red sleeve puff
      ctx.fillStyle = '#9e2a2b';
      ctx.strokeStyle = '#e8b343';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(dir * 126, 76, 36, 24, dir * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Yellow cuff
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.arc(dir * 150, 114, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#422006';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Experiment 1006 Long Razor-Fingered Mechanical Claw Hand!
      if (hasClaw) {
        ctx.save();
        ctx.translate(dir * 158, 128);
        // Dark steel palm
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 28, dir * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 5 long articulated needle fingers with spherical joints!
        const fingerAngles = [-0.85, -0.42, 0.02, 0.42, 0.82];
        for (let f = 0; f < 5; f++) {
          const ang = (dir === -1 ? Math.PI - 0.5 : 0.5) + fingerAngles[f] * 0.62 + Math.sin(time * 2.5 + f) * 0.03;
          const j1x = Math.cos(ang) * 44;
          const j1y = Math.sin(ang) * 44;
          const tipx = Math.cos(ang + dir * 0.14) * (112 - Math.abs(f - 2) * 14);
          const tipy = Math.sin(ang + dir * 0.14) * (112 - Math.abs(f - 2) * 14);

          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(j1x, j1y);
          ctx.lineTo(tipx, tipy);
          ctx.stroke();

          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(j1x, j1y);
          ctx.lineTo(tipx, tipy);
          ctx.stroke();

          // Articulated metal knuckle spheres
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(j1x * 0.55, j1y * 0.55, 6, 0, Math.PI * 2);
          ctx.arc(j1x, j1y, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    }

    // ---- NAVY & GOLD-TRIMMED JESTER COAT TORSO ----
    const coatGrad = ctx.createLinearGradient(-105, -20, 105, 130);
    coatGrad.addColorStop(0, '#1c354c');
    coatGrad.addColorStop(0.5, '#2b4b69');
    coatGrad.addColorStop(1, '#132436');
    ctx.fillStyle = coatGrad;
    ctx.strokeStyle = '#e2b144';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-112, -16);
    ctx.lineTo(-68, 132);
    ctx.lineTo(68, 132);
    ctx.lineTo(112, -16);
    ctx.lineTo(54, -44);
    ctx.lineTo(0, 18);
    ctx.lineTo(-54, -44);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // High Jester Collar (Crimson inner lining + Gold border)
    ctx.fillStyle = '#8b1e24';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-124, -44);
    ctx.lineTo(-62, -62);
    ctx.lineTo(-42, 16);
    ctx.lineTo(-98, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(124, -44);
    ctx.lineTo(62, -62);
    ctx.lineTo(42, 16);
    ctx.lineTo(98, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribbed Black/Steel Neck Pipes (signature Prototype anatomy!)
    for (const nx of [-34, -18, 18, 34]) {
      ctx.strokeStyle = '#1f242c';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(nx, -94);
      ctx.quadraticCurveTo(nx * 1.15, -36, nx * 0.65, 16);
      ctx.stroke();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Center Red Bow Tie
    ctx.fillStyle = '#c83428';
    ctx.strokeStyle = '#5c120d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(-34, 88);
    ctx.lineTo(-4, 72);
    ctx.lineTo(0, 18);
    ctx.lineTo(4, 72);
    ctx.lineTo(34, 88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 12, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ---- TRI-COLOR JESTER HAT (Red Left, Blue Center, Grimy Yellow Right) ----
    ctx.save();
    ctx.translate(0, -142);

    // RIGHT YELLOW HORN (curving down with golden jingle bell)
    const yelGrad = ctx.createLinearGradient(25, -90, 125, 60);
    yelGrad.addColorStop(0, '#eab308');
    yelGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = yelGrad;
    ctx.strokeStyle = '#272011';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(28, -96);
    ctx.quadraticCurveTo(138, -58, 128, 76);
    ctx.quadraticCurveTo(92, 48, 86, -8);
    ctx.quadraticCurveTo(72, -38, 42, -30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Yellow horn grime smudge (fades when washed!)
    if (visuals.grimeAlpha > 0.02) {
      ctx.fillStyle = `rgba(38, 30, 14, ${0.52 * visuals.grimeAlpha})`;
      ctx.beginPath();
      ctx.ellipse(98, -18, 28, 40, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Right Golden Bell
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(124, 82, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // CENTER BLUE HORN
    const blueGrad = ctx.createLinearGradient(-35, -140, 55, -35);
    blueGrad.addColorStop(0, '#38bdf8');
    blueGrad.addColorStop(0.5, '#1d6fa5');
    blueGrad.addColorStop(1, '#17385c');
    ctx.fillStyle = blueGrad;
    ctx.beginPath();
    ctx.moveTo(-48, -62);
    ctx.quadraticCurveTo(-8, -124, 34, -146);
    ctx.quadraticCurveTo(64, -92, 54, -44);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // LEFT RED HORN — Torn open showing Brain (Steps 1-4a) -> Restored Red Horn + Bell (Step 4b+)!
    if (visuals.redHornAttached) {
      const redGrad = ctx.createLinearGradient(-130, -60, -20, 40);
      redGrad.addColorStop(0, '#dc2626');
      redGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = redGrad;
      ctx.beginPath();
      ctx.moveTo(-28, -94);
      ctx.quadraticCurveTo(-136, -54, -128, 74);
      ctx.quadraticCurveTo(-94, 42, -84, -8);
      ctx.quadraticCurveTo(-68, -42, -38, -32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Left Golden Bell
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-124, 80, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Torn crimson collar stump exposing the skull brain cavity!
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(-78, -24);
      ctx.lineTo(-92, -62);
      ctx.lineTo(-68, -86);
      ctx.lineTo(-32, -82);
      ctx.lineTo(-22, -46);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Exposed Brain inside torn skull top!
      if (!visuals.oldBrainRemoved) {
        // Dried golden-brown brain (exact match to thumb_maxres.jpg!)
        ctx.fillStyle = '#b48a3e';
        ctx.strokeStyle = '#5c4114';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(-42, -96, 36, 26, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Brain folds
        ctx.beginPath();
        ctx.arc(-52, -96, 12, 0.2, Math.PI * 1.4);
        ctx.arc(-30, -98, 12, 0.5, Math.PI * 1.6);
        ctx.stroke();
      } else if (visuals.newBrainImplanted) {
        // Fresh glowing neon-green transplanted brain!
        const bg = ctx.createRadialGradient(-42, -96, 5, -42, -96, 56);
        bg.addColorStop(0, 'rgba(74, 255, 118, 0.85)');
        bg.addColorStop(1, 'rgba(74, 255, 118, 0)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(-42, -96, 56, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6cf574';
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(-42, -96, 34, 24, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Empty dark brain cavity ready for transplant
        ctx.fillStyle = '#1a1214';
        ctx.beginPath();
        ctx.ellipse(-42, -92, 30, 20, -0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ---- ICONIC WHITE SKULL-JESTER FACE MASK (thumb_maxres.jpg!) ----
    const faceGrad = ctx.createRadialGradient(-16, -24, 18, 0, 0, 96);
    faceGrad.addColorStop(0, '#f8fafc');
    faceGrad.addColorStop(0.75, '#dbe0e6');
    faceGrad.addColorStop(1, '#9ca3af');
    ctx.fillStyle = faceGrad;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 88, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Mask rim colors (red/blue/yellow jester trim)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 91, -Math.PI * 0.72, -Math.PI * 0.15);
    ctx.stroke();

    // Pink Crayon Scribble Eyebrows & Nose (from thumb_maxres.jpg — washed off in Step 10!)
    if (visuals.grimeAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = visuals.grimeAlpha;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-46, -48);
      ctx.lineTo(-10, -56);
      ctx.moveTo(12, -52);
      ctx.lineTo(52, -32);
      ctx.stroke();
      // Pink/dirty triangle nose smudge
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(-14, 6);
      ctx.lineTo(14, 6);
      ctx.closePath();
      ctx.fill();
      // Scratches & dirt
      ctx.fillStyle = 'rgba(40, 32, 26, 0.35)';
      ctx.beginPath();
      ctx.arc(-44, 10, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(46, -12, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Hollow Black Eye Sockets
    ctx.fillStyle = '#050608';
    ctx.beginPath();
    ctx.ellipse(-34, -16, 24, 30, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(34, -14, 24, 30, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Crimson Left Eye Pupil (pulses vividly!)
    const eyeGlowR = isSpookyClose ? 26 : 16;
    const redGlow = ctx.createRadialGradient(-34, -16, 2, -34, -16, eyeGlowR);
    redGlow.addColorStop(0, '#ffffff');
    redGlow.addColorStop(0.28, '#ff2438');
    redGlow.addColorStop(1, 'rgba(255, 24, 48, 0)');
    ctx.fillStyle = redGlow;
    ctx.beginPath();
    ctx.arc(-34, -16, eyeGlowR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff3b4e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-34, -16, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Iconic Jagged Vertical-Toothed Grin!
    ctx.save();
    ctx.fillStyle = '#090b0f';
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-70, 6);
    ctx.quadraticCurveTo(0, 62, 70, 4);
    ctx.quadraticCurveTo(56, 74, 0, 74);
    ctx.quadraticCurveTo(-56, 74, -70, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sharp vertical teeth (yellowish-dirty -> gleaming bright white after Step 4!)
    const toothBright = Math.round(185 + visuals.teethCleanFrac * 65);
    const toothBlue = Math.round(160 + visuals.teethCleanFrac * 92);
    ctx.fillStyle = `rgb(${toothBright}, ${toothBright}, ${toothBlue})`;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    for (let i = -6; i <= 6; i++) {
      const tx = i * 10;
      const curveY = 26 + (36 - Math.abs(i) * 4.2);
      const topY = 14 + (22 - Math.abs(i) * 3.1);
      ctx.beginPath();
      ctx.moveTo(tx - 4.5, topY);
      ctx.lineTo(tx + 4.5, topY);
      ctx.lineTo(tx + 3.5, curveY);
      ctx.lineTo(tx - 3.5, curveY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Embedded Forehead Dagger (Step 1 — slides outward smoothly as player pulls!)
    if (!visuals.knifeRemoved && !isSidePeek) {
      const pull = visuals.knifePullFrac;
      ctx.save();
      ctx.translate(22 + pull * 96, -52 - pull * 86);
      ctx.rotate(0.75);
      // Steel blade
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 56);
      ctx.lineTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Crossguard & hilt
      ctx.fillStyle = '#78562b';
      ctx.fillRect(-18, -6, 36, 9);
      ctx.strokeRect(-18, -6, 36, 9);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-6, -42, 12, 36);
      ctx.strokeRect(-6, -42, 12, 36);
      ctx.restore();
    }

    // Cassette Memory Slot glow on collar/neck when inserted!
    if (visuals.cassetteInserted && !isSidePeek) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.85)';
      ctx.fillRect(-26, 102, 52, 14);
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-26, 102, 52, 14);
    }

    ctx.restore(); // end head
    ctx.restore(); // end upper torso
  }

  function drawASMRFoamOverlay(ctx, coverage, time) {
    ctx.save();
    // Deterministic fluffy cloud cluster covering Prototype (sb0_02 f10-11!)
    const blobs = [
      [0, -190, 62], [-56, -160, 52], [58, -158, 54],
      [-22, -110, 58], [32, -108, 56], [0, -52, 64],
      [-74, -20, 52], [74, -18, 52], [-44, 38, 58],
      [44, 38, 58], [0, 88, 60], [-104, 72, 48],
      [104, 72, 48], [0, 165, 56], [-56, 210, 50],
      [56, 210, 50], [0, 255, 62]
    ];
    const visibleCount = Math.ceil(blobs.length * coverage);
    for (let i = 0; i < visibleCount; i++) {
      const [bx, by, br] = blobs[i];
      const scale = Math.min(1, coverage * 1.4 - i * 0.03) * (0.96 + 0.04 * Math.sin(time * 4 + i));
      if (scale <= 0.05) continue;
      const r = br * scale;
      const g = ctx.createRadialGradient(bx - r * 0.25, by - r * 0.25, r * 0.1, bx, by, r);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
      g.addColorStop(0.75, 'rgba(235, 244, 250, 0.9)');
      g.addColorStop(1, 'rgba(198, 212, 224, 0.78)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPolishSparkles(ctx, intensity, time) {
    const pts = [[-85, -180], [92, -150], [-125, -45], [118, 20], [0, -230], [45, -75]];
    ctx.save();
    for (let i = 0; i < pts.length; i++) {
      const [sx, sy] = pts[i];
      const s = (0.5 + 0.5 * Math.sin(time * 5.5 + i * 1.3)) * 16 * intensity;
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
