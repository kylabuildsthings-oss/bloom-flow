'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Scroll, Shield } from 'lucide-react';
import { useOpik } from '@/lib/opik';
import { useMedicalDisclaimer } from '@/components/MedicalDisclaimer';

const BANNER_DISMISSED_KEY = 'bloomflow_disclaimer_banner_dismissed';

interface StyledMedicalDisclaimerProps {
  isVisible: boolean;
  onAcknowledge: () => void;
  redFlags?: Array<{
    symptom: string;
    description: string;
    severity: string;
    recommendedAction: string;
  }>;
  emergencyResources?: {
    title: string;
    resources: Array<{
      name: string;
      contact: string;
      description: string;
    }>;
  };
}

export function StyledMedicalDisclaimer({
  isVisible,
  onAcknowledge,
  redFlags = [],
  emergencyResources,
}: StyledMedicalDisclaimerProps) {
  const opik = useOpik();
  const { showDisclaimer } = useMedicalDisclaimer();
  // When modal is closed (isVisible false), show the banner so "Not medical advice" is visible
  const [bannerDismissed, setBannerDismissed] = useState(() => isVisible);

  // When modal closes, show the banner again so a disclaimer is always visible
  useEffect(() => {
    if (!isVisible) {
      setBannerDismissed(false);
    }
  }, [isVisible]);

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  return (
    <>
      {/* Stone Tablet Style Disclaimer Modal */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                // Don't allow closing by clicking backdrop - must acknowledge
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotateX: -15 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, rotateX: -15 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative max-w-3xl w-full"
              style={{ perspective: '1000px' }}
            >
              {/* Stone Tablet Container */}
              <div className="relative bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 rounded-2xl shadow-2xl border-4 border-stone-400 overflow-hidden">
                {/* Stone Texture Overlay */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px),
                      repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)
                    `,
                  }}
                />

                {/* Decorative Top Border */}
                <div className="relative bg-gradient-to-b from-stone-400 to-stone-300 h-16 flex items-center justify-center border-b-4 border-stone-500">
                  <div className="flex items-center gap-3 text-stone-800">
                    <Shield className="w-8 h-8" />
                    <h2 className="text-2xl font-bold tracking-wide">
                      IMPORTANT MEDICAL DISCLAIMER
                    </h2>
                    <Shield className="w-8 h-8" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="relative p-8 space-y-6 text-stone-900">
                  {/* Main Warning */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg shadow-inner"
                  >
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-lg text-red-900 mb-2">
                          This application is NOT a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                        <p className="text-red-800 leading-relaxed">
                          Always seek the advice of your physician or other qualified health provider with any questions
                          you may have regarding a medical condition. Never disregard professional medical advice or delay
                          in seeking it because of something you have read or tracked in this application.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Emergency Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-amber-50 border-2 border-amber-400 p-6 rounded-lg"
                  >
                    <h3 className="font-bold text-lg text-amber-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" />
                      Emergency Situations
                    </h3>
                    <p className="text-amber-800 leading-relaxed">
                      If you are experiencing a medical emergency, call <strong>999</strong> or go to the nearest emergency room immediately.
                    </p>
                  </motion.div>

                  {/* Data Privacy Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-blue-50 border-2 border-blue-300 p-6 rounded-lg"
                  >
                    <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      Data Privacy & Security
                    </h3>
                    <p className="text-blue-800 leading-relaxed">
                      Your health data is stored locally on your device with <strong>encryption</strong>. We prioritize your privacy
                      and comply with health data protection standards. No sensitive data is exposed in the user interface.
                    </p>
                  </motion.div>

                  {/* Acknowledge Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center pt-4"
                  >
                    <motion.button
                      onClick={() => {
                        opik.logCompliance('disclaimer_acknowledged', { 
                          timestamp: new Date(),
                          method: 'stone_tablet_modal'
                        });
                        onAcknowledge();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-primary-700"
                    >
                      I Understand and Acknowledge
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Scroll Banner at Bottom - dismissible */}
      <AnimatePresence>
        {!bannerDismissed && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[9998] pointer-events-none"
          >
            <div className="container mx-auto px-4 pb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 border-2 border-stone-400 rounded-t-2xl shadow-2xl p-4 pointer-events-auto"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Scroll className="w-6 h-6 text-stone-700 shrink-0" />
                    <p className="text-sm font-semibold text-stone-800">
                      <strong className="text-red-600">Not medical advice.</strong> Consult your healthcare provider for medical concerns.{' '}
                      <button
                        type="button"
                        onClick={showDisclaimer}
                        className="underline text-primary-600 hover:text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                      >
                        View full disclaimer
                      </button>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={dismissBanner}
                    aria-label="Dismiss disclaimer banner"
                    className="shrink-0 p-1.5 rounded-lg text-stone-600 hover:bg-stone-300/50 hover:text-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Red Flag Alert - Stone Tablet Style */}
      <AnimatePresence>
        {redFlags.length > 0 && emergencyResources && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-4 left-4 right-4 z-[250] max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-red-100 via-red-50 to-red-200 border-4 border-red-600 rounded-2xl shadow-2xl p-6">
              {/* Stone texture overlay */}
              <div 
                className="absolute inset-0 opacity-20 rounded-2xl"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
                  `,
                }}
              />
              
              <div className="relative">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-red-700 w-10 h-10 flex-shrink-0 mt-1 animate-pulse" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-red-900 mb-3">
                      ⚠️ Red Flag Symptoms Detected
                    </h3>
                    <div className="space-y-3 mb-4">
                      {redFlags.map((flag, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white rounded-lg p-4 border-2 border-red-300 shadow-md"
                        >
                          <p className="font-bold text-red-800 text-lg">{flag.symptom}</p>
                          <p className="text-sm text-red-700 mt-1">{flag.description}</p>
                          <p className="text-sm font-semibold text-red-600 mt-2">
                            Recommended: {
                              flag.recommendedAction === 'emergency' ? '🚨 Seek Emergency Care' :
                              flag.recommendedAction === 'urgent' ? '⚠️ Urgent Care Recommended' :
                              flag.recommendedAction === 'consult' ? '👨‍⚕️ Consult Healthcare Provider' : '📊 Monitor'
                            }
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4 border-2 border-red-300">
                      <h4 className="font-bold text-red-900 mb-3 text-lg">{emergencyResources.title}</h4>
                      <div className="space-y-2">
                        {emergencyResources.resources.map((resource, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-red-50 rounded">
                            <div className="text-2xl">📞</div>
                            <div>
                              <p className="font-semibold text-red-800">{resource.name}</p>
                              <p className="text-sm text-red-700">{resource.contact}</p>
                              <p className="text-xs text-red-600">{resource.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      onClick={() => {
                        // This will be handled by parent
                        window.location.reload();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
                    >
                      Acknowledge
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
