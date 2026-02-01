'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { playSuccessSound, playClickSound } from '@/lib/sound-effects';

type WorkoutType = 'calm' | 'intensity' | 'recovery';
type OrbType = 'leaf' | 'fire' | 'droplet';

const ORB_CONFIG: Record<OrbType, { emoji: string; label: string; color: string }> = {
  leaf: { emoji: '🍃', label: 'Calm', color: 'text-green-600' },
  fire: { emoji: '🔥', label: 'Intensity', color: 'text-amber-600' },
  droplet: { emoji: '💧', label: 'Recovery', color: 'text-sky-600' },
};

interface Orb {
  id: number;
  type: OrbType;
  x: number; // 0–100 (% of container)
  y: number; // 0–100 (% of container height)
}

const WORKOUT_DURATION_SEC = 60; // 1 min default; link to workout duration
const TARGET_CATCHES = 10; // "Complete" workout by catching this many matching orbs
const BASKET_WIDTH_PCT = 18;
const ORB_SIZE = 32;
const SPAWN_INTERVAL_MS = 1200;
const FALL_SPEED = 1.2; // % per frame
const MISS_LIMIT = 3;

export function PulseRiverGame({ onClose, inline }: { onClose?: () => void; inline?: boolean }) {
  const [phase, setPhase] = useState<'select' | 'playing' | 'won' | 'lost'>('select');
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [timerSec, setTimerSec] = useState(WORKOUT_DURATION_SEC);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [basketX, setBasketX] = useState(50); // 0–100 (%)
  const containerRef = useRef<HTMLDivElement>(null);
  const orbIdRef = useRef(0);
  const animationRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const basketXRef = useRef(50);

  const targetOrbType: OrbType = workoutType === 'calm' ? 'leaf' : workoutType === 'intensity' ? 'fire' : 'droplet';

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { missesRef.current = misses; }, [misses]);
  useEffect(() => { basketXRef.current = basketX; }, [basketX]);

  useEffect(() => {
    if (phase === 'playing' && misses >= MISS_LIMIT) setPhase('lost');
  }, [phase, misses]);

  // Basket follow mouse/touch
  const updateBasket = useCallback((clientX: number) => {
    if (!containerRef.current || phase !== 'playing') return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(BASKET_WIDTH_PCT / 2, Math.min(100 - BASKET_WIDTH_PCT / 2, pct)));
  }, [phase]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      if (clientX != null) updateBasket(clientX);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [updateBasket]);

  // Game loop: fall orbs, spawn, collision, timer
  useEffect(() => {
    if (phase !== 'playing') return;

    const startTime = performance.now();
    let lastSpawn = startTime;

    const loop = (now: number) => {
      const dt = (now - startTime) / 1000;
      const elapsed = Math.floor(dt);
      const remaining = Math.max(0, WORKOUT_DURATION_SEC - elapsed);
      setTimerSec(remaining);

      if (remaining <= 0) {
        setPhase(scoreRef.current >= TARGET_CATCHES ? 'won' : 'lost');
        return;
      }

      if (missesRef.current >= MISS_LIMIT) {
        setPhase('lost');
        return;
      }

      // Spawn orbs
      if (now - lastSpawn > SPAWN_INTERVAL_MS) {
        lastSpawn = now;
        const types: OrbType[] = ['leaf', 'fire', 'droplet'];
        setOrbs(prev => [
          ...prev,
          {
            id: ++orbIdRef.current,
            type: types[Math.floor(Math.random() * 3)],
            x: 10 + Math.random() * 80,
            y: 0,
          },
        ]);
      }

      // Move orbs down and check collision / miss
      const basketLeft = basketXRef.current - BASKET_WIDTH_PCT / 2;
      const basketRight = basketXRef.current + BASKET_WIDTH_PCT / 2;
      const catchY = 88;
      const missY = 96;

      setOrbs(prev => {
        const next = prev.map(o => ({ ...o, y: o.y + FALL_SPEED }));
        const toRemove = new Set<number>();
        let caughtMatch = false;
        let missCount = 0;

        next.forEach(o => {
          if (o.y >= catchY && o.y <= catchY + 8) {
            const inBasket = o.x >= basketLeft && o.x <= basketRight;
            if (inBasket) {
              if (o.type === targetOrbType) caughtMatch = true;
              toRemove.add(o.id);
            }
          }
          if (o.y > missY && o.type === targetOrbType) {
            toRemove.add(o.id);
            missCount += 1;
          }
        });

        if (caughtMatch) {
          playSuccessSound();
          setScore(s => s + 1);
        }
        if (missCount > 0) setMisses(m => m + missCount);

        return next.filter(o => !toRemove.has(o.id) && o.y < 102);
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [phase, targetOrbType]);

  const startGame = (type: WorkoutType) => {
    setWorkoutType(type);
    setPhase('playing');
    setTimerSec(WORKOUT_DURATION_SEC);
    setScore(0);
    setMisses(0);
    setOrbs([]);
    setBasketX(50);
    playClickSound();
  };

  const wrapperClass = inline
    ? 'relative w-full max-w-lg rounded-2xl overflow-hidden border-2 border-stone-500 shadow-xl bg-gradient-to-b from-stone-700 to-stone-800'
    : 'relative w-full max-w-lg rounded-2xl overflow-hidden border-2 border-stone-500 shadow-2xl bg-gradient-to-b from-stone-700 to-stone-800';
  const outerClass = inline
    ? 'relative w-full'
    : 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm';

  return (
    <div className={outerClass}>
      <div className={wrapperClass}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-800/80 border-b border-stone-600">
          <h2 className="text-xl font-bold text-amber-100">Pulse River</h2>
          {!inline && onClose && (
            <button
              type="button"
              onClick={() => { playClickSound(); onClose(); }}
              className="p-2 rounded-lg text-stone-300 hover:bg-stone-600 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {phase === 'select' && (
          <div className="p-6 space-y-6">
            <p className="text-stone-200 text-center text-sm">
              Choose your workout type. Catch orbs that match it in the river. Miss 3 matching orbs and the game ends. Catch {TARGET_CATCHES}+ before time runs out to complete your workout.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(['calm', 'intensity', 'recovery'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => startGame(type)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-stone-700/80 hover:bg-stone-600 border-2 border-stone-500 text-stone-100 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-3xl">{ORB_CONFIG[type].emoji}</span>
                  <span className="text-sm font-semibold">{ORB_CONFIG[type].label}</span>
                </button>
              ))}
            </div>
            <p className="text-stone-400 text-xs text-center">
              Game timer = workout duration ({WORKOUT_DURATION_SEC}s). Move the basket with your mouse or finger.
            </p>
          </div>
        )}

        {(phase === 'playing' || phase === 'won' || phase === 'lost') && (
          <>
            {/* HUD */}
            <div className="flex justify-between px-4 py-2 bg-stone-800/60 border-b border-stone-600 text-stone-200 text-sm">
              <span>Timer: {timerSec}s</span>
              <span>Catches: {score} / {TARGET_CATCHES}</span>
              <span>Misses: {misses} / {MISS_LIMIT}</span>
            </div>

            {/* River + orbs + basket */}
            <div
              ref={containerRef}
              className="relative w-full h-[320px] overflow-hidden"
            >
              {/* Serene river background */}
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: 'linear-gradient(180deg, #1e3a5f 0%, #2d5a4a 40%, #1e4d3a 70%, #0f2d20 100%)',
                }}
              />
              {/* Water flow lines */}
              <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 w-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(180deg, transparent 0, transparent 24px, rgba(255,255,255,0.08) 24px, rgba(255,255,255,0.08) 26px)',
                    backgroundSize: '100% 32px',
                    animation: 'pulseRiverFlow 4s linear infinite',
                  }}
                />
              </div>

              {/* Orbs */}
              {orbs.map(orb => (
                <div
                  key={orb.id}
                  className="absolute text-3xl drop-shadow-lg pointer-events-none"
                  style={{
                    left: `calc(${orb.x}% - ${ORB_SIZE / 2}px)`,
                    top: `${orb.y}%`,
                    width: ORB_SIZE,
                    height: ORB_SIZE,
                    transition: 'top 0.05s linear',
                  }}
                >
                  {ORB_CONFIG[orb.type].emoji}
                </div>
              ))}

              {/* Basket - follows mouse */}
              <div
                className="absolute bottom-4 w-20 h-10 rounded-t-xl border-2 border-amber-700 bg-amber-800/90 shadow-lg flex items-center justify-center pointer-events-none"
                style={{
                  left: `${basketX}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <span className="text-2xl">{ORB_CONFIG[targetOrbType].emoji}</span>
              </div>
            </div>

            {/* Result overlay */}
            {(phase === 'won' || phase === 'lost') && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm">
                <div className="text-center p-6 rounded-2xl bg-stone-800 border-2 border-stone-600">
                  <p className={`text-2xl font-bold mb-2 ${phase === 'won' ? 'text-green-400' : 'text-amber-400'}`}>
                    {phase === 'won' ? 'Workout complete!' : 'Game over'}
                  </p>
                  <p className="text-stone-300 text-sm mb-4">
                    {phase === 'won' ? `You caught ${score} matching orbs.` : (misses >= MISS_LIMIT ? 'You missed 3 matching orbs.' : 'Time ran out.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setPhase('select'); setWorkoutType(null); playClickSound(); }}
                    className="px-4 py-2 rounded-lg bg-amber-700 text-amber-100 font-semibold hover:bg-amber-600 transition-colors"
                  >
                    Play again
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
