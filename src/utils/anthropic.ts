import Anthropic from '@anthropic-ai/sdk';
import { WorkoutSession, BodyMetricsEntry, UserProfile, ChatMessage } from '../types';
import { formatDate, isWithinDays } from './helpers';

// ─── System prompt builder ────────────────────────────────────────────────────

export function buildSystemPrompt(
  profile: UserProfile,
  recentSessions: WorkoutSession[],
  recentMetrics: BodyMetricsEntry[]
): string {
  const lastMetric = recentMetrics.length > 0 ? recentMetrics[recentMetrics.length - 1] : null;
  const currentWeight = lastMetric?.weight ?? profile.startWeight;

  const sessionSummary = recentSessions
    .slice(-7)
    .map((s) => {
      const exList = s.exercises
        .map((e) => {
          const topSet = e.sets
            .filter((set) => set.completed && set.weight)
            .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0];
          if (topSet?.weight && topSet?.reps) {
            return `  - ${e.exerciseName}: top set ${topSet.weight}lbs × ${topSet.reps}`;
          }
          if (topSet?.duration) {
            return `  - ${e.exerciseName}: ${Math.round(topSet.duration / 60)}min`;
          }
          return `  - ${e.exerciseName}`;
        })
        .join('\n');
      return `${formatDate(s.date)}:\n${exList}${s.notes ? `\n  Notes: ${s.notes}` : ''}`;
    })
    .join('\n\n');

  const weightTrend = recentMetrics
    .slice(-4)
    .map((m) => `${formatDate(m.date)}: ${m.weight}lbs`)
    .join(', ');

  return `You are a personal workout coach AI buddy for a specific individual. Here is their complete profile:

PERSON:
- Male, ${profile.age} years old, ${Math.floor(profile.heightInches / 12)}'${profile.heightInches % 12}"
- Current weight: ${currentWeight}lbs | Goal: ${profile.goalWeightMin}–${profile.goalWeightMax}lbs
- Objective: body recomposition — lose fat, build lean functional muscle
- Fitness level: intermediate, training at home

AVAILABLE EQUIPMENT (ONLY recommend exercises using this gear):
- Treadmill
- Dumbbells up to 40lbs
- Marcy Multi-Function Home Gym (150lb stack):
  • Cable chest press
  • Lat pulldown (wide and narrow grip)
  • High pulley / tricep pushdown
  • Low pulley / seated cable row
  • Pec deck / fly arms
  • Leg extension and leg curl
  • Ab crunch station

RECENT WORKOUTS (last 7 sessions):
${sessionSummary || 'No recent sessions logged.'}

WEIGHT TREND (recent entries):
${weightTrend || 'No weight data logged yet.'}

COACHING GUIDELINES:
- Age 36: factor in recovery needs, joint health, sleep, avoiding overtraining
- NEVER recommend barbells, squat racks, pull-up bars, or machines not listed above
- Be direct, specific, and concise — the person is between sets
- Encourage without being cheesy
- If asked about pain/soreness, prioritize safety and suggest modifications
- For progressive overload: recommend adding 5lbs or 1-2 reps before jumping in weight
- Keep responses under 200 words unless the question explicitly needs more detail`;
}

// ─── Streaming chat — direct SDK call, no server needed ──────────────────────

export async function streamChat(
  apiKey: string,
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string,
  onChunk: (text: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const messages = [
    ...history.slice(-10).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    stream.on('text', (text) => {
      onChunk(text);
    });

    await stream.finalMessage();
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Unknown error');
  }
}

// ─── Weekly digest — direct SDK call ─────────────────────────────────────────

export async function fetchWeeklyDigest(
  apiKey: string,
  profile: UserProfile,
  sessions: WorkoutSession[],
  metrics: BodyMetricsEntry[]
): Promise<string> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const systemPrompt = buildSystemPrompt(profile, sessions, metrics);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content:
          "Give me my weekly digest. In 3 short sections: 1) What I did this week (brief), 2) What's trending (weight, strength), 3) One concrete thing to do differently next week. Be specific and direct.",
      },
    ],
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// ─── Context summary helper ───────────────────────────────────────────────────

export function buildContextSummary(
  sessions: WorkoutSession[],
  metrics: BodyMetricsEntry[]
): string {
  const last7 = sessions.filter((s) => isWithinDays(s.date, 7));
  const sessionCount = last7.length;
  const lastMetric = [...metrics].sort((a, b) => b.date.localeCompare(a.date))[0];

  return `Recent activity: ${sessionCount} workout${sessionCount !== 1 ? 's' : ''} in the last 7 days.${
    lastMetric?.weight ? ` Current weight: ${lastMetric.weight}lbs.` : ''
  }`;
}
