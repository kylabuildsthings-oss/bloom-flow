'use client';

import { useState } from 'react';
import { Settings, User, Shield, Bell, Database, Eye, EyeOff, Lock, Info } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showExportInfo, setShowExportInfo] = useState(false);

  const handleAdminClick = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 5) {
      setShowAdminLink(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">👤</span>
            <h1 className="text-4xl font-bold text-primary-700">My Bloom</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            Manage your profile, settings, data consent, and app configuration.
          </p>
        </header>

        <div className="space-y-6">
          {/* User Profile Section */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="User"
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Data Consent Management */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Data Consent</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-800">Health Data Collection</p>
                  <p className="text-sm text-neutral-600">Allow collection of health metrics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-800">Analytics & Insights</p>
                  <p className="text-sm text-neutral-600">Share anonymized data for insights</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-800">Medical Disclaimer</p>
                  <p className="text-sm text-neutral-600">I understand this is not medical advice</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-800">Daily Reminders</p>
                  <p className="text-sm text-neutral-600">Get reminders to log your health metrics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-800">Workout Predictions</p>
                  <p className="text-sm text-neutral-600">Notifications about workout predictions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* App Configuration */}
          <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-700">App Configuration</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="font-semibold text-neutral-800 mb-2">Theme</p>
                <select className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="font-semibold text-neutral-800 mb-2">Language</p>
                <select className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-neutral-800">Data Export</p>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="Why export data?"
                      onClick={() => setShowExportInfo((v) => !v)}
                      onBlur={() => setShowExportInfo(false)}
                      className="p-1 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                      title="Export your data to see how your health affects your motivation and to build better workout plans."
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {showExportInfo && (
                      <div
                        className="absolute left-0 top-full mt-1 z-10 w-64 p-3 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-lg"
                        role="tooltip"
                      >
                        Export your data for a clearer view of how your health affects your motivation to work out, and to build better workout plans.
                      </div>
                    )}
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Export My Data
                </button>
              </div>
            </div>
          </section>

          {/* Hidden Admin Link */}
          {showAdminLink && (
            <section className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-primary-700">App Analytics</h2>
              </div>
              <Link
                href="/admin/insights"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
                View App Analytics
              </Link>
            </section>
          )}

          {/* Hidden trigger for admin link - click the lock icon 5 times */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg text-center">
            <button
              onClick={handleAdminClick}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Admin access"
            >
              <Lock className="w-4 h-4" />
            </button>
            {adminClickCount > 0 && adminClickCount < 5 && (
              <p className="text-xs text-neutral-500 mt-2">
                {5 - adminClickCount} more clicks...
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
