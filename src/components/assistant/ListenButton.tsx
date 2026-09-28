import React from 'react';
import { SquareIcon, Volume2Icon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';
import { SoundBars } from '../ui/SoundBars';

interface ListenButtonProps {
  speaking: boolean;
  onToggle: () => void;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  label?: string;
}

export function ListenButton({ speaking, onToggle, size = 'lg', fullWidth = false, disabled = false, label }: ListenButtonProps) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={speaking}
      className={`inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-2xl font-semibold transition-[transform,background-color] duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${
      size === 'lg' ? 'min-h-tap-lg px-7 text-title' : 'min-h-tap px-5 text-body'} ${
      fullWidth ? 'w-full' : ''} ${speaking ? 'bg-navy text-white' : 'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark'}`}>
      
      {speaking ?
      <>
          <SoundBars />
          <SquareIcon className="h-5 w-5 fill-current" aria-hidden="true" />
          {t('stop')}
        </> :

      <>
          <Volume2Icon className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} aria-hidden="true" />
          {label ?? t('listen')}
        </>
      }
    </button>);

}