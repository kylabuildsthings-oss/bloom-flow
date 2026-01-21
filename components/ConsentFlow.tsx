'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { AuditLogger } from '@/lib/audit';

interface Consent {
  id: string;
  type: 'data_collection' | 'data_sharing' | 'analytics' | 'backup';
  granted: boolean;
  timestamp: Date;
  details?: string;
}

const CONSENT_TYPES = [
  {
    id: 'data_collection',
    title: 'Data Collection',
    description: 'Allow collection of cycle and symptom data for tracking purposes',
    required: true,
  },
  {
    id: 'data_sharing',
    title: 'Data Sharing',
    description: 'Allow sharing anonymized data with healthcare providers',
    required: false,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Allow use of anonymized data for improving the app experience',
    required: false,
  },
  {
    id: 'backup',
    title: 'Cloud Backup',
    description: 'Allow encrypted backup of data to cloud storage',
    required: false,
  },
] as const;

export function ConsentFlow() {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadConsents();
  }, []);

  const loadConsents = async () => {
    const data = await HealthDataStorage.getNonSensitive('consents');
    if (data) {
      setConsents(data.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp),
      })));
    } else {
      // Initialize with default consents
      const defaultConsents: Consent[] = CONSENT_TYPES.map(type => ({
        id: type.id,
        type: type.id as Consent['type'],
        granted: type.required, // Required consents are granted by default
        timestamp: new Date(),
      }));
      setConsents(defaultConsents);
      await HealthDataStorage.storeNonSensitive('consents', defaultConsents);
    }
    setIsLoading(false);
    opik.logNonSensitive('consents_viewed', {});
  };

  const updateConsent = async (type: Consent['type'], granted: boolean) => {
    const updated = consents.map(c =>
      c.type === type
        ? { ...c, granted, timestamp: new Date() }
        : c
    );
    setConsents(updated);
    await HealthDataStorage.storeNonSensitive('consents', updated);

    // Log to audit trail
    await AuditLogger.logAccess({
      action: 'consent',
      dataType: 'non-sensitive',
      key: `consent_${type}`,
      timestamp: new Date(),
      details: { granted },
    });

    // Log to Opik
    opik.logCompliance('consent_updated', {
      type,
      granted,
      timestamp: new Date(),
    });

    opik.logNonSensitive('consent_changed', { type, granted });
  };

  const getConsent = (type: Consent['type']) => {
    return consents.find(c => c.type === type);
  };

  const requiredConsentsGranted = CONSENT_TYPES
    .filter(ct => ct.required)
    .every(ct => getConsent(ct.id as Consent['type'])?.granted);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">Data Consent</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-neutral-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p>Loading consent settings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!requiredConsentsGranted && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-900 mb-2">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Required Consents</p>
              </div>
              <p className="text-sm text-red-700">
                Some required consents are not granted. Please review and grant required consents to use the app.
              </p>
            </div>
          )}

          {CONSENT_TYPES.map(consentType => {
            const consent = getConsent(consentType.id as Consent['type']);
            const isGranted = consent?.granted || false;

            return (
              <div
                key={consentType.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isGranted
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-800">
                        {consentType.title}
                      </h3>
                      {consentType.required && (
                        <span className="text-xs bg-accent-200 text-accent-900 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      {consentType.description}
                    </p>
                    {consent && (
                      <p className="text-xs text-neutral-500">
                        Last updated: {consent.timestamp.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!consentType.required || isGranted) {
                        updateConsent(consentType.id as Consent['type'], !isGranted);
                      }
                    }}
                    disabled={consentType.required && !isGranted}
                    className={`ml-4 p-2 rounded-lg transition-all ${
                      isGranted
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isGranted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="font-semibold text-neutral-800 mb-2">Your Privacy Rights</h4>
              <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
                <li>You can revoke consent at any time</li>
                <li>Your data is stored locally and encrypted</li>
                <li>You have full control over data sharing</li>
                <li>All access is logged in the audit trail</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
