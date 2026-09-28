import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3Icon, BotIcon, HistoryIcon, HouseIcon, BoxIcon } from "lucide-react";
import { useT } from "../../contexts/AppContext";

const itemBase = 'flex min-h-tap-lg w-full flex-col items-center justify-center gap-1 whitespace-nowrap px-1 py-2 text-small font-semibold transition-colors duration-150 ease-out';

function IconPill({
  icon: Icon,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  const activeBg = 'bg-brand-tint text-brand-dark';
  return (
    <span className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-150 ease-out ${active ? activeBg : ''}`}>
      <Icon className={`h-6 w-6 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} aria-hidden="true" />
    </span>
  );
}

export function BottomNav() {
  const t = useT();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${itemBase} ${isActive ? 'text-brand-dark font-bold' : 'text-muted hover:text-ink'}`;

  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-3xl grid-cols-4 kiosk:max-w-5xl">
        <li>
          <NavLink to="/" end className={linkClass}>
            {({ isActive }) => (
              <>
                <IconPill icon={HouseIcon} active={isActive} />
                {t('navHome')}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/chatbot" className={linkClass}>
            {({ isActive }) => (
              <>
                <IconPill icon={BotIcon} active={isActive} />
                {t('navChatbot')}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={linkClass}>
            {({ isActive }) => (
              <>
                <IconPill icon={HistoryIcon} active={isActive} />
                {t('navHistory')}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/data-overview" className={linkClass}>
            {({ isActive }) => (
              <>
                <IconPill icon={BarChart3Icon} active={isActive} />
                {t('navDataOverview')}
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}