// Web Audio API Synthesizer for Detective Noir & Historical Atmosphere
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGainNode: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGainNode && this.ctx) {
      this.ambientGainNode.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft vintage click
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }

  // Typewriter stroke
  public playTypewriter() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      // Noise burst for mechanical strike
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800 + Math.random() * 400;
      filter.Q.value = 3;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      whiteNoise.start();
    } catch {
      // fallback
    }
  }

  // Heavy official stamp thump
  public playStamp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.18);
      
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // fallback
    }
  }

  // Paper rustle / dossier opening
  public playPaper() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.7;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.12);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      noise.start();
    } catch {
      // fallback
    }
  }

  // Evidence discovered chime
  public playClueFound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 0.45);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.5);
      });
    } catch {
      // fallback
    }
  }

  // Pin needle placed on corkboard
  public playPin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // fallback
    }
  }

  // Footstep sound for character walking
  public playStep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90 + Math.random() * 25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // fallback
    }
  }

  // Dialogue blip
  public playDialogue() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 + Math.random() * 80, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // fallback
    }
  }

  // Badge achievement unlock
  public playBadge() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.4);
      });
    } catch {
      // fallback
    }
  }

  // Puzzle success or mystery solved
  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const chord = [329.63, 440, 523.25, 659.25, 880]; // E, A, C, E, A
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
        
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + idx * 0.05 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 1.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 1.3);
      });
    } catch {
      // fallback
    }
  }

  // Atmospheric Detective Room Hum & Gentle Vinyl Crackle
  public toggleAtmosphere(enable: boolean) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      if (!enable && this.ambientSource) {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
        this.ambientSource = null;
        this.isAmbientPlaying = false;
        return;
      }
      
      if (enable && !this.isAmbientPlaying) {
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate subtle vinyl crackle + low warm room hum
        for (let i = 0; i < bufferSize; i++) {
          const hum = Math.sin((2 * Math.PI * 65 * i) / this.ctx.sampleRate) * 0.02;
          const crackle = Math.random() < 0.0015 ? (Math.random() * 2 - 1) * 0.25 : (Math.random() * 2 - 1) * 0.005;
          data[i] = hum + crackle;
        }
        
        this.ambientSource = this.ctx.createBufferSource();
        this.ambientSource.buffer = buffer;
        this.ambientSource.loop = true;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450;
        
        this.ambientGainNode = this.ctx.createGain();
        this.ambientGainNode.gain.value = this.isMuted ? 0 : 0.06;
        
        this.ambientSource.connect(filter);
        filter.connect(this.ambientGainNode);
        this.ambientGainNode.connect(this.ctx.destination);
        
        this.ambientSource.start();
        this.isAmbientPlaying = true;
      }
    } catch {
      // fallback
    }
  }
}

export const sound = new SoundManager();
