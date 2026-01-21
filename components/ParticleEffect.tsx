'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'star' | 'leaf';
}

interface ParticleEffectProps {
  trigger: boolean;
  type?: 'star' | 'leaf';
  x?: number; // percentage
  y?: number; // percentage
  onComplete?: () => void;
}

export function ParticleEffect({ trigger, type = 'star', x = 50, y = 50, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 3,
        life: 1,
        type: type,
      }));
      
      setParticles(newParticles);

      // Animate particles
      const interval = setInterval(() => {
        setParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.vx * 0.5,
            y: p.y + p.vy * 0.5,
            vy: p.vy + 0.2, // gravity
            life: p.life - 0.02,
          })).filter(p => p.life > 0)
        );
      }, 16);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setParticles([]);
        onComplete?.();
      }, 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [trigger, x, y, type, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.life,
            transform: `translate(-50%, -50%) rotate(${particle.life * 360}deg) scale(${particle.life})`,
            transition: 'none',
          }}
        >
          {particle.type === 'star' ? (
            <span className="text-2xl">⭐</span>
          ) : (
            <span className="text-2xl">🍃</span>
          )}
        </div>
      ))}
    </div>
  );
}
