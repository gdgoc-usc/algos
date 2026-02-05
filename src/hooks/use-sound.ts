import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Cleanup audio context on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  };

  const playTone = useCallback(
    (frequency: number, type: OscillatorType = "sine", duration = 0.1) => {
      if (isMuted) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Smooth attack and release to avoid clicking
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01); // volume 0.1
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [isMuted],
  );

  // Helper to play a sound based on a value (0-100)
  // Maps 0-100 to 200Hz-800Hz
  const playValue = useCallback(
    (value: number, max: number = 100) => {
      if (isMuted) return;

      const minFreq = 120;
      const maxFreq = 1200;
      // Linear mapping
      // const frequency = minFreq + (value / max) * (maxFreq - minFreq);

      // Logarithmic mapping (often sounds better musically)
      // but linear is fine for algos
      const frequency = minFreq + (value / max) * (maxFreq - minFreq);

      playTone(frequency, "triangle", 0.05);
    },
    [playTone, isMuted],
  );

  return { isMuted, setIsMuted, playTone, playValue };
}
