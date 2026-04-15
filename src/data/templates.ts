import { WorkoutTemplate } from '../types';

// ─── 3-Day Full Body Split ────────────────────────────────────────────────────

const fullBodyA: WorkoutTemplate = {
  id: 'fb-a',
  name: 'Full Body A',
  splitGroup: '3-Day Full Body',
  splitType: 'fullbody',
  day: 'Day A',
  description: 'Chest, back, legs, abs. Focus on compound cable movements + dumbbell accessory.',
  exercises: [
    {
      exerciseName: 'Cable Chest Press',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [8, 12], weight: 80 },
      notes: 'Full extension, control the return',
    },
    {
      exerciseName: 'Lat Pulldown (Wide Grip)',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 70 },
    },
    {
      exerciseName: 'Pec Deck Fly',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 50 },
      notes: 'Squeeze at peak contraction',
    },
    {
      exerciseName: 'Seated Cable Row',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 70 },
      notes: 'Chest to the pad, pull elbows back',
    },
    {
      exerciseName: 'Leg Extension',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 60 },
    },
    {
      exerciseName: 'Leg Curl',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 50 },
    },
    {
      exerciseName: 'Dumbbell RDL',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 35 },
      notes: 'Hinge at hips, soft knee bend, stretch hamstrings',
    },
    {
      exerciseName: 'Ab Crunch',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [15, 20], weight: 40 },
    },
  ],
};

const fullBodyB: WorkoutTemplate = {
  id: 'fb-b',
  name: 'Full Body B',
  splitGroup: '3-Day Full Body',
  splitType: 'fullbody',
  day: 'Day B',
  description: 'Chest, back, shoulders, arms, legs. Narrow-grip pulls + dumbbell pressing.',
  exercises: [
    {
      exerciseName: 'Cable Chest Press',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [8, 12], weight: 80 },
    },
    {
      exerciseName: 'Lat Pulldown (Narrow Grip)',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 70 },
      notes: 'Underhand or neutral grip',
    },
    {
      exerciseName: 'Dumbbell Shoulder Press',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 25 },
    },
    {
      exerciseName: 'Tricep Pushdown',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 40 },
      notes: 'Lock elbows at sides, full lockout',
    },
    {
      exerciseName: 'Dumbbell Curl',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 25 },
    },
    {
      exerciseName: 'Leg Extension',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 60 },
    },
    {
      exerciseName: 'Leg Curl',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 50 },
    },
    {
      exerciseName: 'Ab Crunch',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [15, 20], weight: 40 },
    },
  ],
};

const fullBodyC: WorkoutTemplate = {
  id: 'fb-c',
  name: 'Full Body C + Cardio',
  splitGroup: '3-Day Full Body',
  splitType: 'mixed',
  day: 'Day C',
  description: 'Light full-body + treadmill. Active recovery day, keep intensity moderate.',
  exercises: [
    {
      exerciseName: 'Treadmill',
      category: 'cardio',
      sets: 1,
      setConfig: { duration: 1200, distance: 1.0, incline: 3 },
      notes: '20 min brisk walk/jog, 3% incline',
    },
    {
      exerciseName: 'Cable Chest Press',
      category: 'cable',
      sets: 2,
      setConfig: { reps: [10, 12], weight: 70 },
    },
    {
      exerciseName: 'Lat Pulldown (Wide Grip)',
      category: 'cable',
      sets: 2,
      setConfig: { reps: [10, 12], weight: 65 },
    },
    {
      exerciseName: 'Seated Cable Row',
      category: 'cable',
      sets: 2,
      setConfig: { reps: [10, 12], weight: 65 },
    },
    {
      exerciseName: 'Dumbbell Lateral Raise',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 15 },
    },
    {
      exerciseName: 'Leg Extension',
      category: 'cable',
      sets: 2,
      setConfig: { reps: [15, 15], weight: 50 },
    },
    {
      exerciseName: 'Leg Curl',
      category: 'cable',
      sets: 2,
      setConfig: { reps: [15, 15], weight: 45 },
    },
  ],
};

// ─── 4-Day Upper / Lower Split ────────────────────────────────────────────────

const upperA: WorkoutTemplate = {
  id: 'ul-upper-a',
  name: 'Upper A — Push Focus',
  splitGroup: '4-Day Upper/Lower',
  splitType: 'upper',
  day: 'Upper A',
  description: 'Chest, shoulders, triceps, back width. Heavier pressing emphasis.',
  exercises: [
    {
      exerciseName: 'Cable Chest Press',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [8, 10], weight: 90 },
      notes: 'Top set goal; add weight when you hit 4×10 clean',
    },
    {
      exerciseName: 'Lat Pulldown (Wide Grip)',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [8, 10], weight: 80 },
    },
    {
      exerciseName: 'Pec Deck Fly',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 50 },
    },
    {
      exerciseName: 'Dumbbell Shoulder Press',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 30 },
    },
    {
      exerciseName: 'Tricep Pushdown',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [12, 15], weight: 45 },
    },
    {
      exerciseName: 'Dumbbell Lateral Raise',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [15, 15], weight: 15 },
    },
    {
      exerciseName: 'Ab Crunch',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [15, 20], weight: 40 },
    },
  ],
};

