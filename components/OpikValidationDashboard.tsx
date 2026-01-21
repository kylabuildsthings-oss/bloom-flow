'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';
import { OpikValidation, ValidationMetrics } from '@/lib/opik-validation';
import { CycleEngine } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';

export function OpikValidationDashboard() {
  const [metrics, setMetrics] = useState<ValidationMetrics | null>(null);
  const [regularity, setRegularity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);

    // Get validation metrics
    const validationMetrics = await OpikValidation.getValidationMetrics();
    setMetrics(validationMetrics);

    // Calculate cycle regularity
    const cycleData = await HealthDataStorage.getSensitive('cycle_data');
    if (cycleData && cycleData.length > 0) {
      const cycleHistory = cycleData.map((d: any) => ({
        periodStart: new Date(d.date),
        symptoms: [],
        date: new Date(d.date),
      }));
      const regularityScore = CycleEngine.calculateRegularity(cycleHistory);
      setRegularity(regularityScore);
    }

    setIsLoading(false);
    opik.logNonSensitive('validation_dashboard_viewed', {});
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 0.8) return 'text-green-600';
    if (accuracy >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getAccuracyLabel = (accuracy: number): string => {
    if (accuracy >= 0.8) return 'Excellent';
    if (accuracy >= 0.6) return 'Good';
    if (accuracy >= 0.4) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">Validation Dashboard</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Loading validation metrics...</p>
        </div>
      ) : !metrics ? (
        <div className="text-center py-8 text-neutral-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No validation data available</p>
          <p className="text-sm">Start providing feedback to see accuracy metrics</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daily Accuracy */}
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-primary-900">Daily Prediction Accuracy</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getAccuracyColor(metrics.dailyAccuracy)}`}>
                {(metrics.dailyAccuracy * 100).toFixed(1)}%
              </span>
              <span className="text-sm text-primary-700">
                ({getAccuracyLabel(metrics.dailyAccuracy)})
              </span>
            </div>
            <p className="text-sm text-primary-700 mt-2">
              Based on your feedback from the last 24 hours
            </p>
          </div>

          {/* Weekly Accuracy */}
          <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-secondary-600" />
              <h3 className="font-semibold text-secondary-900">Weekly Prediction Accuracy</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getAccuracyColor(metrics.weeklyAccuracy)}`}>
                {(metrics.weeklyAccuracy * 100).toFixed(1)}%
              </span>
              <span className="text-sm text-secondary-700">
                ({getAccuracyLabel(metrics.weeklyAccuracy)})
              </span>
            </div>
            <p className="text-sm text-secondary-700 mt-2">
              Based on your feedback from the last 7 days
            </p>
          </div>

          {/* Cycle Regularity */}
          {regularity !== null && (
            <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-accent-600" />
                <h3 className="font-semibold text-accent-900">Cycle Regularity</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${getAccuracyColor(regularity)}`}>
                  {(regularity * 100).toFixed(1)}%
                </span>
                <span className="text-sm text-accent-700">
                  ({regularity >= 0.7 ? 'Regular' : regularity >= 0.5 ? 'Moderate' : 'Irregular'})
                </span>
              </div>
              <p className="text-sm text-accent-700 mt-2">
                Based on your cycle history analysis
              </p>
            </div>
          )}

          {/* Quarterly Improvements */}
          {metrics.quarterlyImprovements.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Health Outcome Improvements</h3>
              <div className="space-y-2">
                {metrics.quarterlyImprovements.map((improvement, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-800 capitalize">{improvement.metric}</p>
                      <span className={`text-sm font-bold ${
                        improvement.improvement > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {improvement.improvement > 0 ? '+' : ''}{improvement.improvement.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {improvement.baseline.toFixed(1)} → {improvement.current.toFixed(1)} ({improvement.timeframe})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              <strong>Note:</strong> These metrics help us improve prediction accuracy and track health outcomes.
              Your feedback is valuable for refining our algorithms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
