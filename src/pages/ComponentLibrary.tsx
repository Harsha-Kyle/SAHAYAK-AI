import React, { useState } from 'react';
import { SendIcon, WheatIcon } from 'lucide-react';
import { AnswerCard } from '../components/assistant/AnswerCard';
import { ConfidenceBadge } from '../components/assistant/ConfidenceBadge';
import { ConfirmButtons } from '../components/assistant/ConfirmButtons';
import { ContextCue } from '../components/assistant/ContextCue';
import { FeedbackThumbs } from '../components/assistant/FeedbackThumbs';
import { ListenButton } from '../components/assistant/ListenButton';
import { MicButton } from '../components/assistant/MicButton';
import { ModuleTile } from '../components/assistant/ModuleTile';
import { Button } from '../components/ui/Button';
import { LanguagePill } from '../components/ui/LanguagePill';
import { ProgressDots } from '../components/ui/ProgressDots';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatusChip } from '../components/ui/StatusChip';
import { Toggle } from '../components/ui/Toggle';
import { answers } from '../data/answers';

const swatches = [
{ name: 'India Green', token: 'brand', hex: '#138808', className: 'bg-brand', role: 'Brand, headers, verified · ~50%' },
{ name: 'White', token: 'paper', hex: '#FFFFFF', className: 'bg-paper border-2 border-line', role: 'Surfaces, cards · ~30%' },
{ name: 'Saffron', token: 'saffron', hex: '#FF9933', className: 'bg-saffron', role: 'Primary CTA, mic · ~15%' },
{ name: 'Navy', token: 'navy', hex: '#000080', className: 'bg-navy', role: 'Links, icons, focus · ~5%' },
{ name: 'Surface', token: 'surface', hex: '#F5F5F5', className: 'bg-surface border-2 border-line', role: 'Page background' },
{ name: 'Muted', token: 'muted', hex: '#4A4A4A', className: 'bg-muted', role: 'Secondary text' },
{ name: 'Ink', token: 'ink', hex: '#1A1A1A', className: 'bg-ink', role: 'Body text' }];


const typeScale = [
{ token: 'text-display', size: '32px', sample: 'Namaste · नमस्ते · வணக்கம்' },
{ token: 'text-title', size: '24px', sample: 'PM-KISAN Samman Nidhi' },
{ token: 'text-body', size: '18px', sample: 'Income support of ₹6,000 a year for farmer families.' },
{ token: 'text-small', size: '16px', sample: 'Last verified: 12 Sep 2026' }];


