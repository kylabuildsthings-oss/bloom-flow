'use client';

import { useState, useEffect } from 'react';
import { Heart, BookOpen, AlertCircle } from 'lucide-react';
import { RecommendationEngine, Recommendation } from '@/lib/recommendation-engine';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';

export function WellnessRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentPhase, setCurrentPhase] = useState<CyclePhase | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'workout' | 'nutrition' | 'stress' | 'sleep'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);

    // Get current phase prediction
    const cycleData = await HealthDataStorage.getSensitive('cycle_data');
    if (!cycleData || cycleData.length === 0) {
      setIsLoading(false);
      return;
    }

    const cycleHistory = cycleData.map((d: any) => ({
      periodStart: new Date(d.date),
      symptoms: [],
      date: new Date(d.date),
    }));

    const today = new Date();
    const phaseProbs = CycleEngine.predictPhase(cycleHistory, today);
    const topPhase = phaseProbs.reduce((max, p) => 
      p.probability > max.probability ? p : max
    );

    setCurrentPhase(topPhase.phase);

    // Get recommendations for current phase
    const recs = RecommendationEngine.getAllRecommendations(topPhase.phase);
    setRecommendations(recs);

    setIsLoading(false);
    opik.logNonSensitive('recommendations_generated', {
      phase: topPhase.phase,
      count: recs.length,
    });
  };

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      workout: '💪',
      nutrition: '🥗',
      stress: '🧘',
      sleep: '😴',
    };
    return icons[category] || '📋';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[priority as keyof typeof colors] || 'bg-neutral-100 text-neutral-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">Wellness Recommendations</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Loading recommendations...</p>
        </div>
      ) : !currentPhase ? (
        <div className="text-center py-8 text-neutral-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Not enough data for recommendations</p>
          <p className="text-sm">Start tracking your cycle to get personalized recommendations</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Phase Info */}
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <p className="text-sm text-primary-700 mb-1">Recommendations for</p>
            <p className="text-xl font-bold text-primary-900 capitalize">{currentPhase} Phase</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'workout', 'nutrition', 'stress', 'sleep'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category === 'all' ? 'All' : `${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
              </button>
            ))}
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <p>No recommendations available for this category</p>
              </div>
            ) : (
              filteredRecommendations.map(rec => (
                <div
                  key={rec.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                      <div>
                        <h3 className="font-semibold text-neutral-800">{rec.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                          <span className="text-xs text-neutral-500 capitalize">{rec.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 mb-3">{rec.description}</p>

                  {/* Citations */}
                  {rec.citations.length > 0 && (
                    <div className="mb-3">
                      <button
                        onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{expandedId === rec.id ? 'Hide' : 'Show'} Research Citations</span>
                      </button>
                      {expandedId === rec.id && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                          <p className="text-xs font-semibold text-neutral-700 mb-2">Evidence Sources:</p>
                          <ul className="space-y-2">
                            {rec.citations.map((citation, idx) => (
                              <li key={idx} className="text-xs text-neutral-600">
                                <p className="font-medium">{citation.title}</p>
                                {citation.authors && <p>{citation.authors}</p>}
                                {citation.journal && <p className="italic">{citation.journal}</p>}
                                {citation.year && <p>{citation.year}</p>}
                                {citation.doi && (
                                  <p className="text-primary-600">
                                    DOI: {citation.doi}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-accent-900">{rec.disclaimer}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* General Disclaimer */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">Important Medical Disclaimer</p>
                  <p className="text-sm text-red-800">
                    These recommendations are for informational purposes only and are not a substitute for
                    professional medical advice, diagnosis, or treatment. Always consult your healthcare provider
                    before making significant changes to your diet, exercise routine, or lifestyle, especially if
                    you have underlying health conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
