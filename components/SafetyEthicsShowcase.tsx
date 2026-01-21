'use client';

import { Shield, Lock, FileCheck, CheckCircle2, AlertTriangle, Eye, EyeOff, FileText, UserCheck } from 'lucide-react';

interface ComplianceItem {
  category: string;
  icon: React.ReactNode;
  items: {
    title: string;
    description: string;
    status: 'compliant' | 'verified' | 'documented';
    evidence?: string;
  }[];
}

const complianceData: ComplianceItem[] = [
  {
    category: 'Privacy Protection',
    icon: <Lock className="w-5 h-5" />,
    items: [
      {
        title: 'Local-First Storage',
        description: 'All sensitive health data stored locally using localForage with AES-256 encryption',
        status: 'compliant',
        evidence: 'lib/storage.ts, lib/encryption.ts'
      },
      {
        title: 'End-to-End Encryption',
        description: 'AES-256 encryption for all health metrics before storage',
        status: 'compliant',
        evidence: 'lib/encryption.ts - encryptHealthData()'
      },
      {
        title: 'Data Minimization',
        description: 'Only essential health data collected, no unnecessary tracking',
        status: 'compliant',
        evidence: 'Consent flow requires explicit permission for each data type'
      },
      {
        title: 'Opik Privacy Metrics',
        description: 'Separate tracing for sensitive vs non-sensitive data with privacy protection metrics',
        status: 'verified',
        evidence: 'lib/opik.tsx - logPrivacyMetric()'
      }
    ]
  },
  {
    category: 'Medical Disclaimer Compliance',
    icon: <AlertTriangle className="w-5 h-5" />,
    items: [
      {
        title: 'Persistent Disclaimer Banner',
        description: 'Medical disclaimer displayed at all times, cannot be permanently dismissed',
        status: 'compliant',
        evidence: 'components/MedicalDisclaimer.tsx'
      },
      {
        title: 'Initial Consent Modal',
        description: 'Users must acknowledge medical disclaimer before using the app',
        status: 'compliant',
        evidence: 'components/MedicalDisclaimer.tsx - Initial modal on first visit'
      },
      {
        title: 'Red Flag Symptom Detection',
        description: 'Automatic detection and logging of red flag symptoms with emergency resource suggestions',
        status: 'verified',
        evidence: 'lib/symptom-detection.ts - detectRedFlagSymptoms()'
      },
      {
        title: 'Severity Escalation Alerts',
        description: 'System detects symptom severity escalation and recommends professional consultation',
        status: 'verified',
        evidence: 'lib/symptom-detection.ts - detectSeverityEscalation()'
      }
    ]
  },
  {
    category: 'Responsible AI Guidelines',
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        title: 'Transparent AI Reasoning',
        description: 'All AI recommendations include reasoning chain and confidence scores',
        status: 'verified',
        evidence: 'components/AIReasoningChain.tsx, Opik traces include reasoning'
      },
      {
        title: 'A/B Testing Framework',
        description: 'AI recommendations tested with control groups and statistical validation',
        status: 'verified',
        evidence: 'lib/ab-testing.ts, components/ABTestingDashboard.tsx'
      },
      {
        title: 'Safety Compliance Monitoring',
        description: 'Continuous monitoring of AI recommendations for safety and compliance',
        status: 'verified',
        evidence: 'lib/safety-compliance.ts, components/SafetyComplianceDashboard.tsx'
      },
      {
        title: 'Bias Detection',
        description: 'Opik traces include bias detection metrics for AI recommendations',
        status: 'verified',
        evidence: 'lib/opik-validation.ts - validateAIRecommendations()'
      }
    ]
  },
  {
    category: 'User Consent Documentation',
    icon: <UserCheck className="w-5 h-5" />,
    items: [
      {
        title: 'Granular Consent Management',
        description: 'Users can grant/revoke consent for data collection, sharing, analytics, and cloud backup separately',
        status: 'compliant',
        evidence: 'components/ConsentFlow.tsx'
      },
      {
        title: 'Consent Audit Trail',
        description: 'All consent changes logged with timestamps and details',
        status: 'documented',
        evidence: 'lib/audit.ts - logConsentChange()'
      },
      {
        title: 'Clear Consent Language',
        description: 'Consent requests use clear, non-technical language explaining data usage',
        status: 'compliant',
        evidence: 'components/ConsentFlow.tsx - user-friendly consent descriptions'
      },
      {
        title: 'Easy Consent Withdrawal',
        description: 'Users can withdraw consent at any time with immediate effect',
        status: 'compliant',
        evidence: 'components/ConsentFlow.tsx - revokeConsent() function'
      }
    ]
  }
];

export function SafetyEthicsShowcase() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'verified':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'documented':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-neutral-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'verified':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'documented':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-primary-700">Safety & Ethics Showcase</h2>
      </div>

      <div className="mb-6 p-4 bg-accent-50 rounded-lg border border-accent-200">
        <p className="text-sm text-accent-800">
          <strong>Comprehensive compliance documentation</strong> - Every safety and ethics measure is implemented, verified, and documented
        </p>
      </div>

      <div className="space-y-6">
        {complianceData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border border-neutral-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-primary-700">{category.category}</h3>
            </div>
            
            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <h4 className="font-semibold text-primary-700">{item.title}</h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                  {item.evidence && (
                    <div className="text-xs text-neutral-500 bg-white px-2 py-1 rounded border border-neutral-200 inline-block">
                      <FileCheck className="w-3 h-3 inline mr-1" />
                      Evidence: {item.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-700">
            {complianceData.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'compliant').length, 0)}
          </div>
          <div className="text-sm text-primary-600">Compliant Measures</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700">
            {complianceData.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'verified').length, 0)}
          </div>
          <div className="text-sm text-blue-600">Verified Measures</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-700">
            {complianceData.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'documented').length, 0)}
          </div>
          <div className="text-sm text-purple-600">Documented Measures</div>
        </div>
      </div>
    </div>
  );
}
