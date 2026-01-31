/**
 * Game State Storage
 * Manages Body Garden state with encryption
 */

import { HealthDataStorage } from './storage';
import { GardenState, Plant, ActivityLog } from './game-engine';

/**
 * Game State Storage
 */
export class GameStorage {
  private static readonly GARDEN_STATE_KEY = 'garden_state';
  private static readonly ACTIVITY_LOGS_KEY = 'activity_logs';

  /**
   * Load garden state
   */
  static async loadGardenState(): Promise<GardenState | null> {
    const state = await HealthDataStorage.getNonSensitive(this.GARDEN_STATE_KEY);
    if (!state) {
      return this.createInitialState();
    }

    // Convert dates
    return {
      ...state,
      lastUpdated: new Date(state.lastUpdated),
      plants: state.plants.map((p: any) => ({
        ...p,
        lastWatered: new Date(p.lastWatered),
      })),
      greenhouseUntil: state.greenhouseUntil ? new Date(state.greenhouseUntil) : undefined,
      coins: state.coins ?? 0,
    };
  }

  /**
   * Save garden state
   */
  static async saveGardenState(state: GardenState): Promise<void> {
    await HealthDataStorage.storeNonSensitive(this.GARDEN_STATE_KEY, state);
  }

  /**
   * Load activity logs
   */
  static async loadActivityLogs(): Promise<ActivityLog[]> {
    const logs = await HealthDataStorage.getSensitive(this.ACTIVITY_LOGS_KEY);
    if (!logs) return [];

    return logs.map((log: any) => ({
      ...log,
      date: new Date(log.date),
    }));
  }

  /**
   * Save activity log
   */
  static async saveActivityLog(log: ActivityLog): Promise<void> {
    const logs = await this.loadActivityLogs();
    logs.push(log);
    
    // Keep only last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const filtered = logs.filter(l => l.date >= cutoff);

    await HealthDataStorage.storeSensitive(this.ACTIVITY_LOGS_KEY, filtered);
  }

  /**
   * Create initial garden state
   */
  private static createInitialState(): GardenState {
    return {
      plants: [
        {
          id: 'sleep-1',
          zone: 'sleep',
          name: 'Sleep Blossom',
          level: 0,
          growth: 0,
          lastWatered: new Date(),
          health: 'healthy',
          daysSinceLastCare: 0,
        },
        {
          id: 'nutrition-1',
          zone: 'nutrition',
          name: 'Nutrition Flower',
          level: 0,
          growth: 0,
          lastWatered: new Date(),
          health: 'healthy',
          daysSinceLastCare: 0,
        },
        {
          id: 'movement-1',
          zone: 'movement',
          name: 'Movement Tree',
          level: 0,
          growth: 0,
          lastWatered: new Date(),
          health: 'healthy',
          daysSinceLastCare: 0,
        },
        {
          id: 'stress-1',
          zone: 'stress',
          name: 'Calm Waters',
          level: 0,
          growth: 0,
          lastWatered: new Date(),
          health: 'healthy',
          daysSinceLastCare: 0,
        },
      ],
      totalLevel: 0,
      lastUpdated: new Date(),
      streakDays: 0,
      greenhouseMode: false,
      discoveries: [],
      totalEffortPoints: 0,
      coins: 0,
    };
  }
}
