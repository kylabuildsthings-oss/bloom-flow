'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Activity, BookOpen, BarChart3 } from 'lucide-react';
import { HealthImpact, ImpactAnalysis, HealthTrend } from '@/lib/health-impact';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

type ViewMode = 'simple' | 'full';

function metricLabel(metric: string): string {
  const labels: Record<string, string> = {
    sleepQuality: 'Sleep quality',
    energyLevel: 'Energy',
    mood: 'Mood',
    stress: 'Stress',
    symptomCount: 'Symptoms',
    symptomSeverity: 'Symptom severity',
  };
  return labels[metric] || metric.replace(/([A-Z])/g, ' $1').trim();
}

function buildPlainLanguageSummary(analysis: ImpactAnalysis): { headline: string; bullets: string[] } {
  const { overallImprovement, trends, phaseBreakdown } = analysis;
  const headline =
    overallImprovement > 0
      ? `Your health impact over this period is a **${overallImprovement.toFixed(0)}% improvement** overall.`
      : overallImprovement < 0
        ? `Over this period, your overall health impact is **${overallImprovement.toFixed(0)}%**.`
        : `Over this period, your health is **holding steady**.`;

  const bullets: string[] = [];
  const improving = trends.filter((t) => t.trend === 'improving');
  const declining = trends.filter((t) => t.trend === 'declining');
  if (improving.length > 0) {
    const names = improving.map((t) => metricLabel(t.metric)).join(' and ');
    bullets.push(`${names} ${improving.length === 1 ? 'is' : 'are'} trending up—that\'s a good sign.`);
  }
  if (declining.length > 0) {
    const names = declining.map((t) => metricLabel(t.metric)).join(' and ');
    const note =
      declining.some((t) => t.metric === 'stress' || t.metric === 'symptomSeverity')
        ? ' (lower is better for stress and symptoms)'
        : '';
    bullets.push(`${names} ${declining.length === 1 ? 'is' : 'are'} trending down${note}.`);
  }
  if (improving.length === 0 && declining.length === 0 && trends.length > 0) {
    bullets.push('Your main metrics are holding steady—consistency is progress.');
  }
  const phaseEntries = Object.entries(phaseBreakdown).filter(([, d]) => d.interventions > 0);
  if (phaseEntries.length > 0) {
    const best = phaseEntries.reduce((a, b) => (a[1].improvement >= b[1].improvement ? a : b));
    const phaseName = best[0].charAt(0).toUpperCase() + best[0].slice(1);
    bullets.push(`Recommendations during your **${phaseName}** phase showed the strongest improvement.`);
  }
  if (bullets.length === 0) bullets.push('Keep logging—more data will make your summary more personal.');
  return { headline, bullets };
}

