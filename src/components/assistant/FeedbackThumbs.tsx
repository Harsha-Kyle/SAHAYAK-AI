import React, { useState } from 'react';
import { CheckIcon, Loader2Icon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useT } from '../../contexts/AppContext';

type FeedbackState = 'idle' | 'reason' | 'sending' | 'sent';

const reasons = ['Wrong information', 'Hard to understand', 'Not my question'];

interface FeedbackThumbsProps {
  className?: string;
}

export function FeedbackThumbs({ className = '' }: FeedbackThumbsProps) {
  const t = useT();
  const [state, setState] = useState<FeedbackState>('idle');

  const send = (message: string) => {
    setState('sending');
    window.setTimeout(() => {
      setState('sent');
      toast.success(message);
    }, 600);
  };

  const thumb =
  'flex h-tap w-tap items-center justify-center rounded-full border-2 border-line bg-paper text-ink transition-[transform,background-color,border-color] duration-150 ease-out hover:border-navy active:scale-95 active:bg-navy-tint disabled:cursor-not-allowed disabled:text-muted';

  if (state === 'sent') {
    return (
      <p role="status" className={`flex items-center gap-2 text-small font-semibold text-brand-dark ${className}`}>
        <CheckIcon className="h-5 w-5" aria-hidden="true" />
        Thanks — your feedback helps other farmers.
      </p>);

  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-body font-semibold text-ink">{t('wasHelpful')}</p>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Yes, this was helpful"
            className={thumb}
            disabled={state === 'sending'}
            onClick={() => send('Thank you! Glad it helped.')}>
            
            {state === 'sending' ?
            <Loader2Icon className="h-6 w-6 animate-spin" aria-hidden="true" /> :

            <ThumbsUpIcon className="h-6 w-6" aria-hidden="true" />
            }
          </button>
          <button
            type="button"
            aria-label="No, this was not helpful"
            aria-expanded={state === 'reason'}
            className={`${thumb} ${state === 'reason' ? 'border-navy bg-navy-tint' : ''}`}
            disabled={state === 'sending'}
            onClick={() => setState(state === 'reason' ? 'idle' : 'reason')}>
            
            <ThumbsDownIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      {state === 'reason' &&
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="What went wrong?">
          {reasons.map((reason) =>
        <button
          key={reason}
          type="button"
          onClick={() => send('Thanks. A reviewer will check this answer.')}
          className="min-h-tap rounded-full border-2 border-navy bg-paper px-4 text-small font-semibold text-navy transition-colors duration-150 ease-out hover:bg-navy-tint active:bg-navy-tint">
          
              {reason}
            </button>
        )}
        </div>
      }
    </div>);

}