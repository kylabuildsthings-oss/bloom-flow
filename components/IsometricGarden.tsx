'use client';

import { useEffect, useState } from 'react';
import { Plant, GardenZone } from '@/lib/game-engine';

interface PlantVisual {
  stage: number; // 0-4 (seedling to blooming)
  emoji: string;
  size: number;
  color: string;
}

const PLANT_STAGES: Record<GardenZone, PlantVisual[]> = {
  sleep: [
    { stage: 0, emoji: '🪴', size: 3.5, color: '#8B7355' }, // Seedling
    { stage: 1, emoji: '🪴', size: 4.0, color: '#6B8E23' }, // Sprout
    { stage: 2, emoji: '🪴', size: 4.5, color: '#4169E1' }, // Growing
    { stage: 3, emoji: '🪴', size: 5.0, color: '#228B22' }, // Mature
    { stage: 4, emoji: '🪴', size: 5.5, color: '#FFD700' }, // Blooming
  ],
  nutrition: [
    { stage: 0, emoji: '🪴', size: 3.5, color: '#8B7355' },
    { stage: 1, emoji: '🪴', size: 4.0, color: '#9ACD32' },
    { stage: 2, emoji: '🪴', size: 4.5, color: '#FFD700' },
    { stage: 3, emoji: '🪴', size: 5.0, color: '#FF69B4' },
    { stage: 4, emoji: '🪴', size: 5.5, color: '#FFB6C1' },
  ],
  movement: [
    { stage: 0, emoji: '🪴', size: 3.5, color: '#8B7355' },
    { stage: 1, emoji: '🪴', size: 4.0, color: '#32CD32' },
    { stage: 2, emoji: '🪴', size: 4.5, color: '#228B22' },
    { stage: 3, emoji: '🪴', size: 5.0, color: '#006400' },
    { stage: 4, emoji: '🪴', size: 5.5, color: '#2E8B57' },
  ],
  stress: [
    { stage: 0, emoji: '🪴', size: 3.5, color: '#8B7355' },
    { stage: 1, emoji: '🪴', size: 4.0, color: '#90EE90' },
    { stage: 2, emoji: '🪴', size: 4.5, color: '#9ACD32' },
    { stage: 3, emoji: '🪴', size: 5.0, color: '#DA70D6' },
    { stage: 4, emoji: '🪴', size: 5.5, color: '#FFD700' },
  ],
};

function getPlantStage(plant: Plant): number {
  // Map level (0-10) to stage (0-4)
  if (plant.level === 0) return 0;
  if (plant.level <= 2) return 1;
  if (plant.level <= 5) return 2;
  if (plant.level <= 8) return 3;
  return 4;
}

interface IsometricPlantProps {
  plant: Plant;
  position: { x: number; y: number };
}

function IsometricPlant({ plant, position }: IsometricPlantProps) {
  const stage = getPlantStage(plant);
  const visual = PLANT_STAGES[plant.zone][stage];
  const animationDelay = Math.random() * 2;

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)', // Center the plant at the position
        animation: `plantBob ${2 + Math.random()}s ease-in-out infinite`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Plant emoji - no tilt, straight up */}
      <div
        className="relative z-10 text-center cursor-pointer transition-transform hover:scale-110 mb-2"
        style={{
          fontSize: `${visual.size * 3.5}rem`,
          filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.3)) drop-shadow(0 0 20px ${visual.color}40) brightness(1.15)`,
          lineHeight: 1,
          textShadow: `0 0 30px ${visual.color}60`,
        }}
      >
        {visual.emoji}
      </div>
      {/* Enhanced plant label - more visible, no tilt */}
      <div
        className="relative z-20 text-center"
        style={{
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: '#1F2937', // Dark gray for better visibility
          textShadow: '0 2px 4px rgba(255,255,255,0.95), 0 0 4px rgba(255,255,255,0.8)',
          whiteSpace: 'nowrap',
          background: `rgba(255,255,255,0.98)`,
          padding: '8px 14px',
          borderRadius: '12px',
          border: `2px solid ${visual.color}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.5)',
        }}
      >
        {plant.zone.charAt(0).toUpperCase() + plant.zone.slice(1)} Lv.{plant.level}
      </div>
    </div>
  );
}

