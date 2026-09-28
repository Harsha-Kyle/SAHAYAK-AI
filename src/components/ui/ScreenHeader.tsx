import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { useT } from '../../contexts/AppContext';
import { useGoBack } from '../../hooks/useGoBack';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  titleTag?: 'h1' | 'p';
}

export function ScreenHeader({ title, subtitle, onBack, right, titleTag = 'h1' }: ScreenHeaderProps) {
  const t = useT();
  const goBack = useGoBack();
  const Title = titleTag;
  return (
    <div className="flex items-center gap-3 py-4">
      <button
        type="button"
        aria-label={t('back')}
        onClick={onBack ?? goBack}
        className="flex h-tap w-tap shrink-0 items-center justify-center rounded-full border-2 border-line bg-paper text-ink transition-[transform,background-color,border-color] duration-150 ease-out hover:border-navy active:scale-95 active:bg-navy-tint">
        
        <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <Title className={titleTag === 'h1' ? 'text-title text-ink' : 'text-body font-semibold text-ink'}>{title}</Title>
        {subtitle && <p className="text-small text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>);

}