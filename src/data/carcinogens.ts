export interface Carcinogen {
    id: string;
    name: string;
    category: 'Lifestyle' | 'Dietary' | 'Occupational' | 'Environmental' | 'Infectious';
    riskLevel: '🔴 HIGH' | '⚠️ MODERATE' | 'ℹ️ LOW';
    summary: string;
    examples: string[];
    cancerRisk: string;
    whyHarmful: string[];
    safeAlternatives: string[];
    research: string[];
    monograph?: string;
}

export const CARCINOGENS: Carcinogen[] = [
    // LIFESTYLE
    {
        id: 'tobacco',
        name: 'Tobacco (All Forms)',
        category: 'Lifestyle',
        riskLevel: '🔴 HIGH',
        summary: 'The leading cause of preventable death and cancer globally. No safe level of exposure exists.',
        examples: ['Cigarettes', 'Cigars', 'Chewing tobacco', 'Snuff', 'Vaping (secondary risk)'],
        cancerRisk: 'Linked to lung, oral, throat, esophageal, bladder, and kidney cancers.',
        whyHarmful: [
            'Contains over 7,000 chemicals',
            '70+ known carcinogens (Benzene, Nitrosamines)',
            'Directly mutates tumor-suppressor genes (e.g., p53)'
        ],
        safeAlternatives: ['Complete cessation', 'NRT (under supervision)', 'Behavioral therapy'],
        research: ['IARC Monograph 100E (2012)', 'Surgeon General Report (2014)'],
        monograph: '100E'
    },
    {
        id: 'alcohol',
        name: 'Alcohol',
        category: 'Lifestyle',
        riskLevel: '🔴 HIGH',
        summary: 'Acetaldehyde in alcoholic beverages is a Group 1 carcinogen.',
        examples: ['Wine', 'Beer', 'Spirits', 'Liquor'],
        cancerRisk: 'Increased risk of breast, colorectal, liver, and esophageal cancers.',
        whyHarmful: [
            'Ethanol metabolizes into Acetaldehyde (mutagenic)',
            'Induces oxidative stress',
            'Increases circulating estrogen levels'
        ],
        safeAlternatives: ['Mocktails', 'Infused water', 'Non-alcoholic fermentations'],
        research: ['IARC Monograph 100E (2012)', 'AICR/WCRF Continuous Update'],
        monograph: '100E'
    },
    {
        id: 'uv_radiation',
        name: 'UV Radiation',
        category: 'Lifestyle',
        riskLevel: '🔴 HIGH',
        summary: 'Solar radiation and UV-emitting tanning devices cause direct DNA damage.',
        examples: ['Sunlight', 'Tanning beds', 'Sun lamps'],
        cancerRisk: 'Primary driver of Melanoma and Non-melanoma skin cancers.',
        whyHarmful: [
            'Causes cyclobutane pyrimidine dimers (CPDs) in DNA',
            'Inactivates skin immune surveillance',
            'Promotes photo-aging and mutations'
        ],
        safeAlternatives: ['SPF 30+ Broad Spectrum', 'UPF 50+ Clothing', 'Sun-safe hours (before 10am/after 4pm)'],
        research: ['IARC Monograph 100D (2012)', 'WHO Prevention Guidelines'],
        monograph: '100D'
    },
    {
        id: 'physical_inactivity',
        name: 'Physical Inactivity',
        category: 'Lifestyle',
        riskLevel: '⚠️ MODERATE', // Indirect but significant
        summary: 'Sedentary lifestyle contributes to systemic inflammation and obesity-related cancers.',
        examples: ['Sitting >6h/day', 'Lack of aerobic exercise', 'Low muscle mass'],
        cancerRisk: 'Linked to colorectal, breast, and endometrial cancers.',
        whyHarmful: [
            'Increases insulin resistance',
            'Promotes chronic systemic inflammation',
            'Alters sex hormone metabolism'
        ],
        safeAlternatives: ['150 mins zone-2 cardio/week', 'Resistance training (2x/week)', 'Active workstations'],
        research: ['IARC Monograph 100E', 'WHO Activity Report'],
        monograph: '100E'
    },

    // DIETARY
    {
        id: 'processed_meat',
        name: 'Processed Meat',
        category: 'Dietary',
        riskLevel: '🔴 HIGH',
        summary: 'Meats preserved by smoking, curing, or salting. Classified as Group 1 (same as tobacco).',
        examples: ['Bacon', 'Sausage', 'Hot dogs', 'Salami', 'Beef jerky', 'Canned meats'],
        cancerRisk: 'Colorectal cancer: +18% risk per 50g/day consumed.',
        whyHarmful: [
            'Formation of N-nitroso compounds during processing',
            'Heme iron promotes oxidative damage in the gut',
            'Nitrates and nitrites form carcinogens in the stomach'
        ],
        safeAlternatives: ['Fresh chicken', 'Fish', 'Legumes', 'Tempeh', 'Unprocessed lean cuts'],
        research: ['IARC Monograph 114 (2015)', 'WHO Red Meat Report'],
        monograph: '114'
    },
    {
        id: 'charred_meat',
        name: 'Grilled/Charred Meat',
        category: 'Dietary',
        riskLevel: '⚠️ MODERATE',
        summary: 'High-temperature cooking (grilling/frying) creates harmful chemicals.',
        examples: ['Barbecued beef', 'Blackened chicken', 'Flame-broiled burgers'],
        cancerRisk: 'Linked to colorectal, pancreatic, and prostate cancers.',
        whyHarmful: [
            'Heterocyclic amines (HCAs) formed from muscle protein',
            'Polycyclic aromatic hydrocarbons (PAHs) from smoke/fat drips',
            'Mutagenic compounds activated by liver enzymes'
        ],
        safeAlternatives: ['Lower temperature cooking', 'Marinating (reduces HCAs)', 'Sous-vide or poaching'],
        research: ['IARC Monograph 92'],
        monograph: '92'
    },
    {
        id: 'salt_preserved',
        name: 'Salt-Preserved Foods',
        category: 'Dietary',
        riskLevel: '⚠️ MODERATE',
        summary: 'Traditional high-salt preservation methods, common in East Asian diets.',
        examples: ['Salt-cured fish', 'Pickled vegetables (traditional)', 'High-salt condiments'],
        cancerRisk: 'Significantly increases risk of stomach (gastric) cancer.',
        whyHarmful: [
            'Damages the gastric mucus lining',
            'Promotes H. pylori infection colonization',
            'Synergistic effect with nitroso compounds'
        ],
        safeAlternatives: ['Fresh vegetables', 'Low-sodium fermentation (e.g., modern Kimchi)', 'Fresh protein'],
        research: ['WCRF/AICR Gastric Cancer Report'],
        monograph: '100E'
    },
    {
        id: 'aflatoxins',
        name: 'Aflatoxins',
        category: 'Dietary',
        riskLevel: '🔴 HIGH',
        summary: 'Toxic metabolites produced by certain molds (Aspergillus) in food crops.',
        examples: ['Moldy peanuts', 'Contaminated corn', 'Cottonseed', 'Poorly stored grains'],
        cancerRisk: 'One of the most potent triggers for Liver Cancer (HCC).',
        whyHarmful: [
            'Metabolic activation in the liver',
            'Causes G→T transversion in p53 gene',
            'Highly synergistic with Hepatitis B virus'
        ],
        safeAlternatives: ['Proper humidity control in storage', 'Reputable sourcing', 'Avoiding discolored nuts'],
        research: ['IARC Monograph 100F (2012)'],
        monograph: '100F'
    },

    // OCCUPATIONAL
    {
        id: 'asbestos',
        name: 'Asbestos',
        category: 'Occupational',
        riskLevel: '🔴 HIGH',
        summary: 'Fibrous minerals used in industrial insulation and construction.',
        examples: ['Shipbuilding materials', 'Old brake linings', 'Ceiling tiles', 'Insulation'],
        cancerRisk: 'Primary cause of Mesothelioma; also causes lung and laryngeal cancer.',
        whyHarmful: [
            'Indestructible fibers embed in pleural tissue',
            'Chronic inflammation and oxidative stress',
            'Physical interference with chromosome segregation'
        ],
        safeAlternatives: ['Modern fiberglass', 'Mineral wool', 'Professional abatement only'],
        research: ['IARC Monograph 100C (2012)'],
        monograph: '100C'
    },
    {
        id: 'benzene',
        name: 'Benzene',
        category: 'Occupational',
        riskLevel: '🔴 HIGH',
        summary: 'A clear, colorless liquid used in chemical manufacturing and found in gasoline.',
        examples: ['Chemical plant exposure', 'Gas station fumes', 'Crude oil refining'],
        cancerRisk: 'Strongly linked to Leukemia (specifically AML).',
        whyHarmful: [
            'Bone marrow toxicity',
            'Chromosomal aberrations (aneuploidy)',
            'Inhibits topoisomerase II'
        ],
        safeAlternatives: ['Adequate PPE (Respirators)', 'Vapor recovery systems', 'Benzene-free solvents'],
        research: ['IARC Monograph 120 (2018)'],
        monograph: '120'
    },

    // ENVIRONMENTAL
    {
        id: 'radon',
        name: 'Radon Gas',
        category: 'Environmental',
        riskLevel: '🔴 HIGH',
        summary: 'Colorless, odorless radioactive gas that leaks from soil into buildings.',
        examples: ['Basements', 'Ground-floor apartments', 'Poorly ventilated mines'],
        cancerRisk: 'Leading cause of lung cancer in non-smokers.',
        whyHarmful: [
            'Alpha-particle emission damages lung DNA',
            'Radioactive decay products (progeny) inhaled',
            'Direct double-strand DNA breaks'
        ],
        safeAlternatives: ['Radon testing kits', 'Sub-slab depressurization', 'Improved ventilation'],
        research: ['IARC Monograph 100D (2012)', 'EPA Radon Report'],
        monograph: '100D'
    },
    {
        id: 'arsenic',
        name: 'Arsenic in Water',
        category: 'Environmental',
        riskLevel: '🔴 HIGH',
        summary: 'Naturally occurring toxic element often found in groundwater.',
        examples: ['Unfiltered well water', 'Pesticide runoff', 'Metal smelting'],
        cancerRisk: 'Linked to skin, bladder, and lung cancers.',
        whyHarmful: [
            'Inhibits DNA repair mechanisms',
            'Epigenetic modifications',
            'Alters cellular signal transduction'
        ],
        safeAlternatives: ['Reverse Osmosis filtration', 'Activated alumina filters', 'Municipal water testing'],
        research: ['IARC Monograph 100C (2012)'],
        monograph: '100C'
    },

    // INFECTIOUS
    {
        id: 'hpv',
        name: 'HPV (Virus)',
        category: 'Infectious',
        riskLevel: '🔴 HIGH',
        summary: 'Human Papillomavirus - most common viral trigger for cancer.',
        examples: ['HPV 16', 'HPV 18', 'HPV 31', 'HPV 45'],
        cancerRisk: 'Causes >95% of cervical cancers; also anal, throat, and penile cancers.',
        whyHarmful: [
            'E6/E7 oncoproteins degrade p53/pRb',
            'Blocks cellular apoptosis (programmed cell death)',
            'Induces genomic instability'
        ],
        safeAlternatives: ['HPV Vaccine (Gardasil)', 'Regular Pap/HPV screening', 'Barrier protection'],
        research: ['IARC Monograph 100B (2012)'],
        monograph: '100B'
    },
    {
        id: 'h_pylori',
        name: 'H. pylori (Bacteria)',
        category: 'Infectious',
        riskLevel: '🔴 HIGH',
        summary: 'Bacteria that colonizes the stomach lining, causing chronic ulcers.',
        examples: ['Stomach ulcers', 'Chronic gastritis'],
        cancerRisk: 'Strongest risk factor for non-cardia gastric cancer.',
        whyHarmful: [
            'CagA protein disturbs cellular signaling',
            'Causes persistent chronic inflammation',
            'Promotes conversion of dietary nitrates to nitrites'
        ],
        safeAlternatives: ['Antibiotic eradication (Triple therapy)', 'Breath/Stool antigen testing'],
        research: ['IARC Monograph 100B (2012)'],
        monograph: '100B'
    }
];
