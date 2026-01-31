'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  getDate,
  getDay,
  isSameMonth,
  addDays,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';

const DAILY_QUESTIONNAIRE_KEY = 'bloomflow_daily_questionnaire';

export interface DailyQuestionnaireEntry {
  sleepQuality: number;
  energyLevel: number;
  movement: 'yes' | 'no';
  nutrition: 'good' | 'okay' | 'skipped';
  stressLevel: number;
  notes?: string;
  submittedAt: string;
}

function getPhaseColor(phase: CyclePhase | null): string {
  if (!phase) return 'bg-neutral-200 border-neutral-400';
  switch (phase) {
    case 'menstrual':
      return 'bg-red-200 border-red-500';
    case 'follicular':
      return 'bg-green-200 border-green-500';
    case 'ovulation':
      return 'bg-amber-200 border-amber-500';
    case 'luteal':
      return 'bg-violet-200 border-violet-500';
    default:
      return 'bg-neutral-200 border-neutral-400';
  }
}

function getEntries(): Record<string, DailyQuestionnaireEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(DAILY_QUESTIONNAIRE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DailyQuestionnaireEntry>;
  } catch {
    return {};
  }
}

function saveEntry(dateKey: string, entry: DailyQuestionnaireEntry): void {
  const entries = getEntries();
  entries[dateKey] = entry;
  localStorage.setItem(DAILY_QUESTIONNAIRE_KEY, JSON.stringify(entries));
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function GardenCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cycleHistory, setCycleHistory] = useState<Array<{ periodStart: Date; symptoms: never[]; date: Date }>>([]);
  const [entries, setEntries] = useState<Record<string, DailyQuestionnaireEntry>>({});
  const [formData, setFormData] = useState<Partial<DailyQuestionnaireEntry>>({});

  useEffect(() => {
    HealthDataStorage.getSensitive('cycle_data').then((data: unknown) => {
      if (data && Array.isArray(data)) {
        setCycleHistory(
          data.map((d: { date: string }) => ({
            periodStart: new Date(d.date),
            symptoms: [] as never[],
            date: new Date(d.date),
          }))
        );
      }
    });
  }, []);

  useEffect(() => {
    setEntries(getEntries());
  }, [modalOpen]); // Refresh entries when modal closes

  const phaseByDate = useMemo(() => {
    const map: Record<string, CyclePhase> = {};
    if (cycleHistory.length === 0) return map;
    const start = startOfMonth(subMonths(currentMonth, 1));
    const end = endOfMonth(addMonths(currentMonth, 1));
    let d = new Date(start);
    while (d <= end) {
      const date = new Date(d);
      const probs = CycleEngine.predictPhase(cycleHistory, date);
      const top = probs.reduce((max, p) => (p.probability > max.probability ? p : max), probs[0]);
      map[format(date, 'yyyy-MM-dd')] = top.phase;
      d = addDays(d, 1);
    }
    return map;
  }, [cycleHistory, currentMonth]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startDay = getDay(start);
    const days: (Date | null)[] = [];
    // Pad start
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    // Pad end to complete last row
    const remainder = days.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) days.push(null);
    }
    return days;
  }, [currentMonth]);

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    const key = format(date, 'yyyy-MM-dd');
    const existing = entries[key];
    setFormData(
      existing
        ? {
            sleepQuality: existing.sleepQuality,
            energyLevel: existing.energyLevel,
            movement: existing.movement,
            nutrition: existing.nutrition,
            stressLevel: existing.stressLevel,
            notes: existing.notes,
          }
        : {
            sleepQuality: 3,
            energyLevel: 3,
            movement: 'yes',
            nutrition: 'good',
            stressLevel: 3,
          }
    );
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    const key = format(selectedDate, 'yyyy-MM-dd');
    const entry: DailyQuestionnaireEntry = {
      sleepQuality: formData.sleepQuality ?? 3,
      energyLevel: formData.energyLevel ?? 3,
      movement: formData.movement ?? 'yes',
      nutrition: formData.nutrition ?? 'good',
      stressLevel: formData.stressLevel ?? 3,
      notes: formData.notes,
      submittedAt: new Date().toISOString(),
    };
    saveEntry(key, entry);
    setEntries((prev) => ({ ...prev, [key]: entry }));
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-100">
            <Calendar className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-700">Calendar</h2>
            <p className="text-sm text-neutral-600">Tap a date to log your daily check-in. Colors show your cycle phase.</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="min-w-[140px] text-center font-semibold text-primary-800">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-neutral-500 py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          const dateKey = format(date, 'yyyy-MM-dd');
          const phase = phaseByDate[dateKey] ?? null;
          const hasEntry = !!entries[dateKey];
          const colorClass = getPhaseColor(phase);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => handleDateClick(date)}
              className={`
                relative aspect-square w-full max-w-[2.5rem] mx-auto rounded-full border-2 flex items-center justify-center
                transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
                ${colorClass}
                ${!isCurrentMonth ? 'opacity-50' : ''}
                ${isToday(date) ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
              `}
              aria-label={`${format(date, 'EEEE, MMMM d')}${hasEntry ? ', check-in completed' : ''}`}
            >
              <span className="text-sm font-medium text-neutral-800">{getDate(date)}</span>
              {hasEntry && (
                <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-neutral-800" />
              )}
            </button>
          );
        })}
      </div>

      {/* Phase legend */}
      <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap gap-3 text-xs text-neutral-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-200 border border-red-500" /> Menstrual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-200 border border-green-500" /> Follicular
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-500" /> Ovulation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-violet-200 border border-violet-500" /> Luteal
        </span>
        <span className="ml-auto">• = check-in done</span>
      </div>

      {/* Daily questionnaire modal */}
      {modalOpen && selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="daily-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 id="daily-modal-title" className="text-xl font-bold text-primary-700">
                  Daily check-in — {format(selectedDate, 'EEEE, MMM d')}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Sleep quality (1–5)</label>
                  <select
                    value={formData.sleepQuality ?? 3}
                    onChange={(e) => setFormData((f) => ({ ...f, sleepQuality: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} — {n <= 2 ? 'Poor' : n === 3 ? 'Okay' : 'Good'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Energy level (1–5)</label>
                  <select
                    value={formData.energyLevel ?? 3}
                    onChange={(e) => setFormData((f) => ({ ...f, energyLevel: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} — {n <= 2 ? 'Low' : n === 3 ? 'Moderate' : 'High'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Did you move today?</label>
                  <select
                    value={formData.movement ?? 'yes'}
                    onChange={(e) => setFormData((f) => ({ ...f, movement: e.target.value as 'yes' | 'no' }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nutrition</label>
                  <select
                    value={formData.nutrition ?? 'good'}
                    onChange={(e) => setFormData((f) => ({ ...f, nutrition: e.target.value as 'good' | 'okay' | 'skipped' }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                  >
                    <option value="good">Good</option>
                    <option value="okay">Okay</option>
                    <option value="skipped">Skipped</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Stress level (1–5)</label>
                  <select
                    value={formData.stressLevel ?? 3}
                    onChange={(e) => setFormData((f) => ({ ...f, stressLevel: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} — {n <= 2 ? 'Low' : n === 3 ? 'Moderate' : 'High'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (optional)</label>
                  <textarea
                    value={formData.notes ?? ''}
                    onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value || undefined }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                    placeholder="Any symptoms, mood, or notes..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
