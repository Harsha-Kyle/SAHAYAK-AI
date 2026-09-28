import React from 'react';
import { Loader2Icon, MicIcon, MicOffIcon } from 'lucide-react';

export type MicState = 'idle' | 'listening' | 'loading' | 'disabled' | 'error';
type MicSize = 'md' | 'lg' | 'xl';

interface MicButtonProps {
  state?: MicState;
  size?: MicSize;
  label: string;
  onClick?: () => void;
  className?: string;
}

const sizeMap: Record<MicSize, string> = { md: 'h-16 w-16', lg: 'h-32 w-32', xl: 'h-44 w-44' };
const iconMap: Record<MicSize, string> = { md: 'h-7 w-7', lg: 'h-14 w-14', xl: 'h-20 w-20' };

export function MicButton({ state = 'idle', size = 'lg', label, onClick, className = '' }: MicButtonProps) {
  const pulsing = state === 'idle' || state === 'listening';
  const tone =
  state === 'error' ?
  'border-4 border-danger bg-danger-tint text-danger' :
  state === 'disabled' ?
  'cursor-not-allowed bg-line text-muted' :
  'bg-saffron text-ink hover:bg-saffron-dark active:bg-saffron-dark';
  const Icon = state === 'disabled' || state === 'error' ? MicOffIcon : MicIcon;
  const speed = state === 'listening' ? '[animation-duration:1.3s]' : '';

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      {pulsing &&
      <>
          <span aria-hidden="true" className={`absolute inset-0 animate-pulse-ring rounded-full bg-saffron ${speed}`} />
          <span
          aria-hidden="true"
          className={`absolute inset-0 animate-pulse-ring rounded-full bg-saffron [animation-delay:1.1s] ${speed}`} />
        
        </>
      }
      <button
        type="button"
        aria-label={label}
        aria-busy={state === 'loading' || undefined}
        aria-pressed={state === 'listening' || undefined}
        disabled={state === 'disabled' || state === 'loading'}
        onClick={onClick}
        className={`relative flex ${sizeMap[size]} items-center justify-center rounded-full shadow-raised transition-[transform,background-color] duration-150 ease-out active:scale-95 disabled:active:scale-100 ${tone}`}>
        
        {state === 'loading' ?
        <Loader2Icon className={`${iconMap[size]} animate-spin`} aria-hidden="true" /> :

        <Icon className={iconMap[size]} aria-hidden="true" strokeWidth={2.25} />
        }
      </button>
    </span>);

}