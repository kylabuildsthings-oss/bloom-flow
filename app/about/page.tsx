'use client';

import { Info, Moon, Utensils, Activity, Heart, Brain, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌻</span>
            <h1 className="text-4xl font-bold text-primary-700">About BloomFlow</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            Your wellness companion for understanding your body and staying on track with your goals.
          </p>
        </header>

        <div className="space-y-8">
          {/* What We Track */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">What BloomFlow Tracks</h2>
            </div>
            <p className="text-neutral-700 mb-6">
              BloomFlow is a medical-grade health tracking application designed to help you understand and improve your wellness journey. We focus on the data that matters most for women&apos;s health and fitness:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                <Heart className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary-700">Menstrual cycle</strong> — Track your cycle phases so you can align workouts, nutrition, and rest with your body&apos;s natural rhythms.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                <Moon className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary-700">Sleep</strong> — Log sleep quality and duration to see how rest affects your energy and recovery.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                <Utensils className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary-700">Nutrition</strong> — Monitor what you eat and how it supports your energy levels and goals.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                <Activity className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary-700">Movement</strong> — Track exercise and daily activity to understand when you perform best.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                <Brain className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary-700">Stress levels</strong> — Record stress and mood so you can balance intensity and recovery.
                </div>
              </li>
            </ul>
          </section>

          {/* Best Times to Work Out */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-secondary-200">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-secondary-600" />
              <h2 className="text-2xl font-bold text-secondary-700">When to Work Out</h2>
            </div>
            <p className="text-neutral-700">
              By combining menstrual cycle, sleep, nutrition, movement, and stress data, BloomFlow helps you see <strong>when the best times to work out</strong> are for your body. You&apos;ll get personalized insights so you can train when you have the most energy and recover when you need it—making your fitness routine more effective and sustainable.
            </p>
          </section>

          {/* New Year&apos;s Resolutions */}
          <section className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Commit to Your New Year&apos;s Resolutions</h2>
            </div>
            <p className="text-neutral-700">
              New Year&apos;s resolutions are easy to set and hard to keep. BloomFlow is built to help you <strong>actually stick to them</strong>. When you understand how your cycle, sleep, nutrition, movement, and stress interact, you can plan workouts and habits around your body—not against it. That means fewer missed days, less burnout, and real progress toward the goals you set in January.
            </p>
          </section>

          {/* Platform & Privacy */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <h2 className="text-2xl font-bold text-primary-700 mb-4">Our Platform</h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                We combine gamification with serious health tracking to make your journey engaging and effective. Our platform uses AI-powered insights to provide personalized recommendations while maintaining the highest standards of data privacy and security. All sensitive health data is encrypted and stored locally on your device.
              </p>
              <p className="font-semibold text-primary-700">
                ⚠️ Important: BloomFlow is not a substitute for professional medical advice. Always consult your healthcare provider for medical concerns.
              </p>
            </div>
          </section>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-soft-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
