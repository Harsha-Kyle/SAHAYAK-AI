import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { WifiOffIcon } from 'lucide-react';
import { MicButton } from '../components/assistant/MicButton';
import { ModuleTile } from '../components/assistant/ModuleTile';
import { KioskMicCue } from '../components/home/KioskMicCue';
import { KpiSummaryStrip } from '../components/home/KpiSummaryStrip';
import { RecentlyAsked } from '../components/home/RecentlyAsked';
import { TrendingQuestions } from '../components/home/TrendingQuestions';
import { useApp, useL, useT } from '../contexts/AppContext';
import { modules } from '../data/modules';
import { getLanguage } from '../utils/lookup';

export function Home() {
  const { onboarded, kiosk, online, easyMode, language, topicQueryCounts } = useApp();
  const t = useT();
  const L = useL();
  const navigate = useNavigate();
  const lang = getLanguage(language);

  if (!onboarded) return <Navigate to={kiosk ? '/kiosk' : '/welcome'} replace />;

  return (
    <div className="page-container py-3 md:py-4 flex flex-col justify-between">
      {/* Top Header & Large Mic Section */}
      <section aria-labelledby="greeting" className="flex flex-col items-center text-center">
        {/* Compact 4-KPI summary strip */}
        <KpiSummaryStrip />

        <h1 id="greeting" lang={language} className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
          {lang.greeting}
        </h1>

        {/* Prominent Large Central Mic Button */}
        <div className="my-6">
          <MicButton size={kiosk ? 'xl' : 'lg'} label={t('tapToSpeak')} onClick={() => navigate('/chatbot?autoListen=true')} />
        </div>
        <p className="text-body font-bold text-ink">{t('tapToSpeak')}</p>
        {kiosk && <KioskMicCue />}

        {!online && (
          <div className="mt-3 flex max-w-xl items-start gap-2 rounded-xl border border-muted bg-paper p-3 text-left">
            <WifiOffIcon className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
            <p className="text-xs text-ink">
              Offline mode: PM-KISAN, crop insurance, KCC loan & PACS membership saved.{' '}
              <Link to="/settings#offline" className="font-semibold text-navy underline underline-offset-4">
                Manage saved answers
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Topics section with query counters -> Navigates to Topic page /module/:id */}
      <section aria-labelledby="modules-heading" className="mt-6">
        <h2 id="modules-heading" className="text-body text-ink font-bold mb-2">
          {t('chooseTopic')}
        </h2>
        <div className={`grid gap-2 sm:gap-3 ${easyMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
          {modules.map((m, i) => {
            const disabled = !online && !m.availableOffline;
            const queryCount = topicQueryCounts[m.id] || 0;
            return (
              <ModuleTile
                key={m.id}
                icon={m.icon}
                label={L(m.label)}
                sublabel={disabled ? t('needsInternet') : `${queryCount.toLocaleString()} queries asked`}
                disabled={disabled}
                onClick={() => navigate(`/module/${m.id}`)}
                className={!easyMode && i === modules.length - 1 ? 'col-span-2 sm:col-span-1' : ''}
              />
            );
          })}
        </div>
      </section>

      {/* Recently Asked & Trending Questions Preview Row */}
      <div className={`mt-6 grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'}`}>
        <RecentlyAsked />
        <TrendingQuestions />
      </div>
    </div>
  );
}