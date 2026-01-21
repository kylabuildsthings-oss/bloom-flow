'use client';

import { ProgressReport } from '@/components/ProgressReport';
import { ConsentFlow } from '@/components/ConsentFlow';
import { WellnessRecommendations } from '@/components/WellnessRecommendations';
import { HealthImpactAnalysis } from '@/components/HealthImpactAnalysis';
import { AuditTrail } from '@/components/AuditTrail';

export default function CottagePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-accent-50/30">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🪙</span>
            <h1 className="text-4xl font-bold text-accent-700">Coin Cottage</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            Track your wellness achievements and earn rewards for your health journey. Every milestone matters, every coin counts.
          </p>
        </header>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressReport />
            <ConsentFlow />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WellnessRecommendations />
            <HealthImpactAnalysis />
          </div>
          
          <AuditTrail />
        </div>
      </div>
    </main>
  );
}
