import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, HardDriveIcon, InboxIcon, MessageSquareIcon, UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { useApp, useT } from '../contexts/AppContext';
import { getModule } from '../utils/lookup';
import { PersonSession } from '../types/app';

export function History() {
  const { personSessions, currentSession } = useApp();
  const t = useT();
  const navigate = useNavigate();

  // Combine current active session (if it has queries) with past person sessions
  const allSessions: PersonSession[] = [
    ...(currentSession.queries.length > 0 ? [currentSession] : []),
    ...personSessions
  ];

  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>(() => {
    // Default open the first (latest) session
    if (allSessions.length > 0) {
      return { [allSessions[0].id]: true };
    }
    return {};
  });

  const toggleSession = (id: string) => {
    setExpandedSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="page-container max-w-4xl py-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-ink">{t('navHistory')}</h1>
          <p className="mt-1 flex items-center gap-2 text-small text-muted">
            <HardDriveIcon className="h-5 w-5 text-navy" aria-hidden="true" />
            Person & Visitor Session History — saved locally on this kiosk device.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {allSessions.length === 0 ? (
          <OfflineState
            icon={InboxIcon}
            title="No person sessions recorded yet"
            body="Questions asked by farmers and visitors during chatbot sessions will appear grouped here."
          >
            <Button variant="primary" onClick={() => navigate('/chatbot')}>
              Start a Chatbot Session
            </Button>
          </OfflineState>
        ) : (
          allSessions.map((session) => {
            const isExpanded = expandedSessions[session.id] ?? true;
            const isCurrentActive = session.id === currentSession.id;

            return (
              <section
                key={session.id}
                className={`rounded-card bg-paper border shadow-card transition-all ${
                  isCurrentActive ? 'border-brand ring-1 ring-brand' : 'border-line'
                }`}
              >
                {/* Session Header Card */}
                <header
                  onClick={() => toggleSession(session.id)}
                  className="flex cursor-pointer items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors rounded-t-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
                        isCurrentActive ? 'bg-brand animate-pulse' : 'bg-navy'
                      }`}
                    >
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-title font-bold text-ink">{session.userLabel}</h2>
                        {isCurrentActive && (
                          <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                            Active Session
                          </span>
                        )}
                      </div>
                      <p className="text-small text-muted flex items-center gap-2 mt-0.5">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {session.date} · Language: <span className="uppercase font-semibold">{session.language}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink border border-line">
                      {session.queriesCount} {session.queriesCount === 1 ? 'query' : 'queries'}
                    </span>
                    <button type="button" className="text-muted hover:text-ink">
                      {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </header>

                {/* Session Queries Thread (Saved one below the other) */}
                {isExpanded && (
                  <div className="border-t border-line bg-slate-50/50 p-4 sm:p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                      <MessageSquareIcon className="h-4 w-4 text-brand" />
                      Queries asked in this session (in sequence)
                    </h3>

                    <div className="space-y-4">
                      {session.queries.map((q, idx) => {
                        const moduleDef = getModule(q.module);
                        const ModuleIcon = moduleDef?.icon;

                        return (
                          <div
                            key={q.id}
                            className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 shadow-sm"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand-dark">
                              #{idx + 1}
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-body font-bold text-ink">“{q.question}”</p>
                                <span className="text-xs font-medium text-muted">{q.timestamp}</span>
                              </div>

                              {q.answerTitle && (
                                <div className="mt-2 flex items-center gap-2">
                                  {ModuleIcon && <ModuleIcon className="h-4 w-4 text-brand" />}
                                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-ink border border-line">
                                    Answer: {q.answerTitle}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}