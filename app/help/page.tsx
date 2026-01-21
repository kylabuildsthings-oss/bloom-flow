'use client';

import { HelpCircle, Book, Mail, MessageCircle, FileText } from 'lucide-react';
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
                <h3 className="font-bold text-neutral-800 mb-2">How does the cycle prediction work?</h3>
                <p className="text-neutral-600">
                  Our AI analyzes your cycle history and health patterns to predict your next period and fertile windows. The more data you log, the more accurate predictions become.
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
            <div className="space-y-3">
              <Link href="/garden" className="block p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <h3 className="font-bold text-neutral-800 mb-1">Getting Started with Body Garden</h3>
                <p className="text-sm text-neutral-600">Learn how to track your health metrics and grow your garden</p>
              </Link>
              <Link href="/cottage" className="block p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <h3 className="font-bold text-neutral-800 mb-1">Understanding Coin Cottage</h3>
                <p className="text-sm text-neutral-600">Discover how to earn rewards and track your progress</p>
              </Link>
              <Link href="/factory" className="block p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <h3 className="font-bold text-neutral-800 mb-1">Using Focus Factory</h3>
                <p className="text-sm text-neutral-600">Explore AI-powered insights and productivity tracking</p>
              </Link>
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
