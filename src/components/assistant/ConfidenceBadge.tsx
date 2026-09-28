import React from 'react';
import { BadgeCheckIcon, CircleAlertIcon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';
import { Confidence } from '../../types/app';

interface ConfidenceBadgeProps {
  confidence: Confidence;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const t = useT();
  if (confidence === 'verified') {
    return (
      <span className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand-tint px-3 text-small font-semibold text-brand-dark">
        <BadgeCheckIcon className="h-5 w-5" aria-hidden="true" />
        {t('verified')}
      </span>);

  }
  return (
    <span className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 border-saffron bg-saffron-tint px-3 text-small font-semibold text-ink">
      <CircleAlertIcon className="h-5 w-5" aria-hidden="true" />
      {t('partial')}
    </span>);

}