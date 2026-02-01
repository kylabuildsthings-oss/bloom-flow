'use client';

import { HelpCircle, Book, Mail, MessageCircle, FileText, FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">❓</span>
            <h1 className="text-4xl font-bold text-primary-700">Help & Support</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            Find answers to common questions and learn how to use BloomFlow.
          </p>
        </header>

        <div className="space-y-6">
          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="font-bold text-neutral-800 mb-2">How do I track my health metrics?</h3>
                <p className="text-neutral-600">
                  Navigate to the Garden tab and use the Health Metrics Tracker to log your daily sleep, energy, mood, and stress levels. Your garden will grow as you track!
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="font-bold text-neutral-800 mb-2">Is my data secure?</h3>
                <p className="text-neutral-600">
                  Yes! All sensitive health data is encrypted and stored locally on your device. We use medical-grade security practices and never expose your data in the user interface.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="font-bold text-neutral-800 mb-2">How does workout prediction work?</h3>
                <p className="text-neutral-600">
                  BloomFlow uses your cycle phase together with your sleep, nutrition, movement, and stress levels to suggest when you’re likely to have the most energy and recover best—so you can plan workouts at the most optimal times for your body.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="font-bold text-neutral-800 mb-2">Can I export my data?</h3>
                <p className="text-neutral-600">
                  Yes! Go to My Bloom → App Configuration → Data Export to download all your health data in a secure format.
                </p>
              </div>
            </div>
          </section>

          {/* How-To Guides */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">How-To Guides</h2>
            </div>
            <p className="text-neutral-600 mb-5">
              BloomFlow uses your cycle phase alongside sleep, nutrition, movement, and stress to help you plan the best times for workouts—and rewards you for logging this data. The app is built around three main tabs. Here’s what each one does and how to get the most out of your experience.
            </p>
            <div className="space-y-5">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-2">Body Garden</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  <strong>What it is:</strong> Your daily logging hub. Here you log sleep, nutrition, movement, stress, and energy so BloomFlow can use this data—together with your cycle phase—to suggest the best times for workouts. Logging here also earns you rewards in the app.
                </p>
                <p className="text-neutral-600 text-sm mb-2">
                  <strong>What you’ll find:</strong> A calendar with cycle-phase colors, daily check-ins (tap a date to answer the day’s questions), your garden level and habit streak, and optional Streak Protection (Greenhouse Mode) to protect your streak on low-energy days.
                </p>
                <p className="text-neutral-600 text-sm mb-3">
                  <strong>Tip:</strong> Log sleep, nutrition, movement, and stress regularly so the app can plan workouts around your best times and you keep earning rewards.
                </p>
                <Link href="/garden" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Open Body Garden →
                </Link>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-2">Coin Cottage</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  <strong>What it is:</strong> Your rewards and planning center. BloomFlow rewards you with coins for logging sleep, nutrition, movement, stress, and cycle data in the Body Garden—you’ll see your balance here. You can also add accountability buddies and browse workout plans that use your cycle phase plus that logged data to suggest the best times and types of workouts.
                </p>
                <p className="text-neutral-600 text-sm mb-2">
                  <strong>What you’ll find:</strong> Your coin balance and how the point system works (earned by logging data), a buddy list for accountability, and general plus tailored workout plans based on your cycle and logged health data.
                </p>
                <p className="text-neutral-600 text-sm mb-3">
                  <strong>Tip:</strong> The more you log in Body Garden, the more coins you earn and the better your tailored plans. Use plans that match your suggested best times; spend coins in Focus Factory for fun, focused sessions.
                </p>
                <Link href="/cottage" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Open Coin Cottage →
                </Link>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-2">Focus Factory</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  <strong>What it is:</strong> Timed focus games to use during your workouts. The Focus Factory offers timed games you can unlock or enhance with coins—the same coins you earn by logging sleep, nutrition, movement, stress, and cycle data in the app. Play them while you work out to help you stay focused on your workout goals.
                </p>
                <p className="text-neutral-600 text-sm mb-2">
                  <strong>What you’ll find:</strong> Timed games designed to be played during workouts, helping you concentrate on your session and hit your goals. Spend the coins you’ve earned from logging your data in Body Garden to unlock and get the most out of the experience.
                </p>
                <p className="text-neutral-600 text-sm mb-3">
                  <strong>Tip:</strong> Use focus games during your best workout times (based on your logged data and cycle). Try longer timed games when your energy is high and shorter ones when you want a gentler, more focused session.
                </p>
                <Link href="/factory" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Open Focus Factory →
                </Link>
              </div>
            </div>
          </section>

          {/* A/B Testing Framework */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <FlaskConical className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">A/B Testing Framework</h2>
            </div>
            <p className="text-neutral-600 mb-4">
              BloomFlow uses an A/B testing framework powered by Opik to systematically test what works best for motivating workouts across different cycle phases. Our goal is to improve workout adherence and positive fitness outcomes by testing variables in the experience—so the app gets better for you over time.
            </p>
            <p className="text-neutral-600 text-sm mb-5">
              You may see different wording, rewards, or workout suggestions as we run these tests. All variants are designed to support your goals; we measure which ones lead to the best outcomes and use that to improve BloomFlow for everyone.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-2">Track 1: Motivational Messaging by Cycle Phase</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  We test whether phase-aligned messaging improves adherence. For example: energetic, “crush it” style messages during follicular/ovulation vs. nurturing, recovery-focused messages during luteal/menstrual. Success is measured by workout completion rate for the suggested activity.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-2">Track 2: Gamification Rewards</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  We test which reward type best sustains engagement: instant rewards (e.g. adding a piece to a machine), currency (e.g. energy orbs for games), or visual progress (e.g. garden growth). Success is measured by 7-day retention and weekly workout frequency.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-2">Track 3: Workout Recommendations</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  We test whether the AI should stick strictly to cycle-optimal workout types or blend cycle phase with your historically most-enjoyed activities. Success is measured by your rating of “How did this workout feel?” and next-day workout completion.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Contact Us</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="font-semibold text-neutral-800 mb-2">Email Support</p>
                <a href="mailto:support@bloomflow.app" className="text-primary-600 hover:text-primary-700">
                  support@bloomflow.app
                </a>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="font-semibold text-neutral-800 mb-2">Response Time</p>
                <p className="text-neutral-600">We typically respond within 24-48 hours</p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">About BloomFlow</h2>
            </div>
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
      </div>
    </main>
  );
}
