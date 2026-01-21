'use client';

import { useState } from 'react';
import { Brain, TrendingUp, DollarSign, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';

interface AIRecommendation {
  id: string;
  day: number;
  recommendation: string;
  evaluation: {
    method: string;
    confidence: number;
    expectedImpact: string;
  };
  adjustments: string[];
  results: {
    metric: string;
    before: number;
    after: number;
    improvement: number;
    pValue?: number;
    confidenceInterval?: string;
  }[];
  costBenefit: {
    aiCost: number;
    healthBenefit: number;
    roi: number;
  };
}

const recommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    day: 7,
    recommendation: 'Sleep Hygiene Protocol',
    evaluation: {
      method: 'Correlation Analysis',
      confidence: 0.87,
      expectedImpact: 'High - Sleep directly correlates with cycle regularity'
    },
    adjustments: [
      'Bedtime routine optimization',
      'Blue light reduction 2h before sleep',
      'Temperature regulation'
    ],
    results: [
      {
        metric: 'Sleep Duration',
        before: 5.2,
        after: 6.1,
        improvement: 17.3,
        pValue: 0.002,
        confidenceInterval: '5.8-6.4h (95% CI)'
      },
      {
        metric: 'Cycle Regularity',
        before: 35,
        after: 33,
        improvement: 5.7,
        pValue: 0.015,
        confidenceInterval: '32-34 days (95% CI)'
      }
    ],
    costBenefit: {
      aiCost: 0.15,
      healthBenefit: 2.3,
      roi: 1433
    }
  },
  {
    id: 'rec-2',
    day: 21,
    recommendation: 'Stress Management Intervention',
    evaluation: {
      method: 'Pattern Recognition',
      confidence: 0.92,
      expectedImpact: 'Very High - Stress is primary cycle disruptor'
    },
    adjustments: [
      'Meditation protocol (10min/day)',
      'Work-life boundary enforcement',
      'Breathing exercises during high-stress periods'
    ],
    results: [
      {
        metric: 'Cycle Length',
        before: 33,
        after: 30,
        improvement: 9.1,
        pValue: 0.001,
        confidenceInterval: '29-31 days (95% CI)'
      },
      {
        metric: 'Symptom Severity',
        before: 6.5,
        after: 5.5,
        improvement: 15.4,
        pValue: 0.008,
        confidenceInterval: '5.2-5.8 (95% CI)'
      }
    ],
    costBenefit: {
      aiCost: 0.22,
      healthBenefit: 3.1,
      roi: 1309
    }
  },
  {
    id: 'rec-3',
    day: 42,
    recommendation: 'Nutrition Timing Optimization',
    evaluation: {
      method: 'A/B Testing',
      confidence: 0.79,
      expectedImpact: 'Moderate - Supports energy and cycle stability'
    },
    adjustments: [
      'Meal timing aligned with cycle phases',
      'Iron-rich foods during menstruation',
      'Complex carbs during luteal phase'
    ],
    results: [
      {
        metric: 'Energy Level',
        before: 5,
        after: 6,
        improvement: 20,
        pValue: 0.012,
        confidenceInterval: '5.7-6.3 (95% CI)'
      },
      {
        metric: 'Symptom Severity',
        before: 5.5,
        after: 5,
        improvement: 9.1,
        pValue: 0.025,
        confidenceInterval: '4.8-5.2 (95% CI)'
      }
    ],
    costBenefit: {
      aiCost: 0.18,
      healthBenefit: 1.8,
      roi: 900
    }
  }
];

