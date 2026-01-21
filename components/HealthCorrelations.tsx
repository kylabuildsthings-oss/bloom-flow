'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Brain } from 'lucide-react';
import { CorrelationEngine, PatternRecognition } from '@/lib/correlation-engine';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';

export function HealthCorrelations() {
  const [sleepCorrelations, setSleepCorrelations] = useState<any[]>([]);
  const [energyCorrelations, setEnergyCorrelations] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<PatternRecognition[]>([]);
  const [moodMap, setMoodMap] = useState<any[]>([]);
  const [predictedEnergy, setPredictedEnergy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadCorrelations();
  }, []);

  const loadCorrelations = async () => {
    setIsLoading(true);

    // Load health metrics
    const healthMetrics = await HealthDataStorage.getSensitive('health_metrics') || [];
    const cycleData = await HealthDataStorage.getSensitive('cycle_data') || [];
    const symptoms = await HealthDataStorage.getSensitive('symptoms') || [];

    if (healthMetrics.length === 0) {
      setIsLoading(false);
      return;
    }

    // Convert to HealthMetrics format
    const metrics = healthMetrics.map((m: any) => ({
      sleepQuality: m.sleepQuality || 5,
      energyLevel: m.energyLevel || 5,
      mood: m.mood || 5,
      stress: m.stress || 5,
      date: new Date(m.date),
    }));

    // Get phase history - need to find last period start
    const periods = cycleData
      .filter((d: any) => d.flow !== 'none')
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const lastPeriodStart = periods.length > 0 ? new Date(periods[0].date) : null;
    
    const phaseHistory = cycleData.map((d: any) => {
      if (!lastPeriodStart) {
        return { date: new Date(d.date), phase: 'follicular' as CyclePhase };
      }
      
      const cycleDay = CycleEngine.calculateCycleDay(lastPeriodStart, new Date(d.date));
      // Simplified phase calculation
      let phase: CyclePhase = 'follicular';
      if (cycleDay <= 5) phase = 'menstrual';
      else if (cycleDay >= 13 && cycleDay <= 15) phase = 'ovulation';
      else if (cycleDay > 15) phase = 'luteal';

      return {
        date: new Date(d.date),
        phase,
      };
    });

    // Analyze correlations
    const sleepCorr = CorrelationEngine.analyzeSleepCorrelation(metrics, phaseHistory);
    const energyCorr = CorrelationEngine.analyzeEnergyCorrelation(metrics, phaseHistory);
    const moodMapData = CorrelationEngine.mapMoodCycle(metrics, phaseHistory);

    setSleepCorrelations(sleepCorr);
    setEnergyCorrelations(energyCorr);
    setMoodMap(moodMapData);

    // Recognize patterns
    const currentDate = new Date();
    const currentPhase = phaseHistory[phaseHistory.length - 1]?.phase || 'follicular';
    const cycleDay = 15; // Simplified
    const recognizedPatterns = CorrelationEngine.recognizePatterns(
      symptoms.map((s: any) => ({
        name: s.name,
        severity: s.severity === 'none' ? 0 : s.severity === 'mild' ? 1 : s.severity === 'moderate' ? 2 : s.severity === 'severe' ? 3 : 4,
        date: new Date(s.timestamp),
        category: s.category,
      })),
      currentPhase,
      cycleDay
    );
    setPatterns(recognizedPatterns);

    // Predict energy
    const historicalEnergy = metrics.map((m, idx) => ({
      phase: phaseHistory[idx]?.phase || 'follicular',
      energy: m.energyLevel,
    }));
    const prediction = CorrelationEngine.predictEnergyLevel(currentPhase, historicalEnergy);
    setPredictedEnergy(prediction.predicted);

    setIsLoading(false);
    opik.logNonSensitive('correlations_analyzed', {
      sleepCorrelations: sleepCorr.length,
      energyCorrelations: energyCorr.length,
      patterns: recognizedPatterns.length,
    });
  };

  const getCorrelationStrengthColor = (strength: string): string => {
    const colors = {
      strong: 'text-green-600',
      moderate: 'text-yellow-600',
      weak: 'text-orange-600',
    };
    return colors[strength as keyof typeof colors] || 'text-neutral-600';
  };

  const getPatternLabel = (pattern: string): string => {
    const labels: Record<string, string> = {
      PMS: 'Pre-Menstrual Syndrome',
      ovulation_pain: 'Ovulation Pain (Mittelschmerz)',
      menstrual_cramps: 'Menstrual Cramps',
      energy_dip: 'Energy Dip',
      mood_swing: 'Mood Changes',
    };
    return labels[pattern] || pattern;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">Health Correlations</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Analyzing correlations...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Energy Prediction */}
          {predictedEnergy !== null && (
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-primary-900">Predicted Energy Level</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600">{predictedEnergy.toFixed(1)}</span>
                <span className="text-sm text-primary-700">/ 10</span>
              </div>
              <p className="text-sm text-primary-700 mt-1">
                Based on your current cycle phase and historical patterns
              </p>
            </div>
          )}

          {/* Sleep Correlations */}
          {sleepCorrelations.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Sleep Quality by Phase</h3>
              <div className="space-y-2">
                {sleepCorrelations.map((corr, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-800 capitalize">{corr.phase}</p>
                      <p className={`text-sm ${getCorrelationStrengthColor(corr.strength)}`}>
                        {corr.strength} correlation ({corr.trend})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-600">
                        {(corr.correlation * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Energy Correlations */}
          {energyCorrelations.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Energy Levels by Phase</h3>
              <div className="space-y-2">
                {energyCorrelations.map((corr, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-800 capitalize">{corr.phase}</p>
                      <p className={`text-sm ${getCorrelationStrengthColor(corr.strength)}`}>
                        {corr.strength} correlation ({corr.trend})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-600">
                        {(corr.correlation * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Mapping */}
          {moodMap.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Mood Cycle Mapping
              </h3>
              <div className="space-y-2">
                {moodMap.map((mood, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-neutral-800 capitalize">{mood.phase}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-600">
                          Avg: {mood.avgMood.toFixed(1)}/10
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          mood.trend === 'improving' ? 'bg-green-100 text-green-800' :
                          mood.trend === 'declining' ? 'bg-red-100 text-red-800' :
                          'bg-neutral-200 text-neutral-700'
                        }`}>
                          {mood.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recognized Patterns */}
          {patterns.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Recognized Patterns</h3>
              <div className="space-y-2">
                {patterns.map((pattern, idx) => (
                  <div key={idx} className="p-3 bg-accent-50 border border-accent-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-accent-900">{getPatternLabel(pattern.pattern)}</p>
                      <span className="text-sm text-accent-700">
                        {(pattern.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-accent-700">{pattern.description}</p>
                    <p className="text-xs text-accent-600 mt-1">
                      Typical phase: {pattern.typicalPhase}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sleepCorrelations.length === 0 && energyCorrelations.length === 0 && patterns.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Not enough data for correlation analysis</p>
              <p className="text-sm">Track your health metrics to see correlations</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
