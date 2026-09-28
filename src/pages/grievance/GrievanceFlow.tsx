import React, { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClaimNumberStep } from '../../components/grievance/ClaimNumberStep';
import { ConfirmProblemStep } from '../../components/grievance/ConfirmProblemStep';
import { DocumentsStep } from '../../components/grievance/DocumentsStep';
import { ProblemStep } from '../../components/grievance/ProblemStep';
import { ProgressDots } from '../../components/ui/ProgressDots';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useApp } from '../../contexts/AppContext';

const TOTAL_STEPS = 4;

export function GrievanceFlow() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { grievance, updateGrievance } = useApp();
  const step = Math.min(TOTAL_STEPS - 1, Math.max(0, Number(params.get('step') ?? 0)));
  const about = params.get('about');

  useEffect(() => {
    if (about && grievance.about !== about) updateGrievance({ about });
  }, [about, grievance.about, updateGrievance]);

  const go = useCallback(
    (next: number) => {
      setParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set('step', String(next));
        return p;
      });
    },
    [setParams]
  );

  const back = () => step > 0 ? go(step - 1) : navigate('/');

  return (
    <div className="page-container max-w-3xl py-4">
      <ScreenHeader title="New complaint" titleTag="p" onBack={back} right={<ProgressDots total={TOTAL_STEPS} current={step} />} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="mt-4">
          
          {step === 0 && <ProblemStep onNext={() => go(1)} />}
          {step === 1 && <ConfirmProblemStep onNext={() => go(2)} onBack={() => go(0)} />}
          {step === 2 && <ClaimNumberStep onNext={() => go(3)} />}
          {step === 3 && <DocumentsStep />}
        </motion.div>
      </AnimatePresence>
    </div>);

}