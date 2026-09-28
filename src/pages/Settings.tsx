import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DownloadIcon, LayoutGridIcon, PlayIcon, RefreshCwIcon, ShieldCheckIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { Toggle } from '../components/ui/Toggle';
import { useApp, useT } from '../contexts/AppContext';
import { offlinePacks as initialPacks, offlineStorageLimitMb } from '../data/offlinePacks';
import { OfflinePack } from '../types/app';
import { formatDate } from '../utils/format';
import { getLanguage } from '../utils/lookup';

export function Settings() {
  const navigate = useNavigate();
  const {
    language,
    easyMode,
    setEasyMode,
    easyModeDefault,
    setEasyModeDefault,
    helperMode,
    setHelperMode,
    kiosk,
    setKiosk,
    online,
    clearHistory,
    resetOnboarding
  } = useApp();
  const t = useT();
  const lang = getLanguage(language);
  const [packs, setPacks] = useState<OfflinePack[]>(initialPacks);
  const [busy, setBusy] = useState<string | null>(null);

  const used = packs.filter((p) => p.downloaded).reduce((sum, p) => sum + p.sizeMb, 0);
  const usedPct = Math.min(100, used / offlineStorageLimitMb * 100);

  const togglePack = (pack: OfflinePack) => {
    if (pack.downloaded) {
      setPacks(packs.map((p) => p.id === pack.id ? { ...p, downloaded: false } : p));
      toast(`${pack.name} removed from this device`);
      return;
    }
    setBusy(pack.id);
    window.setTimeout(() => {
      setPacks((prev) => prev.map((p) => p.id === pack.id ? { ...p, downloaded: true, updated: new Date().toISOString() } : p));
      setBusy(null);
      toast.success(`${pack.name} saved for offline use`);
    }, 1200);
  };

  const updateAll = () => {
    setBusy('all');
    window.setTimeout(() => {
      setPacks((prev) => prev.map((p) => p.downloaded ? { ...p, updated: new Date().toISOString() } : p));
      setBusy(null);
      toast.success('All saved answers are up to date');
    }, 1500);
  };

  const sectionClass = 'rounded-card bg-paper p-5 shadow-card md:p-6';

  return (
    <div className="page-container max-w-3xl py-4">
      <ScreenHeader title={t('settings')} />

      <div className="flex flex-col gap-6">
        <section aria-labelledby="lang-heading" className={sectionClass}>
          <h2 id="lang-heading" className="text-title text-ink">
            Language
          </h2>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <p lang={language} className="text-title text-ink">
                {lang.nativeName}
              </p>
              <p className="text-small text-muted">{lang.englishName} · answers are spoken in this language</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/language')}>
              Change
            </Button>
          </div>
        </section>

        <section aria-labelledby="assist-heading" className={sectionClass}>
          <h2 id="assist-heading" className="text-title text-ink">
            Easier to use
          </h2>
          <div className="mt-2 divide-y divide-line">
            <Toggle checked={easyMode} onChange={setEasyMode} label="Easy Mode" description="Bigger text, slower voice, higher contrast, one column, and a repeat button." />
            <Toggle checked={easyModeDefault} onChange={setEasyModeDefault} label="Always start in Easy Mode" />
            <Toggle
              checked={helperMode}
              onChange={setHelperMode}
              label="I’m helping someone"
              description="For CSC operators, PACS staff or family members. Adds read-aloud checks and waits for you before moving on." />
            
            <Toggle checked={kiosk} onChange={setKiosk} label="Kiosk display" description="For fixed touchscreens at CSCs and PACS offices." />
          </div>
        </section>

        <section id="offline" aria-labelledby="offline-heading" className={sectionClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="offline-heading" className="text-title text-ink">
              Saved for offline
            </h2>
            <Button variant="ghost" icon={RefreshCwIcon} loading={busy === 'all'} disabled={!online || busy !== null} onClick={updateAll}>
              Update all
            </Button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-small text-muted">
              <span>{used.toFixed(1)} MB used</span>
              <span>{offlineStorageLimitMb} MB available</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(usedPct)} aria-valuemin={0} aria-valuemax={100} aria-label="Storage used">
              <div className="h-3 rounded-full bg-brand" style={{ width: `${usedPct}%` }} />
            </div>
          </div>
          {!online && <p className="mt-3 text-small text-muted">Connect to the internet to download or update.</p>}
          <ul className="mt-4 divide-y divide-line">
            {packs.map((pack) =>
            <li key={pack.id} className="flex flex-wrap items-center gap-3 py-4 sm:flex-nowrap">
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-ink">{pack.name}</p>
                  <p className="text-small text-muted">
                    {pack.sizeMb} MB · {pack.downloaded ? `Updated ${formatDate(pack.updated)}` : 'Not saved'}
                  </p>
                </div>
                {pack.downloaded ?
              <Button variant="ghost" icon={Trash2Icon} onClick={() => togglePack(pack)} disabled={busy !== null}>
                    Remove
                  </Button> :

              <Button variant="outline" icon={DownloadIcon} loading={busy === pack.id} disabled={!online || busy !== null && busy !== pack.id} onClick={() => togglePack(pack)}>
                    {busy === pack.id ? 'Saving…' : 'Save'}
                  </Button>
              }
              </li>
            )}
          </ul>
        </section>

        <section aria-labelledby="privacy-heading" className={sectionClass}>
          <h2 id="privacy-heading" className="flex items-center gap-2 text-title text-ink">
            <ShieldCheckIcon className="h-6 w-6 text-brand" aria-hidden="true" />
            Your privacy
          </h2>
          <ul className="mt-3 space-y-3 text-body text-ink">
            <li>Your voice is turned into text to understand your question, then deleted.</li>
            <li>Document photos are read on this device and never stored or uploaded.</li>
            <li>Answers come only from official government documents. Each shows its source and the date it was last checked.</li>
            <li>Your history stays on this device. Nobody else can see it.</li>
          </ul>
          <Button
            variant="danger"
            icon={Trash2Icon}
            className="mt-5"
            onClick={() => {
              clearHistory();
              toast('History cleared from this device');
            }}>
            
            Clear history on this device
          </Button>
        </section>

        <section aria-labelledby="about-heading" className={sectionClass}>
          <h2 id="about-heading" className="text-title text-ink">
            About
          </h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              icon={PlayIcon}
              onClick={() => {
                resetOnboarding();
                navigate('/welcome');
              }}>
              
              Replay walkthrough
            </Button>
            <Link to="/components" className="inline-flex min-h-tap items-center justify-center gap-2 rounded-2xl px-5 text-body font-semibold text-navy hover:bg-navy-tint">
              <LayoutGridIcon className="h-5 w-5" aria-hidden="true" />
              Design system
            </Link>
          </div>
          <p className="mt-4 text-small text-muted">Version 2.4.0 · Content last updated 20 Sep 2026</p>
        </section>
      </div>
    </div>);

}