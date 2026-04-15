import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { WorkoutSession } from '../../types';
import { formatDate, sessionDurationMinutes, stalledExercises } from '../../utils/helpers';

function SessionCard({ session, onDelete }: { session: WorkoutSession; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const duration = sessionDurationMinutes(session);

  return (
    <div className="card">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left touch-manipulation"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-100 font-semibold">
                {session.templateName ?? 'Custom Workout'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                ${session.type === 'cardio' ? 'bg-pink-500/10 text-pink-400' :
                  session.type === 'mixed' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-blue-500/10 text-blue-400'}`}>
                {session.type}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              {formatDate(session.date)}
              {duration ? ` · ${duration}m` : ''}
              {' · '}{session.exercises.length} exercises
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          {/* Exercises */}
          <div className="flex flex-col gap-3">
            {session.exercises.map((ex) => {
              const completedSets = ex.sets.filter((s) => s.completed);
              return (
                <div key={ex.id}>
                  <p className="text-sm font-medium text-slate-300">{ex.exerciseName}</p>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {completedSets.map((set, i) => (
                      <p key={set.id} className="text-xs text-slate-500">
                        Set {i + 1}:
                        {set.weight && set.reps ? ` ${set.weight}lbs × ${set.reps}` : ''}
                        {set.duration ? ` ${Math.round(set.duration / 60)}min` : ''}
                        {set.distance ? ` · ${set.distance}mi` : ''}
                        {set.incline ? ` · ${set.incline}% inc` : ''}
                      </p>
                    ))}
                    {completedSets.length === 0 && (
                      <p className="text-xs text-slate-600">No completed sets</p>
                    )}
                  </div>
                </div>
              );
            })}

            {session.notes && (
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-500 italic">"{session.notes}"</p>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this workout?')) onDelete();
              }}
              className="text-xs text-red-400 active:text-red-300 text-left pt-1 touch-manipulation"
            >
              Delete workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutHistory() {
  const { sessions, deleteSession } = useStore();

  const stalled = stalledExercises(sessions);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
        <div className="text-5xl">🏋️</div>
        <p className="text-slate-100 font-semibold text-lg">No workouts yet</p>
        <p className="text-slate-500 text-sm">Tap + New to start your first session</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {/* Stall warnings */}
      {stalled.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3">
          <p className="text-yellow-400 text-xs font-semibold mb-1">No progress in 14+ days:</p>
          <p className="text-yellow-300/80 text-xs">{stalled.join(', ')}</p>
          <p className="text-yellow-400/60 text-[10px] mt-1">
            Consider adding weight, reps, or switching variation.
          </p>
        </div>
      )}

      {/* Session list */}
      <div className="flex flex-col gap-2">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={() => deleteSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
