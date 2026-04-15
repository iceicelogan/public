import React from 'react';
import { useStore } from '../../store/useStore';
import { TEMPLATE_GROUPS, WORKOUT_TEMPLATES } from '../../data/templates';
import { WorkoutTemplate } from '../../types';
import Header from '../layout/Header';

interface Props {
  onBack: () => void;
  onStart: () => void;
}

function TemplateCard({ template, onSelect }: { template: WorkoutTemplate; onSelect: () => void }) {
  const typeColors: Record<string, string> = {
    fullbody: 'bg-blue-500/10 text-blue-400',
    upper: 'bg-purple-500/10 text-purple-400',
    lower: 'bg-emerald-500/10 text-emerald-400',
    mixed: 'bg-orange-500/10 text-orange-400',
    cardio: 'bg-pink-500/10 text-pink-400',
  };

  return (
    <button
      onClick={onSelect}
      className="card w-full text-left active:bg-slate-800 touch-manipulation"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-slate-100 font-semibold">{template.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${typeColors[template.splitType]}`}>
          {template.splitType}
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-3">{template.description}</p>
      <div className="flex gap-4 text-xs text-slate-500">
        <span>{template.exercises.length} exercises</span>
        <span>{template.exercises.reduce((acc, e) => acc + e.sets, 0)} total sets</span>
      </div>
    </button>
  );
}

export default function TemplateSelector({ onBack, onStart }: Props) {
  const { startSession } = useStore();

  const handleTemplate = (template: WorkoutTemplate) => {
    startSession(template.id, template.name);
    onStart();
  };

  const handleBlank = () => {
    startSession(undefined, undefined);
    onStart();
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Choose Template"
        right={
          <button onClick={onBack} className="btn-ghost text-sm">
            Cancel
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-24 px-4 py-4 flex flex-col gap-6">
        {/* Blank workout */}
        <div>
          <p className="section-label mb-3">Custom</p>
          <button
            onClick={handleBlank}
            className="card w-full text-left flex items-center gap-3 active:bg-slate-800"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
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

        {/* Template groups */}
        {Object.entries(TEMPLATE_GROUPS).map(([groupName, templates]) => (
          <div key={groupName}>
            <p className="section-label mb-3">{groupName}</p>
            <div className="flex flex-col gap-2">
              {templates.map((t) => (
                <TemplateCard key={t.id} template={t} onSelect={() => handleTemplate(t)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
