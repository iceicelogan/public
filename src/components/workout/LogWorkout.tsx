import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { WORKOUT_TEMPLATES, EXERCISE_LIST } from '../../data/templates';
import { ExerciseLog, SetLog, ExerciseCategory } from '../../types';
import { genId, fmtDuration } from '../../utils/helpers';

interface Props {
  onBack: () => void;
}

function SetRow({
  set,
  isCardio,
  onChange,
  onRemove,
}: {
  set: SetLog;
  isCardio: boolean;
  onChange: (updates: Partial<SetLog>) => void;
  onRemove: () => void;
}) {
  return (
    <div className={`flex items-center gap-2 py-1 ${set.completed ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onChange({ completed: !set.completed })}
        className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border-2 touch-manipulation
          ${set.completed ? 'bg-orange-500 border-orange-500' : 'border-slate-600'}`}
      >
        {set.completed && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {isCardio ? (
        <>
          <input
            type="number"
            inputMode="decimal"
            placeholder="dist (mi)"
            value={set.distance ?? ''}
            onChange={(e) => onChange({ distance: parseFloat(e.target.value) || undefined })}
            className="input-field w-24 text-center text-sm py-2"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="inc %"
            value={set.incline ?? ''}
            onChange={(e) => onChange({ incline: parseFloat(e.target.value) || undefined })}
            className="input-field w-16 text-center text-sm py-2"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="min"
            value={set.duration ? Math.round(set.duration / 60) : ''}
            onChange={(e) => {
              const mins = parseFloat(e.target.value) || undefined;
              onChange({ duration: mins ? mins * 60 : undefined });
            }}
            className="input-field w-16 text-center text-sm py-2"
          />
        </>
      ) : (
        <>
          <input
            type="number"
            inputMode="decimal"
            placeholder="lbs"
            value={set.weight ?? ''}
            onChange={(e) => onChange({ weight: parseFloat(e.target.value) || undefined })}
            className="input-field flex-1 text-center text-sm py-2"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="reps"
            value={set.reps ?? ''}
            onChange={(e) => onChange({ reps: parseInt(e.target.value) || undefined })}
            className="input-field flex-1 text-center text-sm py-2"
          />
        </>
      )}

      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-600 active:text-red-400 touch-manipulation"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function ExerciseCard({
  exercise,
  onUpdate,
  onRemove,
}: {
  exercise: ExerciseLog;
  onUpdate: (updates: Partial<ExerciseLog>) => void;
  onRemove: () => void;
}) {
  const isCardio = exercise.category === 'cardio';
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: SetLog = {
      id: genId(),
      completed: false,
      weight: lastSet?.weight,
      reps: lastSet?.reps,
      duration: lastSet?.duration,
      distance: lastSet?.distance,
      incline: lastSet?.incline,
    };
    onUpdate({ sets: [...exercise.sets, newSet] });
  };

  const updateSet = (setId: string, updates: Partial<SetLog>) => {
    onUpdate({
      sets: exercise.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
    });
  };

  const removeSet = (setId: string) => {
    onUpdate({ sets: exercise.sets.filter((s) => s.id !== setId) });
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-100 font-semibold truncate">{exercise.exerciseName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedSets}/{exercise.sets.length} sets done
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-600 active:text-red-400 p-1 touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Column headers */}
      {exercise.sets.length > 0 && (
        <div className={`flex items-center gap-2 mb-1 px-1 ${isCardio ? 'justify-start' : ''}`}>
          <div className="w-8 flex-shrink-0" />
          {isCardio ? (
            <>
              <span className="text-[10px] text-slate-600 w-24 text-center">distance</span>
              <span className="text-[10px] text-slate-600 w-16 text-center">incline</span>
              <span className="text-[10px] text-slate-600 w-16 text-center">minutes</span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-slate-600 flex-1 text-center">weight</span>
              <span className="text-[10px] text-slate-600 flex-1 text-center">reps</span>
            </>
          )}
          <div className="w-8 flex-shrink-0" />
        </div>
      )}

      {/* Sets */}
      <div className="flex flex-col gap-1">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            isCardio={isCardio}
            onChange={(updates) => updateSet(set.id, updates)}
            onRemove={() => removeSet(set.id)}
          />
        ))}
      </div>

      <button
        onClick={addSet}
        className="mt-3 w-full py-2 text-sm text-orange-500 border border-dashed border-orange-500/30 rounded-xl active:bg-orange-500/10 touch-manipulation"
      >
        + Add set
      </button>

      {/* Notes */}
      <input
        type="text"
        placeholder="Notes (optional)"
        value={exercise.notes ?? ''}
        onChange={(e) => onUpdate({ notes: e.target.value })}
        className="mt-2 input-field text-sm py-2 text-slate-400"
      />
    </div>
  );
}

// ─── Exercise picker modal ────────────────────────────────────────────────────

