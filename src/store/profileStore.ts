import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileState {
    name: string;
    nxtId: string;
    familyHistory: string[];
    previousConditions: string[];
    isOnboarded: boolean;
    updateProfile: (data: Partial<Omit<ProfileState, 'updateProfile'>>) => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            name: 'Alessandro',
            nxtId: '7492-BX-09',
            familyHistory: [],
            previousConditions: [],
            isOnboarded: true,
            updateProfile: (data) => set((state) => ({ ...state, ...data })),
        }),
        {
            name: 'nxtcure-profile-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
