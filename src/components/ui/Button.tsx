import React from "react";
import { Loader2Icon, BoxIcon } from "lucide-react";
export type ButtonVariant = 'primary' | 'brand' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: BoxIcon;
  iconRight?: BoxIcon;
  fullWidth?: boolean;
}
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-saffron text-ink hover:bg-saffron-dark active:bg-saffron-dark',
  brand: 'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark',
  outline: 'border-2 border-navy bg-paper text-navy hover:bg-navy-tint active:bg-navy-tint',
  ghost: 'text-navy hover:bg-navy-tint active:bg-navy-tint',
  danger: 'border-2 border-danger bg-paper text-danger hover:bg-danger-tint active:bg-danger-tint'
};
const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-tap px-5 text-body',
  lg: 'min-h-tap-lg px-6 text-body'
};

/** Shared class builder so links can look exactly like buttons. */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', fullWidth = false): string {
  return ['inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold', 'transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.98]', 'disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted disabled:active:scale-100', variantClasses[variant], sizeClasses[size], fullWidth ? 'w-full' : ''].join(' ');
}
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={`${buttonClasses(variant, size, fullWidth)} ${className}`} {...rest}>
      {loading ? <Loader2Icon className="h-5 w-5 animate-spin" aria-hidden="true" /> : Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
      {children}
      {IconRight && !loading && <IconRight className="h-5 w-5 shrink-0" aria-hidden="true" />}
    </button>;
}