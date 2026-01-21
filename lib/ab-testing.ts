/**
 * A/B Testing Framework
 * Tests different AI strategies across cycle phases
 */

import { CyclePhase } from './cycle-engine';

export type TestGroup = 'control' | 'variant_a' | 'variant_b' | 'variant_c';

export interface ABTest {
  id: string;
  name: string;
  phase: CyclePhase;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  variants: TestVariant[];
  metrics: TestMetrics;
}

export interface TestVariant {
  id: TestGroup;
  name: string;
  description: string;
  strategy: any; // Strategy configuration
}

export interface TestMetrics {
  totalUsers: number;
  groupAssignments: Record<TestGroup, number>;
  outcomes: Record<TestGroup, OutcomeMetrics>;
  statisticalSignificance?: {
    pValue: number;
    confidence: number;
    winner?: TestGroup;
    recommendation: string;
  };
}

export interface OutcomeMetrics {
  sampleSize: number;
  acceptanceRate: number;
  implementationRate: number;
  helpfulnessScore: number;
  healthImprovement: number; // percentage
  engagementRate: number;
}

export interface UserAssignment {
  userId: string;
  phase: CyclePhase;
  testId: string;
  group: TestGroup;
  assignedAt: Date;
}

/**
 * A/B Testing Framework
 */
export class ABTesting {
  private static readonly TESTS: Record<CyclePhase, ABTest[]> = {
    follicular: [
      {
        id: 'follicular-workout-1',
        name: 'Follicular Phase Workout Recommendations',
        phase: 'follicular',
        startDate: new Date(),
        active: true,
        variants: [
          {
            id: 'control',
            name: 'Standard Recommendations',
            description: 'Current baseline workout suggestions',
            strategy: { intensity: 'moderate', frequency: 'regular' },
          },
          {
            id: 'variant_a',
            name: 'High Intensity Focus',
            description: 'Emphasize high-intensity workouts during fertile soil days',
            strategy: { intensity: 'high', frequency: 'regular', emphasis: 'strength' },
          },
          {
            id: 'variant_b',
            name: 'Progressive Build',
            description: 'Gradually increase intensity throughout follicular phase',
            strategy: { intensity: 'progressive', frequency: 'increasing', approach: 'gradual' },
          },
        ],
        metrics: {
          totalUsers: 0,
          groupAssignments: { control: 0, variant_a: 0, variant_b: 0, variant_c: 0 },
          outcomes: {
            control: this.createEmptyMetrics(),
            variant_a: this.createEmptyMetrics(),
            variant_b: this.createEmptyMetrics(),
            variant_c: this.createEmptyMetrics(),
          },
        },
      },
    ],
    ovulation: [
      {
        id: 'ovulation-productivity-1',
        name: 'Ovulation Phase Productivity Suggestions',
        phase: 'ovulation',
        startDate: new Date(),
        active: true,
        variants: [
          {
            id: 'control',
            name: 'Standard Approach',
            description: 'Current productivity recommendations',
            strategy: { focus: 'balanced', energy: 'moderate' },
          },
          {
            id: 'variant_a',
            name: 'Peak Performance Focus',
            description: 'Leverage peak energy for high-impact tasks',
            strategy: { focus: 'high-impact', energy: 'peak', timing: 'morning' },
          },
          {
            id: 'variant_b',
            name: 'Energy Optimization',
            description: 'Optimize schedule around natural energy peaks',
            strategy: { focus: 'optimized', energy: 'sustained', approach: 'rhythmic' },
          },
        ],
        metrics: {
          totalUsers: 0,
          groupAssignments: { control: 0, variant_a: 0, variant_b: 0, variant_c: 0 },
          outcomes: {
            control: this.createEmptyMetrics(),
            variant_a: this.createEmptyMetrics(),
            variant_b: this.createEmptyMetrics(),
            variant_c: this.createEmptyMetrics(),
          },
        },
      },
    ],
    luteal: [
      {
        id: 'luteal-stress-1',
        name: 'Luteal Phase Stress Management',
        phase: 'luteal',
        startDate: new Date(),
        active: true,
        variants: [
          {
            id: 'control',
            name: 'Standard Stress Management',
            description: 'Current stress reduction techniques',
            strategy: { techniques: ['breathing', 'meditation'], frequency: 'daily' },
          },
          {
            id: 'variant_a',
            name: 'Enhanced Mindfulness',
            description: 'Increased mindfulness and meditation focus',
            strategy: { techniques: ['meditation', 'yoga', 'breathing'], frequency: 'twice-daily', duration: 'extended' },
          },
          {
            id: 'variant_b',
            name: 'Gentle Movement Focus',
            description: 'Emphasize gentle movement for stress relief',
            strategy: { techniques: ['walking', 'stretching', 'yoga'], frequency: 'daily', intensity: 'gentle' },
          },
        ],
        metrics: {
          totalUsers: 0,
          groupAssignments: { control: 0, variant_a: 0, variant_b: 0, variant_c: 0 },
          outcomes: {
            control: this.createEmptyMetrics(),
            variant_a: this.createEmptyMetrics(),
            variant_b: this.createEmptyMetrics(),
            variant_c: this.createEmptyMetrics(),
          },
        },
      },
    ],
    menstrual: [
      {
        id: 'menstrual-recovery-1',
        name: 'Menstrual Phase Recovery Optimization',
        phase: 'menstrual',
        startDate: new Date(),
        active: true,
        variants: [
          {
            id: 'control',
            name: 'Standard Recovery',
            description: 'Current recovery and sleep recommendations',
            strategy: { rest: 'moderate', sleep: 'standard', activity: 'minimal' },
          },
          {
            id: 'variant_a',
            name: 'Enhanced Sleep Focus',
            description: 'Prioritize sleep quality and duration',
            strategy: { rest: 'prioritized', sleep: 'extended', activity: 'gentle', timing: 'early-bedtime' },
          },
          {
            id: 'variant_b',
            name: 'Gentle Movement Recovery',
            description: 'Light movement to support recovery',
            strategy: { rest: 'active', sleep: 'standard', activity: 'light-walking', approach: 'movement-therapy' },
          },
        ],
        metrics: {
          totalUsers: 0,
          groupAssignments: { control: 0, variant_a: 0, variant_b: 0, variant_c: 0 },
          outcomes: {
            control: this.createEmptyMetrics(),
            variant_a: this.createEmptyMetrics(),
            variant_b: this.createEmptyMetrics(),
            variant_c: this.createEmptyMetrics(),
          },
        },
      },
    ],
  };

