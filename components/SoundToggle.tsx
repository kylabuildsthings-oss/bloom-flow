'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { initSoundSystem, setSoundEnabled, isSoundEnabled } from '@/lib/sound-effects';

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Initialize on user interaction (browser autoplay policy)
    const initOnInteraction = () => {
      initSoundSystem();
      setEnabled(isSoundEnabled());
    };
    
    // Try to initialize immediately
    initOnInteraction();
    
    // Also initialize on first user interaction
    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('touchstart', initOnInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('touchstart', initOnInteraction);
    };
  }, []);

  const toggleSound = () => {
    const newState = !enabled;
    setEnabled(newState);
    setSoundEnabled(newState);
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-soft-lg border-2 border-primary-200 hover:scale-110 transition-transform z-50"
      title={enabled ? 'Disable sound effects' : 'Enable sound effects'}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5 text-primary-600" />
      ) : (
        <VolumeX className="w-5 h-5 text-neutral-400" />
      )}
    </button>
  );
}
