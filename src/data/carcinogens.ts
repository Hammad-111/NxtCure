export interface Carcinogen {
    id: string;
    name: string;
    category: 'Lifestyle' | 'Dietary' | 'Occupational' | 'Environmental' | 'Infectious';
    riskLevel: 'High' | 'Moderate' | 'Low'; // IARC Group 1 is all high, but we can sub-categorize for UI
    summary: string;
    examples: string[];
    cancerRisk: string;
    whyHarmful: string[];
    safeAlternatives: string[];
    research: string[];
}

export const CARCINOGENS: Carcinogen[] = [
    {
        id: 'tobacco',
        name: 'Tobacco (All Forms)',
        category: 'Lifestyle',
        riskLevel: 'High',
        summary: 'Tobacco use is the leading cause of preventable death and cancer worldwide.',
        examples: ['Cigarettes', 'Cigars', 'Chewing tobacco', 'Snuff', 'Vaping (emerging)'],
        cancerRisk: 'Linked to lung, oral, throat, esophageal, bladder, and kidney cancers.',
        whyHarmful: [
            'Contains over 7,000 chemicals',
            'At least 70 are known carcinogens (e.g., Benzene, Formaldehyde)',
            'Damages DNA directly'
        ],
        safeAlternatives: ['Quitting (cessation programs)', 'NRT (Nicotine Replacement)'],
        research: ['IARC Monograph 100E', 'Surgeon General Reports']
    },
    {
        id: 'processed_meat',
        name: 'Processed Meat',
        category: 'Dietary',
        riskLevel: 'High',
        summary: 'Meats preserved by smoking, curing, salting, or adding preservatives.',
        examples: ['Bacon', 'Sausage', 'Hot dogs', 'Deli meats', 'Beef jerky', 'Canned meat'],
        cancerRisk: 'Colorectal cancer: +18% risk per 50g/day. Also linked to stomach cancer.',
        whyHarmful: [
            'N-nitroso compounds (carcinogenic)',
            'Heme iron (oxidative damage)',
            'Nitrates/nitrites (form carcinogens)'
        ],
        safeAlternatives: ['Fresh chicken breast', 'Fish', 'Turkey (unprocessed)', 'Plant-based proteins'],
        research: ['IARC Monograph 114 (2015)', 'WHO Red Meat Report']
    },
    {
        id: 'alcohol',
        name: 'Alcohol',
        category: 'Lifestyle',
        riskLevel: 'High',
        summary: 'All types of alcoholic beverages, including wine, beer, and spirits.',
        examples: ['Wine', 'Beer', 'Spirits', 'Liquor'],
        cancerRisk: 'Linked to breast, colorectal, liver, esophageal, and head & neck cancers.',
        whyHarmful: [
            'Acetaldehyde (toxic byproduct of ethanol)',
            'Oxidative stress',
            'Interferes with hormone levels (Estrogen)'
        ],
        safeAlternatives: ['Mocktails', 'Sparkling water', 'Non-alcoholic beer'],
        research: ['IARC Monograph 100E', 'AICR Continuous Update Project']
    },
    {
        id: 'uv_radiation',
        name: 'UV Radiation',
        category: 'Lifestyle',
        riskLevel: 'High',
        summary: 'Ultraviolet radiation from search, tanning beds, and sun lamps.',
        examples: ['Sunlight', 'Tanning beds', 'Sun lamps'],
        cancerRisk: 'Main cause of Skin cancer (Melanoma, Basal cell, Squamous cell).',
        whyHarmful: [
            'Direct DNA damage to skin cells',
            'Causes mutations in tumor-suppressor genes'
        ],
        safeAlternatives: ['Broad-spectrum sunscreen', 'Protective clothing', 'Seeking shade'],
        research: ['IARC Monograph 100D']
    },
    {
        id: 'asbestos',
        name: 'Asbestos',
        category: 'Occupational',
        riskLevel: 'High',
        summary: 'Naturally occurring silicate minerals used in construction and insulation.',
        examples: ['Old insulation', 'Roofing shingles', 'Brake linings'],
        cancerRisk: 'Causes Mesothelioma, lung, laryngeal, and ovarian cancers.',
        whyHarmful: [
            'Fibers are inhaled and trapped in lungs',
            'Causes chronic inflammation and lung scarring (asbestosis)',
            'Directly damages chromosomes'
        ],
        safeAlternatives: ['Professional asbestos removal', 'Modern fiberglass insulation'],
        research: ['IARC Monograph 100C']
    },
    {
        id: 'air_pollution',
        name: 'Outdoor Air Pollution (PM2.5)',
        category: 'Environmental',
        riskLevel: 'High',
        summary: 'Complex mixture of small particles and gases in the outdoor air.',
        examples: ['Vehicle exhaust', 'Industrial emissions', 'Wood smoke'],
        cancerRisk: 'Group 1 carcinogen, primarily linked to lung cancer.',
        whyHarmful: [
            'Fine particles (PM2.5) penetrate deep into lungs',
            'Causes systemic inflammation',
            'Contains polycyclic aromatic hydrocarbons (PAHs)'
        ],
        safeAlternatives: ['Air purifiers indoors', 'Masks on high pollution days', 'Supporting clean energy'],
        research: ['IARC Monograph 109']
    },
    {
        id: 'hpv',
        name: 'Human Papillomavirus (HPV)',
        category: 'Infectious',
        riskLevel: 'High',
        summary: 'A common virus that can lead to several types of cancer.',
        examples: ['HPV Type 16', 'HPV Type 18'],
        cancerRisk: 'Causes nearly all cervical cancers; also linked to anal and throat cancers.',
        whyHarmful: [
            'Viral DNA integrates into host genome',
            'Inactivates tumor-suppressor proteins (p53 and pRb)'
        ],
        safeAlternatives: ['HPV Vaccination', 'Regular screening (Pap/HPV tests)'],
        research: ['IARC Monograph 100B']
    },
    {
        id: 'aflatoxins',
        name: 'Aflatoxins',
        category: 'Dietary',
        riskLevel: 'High',
        summary: 'Toxins produced by certain molds found on agricultural crops.',
        examples: ['Moldy peanuts', 'Contaminated corn', 'Cottonseed'],
        cancerRisk: 'One of the most potent liver carcinogens known.',
        whyHarmful: [
            'Metabolized in liver into highly reactive intermediates',
            'Binds to DNA and causes mutations in the p53 gene'
        ],
        safeAlternatives: ['Proper food storage', 'Buying reputable brands'],
        research: ['IARC Monograph 100F']
    }
];
