'use client';

import { FocusFactory } from '@/components/FocusFactory';
import { ABTestingDashboard } from '@/components/ABTestingDashboard';
import { AIReasoningChain } from '@/components/AIReasoningChain';

export default function FactoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50/30">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">⚙️</span>
            <h1 className="text-4xl font-bold text-secondary-700">Focus Factory</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            AI-powered insights and analytics. See your productivity pipeline in action with our factory visualization!
          </p>
        </header>

        <div className="space-y-8">
          <FocusFactory />
          
          <ABTestingDashboard />
          
          <AIReasoningChain />
        </div>
      </div>
    </main>
  );
}
