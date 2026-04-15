import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import Header from '../layout/Header';
import WorkoutHistory from './WorkoutHistory';
import LogWorkout from './LogWorkout';
import TemplateSelector from './TemplateSelector';

type View = 'main' | 'log' | 'templates';

export default function WorkoutPage() {
  const { activeSession } = useStore();
  const [view, setView] = useState<View>(activeSession ? 'log' : 'main');

  if (view === 'log' || activeSession) {
    return <LogWorkout onBack={() => setView('main')} />;
  }

  if (view === 'templates') {
    return <TemplateSelector onBack={() => setView('main')} onStart={() => setView('log')} />;
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Workouts"
        right={
          <button
            onClick={() => setView('templates')}
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
