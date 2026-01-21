/**
 * Body Garden Game Engine
 * Medically responsible gamification for health tracking
 */

import { CyclePhase } from './cycle-engine';

export type GardenZone = 'sleep' | 'nutrition' | 'movement' | 'stress';

export interface Plant {
  id: string;
  zone: GardenZone;
  name: string;
  level: number; // 0-10
  growth: number; // 0-100, percentage to next level
  lastWatered: Date;
  health: 'thriving' | 'healthy' | 'needs-care' | 'resting';
  daysSinceLastCare: number;
}

export interface GardenState {
  plants: Plant[];
  totalLevel: number;
  lastUpdated: Date;
  streakDays: number;
  greenhouseMode: boolean; // Streak protection
  greenhouseUntil?: Date;
  discoveries: string[]; // Unlocked educational content
  totalEffortPoints: number;
}

export interface ActivityLog {
  date: Date;
  zone: GardenZone;
  activity: string;
  effortPoints: number;
  outcome?: 'listened-to-body' | 'completed-activity' | 'rested';
}

export interface GrowthMultiplier {
  phase: CyclePhase;
  multiplier: number;
  description: string;
}

/**
 * Body Garden Game Engine
 * Medically responsible gamification
 */
export class GameEngine {
  private static readonly BASE_GROWTH_RATE = 5; // Base growth per activity
  private static readonly MAX_LEVEL = 10;
  private static readonly RESTING_THRESHOLD = 3; // Days before plant needs care

  /**
   * Calculate growth multiplier based on cycle phase
   */
  static getPhaseMultiplier(phase: CyclePhase): GrowthMultiplier {
    const multipliers: Record<CyclePhase, GrowthMultiplier> = {
      menstrual: {
        phase: 'menstrual',
        multiplier: 0.8, // Slightly reduced - rest is important
        description: 'Resting soil - gentle care is valued',
      },
      follicular: {
        phase: 'follicular',
        multiplier: 1.2, // Fertile soil - high energy
        description: 'Fertile soil - optimal growth conditions',
      },
      ovulation: {
        phase: 'ovulation',
        multiplier: 1.5, // Peak fertile soil
        description: 'Peak fertile soil - maximum growth potential',
      },
      luteal: {
        phase: 'luteal',
        multiplier: 1.0, // Normal growth
        description: 'Balanced soil - steady growth',
      },
    };

    return multipliers[phase];
  }

  /**
   * Calculate growth for an activity
   * Effort-based, not outcome-based
   */
  static calculateGrowth(
    effortPoints: number,
    phase: CyclePhase,
    outcome: ActivityLog['outcome'] = 'completed-activity'
  ): number {
    const phaseMultiplier = this.getPhaseMultiplier(phase);
    let baseGrowth = effortPoints * this.BASE_GROWTH_RATE;

    // Apply phase multiplier
    baseGrowth *= phaseMultiplier.multiplier;

    // Reward "listened to body" equally or more than pushing through
    if (outcome === 'listened-to-body') {
      baseGrowth *= 1.2; // Bonus for self-care
    } else if (outcome === 'rested') {
      baseGrowth *= 1.0; // Resting is valid, no penalty
    }

    return Math.round(baseGrowth);
  }

  /**
   * Update plant growth
   * No guilt mechanics - missed days just slow growth
   */
  static updatePlantGrowth(
    plant: Plant,
    growthAmount: number,
    currentPhase: CyclePhase
  ): Plant {
    const newGrowth = plant.growth + growthAmount;
    let newLevel = plant.level;
    let remainingGrowth = newGrowth;

    // Level up if growth exceeds 100
    if (newGrowth >= 100 && plant.level < this.MAX_LEVEL) {
      newLevel = Math.min(this.MAX_LEVEL, plant.level + 1);
      remainingGrowth = newGrowth % 100;
    }

    // Determine plant health
    const daysSinceCare = this.getDaysSinceLastCare(plant);
    let health: Plant['health'] = 'healthy';
    
    if (daysSinceCare === 0) {
      health = 'thriving';
    } else if (daysSinceCare >= this.RESTING_THRESHOLD) {
      health = 'resting'; // Not "dying" - just resting
    } else if (daysSinceCare >= 2) {
      health = 'needs-care';
    }

    return {
      ...plant,
      level: newLevel,
      growth: remainingGrowth,
      lastWatered: new Date(),
      health,
      daysSinceLastCare: 0,
    };
  }

