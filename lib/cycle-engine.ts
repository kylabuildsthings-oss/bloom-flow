/**
 * Medical-Grade Menstrual Cycle Engine
 * Evidence-based phase detection with statistical prediction
 */

import { format, differenceInDays, addDays, subDays, parseISO } from 'date-fns';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface PhaseProbability {
  phase: CyclePhase;
  probability: number; // 0-1
  confidence: 'low' | 'medium' | 'high';
  confidenceInterval: [number, number]; // [lower, upper]
}

export interface CycleData {
  periodStart: Date;
  periodEnd?: Date;
  cycleLength?: number; // days
  symptoms: SymptomData[];
  basalTemp?: number; // Celsius
  lhTest?: boolean; // LH surge detected
  date: Date;
}

export interface SymptomData {
  name: string;
  severity: number; // 0-4 (none, mild, moderate, severe, critical)
  category: string;
  date: Date;
}

export interface HealthMetrics {
  sleepQuality: number; // 0-10
  energyLevel: number; // 0-10
  mood: number; // 0-10 (0 = very low, 10 = very high)
  stress: number; // 0-10
  date: Date;
}

/**
 * Evidence-based phase detection using statistical models
 * Based on: Average cycle length (28 days), phase durations, symptom patterns
 */
export class CycleEngine {
  private static readonly AVERAGE_CYCLE_LENGTH = 28;
  private static readonly PHASE_DURATIONS = {
    menstrual: { min: 3, max: 7, typical: 5 },
    follicular: { min: 10, max: 16, typical: 13 },
    ovulation: { min: 1, max: 3, typical: 1 },
    luteal: { min: 10, max: 16, typical: 14 },
  };

  /**
   * Predict phase probabilities for a given date
   */
  static predictPhase(
    cycleHistory: CycleData[],
    targetDate: Date,
    currentSymptoms?: SymptomData[],
    basalTemp?: number,
    lhTest?: boolean
  ): PhaseProbability[] {
    if (cycleHistory.length === 0) {
      return this.getDefaultProbabilities();
    }

    // Calculate cycle day
    const lastPeriod = this.getLastPeriodStart(cycleHistory);
    if (!lastPeriod) {
      return this.getDefaultProbabilities();
    }

    const cycleDay = this.calculateCycleDay(lastPeriod, targetDate);
    const userCycleLength = this.calculateAverageCycleLength(cycleHistory);

    // Base probabilities from cycle day
    let probabilities = this.getPhaseProbabilitiesByDay(cycleDay, userCycleLength);

    // Refine with symptoms
    if (currentSymptoms && currentSymptoms.length > 0) {
      probabilities = this.refineWithSymptoms(probabilities, currentSymptoms, cycleDay);
    }

    // Refine with basal temperature
    if (basalTemp !== undefined) {
      probabilities = this.refineWithBasalTemp(probabilities, basalTemp, cycleDay);
    }

    // Refine with LH test
    if (lhTest !== undefined) {
      probabilities = this.refineWithLHTest(probabilities, lhTest, cycleDay);
    }

    // Normalize probabilities
    return this.normalizeProbabilities(probabilities);
  }

  /**
   * Get base phase probabilities based on cycle day
   */
  private static getPhaseProbabilitiesByDay(
    cycleDay: number,
    cycleLength: number
  ): PhaseProbability[] {
    const normalizedDay = cycleDay % cycleLength || cycleLength;
    
    // Menstrual phase: days 1-5
    const menstrualProb = normalizedDay <= 5 
      ? Math.max(0, 1 - (normalizedDay - 1) * 0.2)
      : 0;

    // Follicular phase: days 1-13 (overlaps with menstrual)
    const follicularProb = normalizedDay > 5 && normalizedDay <= 13
      ? 0.8 - (normalizedDay - 6) * 0.1
      : normalizedDay <= 5
      ? 0.2
      : 0;

    // Ovulation: days 13-15
    const ovulationProb = normalizedDay >= 13 && normalizedDay <= 15
      ? 0.9 - Math.abs(normalizedDay - 14) * 0.3
      : 0;

    // Luteal phase: days 15-28
    const lutealProb = normalizedDay > 15
      ? 0.9 - (normalizedDay - 16) * 0.05
      : 0;

    return [
      {
        phase: 'menstrual',
        probability: menstrualProb,
        confidence: this.getConfidence(menstrualProb),
        confidenceInterval: this.calculateConfidenceInterval(menstrualProb),
      },
      {
        phase: 'follicular',
        probability: follicularProb,
        confidence: this.getConfidence(follicularProb),
        confidenceInterval: this.calculateConfidenceInterval(follicularProb),
      },
      {
        phase: 'ovulation',
        probability: ovulationProb,
        confidence: this.getConfidence(ovulationProb),
        confidenceInterval: this.calculateConfidenceInterval(ovulationProb),
      },
      {
        phase: 'luteal',
        probability: lutealProb,
        confidence: this.getConfidence(lutealProb),
        confidenceInterval: this.calculateConfidenceInterval(lutealProb),
      },
    ];
  }

