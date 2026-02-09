import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
    // Demographics
    name: string;
    age: number | null;
    sex: 'Male' | 'Female' | 'Other' | null;
    race: string | null;

    // Medical History
    medicalHistory: string[]; // e.g., ['Diabetes', 'Hypertension']
    familyHistory: string[]; // e.g., ['Breast Cancer (Mother)', 'Lung Cancer (Father)']

    // Lifestyle
    smokingStatus: 'Never' | 'Former' | 'Current' | null;
    smokingQuitDate: string | null;
    alcoholUnitsPerWeek: number;
    exerciseMinutesPerWeek: number;
    dietQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent' | null;

    // Current Health
    healthConcerns: string[]; // e.g., ['Persistent cough', 'Unexplained weight loss']

    // System
    nxtId: string;
    isOnboarded: boolean;
    profileCompleted: boolean;
}

interface ProfileState extends UserProfile {
    updateProfile: (data: Partial<Omit<UserProfile, 'updateProfile'>>) => void;
    resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
    name: '',
    age: null,
    sex: null,
    race: null,
    medicalHistory: [],
    familyHistory: [],
    smokingStatus: null,
    smokingQuitDate: null,
    alcoholUnitsPerWeek: 0,
    exerciseMinutesPerWeek: 0,
    dietQuality: null,
    healthConcerns: [],
    nxtId: Math.random().toString(36).substring(2, 11).toUpperCase(),
    isOnboarded: false,
    profileCompleted: false,
};

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            ...DEFAULT_PROFILE,
            updateProfile: (data) => set((state) => ({ ...state, ...data })),
            resetProfile: () => set(DEFAULT_PROFILE),
        }),
        {
            name: 'nxtcure-profile-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
