'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';
import { IsometricNavigation, Zone } from "@/components/IsometricNavigation";
import { ZoneView } from "@/components/ZoneView";

export default function Home() {
  const [activeZone, setActiveZone] = useState<Zone>('body-garden');

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Isometric Navigation */}
      <IsometricNavigation 
        activeZone={activeZone} 
        onZoneChange={setActiveZone} 
      />

      <div className="container mx-auto px-4 py-24">
        {/* Header - only show on body-garden */}
        {activeZone === 'body-garden' && (
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-primary-700 mb-2">
                  BloomFlow
                </h1>
                <p className="text-neutral-600">
                  Your trusted health journey companion
                </p>
              </div>
              <Link
                href="/demo"
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-soft-lg"
              >
                <Trophy className="w-5 h-5" />
                View Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </header>
        )}

        {/* Zone Content */}
        <ZoneView zone={activeZone} />
      </div>
    </main>
  );
}
