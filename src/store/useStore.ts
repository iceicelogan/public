import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  WorkoutSession,
  BodyMetricsEntry,
  ChatMessage,
} from '../types';
import { genId, todayISO } from '../utils/helpers';

// ─── Default profile (the user) ───────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 36,
  heightInches: 69, // 5'9"
  startWeight: 185,
  goalWeightMin: 170,
  goalWeightMax: 175,
  aiApiKey: '',
};

// ─── State shape ──────────────────────────────────────────────────────────────

interface AppState {
  profile: UserProfile;
  sessions: WorkoutSession[];
  metrics: BodyMetricsEntry[];
  chatHistory: ChatMessage[];

  // Active workout (in-progress, not yet saved)
  activeSession: WorkoutSession | null;

  // Navigation
  currentPage: 'dashboard' | 'workout' | 'metrics' | 'chat' | 'settings';

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Session actions
  startSession: (templateId?: string, templateName?: string) => void;
  updateActiveSession: (updates: Partial<WorkoutSession>) => void;
  finishSession: () => void;
  discardSession: () => void;
  saveSession: (session: WorkoutSession) => void;
  updateSession: (id: string, updates: Partial<WorkoutSession>) => void;
  deleteSession: (id: string) => void;

  // Metrics actions
  addMetrics: (entry: Omit<BodyMetricsEntry, 'id'>) => void;
  updateMetrics: (id: string, updates: Partial<BodyMetricsEntry>) => void;
  deleteMetrics: (id: string) => void;

  // Chat actions
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  // Navigation
  navigate: (page: AppState['currentPage']) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      sessions: [],
      metrics: [],
      chatHistory: [],
      activeSession: null,
      currentPage: 'dashboard',

      // ── Profile ────────────────────────────────────────────────────────────

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

      // ── Sessions ───────────────────────────────────────────────────────────

      startSession: (templateId, templateName) => {
        const id = genId();
        set({
          activeSession: {
            id,
            date: todayISO(),
            startTime: new Date().toISOString(),
            templateId,
            templateName,
            exercises: [],
            notes: '',
            type: 'strength',
          },
        });
      },

      updateActiveSession: (updates) =>
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, ...updates }
            : null,
        })),

      finishSession: () => {
        const { activeSession, sessions } = get();
        if (!activeSession) return;
        const finished: WorkoutSession = {
          ...activeSession,
          endTime: new Date().toISOString(),
        };
        set({ sessions: [finished, ...sessions], activeSession: null });
      },

      discardSession: () => set({ activeSession: null }),

      saveSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      // ── Metrics ────────────────────────────────────────────────────────────

      addMetrics: (entry) =>
        set((state) => ({
          metrics: [{ ...entry, id: genId() }, ...state.metrics],
        })),

      updateMetrics: (id, updates) =>
        set((state) => ({
          metrics: state.metrics.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      deleteMetrics: (id) =>
        set((state) => ({
          metrics: state.metrics.filter((m) => m.id !== id),
        })),

      // ── Chat ───────────────────────────────────────────────────────────────

      addChatMessage: (msg) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            { ...msg, id: genId(), timestamp: new Date().toISOString() },
          ],
        })),

      clearChat: () => set({ chatHistory: [] }),

      // ── Navigation ─────────────────────────────────────────────────────────

      navigate: (page) => set({ currentPage: page }),
    }),
    {
      name: 'workout-buddy-v1',
      storage: createJSONStorage(() => localStorage),
      // Don't persist activeSession across page reloads (safety)
      partialize: (state) => ({
        profile: state.profile,
        sessions: state.sessions,
        metrics: state.metrics,
        chatHistory: state.chatHistory,
      }),
    }
  )
);
