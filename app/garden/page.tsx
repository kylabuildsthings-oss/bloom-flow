'use client';

import { BodyGarden } from '@/components/BodyGarden';
import { CycleVisualization } from '@/components/CycleVisualization';
import { SymptomTracker } from '@/components/SymptomTracker';
import { CyclePrediction } from '@/components/CyclePrediction';
import { HealthCorrelations } from '@/components/HealthCorrelations';
import { HealthMetricsTracker } from '@/components/HealthMetricsTracker';
import { OpikValidationDashboard } from '@/components/OpikValidationDashboard';

export default function GardenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌿</span>
            <h1 className="text-4xl font-bold text-primary-700">Body Garden</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            Track your health metrics and watch your garden grow! Each plant represents a different aspect of your wellness journey.
          </p>
        </header>

        <div className="space-y-8">
          <BodyGarden />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CycleVisualization />
            <SymptomTracker />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CyclePrediction />
            <HealthCorrelations />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthMetricsTracker />
            <OpikValidationDashboard />
          </div>
        </div>
      </div>
    </main>
  );
}
