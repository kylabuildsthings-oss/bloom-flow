'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dumbbell, Target, Sparkles, Moon, Utensils, Activity, Brain, ArrowRight } from 'lucide-react';
import { RecommendationEngine, Recommendation } from '@/lib/recommendation-engine';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { GameStorage } from '@/lib/game-storage';
import { HealthDataStorage } from '@/lib/storage';
import { GardenState, GardenZone } from '@/lib/game-engine';

const GENERIC_TIPS = [
  'Move on most days of the week—consistency beats intensity.',
  'Warm up for 5–10 minutes and cool down with stretching.',
  'Listen to your body: rest when you need it; push when you feel strong.',
  'Mix cardio (walking, running, cycling) with strength (bodyweight, weights).',
  'Prioritize sleep and recovery—they fuel your next workout.',
];

export function CottageWorkoutPlans() {
  const [currentPhase, setCurrentPhase] = useState<CyclePhase | null>(null);
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const [workoutRec, setWorkoutRec] = useState<Recommendation | null>(null);
  const [tailoredTips, setTailoredTips] = useState<string[]>([]);
  const [hasCycleData, setHasCycleData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setTailoredTips([]);

    // Load cycle phase
    const cycleData = await HealthDataStorage.getSensitive('cycle_data');
    if (cycleData && Array.isArray(cycleData) && cycleData.length > 0) {
      setHasCycleData(true);
      const cycleHistory = cycleData.map((d: { date: string }) => ({
        periodStart: new Date(d.date),
        symptoms: [] as { name: string; severity: number; category: string; date: Date }[],
        date: new Date(d.date),
      }));
      const today = new Date();
      const phaseProbs = CycleEngine.predictPhase(cycleHistory, today);
      const topPhase = phaseProbs.reduce((max, p) =>
        p.probability > max.probability ? p : max
      );
      setCurrentPhase(topPhase.phase);
      const recs = RecommendationEngine.getWorkoutRecommendations(topPhase.phase);
      setWorkoutRec(recs[0] ?? null);
    } else {
      setHasCycleData(false);
      setCurrentPhase(null);
      setWorkoutRec(null);
    }

    // Load garden state for tailored tips
    const garden = await GameStorage.loadGardenState();
    setGardenState(garden ?? null);

    if (garden?.plants) {
      const tips: string[] = [];
      const levels = garden.plants.reduce((acc, p) => {
        acc[p.zone] = p.level;
        return acc;
      }, {} as Record<GardenZone, number>);
      const zones: GardenZone[] = ['sleep', 'nutrition', 'movement', 'stress'];
      const lowestZone = zones.reduce((min, z) =>
        (levels[z] ?? 0) < (levels[min] ?? 0) ? z : min
      );
      const lowestLevel = levels[lowestZone] ?? 0;
      if (lowestLevel <= 2 && lowestZone === 'sleep') {
        tips.push('Your sleep garden could use more care—prioritize rest to fuel your workouts.');
      } else if (lowestLevel <= 2 && lowestZone === 'nutrition') {
        tips.push('Support your workouts with regular meals and hydration; your nutrition garden will thank you.');
      } else if (lowestLevel <= 2 && lowestZone === 'movement') {
        tips.push('Start small: short walks or 10 minutes of movement count. Your movement garden grows with consistency.');
      } else if (lowestLevel <= 2 && lowestZone === 'stress') {
        tips.push('Include stress-reduction and recovery days—they help your body adapt to exercise.');
      }
      const movementLevel = levels.movement ?? 0;
      if (movementLevel >= 5 && tips.length < 2) {
        tips.push('Your movement habit is strong. Consider adding intensity or variety (e.g. strength or a new activity).');
      }
      setTailoredTips(tips);
    }

    setIsLoading(false);
  };

  const phaseLabel = currentPhase
    ? currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)
    : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent-100">
          <Dumbbell className="w-8 h-8 text-accent-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-accent-800">Workout Plans & Recommendations</h2>
          <p className="text-sm text-neutral-600">
            General tips for everyone, plus a plan tailored to your cycle phase and your Body Garden.
          </p>
        </div>
      </div>

      {/* Generic workout recommendations */}
      <section className="mb-8">
        <h3 className="font-semibold text-accent-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-600" />
          General workout tips
        </h3>
        <ul className="space-y-2 text-neutral-700 text-sm">
          {GENERIC_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent-500 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tailored workout plan */}
      <section>
        <h3 className="font-semibold text-accent-800 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-600" />
          Your tailored workout plan
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          Based on your cycle phase and your Body Garden (sleep, nutrition, movement, stress).
        </p>

        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading your plan...</p>
        ) : (
          <>
            {hasCycleData && phaseLabel && workoutRec ? (
              <div className="p-4 rounded-lg bg-primary-50 border border-primary-200 mb-4">
                <p className="text-sm font-semibold text-primary-800 mb-1">
                  You&apos;re in the {phaseLabel} phase
                </p>
                <h4 className="font-bold text-primary-900 mb-2">{workoutRec.title}</h4>
                <p className="text-sm text-primary-800 mb-2">{workoutRec.description}</p>
                {workoutRec.disclaimer && (
                  <p className="text-xs text-primary-700 italic">{workoutRec.disclaimer}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-neutral-100 border border-neutral-200 mb-4">
                <p className="text-sm text-neutral-700">
                  Add your cycle data in the app to get phase-based workout plans. Track in the Body Garden and sync your cycle for personalized recommendations.
                </p>
                <Link
                  href="/garden"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Go to Body Garden
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {gardenState && tailoredTips.length > 0 && (
              <div className="p-4 rounded-lg bg-accent-50 border border-accent-200">
                <p className="text-sm font-semibold text-accent-800 mb-2">Based on your Body Garden</p>
                <ul className="space-y-1 text-sm text-accent-900">
                  {tailoredTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent-600 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-accent-700">
                  <span className="flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5" /> Sleep {gardenState.plants.find(p => p.zone === 'sleep')?.level ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5" /> Nutrition {gardenState.plants.find(p => p.zone === 'nutrition')?.level ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Movement {gardenState.plants.find(p => p.zone === 'movement')?.level ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5" /> Stress {gardenState.plants.find(p => p.zone === 'stress')?.level ?? 0}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
