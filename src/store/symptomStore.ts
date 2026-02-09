import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TriageUrgency = 'Emergent' | 'Urgent' | 'Routine' | 'Monitoring';

export interface TriageResult {
    urgency: TriageUrgency;
    possibleCauses: { label: string; priority: 'high' | 'medium' | 'low'; type: 'cancer' | 'benign' }[];
    recommendedActions: string[];
    specialist?: string;
}

export interface SymptomLog {
    id: string;
    timestamp: string;
    query: string;
    analysis: TriageResult;
}

interface SymptomState {
    logs: SymptomLog[];
    analyzeSymptom: (query: string) => TriageResult;
    addLog: (query: string, analysis: TriageResult) => void;
}

const RED_FLAGS: Record<string, TriageResult> = {
    'blood': {
        urgency: 'Urgent',
        possibleCauses: [
            { label: 'Colorectal Cancer', priority: 'high', type: 'cancer' },
            { label: 'Inflammatory Bowel Disease', priority: 'medium', type: 'benign' },
            { label: 'Internal Hemorrhoids', priority: 'low', type: 'benign' }
        ],
        recommendedActions: ['See Primary Care within 1 week', 'Likely need: Colonoscopy', 'Do not ignore persistent bleeding'],
        specialist: 'Gastroenterologist'
    },
    'lump': {
        urgency: 'Urgent',
        possibleCauses: [
            { label: 'Malignancy (Cancer)', priority: 'high', type: 'cancer' },
            { label: 'Cyst or Lipoma', priority: 'medium', type: 'benign' },
            { label: 'Lymphadenopathy', priority: 'low', type: 'benign' }
        ],
        recommendedActions: ['Clinical physical exam required', 'Possible Ultrasound or Biopsy', 'Track if lump is hard/fixed'],
        specialist: 'Oncologist / Surgeon'
    },
    'weight loss': {
        urgency: 'Urgent',
        possibleCauses: [
            { label: 'Systemic Malignancy', priority: 'high', type: 'cancer' },
            { label: 'Hyperthyroidism', priority: 'medium', type: 'benign' },
            { label: 'Malabsorption Issue', priority: 'low', type: 'benign' }
        ],
        recommendedActions: ['Comprehensive blood panel', 'CT Chest/Abdomen/Pelvis', 'Review caloric intake'],
        specialist: 'Internal Medicine'
    },
    'cough': {
        urgency: 'Monitoring',
        possibleCauses: [
            { label: 'Bronchitis / Infection', priority: 'high', type: 'benign' },
            { label: 'Lung Cancer', priority: 'medium', type: 'cancer' },
            { label: 'Gastroesophageal Reflux', priority: 'low', type: 'benign' }
        ],
        recommendedActions: ['Monitor for 3+ weeks', 'Chest X-Ray if persistent', 'Check for blood in sputum'],
        specialist: 'Pulmonologist'
    }
};

export const useSymptomStore = create<SymptomState>()(
    persist(
        (set, get) => ({
            logs: [],
            analyzeSymptom: (query: string) => {
                const q = query.toLowerCase();
                let topResult: TriageResult = {
                    urgency: 'Routine',
                    possibleCauses: [{ label: 'Non-specific symptoms', priority: 'low', type: 'benign' }],
                    recommendedActions: ['Monitor symptoms for 2 weeks', 'Consult GP if no improvement']
                };

                for (const flag in RED_FLAGS) {
                    if (q.includes(flag)) {
                        topResult = RED_FLAGS[flag];
                        break;
                    }
                }

                // Emergent Override
                if (q.includes('chest pain') || q.includes('difficulty breathing') || q.includes('stroke')) {
                    topResult = {
                        urgency: 'Emergent',
                        possibleCauses: [{ label: 'Acute Medical Crisis', priority: 'high', type: 'benign' }],
                        recommendedActions: ['Call Emergency Services (911/112) NOW', 'Do not drive yourself'],
                    };
                }

                return topResult;
            },
            addLog: (query, analysis) => {
                set((state) => ({
                    logs: [
                        {
                            id: Math.random().toString(36).substring(2, 9),
                            timestamp: new Date().toISOString(),
                            query,
                            analysis
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

