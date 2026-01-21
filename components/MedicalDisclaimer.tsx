'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AlertTriangle, X, Phone, ExternalLink } from 'lucide-react';
import { useOpik } from '@/lib/opik';
import { detectRedFlags, getEmergencyResources, type Symptom, type SymptomSeverity } from '@/lib/symptom-detection';

interface MedicalDisclaimerContextType {
  showDisclaimer: () => void;
  checkSymptoms: (symptoms: Symptom[]) => void;
}

const MedicalDisclaimerContext = createContext<MedicalDisclaimerContextType | null>(null);

export function MedicalDisclaimerProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [redFlags, setRedFlags] = useState<ReturnType<typeof detectRedFlags>>([]);
  const [emergencyResources, setEmergencyResources] = useState<ReturnType<typeof getEmergencyResources> | null>(null);
  const opik = useOpik();

  useEffect(() => {
    // Show disclaimer on first load
    const hasSeenDisclaimer = localStorage.getItem('bloomflow_disclaimer_seen');
    if (!hasSeenDisclaimer) {
      setIsVisible(true);
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
      
      {/* Persistent Disclaimer Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-accent-50 border-t border-accent-200 p-4 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-accent-600 w-5 h-5" />
            <p className="text-sm text-neutral-700">
              <strong>Not medical advice.</strong> Consult your healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Full Disclaimer Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary-700 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Important Medical Disclaimer
                </h2>
                <button
                  onClick={acknowledgeDisclaimer}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-neutral-700">
                <div className="bg-accent-50 border-l-4 border-accent-500 p-4">
                  <p className="font-semibold text-accent-900 mb-2">
                    This application is not a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                  <p>
                    Always seek the advice of your physician or other qualified health provider with any questions
                    you may have regarding a medical condition. Never disregard professional medical advice or delay
                    in seeking it because of something you have read or tracked in this application.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Emergency Situations</h3>
                  <p>
                    If you are experiencing a medical emergency, call 911 or go to the nearest emergency room immediately.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Data Privacy</h3>
                  <p>
                    Your health data is stored locally on your device with encryption. We prioritize your privacy
                    and comply with health data protection standards.
                  </p>
                </div>
              </div>

              <button
                onClick={acknowledgeDisclaimer}
                className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Red Flag Alert */}
      {redFlags.length > 0 && emergencyResources && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-500 rounded-lg shadow-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-red-600 w-8 h-8 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Red Flag Symptoms Detected
                </h3>
                <div className="space-y-2 mb-4">
                  {redFlags.map((flag, idx) => (
                    <div key={idx} className="bg-white rounded p-3">
                      <p className="font-semibold text-red-800">{flag.symptom}</p>
                      <p className="text-sm text-red-700">{flag.description}</p>
                      <p className="text-sm font-medium text-red-600 mt-1">
                        Recommended: {flag.recommendedAction === 'emergency' ? 'Seek Emergency Care' :
                        flag.recommendedAction === 'urgent' ? 'Urgent Care Recommended' :
                        flag.recommendedAction === 'consult' ? 'Consult Healthcare Provider' : 'Monitor'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-semibold text-red-900 mb-2">{emergencyResources.title}</h4>
                  <div className="space-y-2">
                    {emergencyResources.resources.map((resource, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">{resource.name}</p>
                          <p className="text-sm text-red-700">{resource.contact}</p>
                          <p className="text-xs text-red-600">{resource.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRedFlags([]);
                    setEmergencyResources(null);
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
