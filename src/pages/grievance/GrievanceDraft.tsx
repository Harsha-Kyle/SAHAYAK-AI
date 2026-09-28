import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckIcon, CircleCheckIcon, CloudOffIcon, DownloadIcon, ListChecksIcon, PencilIcon, SendIcon, SparklesIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ListenButton } from '../../components/assistant/ListenButton';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { Toggle } from '../../components/ui/Toggle';
import { useApp } from '../../contexts/AppContext';
import { grievanceProblems, grievanceReference, requiredDocuments } from '../../data/grievance';
import { profile } from '../../data/profile';
import { useSpeech } from '../../hooks/useSpeech';

type SubmitStatus = 'draft' | 'submitting' | 'submitted' | 'queued';

export function GrievanceDraft() {
  const navigate = useNavigate();
  const { grievance, updateGrievance, helperMode, online, addHistory, easyMode } = useApp();
  const { speaking, toggle } = useSpeech();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('draft');
  const [helperConfirmed, setHelperConfirmed] = useState(false);
  const problem = grievanceProblems.find((p) => p.id === grievance.problemId) ?? grievanceProblems[0];
  const problemText = grievance.problemText || problem.description;
  const requestedAction = grievance.requestedAction || problem.requestedAction;
  const docLabels = grievance.documents.map((id) => requiredDocuments.find((d) => d.id === id)?.label.en ?? id);
  const today = format(new Date(), 'd MMMM yyyy');

  const rows: {label: string;value: string;key?: 'problemText' | 'requestedAction';}[] = [
  { label: 'Subject', value: `${problem.label.en}${grievance.claimNumber ? ` — ${grievance.claimNumber}` : ''}` },
  { label: 'Applicant', value: `${profile.name}, ${profile.address} · Farmer ID ${profile.farmerId} · ${profile.phone}` },
  { label: 'Scheme', value: problem.scheme },
  { label: 'Problem', value: problemText, key: 'problemText' },
  { label: 'Documents attached', value: docLabels.length ? docLabels.join(', ') : 'None attached — will submit at the office' },
  { label: 'Requested action', value: requestedAction, key: 'requestedAction' }];


  const asText = () =>
  [`To: ${profile.grievanceOffice}`, `Date: ${today}`, '', ...rows.map((r) => `${r.label}: ${r.value}`), '', `Signed, ${profile.name}`].join('\n');

  const download = () => {
    const blob = new Blob([asText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-${profile.farmerId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Complaint downloaded');
  };

  const submit = () => {
    setStatus('submitting');
    window.setTimeout(() => {
      if (online) {
        setStatus('submitted');
        addHistory({
          id: `h-${grievanceReference}`,
          kind: 'grievance',
          module: 'grievance',
          title: { en: `Complaint: ${problem.label.en.toLowerCase()}` },
          short: 'Complaint',
          detail: `${grievanceReference} · Submitted`,
          date: new Date().toISOString(),
          to: `/status?id=${grievanceReference}`
        });
      } else {
        setStatus('queued');
      }
    }, 1200);
  };

  if (status === 'submitted' || status === 'queued') {
    const queued = status === 'queued';
    return (
      <div className="page-container max-w-2xl py-10">
        <section role="status" className="flex flex-col items-center rounded-card bg-paper p-8 text-center shadow-card">
          <span className={`flex h-20 w-20 items-center justify-center rounded-full ${queued ? 'bg-navy-tint text-navy' : 'bg-brand text-white'}`}>
            {queued ? <CloudOffIcon className="h-10 w-10" aria-hidden="true" /> : <CircleCheckIcon className="h-10 w-10" aria-hidden="true" />}
          </span>
          <h1 className="mt-5 text-display text-ink">{queued ? 'Saved on this device' : 'Complaint submitted'}</h1>
          {queued ?
          <p className="mt-3 text-body text-ink">You’re offline. Your complaint will be sent automatically when the internet is back. You’ll get an SMS then.</p> :

          <>
              <p className="mt-4 text-small text-muted">Your reference number</p>
              <p className="text-title tracking-wide text-ink">{grievanceReference}</p>
              <p className="mt-4 text-body text-ink">An SMS has been sent to {profile.phone}. Officers usually reply within 30 days.</p>
            </>
          }
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            {!queued &&
            <Button variant="brand" size="lg" icon={ListChecksIcon} onClick={() => navigate(`/status?id=${grievanceReference}`)}>
                Track status
              </Button>
            }
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              Home
            </Button>
          </div>
        </section>
      </div>);

  }

  return (
    <div className="page-container py-4">
      <ScreenHeader title="Check your complaint" subtitle="I wrote this from your answers. Change anything that’s wrong." onBack={() => navigate('/grievance?step=3')} />

      <div className={`grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[minmax(0,1fr)_20rem]'}`}>
        <article aria-label="Complaint letter" className="rounded-card bg-paper shadow-card">
          <header className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between md:p-6">
            <div>
              <p className="text-small text-muted">To</p>
              <p className="text-body font-semibold text-ink">{profile.grievanceOffice}</p>
              <p className="text-small text-muted">{today}</p>
            </div>
            <span className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-2 self-start whitespace-nowrap rounded-full bg-navy-tint px-3 text-small font-semibold text-navy">
              <SparklesIcon className="h-5 w-5" aria-hidden="true" />
              AI draft · please check
            </span>
          </header>
          <dl className="divide-y divide-line">
            {rows.map((row) =>
            <div key={row.label} className="grid gap-1 p-5 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6 md:p-6">
                <dt className="text-small font-semibold text-muted">{row.label}</dt>
                <dd className="text-body text-ink">
                  {editing && row.key ?
                <textarea
                  aria-label={row.label}
                  value={row.value}
                  rows={4}
                  onChange={(e) =>
                  updateGrievance(row.key === 'problemText' ? { problemText: e.target.value } : { requestedAction: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-navy bg-paper p-3 text-body text-ink" /> :


                row.value
                }
                </dd>
              </div>
            )}
          </dl>
          <footer className="border-t border-line p-5 text-body text-ink md:p-6">Signed, {profile.name}</footer>
        </article>

        <aside className="flex flex-col gap-3">
          <ListenButton fullWidth size="md" speaking={speaking} onToggle={() => toggle(asText().replace(/\n/g, '. '), 'en')} />
          <Button variant="outline" fullWidth icon={editing ? CheckIcon : PencilIcon} onClick={() => setEditing(!editing)}>
            {editing ? 'Save changes' : 'Edit'}
          </Button>
          <Button variant="outline" fullWidth icon={DownloadIcon} onClick={download}>
            Download
          </Button>

          <div className="mt-4 rounded-card bg-paper p-5 shadow-card">
            {helperMode &&
            <div className="mb-4 border-b border-line pb-2">
                <Toggle checked={helperConfirmed} onChange={setHelperConfirmed} label="The farmer has heard this and agrees" />
              </div>
            }
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={online ? SendIcon : CloudOffIcon}
              loading={status === 'submitting'}
              disabled={editing || helperMode && !helperConfirmed}
              onClick={submit}>
              
              {status === 'submitting' ? 'Sending…' : online ? 'Submit' : 'Send when online'}
            </Button>
            <p className="mt-3 text-small text-muted">Goes to the District Grievance Cell. You’ll get a reference number by SMS.</p>
          </div>
        </aside>
      </div>
    </div>);

}