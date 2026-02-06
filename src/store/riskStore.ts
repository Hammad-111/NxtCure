import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High';

interface RiskFactors {
    age: number;
    sex: 'male' | 'female' | 'other';
    familyHistory: boolean;
    geneticMarkers: boolean;
}

interface RiskState {
    factors: RiskFactors;
    setFactors: (factors: Partial<RiskFactors>) => void;
    calculateRisk: (dietScore: number, lifestyleScore: number) => { level: RiskLevel; score: number };
}

export const useRiskStore = create<RiskState>()(
    persist(
        (set, get) => ({
            factors: {
                age: 25,
                sex: 'male',
                familyHistory: false,
                geneticMarkers: false,
            },
            setFactors: (newFactors) => {
                set((state) => ({
                    factors: { ...state.factors, ...newFactors }
                }));
            },
            calculateRisk: (dietScore, lifestyleScore) => {
                const { age, familyHistory, geneticMarkers } = get().factors;

                // 1. Risk Factor Penalty (0-30 points)
                let riskPenalty = 0;
                if (age > 40) riskPenalty += 5;
                if (age > 60) riskPenalty += 10;
                if (familyHistory) riskPenalty += 10;
                if (geneticMarkers) riskPenalty += 5;

                // 2. Health Performance (0-100)
                // Diet Score is out of 7, Lifestyle is out of 100
                const normalizedDiet = (dietScore / 7) * 40; // Max 40 points
                const normalizedLifestyle = (lifestyleScore / 100) * 40; // Max 40 points
                const riskMitigation = 20 - riskPenalty; // Remaining 20 points based on low risk

                const healthScore = Math.min(100, Math.max(10, normalizedDiet + normalizedLifestyle + riskMitigation));

                let level: RiskLevel = 'Low';
                if (healthScore < 40) level = 'High';
                else if (healthScore < 60) level = 'Elevated';
                else if (healthScore < 80) level = 'Moderate';
                else level = 'Low';

                return { level, score: Math.round(healthScore) };
            }
        }),
        {
            name: 'nxtcure-risk-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
