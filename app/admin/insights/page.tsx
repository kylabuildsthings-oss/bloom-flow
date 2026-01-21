'use client';

import { OpikInsightsOverlay } from '@/components/OpikInsightsOverlay';
import { Shield, Lock } from 'lucide-react';

export default function AdminInsightsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <h1 className="text-4xl font-bold text-primary-700">App Analytics</h1>
            <Lock className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-neutral-600 text-lg">
            Opik Insights Dashboard - Medical-grade analytics and validation metrics.
          </p>
        </header>

        <OpikInsightsOverlay />
      </div>
    </main>
  );
}
