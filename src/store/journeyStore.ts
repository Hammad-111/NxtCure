import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JourneyPhase = 'Diagnosis' | 'Surgery' | 'Chemotherapy' | 'Radiation' | 'Surveillance';

export interface Milestone {
    id: string;
    title: string;
    description: string;
    phase: JourneyPhase;
    status: 'pending' | 'completed' | 'overdue';
    dueDate?: string;
    completedDate?: string;
    clinicalRationale: string;
}

interface JourneyState {
    currentPhase: JourneyPhase;
    milestones: Milestone[];
    setPhase: (phase: JourneyPhase) => void;
    addMilestone: (milestone: Omit<Milestone, 'id' | 'status'>) => void;
    completeMilestone: (id: string) => void;
    getNextMilestone: () => Milestone | undefined;
}

const INITIAL_MILESTONES: Milestone[] = [
    {
        id: '1',
        title: 'Schedule Urologist Consultation',
        description: 'First physical evaluation of findings.',
        phase: 'Diagnosis',
        status: 'pending',
        clinicalRationale: 'Necessary to confirm surgical necessity and staging.'
    },
    {
        id: '2',
        title: 'Scrotal Ultrasound',
        description: 'High-resolution imaging of the mass.',
        phase: 'Diagnosis',
        status: 'pending',
        clinicalRationale: 'Differentiates between solid masses and cysts.'
    }
];

export const useJourneyStore = create<JourneyState>()(
    persist(
        (set, get) => ({
            currentPhase: 'Diagnosis',
            milestones: INITIAL_MILESTONES,
            setPhase: (phase) => set({ currentPhase: phase }),
            addMilestone: (m) => {
                set((state) => ({
                    milestones: [
                        ...state.milestones,
                        {
                            ...m,
                            id: Math.random().toString(36).substring(2, 9),
                            status: 'pending'
                        }
                    ]
                }));
            },
            completeMilestone: (id) => {
                set((state) => ({
                    milestones: state.milestones.map(m =>
                        m.id === id ? { ...m, status: 'completed', completedDate: new Date().toISOString() } : m
                    )
                }));
            },
            getNextMilestone: () => {
                return get().milestones.find(m => m.status === 'pending');
            }
        }),
        {
            name: 'nxtcure-journey-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
