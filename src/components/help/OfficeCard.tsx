import React from 'react';
import { ClockIcon, MapPinIcon, NavigationIcon, PhoneIcon } from 'lucide-react';
import { Office } from '../../types/app';
import { buttonClasses } from '../ui/Button';

interface OfficeCardProps {
  office: Office;
  emphasis?: boolean;
}

export function OfficeCard({ office, emphasis = false }: OfficeCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapsQuery)}`;
  return (
    <article className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-tint text-navy">
          <MapPinIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-small text-muted">
            {office.type} · {office.distance}
          </p>
          <h3 className="text-body font-semibold text-ink">{office.name}</h3>
          <p className="text-small text-ink">{office.address}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
            <span className={`inline-flex items-center gap-1.5 font-semibold ${office.openNow ? 'text-brand-dark' : 'text-muted'}`}>
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${office.openNow ? 'bg-brand' : 'bg-muted'}`} />
              {office.openNow ? 'Open now' : 'Closed now'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <ClockIcon className="h-4 w-4" aria-hidden="true" />
              {office.hours}
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${office.dial}`} className={buttonClasses(emphasis ? 'brand' : 'outline', 'md', true)} aria-label={`Call ${office.name}, ${office.phone}`}>
          <PhoneIcon className="h-5 w-5" aria-hidden="true" />
          Call
        </a>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className={buttonClasses('outline', 'md', true)} aria-label={`Directions to ${office.name}`}>
          <NavigationIcon className="h-5 w-5" aria-hidden="true" />
          Directions
        </a>
      </div>
    </article>);

}