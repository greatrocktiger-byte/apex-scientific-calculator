/**
 * Hyper-realistic physical calculator switch acoustics.
 * Emulates the tactile tactile "thock" of rubber dome switches on real scientific calculators.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSound = localStorage.getItem('apex_calc_sound');
      this.soundEnabled = storedSound !== null ? storedSound === 'true' : true;

      const storedHaptic = localStorage.getItem('apex_calc_haptic');
      this.hapticsEnabled = storedHaptic !== null ? storedHaptic === 'true' : true;
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_calc_sound', String(enabled));
    }
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_calc_haptic', String(enabled));
    }
  }

  public triggerHaptic(duration = 6) {
    if (!this.hapticsEnabled || typeof window === 'undefined') return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } catch {}
  }

  // Realistic rubber-dome membrane switch click (damped micro-thock)
  public playKeyClick(type: 'num' | 'op' | 'fn' | 'eq' | 'clear' = 'num') {
    this.triggerHaptic(type === 'eq' ? 12 : 5);
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Realistic noise burst filtered to sound like physical plastic contact
      const bufferSize = this.ctx.sampleRate * 0.015; // 15ms short click
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Decaying noise
        const decay = Math.exp(-i / (bufferSize * 0.25));
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to model physical key plastic resonant frequency (~1800Hz - 2400Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const centerFreq =
        type === 'eq' ? 1200 : type === 'op' ? 1600 : type === 'clear' ? 2200 : 1900;
      filter.frequency.setValueAtTime(centerFreq, now);
      filter.Q.setValueAtTime(3.5, now);

      // Low thump oscillator for dome bottoming out
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = type === 'eq' ? 160 : 210;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.018);

      oscGain.gain.setValueAtTime(0.04, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.05, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      noise.connect(filter);
      filter.connect(masterGain);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      masterGain.connect(this.ctx.destination);

      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.02);
      noise.stop(now + 0.02);
    } catch {}
  }

  public playDigitClick() {
    this.playKeyClick('num');
  }

  public playOperatorClick() {
    this.playKeyClick('op');
  }

  public playSciClick() {
    this.playKeyClick('fn');
  }

  public playEqualSuccess() {
    this.playKeyClick('eq');
  }

  public playClearSound() {
    this.playKeyClick('clear');
  }

  public playErrorSound() {
    this.triggerHaptic(18);
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.09);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }
}

export const sound = new SoundService();
