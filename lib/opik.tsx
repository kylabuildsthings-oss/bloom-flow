'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

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
    console.log('Opik SDK initialized');
  }, []);

  const logSensitive = (event: string, data?: Record<string, any>) => {
    // In production: opik.trace('sensitive', event, data)
    console.log('[Opik Sensitive]', event, data);
  };

  const logNonSensitive = (event: string, data?: Record<string, any>) => {
    // In production: opik.trace('non-sensitive', event, data)
    console.log('[Opik Non-Sensitive]', event, data);
  };

  const logCompliance = (action: string, details: Record<string, any>) => {
    // In production: opik.compliance(action, details)
    console.log('[Opik Compliance]', action, details);
  };

  const logSafetyIncident = (incident: SafetyIncident) => {
    // In production: opik.safety.incident(incident)
    console.log('[Opik Safety Incident]', incident);
    
    // Alert if critical
    if (incident.severity === 'critical') {
      console.error('CRITICAL SAFETY INCIDENT:', incident);
    }
  };

  const logPrivacyMetric = (metric: PrivacyMetric) => {
    // In production: opik.privacy.metric(metric)
    console.log('[Opik Privacy Metric]', metric);
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
