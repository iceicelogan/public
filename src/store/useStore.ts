import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  WorkoutSession,
  BodyMetricsEntry,
} from '../types';
import { genId, todayISO } from '../utils/helpers';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 36,
  heightInches: 69,
  startWeight: 185,
  goalWeightMin: 170,
  goalWeightMax: 175,
};

interface AppState {
  profile: UserProfile;
  sessions: WorkoutSession[];
  metrics: BodyMetricsEntry[];
  activeSession: WorkoutSession | null;
  currentPage: 'dashboard' | 'workout' | 'metrics' | 'settings';

  updateProfile: (updates: Partial<UserProfile>) => void;
  startSession: (templateId?: string, templateName?: string) => void;
  updateActiveSession: (updates: Partial<WorkoutSession>) => void;
  finishSession: () => void;
  discardSession: () => void;
  saveSession: (session: WorkoutSession) => void;
  updateSession: (id: string, updates: Partial<WorkoutSession>) => void;
  deleteSession: (id: string) => void;
  addMetrics: (entry: Omit<BodyMetricsEntry, 'id'>) => void;
  updateMetrics: (id: string, updates: Partial<BodyMetricsEntry>) => void;
  deleteMetrics: (id: string) => void;
  navigate: (page: AppState['currentPage']) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      sessions: [],
      metrics: [],
      activeSession: null,
      currentPage: 'dashboard',

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

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
        set({
          sessions: [{ ...activeSession, endTime: new Date().toISOString() }, ...sessions],
          activeSession: null,
        });
      },

      discardSession: () => set({ activeSession: null }),

      saveSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      addMetrics: (entry) =>
        set((state) => ({ metrics: [{ ...entry, id: genId() }, ...state.metrics] })),

      updateMetrics: (id, updates) =>
        set((state) => ({
          metrics: state.metrics.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      deleteMetrics: (id) =>
        set((state) => ({ metrics: state.metrics.filter((m) => m.id !== id) })),

      navigate: (page) => set({ currentPage: page }),
    }),
    {
      name: 'workout-buddy-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        sessions: state.sessions,
        metrics: state.metrics,
      }),
    }
  )
);
