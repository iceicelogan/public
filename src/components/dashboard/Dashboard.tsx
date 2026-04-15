import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
  computeStreak,
  sessionsThisWeek,
  computePRs,
  formatDateShort,
  isWithinDays,
  todayISO,
} from '../../utils/helpers';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';

export default function Dashboard() {
  const { profile, sessions, metrics, navigate, openProgram } = useStore();

  const streak = useMemo(() => computeStreak(sessions), [sessions]);
  const weekSessions = useMemo(() => sessionsThisWeek(sessions), [sessions]);

  const recentPRs = useMemo(() => {
    const prs = computePRs(sessions);
    return Array.from(prs.values())
      .filter((pr) => isWithinDays(pr.date, 30))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
  }, [sessions]);

  const weightData = useMemo(() => {
    return [...metrics]
      .filter((m) => m.weight && isWithinDays(m.date, 30))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((m) => ({ date: m.date, weight: m.weight }));
  }, [metrics]);

  const latestWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : null;
  const goalMin = profile.goalWeightMin;
  const goalMax = profile.goalWeightMax;

  const todaySession = sessions.find((s) => s.date === todayISO());
  const hasSessionToday = Boolean(todaySession);

  const weightToGoal = latestWeight
    ? Math.max(0, latestWeight - (goalMin + goalMax) / 2)
    : null;

  // Progress percentage toward goal (starting from 185)
  const progressPct = latestWeight
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(((profile.startWeight - latestWeight) / (profile.startWeight - goalMax)) * 100)
        )
      )
    : 0;

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="flex flex-col gap-4 px-4 py-4 pb-6">
      {/* Greeting */}
      <div>
        <p className="text-slate-400 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
          {profile.name ? `Hey, ${profile.name}` : 'Ready to work?'}
        </h2>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate('workout')}
          className="flex flex-col items-center gap-2 bg-orange-500 rounded-2xl p-4 active:bg-orange-600 touch-manipulation"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-white text-xs font-semibold text-center leading-tight">Log Workout</span>
        </button>

        <button
          onClick={() => navigate('metrics')}
          className="flex flex-col items-center gap-2 bg-slate-800 rounded-2xl p-4 active:bg-slate-700 touch-manipulation"
        >
          <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span className="text-slate-300 text-xs font-semibold text-center leading-tight">Log Weight</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-500">{streak}</div>
          <div className="text-xs text-slate-500 mt-0.5">day streak</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-slate-100">{weekSessions}</div>
          <div className="text-xs text-slate-500 mt-0.5">this week</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-slate-100">
            {latestWeight ? `${latestWeight}` : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">lbs now</div>
        </div>
      </div>

      {/* Weight goal progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">Goal Progress</span>
          <span className="text-xs text-slate-400">
            {goalMin}–{goalMax} lbs target
          </span>
        </div>

        {latestWeight ? (
          <>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-100">{latestWeight}</span>
              <span className="text-slate-500 text-sm mb-1">lbs</span>
              {weightToGoal !== null && weightToGoal > 0 && (
                <span className="text-slate-500 text-xs mb-1 ml-auto">
                  {weightToGoal.toFixed(1)} lbs to go
                </span>
              )}
              {weightToGoal === 0 && (
                <span className="text-green-400 text-xs mb-1 ml-auto font-semibold">Goal reached!</span>
              )}
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mb-1">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>{profile.startWeight} lbs</span>
              <span>{progressPct}%</span>
              <span>{goalMax} lbs</span>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate('metrics')}
            className="w-full text-center text-slate-500 text-sm py-3 border border-dashed border-slate-700 rounded-xl"
          >
            Log your first weight check-in →
          </button>
        )}
      </div>

      {/* Weight sparkline */}
      {weightData.length >= 3 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Weight Trend</span>
            <span className="text-xs text-slate-500">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={64}>
            <LineChart data={weightData}>
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f1f5f9',
                }}
                formatter={(val: number) => [`${val} lbs`, 'Weight']}
                labelFormatter={(label: string) => formatDateShort(label)}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Today's workout */}
      <div className="card">
        <span className="section-label">Today</span>
        {hasSessionToday ? (
          <div className="mt-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-slate-100 font-medium text-sm">Workout logged</p>
              <p className="text-slate-500 text-xs">
                {todaySession?.exercises.length} exercise{todaySession?.exercises.length !== 1 ? 's' : ''}
                {todaySession?.templateName ? ` · ${todaySession.templateName}` : ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <button
              onClick={() => navigate('workout')}
              className="btn-primary w-full text-center"
            >
              Start today's workout
            </button>
          </div>
        )}
      </div>

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <div className="card">
          <span className="section-label">Recent PRs</span>
          <div className="mt-2 flex flex-col gap-2">
            {recentPRs.map((pr) => (
              <div key={`${pr.exerciseName}-${pr.date}`} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-100 font-medium">{pr.exerciseName}</span>
                  <span className="text-xs text-slate-500 ml-2">{formatDateShort(pr.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-orange-400">
                    {pr.weight}lbs × {pr.reps}
                  </span>
                  <span className="text-xs">🏆</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Recent Workouts</span>
            <button
              onClick={() => navigate('workout')}
              className="text-orange-500 text-xs font-medium"
            >
              All →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {sessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm text-slate-100 font-medium">
                    {s.templateName ?? 'Custom Workout'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDateShort(s.date)} · {s.exercises.length} exercises
                  </p>
                </div>
                <span className="text-xs text-slate-600 capitalize">{s.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First-time onboarding */}
      {sessions.length === 0 && (
        <div className="flex flex-col gap-3">
          <div className="card border-orange-500/30">
            <p className="text-orange-400 text-xs font-semibold mb-1">Where to start</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              You have two programs ready to go. Pick one and stick with it for 4–6 weeks before switching.
            </p>
          </div>

          {/* Option 1 */}
          <div className="card">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-slate-100 font-semibold">3-Day Full Body</p>
                <p className="text-xs text-slate-500">Mon / Wed / Fri · ~45 min</p>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">Recommended</span>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              Best for getting started. Every session hits chest, back, and legs so you build the habit before adding volume.
            </p>
            <div className="flex flex-col gap-1 text-xs text-slate-500 mb-4">
              <span>Day A — Chest press, lat pulldown, pec deck, rows, leg curl/ext</span>
              <span>Day B — Chest, shoulder press, tricep pushdown, curls, legs</span>
              <span>Day C — Light full body + treadmill (active recovery)</span>
            </div>
            <button onClick={() => { openProgram('3-Day Full Body'); navigate('workout'); }} className="btn-primary w-full">
              Start Full Body →
            </button>
          </div>

          {/* Option 2 */}
          <div className="card">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-slate-100 font-semibold">4-Day Upper / Lower</p>
                <p className="text-xs text-slate-500">4 days/week · ~50 min</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              More volume per muscle group. Good if you can commit to 4 days and want to push harder on each session.
            </p>
            <button onClick={() => { openProgram('4-Day Upper/Lower'); navigate('workout'); }} className="btn-secondary w-full">
              View Upper/Lower →
            </button>
          </div>

        </div>
      )}
    </div>
    </div>
  );
}
