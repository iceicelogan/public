import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TEMPLATE_GROUPS, TEMPLATE_GROUP_ORDER, WORKOUT_TEMPLATES } from '../../data/templates';
import { WorkoutTemplate, WorkoutSession } from '../../types';
import Header from '../layout/Header';

interface Props {
  onBack: () => void;
  onStart: () => void;
  initialGroup?: string | null;
}

const GROUP_DESCRIPTIONS: Record<string, string> = {
  '3-Day Full Body': 'Mon / Wed / Fri · ~45 min · Best for building the habit',
  '4-Day Upper/Lower': '4 days/week · ~50 min · More volume per muscle group',
};

function suggestNextTemplateId(groupName: string, sessions: WorkoutSession[]): string | null {
  const order = TEMPLATE_GROUP_ORDER[groupName];
  if (!order) return null;
  const groupIds = new Set(order);
  const last = sessions.find((s) => s.templateId && groupIds.has(s.templateId));
  if (!last || !last.templateId) return order[0];
  const idx = order.indexOf(last.templateId);
  return order[(idx + 1) % order.length];
}

function daysSince(dateISO: string): number {
  const now = new Date();
  const d = new Date(dateISO);
  return Math.floor((now.getTime() - d.getTime()) / 86400000);
}

function DayCard({
  template,
  isSuggested,
  lastSession,
  onSelect,
}: {
  template: WorkoutTemplate;
  isSuggested: boolean;
  lastSession?: WorkoutSession;
  onSelect: () => void;
}) {
  const typeColors: Record<string, string> = {
    fullbody: 'text-blue-400',
    upper: 'text-purple-400',
    lower: 'text-emerald-400',
    mixed: 'text-orange-400',
    cardio: 'text-pink-400',
  };

  return (
    <button
      onClick={onSelect}
      className={`card w-full text-left active:bg-slate-800 touch-manipulation relative ${
        isSuggested ? 'border-orange-500/50' : ''
      }`}
    >
      {isSuggested && (
        <span className="absolute top-3 right-3 text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
          Do this next
        </span>
      )}
      <div className="flex items-start gap-3 mb-2">
        <div className={`text-xs font-bold mt-0.5 ${typeColors[template.splitType]} shrink-0`}>
          {template.day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 font-semibold text-sm pr-20">{template.name}</p>
          <p className="text-slate-500 text-xs mt-0.5">{template.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {template.exercises.map((e) => (
          <span key={e.exerciseName} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {e.exerciseName}
          </span>
        ))}
      </div>
      <div className="flex gap-3 text-xs text-slate-600 mt-1">
        <span>{template.exercises.length} exercises</span>
        <span>{template.exercises.reduce((a, e) => a + e.sets, 0)} sets</span>
        {lastSession && (
          <span className="ml-auto">
            Last done {daysSince(lastSession.date) === 0 ? 'today' : `${daysSince(lastSession.date)}d ago`}
          </span>
        )}
      </div>
    </button>
  );
}

export default function TemplateSelector({ onBack, onStart, initialGroup }: Props) {
  const { startSession, sessions } = useStore();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(initialGroup ?? null);

  const suggestedIds = useMemo(() => {
    const result: Record<string, string | null> = {};
    for (const groupName of Object.keys(TEMPLATE_GROUPS)) {
      result[groupName] = suggestNextTemplateId(groupName, sessions);
    }
    return result;
  }, [sessions]);

  const lastSessionByTemplate = useMemo(() => {
    const map: Record<string, WorkoutSession> = {};
    for (const s of sessions) {
      if (s.templateId && !map[s.templateId]) {
        map[s.templateId] = s;
      }
    }
    return map;
  }, [sessions]);

  const handleTemplate = (template: WorkoutTemplate) => {
    startSession(template.id, template.name);
    onStart();
  };

  const handleBlank = () => {
    startSession(undefined, undefined);
    onStart();
  };

  // Day picker view
  if (selectedGroup) {
    const templates = TEMPLATE_GROUPS[selectedGroup] ?? [];
    const suggestedId = suggestedIds[selectedGroup];

    return (
      <div className="flex flex-col h-full">
        <Header
          title={selectedGroup}
          right={
            <button onClick={() => setSelectedGroup(null)} className="btn-ghost text-sm">
              Back
            </button>
          }
        />
        <div className="flex-1 overflow-y-auto pb-8 px-4 py-4 flex flex-col gap-3">
          <p className="text-xs text-slate-500">Pick which day to do today</p>
          {templates.map((t) => (
            <DayCard
              key={t.id}
              template={t}
              isSuggested={t.id === suggestedId}
              lastSession={lastSessionByTemplate[t.id]}
              onSelect={() => handleTemplate(t)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Program picker view
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Choose Workout"
        right={
          <button onClick={onBack} className="btn-ghost text-sm">
            Cancel
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto pb-8 px-4 py-4 flex flex-col gap-4">
        {/* Programs */}
        <div>
          <p className="section-label mb-3">Programs</p>
          <div className="flex flex-col gap-3">
            {Object.keys(TEMPLATE_GROUPS).map((groupName) => {
              const templates = TEMPLATE_GROUPS[groupName];
              const suggestedId = suggestedIds[groupName];
              const suggested = WORKOUT_TEMPLATES.find((t) => t.id === suggestedId);
              return (
                <button
                  key={groupName}
                  onClick={() => setSelectedGroup(groupName)}
                  className="card w-full text-left active:bg-slate-800 touch-manipulation"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-slate-100 font-semibold">{groupName}</p>
                    <span className="text-xs text-slate-500 shrink-0">{templates.length} days</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{GROUP_DESCRIPTIONS[groupName]}</p>
                  {suggested && (
                    <div className="flex items-center gap-2 bg-orange-500/10 rounded-xl px-3 py-2">
                      <span className="text-orange-400 text-xs font-semibold">Up next:</span>
                      <span className="text-slate-300 text-xs">{suggested.name}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blank */}
        <div>
          <p className="section-label mb-3">Custom</p>
          <button
            onClick={handleBlank}
            className="card w-full text-left flex items-center gap-3 active:bg-slate-800 touch-manipulation"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-slate-100 font-semibold">Blank Workout</p>
              <p className="text-slate-500 text-xs">Build your own from scratch</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
