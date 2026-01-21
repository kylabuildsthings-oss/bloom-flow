'use client';

import { useState } from 'react';
import { Plus, Heart, CheckCircle, Moon } from 'lucide-react';
import { GardenZone, ActivityLog } from '@/lib/game-engine';
import { GameEngine } from '@/lib/game-engine';

interface ActivityLoggerProps {
  zone: GardenZone;
  onActivityLogged: (
    zone: GardenZone,
    activity: string,
    outcome: ActivityLog['outcome'],
    duration?: number,
    intensity?: 'low' | 'medium' | 'high'
  ) => void;
}

export function ActivityLogger({ zone, onActivityLogged }: ActivityLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activity, setActivity] = useState('');
  const [outcome, setOutcome] = useState<ActivityLog['outcome']>('completed-activity');
  const [duration, setDuration] = useState<number | undefined>();
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high' | undefined>();

  const handleSubmit = () => {
    if (!activity.trim()) {
      alert('Please describe your activity');
      return;
    }

    onActivityLogged(zone, activity, outcome, duration, intensity);
    
    // Reset form
    setActivity('');
    setOutcome('completed-activity');
    setDuration(undefined);
    setIntensity(undefined);
    setIsOpen(false);
  };

  const getZoneName = (zone: GardenZone): string => {
    const names = {
      sleep: 'Sleep Garden',
      nutrition: 'Nutrition Plot',
      movement: 'Movement Meadow',
      stress: 'Stress Sanctuary',
    };
    return names[zone];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Log Activity
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
      <h4 className="font-semibold text-neutral-800 mb-3">Log Activity for {getZoneName(zone)}</h4>
      
      <div className="space-y-4">
        {/* Activity Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            What did you do?
          </label>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., 8 hours of sleep, healthy breakfast, 30 min walk, meditation"
          />
        </div>

        {/* Duration (Optional) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Duration (minutes, optional)
          </label>
          <input
            type="number"
            value={duration || ''}
            onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., 30"
          />
        </div>

        {/* Intensity (Optional) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Intensity (optional)
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map(level => (
              <button
                key={level}
                onClick={() => setIntensity(intensity === level ? undefined : level)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  intensity === level
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Outcome - Most Important */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            How did it go?
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setOutcome('completed-activity')}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                outcome === 'completed-activity'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${
                  outcome === 'completed-activity' ? 'text-primary-600' : 'text-neutral-400'
                }`} />
                <div>
                  <p className="font-medium text-neutral-800">Completed Activity</p>
                  <p className="text-xs text-neutral-600">You did the activity as planned</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setOutcome('listened-to-body')}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                outcome === 'listened-to-body'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className={`w-5 h-5 ${
                  outcome === 'listened-to-body' ? 'text-primary-600' : 'text-neutral-400'
                }`} />
                <div>
                  <p className="font-medium text-neutral-800">Listened to My Body</p>
                  <p className="text-xs text-neutral-600">You adjusted based on what your body needed</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setOutcome('rested')}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                outcome === 'rested'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className={`w-5 h-5 ${
                  outcome === 'rested' ? 'text-primary-600' : 'text-neutral-400'
                }`} />
                <div>
                  <p className="font-medium text-neutral-800">Rested</p>
                  <p className="text-xs text-neutral-600">You chose rest - that's growth too!</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Log Activity
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setActivity('');
              setOutcome('completed-activity');
              setDuration(undefined);
              setIntensity(undefined);
            }}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
