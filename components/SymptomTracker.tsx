'use client';

import { useState, useEffect } from 'react';
import { Activity, Plus, AlertCircle } from 'lucide-react';
import { HealthDataStorage } from '@/lib/storage';
import { useMedicalDisclaimer } from './MedicalDisclaimer';
import { useOpik } from '@/lib/opik';
import type { Symptom, SymptomSeverity } from '@/lib/symptom-detection';

const SYMPTOM_CATEGORIES = [
  { value: 'pain', label: 'Pain', icon: '🩹' },
  { value: 'bleeding', label: 'Bleeding', icon: '🩸' },
  { value: 'mood', label: 'Mood', icon: '😊' },
  { value: 'digestive', label: 'Digestive', icon: '🤢' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

const SEVERITY_OPTIONS: Array<{ value: SymptomSeverity; label: string; color: string }> = [
  { value: 'none', label: 'None', color: 'bg-neutral-200' },
  { value: 'mild', label: 'Mild', color: 'bg-yellow-200' },
  { value: 'moderate', label: 'Moderate', color: 'bg-orange-200' },
  { value: 'severe', label: 'Severe', color: 'bg-red-200' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
];

export function SymptomTracker() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSymptom, setNewSymptom] = useState<Partial<Symptom>>({
    name: '',
    severity: 'mild',
    category: 'other',
    notes: '',
  });
  const { checkSymptoms } = useMedicalDisclaimer();
  const opik = useOpik();

  useEffect(() => {
    loadSymptoms();
  }, []);

  useEffect(() => {
    if (symptoms.length > 0) {
      checkSymptoms(symptoms);
    }
  }, [symptoms, checkSymptoms]);

  const loadSymptoms = async () => {
    const data = await HealthDataStorage.getSensitive('symptoms');
    if (data) {
      setSymptoms(data.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
      })));
    }
    opik.logNonSensitive('symptoms_viewed', {});
  };

  const saveSymptoms = async (updatedSymptoms: Symptom[]) => {
    await HealthDataStorage.storeSensitive('symptoms', updatedSymptoms);
    opik.logSensitive('symptoms_updated', { count: updatedSymptoms.length });
  };

  const addSymptom = async () => {
    if (!newSymptom.name) return;

    const symptom: Symptom = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      name: newSymptom.name,
      severity: newSymptom.severity || 'mild',
      category: newSymptom.category || 'other',
      notes: newSymptom.notes,
      timestamp: new Date(),
    };

    const updated = [...symptoms, symptom];
    setSymptoms(updated);
    await saveSymptoms(updated);

    // Log to Opik
    opik.logSensitive('symptom_added', {
      category: symptom.category,
      severity: symptom.severity,
    });

    // Reset form
    setNewSymptom({
      name: '',
      severity: 'mild',
      category: 'other',
      notes: '',
    });
    setIsAdding(false);
  };

  const removeSymptom = async (id: string) => {
    const updated = symptoms.filter(s => s.id !== id);
    setSymptoms(updated);
    await saveSymptoms(updated);
    opik.logSensitive('symptom_removed', { id });
  };

  const getSeverityColor = (severity: SymptomSeverity) => {
    return SEVERITY_OPTIONS.find(opt => opt.value === severity)?.color || 'bg-neutral-200';
  };

  const getCategoryIcon = (category: Symptom['category']) => {
    return SYMPTOM_CATEGORIES.find(cat => cat.value === category)?.icon || '📝';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="text-primary-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-primary-700">Symptom Tracker</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-semibold mb-4">Add New Symptom</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Symptom Name
              </label>
              <input
                type="text"
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Cramps, Headache, Nausea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={newSymptom.category}
                  onChange={(e) => setNewSymptom({ ...newSymptom, category: e.target.value as Symptom['category'] })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {SYMPTOM_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Severity
                </label>
                <select
                  value={newSymptom.severity}
                  onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value as SymptomSeverity })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {SEVERITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={2}
                placeholder="Additional details..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={addSymptom}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Add Symptom
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewSymptom({
                    name: '',
                    severity: 'mild',
                    category: 'other',
                    notes: '',
                  });
                }}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {symptoms.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No symptoms tracked yet</p>
            <p className="text-sm">Click the + button to add your first symptom</p>
          </div>
        ) : (
          symptoms
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map(symptom => (
              <div
                key={symptom.id}
                className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(symptom.category)}</span>
                      <div>
                        <h3 className="font-semibold text-neutral-800">{symptom.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(symptom.severity)}`}
                          >
                            {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                          </span>
                          {symptom.severity === 'severe' || symptom.severity === 'critical' ? (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {symptom.notes && (
                      <p className="text-sm text-neutral-600 mt-2">{symptom.notes}</p>
                    )}
                    <p className="text-xs text-neutral-500 mt-2">
                      {symptom.timestamp.toLocaleDateString()} at {symptom.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeSymptom(symptom.id)}
                    className="ml-4 text-neutral-400 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          Clinical relevance: Track patterns to share with your healthcare provider
        </p>
      </div>
    </div>
  );
}
