export interface CancerEntry {
    id: string;
    title: string;
    stats: {
        cases: string;
        ageGroup: string;
        survival: string;
    };
    riskFactors: string[];
    warningSigns: string[];
    diagnosis: string[];
    treatment: string[];
    prevention: string[];
}

export const CANCER_DATABASE: Record<string, CancerEntry> = {
    'testicular': {
        id: 'testicular',
        title: 'Testicular Cancer',
        stats: {
            cases: '~9,000 US cases/year',
            ageGroup: '15-35',
            survival: '95%+'
        },
        riskFactors: [
            'Undescended testicle (cryptorchidism)',
            'Family history',
            'Personal history (other testicle)',
            'White race',
            'Tall stature'
        ],
        warningSigns: [
            'Painless lump or swelling',
            'Heaviness in scrotum',
            'Dull ache in groin/abdomen',
            'Sudden fluid collection'
        ],
        diagnosis: [
            'Physical exam',
            'Scrotal ultrasound',
            'Tumor markers (AFP, hCG, LDH)',
            'CT scans (staging)'
        ],
        treatment: [
            'Orchiectomy (surgery to remove)',
            'Chemotherapy (if spread)',
            'Radiation (for seminoma)',
            'Surgery (RPLND if needed)'
        ],
        prevention: [
            'Monthly self-exams',
            'No proven primary prevention methods'
        ]
    },
    'breast': {
        id: 'breast',
        title: 'Breast Cancer',
        stats: {
            cases: '~300,000 US cases/year',
            ageGroup: '40+',
            survival: '90% (all stages)'
        },
        riskFactors: [
            'Genetic mutations (BRCA1, BRCA2)',
            'Family history / Personal history',
            'Dense breast tissue',
            'Hormonal factors (Late first pregnancy, HRT)',
            'Lifestyle (Alcohol, Obesity)'
        ],
        warningSigns: [
            'New lump in breast or armpit',
            'Thickening or swelling of part of breast',
            'Skin dimpling or irritation',
            'Nipple discharge other than breast milk',
            'Nipple retraction'
        ],
        diagnosis: [
            'Mammogram (Screening/Diagnostic)',
            'Breast Ultrasound',
            'MRI of the breast',
            'Biopsy (Core needle/Aspiration)'
        ],
        treatment: [
            'Surgery (Lumpectomy/Mastectomy)',
            'Radiation therapy',
            'Chemotherapy',
            'Hormone therapy (Tamoxifen, AI)',
            'Targeted therapy'
        ],
        prevention: [
            'Regular mammograms (40+)',
            'Monthly self-exams',
            'Limit alcohol intake',
            'Maintain healthy weight'
        ]
    },
    'colorectal': {
        id: 'colorectal',
        title: 'Colorectal Cancer',
        stats: {
            cases: '~150,000 US cases/year',
            ageGroup: '45+',
            survival: '65% (average)'
        },
        riskFactors: [
            'Older age (45+)',
            'Family history of polyps or cancer',
            'Personal history of IBD (Crohn\'s/Colitis)',
            'Diet high in processed meats',
            'Obesity and lack of exercise'
        ],
        warningSigns: [
            'Change in bowel habits (diarrhea/constipation) > few days',
            'Rectal bleeding or blood in stool',
            'Abdominal cramping or pain',
            'Weakness and fatigue',
            'Unintended weight loss'
        ],
        diagnosis: [
            'Colonoscopy (Gold standard)',
            'Stool-based tests (FIT/Cologuard)',
            'CT Colonography',
            'Biopsy during colonoscopy'
        ],
        treatment: [
            'Polypectomy during colonoscopy',
            'Colectomy (segmental resection)',
            'Chemotherapy',
            'Immunotherapy',
            'Radiation (primarily for rectal)'
        ],
        prevention: [
            'Screening starting at age 45',
            'High-fiber diet',
            'Limit red and processed meat',
            'Regular physical activity'
        ]
    },
    'lung': {
        id: 'lung',
        title: 'Lung Cancer',
        stats: {
            cases: '~230,000 US cases/year',
            ageGroup: '50-80',
            survival: '25% (average)'
        },
        riskFactors: [
            'Smoking (80-90% of cases)',
            'Radon gas exposure',
            'Asbestos / Industrial carcinogens',
            'Secondhand smoke',
            'Personal or Family history'
        ],
        warningSigns: [
            'Persistent cough that gets worse',
            'Chest pain, often deeper with breathing',
            'Shortness of breath / Wheezing',
            'Coughing up blood (Hemoptysis)',
            'Fatigue and weight loss'
        ],
        diagnosis: [
            'Low-Dose CT (LDCT) screening',
            'Chest X-Ray',
            'Sputum Cytology',
            'Biopsy (Bronchoscopy/Needle)'
        ],
        treatment: [
            'Surgery (Lobectomy/Resection)',
            'Radiation therapy',
            'Chemotherapy',
            'Targeted drug therapy',
            'Immunotherapy'
        ],
        prevention: [
            'Annual LDCT for high-risk smokers (50-80)',
            'Smoking cessation',
            'Radon testing in home',
            'Avoiding secondhand smoke'
        ]
    },
    'skin': {
        id: 'skin',
        title: 'Skin Cancer',
        stats: {
            cases: '5M+ (Non-melanoma) / 100k (Melanoma)',
            ageGroup: 'All ages',
            survival: '99% (early melanoma)'
        },
        riskFactors: [
            'UV radiation (Sun/Tanning beds)',
            'Fair skin / History of sunburns',
            'Large number of moles',
            'Family history',
            'Weakened immune system'
        ],
        warningSigns: [
            'ABCDE changes in moles',
            'A sore that doesn\'t heal',
            'Spread of pigment from border',
            'Redness or new swelling',
            'Itchiness, tenderness, or pain'
        ],
        diagnosis: [
            'Skin physical exam',
            'Dermatoscopy',
            'Skin biopsy (Shave/Punch/Excision)',
            'Lymph node biopsy (if spread)'
        ],
        treatment: [
            'Excisional surgery',
            'Mohs surgery (for BCC/SCC)',
            'Cryotherapy',
            'Immunotherapy',
            'Targeted therapy'
        ],
        prevention: [
            'Regular self-exams (Monthly)',
            'Broad-spectrum sunscreen (SPF 30+)',
            'Protective clothing / Shade',
            'Avoiding peak sun (10 AM - 4 PM)'
        ]
    }
};
