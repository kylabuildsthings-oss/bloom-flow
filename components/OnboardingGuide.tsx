'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Zone } from './IsometricNavigation';

interface OnboardingStep {
  zone: Zone;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    zone: 'body-garden',
    title: 'Body Garden 🌱',
    description: 'Track your health metrics and watch your garden grow! Each plant represents a different aspect of your wellness journey. Log activities to help your plants thrive!',
    icon: '🌱',
  },
  {
    zone: 'coin-cottage',
    title: 'Coin Cottage 🪙',
    description: 'Earn rewards and track your progress. Every healthy choice you make adds to your collection! View your achievements and wellness reports here.',
    icon: '🪙',
  },
  {
    zone: 'focus-factory',
    title: 'Focus Factory 🎯',
    description: 'AI-powered insights and analytics. See your productivity pipeline in action with our factory visualization! Get data-driven recommendations here.',
    icon: '🎯',
  },
];

// Cute robot guide SVG
function RobotGuide({ isBouncing }: { isBouncing: boolean }) {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="drop-shadow-lg"
      animate={isBouncing ? {
        y: [0, -10, 0],
      } : {}}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    >
      {/* Robot body */}
      <rect x="30" y="40" width="60" height="70" rx="8" fill="#708090" stroke="#5A6A7A" strokeWidth="2" />
      
      {/* Robot head */}
      <rect x="40" y="20" width="40" height="30" rx="6" fill="#B87333" stroke="#A06323" strokeWidth="2" />
      
      {/* Eyes */}
      <circle cx="50" cy="32" r="4" fill="#FFD700">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="32" r="4" fill="#FFD700">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      
      {/* Antenna */}
      <circle cx="60" cy="15" r="3" fill="#FFD700" />
      <line x1="60" y1="20" x2="60" y2="15" stroke="#FFD700" strokeWidth="2" />
      
      {/* Mouth */}
      <rect x="52" y="38" width="16" height="4" rx="2" fill="#5A6A7A" />
      
      {/* Chest panel */}
      <rect x="42" y="50" width="36" height="20" rx="4" fill="#8B9DC3" stroke="#708090" strokeWidth="1.5" />
      <circle cx="50" cy="60" r="2" fill="#FFD700" />
      <circle cx="60" cy="60" r="2" fill="#FFD700" />
      <circle cx="70" cy="60" r="2" fill="#FFD700" />
      
      {/* Arms */}
      <rect x="20" y="50" width="12" height="30" rx="6" fill="#708090" stroke="#5A6A7A" strokeWidth="2" />
      <rect x="88" y="50" width="12" height="30" rx="6" fill="#708090" stroke="#5A6A7A" strokeWidth="2" />
      
      {/* Hands */}
      <circle cx="26" cy="85" r="5" fill="#B87333" />
      <circle cx="94" cy="85" r="5" fill="#B87333" />
      
      {/* Legs */}
      <rect x="38" y="110" width="12" height="10" rx="4" fill="#708090" stroke="#5A6A7A" strokeWidth="2" />
      <rect x="70" y="110" width="12" height="10" rx="4" fill="#708090" stroke="#5A6A7A" strokeWidth="2" />
    </motion.svg>
  );
}

interface OnboardingGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingGuide({ onComplete, onSkip }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [highlightedZone, setHighlightedZone] = useState<Zone | null>(null);
  // Get navigation button position for pointing - moved before early return
  const [pointingPosition, setPointingPosition] = useState<{ x: number; y: number } | null>(null);

  const currentStepData = onboardingSteps[currentStep];

  useEffect(() => {
    if (currentStepData) {
      setHighlightedZone(currentStepData.zone);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isVisible) return; // Early return inside effect is fine
    
    const updatePointingPosition = () => {
      const element = document.querySelector(`[data-zone="${currentStepData.zone}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPointingPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      } else {
        setPointingPosition(null);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updatePointingPosition, 100);
    window.addEventListener('resize', updatePointingPosition);
    window.addEventListener('scroll', updatePointingPosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePointingPosition);
      window.removeEventListener('scroll', updatePointingPosition);
    };
  }, [currentStep, currentStepData.zone, isVisible]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={(e) => {
          // Close on backdrop click
          if (e.target === e.currentTarget) {
            handleSkip();
          }
        }}
      >
        {/* Pointing Arrow */}
        {pointingPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed pointer-events-none z-[101]"
            style={{
              left: `${pointingPosition.x}px`,
              top: `${pointingPosition.y - 80}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-4xl"
            >
              👆
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-xl shadow-soft-xl p-6 max-w-md w-full border-2 border-primary-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:scale-110 transition-all rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Robot Guide */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center mb-6"
          >
            <RobotGuide isBouncing={true} />
            
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="relative mt-4 bg-primary-50 border-2 border-primary-300 rounded-lg p-4 max-w-sm shadow-soft"
            >
              {/* Speech bubble tail */}
              <div className="absolute -top-3 left-20 w-6 h-6 bg-primary-50 border-l-2 border-t-2 border-primary-300 transform rotate-45" />
              
              <div className="relative z-10">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-bold text-primary-700 mb-2 text-lg"
                >
                  {currentStepData.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-primary-800"
                >
                  {currentStepData.description}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Zone Icon Highlight - shows the icon from navigation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl"
            >
              {currentStepData.icon}
            </motion.div>
          </motion.div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary-600'
                    : index < currentStep
                    ? 'w-2 bg-primary-300'
                    : 'w-2 bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-4 py-2 border-2 border-neutral-300 rounded-lg font-semibold text-neutral-700 hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-soft flex items-center justify-center gap-2"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < onboardingSteps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Zone Highlight Overlay */}
        {highlightedZone && (
          <ZoneHighlight zone={highlightedZone} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ZoneHighlight({ zone }: { zone: Zone }) {
  useEffect(() => {
    const element = document.querySelector(`[data-zone="${zone}"]`);
    if (element) {
      // Scroll to element if needed
      const navElement = element.closest('nav');
      if (navElement) {
        navElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Add highlight class
      element.classList.add('onboarding-highlight');
      
      return () => {
        element.classList.remove('onboarding-highlight');
      };
    }
  }, [zone]);

  return null;
}
