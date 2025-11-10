// Audio.js - Zvukový engine pro Velký Americký Závod
// Web Audio API pro procedurální 8-bit zvuky

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.engineOscillator = null;
        this.engineGain = null;
        this.initialized = false;
    }

    // Inicializace audio contextu
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioContext.destination);
            this.initialized = true;

            // Spustit engine zvuk
            this.startEngineSound();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Zvuk motoru (kontinuální)
    startEngineSound() {
        if (!this.initialized || this.engineOscillator) return;

        this.engineOscillator = this.audioContext.createOscillator();
        this.engineGain = this.audioContext.createGain();

        this.engineOscillator.type = 'sawtooth';
        this.engineOscillator.frequency.value = 80;
        this.engineGain.gain.value = 0.1;

        this.engineOscillator.connect(this.engineGain);
        this.engineGain.connect(this.masterGain);

        this.engineOscillator.start();
    }

    // Aktualizovat zvuk motoru podle rychlosti
    updateEngineSound(speed, maxSpeed) {
        if (!this.initialized || !this.engineOscillator) return;

        const minFreq = 80;
        const maxFreq = 200;
        const freq = minFreq + (speed / maxSpeed) * (maxFreq - minFreq);

        this.engineOscillator.frequency.setTargetAtTime(
            freq,
            this.audioContext.currentTime,
            0.1
        );

        // Hlasitost podle rychlosti
        const volume = 0.1 + (speed / maxSpeed) * 0.15;
        this.engineGain.gain.setTargetAtTime(
            volume,
            this.audioContext.currentTime,
            0.1
        );
    }

    // Zvuk kolize/srážky
    playCollision() {
        if (!this.initialized) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.value = 100;
        gain.gain.value = 0.3;

        // Sweep down
        osc.frequency.exponentialRampToValueAtTime(
            30,
            this.audioContext.currentTime + 0.3
        );
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.3
        );

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    // Klakson
    playHorn() {
        if (!this.initialized) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.value = 400;
        gain.gain.value = 0.2;

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.15
        );

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    }

    // Zvuk brždění/smyk
    playSkid() {
        if (!this.initialized) return;

        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.5, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.5
        );

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
        noise.stop(this.audioContext.currentTime + 0.5);
    }

    // Zvuk tankování
    playRefuel() {
        if (!this.initialized) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = 200;
        gain.gain.value = 0.15;

        // Sweep up
        osc.frequency.linearRampToValueAtTime(
            600,
            this.audioContext.currentTime + 0.3
        );
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.3
        );

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    // Zvuk dokončení státu
    playStateComplete() {
        if (!this.initialized) return;

        // Vítězná melodie (3 tóny)
        const notes = [523, 659, 784]; // C, E, G
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.value = 0.2;

                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    this.audioContext.currentTime + 0.25
                );

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start();
                osc.stop(this.audioContext.currentTime + 0.25);
            }, i * 120);
        });
    }

    // Zvuk sněhové bouře (ambient)
    playSnowstormAmbient() {
        if (!this.initialized) return;

        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 3, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();

        // Auto-stop po 3 sekundách
        setTimeout(() => {
            gain.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + 1
            );
            setTimeout(() => noise.stop(), 1000);
        }, 2000);
    }

    // Zvuk deště (ambient)
    playRainAmbient() {
        if (!this.initialized) return;

        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 3, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.08;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();

        // Auto-stop
        setTimeout(() => {
            gain.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + 1
            );
            setTimeout(() => noise.stop(), 1000);
        }, 2000);
    }

    // Zvuk pouštního větru
    playDesertWindAmbient() {
        if (!this.initialized) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = 150;
        gain.gain.value = 0.05;

        // Modulace větru
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(180, this.audioContext.currentTime + 1);
        osc.frequency.linearRampToValueAtTime(150, this.audioContext.currentTime + 2);

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 2.5
        );

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 2.5);
    }

    // Zastavit všechny zvuky
    stopAll() {
        if (this.engineOscillator) {
            try {
                this.engineOscillator.stop();
            } catch (e) {
                // Already stopped
            }
            this.engineOscillator = null;
        }
    }

    // Nastavit hlavní hlasitost
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
}
