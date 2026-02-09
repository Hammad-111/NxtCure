import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CarcinogenExposure {
    date: string; // YYYY-MM-DD
    carcinogenId: string;
    servings?: number;
}

interface CarcinogenState {
    exposures: CarcinogenExposure[];
    addExposure: (id: string, date?: string) => void;
    removeExposure: (id: string, date: string) => void;
    getExposuresForDate: (date: string) => CarcinogenExposure[];
    getWeeklyCount: (id: string) => number;
    getAvoidanceStats: () => { avoided: number; total: number };
}

export const useCarcinogenStore = create<CarcinogenState>()(
    persist(
        (set, get) => ({
            exposures: [],

            addExposure: (id, date = new Date().toISOString().split('T')[0]) => {
                set((state) => ({
                    exposures: [...state.exposures, { date, carcinogenId: id, servings: 1 }]
                }));
            },

            removeExposure: (id, date) => {
                set((state) => ({
                    exposures: state.exposures.filter(e => !(e.carcinogenId === id && e.date === date))
                }));
            },

            getExposuresForDate: (date) => {
                return get().exposures.filter(e => e.date === date);
            },

            getWeeklyCount: (id) => {
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return get().exposures.filter(e => {
                    const eDate = new Date(e.date);
                    return e.carcinogenId === id && eDate >= weekAgo;
                }).length;
            },

            getAvoidanceStats: () => {
                const now = new Date();
                const weekDays = [...Array(7)].map((_, i) => {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                });

                const daysWithExposure = new Set(
                    get().exposures
                        .filter(e => weekDays.includes(e.date))
                        .map(e => e.date)
                );

                return {
                    avoided: 7 - daysWithExposure.size,
                    total: 7
                };
            }
        }),
        {
            name: 'nxtcure-carcinogen-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
