/**
 * AI Evaluation System
 * Real-time monitoring of AI recommendation accuracy and performance
 */

import { CyclePhase } from './cycle-engine';

export interface AIRecommendation {
  id: string;
  timestamp: Date;
  phase: CyclePhase;
  input: {
    cycleDay: number;
    symptoms: string[];
    healthMetrics: Record<string, number>;
    recentActivity: string[];
  };
  recommendation: {
    type: 'workout' | 'nutrition' | 'stress' | 'sleep' | 'general';
    title: string;
    description: string;
    reasoning: string[];
  };
  userResponse?: {
    accepted: boolean;
    implemented: boolean;
    helpful: boolean;
    feedback?: string;
  };
}

export interface PhasePerformance {
  phase: CyclePhase;
  totalRecommendations: number;
  acceptanceRate: number;
  implementationRate: number;
  helpfulnessScore: number;
  averageAccuracy: number;
  errorCount: number;
}

export interface AIEvaluationMetrics {
  overallAccuracy: number;
  userAcceptanceRate: number;
  phasePerformance: PhasePerformance[];
  recentErrors: AIError[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface AIError {
  id: string;
  timestamp: Date;
  phase: CyclePhase;
  errorType: 'incorrect_phase' | 'inappropriate_recommendation' | 'missing_context' | 'safety_concern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendationId: string;
  resolved: boolean;
}

/**
 * AI Evaluation System
 */
export class AIEvaluation {
  /**
   * Calculate overall accuracy
   */
  static calculateAccuracy(recommendations: AIRecommendation[]): number {
    if (recommendations.length === 0) return 0;

    const withFeedback = recommendations.filter(r => r.userResponse);
    if (withFeedback.length === 0) return 0;

    const helpful = withFeedback.filter(r => r.userResponse?.helpful).length;
    return helpful / withFeedback.length;
  }

  /**
   * Calculate phase-by-phase performance
   */
  static calculatePhasePerformance(
    recommendations: AIRecommendation[]
  ): PhasePerformance[] {
    const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];
    
    return phases.map(phase => {
      const phaseRecs = recommendations.filter(r => r.phase === phase);
      const withFeedback = phaseRecs.filter(r => r.userResponse);
      
      const acceptanceRate = withFeedback.length > 0
        ? phaseRecs.filter(r => r.userResponse?.accepted).length / withFeedback.length
        : 0;

      const implementationRate = withFeedback.length > 0
        ? phaseRecs.filter(r => r.userResponse?.implemented).length / withFeedback.length
        : 0;

      const helpfulnessScore = withFeedback.length > 0
        ? phaseRecs.filter(r => r.userResponse?.helpful).length / withFeedback.length
        : 0;

      const accuracy = this.calculateAccuracy(phaseRecs);

      return {
        phase,
        totalRecommendations: phaseRecs.length,
        acceptanceRate,
        implementationRate,
        helpfulnessScore,
        averageAccuracy: accuracy,
        errorCount: 0, // Would be calculated from error logs
      };
    });
  }

  /**
   * Calculate user acceptance rate
   */
  static calculateAcceptanceRate(recommendations: AIRecommendation[]): number {
    const withFeedback = recommendations.filter(r => r.userResponse);
    if (withFeedback.length === 0) return 0;

    const accepted = withFeedback.filter(r => r.userResponse?.accepted).length;
    return accepted / withFeedback.length;
  }

  /**
   * Detect errors in recommendations
   */
  static detectErrors(
    recommendation: AIRecommendation,
    actualPhase: CyclePhase,
    redFlags: string[]
  ): AIError[] {
    const errors: AIError[] = [];

    // Phase mismatch
    if (recommendation.phase !== actualPhase) {
      errors.push({
        id: `error-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        phase: recommendation.phase,
        errorType: 'incorrect_phase',
        severity: 'medium',
        description: `Recommendation made for ${recommendation.phase} phase but user is in ${actualPhase} phase`,
        recommendationId: recommendation.id,
        resolved: false,
      });
    }

    // Safety concerns
    if (redFlags.length > 0 && recommendation.recommendation.type === 'workout') {
      errors.push({
        id: `error-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        phase: recommendation.phase,
        errorType: 'safety_concern',
        severity: 'high',
        description: `Workout recommendation made when red flag symptoms present: ${redFlags.join(', ')}`,
        recommendationId: recommendation.id,
        resolved: false,
      });
    }

    return errors;
  }

  /**
   * Get evaluation metrics
   */
  static getEvaluationMetrics(recommendations: AIRecommendation[]): AIEvaluationMetrics {
    const accuracy = this.calculateAccuracy(recommendations);
    const acceptanceRate = this.calculateAcceptanceRate(recommendations);
    const phasePerformance = this.calculatePhasePerformance(recommendations);

    // Calculate trend (simplified - would use time series analysis)
    const recent = recommendations.filter(r => {
      const daysAgo = (Date.now() - r.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    });
    const recentAccuracy = this.calculateAccuracy(recent);
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAccuracy > accuracy + 0.1) trend = 'improving';
    else if (recentAccuracy < accuracy - 0.1) trend = 'declining';

    return {
      overallAccuracy: accuracy,
      userAcceptanceRate: acceptanceRate,
      phasePerformance,
      recentErrors: [], // Would be loaded from error logs
      trend,
    };
  }
}
