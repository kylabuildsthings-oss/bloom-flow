/**
 * AI Reasoning Chain
 * Tracks and visualizes how AI makes decisions
 */

import { CyclePhase } from './cycle-engine';

export interface ReasoningStep {
  id: string;
  stepNumber: number;
  description: string;
  input: any;
  output: any;
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

export interface ReasoningChain {
  id: string;
  input: {
    cycleDay: number;
    symptoms: string[];
    healthMetrics: Record<string, number>;
    recentActivity: string[];
    userQuery?: string;
  };
  steps: ReasoningStep[];
  finalRecommendation: {
    type: string;
    title: string;
    description: string;
    confidence: number;
  };
  timestamp: Date;
}

/**
 * AI Reasoning Chain Builder
 */
export class AIReasoning {
  /**
   * Build reasoning chain for a recommendation
   */
  static buildReasoningChain(
    input: ReasoningChain['input'],
    currentPhase: CyclePhase
  ): ReasoningChain {
    const steps: ReasoningStep[] = [];
    let stepNumber = 1;

    // Step 1: Identify phase
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber: stepNumber++,
      description: 'Identify current cycle phase',
      input: { cycleDay: input.cycleDay },
      output: { phase: currentPhase },
      confidence: 0.85,
      reasoning: `Cycle day ${input.cycleDay} corresponds to ${currentPhase} phase based on historical patterns.`,
      timestamp: new Date(),
    });

