import React from 'react';

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
}

export function ProgressDots({ total, current, className = '' }: ProgressDotsProps) {
  return (
    <div role="group" aria-label={`Step ${current + 1} of ${total}`} className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, i) =>
      <span
        key={i}
        aria-hidden="true"
        className={`h-3 rounded-full transition-[width,background-color] duration-200 ease-out ${
        i === current ? 'w-10 bg-brand' : i < current ? 'w-3 bg-brand' : 'w-3 border-2 border-muted bg-paper'}`
        } />

      )}
    </div>);

}