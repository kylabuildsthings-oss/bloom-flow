'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { sanitizeForLogging } from './data-sanitization';

/**
 * Opik SDK integration for medical-grade tracking
 * Separate tracing for sensitive vs non-sensitive data
 */
interface OpikContextType {
  logSensitive: (event: string, data?: Record<string, any>) => void;
  logNonSensitive: (event: string, data?: Record<string, any>) => void;
  logCompliance: (action: string, details: Record<string, any>) => void;
  logSafetyIncident: (incident: SafetyIncident) => void;
  logPrivacyMetric: (metric: PrivacyMetric) => void;
}

interface SafetyIncident {
  type: 'red_flag_symptom' | 'severity_escalation' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  data?: Record<string, any>;
}

interface PrivacyMetric {
  metric: string;
  value: number;
  timestamp: Date;
  details?: Record<string, any>;
}

const OpikContext = createContext<OpikContextType | null>(null);

/**
 * Opik Provider Component
 * In production, this would initialize the actual Opik SDK
 */
export function OpikProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize Opik SDK
    // In production: await opik.init({ apiKey, environment, etc. })
    if (process.env.NODE_ENV === 'development') {
      console.log('[Opik] SDK initialized');
    }
  }, []);

  const logSensitive = (event: string, data?: Record<string, any>) => {
    // In production: opik.trace('sensitive', event, data)
    // NEVER log sensitive data to console - only send to Opik SDK
    if (process.env.NODE_ENV === 'development') {
      const sanitized = sanitizeForLogging(data, false);
      console.log('[Opik Sensitive]', event, sanitized);
    }
    // Production: opik.trace('sensitive', event, data)
  };

  const logNonSensitive = (event: string, data?: Record<string, any>) => {
    // In production: opik.trace('non-sensitive', event, data)
    if (process.env.NODE_ENV === 'development') {
      const sanitized = sanitizeForLogging(data, true);
      console.log('[Opik Non-Sensitive]', event, sanitized);
    }
    // Production: opik.trace('non-sensitive', event, data)
  };

  const logCompliance = (action: string, details: Record<string, any>) => {
    // In production: opik.compliance(action, details)
    if (process.env.NODE_ENV === 'development') {
      const sanitized = sanitizeForLogging(details, true);
      console.log('[Opik Compliance]', action, sanitized);
    }
    // Production: opik.compliance(action, details)
  };

  const logSafetyIncident = (incident: SafetyIncident) => {
    // In production: opik.safety.incident(incident)
    // Safety incidents are logged but data is sanitized
    if (process.env.NODE_ENV === 'development') {
      const sanitizedIncident = {
        ...incident,
        data: sanitizeForLogging(incident.data, false),
      };
      console.log('[Opik Safety Incident]', sanitizedIncident);
      
      // Alert if critical (but sanitize data)
      if (incident.severity === 'critical') {
        console.error('[CRITICAL SAFETY INCIDENT]', {
          type: incident.type,
          severity: incident.severity,
          description: incident.description,
          timestamp: incident.timestamp,
          // Data is sanitized - never expose raw sensitive data
        });
      }
    }
    // Production: opik.safety.incident(incident)
  };

  const logPrivacyMetric = (metric: PrivacyMetric) => {
    // In production: opik.privacy.metric(metric)
    if (process.env.NODE_ENV === 'development') {
      const sanitized = {
        ...metric,
        details: sanitizeForLogging(metric.details, false),
      };
      console.log('[Opik Privacy Metric]', sanitized);
    }
    // Production: opik.privacy.metric(metric)
  };

  return (
    <OpikContext.Provider
      value={{
        logSensitive,
        logNonSensitive,
        logCompliance,
        logSafetyIncident,
        logPrivacyMetric,
      }}
    >
      {children}
    </OpikContext.Provider>
  );
}

export function useOpik() {
  const context = useContext(OpikContext);
  if (!context) {
    throw new Error('useOpik must be used within OpikProvider');
  }
  return context;
}
