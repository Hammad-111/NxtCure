import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GoalState {
    selectedGoals: string[];
    setGoals: (goals: string[]) => void;
    hasGoal: (id: string) => boolean;
    clearGoals: () => void;
}

export const useGoalStore = create<GoalState>()(
    persist(
        (set, get) => ({
            selectedGoals: [],
            setGoals: (goals) => set({ selectedGoals: goals }),
            hasGoal: (id) => get().selectedGoals.includes(id),
            clearGoals: () => set({ selectedGoals: [] }),
        }),
        {
            name: 'nxtcure-goal-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