interface PollenParticleProps {
  x: number;
  y: number;
  delay: number;
}

function PollenParticle({ x, y, delay }: PollenParticleProps) {
  const duration = 3 + Math.random() * 2;
  const size = 8 + Math.random() * 4; // Vary size for more visual interest
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(circle, rgba(255,215,0,0.95) 0%, rgba(255,215,0,0.6) 50%, rgba(255,215,0,0.2) 100%)',
        borderRadius: '50%',
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        boxShadow: '0 0 8px rgba(255,215,0,0.8), 0 0 16px rgba(255,215,0,0.4)',
      }}
    />
  );
}

interface CloudProps {
  x: number;
  speed: number;
  size: number;
}

function Cloud({ x, speed, size }: CloudProps) {
  return (
    <div
      className="absolute pointer-events-none opacity-40"
      style={{
        left: `${x}%`,
        top: `${5 + Math.random() * 15}%`,
        width: `${size}px`,
        height: `${size * 0.6}px`,
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
        borderRadius: '50%',
        animation: `cloudMove ${speed}s linear infinite`,
        filter: 'blur(12px)',
      }}
    />
  );
}

interface IsometricGardenProps {
  plants: Plant[];
}

export function IsometricGarden({ plants }: IsometricGardenProps) {
  const [pollenParticles, setPollenParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  const [clouds, setClouds] = useState<Array<{ x: number; speed: number; size: number }>>([]);

  // Generate more pollen particles for better visual appeal
  useEffect(() => {
    const particles = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setPollenParticles(particles);
  }, []);

  // Generate clouds
  useEffect(() => {
    const cloudData = Array.from({ length: 3 }, (_, i) => ({
      x: -20 - i * 40,
      speed: 20 + Math.random() * 10,
      size: 80 + Math.random() * 40,
    }));
    setClouds(cloudData);
  }, []);

  // Calculate grid positions - all plants on same horizontal line, maximized spacing
  const getGridPosition = (index: number, total: number) => {
    // Arrange all plants in a single horizontal row with maximum equal spacing
    const containerWidth = 600; // Container width
    const containerHeight = 500; // Container height
    const plantWidth = 100; // Reduced plant width estimate to maximize spacing
    const edgePadding = 10; // Minimal edge padding to maximize available space
    
    // Calculate available width (container minus edge padding)
    const availableWidth = containerWidth - (2 * edgePadding);
    
    // Calculate spacing between plants (equal spacing between all plants)
    // Maximize spacing by using most of the available width
    const spacing = total > 1 
      ? (availableWidth - (total * plantWidth)) / (total - 1)
      : 0;
    
    // Start position: edge padding + half plant width
    const startX = edgePadding + plantWidth / 2;
    const centerY = containerHeight / 2; // Center vertically
    
    // Calculate x position: start + (index * (plantWidth + spacing))
    const x = startX + index * (plantWidth + spacing);
    
    return { x, y: centerY };
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-gradient-to-b from-sky-400 via-sky-300 via-green-100 to-green-300 border-4 border-primary-300 shadow-2xl">
      {/* Enhanced sky background with clouds */}
      <div className="absolute inset-0">
        {clouds.map((cloud, i) => (
          <Cloud key={i} {...cloud} />
        ))}
      </div>

      {/* Enhanced pollen particles - more visible */}
      <div className="absolute inset-0">
        {pollenParticles.map((particle, i) => (
          <PollenParticle key={i} {...particle} />
        ))}
      </div>

      {/* Decorative sun */}
      <div 
        className="absolute top-8 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 opacity-60 blur-xl"
        style={{
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
        }}
      />

      {/* Plants on isometric grid */}
      <div className="relative w-full h-full">
        {plants.map((plant, index) => (
          <IsometricPlant
            key={plant.id}
            plant={plant}
            position={getGridPosition(index, plants.length)}
          />
        ))}
      </div>

      {/* Ground texture overlay for depth */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-400/30 via-green-300/20 to-transparent"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)',
        }}
      />

    </div>
  );
}