    // Step 2: Check symptom patterns
    if (input.symptoms.length > 0) {
      const symptomAnalysis = this.analyzeSymptoms(input.symptoms, currentPhase);
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        description: 'Analyze symptom patterns',
        input: { symptoms: input.symptoms },
        output: symptomAnalysis,
        confidence: 0.75,
        reasoning: symptomAnalysis.reasoning,
        timestamp: new Date(),
      });
    }

    // Step 3: Review recent activity
    if (input.recentActivity.length > 0) {
      const activityAnalysis = this.analyzeActivity(input.recentActivity);
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        description: 'Review recent activity patterns',
        input: { recentActivity: input.recentActivity },
        output: activityAnalysis,
        confidence: 0.80,
        reasoning: activityAnalysis.reasoning,
        timestamp: new Date(),
      });
    }

    // Step 4: Check health metrics
    if (Object.keys(input.healthMetrics).length > 0) {
      const metricsAnalysis = this.analyzeHealthMetrics(input.healthMetrics, currentPhase);
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        description: 'Evaluate health metrics',
        input: { healthMetrics: input.healthMetrics },
        output: metricsAnalysis,
        confidence: 0.70,
        reasoning: metricsAnalysis.reasoning,
        timestamp: new Date(),
      });
    }

    // Step 5: Generate recommendation
    const recommendation = this.generateRecommendation(steps, currentPhase);
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber: stepNumber++,
      description: 'Generate personalized recommendation',
      input: { previousSteps: steps.length - 1 },
      output: recommendation,
      confidence: recommendation.confidence,
      reasoning: `Based on ${steps.length - 1} analysis steps, recommending ${recommendation.title} for ${currentPhase} phase.`,
      timestamp: new Date(),
    });

    return {
      id: `chain-${Date.now()}`,
      input,
      steps,
      finalRecommendation: recommendation,
      timestamp: new Date(),
    };
  }

  /**
   * Analyze symptoms
   */
  private static analyzeSymptoms(
    symptoms: string[],
    phase: CyclePhase
  ): { pattern: string; reasoning: string; severity: string } {
    const lowEnergy = symptoms.some(s => s.toLowerCase().includes('tired') || s.toLowerCase().includes('fatigue'));
    const headache = symptoms.some(s => s.toLowerCase().includes('headache'));
    const cramps = symptoms.some(s => s.toLowerCase().includes('cramp'));

    if (lowEnergy && phase === 'luteal') {
      return {
        pattern: 'luteal_fatigue',
        reasoning: 'Low energy in luteal phase is common due to progesterone. May indicate need for rest or hydration.',
        severity: 'moderate',
      };
    }

    if (headache && phase === 'luteal') {
      return {
        pattern: 'luteal_headache',
        reasoning: 'Headaches in luteal phase may be related to hormonal changes or dehydration. Consider hydration and gentle care.',
        severity: 'moderate',
      };
    }

    if (crams && phase === 'menstrual') {
      return {
        pattern: 'menstrual_cramps',
        reasoning: 'Menstrual cramps are expected during this phase. Gentle movement and heat may help.',
        severity: 'mild',
      };
    }

    return {
      pattern: 'general',
      reasoning: 'Symptoms noted but no specific pattern identified.',
      severity: 'mild',
    };
  }

  /**
   * Analyze recent activity
   */
  private static analyzeActivity(activities: string[]): { pattern: string; reasoning: string; recommendation: string } {
    const hasIntenseWorkout = activities.some(a => 
      a.toLowerCase().includes('intense') || 
      a.toLowerCase().includes('heavy') ||
      a.toLowerCase().includes('hard')
    );

    if (hasIntenseWorkout) {
      return {
        pattern: 'recent_intense_activity',
        reasoning: 'Intense workout detected yesterday. Body may need recovery time.',
        recommendation: 'Consider lighter activity or rest today.',
      };
    }

    return {
      pattern: 'normal_activity',
      reasoning: 'Recent activity levels appear normal.',
      recommendation: 'Continue with regular activity patterns.',
    };
  }

  /**
   * Analyze health metrics
   */
  private static analyzeHealthMetrics(
    metrics: Record<string, number>,
    phase: CyclePhase
  ): { assessment: string; reasoning: string; concerns: string[] } {
    const concerns: string[] = [];
    let reasoning = '';

    if (metrics.sleepQuality !== undefined && metrics.sleepQuality < 5) {
      concerns.push('Low sleep quality');
      reasoning += 'Sleep quality is below optimal. ';
    }

    if (metrics.energyLevel !== undefined && metrics.energyLevel < 4) {
      concerns.push('Low energy');
      reasoning += 'Energy levels are low. ';
    }

    if (phase === 'luteal' && metrics.stress !== undefined && metrics.stress > 7) {
      concerns.push('High stress in luteal phase');
      reasoning += 'Stress is elevated during luteal phase, which is common but should be managed. ';
    }

    if (reasoning === '') {
      reasoning = 'Health metrics are within normal ranges for this phase.';
    }

    return {
      assessment: concerns.length > 0 ? 'needs_attention' : 'normal',
      reasoning,
      concerns,
    };
  }

  /**
   * Generate recommendation based on reasoning steps
   */
  private static generateRecommendation(
    steps: ReasoningStep[],
    phase: CyclePhase
  ): { type: string; title: string; description: string; confidence: number } {
    // Analyze all steps to generate recommendation
    const symptomStep = steps.find(s => s.description.includes('symptom'));
    const activityStep = steps.find(s => s.description.includes('activity'));
    const metricsStep = steps.find(s => s.description.includes('health metrics'));

    let recommendation: { type: string; title: string; description: string; confidence: number };

    // Example: Low energy + headache + recent intense workout
    if (symptomStep?.output.pattern === 'luteal_fatigue' && 
        activityStep?.output.pattern === 'recent_intense_activity') {
      recommendation = {
        type: 'recovery',
        title: 'Gentle Yoga + Electrolyte Drink',
        description: 'Your body needs recovery after intense activity. Gentle yoga can help with muscle recovery, and electrolytes can address potential dehydration contributing to low energy and headache.',
        confidence: 0.85,
      };
    } else if (phase === 'menstrual' && symptomStep?.output.pattern === 'menstrual_cramps') {
      recommendation = {
        type: 'comfort',
        title: 'Gentle Movement + Heat Therapy',
        description: 'Gentle walking or stretching can help with menstrual cramps. Consider a warm compress or bath for additional comfort.',
        confidence: 0.80,
      };
    } else if (phase === 'luteal' && metricsStep?.output.assessment === 'needs_attention') {
      recommendation = {
        type: 'stress',
        title: 'Stress Management + Rest',
        description: 'Your stress levels are elevated during luteal phase. Consider meditation, breathing exercises, or taking time for rest.',
        confidence: 0.75,
      };
    } else {
      recommendation = {
        type: 'general',
        title: 'Maintain Current Routine',
        description: 'Your current patterns appear balanced for this phase. Continue with your regular wellness practices.',
        confidence: 0.70,
      };
    }

    return recommendation;
  }
}
