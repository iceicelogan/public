import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import Header from '../layout/Header';

export default function SettingsPage() {
  const { profile, updateProfile } = useStore();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [startWeight, setStartWeight] = useState(profile.startWeight.toString());
  const [goalMin, setGoalMin] = useState(profile.goalWeightMin.toString());
  const [goalMax, setGoalMax] = useState(profile.goalWeightMax.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      name,
      age: parseInt(age) || 36,
      startWeight: parseFloat(startWeight) || 185,
      goalWeightMin: parseFloat(goalMin) || 170,
      goalWeightMax: parseFloat(goalMax) || 175,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('This will delete ALL your workout and metrics data. Are you absolutely sure?')) {
      if (window.confirm('Last chance — delete everything?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" />

      <div className="flex-1 overflow-y-auto pb-8 px-4 py-4 flex flex-col gap-6">
        {/* Profile */}
        <div>
          <p className="section-label mb-3">Your Profile</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Name (optional)</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Age</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Starting Weight (lbs)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Goal Min (lbs)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={goalMin}
                  onChange={(e) => setGoalMin(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Goal Max (lbs)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={goalMax}
                  onChange={(e) => setGoalMax(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Equipment info */}
        <div className="card">
          <p className="section-label mb-2">Your Equipment</p>
          <ul className="flex flex-col gap-1">
            {[
              'Treadmill',
              'Dumbbells (up to 40 lbs)',
              'Marcy Multi-Function Home Gym (150 lb stack)',
              '  — Cable chest press',
              '  — Lat pulldown (wide & narrow)',
              '  — High pulley / tricep pushdown',
              '  — Low pulley / seated cable row',
              '  — Pec deck / fly arms',
              '  — Leg extension & leg curl',
              '  — Ab crunch station',
            ].map((item) => (
              <li key={item} className="text-xs text-slate-500">{item}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-600 mt-3">
            Cable machine pin numbers: Pin 1 = 10 lbs, Pin 15 = 150 lbs.
          </p>
        </div>

        {/* Save */}
        <button onClick={handleSave} className={`btn-primary w-full ${saved ? 'bg-green-600' : ''}`}>
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>

        {/* App info */}
        <div className="card">
          <p className="section-label mb-2">About</p>
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <p>All data stored locally on this device.</p>
            <p>No account, no server, no tracking.</p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card border-red-900/40">
          <p className="section-label text-red-400 mb-2">Danger Zone</p>
          <button
            onClick={handleClearData}
            className="text-sm text-red-400 border border-red-500/30 rounded-xl py-2.5 px-4 w-full active:bg-red-500/10 touch-manipulation"
          >
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}
