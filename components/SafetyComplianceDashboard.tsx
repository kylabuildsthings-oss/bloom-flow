'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, Lock, CheckCircle } from 'lucide-react';
import { SafetyCompliance, ComplianceReport } from '@/lib/safety-compliance';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';

export function SafetyComplianceDashboard() {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setIsLoading(true);

    // Load compliance data (would come from actual system)
    const disclaimerViews = await HealthDataStorage.getNonSensitive('disclaimer_views') || [];
    const redFlagEvents = await HealthDataStorage.getSensitive('red_flag_events') || [];
    const privacyEvents = await HealthDataStorage.getNonSensitive('privacy_events') || [];
    const ethicalMetrics = await HealthDataStorage.getNonSensitive('ethical_metrics') || [];

    const complianceReport = SafetyCompliance.generateReport(
      disclaimerViews,
      redFlagEvents,
      privacyEvents,
      ethicalMetrics
    );

    setReport(complianceReport);

    // Log to Opik
    opik.logNonSensitive('compliance_dashboard_viewed', {
      complianceScore: complianceReport.complianceScore,
    });

    setIsLoading(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8 text-neutral-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No compliance data available</p>
        </div>
      </div>
    );
  }

  const issues = SafetyCompliance.checkComplianceIssues(report);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">Safety & Compliance Monitoring</h2>
      </div>

      {/* Compliance Score */}
      <div className={`mb-6 p-6 rounded-lg border-2 ${getScoreColor(report.complianceScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Overall Compliance Score</p>
            <p className="text-4xl font-bold">{report.complianceScore}/100</p>
          </div>
          <Shield className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Issues Alert */}
      {issues.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Compliance Issues Detected</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
            {issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Medical Disclaimer Views */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-800">Medical Disclaimer Views</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">Total Views</span>
            <span className="font-semibold text-neutral-800">{report.disclaimerViews.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">Acknowledged</span>
            <span className="font-semibold text-green-600">
              {report.disclaimerViews.filter(d => d.acknowledged).length}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">Unacknowledged</span>
            <span className="font-semibold text-red-600">
              {report.disclaimerViews.filter(d => !d.acknowledged).length}
            </span>
          </div>
        </div>
      </div>

      {/* Red Flag Events */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-neutral-800">Red Flag Symptom Monitoring</h3>
        </div>
        <div className="space-y-2">
          {report.redFlagEvents.length === 0 ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">No red flag events recorded</p>
            </div>
          ) : (
            report.redFlagEvents.slice(0, 5).map((event, idx) => (
              <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-red-900">{event.symptom}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.severity === 'critical' ? 'bg-red-600 text-white' :
                    event.severity === 'high' ? 'bg-red-400 text-white' :
                    'bg-yellow-200 text-yellow-900'
                  }`}>
                    {event.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-red-700 mt-1">
                  <span>AI Response: {event.aiResponse}</span>
                  <span>User Action: {event.userAction.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Privacy Protection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-800">Privacy Protection Measures</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">Data Encrypted</span>
            <span className="font-semibold text-green-600">
              {report.privacyEvents.filter(e => e.action === 'data_encrypted').length}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">Consent Granted</span>
            <span className="font-semibold text-green-600">
              {report.privacyEvents.filter(e => e.action === 'consent_granted').length}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">Audit Accesses</span>
            <span className="font-semibold text-blue-600">
              {report.privacyEvents.filter(e => e.action === 'audit_accessed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Ethical AI Metrics */}
      {report.ethicalMetrics.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-3">Ethical AI Usage Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {report.ethicalMetrics.slice(0, 4).map((metric, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-xs text-neutral-600 mb-1 capitalize">{metric.category}</p>
                <p className="text-lg font-bold text-neutral-800">{metric.value}</p>
                <p className="text-xs text-neutral-500">{metric.metric}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
