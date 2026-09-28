import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CameraIcon, CameraOffIcon, CheckIcon, Loader2Icon, PencilIcon, ScanTextIcon, ShieldCheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmButtons } from '../../components/assistant/ConfirmButtons';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useApp, useL } from '../../contexts/AppContext';
import { ocrSamples, requiredDocuments } from '../../data/grievance';
import { DocumentId, OcrField } from '../../types/app';

type CameraState = 'starting' | 'live' | 'simulated' | 'error';
type Phase = 'capture' | 'reading' | 'review';

export function DocumentCapture() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { grievance, updateGrievance } = useApp();
  const L = useL();
  const docId = params.get('doc') as DocumentId ?? 'passbook';
  const doc = requiredDocuments.find((d) => d.id === docId) ?? requiredDocuments[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const simulatedRef = useRef(false);
  const [camera, setCamera] = useState<CameraState>('starting');
  const [phase, setPhase] = useState<Phase>('capture');
  const [attempt, setAttempt] = useState(0);
  const [fields, setFields] = useState<OcrField[]>(ocrSamples[doc.id]);
  const [editing, setEditing] = useState<number | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (phase !== 'capture' || simulatedRef.current) return;
    let cancelled = false;
    setCamera('starting');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera('error');
      return;
    }
    navigator.mediaDevices.
    getUserMedia({ video: { facingMode: 'environment' }, audio: false }).
    then((stream) => {
      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      setCamera('live');
    }).
    catch(() => {
      if (!cancelled) setCamera('error');
    });
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [attempt, phase, stopStream]);

  useEffect(() => {
    if (camera === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [camera]);

  const chooseSample = () => {
    simulatedRef.current = true;
    setCamera('simulated');
  };

  const capture = () => {
    stopStream();
    setPhase('reading');
    window.setTimeout(() => setPhase('review'), 1600);
  };

  const retake = () => {
    setEditing(null);
    setFields(ocrSamples[doc.id]);
    setPhase('capture');
    if (simulatedRef.current) setCamera('simulated');else
    setAttempt((a) => a + 1);
  };

  const confirm = () => {
    const documents = grievance.documents.includes(doc.id) ? grievance.documents : [...grievance.documents, doc.id];
    updateGrievance({ documents });
    toast.success(`${doc.label.en} added`);
    navigate('/grievance?step=3', { replace: true });
  };

  const trustBanner =
  <div className="flex items-center justify-center gap-3 bg-brand px-4 py-3 text-white">
      <ShieldCheckIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-small font-semibold">Processed securely on this device — your photo is not stored.</p>
    </div>;


  if (phase === 'review') {
    return (
      <div className="min-h-screen w-full bg-surface">
        {trustBanner}
        <div className="page-container max-w-2xl py-4">
          <ScreenHeader title="Check these details" subtitle={`Read from your ${doc.label.en.toLowerCase()}`} onBack={retake} />
          <ul className="divide-y divide-line rounded-card bg-paper shadow-card">
            {fields.map((field, i) =>
            <li key={field.label} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <label htmlFor={`field-${i}`} className="text-small text-muted">
                    {field.label}
                  </label>
                  {editing === i ?
                <input
                  id={`field-${i}`}
                  autoFocus
                  value={field.value}
                  onChange={(e) => setFields(fields.map((f, j) => j === i ? { ...f, value: e.target.value } : f))}
                  className="mt-1 min-h-tap w-full rounded-xl border-2 border-navy bg-paper px-3 text-body text-ink" /> :


                <p id={`field-${i}`} className="text-title text-ink">
                      {field.value}
                    </p>
                }
                </div>
                <button
                type="button"
                onClick={() => setEditing(editing === i ? null : i)}
                aria-label={editing === i ? `Save ${field.label}` : `Edit ${field.label}`}
                className={`flex h-tap w-tap shrink-0 items-center justify-center rounded-full border-2 transition-[transform,background-color] duration-150 ease-out active:scale-95 ${
                editing === i ? 'border-brand bg-brand text-white' : 'border-line bg-paper text-navy hover:border-navy'}`
                }>
                
                  {editing === i ? <CheckIcon className="h-6 w-6" aria-hidden="true" /> : <PencilIcon className="h-5 w-5" aria-hidden="true" />}
                </button>
              </li>
            )}
          </ul>
          <p className="mt-3 flex items-center gap-2 text-small text-muted">
            <ScanTextIcon className="h-5 w-5 text-navy" aria-hidden="true" />
            Read automatically. Please check each line — tap the pencil to fix a mistake.
          </p>
          <ConfirmButtons className="mt-6" yesLabel="All correct" noLabel="Retake" onYes={confirm} onNo={retake} />
        </div>
      </div>);

  }

  const canShoot = camera === 'live' || camera === 'simulated';

  return (
    <div className="fixed inset-0 flex flex-col bg-ink text-white">
      {trustBanner}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('/grievance?step=3', { replace: true })}
          aria-label="Cancel"
          className="flex h-tap w-tap items-center justify-center rounded-full border-2 border-paper">
          
          <XIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <h1 className="text-body font-semibold">{L(doc.label)}</h1>
        <span className="w-tap" aria-hidden="true" />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 h-full w-full object-cover ${camera === 'live' ? '' : 'hidden'}`} />

        {camera === 'simulated' &&
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-muted p-12">
            <div className="w-full max-w-sm rotate-[-2deg] rounded-xl bg-paper p-6 shadow-raised">
              <span className="block h-5 w-2/3 rounded bg-navy" />
              <span className="mt-6 block h-3 w-full rounded bg-line" />
              <span className="mt-3 block h-3 w-5/6 rounded bg-line" />
              <span className="mt-3 block h-3 w-4/6 rounded bg-line" />
              <span className="mt-6 block h-3 w-1/2 rounded bg-line" />
            </div>
          </div>
        }

        {camera === 'starting' &&
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2Icon className="h-10 w-10 animate-spin" aria-hidden="true" />
            <p className="text-body">Opening camera…</p>
          </div>
        }

        {camera === 'error' &&
        <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-card bg-paper p-6 text-center text-ink">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-tint text-navy">
                <CameraOffIcon className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-title">Camera is not available</h2>
              <p className="mt-2 text-body text-muted">Allow camera access in your browser settings, or use a sample document to continue this demo.</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button variant="brand" onClick={() => setAttempt((a) => a + 1)}>
                  Try again
                </Button>
                <Button variant="outline" onClick={chooseSample}>
                  Use sample document
                </Button>
              </div>
            </div>
          </div>
        }

        {canShoot &&
        <div className="pointer-events-none absolute inset-6 flex flex-col items-center justify-end rounded-3xl border-4 border-saffron pb-4 md:inset-12">
            <p className="rounded-full bg-ink px-4 py-2 text-small font-semibold">Fit the whole page inside the frame</p>
          </div>
        }

        {phase === 'reading' &&
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/80">
            <ScanTextIcon className="h-14 w-14 text-saffron" aria-hidden="true" />
            <p className="text-title">Reading your document…</p>
          </div>
        }
      </div>

      <div className="flex items-center justify-center py-6">
        <button
          type="button"
          onClick={capture}
          disabled={!canShoot || phase !== 'capture'}
          aria-label="Take photo"
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-paper bg-saffron text-ink transition-[transform,background-color] duration-150 ease-out active:scale-95 disabled:bg-muted disabled:text-paper">
          
          <CameraIcon className="h-9 w-9" aria-hidden="true" />
        </button>
      </div>
    </div>);

}