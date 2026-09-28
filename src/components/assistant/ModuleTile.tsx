import React from "react";
import { Loader2Icon, BoxIcon } from "lucide-react";
interface ModuleTileProps {
  icon: BoxIcon;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
export function ModuleTile({
  icon: Icon,
  label,
  sublabel,
  onClick,
  disabled = false,
  loading = false,
  className = ''
}: ModuleTileProps) {
  return <button type="button" onClick={onClick} disabled={disabled || loading} aria-busy={loading || undefined} className={`flex min-h-[9rem] w-full flex-col items-center justify-center gap-3 rounded-tile border-2 p-4 text-center transition-[transform,background-color,border-color] duration-150 ease-out ${disabled ? 'cursor-not-allowed border-line bg-surface' : 'border-line bg-paper hover:border-brand active:scale-[0.97] active:bg-brand-tint'} ${className}`}>
      <span className={`flex h-16 w-16 items-center justify-center rounded-full ${disabled ? 'bg-line text-muted' : 'bg-brand-tint text-brand'}`}>
        {loading ? <Loader2Icon className="h-8 w-8 animate-spin" aria-hidden="true" /> : <Icon className="h-8 w-8" aria-hidden="true" />}
      </span>
      <span className={`text-body font-semibold ${disabled ? 'text-muted' : 'text-ink'}`}>{label}</span>
      {sublabel && <span className="text-small text-muted">{sublabel}</span>}
    </button>;
}