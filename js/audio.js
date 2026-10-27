/**
 * DSA Simulator - Audio Engine (Web Audio API)
 * Synthesizes pure sound effects without any external audio files.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.masterVolume = 0.25;
        this.initFromStorage();
    }

    initFromStorage() {
        const saved = localStorage.getItem('dsa_sound_enabled');
        if (saved !== null) {
            this.enabled = saved === 'true';
        }
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('dsa_sound_enabled', this.enabled);
        return this.enabled;
    }

    setEnabled(val) {
        this.enabled = !!val;
        localStorage.setItem('dsa_sound_enabled', this.enabled);
    }

    playSound(type, extra = {}) {
        if (!this.enabled) return;
        try {
            this.ensureContext();
            if (!this.ctx) return;

            switch (type) {
                case 'compare':
                    this.playTone(520, 'sine', 0.08, 0.15);
                    break;
                case 'move':
                    this.playTone(380, 'sine', 0.06, 0.12);
                    break;
                case 'success':
                case 'found':
                    this.playChord([523.25, 659.25, 783.99], 0.22, 0.2); // C5 - E5 - G5
                    break;
                case 'insert':
                    this.playArpeggio([440, 554.37, 659.25], 0.05, 0.2); // A major
                    break;
                case 'delete':
                    this.playArpeggio([587.33, 440, 329.63], 0.06, 0.22); // Descending
                    break;
                case 'push':
                    this.playSlide(240, 480, 0.1, 'triangle', 0.22);
                    break;
                case 'pop':
                    this.playSlide(480, 220, 0.12, 'sine', 0.22);
                    break;
                case 'error':
                    this.playErrorSound();
                    break;
                case 'visit':
                    const pitch = extra.value ? 280 + (Math.abs(extra.value) % 40) * 15 : 440;
                    this.playTone(pitch, 'triangle', 0.1, 0.18);
                    break;
                case 'step':
                    this.playTone(400, 'sine', 0.04, 0.08);
                    break;
                case 'reverse':
                    this.playChord([440, 554, 659], 0.18, 0.15);
                    break;
                default:
                    this.playTone(440, 'sine', 0.05, 0.1);
            }
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSlide(startFreq, endFreq, duration = 0.1, type = 'sine', gainVal = 0.2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(gainVal * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playChord(freqs, duration = 0.2, gainVal = 0.15) {
        freqs.forEach(f => {
            this.playTone(f, 'sine', duration, gainVal / freqs.length);
        });
    }

    playArpeggio(freqs, noteDelay = 0.05, duration = 0.18) {
        freqs.forEach((f, idx) => {
            setTimeout(() => {
                if (this.ctx) {
                    this.playTone(f, 'sine', duration, 0.15);
                }
            }, idx * (noteDelay * 1000));
        });
    }

    playErrorSound() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.2 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
    }
}

// Global audio singleton
window.sound = new AudioEngine();
