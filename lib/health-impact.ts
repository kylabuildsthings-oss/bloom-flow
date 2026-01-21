/**
 * Longitudinal Health Impact Analysis
 * Correlates AI interventions with health improvements
 */

import { AIRecommendation } from './ai-evaluation';

export interface HealthMetric {
  date: Date;
  sleepQuality: number;
  energyLevel: number;
  mood: number;
  stress: number;
  symptomCount: number;
  symptomSeverity: number;
}

export interface Intervention {
  id: string;
  timestamp: Date;
  type: 'recommendation' | 'reminder' | 'education' | 'alert';
  recommendationId?: string;
  phase: string;
  accepted: boolean;
  implemented: boolean;
}

export interface HealthTrend {
  metric: string;
  baseline: number;
  current: number;
  change: number; // percentage
  trend: 'improving' | 'stable' | 'declining';
  interventions: Intervention[];
  correlation: number; // -1 to 1
}

export interface ImpactAnalysis {
  period: { start: Date; end: Date };
  trends: HealthTrend[];
  overallImprovement: number; // percentage
  interventionEffectiveness: Record<string, number>;
  phaseBreakdown: Record<string, {
    interventions: number;
    improvement: number;
  }>;
}

/**
 * Longitudinal Health Impact Analysis
 */
export class HealthImpact {
  /**
   * Analyze 30-day health trends
   */
  static analyzeTrends(
    healthMetrics: HealthMetric[],
    interventions: Intervention[]
  ): HealthTrend[] {
    if (healthMetrics.length < 2) return [];

    const metrics: Array<keyof HealthMetric> = [
      'sleepQuality',
      'energyLevel',
      'mood',
      'stress',
      'symptomCount',
      'symptomSeverity',
    ];

    return metrics.map(metric => {
      const baseline = healthMetrics[0][metric];
      const current = healthMetrics[healthMetrics.length - 1][metric];
      const change = ((current - baseline) / baseline) * 100;

      // Determine trend
      const recent = healthMetrics.slice(-7);
      const recentAvg = recent.reduce((sum, m) => sum + m[metric], 0) / recent.length;
      const earlyAvg = healthMetrics.slice(0, 7).reduce((sum, m) => sum + m[metric], 0) / Math.min(7, healthMetrics.length);

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (metric === 'stress' || metric === 'symptomCount' || metric === 'symptomSeverity') {
        // Lower is better
        trend = recentAvg < earlyAvg ? 'improving' : recentAvg > earlyAvg ? 'declining' : 'stable';
      } else {
        // Higher is better
        trend = recentAvg > earlyAvg ? 'improving' : recentAvg < earlyAvg ? 'declining' : 'stable';
      }

      // Find relevant interventions
      const relevantInterventions = interventions.filter(i => {
        const daysDiff = Math.abs(
          (i.timestamp.getTime() - healthMetrics[0].date.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff <= 30;
      });

      // Calculate correlation (simplified)
      const correlation = this.calculateCorrelation(
        healthMetrics.map(m => m[metric]),
        interventions.map(i => i.implemented ? 1 : 0)
      );

      return {
        metric,
        baseline,
        current,
        change,
        trend,
        interventions: relevantInterventions,
        correlation,
      };
    });
  }

  /**
   * Calculate correlation between interventions and health metrics
   */
  private static calculateCorrelation(
    metricValues: number[],
    interventionFlags: number[]
  ): number {
    if (metricValues.length !== interventionFlags.length || metricValues.length < 2) {
      return 0;
    }

    const n = metricValues.length;
    const sumX = metricValues.reduce((a, b) => a + b, 0);
    const sumY = interventionFlags.reduce((a, b) => a + b, 0);
    const sumXY = metricValues.reduce((sum, xi, i) => sum + xi * interventionFlags[i], 0);
    const sumX2 = metricValues.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = interventionFlags.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  /**
   * Generate impact analysis
   */
  static generateImpactAnalysis(
    healthMetrics: HealthMetric[],
    interventions: Intervention[],
    recommendations: AIRecommendation[]
  ): ImpactAnalysis {
    const trends = this.analyzeTrends(healthMetrics, interventions);

    // Calculate overall improvement
    const improvements = trends
      .filter(t => t.trend === 'improving')
      .map(t => Math.abs(t.change));
    const overallImprovement = improvements.length > 0
      ? improvements.reduce((a, b) => a + b, 0) / improvements.length
      : 0;

    // Calculate intervention effectiveness by type
    const effectiveness: Record<string, number> = {};
    const types = [...new Set(interventions.map(i => i.type))];
    types.forEach(type => {
      const typeInterventions = interventions.filter(i => i.type === type);
      const implemented = typeInterventions.filter(i => i.implemented).length;
      effectiveness[type] = typeInterventions.length > 0
        ? (implemented / typeInterventions.length) * 100
        : 0;
    });

    // Phase breakdown
    const phaseBreakdown: Record<string, { interventions: number; improvement: number }> = {};
    const phases = [...new Set(interventions.map(i => i.phase))];
    phases.forEach(phase => {
      const phaseInterventions = interventions.filter(i => i.phase === phase);
      const phaseTrends = trends.filter(t => {
        // Find interventions in this phase and check their correlation
        return phaseInterventions.some(i => 
          t.interventions.some(ti => ti.phase === phase)
        );
      });
      const avgImprovement = phaseTrends.length > 0
        ? phaseTrends.reduce((sum, t) => sum + Math.abs(t.change), 0) / phaseTrends.length
        : 0;

      phaseBreakdown[phase] = {
        interventions: phaseInterventions.length,
        improvement: avgImprovement,
      };
    });

    return {
      period: {
        start: healthMetrics[0]?.date || new Date(),
        end: healthMetrics[healthMetrics.length - 1]?.date || new Date(),
      },
      trends,
      overallImprovement,
      interventionEffectiveness: effectiveness,
      phaseBreakdown,
    };
  }

  /**
   * Correlate AI intervention timing with health improvements
   */
  static correlateInterventionsWithHealth(
    healthMetrics: HealthMetric[],
    interventions: Intervention[]
  ): {
    correlation: number;
    lagDays: number; // Days between intervention and measurable impact
    effectiveness: number;
  } {
    // Find best lag time (when intervention shows maximum correlation)
    let bestLag = 0;
    let bestCorrelation = 0;

    for (let lag = 0; lag <= 7; lag++) {
      const shiftedInterventions = interventions.map(i => ({
        ...i,
        timestamp: new Date(i.timestamp.getTime() + lag * 24 * 60 * 60 * 1000),
      }));

      // Align interventions with health metrics
      const aligned = healthMetrics.map(metric => {
        const nearbyIntervention = shiftedInterventions.find(i => {
          const daysDiff = Math.abs(
            (i.timestamp.getTime() - metric.date.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysDiff < 1; // Within 1 day
        });
        return {
          metric: metric.sleepQuality + metric.energyLevel + metric.mood - metric.stress,
          intervention: nearbyIntervention?.implemented ? 1 : 0,
        };
      });

      const correlation = this.calculateCorrelation(
        aligned.map(a => a.metric),
        aligned.map(a => a.intervention)
      );

      if (Math.abs(correlation) > Math.abs(bestCorrelation)) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }

    // Calculate effectiveness
    const implemented = interventions.filter(i => i.implemented).length;
    const effectiveness = interventions.length > 0
      ? (implemented / interventions.length) * 100
      : 0;

    return {
      correlation: bestCorrelation,
      lagDays: bestLag,
      effectiveness,
    };
  }
}
