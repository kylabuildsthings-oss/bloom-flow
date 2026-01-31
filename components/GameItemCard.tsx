'use client';

import { ReactNode, useState } from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface GameItemCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  cornerIcon?: ReactNode;
  subtitle?: string;
  /** Optional tooltip text; shows an info icon next to the title when set */
  infoTooltip?: string;
  className?: string;
  variant?: 'wood' | 'stone';
  onClick?: () => void;
}

export function GameItemCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary-600',
  cornerIcon,
  subtitle,
  infoTooltip,
  className = '',
  variant = 'wood',
  onClick,
}: GameItemCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  // Create canvas texture using CSS - subtle noise pattern
  const textureStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.04) 3px),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.04) 3px),
      repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
      radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 40%),
      radial-gradient(circle at 80% 50%, rgba(0,0,0,0.03) 0%, transparent 40%),
      radial-gradient(circle at 50% 20%, rgba(0,0,0,0.02) 0%, transparent 30%)
    `,
    backgroundBlendMode: 'overlay',
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 200% 200%, 200% 200%, 150% 150%',
  };

  const borderGradient = variant === 'wood' 
    ? 'linear-gradient(180deg, #8B6F47 0%, #A0826D 50%, #8B6F47 100%)'
    : 'linear-gradient(180deg, #6B7280 0%, #9CA3AF 50%, #6B7280 100%)';

  return (
    <div
      className={`relative overflow-visible rounded-lg border-2 ${onClick ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''} ${className}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
        ...textureStyle,
      }}
      onClick={onClick}
    >
      {/* Decorative top border */}
      <div
        className="h-2 w-full"
        style={{
          background: borderGradient,
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      />

      {/* Content */}
      <div className="p-4 relative">
        {/* Corner icon */}
        {cornerIcon && (
          <div className="absolute top-3 right-3 opacity-60">
            {cornerIcon}
          </div>
        )}

        {/* Main icon + title + optional info (info sits next to title so it's not clipped) */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
          <h3 className="text-sm font-semibold text-neutral-800 shrink-0">{title}</h3>
          {infoTooltip && (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="What does this mean?"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip((v) => !v);
                }}
                onBlur={() => setShowTooltip(false)}
                className="p-1 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1"
                title={infoTooltip}
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip && (
                <div
                  className="absolute left-0 top-full mt-1 z-20 w-64 max-w-[calc(100vw-2rem)] p-3 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-lg"
                  role="tooltip"
                >
                  {infoTooltip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-neutral-600 mt-1">{subtitle}</p>
        )}

        {/* Subtle inner shadow for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
          }}
        />
      </div>
    </div>
  );
}
