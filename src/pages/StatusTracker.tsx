import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon, CircleCheckIcon, MegaphoneIcon, SearchIcon, SearchXIcon, WifiOffIcon } from 'lucide-react';
import { MicButton } from '../components/assistant/MicButton';
import { StatusTimeline } from '../components/status/StatusTimeline';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useApp } from '../contexts/AppContext';
import { statusRecords } from '../data/statusRecords';
import { StatusRecord } from '../types/app';
import { formatDateTime } from '../utils/format';

type SearchState = 'idle' | 'loading' | 'found' | 'notfound';

function findRecord(id: string | null): StatusRecord | undefined {
  if (!id) return undefined;
  return statusRecords.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
}

export function StatusTracker() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { online, easyMode, addHistory, resetGrievance } = useApp();
  const initial = findRecord(params.get('id'));
  const [query, setQuery] = useState(initial?.id ?? '');
  const [state, setState] = useState<SearchState>(initial ? 'found' : 'idle');
  const [record, setRecord] = useState<StatusRecord | undefined>(initial);
  const [listening, setListening] = useState(false);

  const search = (value: string) => {
    if (!value.trim()) return;
    setState('loading');
    window.setTimeout(
      () => {
        const found = findRecord(value);
        if (found) {
          setRecord(found);
          setState('found');
          addHistory({
            id: `h-status-${found.id}`,
            kind: 'status',
            module: found.module,
            title: { en: `Checked: ${found.title}` },
            short: found.scheme,
            detail: found.id,
            date: new Date().toISOString(),
            to: `/status?id=${found.id}`
          });
        } else {
          setState('notfound');
        }
      },
      online ? 1100 : 300
    );
  };

  const listen = () => {
    setListening(true);
    window.setTimeout(() => {
      setListening(false);
      setQuery('PMFBY-2026-TN-118402');
      search('PMFBY-2026-TN-118402');
    }, 1800);
  };

  const listed = statusRecords.filter((r) => r.listed);
  const complete = record ? record.current >= record.stages.length : false;

  return (
    <div className="page-container py-4">
      <ScreenHeader title="Where is my claim?" subtitle="Say or type your claim, application or complaint number" />

      {!online &&
      <div role="status" className="mb-4 flex items-start gap-3 rounded-2xl border-2 border-muted bg-paper p-4">
          <WifiOffIcon className="mt-0.5 h-6 w-6 shrink-0 text-navy" aria-hidden="true" />
          <p className="text-small text-ink">
            <span className="font-semibold">Offline.</span> Showing the last saved status from {formatDateTime(statusRecords[0].lastUpdated)}. New numbers can’t be
            checked until you’re online.
          </p>
        </div>
      }

      <div className={`grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[24rem_minmax(0,1fr)]'}`}>
        <div className="flex flex-col gap-6">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              search(query);
            }}
            className="rounded-card bg-paper p-5 shadow-card">
            
            <label htmlFor="status-query" className="text-body font-semibold text-ink">
              Your number
            </label>
            <div className="mt-3 flex items-center gap-3">
              <input
                id="status-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. PMFBY-2026-TN-118402"
                autoComplete="off"
                className="min-h-tap w-full min-w-0 flex-1 rounded-2xl border-2 border-line bg-paper px-4 text-body uppercase text-ink placeholder:normal-case placeholder:text-muted focus:border-navy" />
              
              <MicButton size="md" state={listening ? 'listening' : 'idle'} label="Say your number" onClick={listen} />
            </div>
            {listening &&
            <p aria-live="polite" className="mt-2 text-small text-muted">
                Listening… say the number slowly.
              </p>
            }
            <Button type="submit" variant="brand" fullWidth icon={SearchIcon} className="mt-4" loading={state === 'loading'} disabled={!query.trim()}>
              {state === 'loading' ? 'Checking…' : 'Check status'}
            </Button>
          </form>

          <section aria-labelledby="mine-heading">
            <h2 id="mine-heading" className="text-body font-semibold text-muted">
              Your applications
            </h2>
            <ul className="mt-3 divide-y divide-line rounded-card bg-paper shadow-card">
              {listed.map((r) => {
                const done = r.current >= r.stages.length;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(r.id);
                        search(r.id);
                      }}
                      aria-current={record?.id === r.id && state === 'found' ? 'true' : undefined}
                      className={`flex min-h-tap-lg w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out first:rounded-t-card last:rounded-b-card hover:bg-surface ${
                      record?.id === r.id && state === 'found' ? 'bg-brand-tint' : ''}`
                      }>
                      
                      <span className="min-w-0 flex-1">
                        <span className="block text-body text-ink">{r.title}</span>
                        <span className="block truncate text-small text-muted">{r.id}</span>
                      </span>
                      <span className={`whitespace-nowrap text-small font-semibold ${done ? 'text-brand-dark' : 'text-ink'}`}>
                        {done ? 'Done' : r.stages[r.current].label}
                      </span>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                    </button>
                  </li>);

              })}
            </ul>
          </section>
        </div>

        <section aria-live="polite" aria-label="Status result">
          {state === 'idle' &&
          <OfflineState icon={SearchIcon} title="Say or type your number" body="Tap the mic and read the number from your receipt or SMS. Or tap one of your applications." />
          }
          {state === 'loading' &&
          <div role="status" className="animate-pulse rounded-card bg-paper p-6 shadow-card">
              <span className="block h-6 w-2/3 rounded-full bg-line" />
              <span className="mt-3 block h-4 w-1/3 rounded-full bg-line" />
              {[0, 1, 2, 3].map((i) =>
            <div key={i} className="mt-8 flex gap-4">
                  <span className="h-12 w-12 rounded-full bg-line" />
                  <span className="mt-3 h-4 w-1/2 rounded-full bg-line" />
                </div>
            )}
              <span className="sr-only">Checking status…</span>
            </div>
          }
          {state === 'notfound' &&
          <OfflineState
            icon={online ? SearchXIcon : WifiOffIcon}
            title={online ? 'No record found for this number' : 'Can’t check new numbers offline'}
            body={online ? 'Check the number on your receipt and try again. It usually starts with PMFBY, PMKISAN or GRV.' : 'Connect to the internet and try again.'}>
            
              <Button variant="outline" onClick={() => navigate('/help')}>
                Talk to a person
              </Button>
            </OfflineState>
          }
          {state === 'found' && record &&
          <article className="rounded-card bg-paper p-6 shadow-card md:p-8">
              <header className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-small text-muted">{record.scheme}</p>
                  <h2 className="text-title text-ink">{record.title}</h2>
                  <p className="text-small text-ink">{record.id}</p>
                </div>
                {complete &&
              <span className="inline-flex min-h-[2.5rem] items-center gap-2 self-start whitespace-nowrap rounded-full bg-brand-tint px-3 text-small font-semibold text-brand-dark">
                    <CircleCheckIcon className="h-5 w-5" aria-hidden="true" />
                    Completed
                  </span>
              }
              </header>
              <div className="mt-6">
                <StatusTimeline record={record} />
              </div>
              <footer className="mt-8 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-small text-muted">Last updated {formatDateTime(record.lastUpdated)}</p>
                {!complete && record.module !== 'grievance' &&
              <Button
                variant="outline"
                icon={MegaphoneIcon}
                onClick={() => {
                  resetGrievance('pmfby-claim');
                  navigate('/grievance?about=pmfby-claim');
                }}>
                
                    Complain about delay
                  </Button>
              }
              </footer>
            </article>
          }
        </section>
      </div>
    </div>);

}