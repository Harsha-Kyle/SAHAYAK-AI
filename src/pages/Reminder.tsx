import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { subDays } from 'date-fns';
import { BellRingIcon, CircleCheckIcon, CloudOffIcon, MessageSquareTextIcon, PhoneCallIcon, SearchXIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { Toggle } from '../components/ui/Toggle';
import { useApp, useL, useT } from '../contexts/AppContext';
import { profile } from '../data/profile';
import { formatDate } from '../utils/format';
import { getAnswer, getLanguage } from '../utils/lookup';

type Channel = 'sms' | 'call';
type SaveStatus = 'idle' | 'saving' | 'saved';

export function Reminder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reminders, setReminder, online, language } = useApp();
  const t = useT();
  const L = useL();
  const answer = getAnswer(id);
  const existing = id ? reminders[id] : undefined;
  const [enabled, setEnabled] = useState(true);
  const [channel, setChannel] = useState<Channel>(existing ?? 'sms');
  const [status, setStatus] = useState<SaveStatus>('idle');

  if (!answer || !answer.deadline) {
    return (
      <div className="page-container py-8">
        <OfflineState icon={SearchXIcon} title="No deadline to remind you about" body="This scheme doesn’t have a closing date right now." />
      </div>);

  }

  const deadline = new Date(answer.deadline.date);
  const firstReminder = formatDate(subDays(deadline, 7).toISOString());
  const secondReminder = formatDate(subDays(deadline, 1).toISOString());

  const save = () => {
    setStatus('saving');
    window.setTimeout(() => {
      setReminder(answer.id, enabled ? channel : null);
      setStatus('saved');
    }, 900);
  };

  if (status === 'saved') {
    const queued = !online;
    return (
      <div className="page-container max-w-2xl py-10">
        <section role="status" className="flex flex-col items-center rounded-card bg-paper p-8 text-center shadow-card">
          <span className={`flex h-20 w-20 items-center justify-center rounded-full ${queued ? 'bg-navy-tint text-navy' : 'bg-brand-tint text-brand'}`}>
            {queued ? <CloudOffIcon className="h-10 w-10" aria-hidden="true" /> : <CircleCheckIcon className="h-10 w-10" aria-hidden="true" />}
          </span>
          <h1 className="mt-5 text-display text-ink">{enabled ? queued ? 'Reminder saved' : 'Reminder set' : 'Reminder turned off'}</h1>
          {enabled &&
          <p className="mt-3 text-body text-ink">
              {queued ?
            'You’re offline. I’ll confirm by SMS as soon as you’re back online.' :
            `We’ll ${channel === 'sms' ? 'send an SMS' : 'call you'} on ${firstReminder} and ${secondReminder}. A confirmation SMS is on its way to ${profile.phone}.`}
            </p>
          }
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="brand" size="lg" onClick={() => navigate(`/answer/${answer.id}`, { replace: true })}>
              Back to answer
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              {t('navHome')}
            </Button>
          </div>
        </section>
      </div>);

  }

  const channelOption = (value: Channel, Icon: typeof PhoneCallIcon, title: string, desc: string) => {
    const selected = channel === value;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={!enabled}
        onClick={() => setChannel(value)}
        className={`flex min-h-[6rem] w-full items-center gap-4 rounded-card border-2 p-4 text-left transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:border-line disabled:bg-surface ${
        selected ? 'border-brand bg-brand-tint' : 'border-line bg-paper hover:border-navy'}`
        }>
        
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-brand text-white' : 'bg-navy-tint text-navy'}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-body font-semibold text-ink">{title}</span>
          <span className="block text-small text-muted">{desc}</span>
        </span>
      </button>);

  };

  return (
    <div className="page-container max-w-2xl py-4">
      <ScreenHeader title="Remind me before this closes" subtitle={L(answer.title)} />

      <section className="rounded-card bg-paper p-5 shadow-card">
        <div className="flex items-center gap-4 border-b border-line pb-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron text-ink">
            <BellRingIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-small text-muted">{L(answer.deadline.label)}</p>
            <p className="text-title text-ink">{formatDate(answer.deadline.date)}</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} label="Remind me" description={`7 days before (${firstReminder}) and 1 day before (${secondReminder})`} />
      </section>

      <section aria-labelledby="channel-heading" className="mt-6">
        <h2 id="channel-heading" className="text-body font-semibold text-ink">
          How should I remind you?
        </h2>
        <div role="radiogroup" aria-labelledby="channel-heading" className="mt-3 grid gap-3 sm:grid-cols-2">
          {channelOption('sms', MessageSquareTextIcon, 'SMS', `Text message to ${profile.phone}`)}
          {channelOption('call', PhoneCallIcon, 'Voice call', `An automatic call in ${getLanguage(language).nativeName}`)}
        </div>
      </section>

      {!online &&
      <p className="mt-4 flex items-center gap-2 text-small text-muted">
          <CloudOffIcon className="h-5 w-5 text-navy" aria-hidden="true" />
          You’re offline. I’ll save this and confirm when you’re connected.
        </p>
      }

      <Button variant="primary" size="lg" fullWidth className="mt-8" loading={status === 'saving'} onClick={save}>
        {status === 'saving' ? 'Saving…' : 'Confirm reminder'}
      </Button>
    </div>);

}