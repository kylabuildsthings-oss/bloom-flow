'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OnboardingGuide } from './OnboardingGuide';

interface OnboardingContextType {
  showOnboarding: () => void;
  hideOnboarding: () => void;
  restartOnboarding: () => void;
  isOnboardingComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showGuide, setShowGuide] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompleted = localStorage.getItem('bloomflow_onboarding_complete');
    if (!hasCompleted) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('bloomflow_onboarding_complete', 'true');
    setIsComplete(true);
    setShowGuide(false);
  };

  const handleSkip = () => {
    localStorage.setItem('bloomflow_onboarding_complete', 'true');
    setIsComplete(true);
    setShowGuide(false);
  };

  const showOnboarding = () => {
    setShowGuide(true);
  };

  const hideOnboarding = () => {
    setShowGuide(false);
  };

  const restartOnboarding = () => {
    localStorage.removeItem('bloomflow_onboarding_complete');
    setIsComplete(false);
    setShowGuide(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        showOnboarding,
        hideOnboarding,
        restartOnboarding,
        isOnboardingComplete: isComplete,
      }}
    >
      {children}
      {showGuide && (
        <OnboardingGuide onComplete={handleComplete} onSkip={handleSkip} />
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
