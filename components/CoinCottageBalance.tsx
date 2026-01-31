'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coins, Sprout, Gamepad2, ArrowRight, Info } from 'lucide-react';
import { GameStorage } from '@/lib/game-storage';
import { GardenState } from '@/lib/game-engine';

export function CoinCottageBalance() {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    GameStorage.loadGardenState().then(setGardenState);
  }, []);

  const coins = gardenState?.coins ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-100">
            <Coins className="w-8 h-8 text-accent-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-accent-800">Your Coins</h2>
            <p className="text-3xl font-bold text-accent-600 tabular-nums">{coins}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="How do I earn coins?"
          onClick={() => setShowInfo((v) => !v)}
          onBlur={() => setShowInfo(false)}
          className="p-1.5 rounded-full text-accent-600 hover:bg-accent-50 transition-colors"
          title="Coins are earned when you add information in the Body Garden and when your plants level up. Use them in the Focus Factory to play games."
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-4 p-4 rounded-lg bg-accent-50 border border-accent-200 text-sm text-accent-900">
          <p className="font-semibold mb-2">How the point system works</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Earn coins when you add information in the <strong>Body Garden</strong> (tracking sleep, nutrition, movement, stress).</li>
            <li>Earn bonus coins when a plant levels up.</li>
            <li>Spend coins in the <strong>Focus Factory</strong> to play games (coming soon).</li>
          </ul>
        </div>
      )}

      <p className="text-neutral-600 text-sm mb-4">
        Coins are linked to your Body Garden. The more you track and the more your plants grow, the more coins you collect. Use them in the Factory to play games when they&apos;re ready!
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/garden"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-sm"
        >
          <Sprout className="w-4 h-4" />
          Go to Body Garden
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/factory"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-accent-300 text-accent-700 font-semibold hover:bg-accent-50 transition-colors text-sm"
        >
          <Gamepad2 className="w-4 h-4" />
          Focus Factory (games coming soon)
        </Link>
      </div>
    </div>
  );
}
