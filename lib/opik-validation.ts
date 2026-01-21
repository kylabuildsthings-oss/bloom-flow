/**
 * Opik Validation Framework
 * Tracks prediction accuracy and health outcomes
 */

import { CyclePhase, PhaseProbability } from './cycle-engine';

interface OpikLogger {
  logSensitive: (event: string, data?: Record<string, any>) => void;
  logNonSensitive: (event: string, data?: Record<string, any>) => void;
}

export interface PredictionFeedback {
  date: Date;
  predictedPhase: CyclePhase;
  predictedProbability: number;
  actualPhase?: CyclePhase; // User-reported
  wasCorrect: boolean;
  confidence: number;
}

export interface ValidationMetrics {
  dailyAccuracy: number; // 0-1
  weeklyAccuracy: number; // 0-1
  monthlyRegularity: number; // 0-1
  quarterlyImprovements: HealthOutcomeImprovement[];
}

export interface HealthOutcomeImprovement {
  metric: string;
  baseline: number;
  current: number;
  improvement: number; // percentage
  timeframe: string;
}

/**
 * Opik Validation Framework
 * Tracks and validates predictions
 */
export class OpikValidation {
  /**
   * Log daily prediction feedback
   */
  static async logDailyFeedback(
    prediction: PhaseProbability[],
    actualPhase: CyclePhase | null,
    opik: OpikLogger
  ): Promise<PredictionFeedback | null> {
    if (!actualPhase) return null;

    const topPrediction = prediction.reduce((max, p) => 
      p.probability > max.probability ? p : max
    );

    const wasCorrect = topPrediction.phase === actualPhase;
    const feedback: PredictionFeedback = {
      date: new Date(),
      predictedPhase: topPrediction.phase,
      predictedProbability: topPrediction.probability,
      actualPhase,
      wasCorrect,
      confidence: topPrediction.probability,
    };

    // Log to Opik
    opik.logSensitive('prediction_feedback', {
      wasCorrect,
      predictedPhase: topPrediction.phase,
      actualPhase,
      confidence: topPrediction.probability,
      date: feedback.date.toISOString(),
    });

    // Store feedback
    await this.storeFeedback(feedback);

    return feedback;
  }

  /**
   * Calculate weekly prediction accuracy
   */
  static async calculateWeeklyAccuracy(): Promise<number> {
    const feedbacks = await this.getFeedbackHistory(7); // Last 7 days
    
    if (feedbacks.length === 0) return 0;

    const correct = feedbacks.filter(f => f.wasCorrect).length;
    return correct / feedbacks.length;
  }

  /**
   * Calculate monthly cycle regularity
   */
  static async calculateMonthlyRegularity(
    cycleHistory: Array<{ periodStart: Date }>
  ): Promise<number> {
    if (cycleHistory.length < 3) return 0.5; // Not enough data

    // Calculate cycle lengths
    const lengths: number[] = [];
    for (let i = 1; i < cycleHistory.length; i++) {
      const diff = Math.abs(
        cycleHistory[i].periodStart.getTime() - cycleHistory[i - 1].periodStart.getTime()
      );
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days > 20 && days < 40) {
        lengths.push(days);
      }
    }

    if (lengths.length < 2) return 0.5;

    // Calculate coefficient of variation (lower = more regular)
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, len) => acc + Math.pow(len - avg, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avg;

    // Regularity score: lower CV = higher regularity
    // CV of 0.1 (very regular) = 1.0, CV of 0.3 (irregular) = 0.0
    const regularity = Math.max(0, 1 - (cv / 0.3));
    return Math.min(1, regularity);
  }

  /**
   * Track symptom prediction accuracy
   */
  static async logSymptomPredictionAccuracy(
    predictedSymptoms: string[],
    actualSymptoms: string[],
    opik: OpikLogger
  ): Promise<number> {
    if (actualSymptoms.length === 0) return 1; // No symptoms to predict

    const correct = predictedSymptoms.filter(s => actualSymptoms.includes(s)).length;
    const accuracy = correct / actualSymptoms.length;

    opik.logSensitive('symptom_prediction_accuracy', {
      accuracy,
      predictedCount: predictedSymptoms.length,
      actualCount: actualSymptoms.length,
      date: new Date().toISOString(),
    });

    return accuracy;
  }

  /**
   * Track health outcome improvements (quarterly)
   */
  static async trackHealthOutcomes(
    baselineMetrics: Record<string, number>,
    currentMetrics: Record<string, number>,
    opik: OpikLogger
  ): Promise<HealthOutcomeImprovement[]> {
    const improvements: HealthOutcomeImprovement[] = [];

    Object.keys(currentMetrics).forEach(metric => {
      const baseline = baselineMetrics[metric];
      const current = currentMetrics[metric];
      
      if (baseline !== undefined && current !== undefined) {
        const improvement = ((current - baseline) / baseline) * 100;
        
        improvements.push({
          metric,
          baseline,
          current,
          improvement,
          timeframe: '3 months',
        });
      }
    });

    // Log to Opik
    opik.logNonSensitive('health_outcome_tracking', {
      improvements,
      date: new Date().toISOString(),
    });

    return improvements;
  }

  /**
   * Get validation metrics summary
   */
  static async getValidationMetrics(): Promise<ValidationMetrics> {
    const dailyAccuracy = await this.calculateDailyAccuracy();
    const weeklyAccuracy = await this.calculateWeeklyAccuracy();

    return {
      dailyAccuracy,
      weeklyAccuracy,
      monthlyRegularity: 0.5, // Would be calculated from cycle history
      quarterlyImprovements: [], // Would be calculated from historical data
    };
  }

  /**
   * Store prediction feedback
   */
  private static async storeFeedback(feedback: PredictionFeedback): Promise<void> {
    if (typeof window === 'undefined') return;

    const { HealthDataStorage } = await import('./storage');
    const feedbacks = await HealthDataStorage.getNonSensitive('prediction_feedback') || [];
    feedbacks.push(feedback);
    
    // Keep only last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const filtered = feedbacks.filter((f: PredictionFeedback) => 
      new Date(f.date) >= cutoff
    );

    await HealthDataStorage.storeNonSensitive('prediction_feedback', filtered);
  }

  /**
   * Get feedback history
   */
  private static async getFeedbackHistory(days: number): Promise<PredictionFeedback[]> {
    if (typeof window === 'undefined') return [];

    const { HealthDataStorage } = await import('./storage');
    const feedbacks = await HealthDataStorage.getNonSensitive('prediction_feedback') || [];
    
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return feedbacks
      .filter((f: PredictionFeedback) => new Date(f.date) >= cutoff)
      .map((f: any) => ({
        ...f,
        date: new Date(f.date),
      }));
  }

  /**
   * Calculate daily accuracy (last 24 hours)
   */
  private static async calculateDailyAccuracy(): Promise<number> {
    const feedbacks = await this.getFeedbackHistory(1);
    
    if (feedbacks.length === 0) return 0;

    const correct = feedbacks.filter(f => f.wasCorrect).length;
    return correct / feedbacks.length;
  }
}
