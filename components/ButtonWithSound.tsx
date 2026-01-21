'use client';

import { ReactNode } from 'react';
import { playClickSound } from '@/lib/sound-effects';

interface ButtonWithSoundProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}

export function ButtonWithSound({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button',
  ...props 
}: ButtonWithSoundProps) {
  const handleClick = () => {
    if (!disabled) {
      playClickSound();
      onClick?.();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
