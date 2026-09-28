import React from 'react';
import { Loader2Icon, WifiIcon, WifiOffIcon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';

export type ConnectivityStatus = 'online' | 'offline' | 'syncing';

interface StatusChipProps {
  status: ConnectivityStatus;
  onDark?: boolean;
  compact?: boolean;
}

export function StatusChip({ status, onDark = false, compact = false }: StatusChipProps) {
  const t = useT();
  const label = status === 'online' ? t('online') : status === 'offline' ? t('offline') : 'Syncing';
  const Icon = status === 'online' ? WifiIcon : status === 'offline' ? WifiOffIcon : Loader2Icon;

  const tone = onDark ?
  status === 'offline' ?
  'bg-paper text-ink' :
  'bg-brand-dark text-white' :
  status === 'online' ?
  'bg-brand-tint text-brand-dark' :
  status === 'offline' ?
  'border-2 border-muted bg-paper text-ink' :
  'bg-navy-tint text-navy';

  return (
    <span
      role="status"
      aria-label={`Connection: ${label}`}
      className={`inline-flex min-h-[2.5rem] items-center gap-2 whitespace-nowrap rounded-full px-3 text-small font-semibold ${tone}`}>
      
      <Icon className={`h-5 w-5 ${status === 'syncing' ? 'animate-spin' : ''}`} aria-hidden="true" />
      <span className={compact ? 'sr-only sm:not-sr-only' : ''}>{label}</span>
    </span>);

}