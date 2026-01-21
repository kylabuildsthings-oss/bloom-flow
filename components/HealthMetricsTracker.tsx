'use client';

import { useState, useEffect } from 'react';
import { Activity, Moon, Zap, Smile, AlertCircle } from 'lucide-react';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { HealthMetrics } from '@/lib/cycle-engine';

export function HealthMetricsTracker() {
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [todayMetrics, setTodayMetrics] = useState<Partial<HealthMetrics>>({
    sleepQuality: 5,
    energyLevel: 5,
    mood: 5,
    stress: 5,
  });
  const [isAdding, setIsAdding] = useState(false);
  const opik = useOpik();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data = await HealthDataStorage.getSensitive('health_metrics');
    if (data) {
      setMetrics(data.map((m: any) => ({
        ...m,
        date: new Date(m.date),
      })));
    }
    opik.logNonSensitive('health_metrics_viewed', {});
  };

  const saveMetrics = async (updatedMetrics: HealthMetrics[]) => {
    await HealthDataStorage.storeSensitive('health_metrics', updatedMetrics);
    opik.logSensitive('health_metrics_updated', { count: updatedMetrics.length });
  };

  const addTodayMetrics = async () => {
    if (!todayMetrics.sleepQuality || !todayMetrics.energyLevel || 
        !todayMetrics.mood || !todayMetrics.stress) {
      alert('Please fill in all metrics');
      return;
    }

    const metric: HealthMetrics = {
      sleepQuality: todayMetrics.sleepQuality!,
      energyLevel: todayMetrics.energyLevel!,
      mood: todayMetrics.mood!,
      stress: todayMetrics.stress!,
      date: new Date(),
    };

    // Check if today's metrics already exist
    const today = new Date();
    const existingIndex = metrics.findIndex(m => 
      m.date.toDateString() === today.toDateString()
    );

    let updated: HealthMetrics[];
    if (existingIndex >= 0) {
      updated = [...metrics];
      updated[existingIndex] = metric;
    } else {
      updated = [...metrics, metric];
    }

    setMetrics(updated);
    await saveMetrics(updated);

    // Reset form
    setTodayMetrics({
      sleepQuality: 5,
      energyLevel: 5,
      mood: 5,
      stress: 5,
    });
    setIsAdding(false);

    opik.logSensitive('health_metric_added', {
      sleepQuality: metric.sleepQuality,
      energyLevel: metric.energyLevel,
      mood: metric.mood,
      stress: metric.stress,
    });
  };

  const getMetricColor = (value: number): string => {
    if (value >= 8) return 'text-green-600';
    if (value >= 6) return 'text-yellow-600';
    if (value >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTodayMetrics = (): HealthMetrics | null => {
    const today = new Date();
    return metrics.find(m => m.date.toDateString() === today.toDateString()) || null;
  };

  const todayData = getTodayMetrics();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Health Metrics</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          {isAdding ? 'Cancel' : 'Add Today'}
        </button>
      </div>

      {/* Today's Metrics */}
      {todayData && !isAdding && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-3">Today's Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm text-primary-700">Sleep Quality</p>
                <p className={`text-lg font-bold ${getMetricColor(todayData.sleepQuality)}`}>
                  {todayData.sleepQuality}/10
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm text-primary-700">Energy Level</p>
                <p className={`text-lg font-bold ${getMetricColor(todayData.energyLevel)}`}>
                  {todayData.energyLevel}/10
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Smile className="w-5 h-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm text-primary-700">Mood</p>
                <p className={`text-lg font-bold ${getMetricColor(todayData.mood)}`}>
                  {todayData.mood}/10
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm text-primary-700">Stress</p>
                <p className={`text-lg font-bold ${getMetricColor(10 - todayData.stress)}`}>
                  {todayData.stress}/10
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Metrics Form */}
      {isAdding && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-semibold mb-4">Track Today's Metrics</h3>
          <div className="space-y-4">
            {[
              { key: 'sleepQuality', label: 'Sleep Quality', icon: Moon, description: 'How well did you sleep?' },
              { key: 'energyLevel', label: 'Energy Level', icon: Zap, description: 'How energetic do you feel?' },
              { key: 'mood', label: 'Mood', icon: Smile, description: 'How is your mood today?' },
              { key: 'stress', label: 'Stress Level', icon: AlertCircle, description: 'How stressed do you feel?' },
            ].map(({ key, label, icon: Icon, description }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-medium text-neutral-700">{label}</label>
                  </div>
                  <span className="text-sm font-bold text-primary-600">
                    {todayMetrics[key as keyof typeof todayMetrics]}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={todayMetrics[key as keyof typeof todayMetrics] || 5}
                  onChange={(e) => setTodayMetrics({
                    ...todayMetrics,
                    [key]: parseInt(e.target.value),
                  })}
                  className="w-full"
                />
                <p className="text-xs text-neutral-500 mt-1">{description}</p>
              </div>
            ))}
            <button
              onClick={addTodayMetrics}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Save Metrics
            </button>
          </div>
        </div>
      )}

      {/* Recent History */}
      {metrics.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-3">Recent History</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {metrics
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 7)
              .map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {metric.date.toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-neutral-600">
                        Sleep: <span className={getMetricColor(metric.sleepQuality)}>{metric.sleepQuality}</span>
                      </span>
                      <span className="text-xs text-neutral-600">
                        Energy: <span className={getMetricColor(metric.energyLevel)}>{metric.energyLevel}</span>
                      </span>
                      <span className="text-xs text-neutral-600">
                        Mood: <span className={getMetricColor(metric.mood)}>{metric.mood}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {metrics.length === 0 && !isAdding && (
        <div className="text-center py-8 text-neutral-500">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No health metrics tracked yet</p>
          <p className="text-sm">Start tracking to see correlations with your cycle</p>
        </div>
      )}
    </div>
  );
}
