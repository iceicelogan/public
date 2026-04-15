import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export default function Header({ title, subtitle, right }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-800/50">
      <div>
        <h1 className="text-xl font-bold text-slate-100 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}
