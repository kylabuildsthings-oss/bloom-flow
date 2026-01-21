/**
 * Health Metric Correlation Engine
 * Analyzes relationships between cycle phases and health metrics
 */

import { CyclePhase } from './cycle-engine';
import { HealthMetrics } from './cycle-engine';

export interface CorrelationResult {
  metric: string;
  phase: CyclePhase;
  correlation: number; // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
  significance: number; // p-value approximation
  trend: 'positive' | 'negative' | 'none';
}

export interface PatternRecognition {
  pattern: 'PMS' | 'ovulation_pain' | 'menstrual_cramps' | 'energy_dip' | 'mood_swing';
  confidence: number; // 0-1
  description: string;
  typicalPhase: CyclePhase;
}

/**
 * Health Metric Correlation Engine
 * Uses statistical correlation analysis
 */
export class CorrelationEngine {
  /**
   * Analyze sleep quality correlation with cycle phase
   */
  static analyzeSleepCorrelation(
    healthMetrics: HealthMetrics[],
    phaseHistory: Array<{ date: Date; phase: CyclePhase }>
  ): CorrelationResult[] {
    const results: CorrelationResult[] = [];

    // Group metrics by phase
    const phaseMetrics = this.groupMetricsByPhase(healthMetrics, phaseHistory);

    // Calculate correlation for each phase
    const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];
    
    phases.forEach(phase => {
      const metrics = phaseMetrics[phase] || [];
      if (metrics.length < 3) return; // Need at least 3 data points

      const avgSleep = metrics.reduce((sum, m) => sum + m.sleepQuality, 0) / metrics.length;
      const overallAvg = healthMetrics.reduce((sum, m) => sum + m.sleepQuality, 0) / healthMetrics.length;
      
      const correlation = this.calculateCorrelation(
        metrics.map(m => m.sleepQuality),
        healthMetrics.map(m => m.sleepQuality)
      );

      results.push({
        metric: 'sleep_quality',
        phase,
        correlation,
        strength: this.getCorrelationStrength(Math.abs(correlation)),
        significance: this.calculateSignificance(correlation, metrics.length),
        trend: avgSleep > overallAvg ? 'positive' : 'negative',
      });
    });

