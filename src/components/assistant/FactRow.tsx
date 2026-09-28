import React from 'react';
import { ClipboardCheckIcon, FilesIcon, IndianRupeeIcon, UsersIcon } from 'lucide-react';
import { useL } from '../../contexts/AppContext';
import { factLabels } from '../../data/factLabels';
import { Fact, FactKind } from '../../types/app';

const factIcons: Record<FactKind, typeof UsersIcon> = {
  who: UsersIcon,
  benefit: IndianRupeeIcon,
  documents: FilesIcon,
  apply: ClipboardCheckIcon
};

interface FactRowProps {
  fact: Fact;
}

export function FactRow({ fact }: FactRowProps) {
  const L = useL();
  const Icon = factIcons[fact.kind];
  const value = L(fact.value);
  const lines = value.split('\n');

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-tint text-navy">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-small font-semibold text-muted">{L(factLabels[fact.kind])}</h3>
        {lines.length > 1 ?
        <ul className="mt-1 space-y-1">
            {lines.map((line) =>
          <li key={line} className="flex items-start gap-3 text-body text-ink">
                <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                {line}
              </li>
          )}
          </ul> :

        <p className="mt-1 text-body text-ink">{value}</p>
        }
      </div>
    </li>);

}