import { CycleVisualization } from "@/components/CycleVisualization";
import { SymptomTracker } from "@/components/SymptomTracker";
import { ProgressReport } from "@/components/ProgressReport";
import { ConsentFlow } from "@/components/ConsentFlow";
import { AuditTrail } from "@/components/AuditTrail";
import { CyclePrediction } from "@/components/CyclePrediction";
import { HealthCorrelations } from "@/components/HealthCorrelations";
import { WellnessRecommendations } from "@/components/WellnessRecommendations";
import { HealthMetricsTracker } from "@/components/HealthMetricsTracker";
import { OpikValidationDashboard } from "@/components/OpikValidationDashboard";
import { BodyGarden } from "@/components/BodyGarden";
import { AIEvaluationDashboard } from "@/components/AIEvaluationDashboard";
import { ABTestingDashboard } from "@/components/ABTestingDashboard";
import { AIReasoningChain } from "@/components/AIReasoningChain";
import { SafetyComplianceDashboard } from "@/components/SafetyComplianceDashboard";
import { HealthImpactAnalysis } from "@/components/HealthImpactAnalysis";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">
            BloomFlow
          </h1>
          <p className="text-neutral-600">
            Your trusted health journey companion
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CycleVisualization />
          <SymptomTracker />
        </div>

        {/* Medical-Grade Cycle Engine Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Medical-Grade Cycle Engine</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CyclePrediction />
            <HealthCorrelations />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthMetricsTracker />
            <OpikValidationDashboard />
          </div>
        </div>

        {/* Body Garden - Health Gamification */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Body Garden</h2>
          <p className="text-neutral-600 mb-6">
            Grow your health with engaging, medically responsible game mechanics. 
            Your garden reflects your wellness journey - no guilt, just growth.
          </p>
          <BodyGarden />
        </div>

        {/* Wellness Recommendations */}
        <div className="mb-8">
          <WellnessRecommendations />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProgressReport />
          <ConsentFlow />
        </div>

        {/* Opik AI Value Demonstration */}
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

        <AuditTrail />
      </div>
    </main>
  );
}
