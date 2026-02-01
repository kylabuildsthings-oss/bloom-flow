'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useOpik } from '@/lib/opik';
import { detectRedFlags, getEmergencyResources, type Symptom, type SymptomSeverity } from '@/lib/symptom-detection';
import { StyledMedicalDisclaimer } from './StyledMedicalDisclaimer';

interface MedicalDisclaimerContextType {
  showDisclaimer: () => void;
  checkSymptoms: (symptoms: Symptom[]) => void;
}

const MedicalDisclaimerContext = createContext<MedicalDisclaimerContextType | null>(null);

export function MedicalDisclaimerProvider({ children }: { children: ReactNode }) {
  // Start false so returning users can click buttons; effect shows modal only for first-time users
  const [isVisible, setIsVisible] = useState(false);
  const [redFlags, setRedFlags] = useState<ReturnType<typeof detectRedFlags>>([]);
  const [emergencyResources, setEmergencyResources] = useState<ReturnType<typeof getEmergencyResources> | null>(null);
  const opik = useOpik();

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('bloomflow_disclaimer_seen');
    if (hasSeenDisclaimer) {
      setIsVisible(false); // returning user: keep modal closed so buttons work
    } else {
      setIsVisible(true);  // first-time user: show popup so they see the disclaimer
    }
  }, []);

  const showDisclaimer = () => {
    setIsVisible(true);
  };

  const checkSymptoms = (symptoms: Symptom[]) => {
    const flags = detectRedFlags(symptoms);
    setRedFlags(flags);

    if (flags.length > 0) {
      const maxSeverity = flags.reduce((max, flag) => {
        const severityLevels: Record<SymptomSeverity, number> = {
          none: 0, mild: 1, moderate: 2, severe: 3, critical: 4,
        };
        return severityLevels[flag.severity] > severityLevels[max.severity] ? flag : max;
      }, flags[0]);

      setEmergencyResources(getEmergencyResources(maxSeverity.severity));

      // Log to Opik
      opik.logSafetyIncident({
        type: 'red_flag_symptom',
        severity: maxSeverity.severity,
        description: `Red flag symptoms detected: ${flags.map(f => f.symptom).join(', ')}`,
        timestamp: new Date(),
        data: { symptoms, flags },
      });
    } else {
      setEmergencyResources(null);
    }
  };

  const acknowledgeDisclaimer = () => {
    localStorage.setItem('bloomflow_disclaimer_seen', 'true');
    setIsVisible(false);
    opik.logCompliance('disclaimer_acknowledged', { timestamp: new Date() });
  };

  return (
    <MedicalDisclaimerContext.Provider value={{ showDisclaimer, checkSymptoms }}>
      {children}
      
      {/* Styled Medical Disclaimer - Stone Tablet Theme */}
      <StyledMedicalDisclaimer
        isVisible={isVisible}
        onAcknowledge={acknowledgeDisclaimer}
        redFlags={redFlags}
        emergencyResources={emergencyResources || undefined}
      />
    </MedicalDisclaimerContext.Provider>
  );
}

export function useMedicalDisclaimer() {
  const context = useContext(MedicalDisclaimerContext);
  if (!context) {
    throw new Error('useMedicalDisclaimer must be used within MedicalDisclaimerProvider');
  }
  return context;
}
