import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import Header from '../layout/Header';
import LogMetrics from './LogMetrics';
import MetricsChart from './MetricsChart';
import { formatDate, isWithinDays } from '../../utils/helpers';
import { BodyMetricsEntry } from '../../types';

type Window = 30 | 60 | 90;

function EntryCard({ entry, onDelete }: { entry: BodyMetricsEntry; onDelete: () => void }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-slate-100 font-semibold">
          {entry.weight ? `${entry.weight} lbs` : '—'}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">
          {formatDate(entry.date)}
          {entry.notes ? ` · ${entry.notes}` : ''}
        </p>
      </div>
      <button
        onClick={() => { if (window.confirm('Delete?')) onDelete(); }}
        className="text-slate-700 active:text-red-400 p-2 touch-manipulation"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export default function MetricsPage() {
  const { metrics, profile, deleteMetrics } = useStore();
  const [showLog, setShowLog] = useState(false);
  const [chartWindow, setChartWindow] = useState<Window>(30);

  const sortedMetrics = [...metrics].sort((a, b) => b.date.localeCompare(a.date));

  const latestWeight = sortedMetrics.find((m) => m.weight)?.weight;
  const twoWeeksAgoWeight = [...metrics]
    .filter((m) => m.weight && !isWithinDays(m.date, 13) && isWithinDays(m.date, 20))
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.weight;

  const weightChange = latestWeight && twoWeeksAgoWeight
    ? (latestWeight - twoWeeksAgoWeight).toFixed(1)
    : null;

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Body Metrics"
        right={
          <button onClick={() => setShowLog(true)} className="btn-primary text-sm py-2 px-4">
            + Log
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-24 px-4 py-4 flex flex-col gap-4">
        {/* Current stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="card text-center">
            <div className="text-xl font-bold text-slate-100">
              {latestWeight ?? '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">lbs now</div>
          </div>
          <div className="card text-center">
            <div className={`text-xl font-bold ${
              weightChange === null ? 'text-slate-600' :
              parseFloat(weightChange) < 0 ? 'text-green-400' :
              parseFloat(weightChange) > 0 ? 'text-red-400' : 'text-slate-400'
            }`}>
              {weightChange ? `${parseFloat(weightChange) > 0 ? '+' : ''}${weightChange}` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">2-wk change</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-slate-100">
              {latestWeight
                ? `${Math.max(0, latestWeight - (profile.goalWeightMin + profile.goalWeightMax) / 2).toFixed(0)}`
                : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">lbs to goal</div>
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Weight Trend</span>
            <div className="flex gap-1">
              {([30, 60, 90] as Window[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setChartWindow(w)}
                  className={`text-xs px-2 py-1 rounded-lg touch-manipulation
                    ${chartWindow === w ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  {w}d
                </button>
              ))}
            </div>
          </div>
          <MetricsChart
            metrics={metrics}
            window={chartWindow}
            goalMin={profile.goalWeightMin}
            goalMax={profile.goalWeightMax}
          />
        </div>

        {/* Goal progress bar */}
        <div className="card">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Start: {profile.startWeight} lbs</span>
            <span>Goal: {profile.goalWeightMin}–{profile.goalWeightMax} lbs</span>
          </div>
          {latestWeight ? (
            <>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((profile.startWeight - latestWeight) / (profile.startWeight - profile.goalWeightMax)) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-center text-xs text-slate-500 mt-1">
                {Math.max(0, latestWeight - (profile.goalWeightMin + profile.goalWeightMax) / 2).toFixed(1)} lbs to go
              </p>
            </>
          ) : (
            <p className="text-slate-600 text-sm text-center py-2">Log your first weight to see progress</p>
          )}
        </div>

        {/* Entry list */}
        <div>
          <p className="section-label mb-3">History</p>
          {sortedMetrics.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="text-4xl">📊</div>
              <p className="text-slate-100 font-semibold">No check-ins yet</p>
              <p className="text-slate-500 text-sm">Tap + Log to record your weight and measurements</p>
              <button onClick={() => setShowLog(true)} className="btn-primary">
                Log First Check-In
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedMetrics.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => deleteMetrics(entry.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showLog && <LogMetrics onClose={() => setShowLog(false)} />}
    </div>
  );
}
