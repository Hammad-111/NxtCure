import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Appointment {
    id: string;
    title: string;
    doctor: string;
    date: string; // ISO string
    location: string;
    type: 'oncology' | 'gp' | 'screening' | 'other';
}

interface AppointmentState {
    appointments: Appointment[];
    addAppointment: (app: Omit<Appointment, 'id'>) => void;
    removeAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>()(
    persist(
        (set) => ({
            appointments: [],
            addAppointment: (app) => {
                set((state) => ({
                    appointments: [
                        ...state.appointments,
                        { ...app, id: Math.random().toString(36).substring(2, 9) }
                    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                }));
            },
            removeAppointment: (id) => {
                set((state) => ({
                    appointments: state.appointments.filter(a => a.id !== id)
                }));
            },
        }),
        {
            name: 'nxtcure-appointment-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
