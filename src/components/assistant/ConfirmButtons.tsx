import React from 'react';
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';

interface ConfirmButtonsProps {
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
  loading?: 'yes' | 'no' | null;
  disabled?: boolean;
  className?: string;
}

export function ConfirmButtons({ onYes, onNo, yesLabel, noLabel, loading = null, disabled = false, className = '' }: ConfirmButtonsProps) {
  const t = useT();
  const base =
  'flex min-h-[5.5rem] items-center justify-center gap-3 rounded-card px-4 text-title transition-[transform,background-color] duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted disabled:active:scale-100';
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <button
        type="button"
        onClick={onYes}
        disabled={disabled || loading !== null}
        aria-busy={loading === 'yes' || undefined}
        className={`${base} bg-brand text-white hover:bg-brand-dark active:bg-brand-dark`}>
        
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-brand">
          {loading === 'yes' ?
          <Loader2Icon className="h-6 w-6 animate-spin" aria-hidden="true" /> :

          <CheckIcon className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
          }
        </span>
        <span className="whitespace-nowrap">{yesLabel ?? t('yes')}</span>
      </button>
      <button
        type="button"
        onClick={onNo}
        disabled={disabled || loading !== null}
        aria-busy={loading === 'no' || undefined}
        className={`${base} border-2 border-navy bg-paper text-navy hover:bg-navy-tint active:bg-navy-tint`}>
        
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
          {loading === 'no' ?
          <Loader2Icon className="h-6 w-6 animate-spin" aria-hidden="true" /> :

          <XIcon className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
          }
        </span>
        <span className="whitespace-nowrap">{noLabel ?? t('no')}</span>
      </button>
    </div>);

}