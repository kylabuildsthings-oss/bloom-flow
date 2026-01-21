'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, TrendingUp, BarChart, CheckCircle } from 'lucide-react';
import { ABTesting, ABTest, TestGroup } from '@/lib/ab-testing';
import { useOpik } from '@/lib/opik';

export function ABTestingDashboard() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const opik = useOpik();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = () => {
    const activeTests = ABTesting.getAllActiveTests();
    setTests(activeTests);
    
    if (activeTests.length > 0) {
      setSelectedTest(activeTests[0]);
    }
    
    setIsLoading(false);
    opik.logNonSensitive('ab_testing_viewed', { testCount: activeTests.length });
  };

  const getGroupColor = (group: TestGroup): string => {
    const colors = {
      control: 'bg-blue-100 text-blue-800 border-blue-300',
      variant_a: 'bg-green-100 text-green-800 border-green-300',
      variant_b: 'bg-purple-100 text-purple-800 border-purple-300',
      variant_c: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colors[group] || 'bg-neutral-100 text-neutral-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-neutral-500">Loading A/B tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <FlaskConical className="text-primary-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-primary-700">A/B Testing Framework</h2>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active A/B tests</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test Selector */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Select Test
            </label>
            <select
              value={selectedTest?.id || ''}
              onChange={(e) => {
                const test = tests.find(t => t.id === e.target.value);
                setSelectedTest(test || null);
              }}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {tests.map(test => (
                <option key={test.id} value={test.id}>
                  {test.name} ({test.phase} phase)
                </option>
              ))}
            </select>
          </div>

          {selectedTest && (
            <>
              {/* Test Overview */}
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2">{selectedTest.name}</h3>
                <p className="text-sm text-primary-700 mb-3">{selectedTest.phase} phase</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary-700">
                    <strong>Total Users:</strong> {selectedTest.metrics.totalUsers}
                  </span>
                  <span className="text-primary-700">
                    <strong>Status:</strong> {selectedTest.active ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h3 className="font-semibold text-neutral-800 mb-4">Test Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTest.variants.map((variant, idx) => {
                    const metrics = selectedTest.metrics.outcomes[variant.id];
                    const significance = selectedTest.metrics.statisticalSignificance;
                    const isWinner = significance?.winner === variant.id;

                    return (
                      <div
                        key={idx}
                        className={`border-2 rounded-lg p-4 ${
                          isWinner ? 'border-green-500 bg-green-50' : 'border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded text-sm font-medium border ${getGroupColor(variant.id)}`}>
                              {variant.name}
                            </span>
                            {isWinner && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">{variant.description}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Sample Size</p>
                            <p className="font-semibold text-neutral-800">{metrics.sampleSize} users</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Acceptance Rate</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${metrics.acceptanceRate * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {(metrics.acceptanceRate * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Health Improvement</p>
                            <p className="font-semibold text-green-600">
                              +{metrics.healthImprovement.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistical Significance */}
              {selectedTest.metrics.statisticalSignificance && (
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-neutral-800">Statistical Analysis</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">P-Value</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedTest.metrics.statisticalSignificance.pValue.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Confidence</span>
                      <span className="font-semibold text-primary-600">
                        {selectedTest.metrics.statisticalSignificance.confidence.toFixed(1)}%
                      </span>
                    </div>
                    {selectedTest.metrics.statisticalSignificance.winner && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-semibold text-green-900 mb-1">
                          Winner: {selectedTest.metrics.statisticalSignificance.winner}
                        </p>
                        <p className="text-sm text-green-700">
                          {selectedTest.metrics.statisticalSignificance.recommendation}
                        </p>
                      </div>
                    )}
                    {!selectedTest.metrics.statisticalSignificance.winner && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          {selectedTest.metrics.statisticalSignificance.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