const upperB: WorkoutTemplate = {
  id: 'ul-upper-b',
  name: 'Upper B — Pull Focus',
  splitGroup: '4-Day Upper/Lower',
  splitType: 'upper',
  day: 'Upper B',
  description: 'Back thickness, biceps, rear delts, some chest. Row-heavy day.',
  exercises: [
    {
      exerciseName: 'Seated Cable Row',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [8, 10], weight: 80 },
      notes: 'Drive elbows back, hold briefly at peak',
    },
    {
      exerciseName: 'Cable Chest Press',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 80 },
    },
    {
      exerciseName: 'Lat Pulldown (Narrow Grip)',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [8, 10], weight: 75 },
    },
    {
      exerciseName: 'Dumbbell Row',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 35 },
      notes: 'Brace on bench, elbow close, full stretch',
    },
    {
      exerciseName: 'Dumbbell Curl',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 25 },
    },
    {
      exerciseName: 'Dumbbell Hammer Curl',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [12, 12], weight: 25 },
    },
    {
      exerciseName: 'Ab Crunch',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [15, 20], weight: 40 },
    },
  ],
};

const lowerA: WorkoutTemplate = {
  id: 'ul-lower-a',
  name: 'Lower A — Quad Focus',
  splitGroup: '4-Day Upper/Lower',
  splitType: 'lower',
  day: 'Lower A',
  description: 'Quads, hamstrings, glutes. Goblet squat as main movement.',
  exercises: [
    {
      exerciseName: 'Dumbbell Goblet Squat',
      category: 'dumbbell',
      sets: 4,
      setConfig: { reps: [10, 12], weight: 40 },
      notes: 'Hold dumbbell at chest, full depth, chest up',
    },
    {
      exerciseName: 'Leg Extension',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [12, 15], weight: 65 },
    },
    {
      exerciseName: 'Leg Curl',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [12, 15], weight: 55 },
    },
    {
      exerciseName: 'Dumbbell RDL',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 12], weight: 35 },
    },
    {
      exerciseName: 'Dumbbell Lunge',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 10], weight: 25 },
      notes: '10 reps each leg',
    },
    {
      exerciseName: 'Treadmill',
      category: 'cardio',
      sets: 1,
      setConfig: { duration: 900, distance: 0.75, incline: 5 },
      notes: '15 min incline walk cooldown',
    },
  ],
};

const lowerB: WorkoutTemplate = {
  id: 'ul-lower-b',
  name: 'Lower B — Hip Hinge Focus',
  splitGroup: '4-Day Upper/Lower',
  splitType: 'lower',
  day: 'Lower B',
  description: 'Hamstrings, glutes, calves, abs. Sumo squat variation.',
  exercises: [
    {
      exerciseName: 'Dumbbell Sumo Squat',
      category: 'dumbbell',
      sets: 4,
      setConfig: { reps: [10, 12], weight: 40 },
      notes: 'Wide stance, toes out ~45°, goblet hold',
    },
    {
      exerciseName: 'Leg Curl',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [12, 15], weight: 55 },
    },
    {
      exerciseName: 'Leg Extension',
      category: 'cable',
      sets: 3,
      setConfig: { reps: [15, 15], weight: 55 },
    },
    {
      exerciseName: 'Dumbbell Step-Up',
      category: 'dumbbell',
      sets: 3,
      setConfig: { reps: [10, 10], weight: 25 },
      notes: '10 reps each leg, controlled descent',
    },
    {
      exerciseName: 'Dumbbell Calf Raise',
      category: 'dumbbell',
      sets: 4,
      setConfig: { reps: [15, 20], weight: 35 },
    },
    {
      exerciseName: 'Ab Crunch',
      category: 'cable',
      sets: 4,
      setConfig: { reps: [15, 20], weight: 40 },
    },
  ],
};

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  fullBodyA,
  fullBodyB,
  fullBodyC,
  upperA,
  upperB,
  lowerA,
  lowerB,
];

export const TEMPLATE_GROUPS: Record<string, WorkoutTemplate[]> = {
  '3-Day Full Body': [fullBodyA, fullBodyB, fullBodyC],
  '4-Day Upper/Lower': [upperA, upperB, lowerA, lowerB],
};

// Canonical day order for "next day" suggestion
export const TEMPLATE_GROUP_ORDER: Record<string, string[]> = {
  '3-Day Full Body': ['fb-a', 'fb-b', 'fb-c'],
  '4-Day Upper/Lower': ['ul-upper-a', 'ul-lower-a', 'ul-upper-b', 'ul-lower-b'],
};

export const EXERCISE_LIST = [
  // Cable machine
  'Cable Chest Press',
  'Lat Pulldown (Wide Grip)',
  'Lat Pulldown (Narrow Grip)',
  'Pec Deck Fly',
  'Seated Cable Row',
  'Tricep Pushdown',
  'High Pulley Row',
  'Leg Extension',
  'Leg Curl',
  'Ab Crunch',
  // Dumbbell
  'Dumbbell Curl',
  'Dumbbell Hammer Curl',
  'Dumbbell Row',
  'Dumbbell RDL',
  'Dumbbell Shoulder Press',
  'Dumbbell Lateral Raise',
  'Dumbbell Goblet Squat',
  'Dumbbell Sumo Squat',
  'Dumbbell Lunge',
  'Dumbbell Step-Up',
  'Dumbbell Calf Raise',
  // Cardio
  'Treadmill',
];
