import { Howl } from 'howler';

// Placeholder for audio files - we will expect them in /public/sounds/
// You should download effects as per CDC and place them:
// /public/sounds/bg-ambient.mp3
// /public/sounds/alarm.mp3
// /public/sounds/glitch.mp3

class AudioManager {
    private bgMusic: Howl | null = null;
    private alarmSound: Howl | null = null;
    private glitchSound: Howl | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.initSounds();
        }
    }

    private initSounds() {
        this.bgMusic = new Howl({
            src: ['/sounds/bg-ambient.mp3'],
            loop: true,
            volume: 0.3,
        });

        this.alarmSound = new Howl({
            src: ['/sounds/alarm.mp3'],
            volume: 0.8,
        });

        this.glitchSound = new Howl({
            src: ['/sounds/glitch.mp3'],
            volume: 0.5,
        });
    }

    playBackground() {
        if (this.bgMusic && !this.bgMusic.playing()) {
            this.bgMusic.play();
            this.bgMusic.fade(0, 0.3, 2000);
        }
    }

    playAlarm() {
        this.alarmSound?.play();
    }

    playGlitch() {
        this.glitchSound?.play();
    }

    setIntensity(level: number) {
        // Increase volume or pitch based on war intensity?
        // For now just a placeholder
        if (this.bgMusic) {
            this.bgMusic.volume(0.3 + (level * 0.1));
        }
    }
}

export const audioManager = new AudioManager();