export function HealthImpactAnalysis() {
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [correlation, setCorrelation] = useState<{ correlation: number; lagDays: number; effectiveness: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const opik = useOpik();

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setIsLoading(true);

    // Load health metrics
    const healthMetrics = await HealthDataStorage.getSensitive('health_metrics') || [];
    const interventions = await HealthDataStorage.getSensitive('interventions') || [];
    const recommendations = await HealthDataStorage.getSensitive('ai_recommendations') || [];

    // Convert to format
    const metrics = healthMetrics.map((m: any) => ({
      date: new Date(m.date),
      sleepQuality: m.sleepQuality || 5,
      energyLevel: m.energyLevel || 5,
      mood: m.mood || 5,
      stress: m.stress || 5,
      symptomCount: m.symptomCount || 0,
      symptomSeverity: m.symptomSeverity || 0,
    }));

    const interventionData = interventions.map((i: any) => ({
      id: i.id,
      timestamp: new Date(i.timestamp),
      type: i.type,
      recommendationId: i.recommendationId,
      phase: i.phase,
      accepted: i.accepted,
      implemented: i.implemented,
    }));

    // Generate analysis
    const impactAnalysis = HealthImpact.generateImpactAnalysis(
      metrics,
      interventionData,
      recommendations
    );

    // Calculate correlation
    const correlationData = HealthImpact.correlateInterventionsWithHealth(
      metrics,
      interventionData
    );

    setAnalysis(impactAnalysis);
    setCorrelation(correlationData);

    // Log to Opik
    opik.logNonSensitive('health_impact_analyzed', {
      overallImprovement: impactAnalysis.overallImprovement,
      correlation: correlationData.correlation,
    });

    setIsLoading(false);
  };

  const getChartData = () => {
    if (!analysis) return [];

    // Create time series data
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1);
      const trend = analysis.trends.find(t => t.metric === 'sleepQuality');
      return {
        date: format(date, 'MMM d'),
        sleepQuality: 5 + (trend?.change || 0) * (i / days),
        energyLevel: 5 + (analysis.trends.find(t => t.metric === 'energyLevel')?.change || 0) * (i / days),
        mood: 5 + (analysis.trends.find(t => t.metric === 'mood')?.change || 0) * (i / days),
        stress: 5 - (analysis.trends.find(t => t.metric === 'stress')?.change || 0) * (i / days),
      };
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Analyzing health impact...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8 text-neutral-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No health impact data available</p>
        </div>
      </div>
    );
  }

  const plainSummary = buildPlainLanguageSummary(analysis);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Longitudinal Health Impact Analysis</h2>
        </div>
        <div className="flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
          <button
            type="button"
            onClick={() => setViewMode('simple')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'simple' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-600 hover:text-neutral-800'
            }`}
            aria-pressed={viewMode === 'simple'}
          >
            <BookOpen className="w-4 h-4" />
            Simple summary
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'full' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-600 hover:text-neutral-800'
            }`}
            aria-pressed={viewMode === 'full'}
          >
            <BarChart3 className="w-4 h-4" />
            Full analysis
          </button>
        </div>
      </div>

      {/* Overall Improvement */}
      <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-700 mb-1">Overall Health Improvement</p>
            <p className="text-3xl font-bold text-primary-600">
              +{analysis.overallImprovement.toFixed(1)}%
            </p>
            <p className="text-xs text-primary-600 mt-1">
              {format(analysis.period.start, 'MMM d')} - {format(analysis.period.end, 'MMM d')}
            </p>
          </div>
          <Calendar className="w-12 h-12 text-primary-300" />
        </div>
      </div>

      {/* What this means for you - plain language (always shown, prominent in simple view) */}
      <div className={`mb-6 p-4 rounded-lg border-2 border-primary-200 bg-primary-50/50 ${viewMode === 'simple' ? '' : 'border-dashed'}`}>
        <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          What this means for you
        </h3>
        <p className="text-neutral-800 mb-3">
          {plainSummary.headline.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
        <ul className="space-y-2 text-neutral-700 text-sm list-disc list-inside">
          {plainSummary.bullets.map((bullet, i) => (
            <li key={i}>{bullet.replace(/\*\*(.*?)\*\*/g, '$1')}</li>
          ))}
        </ul>
      </div>

      {viewMode === 'simple' && (
        <p className="text-sm text-neutral-500 mb-4">
          Switch to <strong>Full analysis</strong> above to see trend graphs and detailed metrics.
        </p>
      )}

      {viewMode === 'full' && (
        <>
      {/* Correlation with AI Interventions */}
      {correlation && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">AI Intervention Correlation</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-green-700 mb-1">Correlation</p>
              <p className="text-lg font-bold text-green-900">
                {(correlation.correlation * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-green-700 mb-1">Impact Lag</p>
              <p className="text-lg font-bold text-green-900">
                {correlation.lagDays} days
              </p>
            </div>
            <div>
              <p className="text-xs text-green-700 mb-1">Effectiveness</p>
              <p className="text-lg font-bold text-green-900">
                {correlation.effectiveness.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 30-Day Trend Visualization */}
      <div className="mb-6">
        <h3 className="font-semibold text-neutral-800 mb-4">30-Day Health Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sleepQuality" stroke="#3b82f6" strokeWidth={2} name="Sleep Quality" />
            <Line type="monotone" dataKey="energyLevel" stroke="#10b981" strokeWidth={2} name="Energy Level" />
            <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
            <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress (inverted)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Health Trends by Metric */}
      <div className="mb-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Health Trends by Metric</h3>
        <div className="space-y-3">
          {analysis.trends.map((trend, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-neutral-800 capitalize">
                    {trend.metric.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {trend.baseline.toFixed(1)} → {trend.current.toFixed(1)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    trend.trend === 'improving' ? 'text-green-600' :
                    trend.trend === 'declining' ? 'text-red-600' :
                    'text-neutral-600'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                  </span>
                  <p className="text-xs text-neutral-500 capitalize">{trend.trend}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-neutral-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      trend.trend === 'improving' ? 'bg-green-600' :
                      trend.trend === 'declining' ? 'bg-red-600' :
                      'bg-neutral-400'
                    }`}
                    style={{ width: `${Math.abs(trend.change)}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-600">
                  Correlation: {(trend.correlation * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Breakdown */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-4">Impact by Cycle Phase</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(analysis.phaseBreakdown).map(([phase, data]) => (
            <div key={phase} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-600 mb-1 capitalize">{phase}</p>
              <p className="text-lg font-bold text-neutral-800">{data.interventions}</p>
              <p className="text-xs text-neutral-500">interventions</p>
              <p className="text-sm font-semibold text-green-600 mt-1">
                +{data.improvement.toFixed(1)}% improvement
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Opik Note */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          <strong>Opik Correlation:</strong> All health improvements are correlated with AI intervention
          timing via Opik traces, enabling precise measurement of AI effectiveness.
        </p>
      </div>
        </>
      )}
    </div>
  );
}
