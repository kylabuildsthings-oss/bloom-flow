'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Share2, Calendar } from 'lucide-react';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';
import { format, subDays } from 'date-fns';

interface ReportData {
  period: {
    start: string;
    end: string;
  };
  symptoms: Array<{
    name: string;
    frequency: number;
    avgSeverity: string;
  }>;
  cycleLength: number;
  phaseDistribution: Record<string, number>;
}

export function ProgressReport() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const opik = useOpik();

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Load data
    const cycleData = await HealthDataStorage.getSensitive('cycle_data');
    const symptoms = await HealthDataStorage.getSensitive('symptoms');

    if (!cycleData || cycleData.length === 0) {
      setIsGenerating(false);
      return;
    }

    // Calculate report metrics
    const last30Days = cycleData.slice(-30);
    const periodDays = last30Days.filter((d: any) => d.flow !== 'none');
    const startDate = periodDays[0]?.date || last30Days[0]?.date;
    const endDate = periodDays[periodDays.length - 1]?.date || last30Days[last30Days.length - 1]?.date;

    // Symptom analysis
    const symptomMap = new Map<string, { count: number; severities: string[] }>();
    if (symptoms) {
      symptoms.forEach((s: any) => {
        const existing = symptomMap.get(s.name) || { count: 0, severities: [] };
        existing.count++;
        existing.severities.push(s.severity);
        symptomMap.set(s.name, existing);
      });
    }

    const symptomStats = Array.from(symptomMap.entries()).map(([name, data]) => {
      const severityCounts = data.severities.reduce((acc, s) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const avgSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'mild';
      
      return {
        name,
        frequency: data.count,
        avgSeverity,
      };
    });

    // Phase distribution
    const phaseDist = last30Days.reduce((acc: Record<string, number>, day: any) => {
      acc[day.phase] = (acc[day.phase] || 0) + 1;
      return acc;
    }, {});

    setReportData({
      period: {
        start: startDate,
        end: endDate,
      },
      symptoms: symptomStats,
      cycleLength: last30Days.length,
      phaseDistribution: phaseDist,
    });

    setIsGenerating(false);
    opik.logNonSensitive('report_generated', {});
  };

  const exportReport = () => {
    if (!reportData) return;

    const report = {
      generated: new Date().toISOString(),
      period: reportData.period,
      cycleLength: reportData.cycleLength,
      phaseDistribution: reportData.phaseDistribution,
      symptoms: reportData.symptoms,
      note: 'This report is suitable for sharing with your healthcare provider.',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloomflow-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    opik.logSensitive('report_exported', {});
  };

  const shareReport = async () => {
    if (!reportData) return;

    if (navigator.share) {
      try {
        const report = {
          title: 'BloomFlow Health Report',
          text: `Health report for ${reportData.period.start} to ${reportData.period.end}`,
          url: window.location.href,
        };
        await navigator.share(report);
        opik.logSensitive('report_shared', { method: 'native' });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const reportText = JSON.stringify(reportData, null, 2);
      await navigator.clipboard.writeText(reportText);
      alert('Report copied to clipboard');
      opik.logSensitive('report_shared', { method: 'clipboard' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Progress Report</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportReport}
            disabled={!reportData || isGenerating}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
            title="Download Report"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={shareReport}
            disabled={!reportData || isGenerating}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
            title="Share Report"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div className="text-center py-8 text-neutral-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p>Generating report...</p>
        </div>
      ) : !reportData ? (
        <div className="text-center py-8 text-neutral-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No data available for report</p>
          <p className="text-sm">Start tracking your cycle and symptoms to generate reports</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-primary-900">Reporting Period</h3>
            </div>
            <p className="text-sm text-primary-700">
              {format(new Date(reportData.period.start), 'MMMM d, yyyy')} -{' '}
              {format(new Date(reportData.period.end), 'MMMM d, yyyy')}
            </p>
            <p className="text-xs text-primary-600 mt-1">
              Cycle Length: {reportData.cycleLength} days
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Phase Distribution</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(reportData.phaseDistribution).map(([phase, days]) => (
                <div key={phase} className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-neutral-700 capitalize">{phase}</p>
                  <p className="text-2xl font-bold text-primary-600">{days}</p>
                  <p className="text-xs text-neutral-500">days</p>
                </div>
              ))}
            </div>
          </div>

          {reportData.symptoms.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Symptom Summary</h3>
              <div className="space-y-2">
                {reportData.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-800">{symptom.name}</p>
                      <p className="text-xs text-neutral-600">
                        Average severity: {symptom.avgSeverity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{symptom.frequency}</p>
                      <p className="text-xs text-neutral-500">occurrences</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
            <p className="text-sm text-accent-900">
              <strong>Note:</strong> This report is formatted for sharing with healthcare providers.
              All data is anonymized and focuses on clinical patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
