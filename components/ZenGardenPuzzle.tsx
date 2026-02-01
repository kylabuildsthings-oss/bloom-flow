'use client';

import { useState, useEffect, useRef } from 'react';
import { playClickSound } from '@/lib/sound-effects';

const DURATION_OPTIONS = [
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '20 min', minutes: 20 },
] as const;

const GRID_COLS = 6;
const GRID_ROWS = 6;
const TOTAL_TILES = GRID_COLS * GRID_ROWS;

export function ZenGardenPuzzle({ onClose, inline }: { onClose?: () => void; inline?: boolean }) {
  const [phase, setPhase] = useState<'select' | 'playing' | 'complete'>('select');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [timerSec, setTimerSec] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const totalPausedRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  const totalSec = durationMinutes * 60;

  // Compute how many tiles should be revealed based on elapsed time (only when not paused)
  useEffect(() => {
    if (phase !== 'playing' || paused) return;

    const loop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 - totalPausedRef.current;
      const remaining = Math.max(0, totalSec - elapsed);
      setTimerSec(Math.ceil(remaining));

      if (remaining <= 0) {
        setRevealedCount(TOTAL_TILES);
        setPhase('complete');
        return;
      }

      const progress = elapsed / totalSec;
      const toReveal = Math.min(TOTAL_TILES, Math.floor(progress * TOTAL_TILES));
      setRevealedCount(toReveal);
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [phase, paused, totalSec]);

  const startSession = (minutes: number) => {
    setDurationMinutes(minutes);
    setPhase('playing');
    setTimerSec(minutes * 60);
    setRevealedCount(0);
    setPaused(false);
    startTimeRef.current = Date.now();
    totalPausedRef.current = 0;
    pausedAtRef.current = 0;
    playClickSound();
  };

  const togglePause = () => {
    if (phase !== 'playing') return;
    if (paused) {
      totalPausedRef.current += (Date.now() - pausedAtRef.current) / 1000;
      setPaused(false);
    } else {
      pausedAtRef.current = Date.now();
      setPaused(true);
    }
    playClickSound();
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const wrapperClass = inline
    ? 'relative w-full max-w-lg rounded-2xl overflow-hidden border-2 border-stone-500 shadow-xl bg-gradient-to-b from-stone-700 to-stone-800'
    : 'relative w-full max-w-lg rounded-2xl overflow-hidden border-2 border-stone-500 shadow-2xl bg-gradient-to-b from-stone-700 to-stone-800';
  const outerClass = inline ? 'relative w-full' : 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm';

  return (
    <div className={outerClass}>
      <div className={wrapperClass}>
        <div className="flex items-center justify-between px-4 py-3 bg-stone-800/80 border-b border-stone-600">
          <h2 className="text-xl font-bold text-amber-100">Zen Garden Puzzle</h2>
          {!inline && onClose && (
            <button
              type="button"
              onClick={() => { playClickSound(); onClose(); }}
              className="p-2 rounded-lg text-stone-300 hover:bg-stone-600 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {phase === 'select' && (
          <div className="p-6 space-y-6">
            <p className="text-stone-200 text-center text-sm">
              A calming puzzle that reveals a garden scene as your session runs. Choose your session length—the puzzle only advances while the timer runs. Pause your workout, and the puzzle pauses. Perfect for yoga, walking, or mindful movement.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DURATION_OPTIONS.map(({ label, minutes }) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => startSession(minutes)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-stone-700/80 hover:bg-stone-600 border-2 border-stone-500 text-stone-100 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl">🌸</span>
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              ))}
            </div>
            <p className="text-stone-400 text-xs text-center">
              When the timer reaches 0, the full garden is revealed. Use Pause if you need to take a break.
            </p>
          </div>
        )}

        {(phase === 'playing' || phase === 'complete') && (
          <>
            <div className="flex justify-between items-center px-4 py-2 bg-stone-800/60 border-b border-stone-600 text-stone-200 text-sm">
              <span>Time: {formatTime(timerSec)}</span>
              <span>{revealedCount} / {TOTAL_TILES} revealed</span>
              {phase === 'playing' && (
                <button
                  type="button"
                  onClick={togglePause}
                  className="px-3 py-1 rounded-lg bg-stone-600 hover:bg-stone-500 text-stone-100 text-xs font-medium"
                >
                  {paused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>

            <div className="p-4">
              <div
                className="relative w-full rounded-xl overflow-hidden border-2 border-stone-600"
                style={{ aspectRatio: '1' }}
              >
                {/* Illustrated garden scene (behind tiles) */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200/90 to-emerald-100">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                    {/* Sky gradient */}
                    <defs>
                      <linearGradient id="zen-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#bbf7d0" />
                      </linearGradient>
                      <linearGradient id="zen-hill" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#86efac" />
                      </linearGradient>
                      <linearGradient id="zen-flower1" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                      <radialGradient id="zen-sun">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#fde047" stopOpacity="0.6" />
                      </radialGradient>
                    </defs>
                    <rect width="400" height="400" fill="url(#zen-sky)" />
                    {/* Sun */}
                    <circle cx="320" cy="80" r="50" fill="url(#zen-sun)" />
                    {/* Distant hills */}
                    <ellipse cx="200" cy="380" rx="220" ry="80" fill="url(#zen-hill)" opacity="0.9" />
                    <ellipse cx="80" cy="400" rx="120" ry="60" fill="#86efac" opacity="0.85" />
                    <ellipse cx="320" cy="400" rx="100" ry="50" fill="#4ade80" opacity="0.85" />
                    {/* Grass tufts */}
                    <path d="M 50 320 Q 55 280 50 240 Q 60 260 70 320 Z" fill="#22c55e" opacity="0.9" />
                    <path d="M 120 340 Q 125 300 120 260 Q 130 280 140 340 Z" fill="#16a34a" opacity="0.9" />
                    <path d="M 280 330 Q 285 290 280 250 Q 290 270 300 330 Z" fill="#22c55e" opacity="0.9" />
                    <path d="M 350 310 Q 355 270 350 230 Q 360 250 370 310 Z" fill="#16a34a" opacity="0.9" />
                    {/* Flowers */}
                    <circle cx="100" cy="300" r="14" fill="#f472b6" />
                    <circle cx="100" cy="300" r="6" fill="#fbbf24" />
                    <circle cx="180" cy="320" r="12" fill="#c084fc" />
                    <circle cx="180" cy="320" r="5" fill="#fde047" />
                    <circle cx="220" cy="310" r="15" fill="#f472b6" />
                    <circle cx="220" cy="310" r="7" fill="#fbbf24" />
                    <circle cx="300" cy="315" r="11" fill="#a78bfa" />
                    <circle cx="300" cy="315" r="5" fill="#fef08a" />
                    <circle cx="340" cy="290" r="13" fill="#fb7185" />
                    <circle cx="340" cy="290" r="6" fill="#fde047" />
                    {/* Leaves */}
                    <ellipse cx="200" cy="260" rx="80" ry="25" fill="#22c55e" opacity="0.8" />
                    <ellipse cx="200" cy="270" rx="70" ry="20" fill="#16a34a" opacity="0.8" />
                  </svg>
                </div>

                {/* Overlay grid - tiles that hide/reveal */}
                <div className="absolute inset-0 grid gap-px p-px" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
                  {Array.from({ length: TOTAL_TILES }, (_, i) => {
                    const isRevealed = i < revealedCount || phase === 'complete';
                    return (
                      <div
                        key={i}
                        className={`transition-all duration-500 ${isRevealed ? 'bg-transparent' : 'bg-stone-800/95'}`}
                        style={{ transitionProperty: 'background-color, opacity' }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {phase === 'complete' && (
              <div className="mt-4 p-4 rounded-xl bg-stone-800/80 border border-stone-600 text-center">
                <p className="text-xl font-bold text-green-400 mb-1">Session complete</p>
                <p className="text-stone-300 text-sm mb-3">You stayed with it—the garden is fully revealed. Great for mindful movement.</p>
                <button
                  type="button"
                  onClick={() => { setPhase('select'); playClickSound(); }}
                  className="px-4 py-2 rounded-lg bg-amber-700 text-amber-100 font-semibold hover:bg-amber-600 transition-colors"
                >
                  Choose another session
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
