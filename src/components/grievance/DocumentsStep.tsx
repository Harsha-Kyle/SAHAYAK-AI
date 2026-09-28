import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraIcon, CircleCheckIcon, FileTextIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp, useL } from '../../contexts/AppContext';
import { grievanceProblems, requiredDocuments } from '../../data/grievance';

export function DocumentsStep() {
  const navigate = useNavigate();
  const { grievance } = useApp();
  const L = useL();
  const problem = grievanceProblems.find((p) => p.id === grievance.problemId);
  const docs = requiredDocuments.filter((d) => d.id !== 'policy' || problem?.needsPolicy !== false);

  return (
    <div>
      <h2 className="text-display text-ink">Add your documents</h2>
      <p className="mt-2 flex items-start gap-2 text-body text-muted">
        <ShieldCheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        Take a photo and I’ll read the details for you. Photos are not stored.
      </p>

      <ul className="mt-6 divide-y divide-line rounded-card bg-paper shadow-card">
        {docs.map((doc) => {
          const Icon = doc.icon;
          const added = grievance.documents.includes(doc.id);
          return (
            <li key={doc.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${added ? 'bg-brand text-white' : 'bg-navy-tint text-navy'}`}>
                {added ? <CircleCheckIcon className="h-6 w-6" aria-hidden="true" /> : <Icon className="h-6 w-6" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-ink">{L(doc.label)}</p>
                <p className={`text-small ${added ? 'text-brand-dark' : 'text-muted'}`}>{added ? 'Added and checked' : 'Not added yet'}</p>
              </div>
              <Button
                variant={added ? 'ghost' : 'outline'}
                icon={CameraIcon}
                onClick={() => navigate(`/grievance/capture?doc=${doc.id}`)}
                className="w-full sm:w-auto">
                
                {added ? 'Retake' : 'Take photo'}
              </Button>
            </li>);

        })}
      </ul>

      <Button variant="primary" size="lg" fullWidth className="mt-8" icon={FileTextIcon} onClick={() => navigate('/grievance/draft')}>
        Write my complaint
      </Button>
      <p className="mt-3 text-center text-small text-muted">You can continue without documents and add them at the office.</p>
    </div>);

}