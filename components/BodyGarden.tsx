'use client';

import { useState, useEffect, useRef } from 'react';
import { Sprout, Info, Shield, TrendingUp, Flame, Award, Leaf } from 'lucide-react';
import { GameEngine, GardenState, Plant, GardenZone, ActivityLog } from '@/lib/game-engine';
import { GameStorage } from '@/lib/game-storage';
import { HealthEducation } from '@/lib/health-education';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { OpikEngagement } from '@/lib/opik-engagement';
import { ActivityLogger } from './ActivityLogger';
import { GameItemCard } from './GameItemCard';
import { IsometricGarden } from './IsometricGarden';
import { GardenCalendar } from './GardenCalendar';
import { playPlantGrowSound } from '@/lib/sound-effects';

export function BodyGarden() {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const [currentPhase, setCurrentPhase] = useState<CyclePhase | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [greenhouseDays, setGreenhouseDays] = useState(0);
  const [growingPlants, setGrowingPlants] = useState<Set<string>>(new Set());
  const [showSoilInfo, setShowSoilInfo] = useState(false);
  const prevLevelsRef = useRef<Map<string, number>>(new Map());
  const opik = useOpik();

  useEffect(() => {
    loadGarden();
  }, []);

  // Detect plant growth and trigger animation
  useEffect(() => {
    if (!gardenState) return;

    gardenState.plants.forEach(plant => {
      const prevLevel = prevLevelsRef.current.get(plant.id) ?? plant.level;
      
      if (plant.level > prevLevel) {
        // Plant grew!
        setGrowingPlants(prev => new Set(prev).add(plant.id));
        playPlantGrowSound();
        
        // Remove from growing set after animation
        setTimeout(() => {
          setGrowingPlants(prev => {
            const next = new Set(prev);
            next.delete(plant.id);
            return next;
          });
        }, 600);
      }
      
      prevLevelsRef.current.set(plant.id, plant.level);
    });
  }, [gardenState]);

  useEffect(() => {
    if (gardenState && currentPhase) {
      // Check for new discoveries
      const newDiscoveries = GameEngine.checkDiscoveries(gardenState, currentPhase);
      const unlocked = newDiscoveries.filter(
        id => !gardenState.discoveries.includes(id)
      );
      
      if (unlocked.length > 0) {
        // Update state with new discoveries (no discovery modal shown)
        const updated = {
            ...gardenState,
            discoveries: [...gardenState.discoveries, ...unlocked],
          };
          setGardenState(updated);
          GameStorage.saveGardenState(updated);
          
          OpikEngagement.trackEvent({
            type: 'discovery_unlocked',
            timestamp: new Date(),
            metadata: { discoveryId: unlocked[0] },
          }, opik);
      }
    }
  }, [gardenState, currentPhase, opik]);

  const loadGarden = async () => {
    setIsLoading(true);
    try {
      // Load garden state (never throws; returns demo state on failure)
      let state = await GameStorage.loadGardenState();
      if (!state) {
        state = GameStorage.getDemoGardenState();
      }

      // Update plants (daily maintenance)
      const updatedPlants = GameEngine.updateAllPlants(state.plants, state.greenhouseMode);

      // Check greenhouse mode
      let greenhouseMode = state.greenhouseMode;
      if (state.greenhouseUntil && new Date() > state.greenhouseUntil) {
        greenhouseMode = false;
      }

      // Get current cycle phase
      try {
        const cycleData = await HealthDataStorage.getSensitive('cycle_data');
        if (cycleData && cycleData.length > 0) {
          const cycleHistory = cycleData.map((d: any) => ({
            periodStart: new Date(d.date),
            symptoms: [],
            date: new Date(d.date),
          }));
          const today = new Date();
          const phaseProbs = CycleEngine.predictPhase(cycleHistory, today);
          const topPhase = phaseProbs.reduce((max, p) =>
            p.probability > max.probability ? p : max
          );
          setCurrentPhase(topPhase.phase);
        }
      } catch (_) {
        // Cycle phase is optional; garden still shows
      }

      const updatedState: GardenState = {
        ...state,
        plants: updatedPlants,
        greenhouseMode,
        lastUpdated: new Date(),
      };

      setGardenState(updatedState);

      OpikEngagement.trackEvent({
        type: 'garden_view',
        timestamp: new Date(),
      }, opik);
    } catch (_) {
      setGardenState(GameStorage.getDemoGardenState());
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (
    zone: GardenZone,
    activity: string,
    outcome: ActivityLog['outcome'] = 'completed-activity',
    duration?: number,
    intensity?: 'low' | 'medium' | 'high'
  ) => {
    if (!gardenState || !currentPhase) return;

    // Calculate effort points
    const effortPoints = GameEngine.calculateEffortPoints(zone, activity, duration, intensity);

    // Calculate growth
    const growth = GameEngine.calculateGrowth(effortPoints, currentPhase, outcome);

    // Update plant
    const plant = gardenState.plants.find(p => p.zone === zone);
    if (!plant) return;

    const updatedPlant = GameEngine.updatePlantGrowth(plant, growth, currentPhase);
    const levelGained = updatedPlant.level > plant.level;

    // Coins earned from this activity (and level-up bonus)
    const coinsEarned = GameEngine.calculateCoinsEarned(effortPoints, levelGained);

    // Update streak
    const newStreak = GameEngine.updateStreak(
      gardenState.streakDays,
      true,
      gardenState.greenhouseMode
    );

    // Create activity log
    const activityLog: ActivityLog = {
      date: new Date(),
      zone,
      activity,
      effortPoints,
      outcome,
    };

    await GameStorage.saveActivityLog(activityLog);

    // Update state (including coins)
    const updatedState: GardenState = {
      ...gardenState,
      plants: gardenState.plants.map(p => p.id === plant.id ? updatedPlant : p),
      streakDays: newStreak,
      totalEffortPoints: gardenState.totalEffortPoints + effortPoints,
      coins: (gardenState.coins ?? 0) + coinsEarned,
      lastUpdated: new Date(),
    };

    setGardenState(updatedState);
    await GameStorage.saveGardenState(updatedState);

    // Track engagement
    OpikEngagement.trackEvent({
      type: 'activity_logged',
      zone,
      timestamp: new Date(),
      metadata: { activity, outcome, effortPoints },
    }, opik);

    // Show celebration
    const message = GameEngine.getCelebrationMessage(outcome);
    alert(message);
  };

  const enableGreenhouse = async (days: number) => {
    if (!gardenState) return;

    const until = new Date();
    until.setDate(until.getDate() + days);

    const updated: GardenState = {
      ...gardenState,
      greenhouseMode: true,
      greenhouseUntil: until,
    };

    setGardenState(updated);
    await GameStorage.saveGardenState(updated);
    setGreenhouseDays(0);
  };

  const getZoneColor = (zone: GardenZone): string => {
    const colors = {
      sleep: 'bg-blue-50 border-blue-200',
      nutrition: 'bg-green-50 border-green-200',
      movement: 'bg-purple-50 border-purple-200',
      stress: 'bg-teal-50 border-teal-200',
    };
    return colors[zone];
  };

  const getZoneIcon = (zone: GardenZone): string => {
    const icons = {
      sleep: '🌙',
      nutrition: '🌻',
      movement: '🌳',
      stress: '💧',
    };
    return icons[zone];
  };

  const getZoneName = (zone: GardenZone): string => {
    const names = {
      sleep: 'Sleep Garden',
      nutrition: 'Nutrition Plot',
      movement: 'Movement Meadow',
      stress: 'Stress Sanctuary',
    };
    return names[zone];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Growing your garden...</p>
        </div>
      </div>
    );
  }

  if (!gardenState) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8 text-neutral-500">
          <Sprout className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Unable to load garden</p>
        </div>
      </div>
    );
  }

  const phaseMultiplier = currentPhase ? GameEngine.getPhaseMultiplier(currentPhase) : null;
  const totalLevel = gardenState.plants.reduce((sum, p) => sum + p.level, 0);

  // Days of streak protection remaining when Greenhouse Mode is active
  const streakProtectionDaysRemaining = gardenState.greenhouseUntil
    ? Math.max(0, Math.ceil((gardenState.greenhouseUntil.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sprout className="text-primary-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-primary-700">Body Garden</h2>
          </div>
          {gardenState.greenhouseMode && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <Shield className="w-4 h-4 shrink-0" />
              <span>
                <strong>Streak protected:</strong>{' '}
                {streakProtectionDaysRemaining === 0
                  ? 'Last day'
                  : `${streakProtectionDaysRemaining} day${streakProtectionDaysRemaining === 1 ? '' : 's'} remaining`}
              </span>
            </div>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <GameItemCard
            title="Habit Streak"
            value={`${gardenState.streakDays} days`}
            icon={Flame}
            iconColor="text-accent-600"
            cornerIcon={<Leaf className="w-3 h-3 text-accent-500" />}
            subtitle="Keep it going!"
            variant="wood"
            infoTooltip="Consecutive days you've logged activity or rest. Keeping a streak shows consistency. Greenhouse Mode can protect your streak when you need a break (travel, illness, or rest)."
          />
          <GameItemCard
            title="Garden Level"
            value={totalLevel}
            icon={Award}
            iconColor="text-primary-600"
            cornerIcon={<Leaf className="w-3 h-3 text-primary-500" />}
            subtitle="Total growth"
            variant="stone"
            infoTooltip="Your total growth across all zones—the sum of each plant's level (Sleep, Nutrition, Movement, Stress). Higher levels unlock discoveries and show your overall progress."
          />
        </div>

        {/* Phase Indicator */}
        {currentPhase && phaseMultiplier && (
          <div className={`p-4 rounded-lg border ${getZoneColor('nutrition')}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-sm font-medium text-neutral-700">Current Soil Condition</p>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="What does soil condition mean?"
                      onClick={() => setShowSoilInfo((v) => !v)}
                      onBlur={() => setShowSoilInfo(false)}
                      className="p-0.5 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                      title="Reflects your menstrual cycle phase and how it affects growth. Fertile soil (follicular/ovulation) gives a growth boost; resting soil (menstrual) is gentler; balanced soil (luteal) is steady."
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {showSoilInfo && (
                      <div
                        className="absolute left-0 top-full mt-1 z-10 w-64 p-3 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-lg"
                        role="tooltip"
                      >
                        Reflects your menstrual cycle phase and how it affects growth in the garden. &quot;Fertile soil&quot; (follicular/ovulation) gives a growth boost; &quot;resting soil&quot; (menstrual) is gentler; &quot;balanced soil&quot; (luteal) is steady. Your garden adapts to your body.
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg font-bold capitalize text-neutral-800">
                  {phaseMultiplier.description}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  {phaseMultiplier.multiplier > 1 ? 'Growth Boost: ' : 'Growth Rate: '}
                  {(phaseMultiplier.multiplier * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-3xl">
                {phaseMultiplier.multiplier >= 1.2 ? '🌱' : phaseMultiplier.multiplier >= 1.0 ? '🌿' : '🌾'}
              </div>
            </div>
          </div>
        )}

        {/* Total Progress */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Total Garden Level</span>
            <span className="text-2xl font-bold text-primary-600">{totalLevel}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${(totalLevel / 40) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Isometric Garden Visualization */}
      <div className="bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 rounded-2xl shadow-soft-xl p-8 border-2 border-primary-200 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🌻</span>
          <h3 className="text-2xl font-bold text-primary-700">Your Garden</h3>
        </div>
        <IsometricGarden plants={gardenState.plants} />
      </div>

      {/* Calendar - just below Your Garden */}
      <GardenCalendar />

      {/* Garden Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gardenState.plants.map(plant => {
          const visual = GameEngine.getPlantVisualState(plant);
          const label = HealthEducation.getPlantLabel(plant.zone);

          return (
            <div
              key={plant.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
                selectedPlant?.id === plant.id ? 'border-primary-500' : 'border-neutral-200'
              } ${getZoneColor(plant.zone)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{getZoneIcon(plant.zone)}</span>
                    <div>
                      <h3 className="font-bold text-lg text-neutral-800">
                        {getZoneName(plant.zone)}
                      </h3>
                      <p className="text-sm text-neutral-600">{plant.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-4xl ${visual.color} transition-transform duration-300 ${
                        growingPlants.has(plant.id) ? 'animate-sproing' : ''
                      }`}
                      style={{
                        fontSize: `${visual.size * 2}rem`,
                        display: 'inline-block',
                      }}
                    >
                      {visual.emoji}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Level {plant.level}/10</p>
                      <p className="text-xs text-neutral-600 capitalize">{plant.health}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlant(selectedPlant?.id === plant.id ? null : plant)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <Info className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* Growth Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-600">Growth</span>
                  <span className="text-xs font-medium text-neutral-700">{plant.growth}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${visual.color.replace('text-', 'bg-')}`}
                    style={{ width: `${plant.growth}%` }}
                  />
                </div>
              </div>

              {/* Plant Info */}
              {selectedPlant?.id === plant.id && label && (
                <div className="mt-4 p-3 bg-white/80 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-700 mb-2">{label.description}</p>
                  <p className="text-xs text-neutral-600 mb-2">
                    <strong>Health Benefit:</strong> {label.healthBenefit}
                  </p>
                  <p className="text-xs text-neutral-500">
                    <strong>Research:</strong> {label.researchNote}
                  </p>
                </div>
              )}

              {/* Activity Logger */}
              <div className="mt-4">
                <ActivityLogger
                  zone={plant.zone}
                  onActivityLogged={logActivity}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Greenhouse Mode */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-800">Streak Protection (Greenhouse Mode)</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-4">
          Enable Greenhouse Mode to protect your streak during travel, illness, or when you need a break.
          Your plants will maintain their state—no guilt, just rest.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="streak-protection-days" className="text-sm font-medium text-neutral-700">
            Protect my streak for
          </label>
          <input
            id="streak-protection-days"
            type="number"
            min="1"
            max="30"
            value={greenhouseDays || ''}
            onChange={(e) => setGreenhouseDays(parseInt(e.target.value, 10) || 0)}
            className="w-16 px-3 py-2 border border-neutral-300 rounded-lg text-center tabular-nums"
            placeholder="0"
            aria-label="Number of days to protect streak"
          />
          <span className="text-sm font-medium text-neutral-700">days</span>
          <button
            onClick={() => {
              const days = greenhouseDays || 0;
              if (days < 1 || days > 30) {
                alert('Please enter a number of days between 1 and 30 to protect your streak.');
                return;
              }
              enableGreenhouse(days);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Enable Greenhouse Mode
          </button>
        </div>
      </div>

    </div>
  );
}
