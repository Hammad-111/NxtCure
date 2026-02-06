import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LifestyleLog {
    date: string; // YYYY-MM-DD
    smokingFree: boolean;
    alcoholFree: boolean;
    exerciseMinutes: number;
    sunScreenApplied: boolean;
    carcinogenAwareness: boolean;
}

interface LifestyleState {
    logs: Record<string, LifestyleLog>;
    toggleHabit: (date: string, habit: keyof Omit<LifestyleLog, 'exerciseMinutes' | 'date'>) => void;
    setExercise: (date: string, minutes: number) => void;
    getConsistencyScore: (date: string) => number;
}

export const useLifestyleStore = create<LifestyleState>()(
    persist(
        (set, get) => ({
            logs: {},
            toggleHabit: (date, habit) => {
                set((state) => {
                    const currentLog = state.logs[date] || {
                        date,
                        smokingFree: true,
                        alcoholFree: true,
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
            }
        }),
        {
            name: 'nxtcure-lifestyle-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
