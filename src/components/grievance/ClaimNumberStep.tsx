import React, { useState } from 'react';
import { ArrowRightIcon, CircleAlertIcon } from 'lucide-react';
import { MicButton } from '../assistant/MicButton';
import { Button } from '../ui/Button';
import { useApp, useT } from '../../contexts/AppContext';

interface ClaimNumberStepProps {
  onNext: () => void;
}

export function ClaimNumberStep({ onNext }: ClaimNumberStepProps) {
  const { grievance, updateGrievance } = useApp();
  const t = useT();
  const [value, setValue] = useState(grievance.claimNumber);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);

  const submit = () => {
    const clean = value.trim().toUpperCase();
    if (clean.length < 6) {
      setError('This number looks too short. It usually looks like PMFBY-2026-TN-118402.');
      return;
    }
    updateGrievance({ claimNumber: clean });
    onNext();
  };

  const listen = () => {
    setError('');
    setListening(true);
    window.setTimeout(() => {
      setValue('PMFBY-2026-TN-118402');
      setListening(false);
    }, 1800);
  };

  return (
    <div>
      <label htmlFor="claim-number" className="block text-display text-ink">
        Do you have your claim or policy number?
      </label>
      <p className="mt-2 text-body text-muted">It’s printed on your insurance receipt or SMS. Say it slowly, or type it.</p>

      <div className="mt-6 flex items-center gap-4">
        <input
          id="claim-number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? 'claim-error' : 'claim-hint'}
          placeholder="PMFBY-2026-TN-…"
          className={`min-h-tap-lg w-full min-w-0 flex-1 rounded-2xl border-2 bg-paper px-4 text-title uppercase tracking-wide text-ink placeholder:normal-case placeholder:text-muted ${
          error ? 'border-danger' : 'border-line focus:border-navy'}`
          } />
        
        <MicButton size="md" state={listening ? 'listening' : 'idle'} label="Say the number" onClick={listen} />
      </div>
      <p id="claim-hint" aria-live="polite" className="mt-2 text-small text-muted">
        {listening ? 'Listening… say each letter and number clearly.' : 'Letters and numbers only. Spaces are fine.'}
      </p>
      {error &&
      <p id="claim-error" role="alert" className="mt-2 flex items-start gap-2 text-small font-semibold text-danger">
          <CircleAlertIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      }

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="brand" size="lg" iconRight={ArrowRightIcon} onClick={submit} disabled={listening}>
          {t('next')}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            updateGrievance({ claimNumber: '' });
            onNext();
          }}>
          
          I don’t have it
        </Button>
      </div>
    </div>);

}