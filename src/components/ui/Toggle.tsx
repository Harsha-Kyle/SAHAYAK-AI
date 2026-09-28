import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex min-h-tap w-full items-center gap-4 rounded-2xl py-3 text-left disabled:cursor-not-allowed">
      
      <span className="min-w-0 flex-1">
        <span className={`block text-body font-semibold ${disabled ? 'text-muted' : 'text-ink'}`}>{label}</span>
        {description && <span className="mt-1 block text-small text-muted">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border-2 transition-colors duration-200 ease-out ${
        disabled ? 'border-line bg-line' : checked ? 'border-brand bg-brand' : 'border-muted bg-paper'}`
        }>
        
        <span
          className={`inline-block h-6 w-6 rounded-full shadow-card transition-transform duration-200 ease-out ${
          checked ? 'translate-x-8 bg-paper' : 'translate-x-1 bg-muted'} ${
          disabled ? 'bg-paper' : ''}`} />
        
      </span>
    </button>);

}