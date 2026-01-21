'use client';

import Link from 'next/link';
import { Trophy, ArrowRight, Sprout, Coins, Target } from 'lucide-react';
import { IsometricGarden } from '@/components/IsometricGarden';
import { GameEngine, GardenState } from '@/lib/game-engine';
import { GameStorage } from '@/lib/game-storage';
import { useEffect, useState } from 'react';

export default function Home() {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);

  useEffect(() => {
    loadGarden();
  }, []);

  const loadGarden = async () => {
    const state = await GameStorage.loadGardenState();
    if (state) {
      setGardenState(state);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary-700 mb-2">
                The Grove
              </h1>
              <p className="text-neutral-600 text-lg">
                Your wellness journey overview - navigate to different zones to explore
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

        {/* Isometric Overview Map */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-soft-xl p-8 border-2 border-primary-200">
            <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">
              Your Wellness Zones
            </h2>
            {gardenState && gardenState.plants.length > 0 ? (
              <IsometricGarden plants={gardenState.plants} />
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <p>Start tracking your health to see your garden grow!</p>
                <Link
                  href="/garden"
                  className="mt-4 inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Go to Garden →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/garden"
            className="group bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200 hover:border-primary-400 hover:shadow-soft-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="w-8 h-8 text-primary-600" />
              <h3 className="text-2xl font-bold text-primary-700">🌿 Body Garden</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              Track your health metrics and watch your garden grow! Each plant represents a different aspect of your wellness journey.
            </p>
            <span className="text-primary-600 font-semibold group-hover:text-primary-700">
              Explore Garden →
            </span>
          </Link>

          <Link
            href="/cottage"
            className="group bg-white rounded-xl shadow-soft-lg p-6 border-2 border-accent-200 hover:border-accent-400 hover:shadow-soft-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-accent-600" />
              <h3 className="text-2xl font-bold text-accent-700">🪙 Coin Cottage</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              Earn rewards and track your progress. Every healthy choice you make adds to your collection!
            </p>
            <span className="text-accent-600 font-semibold group-hover:text-accent-700">
              Explore Cottage →
            </span>
          </Link>

          <Link
            href="/factory"
            className="group bg-white rounded-xl shadow-soft-lg p-6 border-2 border-secondary-200 hover:border-secondary-400 hover:shadow-soft-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-secondary-600" />
              <h3 className="text-2xl font-bold text-secondary-700">⚙️ Focus Factory</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              AI-powered insights and analytics. See your productivity pipeline in action!
            </p>
            <span className="text-secondary-600 font-semibold group-hover:text-secondary-700">
              Explore Factory →
            </span>
          </Link>
        </div>

        {/* About Section */}
        <section className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl p-8 border-2 border-primary-200">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">About BloomFlow</h2>
          <div className="space-y-4 text-neutral-700">
            <p>
              BloomFlow is a medical-grade health tracking application designed to help you understand and improve your wellness journey. 
              We combine gamification with serious health tracking to make your journey engaging and effective.
            </p>
            <p>
              Our platform uses AI-powered insights to provide personalized recommendations while maintaining the highest standards of 
              data privacy and security. All sensitive health data is encrypted and stored locally on your device.
            </p>
            <p className="font-semibold text-primary-700">
              ⚠️ Important: BloomFlow is not a substitute for professional medical advice. Always consult your healthcare provider 
              for medical concerns.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
