import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SideEffectLog {
    id: string;
    timestamp: string;
    type: string;
    severity: number; // 1-10
    medications: string[];
    notes: string;
}

interface SideEffectState {
    logs: SideEffectLog[];
    addLog: (log: Omit<SideEffectLog, 'id' | 'timestamp'>) => void;
    getLatestLog: (type: string) => SideEffectLog | undefined;
}

export const useSideEffectStore = create<SideEffectState>()(
    persist(
        (set, get) => ({
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
            getLatestLog: (type) => {
                return get().logs.find(l => l.type === type);
            },
        }),
        {
            name: 'nxtcure-sideeffect-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
