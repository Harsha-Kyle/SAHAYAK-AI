import React from 'react';
import { Link2Icon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';

interface ContextCueProps {
  title: string;
  onDark?: boolean;
}

/** Shows that a follow-up is being understood in the context of the previous answer. */
export function ContextCue({ title, onDark = false }: ContextCueProps) {
  const t = useT();
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
      onDark ? 'border-paper bg-brand text-white' : 'border-brand bg-brand-tint text-brand-dark'}`
      }>
      
      <Link2Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-small">
        <span className="font-semibold">{t('inContext')}:</span> {title}
      </p>
    </div>);

}