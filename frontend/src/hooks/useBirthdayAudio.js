import { useCallback, useRef, useState } from 'react';

/**
 * Manages romantic background music + answer sound effects.
 *
 * Audio files must be placed in frontend/public/audio/:
 *   romantic-bg.mp3   – soft looping background music
 *   correct-chime.mp3 – sparkle/chime for correct answers
 *   wrong-cute.mp3    – gentle boop for wrong answers
 *   final-chime.mp3   – magical chime for the final transition
 *
 * Music only starts after the user taps "Open our little world 💌".
 * If audio is blocked or files are missing the experience continues silently.
 */
export function useBirthdayAudio() {
  const bgRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const mutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const startBg = useCallback(async () => {
    try {
      if (!bgRef.current) {
        bgRef.current = new Audio('/audio/romantic-bg.mp3');
        bgRef.current.loop = true;
        bgRef.current.volume = 0.25;
      }
      await bgRef.current.play();
    } catch {
      // Browser autoplay policy blocked audio – continue silently
    }
  }, []);

  const playSound = useCallback(async (src, volume = 0.4) => {
    if (mutedRef.current) return;
    try {
      const sfx = new Audio(src);
      sfx.volume = volume;
      await sfx.play();
    } catch {
      // Missing file or blocked – ignore
    }
  }, []);

  const playCorrect = useCallback(
    () => playSound('/audio/correct-chime.mp3', 0.42),
    [playSound]
  );
  const playWrong = useCallback(
    () => playSound('/audio/wrong-cute.mp3', 0.3),
    [playSound]
  );
  const playFinal = useCallback(
    () => playSound('/audio/final-chime.mp3', 0.48),
    [playSound]
  );

  /** Smoothly fade out background music over ~2 seconds then pause. */
  const fadeBg = useCallback(() => {
    if (!bgRef.current) return;
    clearInterval(fadeIntervalRef.current);
    const steps = 20;
    const stepMs = 100; // 2 000 ms total
    let step = 0;
    const startVol = bgRef.current.volume;
    fadeIntervalRef.current = setInterval(() => {
      step++;
      if (bgRef.current) {
        bgRef.current.volume = Math.max(0, startVol * (1 - step / steps));
      }
      if (step >= steps) {
        clearInterval(fadeIntervalRef.current);
        if (bgRef.current) bgRef.current.pause();
      }
    }, stepMs);
  }, []);

  const stopBg = useCallback(() => {
    clearInterval(fadeIntervalRef.current);
    if (bgRef.current) {
      bgRef.current.pause();
      bgRef.current.currentTime = 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (bgRef.current) {
        bgRef.current.volume = next ? 0 : 0.25;
      }
      return next;
    });
  }, []);

  return { startBg, playCorrect, playWrong, playFinal, fadeBg, stopBg, toggleMute, isMuted };
}
