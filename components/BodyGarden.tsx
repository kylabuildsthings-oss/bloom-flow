'use client';

import { useState, useEffect } from 'react';
import { Sprout, Info, Shield, BookOpen, TrendingUp } from 'lucide-react';
import { GameEngine, GardenState, Plant, GardenZone, ActivityLog } from '@/lib/game-engine';
import { GameStorage } from '@/lib/game-storage';
import { HealthEducation, Discovery } from '@/lib/health-education';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { OpikEngagement } from '@/lib/opik-engagement';
import { ActivityLogger } from './ActivityLogger';

export function BodyGarden() {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const [currentPhase, setCurrentPhase] = useState<CyclePhase | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showDiscovery, setShowDiscovery] = useState<Discovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [greenhouseDays, setGreenhouseDays] = useState(0);
  const opik = useOpik();

  useEffect(() => {
    loadGarden();
  }, []);

  useEffect(() => {
    if (gardenState && currentPhase) {
      // Check for new discoveries
      const newDiscoveries = GameEngine.checkDiscoveries(gardenState, currentPhase);
      const unlocked = newDiscoveries.filter(
        id => !gardenState.discoveries.includes(id)
      );
      
      if (unlocked.length > 0) {
        const discovery = HealthEducation.getDiscovery(unlocked[0]);
        if (discovery) {
          setShowDiscovery(discovery);
          // Update state with new discoveries
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
    }
  }, [gardenState, currentPhase, opik]);

  const loadGarden = async () => {
    setIsLoading(true);

    // Load garden state
    const state = await GameStorage.loadGardenState();
    if (!state) {
      setIsLoading(false);
      return;
    }

    // Update plants (daily maintenance)
    const updatedPlants = GameEngine.updateAllPlants(state.plants, state.greenhouseMode);
    
    // Check greenhouse mode
    let greenhouseMode = state.greenhouseMode;
    if (state.greenhouseUntil && new Date() > state.greenhouseUntil) {
      greenhouseMode = false;
    }

    // Get current cycle phase
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

    const updatedState: GardenState = {
      ...state,
      plants: updatedPlants,
      greenhouseMode,
      lastUpdated: new Date(),
    };

    setGardenState(updatedState);
    setIsLoading(false);

    OpikEngagement.trackEvent({
      type: 'garden_view',
      timestamp: new Date(),
    }, opik);
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

    // Update state
    const updatedState: GardenState = {
      ...gardenState,
      plants: gardenState.plants.map(p => p.id === plant.id ? updatedPlant : p),
      streakDays: newStreak,
      totalEffortPoints: gardenState.totalEffortPoints + effortPoints,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sprout className="text-primary-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-primary-700">Body Garden</h2>
          </div>
          <div className="flex items-center gap-4">
            {gardenState.greenhouseMode && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="w-4 h-4" />
                <span>Greenhouse Mode Active</span>
              </div>
            )}
            <div className="text-sm text-neutral-600">
              <span className="font-semibold">Streak:</span> {gardenState.streakDays} days
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        {currentPhase && phaseMultiplier && (
          <div className={`p-4 rounded-lg border ${getZoneColor('nutrition')}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-1">Current Soil Condition</p>
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
                    <span className={`text-4xl ${visual.color}`} style={{ fontSize: `${visual.size * 2}rem` }}>
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
          Your plants will maintain their state - no guilt, just rest.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max="30"
            value={greenhouseDays}
            onChange={(e) => setGreenhouseDays(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 border border-neutral-300 rounded-lg"
            placeholder="Days"
          />
          <button
            onClick={() => greenhouseDays > 0 && enableGreenhouse(greenhouseDays)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Enable Greenhouse Mode
          </button>
        </div>
      </div>

      {/* Discoveries */}
      {gardenState.discoveries.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-neutral-800">Your Discoveries</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gardenState.discoveries.map(discoveryId => {
              const discovery = HealthEducation.getDiscovery(discoveryId);
              if (!discovery) return null;
              return (
                <div
                  key={discoveryId}
                  className="p-3 bg-primary-50 rounded-lg border border-primary-200 cursor-pointer hover:bg-primary-100 transition-colors"
                  onClick={() => setShowDiscovery(discovery)}
                >
                  <p className="font-medium text-primary-900">{discovery.title}</p>
                  <p className="text-xs text-primary-700 mt-1">{discovery.unlockedAt}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Discovery Modal */}
      {showDiscovery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary-700">{showDiscovery.title}</h2>
                <button
                  onClick={() => setShowDiscovery(null)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ×
                </button>
              </div>
              <div className="prose max-w-none mb-4">
                <p className="text-neutral-700 whitespace-pre-line">{showDiscovery.content}</p>
              </div>
              {showDiscovery.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-800 mb-2">Research Sources:</p>
                  <ul className="space-y-2">
                    {showDiscovery.sources.map((source, idx) => (
                      <li key={idx} className="text-xs text-neutral-600">
                        {source.title}
                        {source.authors && <span> - {source.authors}</span>}
                        {source.journal && <span className="italic"> - {source.journal}</span>}
                        {source.year && <span> ({source.year})</span>}
                        {source.doi && (
                          <span className="text-primary-600"> - DOI: {source.doi}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => setShowDiscovery(null)}
                className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