function Section({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="text-title text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>);

}

function StateLabel({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-start gap-3">
      {children}
      <span className="text-small text-muted">{label}</span>
    </div>);

}

export function ComponentLibrary() {
  const [toggle, setToggle] = useState(true);
  const answer = answers[0];

  return (
    <div className="page-container max-w-5xl py-4">
      <ScreenHeader title="Design system" subtitle="Tokens and components used across Cooperative Sahayak" />

      <Section title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) =>
          <li key={s.token}>
              <span className={`block h-20 rounded-2xl ${s.className}`} aria-hidden="true" />
              <p className="mt-2 text-small font-semibold text-ink">{s.name}</p>
              <p className="text-small text-muted">
                {s.token} · {s.hex}
              </p>
              <p className="text-small text-muted">{s.role}</p>
            </li>
          )}
        </ul>
      </Section>

      <Section title="Type scale · Noto Sans">
        <ul className="space-y-4">
          {typeScale.map((row) =>
          <li key={row.token} className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline">
              <span className="text-small text-muted">
                {row.token} · {row.size}
              </span>
              <span className={`${row.token} text-ink`}>{row.sample}</span>
            </li>
          )}
        </ul>
      </Section>

      <Section title="Mic button">
        <div className="flex flex-wrap items-end gap-10">
          <StateLabel label="Default (pulsing)">
            <MicButton size="md" label="Idle" />
          </StateLabel>
          <StateLabel label="Listening">
            <MicButton size="md" state="listening" label="Listening" />
          </StateLabel>
          <StateLabel label="Loading">
            <MicButton size="md" state="loading" label="Loading" />
          </StateLabel>
          <StateLabel label="Disabled">
            <MicButton size="md" state="disabled" label="Disabled" />
          </StateLabel>
          <StateLabel label="Error">
            <MicButton size="md" state="error" label="Error" />
          </StateLabel>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-6">
          <StateLabel label="Default">
            <Button icon={SendIcon}>Submit</Button>
          </StateLabel>
          <StateLabel label="Pressed">
            <Button icon={SendIcon} className="scale-[0.98] bg-saffron-dark">
              Submit
            </Button>
          </StateLabel>
          <StateLabel label="Loading">
            <Button loading>Sending…</Button>
          </StateLabel>
          <StateLabel label="Disabled">
            <Button disabled>Submit</Button>
          </StateLabel>
          <StateLabel label="Error / destructive">
            <Button variant="danger">Clear history</Button>
          </StateLabel>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Section>

      <Section title="Module tile">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StateLabel label="Default">
            <ModuleTile icon={WheatIcon} label="Schemes" />
          </StateLabel>
          <StateLabel label="Pressed">
            <ModuleTile icon={WheatIcon} label="Schemes" className="scale-[0.97] !border-brand !bg-brand-tint" />
          </StateLabel>
          <StateLabel label="Loading">
            <ModuleTile icon={WheatIcon} label="Schemes" loading />
          </StateLabel>
          <StateLabel label="Disabled">
            <ModuleTile icon={WheatIcon} label="Schemes" sublabel="Needs internet" disabled />
          </StateLabel>
        </div>
      </Section>

      <Section title="Trust signals">
        <div className="flex flex-wrap items-center gap-4">
          <ConfidenceBadge confidence="verified" />
          <ConfidenceBadge confidence="partial" />
          <StatusChip status="online" />
          <StatusChip status="offline" />
          <StatusChip status="syncing" />
        </div>
        <div className="mt-5 max-w-md">
          <ContextCue title="PM-KISAN Samman Nidhi" />
        </div>
      </Section>

      <Section title="Confirmation">
        <div className="grid gap-6 md:grid-cols-3">
          <StateLabel label="Default">
            <ConfirmButtons className="w-full" onYes={() => undefined} onNo={() => undefined} />
          </StateLabel>
          <StateLabel label="Loading">
            <ConfirmButtons className="w-full" loading="yes" onYes={() => undefined} onNo={() => undefined} />
          </StateLabel>
          <StateLabel label="Disabled">
            <ConfirmButtons className="w-full" disabled onYes={() => undefined} onNo={() => undefined} />
          </StateLabel>
        </div>
      </Section>

      <Section title="Language, progress, toggles">
        <div className="flex flex-wrap items-center gap-6">
          <div className="rounded-2xl bg-brand p-3">
            <LanguagePill code="ta" />
          </div>
          <LanguagePill code="hi" selected />
          <LanguagePill code="en" disabled />
          <ProgressDots total={4} current={1} />
        </div>
        <div className="mt-5 max-w-md divide-y divide-line rounded-card bg-paper px-5 shadow-card">
          <Toggle checked={toggle} onChange={setToggle} label="Easy Mode" description="Interactive" />
          <Toggle checked={false} onChange={() => undefined} label="Disabled toggle" disabled />
        </div>
      </Section>

      <Section title="Listen & feedback">
        <div className="flex flex-wrap items-center gap-6">
          <ListenButton speaking={false} onToggle={() => undefined} />
          <ListenButton speaking onToggle={() => undefined} />
          <ListenButton speaking={false} disabled onToggle={() => undefined} />
        </div>
        <div className="mt-6 max-w-md rounded-card bg-paper p-5 shadow-card">
          <FeedbackThumbs />
        </div>
      </Section>

      <Section title="Answer card">
        <AnswerCard answer={answer} headingTag="h3" listen={<ListenButton speaking={false} onToggle={() => undefined} />} />
      </Section>
    </div>);

}