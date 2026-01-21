import { UserJourneyTimeline } from "@/components/UserJourneyTimeline";
import { OpikInsightsOverlay } from "@/components/OpikInsightsOverlay";
import { BeforeAfterMetrics } from "@/components/BeforeAfterMetrics";
import { SafetyEthicsShowcase } from "@/components/SafetyEthicsShowcase";
import { TechnicalExcellence } from "@/components/TechnicalExcellence";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-primary-700 mb-3">
            BloomFlow Demo
          </h1>
          <p className="text-xl text-neutral-600 mb-2">
            Medical-Grade Health Tracking with Opik AI Analytics
          </p>
          <p className="text-sm text-neutral-500">
            A comprehensive 90-day transformation journey backed by data-driven insights
          </p>
        </header>

        {/* Demo Overview */}
        <div className="mb-8 p-6 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl border-2 border-primary-300">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Demo Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-primary-700">User Profile:</strong>
              <p className="text-neutral-700">32-year-old with irregular cycles, chronic fatigue, and failed health goals</p>
            </div>
            <div>
              <strong className="text-primary-700">Intervention Period:</strong>
              <p className="text-neutral-700">90-day BloomFlow AI-powered health tracking</p>
            </div>
            <div>
              <strong className="text-primary-700">Data Source:</strong>
              <p className="text-neutral-700">Realistic but anonymized health metrics with Opik validation</p>
            </div>
            <div>
              <strong className="text-primary-700">Outcome:</strong>
              <p className="text-neutral-700">Measurable improvements across all health metrics</p>
            </div>
          </div>
        </div>

        {/* Section 1: User Journey Timeline */}
        <div className="mb-8">
          <UserJourneyTimeline />
        </div>

        {/* Section 2: Opik Insights Overlay */}
        <div className="mb-8">
          <OpikInsightsOverlay />
        </div>

        {/* Section 3: Before/After Metrics */}
        <div className="mb-8">
          <BeforeAfterMetrics />
        </div>

        {/* Section 4: Safety & Ethics */}
        <div className="mb-8">
          <SafetyEthicsShowcase />
        </div>

        {/* Section 5: Technical Excellence */}
        <div className="mb-8">
          <TechnicalExcellence />
        </div>

        {/* Summary Footer */}
        <div className="mt-12 p-6 bg-primary-50 rounded-xl border border-primary-200">
          <h3 className="text-2xl font-bold text-primary-700 mb-4 text-center">
            Key Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-700">36.5%</div>
              <div className="text-sm text-neutral-600">Sleep Improvement</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-700">75%</div>
              <div className="text-sm text-neutral-600">Energy Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-700">61.4%</div>
              <div className="text-sm text-neutral-600">Symptom Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-700">20%</div>
              <div className="text-sm text-neutral-600">Cycle Regularity</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              All metrics statistically significant (p &lt; 0.05) and validated through Opik medical-grade tracking
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
