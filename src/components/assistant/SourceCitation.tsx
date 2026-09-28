import React from 'react';
import { FileTextIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';
import { Source } from '../../types/app';
import { formatDate } from '../../utils/format';

interface SourceCitationProps {
  source: Source;
}

export function SourceCitation({ source }: SourceCitationProps) {
  const t = useT();
  return (
    <footer className="mt-6 border-t border-line pt-5" aria-label={t('source')}>
      <div className="flex items-start gap-3">
        <FileTextIcon className="mt-1 h-6 w-6 shrink-0 text-navy" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-small text-muted">{t('source')}</p>
          <p className="text-body font-semibold text-ink">{source.document}</p>
          <p className="text-small text-ink">{source.section}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-muted">
        <span className="inline-flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('lastVerified')}: {formatDate(source.lastVerified)}
        </span>
        <span className="inline-flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-navy" aria-hidden="true" />
          {t('aiSummary')}
        </span>
      </div>
    </footer>);

}