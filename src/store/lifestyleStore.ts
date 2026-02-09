import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LifestyleLog {
    date: string; // YYYY-MM-DD
    smokingFree: boolean;
    alcoholFree: boolean;
    alcoholUnits: number;
    exerciseMinutes: number;
    sunScreenApplied: boolean;
    carcinogenAwareness: boolean;
    weight?: number; // Body weight in kg
}

interface LifestyleState {
    logs: Record<string, LifestyleLog>;
    quitDate: string | null; // ISO string for smoking quit date
    height: number | null; // Profile height in cm
    sex: 'male' | 'female' | null;

    // Actions
    toggleHabit: (date: string, habit: keyof Omit<LifestyleLog, 'exerciseMinutes' | 'date' | 'alcoholUnits' | 'weight'>) => void;
    setExercise: (date: string, minutes: number) => void;
    logAlcohol: (date: string, units: number) => void;
    logWeight: (date: string, kg: number) => void;
    setQuitDate: (date: string | null) => void;
    setProfile: (height: number, sex: 'male' | 'female') => void;

    // Selectors
    getConsistencyScore: (date: string) => number;
    getWeeklyAlcoholTotal: () => number;
}

export const useLifestyleStore = create<LifestyleState>()(
    persist(
        (set, get) => ({
            logs: {},
            quitDate: null,
            height: null,
            sex: null,

            toggleHabit: (date, habit) => {
                set((state) => {
                    const currentLog = state.logs[date] || {
                        date,
                        smokingFree: true,
                        alcoholFree: true,
                        alcoholUnits: 0,
                        exerciseMinutes: 0,
                        sunScreenApplied: false,
                        carcinogenAwareness: false,
                    };

                    return {
                        logs: {
                            ...state.logs,
                            [date]: {
                                ...currentLog,
                                [habit]: !currentLog[habit],
                                // If toggling alcoholFree to false, ensure units is at least 1? 
                                // Actually, let's keep it separate for better UX.
                            },
                        },
                    };
                });
            },

            setExercise: (date, minutes) => {
                set((state) => {
                    const currentLog = state.logs[date] || {
                        date,
                        smokingFree: true,
                        alcoholFree: true,
                        alcoholUnits: 0,
                        exerciseMinutes: 0,
                        sunScreenApplied: false,
                        carcinogenAwareness: false,
                    };

                    return {
                        logs: {
                            ...state.logs,
                            [date]: {
                                ...currentLog,
                                exerciseMinutes: minutes,
                            },
                        },
                    };
                });
            },

            logAlcohol: (date, units) => {
                set((state) => {
                    const currentLog = state.logs[date] || {
                        date,
                        smokingFree: true,
                        alcoholFree: true,
                        alcoholUnits: 0,
                        exerciseMinutes: 0,
                        sunScreenApplied: false,
                        carcinogenAwareness: false,
                    };

                    return {
                        logs: {
                            ...state.logs,
                            [date]: {
                                ...currentLog,
                                alcoholUnits: units,
                                alcoholFree: units === 0,
                            },
                        },
                    };
                });
            },

            logWeight: (date, kg) => {
                set((state) => {
                    const currentLog = state.logs[date] || {
                        date,
                        smokingFree: true,
                        alcoholFree: true,
                        alcoholUnits: 0,
                        exerciseMinutes: 0,
                        sunScreenApplied: false,
                        carcinogenAwareness: false,
                    };

                    return {
                        logs: {
                            ...state.logs,
                            [date]: {
                                ...currentLog,
                                weight: kg,
                            },
                        },
                    };
                });
            },

            setQuitDate: (date) => set({ quitDate: date }),
            setProfile: (height, sex) => set({ height, sex }),

            getConsistencyScore: (date) => {
                const log = get().logs[date];
                if (!log) return 0;

                let score = 0;
                if (log.sunScreenApplied) score += 20;
                if (log.carcinogenAwareness) score += 20;
                if (log.smokingFree) score += 20;
                if (log.alcoholFree) score += 20;
                if (log.exerciseMinutes >= 30) score += 20;

                return score;
            },

            getWeeklyAlcoholTotal: () => {
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return Object.values(get().logs)
                    .filter(log => new Date(log.date) >= weekAgo)
                    .reduce((total, log) => total + (log.alcoholUnits || 0), 0);
            }
        }),
        {
            name: 'nxtcure-lifestyle-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
