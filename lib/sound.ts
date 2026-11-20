"use client";

/**
 * Procedural Audio Synthesizer Engine
 * Pure Web Audio API synthesis with zero external assets.
 */

type OscillatorType = "square" | "sine" | "triangle" | "sawtooth";

class SoundEngine {
  private ac: AudioContext | null = null;
  private mg: GainNode | null = null; // Master Gain
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  
  // Wind generator nodes
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;

  public isEnabled: boolean = false;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  private lastScrollTickY: number = 0;
  private lastDragTime: number = 0;
  private hasPlayedFanfare: boolean = false;
  private lastSectionId: string = "";

  constructor() {
    // Lazy init on first user interaction
  }

  public subscribe(cb: (enabled: boolean) => void) {
    this.listeners.add(cb);
    cb(this.isEnabled);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isEnabled));
  }

  private initAudio() {
    if (this.ac) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ac = new AudioContextClass();
      this.ac = ac;

      // Master Gain
      const mg = ac.createGain();
      mg.gain.setValueAtTime(1, ac.currentTime);
      mg.connect(ac.destination);
      this.mg = mg;

      // 1. Setup Ambient Hum Nodes (55Hz, 82.4Hz, 110.5Hz)
      const ambientGain = ac.createGain();
      ambientGain.gain.setValueAtTime(0, ac.currentTime);
      ambientGain.connect(mg);
      this.ambientGain = ambientGain;

      const freqs = [55, 82.4, 110.5];
      const gains = [0.035, 0.02, 0.012];

      this.ambientOscs = freqs.map((f, i) => {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ac.currentTime);

        const g = ac.createGain();
        g.gain.setValueAtTime(gains[i], ac.currentTime);

        osc.connect(g);
        g.connect(ambientGain);
        osc.start();
        return osc;
      });

      // 2. Setup Continuous Wind Generator (White noise through bandpass)
      this.setupWind(ac, mg);
    } catch {
      // AudioContext not supported
    }
  }

  private setupWind(ac: AudioContext, mg: GainNode) {
    try {
      // 2-second looped white noise buffer
      const bufferSize = ac.sampleRate * 2;
      const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ac.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ac.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(300, ac.currentTime);
      filter.Q.setValueAtTime(1.8, ac.currentTime);
      this.windFilter = filter;

      const windGain = ac.createGain();
      windGain.gain.setValueAtTime(0, ac.currentTime);
      this.windGain = windGain;

      whiteNoise.connect(filter);
      filter.connect(windGain);
      windGain.connect(mg);

      whiteNoise.start();
      this.windSource = whiteNoise;
    } catch {
      // ignore
    }
  }

  /**
   * Core Sound Primitive:
   * Plays a synthesized frequency tone with exponential fade out and optional pitch slide.
   */
  public tone(
    f: number,
    d: number,
    type: OscillatorType,
    v: number,
    f2?: number
  ) {
    if (!this.isEnabled || !this.ac || !this.mg) return;
    const ac = this.ac;
    if (ac.state === "suspended") ac.resume();

    try {
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();

      o.type = type;
      o.frequency.setValueAtTime(Math.max(1, f), t);
      if (f2 && f2 > 0) {
        o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t + d);
      }

      g.gain.setValueAtTime(Math.max(0.0001, v), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);

      o.connect(g);
      g.connect(this.mg);

      o.start(t);
      o.stop(t + d + 0.03);
    } catch {
      // ignore tone errors
    }
  }

  /**
   * Toggle Global Sound System
   */
  public toggle(): boolean {
    this.initAudio();
    if (!this.ac) return false;

    if (this.ac.state === "suspended") {
      this.ac.resume();
    }

    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      // 1. Ambient hum fade in (0.05 volume)
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0.05, this.ac.currentTime, 0.2);
      }
      // 2. Play Power-on jingle
      this.playPowerOn();
    } else {
      // Fade out ambient hum & wind
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0, this.ac.currentTime, 0.15);
      }
      if (this.windGain) {
        this.windGain.gain.setTargetAtTime(0, this.ac.currentTime, 0.15);
      }
    }

    this.notify();
    return this.isEnabled;
  }

  // ── SOUND SPECIFICATION IMPLEMENTATIONS ──

  /**
   * 1. Power-on jingle: square, 392, 523, 659, 784 Hz, 70 ms apart, 180 ms each, vol 0.04
   */
  public playPowerOn() {
    const freqs = [392, 523, 659, 784];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.tone(f, 0.18, "square", 0.04);
      }, i * 70);
    });
  }

  /**
   * 2. Scroll tick: Every 90px scrolled, square, 900 Hz falling to 380 Hz, 50 ms, vol 0.02 - 0.05
   */
  public handleScroll(scrollY: number, totalHeight: number, speed: number) {
    if (!this.isEnabled) return;

    // Check 90px tick threshold
    if (Math.abs(scrollY - this.lastScrollTickY) >= 90) {
      this.lastScrollTickY = scrollY;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      const pitch = 900 - progress * (900 - 380);
      const vol = Math.min(0.05, Math.max(0.02, 0.02 + speed * 0.003));
      this.tone(pitch, 0.05, "square", vol);

      // Check Finish fanfare if reached bottom
      if (progress >= 0.99 && !this.hasPlayedFanfare) {
        this.hasPlayedFanfare = true;
        this.playFinishFanfare();
      } else if (progress < 0.95) {
        this.hasPlayedFanfare = false;
      }
    }

    // 3. Wind modulation: 300 Hz plus 45 Hz per unit of speed, up to 0.13 volume
    if (this.ac && this.windGain && this.windFilter) {
      const targetGain = Math.min(0.13, speed * 0.015);
      const targetFreq = Math.min(2400, 300 + 45 * speed);
      const t = this.ac.currentTime;

      this.windFilter.frequency.setTargetAtTime(targetFreq, t, 0.08);
      this.windGain.gain.setTargetAtTime(targetGain, t, 0.08);
    }
  }

  public stopWind() {
    if (this.ac && this.windGain) {
      this.windGain.gain.setTargetAtTime(0, this.ac.currentTime, 0.18);
    }
  }

  /**
   * 4. Level up: Entering a new section, square, 523, 659, 784, 1047 Hz, 75 ms apart (reverse if going up)
   */
  public notifySection(sectionId: string, goingDown: boolean = true) {
    if (!sectionId || sectionId === this.lastSectionId) return;
    this.lastSectionId = sectionId;

    if (!this.isEnabled) return;
    const freqs = goingDown ? [523, 659, 784, 1047] : [784, 659, 523];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.tone(f, 0.18, "square", 0.045);
      }, i * 75);
    });
  }

  /**
   * 5. Coin: Card/tile first scrolls into view, square, 988 Hz (70ms) then 1319 Hz (200ms), vol 0.04
   */
  public playCoin() {
    this.tone(988, 0.07, "square", 0.04);
    setTimeout(() => {
      this.tone(1319, 0.2, "square", 0.04);
    }, 70);
  }

  /**
   * 6. Select: Click link, button or tile, square, 660 Hz sliding to 440 Hz, 70 ms, vol 0.04
   */
  public playSelect() {
    this.tone(660, 0.07, "square", 0.04, 440);
  }

  /**
   * 7. Hover tick: Mouse over a link or button, square, 1200 Hz, 30 ms, vol 0.015
   */
  public playHoverTick() {
    this.tone(1200, 0.03, "square", 0.015);
  }

  /**
   * 8. Menu open: sawtooth, 300 Hz sliding to 900 Hz, 220 ms, vol 0.03
   */
  public playMenuOpen() {
    this.tone(300, 0.22, "sawtooth", 0.03, 900);
  }

  /**
   * 9. Menu close: sawtooth, 700 Hz sliding down to 250 Hz, 220 ms, vol 0.03
   */
  public playMenuClose() {
    this.tone(700, 0.22, "sawtooth", 0.03, 250);
  }

  /**
   * 10. Hero boing: Tap hero, sine, 300 Hz sliding to 80 Hz, 280 ms, vol 0.08
   */
  public playHeroBoing() {
    this.tone(300, 0.28, "sine", 0.08, 80);
  }

  /**
   * 11. Finish fanfare: Reaching bottom, triangle, 523, 659, 784, 1047, 1319, 1568 Hz, 95 ms apart, vol 0.07
   */
  public playFinishFanfare() {
    const freqs = [523, 659, 784, 1047, 1319, 1568];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.tone(f, 0.18, "triangle", 0.07);
      }, i * 95);
    });
  }

  /**
   * 12. Touch pop: Finger touches empty space, triangle, 280 to 1000 Hz by screen position, sliding 1.5x, 100 ms, vol 0.05
   */
  public playTouchPop(normY: number) {
    const clampedY = Math.max(0, Math.min(1, normY));
    const f = 280 + (1 - clampedY) * 720;
    this.tone(f, 0.1, "triangle", 0.05, f * 1.5);
  }

  /**
   * 13. Drag tone: Finger moves while pressed, sine, same pitch map, 50 ms, every 80 ms, vol 0.03
   */
  public playDragTone(normY: number) {
    const now = Date.now();
    if (now - this.lastDragTime < 80) return;
    this.lastDragTime = now;

    const clampedY = Math.max(0, Math.min(1, normY));
    const f = 280 + (1 - clampedY) * 720;
    this.tone(f, 0.05, "sine", 0.03);
  }

  /**
   * 14. Release thud: Finger lifts, sine, 170 Hz sliding to 110 Hz, 90 ms, vol 0.05
   */
  public playReleaseThud() {
    this.tone(170, 0.09, "sine", 0.05, 110);
  }

  /**
   * 15. Marquee charge: Hold scrolling text, sawtooth, 220 Hz sliding to 700 Hz, 500 ms, vol 0.025
   */
  public playMarqueeCharge() {
    this.tone(220, 0.5, "sawtooth", 0.025, 700);
  }

  /**
   * 16. Marquee release: Let go of marquee, triangle, 700 Hz sliding to 300 Hz, 100 ms, vol 0.04
   */
  public playMarqueeRelease() {
    this.tone(700, 0.1, "triangle", 0.04, 300);
  }

  /**
   * 17. Motion on: square, 523, 784 Hz, 180 ms each, vol 0.04
   */
  public playMotionOn() {
    this.tone(523, 0.18, "square", 0.04);
    setTimeout(() => {
      this.tone(784, 0.18, "square", 0.04);
    }, 180);
  }
}

// Export singleton engine instance
export const soundEngine = new SoundEngine();
