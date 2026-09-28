import React, { useState } from 'react';
import { CircleCheckIcon, PhoneCallIcon, PhoneIcon, UsersIcon, WifiOffIcon } from 'lucide-react';
import { OfficeCard } from '../components/help/OfficeCard';
import { Button, buttonClasses } from '../components/ui/Button';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useApp, useT } from '../contexts/AppContext';
import { helplines, offices } from '../data/offices';
import { profile } from '../data/profile';

type CallbackState = 'idle' | 'requesting' | 'requested';

export function TalkToHuman() {
  const { online, easyMode } = useApp();
  const t = useT();
  const [callback, setCallback] = useState<CallbackState>('idle');
  const [primary, ...others] = helplines;

  const requestCallback = () => {
    setCallback('requesting');
    window.setTimeout(() => setCallback('requested'), 1100);
  };

  return (
    <div className="page-container py-4">
      <ScreenHeader title={t('talkToHuman')} subtitle="Real people who speak your language" />

      <div className={`grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'}`}>
        <div className="flex flex-col gap-6">
          <section aria-labelledby="primary-helpline" className="rounded-card bg-brand p-6 text-white md:p-8">
            <p className="text-small">{primary.note}</p>
            <h2 id="primary-helpline" className="mt-1 text-display">
              {primary.name}
            </h2>
            <p className="mt-1 text-body">{primary.hours}</p>
            <a
              href={`tel:${primary.dial}`}
              className="mt-6 inline-flex min-h-tap-lg w-full items-center justify-center gap-3 whitespace-nowrap rounded-2xl bg-paper px-6 text-title text-brand-dark transition-transform duration-150 ease-out active:scale-[0.98] sm:w-auto">
              
              <PhoneIcon className="h-7 w-7" aria-hidden="true" />
              Call {primary.number}
            </a>
          </section>

          <section aria-labelledby="other-helplines">
            <h2 id="other-helplines" className="text-title text-ink">
              Scheme helplines
            </h2>
            <ul className="mt-3 divide-y divide-line rounded-card bg-paper shadow-card">
              {others.map((h) =>
              <li key={h.id} className="flex flex-wrap items-center gap-4 p-5 sm:flex-nowrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-semibold text-ink">{h.name}</p>
                    <p className="text-small text-muted">
                      {h.note} · {h.hours}
                    </p>
                  </div>
                  <a href={`tel:${h.dial}`} className={`${buttonClasses('outline')} w-full sm:w-auto`} aria-label={`Call ${h.name}, ${h.number}`}>
                    <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                    {h.number}
                  </a>
                </li>
              )}
            </ul>
          </section>

          <section aria-labelledby="callback-heading" className="rounded-card bg-paper p-6 shadow-card">
            <h2 id="callback-heading" className="text-title text-ink">
              Ask someone to call you
            </h2>
            {callback === 'requested' ?
            <p role="status" className="mt-3 flex items-start gap-3 text-body text-ink">
                <CircleCheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
                Done. An advisor will call {profile.phone} in about 10 minutes.
              </p> :

            <>
                <p className="mt-2 flex items-center gap-2 text-body text-ink">
                  <UsersIcon className="h-5 w-5 text-navy" aria-hidden="true" />3 people ahead of you · about 10 minutes
                </p>
                <Button
                variant="brand"
                size="lg"
                icon={PhoneCallIcon}
                className="mt-5"
                loading={callback === 'requesting'}
                disabled={!online}
                onClick={requestCallback}>
                
                  {callback === 'requesting' ? 'Requesting…' : 'Request a call back'}
                </Button>
                {!online && <p className="mt-2 text-small text-muted">Needs internet. You can still call a helpline directly.</p>}
              </>
            }
          </section>
        </div>

        <section aria-labelledby="offices-heading">
          <h2 id="offices-heading" className="text-title text-ink">
            Nearest offices
          </h2>
          <div className="mt-3 divide-y divide-line rounded-card bg-paper shadow-card">
            {offices.map((office, i) =>
            <OfficeCard key={office.id} office={office} emphasis={i === 0} />
            )}
          </div>
        </section>
      </div>

      <p className="mt-8 flex items-center gap-2 text-small text-muted">
        <WifiOffIcon className="h-5 w-5 text-navy" aria-hidden="true" />
        Phone calls work without internet.
      </p>
    </div>);

}