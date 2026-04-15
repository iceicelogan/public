import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import Header from '../layout/Header';
import WorkoutHistory from './WorkoutHistory';
import LogWorkout from './LogWorkout';
import TemplateSelector from './TemplateSelector';

type View = 'main' | 'log' | 'templates';

export default function WorkoutPage() {
  const { activeSession, pendingProgramGroup, openProgram } = useStore();
  const [view, setView] = useState<View>(activeSession ? 'log' : 'main');
  const [initialGroup, setInitialGroup] = useState<string | null>(null);

  // When arriving from dashboard with a pre-selected program, open directly to templates/day selector
  useEffect(() => {
    if (pendingProgramGroup) {
      setInitialGroup(pendingProgramGroup);
      setView('templates');
      openProgram(null); // clear so it doesn't re-trigger
    }
  }, [pendingProgramGroup, openProgram]);

  if (view === 'log' || activeSession) {
    return <LogWorkout onBack={() => setView('main')} />;
  }

  if (view === 'templates') {
    return (
      <TemplateSelector
        onBack={() => { setView('main'); setInitialGroup(null); }}
        onStart={() => setView('log')}
        initialGroup={initialGroup}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Workouts"
        right={
          <button
            onClick={() => { setInitialGroup(null); setView('templates'); }}
            className="btn-primary text-sm py-2 px-4"
          >
            + New
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto pb-24">
        <WorkoutHistory />
      </div>
    </div>
  );
}
