'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, Heart, Moon, Activity, Target } from 'lucide-react';

interface JourneyMilestone {
  day: number;
  week: number;
  title: string;
  description: string;
  category: 'cycle' | 'symptom' | 'lifestyle' | 'ai_recommendation';
  metrics?: {
    sleep?: number;
    energy?: number;
    cycleLength?: number;
    symptomSeverity?: number;
  };
}

const journeyData: JourneyMilestone[] = [
  {
    day: 1,
    week: 1,
    title: 'Initial Assessment',
    description: 'User starts tracking with irregular 35±8 day cycles, 5.2h average sleep, and 4/10 energy levels.',
    category: 'cycle',
    metrics: { sleep: 5.2, energy: 4, cycleLength: 35, symptomSeverity: 7 }
  },
  {
    day: 7,
    week: 1,
    title: 'First AI Recommendation',
    description: 'Opik AI detects sleep pattern correlation with cycle irregularity. Recommends sleep hygiene protocol.',
    category: 'ai_recommendation',
    metrics: { sleep: 5.4, energy: 4, cycleLength: 35, symptomSeverity: 7 }
  },
  {
    day: 14,
    week: 2,
    title: 'Sleep Improvement',
    description: 'Sleep increases to 6.1h average. Energy levels show first improvement to 4.5/10.',
    category: 'lifestyle',
    metrics: { sleep: 6.1, energy: 4.5, cycleLength: 33, symptomSeverity: 6.5 }
  },
  {
    day: 21,
    week: 3,
    title: 'Cycle Pattern Recognition',
    description: 'AI identifies stress as primary cycle disruptor. Recommends stress management techniques.',
    category: 'ai_recommendation',
    metrics: { sleep: 6.3, energy: 5, cycleLength: 32, symptomSeverity: 6 }
  },
  {
    day: 28,
    week: 4,
    title: 'First Regular Cycle',
    description: 'Cycle length stabilizes to 30 days. Symptom severity drops to 5.5/10.',
    category: 'cycle',
    metrics: { sleep: 6.5, energy: 5.5, cycleLength: 30, symptomSeverity: 5.5 }
  },
  {
    day: 42,
    week: 6,
    title: 'Energy Breakthrough',
    description: 'Energy levels reach 6/10. Sleep consistently above 6.5h. Cycle regularity improving.',
    category: 'lifestyle',
    metrics: { sleep: 6.7, energy: 6, cycleLength: 29, symptomSeverity: 5 }
  },
  {
    day: 56,
    week: 8,
    title: 'Optimal Sleep Achieved',
    description: 'Sleep reaches 7h average. Cycle length stabilizes at 28±2 days. Major symptom reduction.',
    category: 'lifestyle',
    metrics: { sleep: 7.0, energy: 6.5, cycleLength: 28, symptomSeverity: 4 }
  },
  {
    day: 70,
    week: 10,
    title: 'Peak Performance',
    description: 'All metrics in optimal range. Energy at 7/10. Cycle regularity maintained. 62% symptom reduction achieved.',
    category: 'symptom',
    metrics: { sleep: 7.1, energy: 7, cycleLength: 28, symptomSeverity: 2.7 }
  },
  {
    day: 90,
    week: 13,
    title: '90-Day Transformation Complete',
    description: 'Sustained improvements across all metrics. User reports feeling "like a new person".',
    category: 'lifestyle',
    metrics: { sleep: 7.1, energy: 7, cycleLength: 28, symptomSeverity: 2.7 }
  }
];

export function UserJourneyTimeline() {
  const [selectedMilestone, setSelectedMilestone] = useState<JourneyMilestone | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cycle': return <Calendar className="w-5 h-5" />;
      case 'symptom': return <Heart className="w-5 h-5" />;
      case 'lifestyle': return <Activity className="w-5 h-5" />;
      case 'ai_recommendation': return <Target className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cycle': return 'bg-primary-100 text-primary-700 border-primary-300';
      case 'symptom': return 'bg-accent-100 text-accent-700 border-accent-300';
      case 'lifestyle': return 'bg-secondary-100 text-secondary-700 border-secondary-300';
      case 'ai_recommendation': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-primary-700">90-Day User Journey</h2>
      </div>

      <div className="mb-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <p className="text-sm text-primary-800">
          <strong>User Profile:</strong> 32-year-old with irregular cycles, chronic fatigue, and failed health goals
        </p>
        <p className="text-sm text-primary-700 mt-1">
          <strong>Intervention:</strong> BloomFlow AI-powered health tracking with Opik medical-grade analytics
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-primary-400 to-primary-500"></div>

        <div className="space-y-6">
          {journeyData.map((milestone, index) => (
            <div
              key={index}
              className="relative flex items-start gap-4 cursor-pointer group"
              onClick={() => setSelectedMilestone(milestone)}
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 ${getCategoryColor(milestone.category)} transition-transform group-hover:scale-110`}>
                {getCategoryIcon(milestone.category)}
              </div>

              {/* Content */}
              <div className={`flex-1 bg-white rounded-lg p-4 border-2 transition-all ${
                selectedMilestone?.day === milestone.day
                  ? 'border-primary-500 shadow-lg'
                  : 'border-neutral-200 group-hover:border-primary-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      Day {milestone.day} • Week {milestone.week}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(milestone.category)}`}>
                      {milestone.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-primary-700 mb-1">{milestone.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{milestone.description}</p>
                
                {milestone.metrics && (
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-neutral-200">
                    {milestone.metrics.sleep !== undefined && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-1">
                          <Moon className="w-3 h-3" />
                          <span>Sleep</span>
                        </div>
                        <div className="font-bold text-primary-700">{milestone.metrics.sleep}h</div>
                      </div>
                    )}
                    {milestone.metrics.energy !== undefined && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-1">
                          <Activity className="w-3 h-3" />
                          <span>Energy</span>
                        </div>
                        <div className="font-bold text-primary-700">{milestone.metrics.energy}/10</div>
                      </div>
                    )}
                    {milestone.metrics.cycleLength !== undefined && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>Cycle</span>
                        </div>
                        <div className="font-bold text-primary-700">{milestone.metrics.cycleLength} days</div>
                      </div>
                    )}
                    {milestone.metrics.symptomSeverity !== undefined && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-1">
                          <Heart className="w-3 h-3" />
                          <span>Symptoms</span>
                        </div>
                        <div className="font-bold text-primary-700">{milestone.metrics.symptomSeverity}/10</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMilestone && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h4 className="font-bold text-primary-700 mb-2">Selected Milestone Details</h4>
          <p className="text-sm text-primary-800">{selectedMilestone.description}</p>
        </div>
      )}
    </div>
  );
}
