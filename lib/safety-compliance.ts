/**
 * Safety and Compliance Monitoring
 * Tracks medical disclaimers, red flags, privacy, and ethical AI usage
 */

export interface DisclaimerView {
  id: string;
  timestamp: Date;
  type: 'medical' | 'data_privacy' | 'ai_limitation' | 'emergency';
  viewed: boolean;
  acknowledged: boolean;
  timeSpent: number; // seconds
}

export interface RedFlagEvent {
  id: string;
  timestamp: Date;
  symptom: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAction: 'acknowledged' | 'dismissed' | 'sought_care' | 'emergency_contacted';
  aiResponse: 'appropriate' | 'inappropriate' | 'missing';
  recommendationId?: string;
}

export interface PrivacyEvent {
  id: string;
  timestamp: Date;
  action: 'data_encrypted' | 'data_shared' | 'consent_granted' | 'consent_revoked' | 'audit_accessed';
  dataType: 'sensitive' | 'non-sensitive';
  details: Record<string, any>;
}

export interface EthicalAIMetric {
  timestamp: Date;
  metric: string;
  value: number;
  category: 'bias' | 'transparency' | 'safety' | 'privacy' | 'accountability';
}

export interface ComplianceReport {
  disclaimerViews: DisclaimerView[];
  redFlagEvents: RedFlagEvent[];
  privacyEvents: PrivacyEvent[];
  ethicalMetrics: EthicalAIMetric[];
  complianceScore: number; // 0-100
  lastUpdated: Date;
}

/**
 * Safety and Compliance Monitoring
 */
export class SafetyCompliance {
  /**
   * Track disclaimer view
   */
  static trackDisclaimerView(
    type: DisclaimerView['type'],
    acknowledged: boolean,
    timeSpent: number
  ): DisclaimerView {
    return {
      id: `disclaimer-${Date.now()}`,
      timestamp: new Date(),
      type,
      viewed: true,
      acknowledged,
      timeSpent,
    };
  }

  /**
   * Track red flag event
   */
  static trackRedFlag(
    symptom: string,
    severity: RedFlagEvent['severity'],
    userAction: RedFlagEvent['userAction'],
    aiResponse: RedFlagEvent['aiResponse'],
    recommendationId?: string
  ): RedFlagEvent {
    return {
      id: `redflag-${Date.now()}`,
      timestamp: new Date(),
      symptom,
      severity,
      userAction,
      aiResponse,
      recommendationId,
    };
  }

  /**
   * Track privacy event
   */
  static trackPrivacyEvent(
    action: PrivacyEvent['action'],
    dataType: PrivacyEvent['dataType'],
    details: Record<string, any>
  ): PrivacyEvent {
    return {
      id: `privacy-${Date.now()}`,
      timestamp: new Date(),
      action,
      dataType,
      details,
    };
  }

  /**
   * Calculate compliance score
   */
  static calculateComplianceScore(
    disclaimerViews: DisclaimerView[],
    redFlagEvents: RedFlagEvent[],
    privacyEvents: PrivacyEvent[]
  ): number {
    let score = 100;

    // Deduct for unacknowledged disclaimers
    const unacknowledged = disclaimerViews.filter(d => !d.acknowledged).length;
    score -= unacknowledged * 5;

    // Deduct for inappropriate AI responses to red flags
    const inappropriate = redFlagEvents.filter(e => e.aiResponse === 'inappropriate').length;
    score -= inappropriate * 10;

    // Deduct for missing AI responses to critical red flags
    const missingCritical = redFlagEvents.filter(
      e => e.severity === 'critical' && e.aiResponse === 'missing'
    ).length;
    score -= missingCritical * 15;

    // Deduct for privacy violations (would check actual violations)
    const violations = privacyEvents.filter(e => 
      e.action === 'data_shared' && !e.details.consent
    ).length;
    score -= violations * 20;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate compliance report
   */
  static generateReport(
    disclaimerViews: DisclaimerView[],
    redFlagEvents: RedFlagEvent[],
    privacyEvents: PrivacyEvent[],
    ethicalMetrics: EthicalAIMetric[]
  ): ComplianceReport {
    const complianceScore = this.calculateComplianceScore(
      disclaimerViews,
      redFlagEvents,
      privacyEvents
    );

    return {
      disclaimerViews,
      redFlagEvents,
      privacyEvents,
      ethicalMetrics,
      complianceScore,
      lastUpdated: new Date(),
    };
  }

  /**
   * Check for compliance issues
   */
  static checkComplianceIssues(report: ComplianceReport): string[] {
    const issues: string[] = [];

    // Check disclaimer acknowledgment
    const recentUnacknowledged = report.disclaimerViews.filter(
      d => !d.acknowledged && 
      (Date.now() - d.timestamp.getTime()) < 7 * 24 * 60 * 60 * 1000
    );
    if (recentUnacknowledged.length > 0) {
      issues.push(`${recentUnacknowledged.length} unacknowledged disclaimers in last 7 days`);
    }

    // Check red flag handling
    const criticalUnhandled = report.redFlagEvents.filter(
      e => e.severity === 'critical' && 
      (e.aiResponse === 'missing' || e.aiResponse === 'inappropriate')
    );
    if (criticalUnhandled.length > 0) {
      issues.push(`${criticalUnhandled.length} critical red flags with inappropriate/missing AI response`);
    }

    // Check privacy
    const privacyViolations = report.privacyEvents.filter(
      e => e.action === 'data_shared' && !e.details.consent
    );
    if (privacyViolations.length > 0) {
      issues.push(`${privacyViolations.length} potential privacy violations detected`);
    }

    return issues;
  }
}
