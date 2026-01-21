'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { CycleEngine, CyclePhase, PhaseProbability } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { OpikValidation } from '@/lib/opik-validation';

export function CyclePrediction() {
  const [predictions, setPredictions] = useState<PhaseProbability[]>([]);
  const [currentPhase, setCurrentPhase] = useState<CyclePhase | null>(null);
  const [userFeedback, setUserFeedback] = useState<CyclePhase | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadPredictions();
    loadAccuracy();
  }, []);

  const loadPredictions = async () => {
    setIsLoading(true);
    
    // Load cycle history
    const cycleData = await HealthDataStorage.getSensitive('cycle_data');
    const symptoms = await HealthDataStorage.getSensitive('symptoms');
    
    if (!cycleData || cycleData.length === 0) {
      setIsLoading(false);
      return;
    }

    // Convert to CycleData format
    const cycleHistory = cycleData.map((d: any) => ({
      periodStart: new Date(d.date),
      symptoms: symptoms?.filter((s: any) => {
        const sDate = new Date(s.timestamp);
        const dDate = new Date(d.date);
        return Math.abs(sDate.getTime() - dDate.getTime()) < 24 * 60 * 60 * 1000;
      }) || [],
      date: new Date(d.date),
    }));

    // Get current symptoms
    const today = new Date();
    const todaySymptoms = symptoms?.filter((s: any) => {
      const sDate = new Date(s.timestamp);
      return sDate.toDateString() === today.toDateString();
    }) || [];

    // Predict phase
    const phaseProbs = CycleEngine.predictPhase(
      cycleHistory,
      today,
      todaySymptoms.map((s: any) => ({
        name: s.name,
        severity: s.severity === 'none' ? 0 : s.severity === 'mild' ? 1 : s.severity === 'moderate' ? 2 : s.severity === 'severe' ? 3 : 4,
        category: s.category,
        date: new Date(s.timestamp),
      })),
      undefined, // basal temp
      undefined  // LH test
    );

    setPredictions(phaseProbs);
    
    // Set current phase (highest probability)
    const topPhase = phaseProbs.reduce((max, p) => 
      p.probability > max.probability ? p : max
    );
    setCurrentPhase(topPhase.phase);

    setIsLoading(false);
    opik.logNonSensitive('phase_prediction_generated', {
      phase: topPhase.phase,
      confidence: topPhase.confidence,
    });
  };

  const loadAccuracy = async () => {
    const weeklyAccuracy = await OpikValidation.calculateWeeklyAccuracy();
    setAccuracy(weeklyAccuracy);
  };

  const submitFeedback = async () => {
    if (!userFeedback || !currentPhase) return;

    await OpikValidation.logDailyFeedback(
      predictions,
      userFeedback,
      opik
    );

    // Reload accuracy
    await loadAccuracy();

    // Reset feedback
    setUserFeedback(null);
    
    alert('Thank you for your feedback! This helps improve our predictions.');
  };

  const getPhaseColor = (phase: CyclePhase): string => {
    const colors = {
      menstrual: 'bg-red-100 text-red-800 border-red-300',
      follicular: 'bg-purple-100 text-purple-800 border-purple-300',
      ovulation: 'bg-pink-100 text-pink-800 border-pink-300',
      luteal: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[phase];
  };

  const getPhaseLabel = (phase: CyclePhase): string => {
    const labels = {
      menstrual: 'Menstrual',
      follicular: 'Follicular',
      ovulation: 'Ovulation',
      luteal: 'Luteal',
    };
    return labels[phase];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Phase Prediction</h2>
        </div>
        {accuracy !== null && (
          <div className="text-sm text-neutral-600">
            <span className="font-semibold">Weekly Accuracy:</span>{' '}
            <span className="text-primary-600">{(accuracy * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Calculating predictions...</p>
        </div>
      ) : predictions.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Not enough data for predictions</p>
          <p className="text-sm">Start tracking your cycle to get phase predictions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Phase Probabilities */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Phase Probabilities</h3>
            <div className="space-y-3">
              {predictions
                .sort((a, b) => b.probability - a.probability)
                .map((pred, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPhaseColor(pred.phase)}`}>
                          {getPhaseLabel(pred.phase)}
                        </span>
                        <span className={`text-sm ${
                          pred.confidence === 'high' ? 'text-green-600' :
                          pred.confidence === 'medium' ? 'text-yellow-600' :
                          'text-orange-600'
                        }`}>
                          {pred.confidence} confidence
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      Confidence interval: {(pred.confidenceInterval[0] * 100).toFixed(1)}% - {(pred.confidenceInterval[1] * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Current Phase */}
          {currentPhase && (
            <div className={`p-4 rounded-lg border-2 ${getPhaseColor(currentPhase)}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <h3 className="font-semibold">Most Likely Phase</h3>
              </div>
              <p className="text-lg font-bold">{getPhaseLabel(currentPhase)}</p>
              <p className="text-sm mt-1 opacity-90">
                Based on your cycle history and current symptoms
              </p>
            </div>
          )}

          {/* Feedback Section */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="font-semibold text-neutral-800 mb-3">
              Was our prediction correct?
            </h3>
            <p className="text-sm text-neutral-600 mb-3">
              Help us improve by confirming your actual phase:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['menstrual', 'follicular', 'ovulation', 'luteal'] as CyclePhase[]).map(phase => (
                <button
                  key={phase}
                  onClick={() => setUserFeedback(phase)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    userFeedback === phase
                      ? `${getPhaseColor(phase)} border-2`
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {getPhaseLabel(phase)}
                </button>
              ))}
            </div>
            <button
              onClick={submitFeedback}
              disabled={!userFeedback}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              <strong>Note:</strong> These are probability estimates, not certainties. Individual cycles vary.
              Consult your healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
