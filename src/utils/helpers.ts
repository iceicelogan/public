import { WorkoutSession, ExerciseLog, SetLog, PersonalRecord } from '../types';

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function daysAgo(isoDate: string): number {
  const now = new Date();
  const d = new Date(isoDate + 'T00:00:00');
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function isWithinDays(isoDate: string, days: number): boolean {
  return daysAgo(isoDate) <= days;
}

// ─── ID generation ────────────────────────────────────────────────────────────

export function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Workout session helpers ──────────────────────────────────────────────────

export function sessionDurationMinutes(session: WorkoutSession): number | null {
  if (!session.endTime) return null;
  const start = new Date(session.startTime).getTime();
  const end = new Date(session.endTime).getTime();
  return Math.round((end - start) / 60000);
}

export function sessionVolume(session: WorkoutSession): number {
  let total = 0;
  for (const ex of session.exercises) {
    for (const set of ex.sets) {
      if (set.completed && set.weight && set.reps) {
        total += set.weight * set.reps;
      }
    }
  }
  return total;
}

// ─── PR / stall detection ─────────────────────────────────────────────────────

/**
 * For each exercise, find the all-time best set (by weight × reps proxy = weight at reps≥1).
 * Returns map of exerciseName → best { weight, reps, date, sessionId }.
 */
export function computePRs(sessions: WorkoutSession[]): Map<string, PersonalRecord> {
  const prs = new Map<string, PersonalRecord>();

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

  for (const session of sorted) {
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (!set.completed || !set.weight || !set.reps) continue;
        const current = prs.get(ex.exerciseName);
        // PR = higher weight (or same weight with more reps)
        if (
          !current ||
          set.weight > current.weight ||
          (set.weight === current.weight && set.reps > current.reps)
        ) {
          prs.set(ex.exerciseName, {
            exerciseName: ex.exerciseName,
            weight: set.weight,
            reps: set.reps,
            date: session.date,
            sessionId: session.id,
          });
        }
      }
    }
  }

  return prs;
}

/**
 * Returns exercises that were just PRed in the given session.
 */
export function newPRsInSession(
  session: WorkoutSession,
  allSessions: WorkoutSession[]
): PersonalRecord[] {
  const previousSessions = allSessions.filter((s) => s.id !== session.id);
  const prevPRs = computePRs(previousSessions);
  const newPRs: PersonalRecord[] = [];

  for (const ex of session.exercises) {
    for (const set of ex.sets) {
      if (!set.completed || !set.weight || !set.reps) continue;
      const prev = prevPRs.get(ex.exerciseName);
      if (
        !prev ||
        set.weight > prev.weight ||
        (set.weight === prev.weight && set.reps > prev.reps)
      ) {
        newPRs.push({
          exerciseName: ex.exerciseName,
          weight: set.weight,
          reps: set.reps,
          date: session.date,
          sessionId: session.id,
        });
        break; // one PR per exercise per session
      }
    }
  }

  return newPRs;
}

/**
 * Returns exercises that have stalled (no PR improvement in 14+ days and appeared 2+ times).
 */
export function stalledExercises(sessions: WorkoutSession[]): string[] {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Group sessions with this exercise in last 14 days
  const exerciseHistory = new Map<string, { weight: number; reps: number; date: string }[]>();

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

  for (const session of sorted) {
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (!set.completed || !set.weight || !set.reps) continue;
        const entry = exerciseHistory.get(ex.exerciseName) ?? [];
        entry.push({ weight: set.weight, reps: set.reps, date: session.date });
        exerciseHistory.set(ex.exerciseName, entry);
      }
    }
  }

  const stalled: string[] = [];

  for (const [name, history] of exerciseHistory) {
    if (history.length < 4) continue; // not enough data

    const recent = history.filter(
      (h) => new Date(h.date + 'T00:00:00') >= twoWeeksAgo
    );
    if (recent.length < 2) continue;

    // Check if any improvement in recent 14 days
    const oldest = recent[0];
    const hasImproved = recent.some(
      (r) =>
        r.weight > oldest.weight ||
        (r.weight === oldest.weight && r.reps > oldest.reps)
    );

    if (!hasImproved) {
      stalled.push(name);
    }
  }

  return stalled;
}

// ─── Streak calculation ───────────────────────────────────────────────────────

export function computeStreak(sessions: WorkoutSession[]): number {
  if (sessions.length === 0) return 0;

  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  const today = todayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  // Streak only counts if today or yesterday has a session
  if (dates[0] !== today && dates[0] !== yesterdayISO) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ─── Weight trend ─────────────────────────────────────────────────────────────

export function movingAverage(values: number[], window: number): number[] {
  return values.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

// ─── Format helpers ───────────────────────────────────────────────────────────

export function fmtWeight(lbs: number): string {
  return `${lbs} lbs`;
}

export function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

export function setLabel(set: SetLog): string {
  if (set.duration) {
    const base = fmtDuration(set.duration);
    const extras = [
      set.distance ? `${set.distance}mi` : null,
      set.incline ? `${set.incline}% inc` : null,
    ]
      .filter(Boolean)
      .join(', ');
    return extras ? `${base} · ${extras}` : base;
  }
  if (set.weight && set.reps) return `${set.weight}lbs × ${set.reps}`;
  if (set.reps) return `${set.reps} reps`;
  return '—';
}

export function sessionsThisWeek(sessions: WorkoutSession[]): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return sessions.filter((s) => new Date(s.date + 'T00:00:00') >= startOfWeek).length;
}
