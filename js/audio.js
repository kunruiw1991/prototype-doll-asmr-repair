/* ============================================================================
   js/audio.js — Procedural Web Audio ASMR Sound Synthesizer
   Zero external audio assets; tactile, cozy & eerie ASMR sounds for all 24 steps
   ============================================================================ */
(function (root) {
  'use strict';

  class ASMRAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.noiseBuf = null;
      this._lastScrubAt = 0;
    }

    unlock() {
      if (!this.enabled) return;
      const AudioCtx = root.AudioContext || root.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this._buildNoiseBuffer();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    setEnabled(val) {
      this.enabled = Boolean(val);
    }

    _buildNoiseBuffer() {
      if (!this.ctx) return;
      const len = this.ctx.sampleRate * 1.5;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuf = buf;
    }

    _playNoise(duration, filterType, freq, q, gainPeak, endFreq) {
      if (!this.enabled || !this.ctx || !this.noiseBuf) return;
      const now = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType || 'bandpass';
      filter.frequency.setValueAtTime(freq, now);
      if (endFreq) {
        filter.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
      }
      filter.Q.setValueAtTime(q || 1.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gainPeak, now + Math.min(0.025, duration * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now, Math.random() * 0.4);
      src.stop(now + duration + 0.02);
    }

    _playTone(type, f0, f1, duration, gainPeak, delay) {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime + (delay || 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(Math.max(30, f0), now);
      if (f1 && f1 !== f0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, f1), now + duration);
      }
      gain.gain.setValueAtTime(0.0008, now);
      gain.gain.linearRampToValueAtTime(gainPeak, now + Math.min(0.02, duration * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    play(name, throttleMs) {
      if (!this.enabled) return;
      this.unlock();
      if (!this.ctx) return;
      const nowMs = Date.now();
      if (throttleMs && nowMs - this._lastScrubAt < throttleMs) return;
      if (throttleMs) this._lastScrubAt = nowMs;

      switch (name) {
        case 'metallicPull':
          this._playNoise(0.26, 'bandpass', 2200, 3.5, 0.14, 900);
          this._playTone('triangle', 680, 1480, 0.16, 0.09);
          break;
        case 'fridgeOpen':
          this._playTone('sawtooth', 160, 95, 0.22, 0.08);
          this._playNoise(0.18, 'lowpass', 750, 1.0, 0.11);
          break;
        case 'brainSquish':
          this._playNoise(0.24, 'bandpass', 520, 4.2, 0.15, 240);
          this._playTone('sine', 240, 130, 0.2, 0.09);
          break;
        case 'brainGlow':
          this._playTone('sine', 330, 660, 0.35, 0.1);
          this._playTone('triangle', 495, 990, 0.32, 0.07, 0.08);
          break;
        case 'crtType':
          this._playTone('square', 920 + Math.random() * 520, 700, 0.045, 0.045);
          this._playNoise(0.035, 'highpass', 2600, 1.5, 0.06);
          break;
        case 'stitchZip':
          this._playNoise(0.12, 'bandpass', 3200, 3.0, 0.11, 1800);
          this._playTone('sine', 840, 1180, 0.09, 0.05);
          break;
        case 'dentalScrub':
          this._playNoise(0.1, 'bandpass', 3600, 2.5, 0.1, 4400);
          break;
        case 'craneServo':
          this._playTone('sawtooth', 110, 185, 0.42, 0.08);
          this._playNoise(0.35, 'bandpass', 950, 2.0, 0.08, 600);
          break;
        case 'wrenchRatchet':
          this._playTone('square', 1100, 820, 0.04, 0.07);
          this._playTone('square', 1240, 900, 0.04, 0.07, 0.06);
          this._playNoise(0.06, 'highpass', 3000, 2.0, 0.07);
          break;
        case 'tankBubble':
          this._playTone('sine', 280, 620, 0.14, 0.09);
          this._playTone('sine', 360, 790, 0.16, 0.08, 0.1);
          this._playTone('sine', 420, 940, 0.14, 0.07, 0.2);
          break;
        case 'ribSnap':
          this._playTone('triangle', 480, 190, 0.09, 0.14);
          this._playNoise(0.07, 'bandpass', 1800, 2.4, 0.12);
          break;
        case 'steelDoor':
          this._playTone('sawtooth', 135, 78, 0.36, 0.11);
          this._playNoise(0.32, 'bandpass', 650, 2.2, 0.14, 240);
          break;
        case 'metallicClank':
          this._playTone('triangle', 920, 340, 0.16, 0.14);
          this._playTone('sine', 1480, 720, 0.12, 0.08, 0.02);
          break;
        case 'furnaceSizzle':
          this._playNoise(0.18, 'bandpass', 2400, 1.1, 0.11, 3800);
          this._playTone('sawtooth', 140, 190, 0.15, 0.05);
          break;
        case 'foamSpray':
          this._playNoise(0.14, 'highpass', 2800, 0.9, 0.11, 4600);
          break;
        case 'waterJet':
          this._playNoise(0.15, 'bandpass', 1750, 0.7, 0.14, 2600);
          break;
        case 'cassetteClick':
          this._playTone('square', 420, 220, 0.05, 0.1);
          this._playTone('square', 640, 320, 0.06, 0.11, 0.07);
          break;
        case 'polishBuff':
          this._playNoise(0.11, 'bandpass', 3800, 2.8, 0.08, 5200);
          this._playTone('sine', 1200, 1650, 0.08, 0.035);
          break;
        case 'paperFlip':
          this._playNoise(0.16, 'bandpass', 1600, 1.4, 0.11, 900);
          break;
        case 'bulbScrew':
          this._playTone('sine', 640, 920, 0.08, 0.06);
          this._playNoise(0.08, 'highpass', 3400, 3.0, 0.07);
          break;
        case 'bulbOn':
          this._playTone('sine', 520, 880, 0.22, 0.11);
          this._playTone('triangle', 1040, 1320, 0.2, 0.06, 0.05);
          break;
        case 'tweezerPop':
          this._playTone('sine', 520, 1180, 0.08, 0.11);
          this._playNoise(0.05, 'bandpass', 2200, 2.5, 0.08);
          break;
        case 'scissorSnip':
          this._playNoise(0.09, 'highpass', 3800, 2.2, 0.12, 6200);
          this._playTone('triangle', 1600, 950, 0.05, 0.08);
          break;
        case 'aerosolMist':
          this._playNoise(0.14, 'highpass', 3600, 0.8, 0.11, 5200);
          break;
        case 'plushGrab':
          this._playNoise(0.12, 'lowpass', 900, 1.0, 0.12, 420);
          this._playTone('sine', 210, 310, 0.09, 0.06);
          break;
        case 'liquidPour':
          this._playNoise(0.28, 'bandpass', 950, 2.6, 0.13, 1650);
          this._playTone('sine', 380, 560, 0.22, 0.07);
          break;
        case 'washerSpin':
          this._playNoise(0.15, 'bandpass', 620, 1.8, 0.12, 980);
          this._playTone('sine', 95, 135, 0.15, 0.07);
          break;
        case 'hairDryer':
          this._playNoise(0.16, 'bandpass', 1200, 0.9, 0.1, 1400);
          this._playTone('sine', 180, 195, 0.14, 0.045);
          break;
        case 'cottonPuff':
          this._playNoise(0.12, 'lowpass', 1100, 0.9, 0.1, 600);
          break;
        case 'airbrushHiss':
          this._playNoise(0.13, 'highpass', 4000, 0.9, 0.09, 5400);
          break;
        case 'hairBrush':
          this._playNoise(0.13, 'bandpass', 2400, 1.6, 0.1, 1600);
          break;
        case 'capsuleClick':
          this._playTone('sine', 420, 260, 0.12, 0.11);
          this._playTone('triangle', 840, 1280, 0.1, 0.07, 0.05);
          break;
        case 'wrongBuzzer':
          this._playTone('sawtooth', 220, 165, 0.18, 0.1);
          this._playTone('sawtooth', 185, 135, 0.2, 0.09, 0.12);
          break;
        case 'stepComplete':
          this._playTone('triangle', 523.25, 523.25, 0.16, 0.11, 0);
          this._playTone('triangle', 659.25, 659.25, 0.16, 0.11, 0.09);
          this._playTone('triangle', 783.99, 1046.5, 0.28, 0.12, 0.18);
          break;
        case 'spookyAwaken':
          this._playTone('sawtooth', 72, 46, 0.95, 0.12);
          this._playTone('sine', 54, 42, 1.1, 0.13, 0.05);
          this._playNoise(0.4, 'bandpass', 420, 2.0, 0.11, 160);
          break;
        case 'cozyFinale':
          this._playTone('sine', 523.25, 523.25, 0.25, 0.1, 0);
          this._playTone('sine', 659.25, 659.25, 0.25, 0.1, 0.1);
          this._playTone('sine', 783.99, 783.99, 0.25, 0.1, 0.2);
          this._playTone('sine', 1046.5, 1046.5, 0.45, 0.12, 0.3);
          break;
        default:
          this._playTone('sine', 600, 760, 0.08, 0.06);
          break;
      }
    }
  }

  const EXPORT = { ASMRAudio };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRAudioEngine = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