  /**
   * Assign user to test group (randomized)
   */
  static assignToGroup(userId: string, phase: CyclePhase): TestGroup {
    const tests = this.TESTS[phase];
    if (!tests || tests.length === 0) return 'control';

    const activeTest = tests.find(t => t.active);
    if (!activeTest) return 'control';

    // Simple randomization (would use proper random assignment in production)
    const groups: TestGroup[] = ['control', 'variant_a', 'variant_b'];
    const random = Math.random();
    
    if (random < 0.33) return 'control';
    if (random < 0.66) return 'variant_a';
    return 'variant_b';
  }

  /**
   * Get active test for phase
   */
  static getActiveTest(phase: CyclePhase): ABTest | null {
    const tests = this.TESTS[phase];
    if (!tests) return null;
    return tests.find(t => t.active) || null;
  }

  /**
   * Calculate statistical significance
   */
  static calculateSignificance(test: ABTest): TestMetrics['statisticalSignificance'] {
    const outcomes = test.metrics.outcomes;
    const groups: TestGroup[] = ['control', 'variant_a', 'variant_b'];
    
    // Simplified chi-square test approximation
    const samples = groups.map(g => outcomes[g].sampleSize);
    const rates = groups.map(g => outcomes[g].acceptanceRate);
    
    if (samples.some(s => s < 30)) {
      return {
        pValue: 1.0,
        confidence: 0,
        recommendation: 'Need more data for statistical significance (minimum 30 samples per group)',
      };
    }

    // Calculate p-value (simplified - would use proper statistical test)
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - avgRate, 2), 0) / rates.length;
    
    // Simplified p-value calculation
    const pValue = Math.max(0, Math.min(1, 1 - variance * 10));
    const confidence = (1 - pValue) * 100;

    // Determine winner
    let winner: TestGroup | undefined;
    if (pValue < 0.05) {
      const bestGroup = groups.reduce((best, group) => {
        return outcomes[group].acceptanceRate > outcomes[best].acceptanceRate ? group : best;
      }, 'control' as TestGroup);
      winner = bestGroup;
    }

    return {
      pValue,
      confidence,
      winner,
      recommendation: winner
        ? `Variant ${winner} shows ${confidence.toFixed(1)}% confidence improvement. Consider adopting.`
        : 'No statistically significant difference detected. Continue testing.',
    };
  }

  /**
   * Record outcome for test
   */
  static recordOutcome(
    testId: string,
    group: TestGroup,
    outcome: Partial<OutcomeMetrics>
  ): void {
    // In production, this would update the test metrics
    // For now, this is a placeholder
  }

  /**
   * Create empty metrics
   */
  private static createEmptyMetrics(): OutcomeMetrics {
    return {
      sampleSize: 0,
      acceptanceRate: 0,
      implementationRate: 0,
      helpfulnessScore: 0,
      healthImprovement: 0,
      engagementRate: 0,
    };
  }

  /**
   * Get all active tests
   */
  static getAllActiveTests(): ABTest[] {
    return Object.values(this.TESTS)
      .flat()
      .filter(test => test.active);
  }
}
