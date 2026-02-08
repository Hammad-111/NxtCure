import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SymptomLog {
    id: string;
    timestamp: string;
    symptoms: string[];
    severity: number; // 1-10
    notes: string;
}

interface SymptomState {
    logs: SymptomLog[];
    addLog: (log: Omit<SymptomLog, 'id' | 'timestamp'>) => void;
}

export const useSymptomStore = create<SymptomState>()(
    persist(
        (set) => ({
            logs: [],
            addLog: (log) => {
                set((state) => ({
                    logs: [
                        {
                            ...log,
                            id: Math.random().toString(36).substring(2, 9),
                            timestamp: new Date().toISOString(),
                        },
                        ...state.logs,
                    ]
                }));
            },
        }),
        {
            name: 'nxtcure-symptom-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
