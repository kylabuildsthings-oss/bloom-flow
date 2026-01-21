/**
 * Opik Engagement Analytics
 * Tracks game mechanics effectiveness and user engagement patterns
 */

import { GardenZone, ActivityLog } from './game-engine';

export interface EngagementMetrics {
  dailyActiveUsers: number;
  averageSessionDuration: number;
  mostEngagingZones: Record<GardenZone, number>;
  rewardScheduleEffectiveness: {
    schedule: string;
    engagementRate: number;
    retentionRate: number;
  };
  unhealthyPatterns: UnhealthyPattern[];
  healthCorrelation: {
    engagementLevel: 'low' | 'medium' | 'high';
    healthImprovement: number; // percentage
  };
}

export interface UnhealthyPattern {
  type: 'obsession' | 'guilt' | 'over-exertion' | 'neglect';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: Date;
}

export interface EngagementEvent {
  type: 'garden_view' | 'plant_interaction' | 'activity_logged' | 'discovery_unlocked' | 'streak_updated';
  zone?: GardenZone;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Opik Engagement Analytics
 */
export class OpikEngagement {
  /**
   * Track engagement event
   */
  static async trackEvent(
    event: EngagementEvent,
    opik: { logNonSensitive: (event: string, data?: Record<string, any>) => void }
  ): Promise<void> {
    opik.logNonSensitive('game_engagement', {
      eventType: event.type,
      zone: event.zone,
      timestamp: event.timestamp.toISOString(),
      metadata: event.metadata,
    });
  }

  /**
   * Detect unhealthy engagement patterns
   */
  static detectUnhealthyPatterns(
    activityLogs: ActivityLog[],
    gardenState: { streakDays: number; totalEffortPoints: number }
  ): UnhealthyPattern[] {
    const patterns: UnhealthyPattern[] = [];

    // Check for obsession (excessive daily activity)
    const last7Days = activityLogs.filter(log => {
      const daysAgo = (Date.now() - log.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    });

    if (last7Days.length > 20) { // More than 20 activities in 7 days
      patterns.push({
        type: 'obsession',
        severity: last7Days.length > 30 ? 'high' : 'medium',
        description: 'High frequency of activities detected. Remember: rest is important too.',
        detectedAt: new Date(),
      });
    }

    // Check for guilt patterns (logging "listened to body" repeatedly with negative sentiment)
    const listenedToBodyCount = last7Days.filter(
      log => log.outcome === 'listened-to-body'
    ).length;
    
    if (listenedToBodyCount > 5 && gardenState.streakDays === 0) {
      patterns.push({
        type: 'guilt',
        severity: 'low',
        description: 'Multiple rest days - this is healthy! No need to feel guilty.',
        detectedAt: new Date(),
      });
    }

    // Check for over-exertion (high effort points consistently)
    const avgEffort = last7Days.reduce((sum, log) => sum + log.effortPoints, 0) / last7Days.length;
    if (avgEffort > 50 && last7Days.length > 10) {
      patterns.push({
        type: 'over-exertion',
        severity: avgEffort > 70 ? 'high' : 'medium',
        description: 'Very high activity levels. Remember to balance activity with rest.',
        detectedAt: new Date(),
      });
    }

    // Check for neglect (no activity for extended period)
    if (gardenState.streakDays === 0 && last7Days.length === 0) {
      patterns.push({
        type: 'neglect',
        severity: 'low',
        description: 'No recent activity. Your garden is resting - that\'s okay!',
        detectedAt: new Date(),
      });
    }

    return patterns;
  }

  /**
   * Calculate engagement metrics
   */
  static calculateEngagementMetrics(
    activityLogs: ActivityLog[],
    gardenViews: number,
    sessionDuration: number
  ): EngagementMetrics {
    const last30Days = activityLogs.filter(log => {
      const daysAgo = (Date.now() - log.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30;
    });

    // Most engaging zones
    const zoneCounts: Record<GardenZone, number> = {
      sleep: 0,
      nutrition: 0,
      movement: 0,
      stress: 0,
    };

    last30Days.forEach(log => {
      if (log.zone) {
        zoneCounts[log.zone]++;
      }
    });

    // Engagement level
    const totalActivities = last30Days.length;
    let engagementLevel: 'low' | 'medium' | 'high' = 'low';
    if (totalActivities > 20) engagementLevel = 'high';
    else if (totalActivities > 10) engagementLevel = 'medium';

    return {
      dailyActiveUsers: 1, // Single user for now
      averageSessionDuration: sessionDuration,
      mostEngagingZones: zoneCounts,
      rewardScheduleEffectiveness: {
        schedule: 'effort-based',
        engagementRate: totalActivities / 30, // Activities per day
        retentionRate: last30Days.length > 0 ? 1 : 0, // Simplified
      },
      unhealthyPatterns: [], // Would be populated by detectUnhealthyPatterns
      healthCorrelation: {
        engagementLevel,
        healthImprovement: 0, // Would be calculated from health metrics
      },
    };
  }

  /**
   * A/B test different reward schedules
   */
  static async logRewardScheduleTest(
    scheduleType: 'immediate' | 'delayed' | 'variable' | 'effort-based',
    userResponse: 'positive' | 'neutral' | 'negative',
    opik: { logNonSensitive: (event: string, data?: Record<string, any>) => void }
  ): Promise<void> {
    opik.logNonSensitive('reward_schedule_test', {
      scheduleType,
      userResponse,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track which garden elements drive usage
   */
  static async trackGardenElementEngagement(
    element: 'plant-visual' | 'growth-animation' | 'discovery-popup' | 'streak-badge' | 'phase-indicator',
    action: 'viewed' | 'clicked' | 'interacted',
    opik: { logNonSensitive: (event: string, data?: Record<string, any>) => void }
  ): Promise<void> {
    opik.logNonSensitive('garden_element_engagement', {
      element,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Correlate game engagement with health improvements
   */
  static correlateEngagementWithHealth(
    engagementMetrics: EngagementMetrics,
    healthMetrics: Array<{ date: Date; value: number; metric: string }>
  ): number {
    // Simplified correlation - would use actual statistical methods
    if (healthMetrics.length < 2) return 0;

    const engagementScore = engagementMetrics.healthCorrelation.engagementLevel === 'high' ? 3 :
                           engagementMetrics.healthCorrelation.engagementLevel === 'medium' ? 2 : 1;

    const healthTrend = healthMetrics[healthMetrics.length - 1].value - healthMetrics[0].value;

    // Positive correlation if engagement and health both improve
    return engagementScore * healthTrend > 0 ? 0.7 : 0.3;
  }
}
