'use client';

import { useState, useEffect } from 'react';
import { Brain, ChevronRight, Info, Eye } from 'lucide-react';
import { AIReasoning, ReasoningChain, ReasoningStep } from '@/lib/ai-reasoning';
import { CycleEngine, CyclePhase } from '@/lib/cycle-engine';
import { HealthDataStorage } from '@/lib/storage';
import { useOpik } from '@/lib/opik';

export function AIReasoningChain() {
  const [reasoningChain, setReasoningChain] = useState<ReasoningChain | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const opik = useOpik();

  const generateExample = async () => {
    setIsLoading(true);

    // Load user data
    const cycleData = await HealthDataStorage.getSensitive('cycle_data');
    const symptoms = await HealthDataStorage.getSensitive('symptoms');
    const healthMetrics = await HealthDataStorage.getSensitive('health_metrics');

    // Example input
    const input = {
      cycleDay: 18,
      symptoms: ['low energy', 'headache'],
      healthMetrics: {
        sleepQuality: 6,
        energyLevel: 4,
        mood: 5,
        stress: 6,
      },
      recentActivity: ['intense workout yesterday'],
      userQuery: 'What should I do today?',
    };

    // Determine phase
    let currentPhase: CyclePhase = 'luteal';
    if (cycleData && cycleData.length > 0) {
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
      currentPhase = topPhase.phase;
    }

    // Build reasoning chain
    const chain = AIReasoning.buildReasoningChain(input, currentPhase);
    setReasoningChain(chain);

    // Log to Opik
    opik.logNonSensitive('reasoning_chain_generated', {
      steps: chain.steps.length,
      confidence: chain.finalRecommendation.confidence,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    generateExample();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Building reasoning chain...</p>
        </div>
      </div>
    );
  }

  if (!reasoningChain) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8 text-neutral-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No reasoning chain available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">AI Reasoning Chain</h2>
      </div>

      {/* Input */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Input</h3>
        <div className="space-y-1 text-sm text-blue-800">
          <p><strong>Cycle Day:</strong> {reasoningChain.input.cycleDay}</p>
          <p><strong>Symptoms:</strong> {reasoningChain.input.symptoms.join(', ') || 'None'}</p>
          <p><strong>Health Metrics:</strong> {Object.entries(reasoningChain.input.healthMetrics).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
          {reasoningChain.input.recentActivity.length > 0 && (
            <p><strong>Recent Activity:</strong> {reasoningChain.input.recentActivity.join(', ')}</p>
          )}
        </div>
      </div>

      {/* Reasoning Steps */}
      <div className="mb-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Reasoning Steps</h3>
        <div className="space-y-4">
          {reasoningChain.steps.map((step, idx) => (
            <div key={step.id} className="border rounded-lg p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedStep(expandedStep === step.stepNumber ? null : step.stepNumber)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {step.stepNumber}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">{step.description}</h4>
                    <p className="text-sm text-neutral-600 mt-1">{step.reasoning}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-neutral-400 transition-transform ${
                    expandedStep === step.stepNumber ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {expandedStep === step.stepNumber && (
                <div className="mt-4 pt-4 border-t border-neutral-200 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 mb-1">Input Data:</p>
                    <pre className="text-xs bg-neutral-50 p-2 rounded border overflow-x-auto">
                      {JSON.stringify(step.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 mb-1">Output:</p>
                    <pre className="text-xs bg-neutral-50 p-2 rounded border overflow-x-auto">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs text-neutral-600">
                      Confidence: {(step.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Recommendation */}
      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Final Recommendation</h3>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-bold text-green-900">
            {reasoningChain.finalRecommendation.title}
          </p>
          <p className="text-sm text-green-800">
            {reasoningChain.finalRecommendation.description}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-green-700">
              <strong>Type:</strong> {reasoningChain.finalRecommendation.type}
            </span>
            <span className="text-xs text-green-700">
              <strong>Confidence:</strong> {(reasoningChain.finalRecommendation.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Opik Note */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          <strong>Opik Trace:</strong> Every step in this reasoning chain is logged to Opik for
          transparency and audit purposes. You can drill into any decision point for detailed analysis.
        </p>
      </div>
    </div>
  );
}
