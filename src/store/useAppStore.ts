/**
 * Zustand Store untuk State Manajemen Aplikasi Simulasi Elektro
 * Menyimpan progres belajar, mode tema (dark/light), mode peran (mahasiswa/dosen),
 * nilai kuis, dan data sirkuit tersimpan ke localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, ThemeMode, SchematicStandard } from '../types';

interface TeacherQuizOverride {
  id: string;
  customQuestion?: string;
  customCorrectId?: string;
  customExplanation?: string;
}

interface AppState {
  // Tampilan & Preferensi
  theme: ThemeMode;
  role: UserRole;
  schematicStandard: SchematicStandard;

  // Progres Belajar
  completedModules: string[];
  quizScores: Record<string, number>; // { 'hukum-ohm': 100, ... }
  quizAnswers: Record<string, Record<string, string>>; // { 'hukum-ohm': { q1: 'a', q2: 'b' } }

  // Konfigurasi Khusus Guru/Dosen
  teacherOverrides: Record<string, TeacherQuizOverride>;

  // Rangkaian yang Disimpan Mahasiswa/Dosen
  savedCircuits: Record<string, any>;

  // Aksi
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  setSchematicStandard: (std: SchematicStandard) => void;
  toggleSchematicStandard: () => void;

  markModuleCompleted: (moduleId: string) => void;
  saveQuizScore: (moduleId: string, score: number, answers?: Record<string, string>) => void;
  resetModuleProgress: (moduleId: string) => void;

  updateTeacherOverride: (override: TeacherQuizOverride) => void;
  resetTeacherOverrides: () => void;

  saveCircuit: (circuitId: string, data: any) => void;
  deleteCircuit: (circuitId: string) => void;

  exportBackupJson: () => string;
  importBackupJson: (jsonString: string) => { success: boolean; message: string };
  resetAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      role: 'mahasiswa',
      schematicStandard: 'IEC',

      completedModules: [],
      quizScores: {},
      quizAnswers: {},
      teacherOverrides: {},
      savedCircuits: {},

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },

      setRole: (role) => set({ role }),
      toggleRole: () => set((state) => ({ role: state.role === 'mahasiswa' ? 'dosen' : 'mahasiswa' })),

      setSchematicStandard: (schematicStandard) => set({ schematicStandard }),
      toggleSchematicStandard: () =>
        set((state) => ({ schematicStandard: state.schematicStandard === 'IEC' ? 'IEEE' : 'IEC' })),

      markModuleCompleted: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        })),

      saveQuizScore: (moduleId, score, answers) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [moduleId]: score },
          quizAnswers: answers ? { ...state.quizAnswers, [moduleId]: answers } : state.quizAnswers,
          completedModules:
            score >= 70 && !state.completedModules.includes(moduleId)
              ? [...state.completedModules, moduleId]
              : state.completedModules,
        })),

      resetModuleProgress: (moduleId) =>
        set((state) => {
          const nextScores = { ...state.quizScores };
          delete nextScores[moduleId];
          const nextAnswers = { ...state.quizAnswers };
          delete nextAnswers[moduleId];
          return {
            completedModules: state.completedModules.filter((id) => id !== moduleId),
            quizScores: nextScores,
            quizAnswers: nextAnswers,
          };
        }),

      updateTeacherOverride: (override) =>
        set((state) => ({
          teacherOverrides: {
            ...state.teacherOverrides,
            [override.id]: override,
          },
        })),

      resetTeacherOverrides: () => set({ teacherOverrides: {} }),

      saveCircuit: (circuitId, data) =>
        set((state) => ({
          savedCircuits: {
            ...state.savedCircuits,
            [circuitId]: {
              ...data,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      deleteCircuit: (circuitId) =>
        set((state) => {
          const next = { ...state.savedCircuits };
          delete next[circuitId];
          return { savedCircuits: next };
        }),

      exportBackupJson: () => {
        const state = get();
        const exportObj = {
          version: '1.0.0',
          appName: 'SimulasiDasarTeknikElektro',
          exportDate: new Date().toISOString(),
          data: {
            theme: state.theme,
            role: state.role,
            schematicStandard: state.schematicStandard,
            completedModules: state.completedModules,
            quizScores: state.quizScores,
            quizAnswers: state.quizAnswers,
            teacherOverrides: state.teacherOverrides,
            savedCircuits: state.savedCircuits,
          },
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importBackupJson: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (!parsed.data) {
            return { success: false, message: 'Format file JSON tidak valid. Properti "data" tidak ditemukan.' };
          }

          const {
            theme,
            role,
            schematicStandard,
            completedModules,
            quizScores,
            quizAnswers,
            teacherOverrides,
            savedCircuits,
          } = parsed.data;

          set({
            theme: theme || 'dark',
            role: role || 'mahasiswa',
            schematicStandard: schematicStandard || 'IEC',
            completedModules: Array.isArray(completedModules) ? completedModules : [],
            quizScores: quizScores || {},
            quizAnswers: quizAnswers || {},
            teacherOverrides: teacherOverrides || {},
            savedCircuits: savedCircuits || {},
          });

          if (typeof document !== 'undefined') {
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }

          return { success: true, message: 'Data progres dan rangkaian berhasil diimpor!' };
        } catch (err: unknown) {
          return {
            success: false,
            message: `Gagal membaca file JSON: ${err instanceof Error ? err.message : 'Format rusak'}`,
          };
        }
      },

      resetAllData: () => {
        set({
          completedModules: [],
          quizScores: {},
          quizAnswers: {},
          teacherOverrides: {},
          savedCircuits: {},
        });
      },
    }),
    {
      name: 'simulasi_elektro_storage_v1',
    }
  )
);

