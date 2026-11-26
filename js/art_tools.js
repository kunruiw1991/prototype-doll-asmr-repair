/* ============================================================================
   js/art_tools.js — Illustrated Handheld Tools, Target Pulses & ASMR Particles
   ============================================================================ */
(function (root) {
  'use strict';

  function drawTargetGuide(ctx, target, mode, time, isInteracting) {
    if (!target) return;
    const pulse = 0.5 + 0.5 * Math.sin(time * 4.8);
    const r = Math.max(36, target.r * (0.72 + pulse * 0.08));

    ctx.save();
    // Subtle pulsing dashed ring
    ctx.strokeStyle = isInteracting ? 'rgba(74, 222, 128, 0.92)' : `rgba(250, 204, 21, ${0.55 + pulse * 0.35})`;
    ctx.lineWidth = isInteracting ? 4.5 : 3.5;
    ctx.setLineDash([12, 8]);
    ctx.lineDashOffset = -time * 28;
    ctx.beginPath();
    ctx.arc(target.x, target.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Soft glowing center beacon
    const g = ctx.createRadialGradient(target.x, target.y, 4, target.x, target.y, r * 0.75);
    g.addColorStop(0, isInteracting ? 'rgba(74, 222, 128, 0.22)' : 'rgba(250, 204, 21, 0.16)');
    g.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(target.x, target.y, r * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Directional Pull Arrow for Pull Mode (Step 1 Dagger!)
    if (mode === 'pull' && (target.dx || target.dy)) {
      const len = 0.65 + pulse * 0.25;
      const ex = target.x + target.dx * len;
      const ey = target.y + target.dy * len;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(target.x, target.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      const ang = Math.atan2(target.dy, target.dx);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - Math.cos(ang - 0.5) * 18, ey - Math.sin(ang - 0.5) * 18);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - Math.cos(ang + 0.5) * 18, ey - Math.sin(ang + 0.5) * 18);
      ctx.stroke();
    }

    // Horizontal Sweep Wave for Scrub Mode
    if (target.scrubRequired) {
      const sx = target.x + Math.sin(time * 5.2) * (r * 0.52);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(sx, target.y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawHeldTool(ctx, toolId, x, y, isDown, time) {
    if (!toolId || x == null || y == null) return;
    ctx.save();
    ctx.translate(x, y);
    const tilt = isDown ? -0.22 + Math.sin(time * 24) * 0.08 : -0.1;
    ctx.rotate(tilt);

    switch (toolId) {
      case 'spoons':
        // Iconic Dual Metal Spoons from thumb_maxres.jpg!
        for (const s of [-1, 1]) {
          ctx.save();
          ctx.rotate(s * (isDown ? 0.14 : 0.26));
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(s * 24, 96);
          ctx.lineTo(s * 16, 8);
          ctx.stroke();
          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(s * 15, -12, 13, 28, s * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        // Teal surgical glove holding spoons
        drawGloveGrip(ctx, 18, 92, '#0d9488');
        break;

      case 'foam_gun':
      case 'water_jet':
        // Chrome trigger nozzle spraying white foam or pressurized water jet!
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.fillRect(0, -10, 74, 20);
        ctx.strokeRect(0, -10, 74, 20);
        ctx.fillStyle = toolId === 'foam_gun' ? '#f8fafc' : '#38bdf8';
        ctx.fillRect(58, 10, 22, 56);
        ctx.strokeRect(58, 10, 22, 56);
        if (isDown) {
          if (toolId === 'water_jet') {
            ctx.strokeStyle = 'rgba(186, 230, 253, 0.9)';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(-140, -14 + Math.sin(time * 40) * 6);
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            for (let i = 0; i < 5; i++) {
              ctx.beginPath();
              ctx.arc(-18 - i * 16, (Math.sin(time * 30 + i) * 10), 8 + i * 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        break;

      case 'aerosol':
        // Red & Yellow Stain Spray Can (sb0_03 f25!)
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 3;
        ctx.fillRect(10, 8, 44, 84);
        ctx.strokeRect(10, 8, 44, 84);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(12, 30, 40, 26);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(22, -6, 20, 14);
        if (isDown) {
          const g = ctx.createRadialGradient(-24, -4, 4, -36, -4, 54);
          g.addColorStop(0, 'rgba(241, 245, 249, 0.85)');
          g.addColorStop(1, 'rgba(241, 245, 249, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(-36, -4, 54, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'hairdryer':
        // Silver & Purple Hair Dryer (sb0_04 f12!)
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(34, 0, 44, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#475569';
        ctx.fillRect(40, 18, 22, 62);
        if (isDown) {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
          ctx.lineWidth = 4;
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(-16, i * 14);
            ctx.quadraticCurveTo(-54, i * 14 + Math.sin(time * 25 + i) * 8, -96, i * 18);
            ctx.stroke();
          }
        }
        break;

      case 'scissors':
      case 'tailor_scissors':
        // Scissors snapping open & shut!
        const open = isDown ? Math.abs(Math.sin(time * 22)) * 0.25 : 0.22;
        for (const s of [-1, 1]) {
          ctx.save();
          ctx.rotate(s * open);
          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-26, 0);
          ctx.lineTo(36, s * 7);
          ctx.lineTo(36, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = toolId === 'scissors' ? '#eab308' : '#cbd5e1';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.arc(52, s * 18, 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        break;

      case 'needle':
        // Silver sewing needle with trailing purple/crimson thread!
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(-18, -6);
        ctx.lineTo(66, 22);
        ctx.stroke();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.bezierCurveTo(96, 6, 84, 58, 118, 42);
        ctx.stroke();
        break;

      case 'airbrush':
        // Silver Airbrush with Purple Dye Cup!
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        ctx.fillRect(-10, -7, 94, 14);
        ctx.strokeRect(-10, -7, 94, 14);
        ctx.fillStyle = '#9333ea';
        ctx.fillRect(22, -36, 24, 30);
        ctx.strokeRect(22, -36, 24, 30);
        if (isDown) {
          const mg = ctx.createRadialGradient(-34, 0, 4, -46, 0, 52);
          mg.addColorStop(0, 'rgba(168, 85, 247, 0.78)');
          mg.addColorStop(1, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = mg;
          ctx.beginPath();
          ctx.arc(-46, 0, 52, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'hairbrush':
        // Wooden Oval Hairbrush
        ctx.fillStyle = '#a87952';
        ctx.strokeStyle = '#452b15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 46, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillRect(10, 36, 20, 62);
        ctx.strokeRect(10, 36, 20, 62);
        break;

      case 'cotton':
        // Fluffy white cloud tuft
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        for (const [cx, cy, cr] of [[0, 0, 22], [-16, 6, 16], [16, 4, 17], [0, -14, 16]]) {
          ctx.beginPath();
          ctx.arc(cx, cy, cr, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        break;

      case 'cassette':
      case 'red_cassette':
        ctx.fillStyle = toolId === 'red_cassette' ? '#dc2626' : '#181c22';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.fillRect(-38, -24, 76, 48);
        ctx.strokeRect(-38, -24, 76, 48);
        ctx.fillStyle = '#fef2f2';
        ctx.beginPath();
        ctx.arc(-16, 4, 7, 0, Math.PI * 2);
        ctx.arc(16, 4, 7, 0, Math.PI * 2);
        ctx.fill();
        break;

      default:
        // Precision gloved hand / pliers / wrench / tweezers generic sleek silhouette
        drawGloveGrip(ctx, 18, 22, '#0d9488');
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-12, -10);
        ctx.lineTo(24, 20);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  function drawGloveGrip(ctx, gx, gy, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#064e4b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(gx, gy, 28, 22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles(ctx, particles) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const EXPORT = { drawTargetGuide, drawHeldTool, drawParticles };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRTools = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