  /**
   * Get days since last care (no negative impact, just informational)
   */
  static getDaysSinceLastCare(plant: Plant): number {
    const now = new Date();
    const diff = now.getTime() - plant.lastWatered.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Update all plants (called daily)
   * Plants don't die, they just rest
   */
  static updateAllPlants(plants: Plant[], greenhouseMode: boolean): Plant[] {
    return plants.map(plant => {
      const daysSince = this.getDaysSinceLastCare(plant);
      
      // In greenhouse mode, plants maintain their state
      if (greenhouseMode) {
        return {
          ...plant,
          daysSinceLastCare: daysSince,
          health: plant.health === 'resting' ? 'resting' : 'healthy',
        };
      }

      // Plants don't lose levels, just slow growth when resting
      let health: Plant['health'] = 'healthy';
      if (daysSince >= this.RESTING_THRESHOLD) {
        health = 'resting';
      } else if (daysSince >= 2) {
        health = 'needs-care';
      } else if (daysSince === 0) {
        health = 'thriving';
      }

      return {
        ...plant,
        daysSinceLastCare: daysSince,
        health,
      };
    });
  }

  /**
   * Calculate effort points for an activity
   * Based on effort, not outcome
   */
  static calculateEffortPoints(
    zone: GardenZone,
    activity: string,
    duration?: number,
    intensity?: 'low' | 'medium' | 'high'
  ): number {
    let basePoints = 10; // Base points for any effort

    // Duration bonus (capped)
    if (duration) {
      const durationBonus = Math.min(duration / 10, 5); // Max 5 points
      basePoints += durationBonus;
    }

    // Intensity bonus
    if (intensity) {
      const intensityMultipliers = {
        low: 0.8, // Low intensity still counts!
        medium: 1.0,
        high: 1.2,
      };
      basePoints *= intensityMultipliers[intensity];
    }

    // Zone-specific adjustments
    const zoneMultipliers: Record<GardenZone, number> = {
      sleep: 1.0,
      nutrition: 1.0,
      movement: 1.1, // Slightly more for movement
      stress: 1.0,
    };

    basePoints *= zoneMultipliers[zone];

    return Math.round(basePoints);
  }

  /**
   * Check for new discoveries (educational content unlocks)
   */
  static checkDiscoveries(
    gardenState: GardenState,
    currentPhase: CyclePhase
  ): string[] {
    const newDiscoveries: string[] = [];

    // Level-based discoveries
    const totalLevel = gardenState.plants.reduce((sum, p) => sum + p.level, 0);
    if (totalLevel >= 10 && !gardenState.discoveries.includes('garden-basics')) {
      newDiscoveries.push('garden-basics');
    }
    if (totalLevel >= 25 && !gardenState.discoveries.includes('cycle-awareness')) {
      newDiscoveries.push('cycle-awareness');
    }

    // Phase-based discoveries
    if (currentPhase === 'ovulation' && !gardenState.discoveries.includes('fertile-soil')) {
      newDiscoveries.push('fertile-soil');
    }
    if (currentPhase === 'menstrual' && !gardenState.discoveries.includes('resting-soil')) {
      newDiscoveries.push('resting-soil');
    }

    // Streak-based discoveries
    if (gardenState.streakDays >= 7 && !gardenState.discoveries.includes('consistency')) {
      newDiscoveries.push('consistency');
    }

    return newDiscoveries;
  }

  /**
   * Calculate streak (with greenhouse protection)
   */
  static updateStreak(
    currentStreak: number,
    hasActivity: boolean,
    greenhouseMode: boolean
  ): number {
    if (greenhouseMode) {
      return currentStreak; // Streak protected
    }

    if (hasActivity) {
      return currentStreak + 1;
    }

    // Streak doesn't reset immediately - grace period
    return currentStreak; // Maintain streak, just don't increment
  }

  /**
   * Get celebration message based on outcome
   */
  static getCelebrationMessage(outcome: ActivityLog['outcome']): string {
    const messages: Record<ActivityLog['outcome'], string> = {
      'listened-to-body': 'You listened to your body - that\'s wisdom! 🌱',
      'completed-activity': 'Great effort today! Your garden appreciates it 🌸',
      'rested': 'Rest is growth too. Your plants are grateful for the pause 🌿',
    };
    return messages[outcome] || messages['completed-activity'];
  }

  /**
   * Get plant visual state
   */
  static getPlantVisualState(plant: Plant): {
    emoji: string;
    color: string;
    size: number;
  } {
    const zoneEmojis: Record<GardenZone, string[]> = {
      sleep: ['🌙', '🌛', '🌜', '🌝', '⭐'],
      nutrition: ['🌱', '🌿', '🍃', '🌾', '🌻'],
      movement: ['🌳', '🌲', '🌴', '🌵', '🌰'],
      stress: ['💧', '🌊', '🌊', '🌊', '🌊'],
    };

    const emojiIndex = Math.min(plant.level, zoneEmojis[plant.zone].length - 1);
    const emoji = zoneEmojis[plant.zone][emojiIndex];

    const colors: Record<Plant['health'], string> = {
      thriving: 'text-green-600',
      healthy: 'text-green-500',
      'needs-care': 'text-yellow-500',
      resting: 'text-blue-400',
    };

    const size = 1 + (plant.level * 0.1); // Scale with level

    return {
      emoji,
      color: colors[plant.health],
      size,
    };
  }
}
