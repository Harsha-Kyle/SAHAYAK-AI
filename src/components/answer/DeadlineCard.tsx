import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, BellRingIcon, CalendarClockIcon } from 'lucide-react';
import { useApp, useL, useT } from '../../contexts/AppContext';
import { Answer } from '../../types/app';
import { daysUntil, formatDate } from '../../utils/format';
import { Button } from '../ui/Button';

interface DeadlineCardProps {
  answer: Answer;
}

export function DeadlineCard({ answer }: DeadlineCardProps) {
  const { reminders } = useApp();
  const t = useT();
  const L = useL();
  const navigate = useNavigate();
  if (!answer.deadline) return null;
  const days = daysUntil(answer.deadline.date);
  const reminder = reminders[answer.id];

  return (
    <section aria-labelledby="deadline-heading" className="rounded-card border-2 border-saffron bg-saffron-tint p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron text-ink">
          <CalendarClockIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 id="deadline-heading" className="text-small text-ink">
            {L(answer.deadline.label)}
          </h2>
          <p className="text-title text-ink">{formatDate(answer.deadline.date)}</p>
          <p className="text-small font-semibold text-ink">{days} days left</p>
        </div>
      </div>
      {reminder ?
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-paper p-3">
          <span className="flex items-center gap-2 text-small font-semibold text-brand-dark">
            <BellRingIcon className="h-5 w-5" aria-hidden="true" />
            Reminder on · {reminder === 'sms' ? 'SMS' : 'Voice call'}
          </span>
          <Link to={`/reminder/${answer.id}`} className="text-small font-semibold text-navy underline underline-offset-4">
            Change
          </Link>
        </div> :

      <Button variant="brand" fullWidth icon={BellIcon} className="mt-4" onClick={() => navigate(`/reminder/${answer.id}`)}>
          {t('remindMe')}
        </Button>
      }
    </section>);

}