import React from "react";
import { WifiOffIcon, BoxIcon } from "lucide-react";
interface OfflineStateProps {
  icon?: BoxIcon;
  title: string;
  body: string;
  children?: React.ReactNode;
}

/** Calm, neutral empty / offline / not-found state. Never error-red. */
export function OfflineState({
  icon: Icon = WifiOffIcon,
  title,
  body,
  children
}: OfflineStateProps) {
  return <section className="flex flex-col items-center rounded-card border-2 border-dashed border-line bg-paper px-6 py-10 text-center md:py-14">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-tint text-navy">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-title text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-body text-muted">{body}</p>
      {children && <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">{children}</div>}
    </section>;
}