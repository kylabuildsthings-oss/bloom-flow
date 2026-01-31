'use client';

import { Info, Moon, Utensils, Activity, Heart, Brain, Target, Cpu, Zap, Shield, Calendar } from 'lucide-react';
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
          {/* The cycle as your central operating system */}
          <section className="bg-white rounded-xl shadow-soft-xl p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-7 h-7 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">
                The cycle as your central operating system
              </h2>
            </div>
            <p className="text-neutral-700 mb-4 leading-relaxed">
              BloomFlow is your <strong className="text-primary-700">cycle-aware fitness coach</strong>. It turns your menstrual cycle from a workout hurdle into a personalized training advantage, using Opik&apos;s AI and gamification to keep you motivated and consistent all year long—so you can meet your fitness goals.
            </p>
            <p className="text-neutral-700 mb-6 leading-relaxed">
              While other apps have started to acknowledge the menstrual cycle, they treat it as a standalone silo—a tab for &quot;cycle insights.&quot; BloomFlow&apos;s breakthrough is different: we treat the cycle as the <strong className="text-primary-700">central operating system for your entire life</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-50 border border-primary-200">
                <Zap className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary-800 mb-1">Cycle → workout impact</p>
                  <p className="text-sm text-neutral-700">
                    We track how your menstrual cycle impacts your workouts—energy, recovery, and performance across your phases—so you can train at the right times and intensity for your body.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary-50 border border-secondary-200">
                <Shield className="w-6 h-6 text-secondary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-secondary-800 mb-1">Enterprise-grade observability</p>
                  <p className="text-sm text-neutral-700">
                    Opik powers continuous refinement of our model—so recommendations get smarter and more evidence-based over time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-50 border border-primary-200">
                <Cpu className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary-800 mb-1">Closed-loop, adaptive system</p>
                  <p className="text-sm text-neutral-700">
                    We&apos;re building the closed-loop, evidence-based adaptive system that current apps are still working toward.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-600 text-sm italic">
              One system. Your cycle at the center. We track how it impacts your workouts so you can train smarter and stay consistent.
            </p>
          </section>

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

          {/* Cycle Phases */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Understanding Your Cycle Phases</h2>
            </div>
            <p className="text-neutral-700 mb-6">
              Your menstrual cycle has four main phases. BloomFlow uses these to personalize your garden and fitness insights. Here&apos;s what each phase typically means:
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <h3 className="font-bold text-red-800 mb-2">Menstrual phase</h3>
                <p className="text-sm text-neutral-700 mb-1">
                  <strong>Typical length:</strong> About 3–7 days (day 1 of your period is day 1 of your cycle).
                </p>
                <p className="text-sm text-neutral-700">
                  Your body is shedding the uterine lining. Energy and strength can be lower—this is normal and healthy. In BloomFlow, this shows as &quot;resting soil&quot;: a time for gentler movement, rest, and recovery. Your garden still grows; we just honor that your body may need more care.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">Follicular phase</h3>
                <p className="text-sm text-neutral-700 mb-1">
                  <strong>Typical length:</strong> About 10–16 days (from after your period until ovulation).
                </p>
                <p className="text-sm text-neutral-700">
                  Estrogen rises and follicles develop. Many people feel more energetic and ready for stronger workouts. In BloomFlow, this is &quot;fertile soil&quot;—a great time to build habits and push a bit more in the garden and in your training.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <h3 className="font-bold text-emerald-800 mb-2">Ovulation</h3>
                <p className="text-sm text-neutral-700 mb-1">
                  <strong>Typical length:</strong> About 1–3 days (around mid-cycle).
                </p>
                <p className="text-sm text-neutral-700">
                  The egg is released; estrogen peaks. Energy and performance are often at their highest. In BloomFlow, this is &quot;peak fertile soil&quot;—the best time for high-intensity or goal-focused workouts and maximum growth in your garden.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2">Luteal phase</h3>
                <p className="text-sm text-neutral-700 mb-1">
                  <strong>Typical length:</strong> About 10–16 days (from after ovulation until your next period).
                </p>
                <p className="text-sm text-neutral-700">
                  Progesterone rises; the body prepares for a possible pregnancy or the next period. Energy may dip in the second half (especially premenstrually). In BloomFlow, this is &quot;balanced soil&quot;—steady growth and sustainable effort, with room for rest as you approach your period.
                </p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm mt-4 italic">
              Cycle lengths and phase lengths vary from person to person. BloomFlow adapts to your data so you see the phases that fit your body.
            </p>
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
