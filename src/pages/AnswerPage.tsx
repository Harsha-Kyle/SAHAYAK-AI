import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArchiveIcon, HeadsetIcon, MegaphoneIcon, SearchXIcon, WifiOffIcon } from 'lucide-react';
import { AnswerCard } from '../components/assistant/AnswerCard';
import { ContextCue } from '../components/assistant/ContextCue';
import { FeedbackThumbs } from '../components/assistant/FeedbackThumbs';
import { ListenButton } from '../components/assistant/ListenButton';
import { AnswerSkeleton } from '../components/answer/AnswerSkeleton';
import { DeadlineCard } from '../components/answer/DeadlineCard';
import { FollowUpPanel } from '../components/answer/FollowUpPanel';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useApp, useL, useT } from '../contexts/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { formatDate } from '../utils/format';
import { getAnswer, getModule } from '../utils/lookup';
import { answerToSpeech } from '../utils/speech';

export function AnswerPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { online, easyMode, language, setLastAnswerId, addHistory, resetGrievance } = useApp();
  const t = useT();
  const L = useL();
  const { speaking, toggle } = useSpeech();
  const answer = getAnswer(id);
  const ctxAnswer = getAnswer(params.get('ctx'));
  const [loading, setLoading] = useState(true);
  const available = !!answer && (online || answer.cachedOffline);

  useEffect(() => {
    if (!answer || !available) return;
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), online ? 700 : 250);
    setLastAnswerId(answer.id);
    addHistory({
      id: `h-${answer.id}`,
      kind: 'answer',
      module: answer.module,
      title: answer.title,
      short: answer.short,
      date: new Date().toISOString(),
      to: `/answer/${answer.id}`
    });
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer?.id, available]);

  if (!answer) {
    return (
      <div className="page-container py-8">
        <OfflineState icon={SearchXIcon} title="Answer not found" body="This answer may have been removed or updated. Try asking again.">
          <Button variant="primary" onClick={() => navigate('/listen')}>
            {t('tryAgain')}
          </Button>
        </OfflineState>
      </div>);

  }

  const module = getModule(answer.module);

  if (!available) {
    return (
      <div className="page-container py-4">
        <ScreenHeader title={L(answer.title)} onBack={() => navigate('/')} />
        <OfflineState
          title="This answer isn’t saved on this device"
          body="Connect to the internet to get the latest verified answer. Phone helplines still work without internet.">
          
          <Button variant="brand" icon={HeadsetIcon} onClick={() => navigate('/help')}>
            {t('talkToHuman')}
          </Button>
          <Button variant="outline" icon={ArchiveIcon} onClick={() => navigate('/history')}>
            Saved answers
          </Button>
        </OfflineState>
      </div>);

  }

  return (
    <div className="page-container py-4">
      <ScreenHeader title={module ? L(module.label) : ''} titleTag="p" onBack={() => navigate('/')} />

      <div className={`grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[minmax(0,1fr)_22rem]'}`}>
        <div className="flex min-w-0 flex-col gap-4">
          {ctxAnswer && <ContextCue title={L(ctxAnswer.title)} />}
          {!online &&
          <div role="status" className="flex items-start gap-3 rounded-2xl border-2 border-muted bg-paper p-4">
              <WifiOffIcon className="mt-0.5 h-6 w-6 shrink-0 text-navy" aria-hidden="true" />
              <p className="text-small text-ink">
                <span className="font-semibold">{t('savedAnswer')}</span> · downloaded {answer.cachedOn ? formatDate(answer.cachedOn) : ''}. Rules may have
                changed since — check again when you’re online.
              </p>
            </div>
          }
          {loading ?
          <AnswerSkeleton /> :

          <AnswerCard
            answer={answer}
            listen={<ListenButton speaking={speaking} onToggle={() => toggle(answerToSpeech(answer, language))} />} />

          }
        </div>

        <aside className="flex flex-col gap-4" aria-label="Next steps">
          {answer.deadline && <DeadlineCard answer={answer} />}
          <FollowUpPanel answer={answer} />
          <section className="rounded-card bg-paper p-5 shadow-card">
            <Button
              variant="outline"
              fullWidth
              icon={MegaphoneIcon}
              onClick={() => {
                resetGrievance(answer.id);
                navigate(`/grievance?about=${answer.id}`);
              }}>
              
              {t('startGrievance')}
            </Button>
            <FeedbackThumbs className="mt-5 border-t border-line pt-5" />
          </section>
          <Link
            to="/help"
            className="flex min-h-tap items-center justify-center gap-2 rounded-2xl text-body font-semibold text-navy underline-offset-4 hover:underline">
            
            <HeadsetIcon className="h-5 w-5" aria-hidden="true" />
            {t('talkToHuman')}
          </Link>
        </aside>
      </div>
    </div>);

}