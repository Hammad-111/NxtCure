import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyLog {
    date: string; // YYYY-MM-DD
    oliveOil: boolean;
    vegetables: boolean; // >= 2 servings
    fruit: boolean; // >= 2 servings
    nuts: boolean; // Handful
    legumes: boolean; // If applicable that day
    fish: boolean; // If applicable
    wholeGrains: boolean;
    redMeat: boolean; // Negative score if true
    processedMeat: boolean; // Negative score
    soda: boolean; // Negative
}

interface DietState {
    logs: Record<string, DailyLog>; // Date -> Log
    toggleItem: (date: string, item: keyof DailyLog) => void;
    getScore: (date: string) => number;
}

export const useDietStore = create<DietState>()(
    persist(
        (set, get) => ({
            logs: {},
            toggleItem: (date, item) => {
                set((state) => {
                    const currentLog = state.logs[date] || {
                        date,
                        oliveOil: false,
                        vegetables: false,
                        fruit: false,
                        nuts: false,
                        legumes: false,
                        fish: false,
                        wholeGrains: false,
                        redMeat: false,
                        processedMeat: false,
                        soda: false,
                    };

                    return {
                        logs: {
                            ...state.logs,
                            [date]: {
                                ...currentLog,
                                [item]: !currentLog[item],
                            },
                        },
                    };
                });
            },
            getScore: (date) => {
                const log = get().logs[date];
                if (!log) return 0;

                let score = 0;
                // Positive points
                if (log.oliveOil) score += 1;
                if (log.vegetables) score += 1;
                if (log.fruit) score += 1;
                if (log.nuts) score += 1;
                if (log.wholeGrains) score += 1;
                if (log.fish) score += 1; // Bonus
                if (log.legumes) score += 1;

                // Negative points (Penalties)
                if (log.redMeat) score -= 1;
                if (log.processedMeat) score -= 2; // Heavy penalty
                if (log.soda) score -= 1;

                return Math.max(0, score); // Min 0
            }
        }),
        {
            name: 'nxtcure-diet-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
