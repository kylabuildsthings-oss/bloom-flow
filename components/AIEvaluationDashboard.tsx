'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { AIEvaluation, AIEvaluationMetrics, PhasePerformance } from '@/lib/ai-evaluation';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';

export function AIEvaluationDashboard() {
  const [metrics, setMetrics] = useState<AIEvaluationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    
    // Load AI recommendations (would come from actual AI system)
    const recommendations = await HealthDataStorage.getSensitive('ai_recommendations') || [];
    
    // Calculate metrics
    const evaluationMetrics = AIEvaluation.getEvaluationMetrics(recommendations);
    setMetrics(evaluationMetrics);

    // Log to Opik
    opik.logNonSensitive('ai_evaluation_viewed', {
      accuracy: evaluationMetrics.overallAccuracy,
      acceptanceRate: evaluationMetrics.userAcceptanceRate,
    });

    setIsLoading(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Loading AI evaluation metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8 text-neutral-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No AI evaluation data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">AI Evaluation Dashboard</h2>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTrendColor(metrics.trend)}`}>
          {getTrendIcon(metrics.trend)}
          <span className="font-semibold capitalize">{metrics.trend}</span>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-primary-900">Overall Accuracy</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-600">
              {(metrics.overallAccuracy * 100).toFixed(1)}%
            </span>
            <span className="text-sm text-primary-700">based on user feedback</span>
          </div>
        </div>

        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-secondary-600" />
            <h3 className="font-semibold text-secondary-900">User Acceptance Rate</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-secondary-600">
              {(metrics.userAcceptanceRate * 100).toFixed(1)}%
            </span>
            <span className="text-sm text-secondary-700">of recommendations accepted</span>
          </div>
        </div>
      </div>

      {/* Phase-by-Phase Performance */}
      <div className="mb-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Phase-by-Phase Performance</h3>
        <div className="space-y-4">
          {metrics.phasePerformance.map((phase, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-neutral-800 capitalize">{phase.phase} Phase</h4>
                  <p className="text-sm text-neutral-600">
                    {phase.totalRecommendations} total recommendations
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    {(phase.averageAccuracy * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-neutral-500">accuracy</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Acceptance</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${phase.acceptanceRate * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {(phase.acceptanceRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 mb-1">Implementation</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${phase.implementationRate * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {(phase.implementationRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 mb-1">Helpfulness</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${phase.helpfulnessScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {(phase.helpfulnessScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors */}
      {metrics.recentErrors.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Recent Errors
          </h3>
          <div className="space-y-2">
            {metrics.recentErrors.slice(0, 5).map((error, idx) => (
              <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-red-900">{error.errorType.replace(/_/g, ' ')}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    error.severity === 'critical' ? 'bg-red-600 text-white' :
                    error.severity === 'high' ? 'bg-red-400 text-white' :
                    error.severity === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-neutral-200 text-neutral-700'
                  }`}>
                    {error.severity}
                  </span>
                </div>
                <p className="text-sm text-red-700">{error.description}</p>
                <p className="text-xs text-red-600 mt-1">
                  {error.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {metrics.recentErrors.length === 0 && (
        <div className="text-center py-4 text-green-600">
          <CheckCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">No recent errors detected</p>
        </div>
      )}
    </div>
  );
}
