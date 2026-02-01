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
   * When no saved state exists or storage fails, returns demo/seed data so Body Garden always shows content
   */
  static async loadGardenState(): Promise<GardenState | null> {
    try {
      const state = await HealthDataStorage.getNonSensitive(this.GARDEN_STATE_KEY);
      if (!state) {
        return this.createDemoInitialState();
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
    } catch (_) {
      return this.createDemoInitialState();
    }
  }

  /**
   * Return demo garden state so callers can show content when load fails
   */
  static getDemoGardenState(): GardenState {
    return this.createDemoInitialState();
  }

  /**
   * Save garden state
   */
  static async saveGardenState(state: GardenState): Promise<void> {
    await HealthDataStorage.storeNonSensitive(this.GARDEN_STATE_KEY, state);
  }

  /**
   * Load activity logs
   * When no logs exist, returns demo activity logs so Body Garden shows recent activity
   */
  static async loadActivityLogs(): Promise<ActivityLog[]> {
    const logs = await HealthDataStorage.getSensitive(this.ACTIVITY_LOGS_KEY);
    if (!logs || logs.length === 0) {
      return this.getDemoActivityLogs();
    }

    return logs.map((log: any) => ({
      ...log,
      date: new Date(log.date),
    }));
  }

  /**
   * Demo activity logs for the last 14 days (Body Garden dummy data)
   */
  private static getDemoActivityLogs(): ActivityLog[] {
    const zones: Array<ActivityLog['zone']> = ['sleep', 'nutrition', 'movement', 'stress'];
    const activities: Record<ActivityLog['zone'], string[]> = {
      sleep: ['7 hours sleep', 'Good sleep', 'Restful night', '8 hours sleep'],
      nutrition: ['Balanced breakfast', 'Healthy lunch', 'Plenty of water', 'Veggie snack'],
      movement: ['30 min walk', 'Yoga session', 'Morning stretch', 'Evening walk'],
      stress: ['Meditation', 'Breathing exercises', 'Quiet time', 'Journaling'],
    };
    const demo: ActivityLog[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const zone = zones[i % 4];
      const opts = activities[zone];
      demo.push({
        date: d,
        zone,
        activity: opts[i % opts.length],
        effortPoints: 5 + (i % 5),
        outcome: 'completed-activity',
      });
    }
    return demo.sort((a, b) => b.date.getTime() - a.date.getTime());
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
   * Create empty initial garden state (used when resetting)
   */
  private static createInitialState(): GardenState {
    return {
      plants: [
        { id: 'sleep-1', zone: 'sleep', name: 'Sleep Blossom', level: 0, growth: 0, lastWatered: new Date(), health: 'healthy', daysSinceLastCare: 0 },
        { id: 'nutrition-1', zone: 'nutrition', name: 'Nutrition Flower', level: 0, growth: 0, lastWatered: new Date(), health: 'healthy', daysSinceLastCare: 0 },
        { id: 'movement-1', zone: 'movement', name: 'Movement Tree', level: 0, growth: 0, lastWatered: new Date(), health: 'healthy', daysSinceLastCare: 0 },
        { id: 'stress-1', zone: 'stress', name: 'Calm Waters', level: 0, growth: 0, lastWatered: new Date(), health: 'healthy', daysSinceLastCare: 0 },
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

  /**
   * Create demo/seed garden state so tabs show data when nothing is saved
   */
  static createDemoInitialState(): GardenState {
    const now = new Date();
    return {
      plants: [
        { id: 'sleep-1', zone: 'sleep', name: 'Sleep Blossom', level: 3, growth: 45, lastWatered: now, health: 'thriving', daysSinceLastCare: 0 },
        { id: 'nutrition-1', zone: 'nutrition', name: 'Nutrition Flower', level: 2, growth: 70, lastWatered: now, health: 'healthy', daysSinceLastCare: 0 },
        { id: 'movement-1', zone: 'movement', name: 'Movement Tree', level: 4, growth: 20, lastWatered: now, health: 'thriving', daysSinceLastCare: 0 },
        { id: 'stress-1', zone: 'stress', name: 'Calm Waters', level: 2, growth: 55, lastWatered: now, health: 'healthy', daysSinceLastCare: 0 },
      ],
      totalLevel: 11,
      lastUpdated: now,
      streakDays: 7,
      greenhouseMode: false,
      discoveries: ['Rest supports growth', 'Cycle phase affects energy'],
      totalEffortPoints: 120,
      coins: 42,
    };
  }
}