function ExercisePicker({ onSelect, onClose }: { onSelect: (name: string, category: ExerciseCategory) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');

  const filtered = EXERCISE_LIST.filter((e) => e.toLowerCase().includes(search.toLowerCase()));

  const getCategory = (name: string): ExerciseCategory => {
    if (name === 'Treadmill') return 'cardio';
    if (name.startsWith('Dumbbell') || name.includes('Row') && !name.includes('Cable')) return 'dumbbell';
    if (name.startsWith('Dumbbell')) return 'dumbbell';
    return 'cable';
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-slate-900 rounded-t-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-100">Add Exercise</h3>
            <button onClick={onClose} className="text-slate-400 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            autoFocus
          />
        </div>

        <div className="overflow-y-auto pb-8">
          {filtered.map((name) => {
            const cat = getCategory(name);
            const catColors: Record<ExerciseCategory, string> = {
              cable: 'bg-blue-500/10 text-blue-400',
              dumbbell: 'bg-purple-500/10 text-purple-400',
              cardio: 'bg-pink-500/10 text-pink-400',
              bodyweight: 'bg-green-500/10 text-green-400',
            };
            return (
              <button
                key={name}
                onClick={() => onSelect(name, cat)}
                className="w-full flex items-center justify-between px-4 py-3 active:bg-slate-800 touch-manipulation"
              >
                <span className="text-slate-100">{name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${catColors[cat]}`}>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main LogWorkout component ────────────────────────────────────────────────

export default function LogWorkout({ onBack }: Props) {
  const { activeSession, updateActiveSession, finishSession, discardSession } = useStore();
  const [showPicker, setShowPicker] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load template exercises on mount
  useEffect(() => {
    if (activeSession && activeSession.exercises.length === 0 && activeSession.templateId) {
      const template = WORKOUT_TEMPLATES.find((t) => t.id === activeSession.templateId);
      if (template) {
        const exercises: ExerciseLog[] = template.exercises.map((te) => ({
          id: genId(),
          exerciseName: te.exerciseName,
          category: te.category,
          sets: Array.from({ length: te.sets }, () => ({
            id: genId(),
            completed: false,
            weight: te.setConfig.weight,
            reps: te.setConfig.reps ? te.setConfig.reps[0] : undefined,
            duration: te.setConfig.duration,
            distance: te.setConfig.distance,
            incline: te.setConfig.incline,
          })),
          notes: te.notes,
        }));
        updateActiveSession({ exercises, type: template.splitType === 'cardio' ? 'cardio' : template.splitType === 'lower' || template.splitType === 'upper' ? 'strength' : 'strength' });
      }
    }
  }, []);

  // Elapsed timer
  useEffect(() => {
    if (activeSession?.startTime) {
      const updateElapsed = () => {
        const start = new Date(activeSession.startTime).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      };
      updateElapsed();
      timerRef.current = setInterval(updateElapsed, 10000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession?.startTime]);

  if (!activeSession) {
    onBack();
    return null;
  }

  const updateExercise = (exId: string, updates: Partial<ExerciseLog>) => {
    updateActiveSession({
      exercises: activeSession.exercises.map((e) =>
        e.id === exId ? { ...e, ...updates } : e
      ),
    });
  };

  const removeExercise = (exId: string) => {
    updateActiveSession({
      exercises: activeSession.exercises.filter((e) => e.id !== exId),
    });
  };

  const addExercise = (name: string, category: ExerciseCategory) => {
    const newEx: ExerciseLog = {
      id: genId(),
      exerciseName: name,
      category,
      sets: [{ id: genId(), completed: false }],
    };
    updateActiveSession({ exercises: [...activeSession.exercises, newEx] });
    setShowPicker(false);
  };

  const handleFinish = () => {
    finishSession();
    onBack();
  };

  const handleDiscard = () => {
    if (window.confirm('Discard this workout? All data will be lost.')) {
      discardSession();
      onBack();
    }
  };

  const completedSets = activeSession.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 bg-slate-950 border-b border-slate-800 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-base font-bold text-slate-100 leading-tight">
              {activeSession.templateName ?? 'Custom Workout'}
            </h1>
            <p className="text-xs text-slate-500">
              {fmtDuration(elapsed)} · {completedSets}/{totalSets} sets
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDiscard} className="btn-ghost text-sm text-red-400">
              Discard
            </button>
            <button onClick={handleFinish} className="btn-primary text-sm py-2 px-4">
              Finish
            </button>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="flex-1 overflow-y-auto pb-32 px-4 py-4 flex flex-col gap-3">
        {activeSession.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onUpdate={(updates) => updateExercise(ex.id, updates)}
            onRemove={() => removeExercise(ex.id)}
          />
        ))}

        <button
          onClick={() => setShowPicker(true)}
          className="card flex items-center justify-center gap-2 py-5 text-orange-500 border-dashed border-orange-500/30 active:bg-slate-800 touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-semibold">Add Exercise</span>
        </button>

        {/* Session notes */}
        <div className="card">
          <label className="section-label block mb-2">Session Notes</label>
          <textarea
            rows={3}
            placeholder="Energy level, soreness, how it felt..."
            value={activeSession.notes}
            onChange={(e) => updateActiveSession({ notes: e.target.value })}
            className="input-field resize-none text-sm"
          />
        </div>
      </div>

      {showPicker && (
        <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}
