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
  const [waist, setWaist] = useState(existing?.measurements?.waist?.toString() ?? '');
  const [chest, setChest] = useState(existing?.measurements?.chest?.toString() ?? '');
  const [leftArm, setLeftArm] = useState(existing?.measurements?.leftArm?.toString() ?? '');
  const [rightArm, setRightArm] = useState(existing?.measurements?.rightArm?.toString() ?? '');
  const [leftThigh, setLeftThigh] = useState(existing?.measurements?.leftThigh?.toString() ?? '');
  const [rightThigh, setRightThigh] = useState(existing?.measurements?.rightThigh?.toString() ?? '');

  // Weekly check-in
  const [sleepQuality, setSleepQuality] = useState(existing?.weeklyCheckIn?.sleepQuality ?? 3);
  const [stressLevel, setStressLevel] = useState(existing?.weeklyCheckIn?.stressLevel ?? 3);
  const [energyLevel, setEnergyLevel] = useState(existing?.weeklyCheckIn?.energyLevel ?? 3);
  const [checkInNotes, setCheckInNotes] = useState(existing?.weeklyCheckIn?.notes ?? '');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const handleSave = () => {
    const entry: Omit<BodyMetricsEntry, 'id'> = {
      date,
      weight: weight ? parseFloat(weight) : undefined,
      measurements: {
        waist: waist ? parseFloat(waist) : undefined,
        chest: chest ? parseFloat(chest) : undefined,
        leftArm: leftArm ? parseFloat(leftArm) : undefined,
        rightArm: rightArm ? parseFloat(rightArm) : undefined,
        leftThigh: leftThigh ? parseFloat(leftThigh) : undefined,
        rightThigh: rightThigh ? parseFloat(rightThigh) : undefined,
      },
      weeklyCheckIn: showCheckIn
        ? { sleepQuality, stressLevel, energyLevel, notes: checkInNotes }
        : undefined,
      notes: notes || undefined,
    };

    if (existing) {
      updateMetrics(existing.id, entry);
    } else {
      addMetrics(entry);
    }
    onClose();
  };

  const RatingButtons = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold touch-manipulation
              ${value === n ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-slate-900 rounded-t-3xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-100">Log Check-In</h2>
          <button onClick={onClose} className="text-slate-400 p-1 touch-manipulation">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 flex flex-col gap-5">
          {/* Date */}
          <div>
            <label className="section-label block mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="section-label block mb-2">Body Weight</label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                placeholder="185.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">lbs</span>
            </div>
          </div>

          {/* Measurements */}
          <div>
            <label className="section-label block mb-2">Measurements (inches, optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Waist', value: waist, set: setWaist },
                { label: 'Chest', value: chest, set: setChest },
                { label: 'Left Arm', value: leftArm, set: setLeftArm },
                { label: 'Right Arm', value: rightArm, set: setRightArm },
                { label: 'Left Thigh', value: leftThigh, set: setLeftThigh },
                { label: 'Right Thigh', value: rightThigh, set: setRightThigh },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Weekly check-in toggle */}
          <button
            onClick={() => setShowCheckIn((v) => !v)}
            className="flex items-center justify-between card active:bg-slate-800 touch-manipulation"
          >
            <span className="text-slate-100 font-medium">Weekly Check-In</span>
            <span className="text-slate-500 text-xs">{showCheckIn ? 'Hide ▲' : 'Add ▼'}</span>
          </button>

          {showCheckIn && (
            <div className="flex flex-col gap-4 card">
              <RatingButtons label="Sleep Quality" value={sleepQuality} onChange={setSleepQuality} />
              <RatingButtons label="Stress Level" value={stressLevel} onChange={setStressLevel} />
              <RatingButtons label="Energy Level" value={energyLevel} onChange={setEnergyLevel} />
              <div>
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <textarea
                  rows={3}
                  placeholder="How's life outside the gym? Sleep, stress, diet..."
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  className="input-field resize-none text-sm"
                />
              </div>
            </div>
          )}

          {/* General notes */}
          <div>
            <label className="section-label block mb-2">Notes</label>
            <textarea
              rows={2}
              placeholder="Anything else worth noting..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none text-sm"
            />
          </div>

          {/* Save button */}
          <button onClick={handleSave} className="btn-primary w-full">
            Save Check-In
          </button>
        </div>
      </div>
    </div>
  );
}
