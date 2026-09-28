import React from 'react';
import { SproutIcon } from 'lucide-react';

interface LogoProps {
  onDark?: boolean;
  size?: 'md' | 'lg';
  hideTextOnMobile?: boolean;
}

export function Logo({ onDark = false, size = 'md', hideTextOnMobile = false }: LogoProps) {
  const mark = size === 'lg' ? 'h-20 w-20' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-11 w-11' : 'h-6 w-6';
  return (
    <span className="flex items-center gap-3">
      <span
        className={`flex ${mark} shrink-0 items-center justify-center rounded-full ${onDark ? 'bg-paper text-brand' : 'bg-brand text-white'}`}>
        
        <SproutIcon className={icon} aria-hidden="true" />
      </span>
      <span className={`flex-col leading-tight ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
        <span className={`${size === 'lg' ? 'text-display' : 'text-body font-bold'} ${onDark ? 'text-white' : 'text-ink'}`}>
          Sahayak AI
        </span>
        <span lang="hi" className={`text-small ${onDark ? 'text-white' : 'text-muted'}`}>
          सहायक AI
        </span>
      </span>
    </span>);

}