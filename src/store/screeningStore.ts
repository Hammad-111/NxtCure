import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScreeningType =
    | 'testicular'
    | 'breast_self'
    | 'skin'
    | 'dental'
    | 'mammogram'
    | 'pap_smear'
    | 'hpv_test'
    | 'colonoscopy'
    | 'prostate_psa'
    | 'ldct_lung';

interface ScreeningState {
    logs: Record<string, string>; // Type -> ISO Date of last completion
    markAsDone: (type: ScreeningType) => void;
    getLastCompleted: (type: ScreeningType) => string | null;
}

export const useScreeningStore = create<ScreeningState>()(
    persist(
        (set, get) => ({
            logs: {},
            markAsDone: (type) => {
                set((state) => ({
                    logs: {
                        ...state.logs,
                        [type]: new Date().toISOString(),
                    }
                }));
            },
            getLastCompleted: (type) => {
                return get().logs[type] || null;
            }
        }),
        {
            name: 'nxtcure-screening-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