  /**
   * Refine probabilities based on symptom patterns
   */
  private static refineWithSymptoms(
    probabilities: PhaseProbability[],
    symptoms: SymptomData[],
    cycleDay: number
  ): PhaseProbability[] {
    const updated = [...probabilities];

    // Menstrual symptoms: bleeding, cramps
    const bleedingSymptoms = symptoms.filter(s => 
      s.category === 'bleeding' && s.severity > 0
    );
    if (bleedingSymptoms.length > 0 && cycleDay <= 7) {
      const idx = updated.findIndex(p => p.phase === 'menstrual');
      if (idx >= 0) {
        updated[idx].probability = Math.min(1, updated[idx].probability + 0.3);
      }
    }

    // Ovulation symptoms: mittelschmerz, increased discharge
    const ovulationSymptoms = symptoms.filter(s =>
      (s.name.toLowerCase().includes('pain') || s.name.toLowerCase().includes('discharge')) &&
      s.severity > 0
    );
    if (ovulationSymptoms.length > 0 && cycleDay >= 12 && cycleDay <= 16) {
      const idx = updated.findIndex(p => p.phase === 'ovulation');
      if (idx >= 0) {
        updated[idx].probability = Math.min(1, updated[idx].probability + 0.4);
      }
    }

    // Luteal symptoms: PMS, mood changes, bloating
    const pmsSymptoms = symptoms.filter(s =>
      (s.category === 'mood' || s.name.toLowerCase().includes('bloat')) &&
      s.severity > 0
    );
    if (pmsSymptoms.length > 0 && cycleDay > 20) {
      const idx = updated.findIndex(p => p.phase === 'luteal');
      if (idx >= 0) {
        updated[idx].probability = Math.min(1, updated[idx].probability + 0.3);
      }
    }

    return updated;
  }

  /**
   * Refine with basal body temperature
   * BBT typically rises 0.3-0.5°C after ovulation
   */
  private static refineWithBasalTemp(
    probabilities: PhaseProbability[],
    basalTemp: number,
    cycleDay: number
  ): PhaseProbability[] {
    const updated = [...probabilities];
    const typicalTemp = 36.5; // Typical baseline
    const tempRise = basalTemp - typicalTemp;

    // If temperature is elevated (>0.3°C), likely in luteal phase
    if (tempRise > 0.3 && cycleDay > 14) {
      const idx = updated.findIndex(p => p.phase === 'luteal');
      if (idx >= 0) {
        updated[idx].probability = Math.min(1, updated[idx].probability + 0.2);
      }
    }

    // If temperature is baseline and cycle day 12-16, likely ovulation approaching
    if (Math.abs(tempRise) < 0.2 && cycleDay >= 12 && cycleDay <= 16) {
      const idx = updated.findIndex(p => p.phase === 'ovulation');
      if (idx >= 0) {
        updated[idx].probability = Math.min(1, updated[idx].probability + 0.15);
      }
    }

    return updated;
  }

  /**
   * Refine with LH test results
   */
  private static refineWithLHTest(
    probabilities: PhaseProbability[],
    lhTest: boolean,
    cycleDay: number
  ): PhaseProbability[] {
    const updated = [...probabilities];

    if (lhTest && cycleDay >= 12 && cycleDay <= 16) {
      const idx = updated.findIndex(p => p.phase === 'ovulation');
      if (idx >= 0) {
        updated[idx].probability = Math.min(1, updated[idx].probability + 0.5);
      }
    }

    return updated;
  }

