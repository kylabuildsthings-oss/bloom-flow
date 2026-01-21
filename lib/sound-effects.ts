/**
 * Sound effects system with user control
 */

let audioContext: AudioContext | null = null;
let soundEnabled = true;

export function initSoundSystem() {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
  if (!soundEnabled || !audioContext) return;

  try {
    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Envelope for click sound
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
}

export function playClickSound() {
  if (!audioContext) {
    initSoundSystem();
  }
  // Pleasant click sound - two quick tones
  playTone(800, 0.05, 'sine');
  setTimeout(() => playTone(1000, 0.05, 'sine'), 10);
}

export function playSuccessSound() {
  if (!audioContext) {
    initSoundSystem();
  }
  // Success sound - ascending tones
  playTone(523, 0.1, 'sine'); // C
  setTimeout(() => playTone(659, 0.1, 'sine'), 100); // E
  setTimeout(() => playTone(784, 0.15, 'sine'), 200); // G
}

export function playPlantGrowSound() {
  if (!audioContext) {
    initSoundSystem();
  }
  // Gentle grow sound - soft ascending tone
  playTone(400, 0.2, 'sine');
  setTimeout(() => playTone(500, 0.2, 'sine'), 50);
}
