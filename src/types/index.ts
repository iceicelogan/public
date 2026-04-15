// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  age: number;
  heightInches: number;
  startWeight: number;
  goalWeightMin: number;
  goalWeightMax: number;
  anthropicApiKey: string;
}

// ─── Workout / Exercise types ─────────────────────────────────────────────────

export type ExerciseCategory = 'cable' | 'dumbbell' | 'cardio' | 'bodyweight';

export interface SetLog {
  id: string;
  reps?: number;
  weight?: number;       // lbs
  duration?: number;     // seconds (cardio / timed)
  distance?: number;     // miles (treadmill)
  incline?: number;      // % grade (treadmill)
  calories?: number;     // estimated (treadmill)
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  exerciseName: string;
  category: ExerciseCategory;
  sets: SetLog[];
  notes?: string;
}

export type WorkoutType = 'strength' | 'cardio' | 'mixed';

export interface WorkoutSession {
  id: string;
  date: string;           // ISO date string  YYYY-MM-DD
  startTime: string;      // ISO timestamp
  endTime?: string;
  templateId?: string;
  templateName?: string;
  exercises: ExerciseLog[];
  notes: string;
  type: WorkoutType;
}

// ─── Workout Templates ────────────────────────────────────────────────────────

export interface TemplateSet {
  reps?: [number, number]; // [min, max] rep range
  weight?: number;          // suggested starting weight
  duration?: number;        // seconds
  distance?: number;        // miles
  incline?: number;         // % grade (treadmill)
}

export interface TemplateExercise {
  exerciseName: string;
  category: ExerciseCategory;
  sets: number;
  setConfig: TemplateSet;
  notes?: string;
}

export type SplitType = 'fullbody' | 'upper' | 'lower' | 'cardio' | 'mixed';

export interface WorkoutTemplate {
  id: string;
  name: string;
  splitGroup: string;   // e.g. "3-Day Full Body" or "4-Day Upper/Lower"
  splitType: SplitType;
  day: string;          // "Day A", "Upper A", etc.
  description: string;
  exercises: TemplateExercise[];
}

// ─── Body Metrics ─────────────────────────────────────────────────────────────

export interface Measurements {
  waist?: number;
  chest?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
}

export interface WeeklyCheckIn {
  sleepQuality: number;   // 1–5
  stressLevel: number;    // 1–5
  energyLevel: number;    // 1–5
  notes: string;
}

export interface BodyMetricsEntry {
  id: string;
  date: string;          // YYYY-MM-DD
  weight?: number;       // lbs
  measurements?: Measurements;
  weeklyCheckIn?: WeeklyCheckIn;
  notes?: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ─── PR / Progress tracking ───────────────────────────────────────────────────

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  sessionId: string;
}
