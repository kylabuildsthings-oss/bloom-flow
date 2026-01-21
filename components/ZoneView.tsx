'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zone } from './IsometricNavigation';
import { CycleVisualization } from "@/components/CycleVisualization";
import { SymptomTracker } from "@/components/SymptomTracker";
import { BodyGarden } from "@/components/BodyGarden";
import { ProgressReport } from "@/components/ProgressReport";
import { ConsentFlow } from "@/components/ConsentFlow";
import { AuditTrail } from "@/components/AuditTrail";
import { CyclePrediction } from "@/components/CyclePrediction";
import { HealthCorrelations } from "@/components/HealthCorrelations";
import { WellnessRecommendations } from "@/components/WellnessRecommendations";
import { HealthMetricsTracker } from "@/components/HealthMetricsTracker";
import { OpikValidationDashboard } from "@/components/OpikValidationDashboard";
import { AIEvaluationDashboard } from "@/components/AIEvaluationDashboard";
import { ABTestingDashboard } from "@/components/ABTestingDashboard";
import { AIReasoningChain } from "@/components/AIReasoningChain";
import { SafetyComplianceDashboard } from "@/components/SafetyComplianceDashboard";
import { HealthImpactAnalysis } from "@/components/HealthImpactAnalysis";
import { FocusFactory } from "@/components/FocusFactory";

interface ZoneViewProps {
  zone: Zone;
}

export function ZoneView({ zone }: ZoneViewProps) {
  const zoneContent = {
    'body-garden': (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Body Garden</h2>
          <p className="text-neutral-600 mb-6">
            Grow your health with engaging, medically responsible game mechanics. 
            Your garden reflects your wellness journey - no guilt, just growth.
          </p>
          <BodyGarden />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CycleVisualization />
          <SymptomTracker />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CyclePrediction />
          <HealthCorrelations />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthMetricsTracker />
          <OpikValidationDashboard />
        </div>
      </div>
    ),
    'coin-cottage': (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-accent-700 mb-4">Coin Cottage</h2>
          <p className="text-neutral-600 mb-6">
            Track your wellness achievements and earn rewards for your health journey.
            Every milestone matters, every coin counts.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProgressReport />
          <ConsentFlow />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WellnessRecommendations />
          <HealthImpactAnalysis />
        </div>
        <AuditTrail />
      </div>
    ),
    'focus-factory': (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary-700 mb-4">Focus Factory</h2>
          <p className="text-neutral-600 mb-6">
            AI-powered insights and analytics. Understand your health patterns,
            optimize your wellness journey with data-driven recommendations.
          </p>
        </div>

        {/* Main Factory Visualization */}
        <FocusFactory />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Opik AI Value Demonstration</h2>
          <p className="text-neutral-600 mb-6">
            Real-time monitoring, A/B testing, reasoning transparency, safety compliance, and health impact analysis
            powered by Opik's comprehensive tracing and analytics.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AIEvaluationDashboard />
            <ABTestingDashboard />
          </div>

          <div className="mb-6">
            <AIReasoningChain />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SafetyComplianceDashboard />
            <HealthImpactAnalysis />
          </div>
        </div>
      </div>
    ),
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={zone}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {zoneContent[zone]}
      </motion.div>
    </AnimatePresence>
  );
}
