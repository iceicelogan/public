import React from 'react';
import { useStore } from '../../store/useStore';

type Page = 'dashboard' | 'workout' | 'metrics' | 'chat' | 'settings';

interface NavItem {
  page: Page;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-slate-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
  </svg>
);

const DumbbellIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 5v14M18 5v14M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12" />
  </svg>
);

const ChartIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18M6 20V10M12 20V4M18 20v-8" />
  </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-slate-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const GearIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { page: 'dashboard', label: 'Home', icon: (a) => <HomeIcon active={a} /> },
  { page: 'workout', label: 'Workout', icon: (a) => <DumbbellIcon active={a} /> },
  { page: 'metrics', label: 'Metrics', icon: (a) => <ChartIcon active={a} /> },
  { page: 'chat', label: 'Buddy', icon: (a) => <ChatIcon active={a} /> },
  { page: 'settings', label: 'Settings', icon: (a) => <GearIcon active={a} /> },
];

export default function BottomNav() {
  const { currentPage, navigate } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 safe-bottom z-50">
      <div className="flex">
        {NAV_ITEMS.map(({ page, label, icon }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => navigate(page)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 touch-manipulation"
              aria-label={label}
            >
              {icon(active)}
              <span className={`text-[10px] font-medium ${active ? 'text-orange-500' : 'text-slate-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