export function OpikInsightsOverlay() {
  const [selectedRec, setSelectedRec] = useState<AIRecommendation | null>(recommendations[0]);
  const [viewMode, setViewMode] = useState<'timeline' | 'stats' | 'roi'>('timeline');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-primary-700">Opik AI Insights Overlay</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'stats'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setViewMode('roi')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'roi'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            ROI
          </button>
        </div>
      </div>

      {viewMode === 'timeline' && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-300"></div>
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                className={`relative pl-12 pb-6 cursor-pointer transition-all ${
                  selectedRec?.id === rec.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setSelectedRec(rec)}
              >
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 bg-white flex items-center justify-center ${
                  selectedRec?.id === rec.id
                    ? 'border-primary-600 scale-110'
                    : 'border-primary-300'
                } transition-transform`}>
                  <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                </div>
                <div className={`bg-white rounded-lg p-4 border-2 transition-all ${
                  selectedRec?.id === rec.id
                    ? 'border-primary-500 shadow-lg'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      Day {rec.day}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Confidence: {(rec.evaluation.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="font-bold text-primary-700 mb-1">{rec.recommendation}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{rec.evaluation.expectedImpact}</p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BarChart3 className="w-3 h-3" />
                    <span>{rec.evaluation.method}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedRec && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h4 className="font-bold text-primary-700 mb-3">Recommendation Details</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-sm text-primary-800 mb-1">Adjustments Made:</h5>
                  <ul className="list-disc list-inside text-sm text-primary-700 space-y-1">
                    {selectedRec.adjustments.map((adj, idx) => (
                      <li key={idx}>{adj}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-primary-800 mb-2">Results:</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedRec.results.map((result, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-primary-200">
                        <div className="text-xs text-neutral-600 mb-1">{result.metric}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-neutral-500">{result.before}</span>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-green-600">{result.after}</span>
                          <span className="text-xs text-green-600">({result.improvement}%)</span>
                        </div>
                        {result.pValue && (
                          <div className="text-xs text-neutral-500 mt-1">
                            p={result.pValue.toFixed(3)} • {result.confidenceInterval}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 mb-1">Total Recommendations</div>
              <div className="text-3xl font-bold text-primary-700">{recommendations.length}</div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 mb-1">Average Confidence</div>
              <div className="text-3xl font-bold text-primary-700">
                {(recommendations.reduce((acc, r) => acc + r.evaluation.confidence, 0) / recommendations.length * 100).toFixed(0)}%
              </div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-primary-600 mb-1">Significant Results (p&lt;0.05)</div>
              <div className="text-3xl font-bold text-primary-700">
                {recommendations.reduce((acc, r) => acc + r.results.filter(res => res.pValue && res.pValue < 0.05).length, 0)}/6
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-primary-700">{rec.recommendation}</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Day {rec.day}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {rec.results.map((result, idx) => (
                    <div key={idx} className="bg-neutral-50 p-3 rounded">
                      <div className="text-xs text-neutral-600 mb-1">{result.metric}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{result.before} → {result.after}</span>
                        <span className="text-xs text-green-600 font-semibold">
                          +{result.improvement}%
                        </span>
                      </div>
                      {result.pValue && (
                        <div className="flex items-center gap-2 text-xs">
                          {result.pValue < 0.05 ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">p={result.pValue.toFixed(3)} (significant)</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-yellow-600" />
                              <span className="text-yellow-600">p={result.pValue.toFixed(3)}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'roi' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg border border-primary-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-bold text-primary-700">Cost-Benefit Analysis</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Total AI Cost</div>
                <div className="text-2xl font-bold text-primary-700">
                  ${recommendations.reduce((acc, r) => acc + r.costBenefit.aiCost, 0).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Health Benefit Value</div>
                <div className="text-2xl font-bold text-green-600">
                  ${recommendations.reduce((acc, r) => acc + r.costBenefit.healthBenefit, 0).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Average ROI</div>
                <div className="text-2xl font-bold text-primary-700">
                  {Math.round(recommendations.reduce((acc, r) => acc + r.costBenefit.roi, 0) / recommendations.length)}%
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-primary-700">{rec.recommendation}</h4>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    Day {rec.day}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">AI Cost</div>
                    <div className="text-lg font-semibold text-neutral-700">${rec.costBenefit.aiCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">Health Benefit</div>
                    <div className="text-lg font-semibold text-green-600">${rec.costBenefit.healthBenefit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">ROI</div>
                    <div className="text-lg font-semibold text-primary-700">{rec.costBenefit.roi}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
