'use client';

import { useState } from 'react';
import { Play, Droplets, Flower2 } from 'lucide-react';
import { playClickSound } from '@/lib/sound-effects';
import { PulseRiverGame } from '@/components/PulseRiverGame';
import { ZenGardenPuzzle } from '@/components/ZenGardenPuzzle';

type FocusGame = null | 'pulse-river' | 'zen-garden';

export function FocusFactory() {
  const [activeGame, setActiveGame] = useState<FocusGame>(null);

  return (
    <div className="relative w-full min-h-[280px] rounded-lg overflow-hidden border-2 border-[#8B7355] bg-gradient-to-b from-[#F5E6D3] via-[#E8D5B7] to-[#D2B48C] shadow-soft-lg">
      <div className="relative z-10 p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#5C4A37] mb-2">Focus Factory</h2>
          <p className="text-[#8B7355]">Timed focus games to play during your workout</p>
        </div>

        {/* Focus Games */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-[#5C4A37] mb-4">Focus Games</h3>
          <p className="text-sm text-[#8B7355] mb-4">
            Timed games to play during your workout. The game timer matches your workout duration. Pause the workout, and the game pauses.
          </p>
          {activeGame === null ? (
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveGame('pulse-river');
                  try { playClickSound(); } catch (_) {}
                }}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gradient-to-br from-[#2d5a4a] to-[#1e4d3a] text-white border-2 border-[#3d7a6a] hover:from-[#3d7a6a] hover:to-[#2d5a4a] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-soft cursor-pointer"
              >
                <Droplets className="w-8 h-8 text-sky-200" />
                <div className="text-left">
                  <div className="font-bold text-lg">Pulse River</div>
                  <div className="text-sm text-sky-100/90">Catch orbs that match your workout type. Miss 3 and the game ends.</div>
                </div>
                <Play className="w-5 h-5 shrink-0" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveGame('zen-garden');
                  try { playClickSound(); } catch (_) {}
                }}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gradient-to-br from-[#4a5d3a] to-[#3d4d2e] text-white border-2 border-[#5a6d4a] hover:from-[#5a6d4a] hover:to-[#4a5d3a] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-soft cursor-pointer"
              >
                <Flower2 className="w-8 h-8 text-amber-100" />
                <div className="text-left">
                  <div className="font-bold text-lg">Zen Garden Puzzle</div>
                  <div className="text-sm text-amber-100/90">A calming puzzle that reveals a garden as your session runs. Perfect for yoga &amp; mindful movement.</div>
                </div>
                <Play className="w-5 h-5 shrink-0" />
              </button>
              <p className="mt-4 text-sm text-[#8B7355]/90 italic">
                These are our first focus games—more games coming soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="text-sm text-[#5C4A37] hover:underline"
              >
                ← Back to games
              </button>
              {activeGame === 'pulse-river' && <PulseRiverGame inline />}
              {activeGame === 'zen-garden' && <ZenGardenPuzzle inline />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
