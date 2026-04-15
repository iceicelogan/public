import React from 'react';
import { useStore } from './store/useStore';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutPage from './components/workout/WorkoutPage';
import MetricsPage from './components/metrics/MetricsPage';
import SettingsPage from './components/settings/SettingsPage';

export default function App() {
  const { currentPage } = useStore();

  const pages: Record<typeof currentPage, React.ReactNode> = {
    dashboard: <Dashboard />,
    workout: <WorkoutPage />,
    metrics: <MetricsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-slate-950 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {pages[currentPage]}
      </div>
      <BottomNav />
    </div>
  );
}
