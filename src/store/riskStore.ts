import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RiskLevel = 'Below Average' | 'Average' | 'Elevated' | 'High';

export interface FamilyHistoryItem {
    relation: 'parent' | 'sibling' | 'child' | 'grandparent';
    cancerType: string;
    ageAtDiagnosis: number;
}

export interface RiskFactors {
    age: number;
    sex: 'male' | 'female' | 'other';
    race: string;
    ethnicity: string;

    // History
    familyHistory: FamilyHistoryItem[];
    personalHistory: string[]; // ['polyps', 'previous_cancer', etc.]

    // Lifestyle (Legacy linkage but specifically for risk)
    isSmoker: boolean;
    packYears?: number;
    alcoholConsump: 'none' | 'moderate' | 'heavy';

    // Specialized
    reproductiveHistory?: {
        firstPeriodAge?: number;
        firstBirthAge?: number;
        menopauseAge?: number;
        hormoneTherapy?: boolean;
    };

    vaccinationStatus: {
        hpv: boolean;
        hbv: boolean;
    };
}

export interface CancerSpecificRisk {
    type: string;
    level: RiskLevel;
    recommendation: string;
    reason: string;
}

interface RiskState {
    factors: RiskFactors;
    setFactors: (factors: Partial<RiskFactors>) => void;
    calculateDetailedProfile: () => CancerSpecificRisk[];
    calculateGlobalPreventionScore: (dietScore: number, lifestyleScore: number) => { level: string; score: number };
}

export const useRiskStore = create<RiskState>()(
    persist(
        (set, get) => ({
            factors: {
                age: 25,
                sex: 'male',
                race: 'other',
                ethnicity: 'other',
                familyHistory: [],
                personalHistory: [],
                isSmoker: false,
                alcoholConsump: 'none',
                vaccinationStatus: {
                    hpv: false,
                    hbv: false,
                }
            },

            setFactors: (newFactors) => {
                set((state) => ({
                    factors: { ...state.factors, ...newFactors }
                }));
            },

            calculateDetailedProfile: () => {
                const f = get().factors;
                const risks: CancerSpecificRisk[] = [];

                // 1. LUNG CANCER (USPSTF 2021)
                const lungRisk: CancerSpecificRisk = {
                    type: 'Lung Cancer',
                    level: 'Average',
                    reason: 'Standard risk based on demographics.',
                    recommendation: 'Avoid primary and secondhand smoke.'
                };
                if (f.isSmoker && f.packYears && f.packYears >= 20 && f.age >= 50 && f.age <= 80) {
                    lungRisk.level = 'Elevated';
                    lungRisk.reason = 'Criteria met for high-risk screening (20+ pack-years, age 50+).';
                    lungRisk.recommendation = 'Annual Low-Dose CT (LDCT) screening recommended.';
                } else if (!f.isSmoker) {
                    lungRisk.level = 'Below Average';
                }
                risks.push(lungRisk);

                // 2. BREAST CANCER (Gail-like simplified)
                if (f.sex === 'female') {
                    const breastRisk: CancerSpecificRisk = {
                        type: 'Breast Cancer',
                        level: 'Average',
                        reason: 'Standard female biological risk.',
                        recommendation: 'Annual mammography starting age 40-45.'
                    };

                    const firstDegree = f.familyHistory.filter(h => h.relation === 'parent' || h.relation === 'sibling');
                    if (firstDegree.length > 0) {
                        breastRisk.level = 'Elevated';
                        breastRisk.reason = 'First-degree relative history detected.';
                        breastRisk.recommendation = 'Consider genetic counseling (BRCA) and earlier screening.';
                    }
                    if (f.reproductiveHistory?.firstBirthAge && f.reproductiveHistory.firstBirthAge >= 30) {
                        breastRisk.level = 'Elevated';
                        breastRisk.reason = 'Delayed first-term pregnancy increases lifetime estrogen exposure.';
                    }
                    risks.push(breastRisk);
                }

                // 3. COLORECTAL CANCER
                const colorectalRisk: CancerSpecificRisk = {
                    type: 'Colorectal Cancer',
                    level: 'Average',
                    reason: 'Baseline population risk.',
                    recommendation: 'Colonoscopy every 10 years starting at age 45.'
                };
                if (f.familyHistory.some(h => h.cancerType.toLowerCase().includes('colon'))) {
                    colorectalRisk.level = 'Elevated';
                    colorectalRisk.reason = 'Family history of colorectal malignancy.';
                    colorectalRisk.recommendation = 'Start screening 10 years earlier than family diagnosis age.';
                }
                risks.push(colorectalRisk);

                // 4. SKIN CANCER (Melanoma)
                const skinRisk: CancerSpecificRisk = {
                    type: 'Melanoma',
                    level: 'Average',
                    reason: 'General environmental risk.',
                    recommendation: 'Daily SPF 30+ and monthly skin self-exams.'
                };
                if (f.race === 'white' || f.race === 'fair') {
                    skinRisk.level = 'Elevated';
                    skinRisk.reason = 'Fair skin phenotype and UV sensitivity.';
                    skinRisk.recommendation = 'Annual clinical dermatological examination.';
                }
                risks.push(skinRisk);

                // 5. PROSTATE CANCER (Male)
                if (f.sex === 'male') {
                    const prostateRisk: CancerSpecificRisk = {
                        type: 'Prostate Cancer',
                        level: 'Average',
                        reason: 'Standard male biological risk.',
                        recommendation: 'Discuss PSA screening with doctor at age 50.'
                    };
                    if (f.age >= 50 && f.race === 'black') {
                        prostateRisk.level = 'Elevated';
                        prostateRisk.reason = 'Statistically higher risk for Black men over age 50.';
                        prostateRisk.recommendation = 'Begin PSA discussions at age 45.';
                    }
                    risks.push(prostateRisk);
                }

                return risks;
            },

            calculateGlobalPreventionScore: (dietScore, lifestyleScore) => {
                // Keep the existing logic but map to the new levels for consistency
                const { age, familyHistory } = get().factors;
                let riskPenalty = 0;
                if (age > 40) riskPenalty += 5;
                if (age > 60) riskPenalty += 10;
                if (familyHistory.length > 0) riskPenalty += 10;

                const normalizedDiet = (dietScore / 7) * 40;
                const normalizedLifestyle = (lifestyleScore / 100) * 40;
                const riskMitigation = 20 - riskPenalty;

                const healthScore = Math.min(100, Math.max(10, normalizedDiet + normalizedLifestyle + riskMitigation));

                let level = 'Low Risk';
                if (healthScore < 40) level = 'High Risk';
                else if (healthScore < 60) level = 'Elevated Risk';
                else if (healthScore < 80) level = 'Moderate';
                else level = 'Optimized';

                return { level, score: Math.round(healthScore) };
            }
        }),
        {
            name: 'nxtcure-risk-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
