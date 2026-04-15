import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { BodyMetricsEntry } from '../../types';
import { todayISO } from '../../utils/helpers';

interface Props {
  onClose: () => void;
  existing?: BodyMetricsEntry;
}

export default function LogMetrics({ onClose, existing }: Props) {
  const { addMetrics, updateMetrics } = useStore();

  const [date, setDate] = useState(existing?.date ?? todayISO());
  const [weight, setWeight] = useState(existing?.weight?.toString() ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const handleSave = () => {
    if (!weight) return;
    const entry: Omit<BodyMetricsEntry, 'id'> = {
      date,
      weight: parseFloat(weight),
      notes: notes.trim() || undefined,
    };
    if (existing) {
      updateMetrics(existing.id, entry);
    } else {
      addMetrics(entry);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-slate-900 rounded-t-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-100">Log Weight</h2>
          <button onClick={onClose} className="text-slate-400 p-1 touch-manipulation">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-5 flex flex-col gap-4">
          <div>
            <label className="section-label block mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="section-label block mb-2">Body Weight</label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                placeholder="185.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field pr-12 text-2xl font-bold"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">lbs</span>
            </div>
          </div>

          <div>
            <label className="section-label block mb-2">Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. post-workout, morning weight..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!weight}
            className="btn-primary w-full disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