    return results;
  }

  /**
   * Analyze energy level correlation with cycle phase
   */
  static analyzeEnergyCorrelation(
    healthMetrics: HealthMetrics[],
    phaseHistory: Array<{ date: Date; phase: CyclePhase }>
  ): CorrelationResult[] {
    const results: CorrelationResult[] = [];

    const phaseMetrics = this.groupMetricsByPhase(healthMetrics, phaseHistory);
    const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

    phases.forEach(phase => {
      const metrics = phaseMetrics[phase] || [];
      if (metrics.length < 3) return;

      const avgEnergy = metrics.reduce((sum, m) => sum + m.energyLevel, 0) / metrics.length;
      const overallAvg = healthMetrics.reduce((sum, m) => sum + m.energyLevel, 0) / healthMetrics.length;

      const correlation = this.calculateCorrelation(
        metrics.map(m => m.energyLevel),
        healthMetrics.map(m => m.energyLevel)
      );

      results.push({
        metric: 'energy_level',
        phase,
        correlation,
        strength: this.getCorrelationStrength(Math.abs(correlation)),
        significance: this.calculateSignificance(correlation, metrics.length),
        trend: avgEnergy > overallAvg ? 'positive' : 'negative',
      });
    });

    return results;
  }

  /**
   * Predict energy levels based on cycle phase
   */
  static predictEnergyLevel(
    phase: CyclePhase,
    historicalData: { phase: CyclePhase; energy: number }[]
  ): { predicted: number; confidence: number } {
    const phaseData = historicalData.filter(d => d.phase === phase);
    
    if (phaseData.length === 0) {
      // Default predictions based on research
      const defaults: Record<CyclePhase, number> = {
        menstrual: 5, // Lower energy during period
        follicular: 7, // Increasing energy
        ovulation: 8, // Peak energy
        luteal: 6, // Decreasing energy
      };
      return { predicted: defaults[phase], confidence: 0.3 };
    }

    const avgEnergy = phaseData.reduce((sum, d) => sum + d.energy, 0) / phaseData.length;
    const confidence = Math.min(1, phaseData.length / 10); // More data = higher confidence

    return { predicted: avgEnergy, confidence };
  }

  /**
   * Recognize symptom patterns
   */
  static recognizePatterns(
    symptoms: Array<{ name: string; severity: number; date: Date; category: string }>,
    currentPhase: CyclePhase,
    cycleDay: number
  ): PatternRecognition[] {
    const patterns: PatternRecognition[] = [];

    // PMS Pattern (luteal phase, days 20-28)
    if (currentPhase === 'luteal' && cycleDay >= 20) {
      const pmsSymptoms = symptoms.filter(s =>
        (s.category === 'mood' || s.name.toLowerCase().includes('bloat') ||
         s.name.toLowerCase().includes('cramp')) && s.severity > 0
      );
      if (pmsSymptoms.length >= 2) {
        patterns.push({
          pattern: 'PMS',
          confidence: Math.min(1, pmsSymptoms.length / 4),
          description: 'Pre-menstrual syndrome symptoms detected',
          typicalPhase: 'luteal',
        });
      }
    }

    // Ovulation Pain (mittelschmerz)
    if (currentPhase === 'ovulation' || (cycleDay >= 12 && cycleDay <= 16)) {
      const painSymptoms = symptoms.filter(s =>
        s.category === 'pain' && s.severity > 0 &&
        (s.name.toLowerCase().includes('pelvic') || s.name.toLowerCase().includes('ovulation'))
      );
      if (painSymptoms.length > 0) {
        patterns.push({
          pattern: 'ovulation_pain',
          confidence: 0.7,
          description: 'Ovulation-related pain (mittelschmerz)',
          typicalPhase: 'ovulation',
        });
      }
    }

    // Menstrual Cramps
    if (currentPhase === 'menstrual' && cycleDay <= 5) {
      const crampSymptoms = symptoms.filter(s =>
        s.category === 'pain' && s.severity > 0 &&
        s.name.toLowerCase().includes('cramp')
      );
      if (crampSymptoms.length > 0) {
        patterns.push({
          pattern: 'menstrual_cramps',
          confidence: 0.8,
          description: 'Menstrual cramps detected',
          typicalPhase: 'menstrual',
        });
      }
    }

    // Energy Dip (typically in luteal phase)
    if (currentPhase === 'luteal' && cycleDay >= 20) {
      patterns.push({
        pattern: 'energy_dip',
        confidence: 0.6,
        description: 'Typical energy decrease in late luteal phase',
        typicalPhase: 'luteal',
      });
    }

    // Mood Swings (luteal phase)
    if (currentPhase === 'luteal') {
      const moodSymptoms = symptoms.filter(s =>
        s.category === 'mood' && s.severity > 1
      );
      if (moodSymptoms.length >= 2) {
        patterns.push({
          pattern: 'mood_swing',
          confidence: Math.min(1, moodSymptoms.length / 3),
          description: 'Mood changes detected in luteal phase',
          typicalPhase: 'luteal',
        });
      }
    }

    return patterns;
  }

  /**
   * Map mood cycle patterns
   */
  static mapMoodCycle(
    healthMetrics: HealthMetrics[],
    phaseHistory: Array<{ date: Date; phase: CyclePhase }>
  ): { phase: CyclePhase; avgMood: number; trend: 'improving' | 'declining' | 'stable' }[] {
    const phaseMetrics = this.groupMetricsByPhase(healthMetrics, phaseHistory);
    const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

    return phases.map(phase => {
      const metrics = phaseMetrics[phase] || [];
      if (metrics.length === 0) {
        return { phase, avgMood: 5, trend: 'stable' as const };
      }

      const avgMood = metrics.reduce((sum, m) => sum + m.mood, 0) / metrics.length;
      
      // Simple trend: compare first half to second half
      const firstHalf = metrics.slice(0, Math.floor(metrics.length / 2));
      const secondHalf = metrics.slice(Math.floor(metrics.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, m) => sum + m.mood, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, m) => sum + m.mood, 0) / secondHalf.length;
      
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (secondAvg > firstAvg + 0.5) trend = 'improving';
      else if (secondAvg < firstAvg - 0.5) trend = 'declining';

      return { phase, avgMood, trend };
    });
  }

  /**
   * Group health metrics by cycle phase
   */
  private static groupMetricsByPhase(
    metrics: HealthMetrics[],
    phaseHistory: Array<{ date: Date; phase: CyclePhase }>
  ): Record<CyclePhase, HealthMetrics[]> {
    const grouped: Record<CyclePhase, HealthMetrics[]> = {
      menstrual: [],
      follicular: [],
      ovulation: [],
      luteal: [],
    };

    metrics.forEach(metric => {
      const phaseEntry = phaseHistory.find(p => {
        const diff = Math.abs(p.date.getTime() - metric.date.getTime());
        return diff < 24 * 60 * 60 * 1000; // Within 24 hours
      });

      if (phaseEntry) {
        grouped[phaseEntry.phase].push(metric);
      }
    });

    return grouped;
  }

  /**
   * Calculate Pearson correlation coefficient (simplified)
   */
  private static calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  /**
   * Get correlation strength
   */
  private static getCorrelationStrength(absCorrelation: number): 'weak' | 'moderate' | 'strong' {
    if (absCorrelation >= 0.7) return 'strong';
    if (absCorrelation >= 0.4) return 'moderate';
    return 'weak';
  }

  /**
   * Calculate significance (simplified p-value approximation)
   */
  private static calculateSignificance(correlation: number, sampleSize: number): number {
    // Simplified: larger sample size and stronger correlation = more significant
    const absCorr = Math.abs(correlation);
    const baseSignificance = absCorr * (1 - 1 / Math.sqrt(sampleSize));
    return Math.min(1, baseSignificance);
  }
}