  /**
   * Normalize probabilities so they sum to 1
   */
  private static normalizeProbabilities(
    probabilities: PhaseProbability[]
  ): PhaseProbability[] {
    const sum = probabilities.reduce((acc, p) => acc + p.probability, 0);
    if (sum === 0) return this.getDefaultProbabilities();

    return probabilities.map(p => ({
      ...p,
      probability: p.probability / sum,
      confidenceInterval: this.calculateConfidenceInterval(p.probability / sum),
    }));
  }

  /**
   * Get default probabilities when no data available
   */
  private static getDefaultProbabilities(): PhaseProbability[] {
    return [
      { phase: 'menstrual', probability: 0.25, confidence: 'low', confidenceInterval: [0, 0.5] },
      { phase: 'follicular', probability: 0.25, confidence: 'low', confidenceInterval: [0, 0.5] },
      { phase: 'ovulation', probability: 0.25, confidence: 'low', confidenceInterval: [0, 0.5] },
      { phase: 'luteal', probability: 0.25, confidence: 'low', confidenceInterval: [0, 0.5] },
    ];
  }

  /**
   * Calculate cycle day from last period start
   */
  static calculateCycleDay(lastPeriod: Date, targetDate: Date): number {
    const daysSince = differenceInDays(targetDate, lastPeriod);
    return daysSince + 1; // Day 1 is first day of period
  }

  /**
   * Get last period start date
   */
  private static getLastPeriodStart(cycleHistory: CycleData[]): Date | null {
    const periods = cycleHistory
      .filter(c => c.periodStart)
      .sort((a, b) => b.periodStart.getTime() - a.periodStart.getTime());
    
    return periods.length > 0 ? periods[0].periodStart : null;
  }

  /**
   * Calculate average cycle length from history
   */
  private static calculateAverageCycleLength(cycleHistory: CycleData[]): number {
    if (cycleHistory.length < 2) return this.AVERAGE_CYCLE_LENGTH;

    const periods = cycleHistory
      .filter(c => c.periodStart)
      .sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());

    if (periods.length < 2) return this.AVERAGE_CYCLE_LENGTH;

    const lengths: number[] = [];
    for (let i = 1; i < periods.length; i++) {
      const length = differenceInDays(periods[i].periodStart, periods[i - 1].periodStart);
      if (length > 20 && length < 40) { // Valid cycle length range
        lengths.push(length);
      }
    }

    if (lengths.length === 0) return this.AVERAGE_CYCLE_LENGTH;
    
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    return Math.round(avg);
  }

  /**
   * Get confidence level from probability
   */
  private static getConfidence(probability: number): 'low' | 'medium' | 'high' {
    if (probability >= 0.7) return 'high';
    if (probability >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Calculate confidence interval (simplified)
   */
  private static calculateConfidenceInterval(probability: number): [number, number] {
    const margin = 0.15; // ±15% margin
    return [
      Math.max(0, probability - margin),
      Math.min(1, probability + margin),
    ];
  }

  /**
   * Predict next period date
   */
  static predictNextPeriod(cycleHistory: CycleData[]): Date | null {
    const lastPeriod = this.getLastPeriodStart(cycleHistory);
    if (!lastPeriod) return null;

    const cycleLength = this.calculateAverageCycleLength(cycleHistory);
    return addDays(lastPeriod, cycleLength);
  }

  /**
   * Calculate cycle regularity score (0-1)
   */
  static calculateRegularity(cycleHistory: CycleData[]): number {
    if (cycleHistory.length < 3) return 0.5; // Not enough data

    const periods = cycleHistory
      .filter(c => c.periodStart)
      .sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime());

    if (periods.length < 3) return 0.5;

    const lengths: number[] = [];
    for (let i = 1; i < periods.length; i++) {
      const length = differenceInDays(periods[i].periodStart, periods[i - 1].periodStart);
      if (length > 20 && length < 40) {
        lengths.push(length);
      }
    }

    if (lengths.length < 2) return 0.5;

    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, len) => acc + Math.pow(len - avg, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    // Regularity score: lower std dev = higher regularity
    // Normalize: std dev of 0-7 days maps to 1.0-0.0
    const regularity = Math.max(0, 1 - (stdDev / 7));
    return Math.min(1, regularity);
  }
}
