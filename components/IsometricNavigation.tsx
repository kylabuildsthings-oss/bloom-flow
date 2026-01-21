'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sprout, Coins, Target } from 'lucide-react';

export type Zone = 'body-garden' | 'coin-cottage' | 'focus-factory';

interface NavigationItem {
  id: Zone;
  label: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'body-garden',
    label: 'Body Garden',
    icon: <Sprout className="w-8 h-8" />,
    color: 'text-primary-600',
    glowColor: 'rgba(58, 155, 95, 0.4)',
  },
  {
    id: 'coin-cottage',
    label: 'Coin Cottage',
    icon: <Coins className="w-8 h-8" />,
    color: 'text-accent-600',
    glowColor: 'rgba(255, 167, 38, 0.4)',
  },
  {
    id: 'focus-factory',
    label: 'Focus Factory',
    icon: <Target className="w-8 h-8" />,
    color: 'text-secondary-600',
    glowColor: 'rgba(64, 133, 165, 0.4)',
  },
];

interface IsometricNavigationProps {
  activeZone: Zone;
  onZoneChange: (zone: Zone) => void;
}

export function IsometricNavigation({ activeZone, onZoneChange }: IsometricNavigationProps) {
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Isometric plane container */}
      <div
        className="relative"
        style={{
          transform: 'perspective(1200px) rotateX(20deg) rotateY(-8deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="flex items-center gap-6 px-6 py-4 bg-white/95 backdrop-blur-md rounded-lg border-2 border-primary-200 shadow-soft-lg"
          style={{
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {navigationItems.map((item) => {
            const isActive = activeZone === item.id;
            const isHovered = hoveredZone === item.id;

            return (
              <motion.button
                key={item.id}
                data-zone={item.id}
                onClick={() => onZoneChange(item.id)}
                onMouseEnter={() => setHoveredZone(item.id)}
                onMouseLeave={() => setHoveredZone(null)}
                className="relative flex flex-col items-center gap-2 p-4 transition-all cursor-pointer"
                animate={{
                  y: isHovered || isActive ? -12 : 0,
                  scale: isHovered || isActive ? 1.15 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  filter: isHovered || isActive 
                    ? `drop-shadow(0 12px 24px ${item.glowColor}) brightness(1.1)` 
                    : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                }}
              >
                {/* Glow effect */}
                <AnimatePresence>
                  {(isHovered || isActive) && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{
                        background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)`,
                        filter: 'blur(12px)',
                        zIndex: -1,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon container with isometric lift */}
                <motion.div
                  className={`${item.color} relative z-10`}
                  animate={{
                    rotateY: isHovered ? 8 : 0,
                    rotateX: isHovered ? -8 : 0,
                    scale: isHovered ? 1.2 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {item.icon}
                </motion.div>

                {/* Label */}
                <motion.span
                  className={`text-xs font-semibold ${
                    isActive ? 'text-primary-700' : 'text-neutral-600'
                  } relative z-10`}
                  animate={{
                    scale: isHovered || isActive ? 1.05 : 1,
                  }}
                >
                  {item.label}
                </motion.span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-8 h-1 bg-primary-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
