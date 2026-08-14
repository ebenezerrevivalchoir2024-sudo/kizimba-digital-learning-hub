import { 
  Subject, 
  NoteResource, 
  PastPaperResource, 
  PracticalLabResource, 
  VideoResource, 
  BookResource, 
  QuestionBankItem, 
  AudioResource, 
  MusicResource, 
  TeacherResourceItem, 
  UserProfile, 
  NotificationItem, 
  CmsSettings,
  WeeklyTeachingRecord,
  WeeklyStudentReport,
  WeeklyClassReport
} from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-founder-1',
    name: 'ISAACK EDWARD LUNGWA',
    email: 'isaack.lungwa@kizimba.ac.tz',
    role: 'FOUNDER',
    school: 'Kizimba Secondary School',
    joinedDate: '2024-01-01',
    streakDays: 365,
    status: 'active'
  },
  {
    id: 'user-student-1',
    name: 'Juma Baraka',
    email: 'juma.baraka@kizimba.ac.tz',
    role: 'STUDENT',
    form: 'Form IV',
    school: 'Kizimba Secondary School',
    joinedDate: '2025-01-15',
    streakDays: 14,
    status: 'active'
  },
  {
    id: 'user-teacher-1',
    name: 'Madam Grace Mbowe',
    email: 'grace.mbowe@kizimba.ac.tz',
    role: 'TEACHER',
    school: 'Kizimba Secondary School',
    joinedDate: '2024-03-01',
    streakDays: 42,
    status: 'active'
  },
  {
    id: 'user-admin-1',
    name: 'KDLH Admin Team',
    email: 'admin@kizimba.ac.tz',
    role: 'ADMIN',
    school: 'Kizimba Secondary School',
    joinedDate: '2024-01-01',
    streakDays: 180,
    status: 'active'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-chem',
    name: 'Chemistry',
    code: 'CHEM-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'FlaskConical',
    color: 'from-blue-600 to-indigo-700',
    description: 'Structure of matter, organic chemistry, chemical equilibria, energetics, and laboratory analytics.',
    topicCount: 24
  },
  {
    id: 'sub-bio',
    name: 'Biology',
    code: 'BIO-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Dna',
    color: 'from-emerald-600 to-teal-700',
    description: 'Cell biology, genetics, ecology, physiology, anatomy, and biodiversity.',
    topicCount: 28
  },
  {
    id: 'sub-phy',
    name: 'Physics',
    code: 'PHY-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Zap',
    color: 'from-amber-500 to-orange-600',
    description: 'Mechanics, wave motion, electromagnetism, electronics, nuclear physics, and optics.',
    topicCount: 22
  },
  {
    id: 'sub-math',
    name: 'Mathematics',
    code: 'MATH-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Calculator',
    color: 'from-violet-600 to-purple-700',
    description: 'Algebra, trigonometry, geometry, calculus, statistics, and probability.',
    topicCount: 30
  },
  {
    id: 'sub-cs',
    name: 'Computer Science',
    code: 'CS-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Laptop',
    color: 'from-cyan-600 to-blue-700',
    description: 'Computer fundamentals, algorithms, database systems, web technology, and programming.',
    topicCount: 18
  },
  {
    id: 'sub-geo',
    name: 'Geography',
    code: 'GEO-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Globe',
    color: 'from-lime-600 to-green-700',
    description: 'Physical geography, map reading, photograph interpretation, regional geography, and GIS.',
    topicCount: 20
  },
  {
    id: 'sub-hist',
    name: 'History',
    code: 'HIST-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Landmark',
    color: 'from-amber-700 to-yellow-800',
    description: 'African history, colonialism, independence movements, world history, and national development.',
    topicCount: 19
  },
  {
    id: 'sub-kisw',
    name: 'Kiswahili',
    code: 'KISW-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'BookOpen',
    color: 'from-rose-600 to-red-700',
    description: 'Sarufi na utumizi wa lugha, fasihi ya Kiswahili, insha, na utamaduni wa Mtanzania.',
    topicCount: 21
  },
  {
    id: 'sub-eng',
    name: 'English Language',
    code: 'ENG-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Languages',
    color: 'from-sky-600 to-blue-800',
    description: 'Grammar, vocabulary, essay writing, literary analysis, and communication skills.',
    topicCount: 20
  },
  {
    id: 'sub-agri',
    name: 'Agriculture',
    code: 'AGRI-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV'],
    iconName: 'Sprout',
    color: 'from-emerald-700 to-green-800',
    description: 'Crop production, soil science, livestock management, agricultural economics, and farm power.',
    topicCount: 16
  },
  {
    id: 'sub-htm',
    name: 'Historia ya Tanzania na Maadili',
    code: 'HTM-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV'],
    iconName: 'Flag',
    color: 'from-blue-700 to-emerald-700',
    description: 'Historia ya Taifa la Tanzania, maadili ya Kitanzania, uraia, na uzalendo.',
    topicCount: 14
  },
  {
    id: 'sub-bk',
    name: 'Bible Knowledge',
    code: 'BK-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV'],
    iconName: 'BookMarked',
    color: 'from-amber-600 to-yellow-700',
    description: 'Old Testament history, the Life and Teaching of Jesus Christ, and early Church history.',
    topicCount: 15
  },
  {
    id: 'sub-ire',
    name: 'Islamic Religious Education',
    code: 'IRE-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV'],
    iconName: 'Moon',
    color: 'from-teal-600 to-emerald-800',
    description: 'Tawheed, Fiqh, Quranic studies, Hadith, and Islamic history.',
    topicCount: 15
  },
  {
    id: 'sub-biz',
    name: 'Business Studies / Commerce',
    code: 'BIZ-01',
    level: 'ORDINARY_SECONDARY',
    forms: ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'],
    iconName: 'Briefcase',
    color: 'from-slate-700 to-indigo-900',
    description: 'Trade, entrepreneurship, finance, marketing, bookkeeping, and economic development.',
    topicCount: 18
  }
];

// Rich Chemistry Sample Content (Form IV Organic Chemistry - Alcohols)
export const FORM4_CHEMISTRY_ALCOHOLS_NOTE: NoteResource = {
  id: 'note-chem-f4-alcohols',
  title: 'Organic Chemistry: Complete Study Guide on Alcohols',
  description: 'Original detailed study notes covering classification, nomenclature, structures, isomerism, preparation of ethanol, chemical reactions, oxidation, and lab tests of alcohols.',
  category: 'NOTE',
  subjectId: 'sub-chem',
  subjectName: 'Chemistry',
  form: 'Form IV',
  topic: 'Organic Chemistry',
  subtopic: 'Alcohols',
  author: 'Madam Grace Mbowe',
  authorRole: 'Head of Chemistry Dept, Kizimba Secondary School',
  uploaderId: 'user-teacher-1',
  dateAdded: '2025-02-10',
  views: 1420,
  downloads: 380,
  rating: 4.9,
  featured: true,
  approvalStatus: 'APPROVED',
  permissionStatus: 'SCHOOL_OWNED',
  readTimeMinutes: 18,
  pdfPages: 8,
  tags: ['Chemistry', 'Form IV', 'Organic Chemistry', 'Alcohols', 'Ethanol', 'Functional Groups'],
  contentMarkdown: `# Organic Chemistry: Comprehensive Guide to Alcohols

## 1. Introduction to Alcohols
Alcohols are organic compounds containing the hydroxyl group (–OH) attached to a saturated carbon atom. The general formula for monohydric aliphatic alcohols is **C_n H_{2n+1} OH** or **R–OH**.

### Key Characteristics:
- Functional Group: Hydroxyl group (–OH)
- General Formula: C_n H_{2n+1} OH
- Suffix in IUPAC: "-ol"

---

## 2. Classification of Alcohols
Alcohols are classified into three major classes depending on the number of alkyl groups attached to the carbon bearing the –OH group:

1. **Primary Alcohols (1°):** The carbon with the –OH group is attached to *one* alkyl group (or none, in methanol).
   - Example: Methanol (CH3OH), Ethanol (CH3CH2OH), Propan-1-ol.
2. **Secondary Alcohols (2°):** The carbon with the –OH group is attached to *two* alkyl groups.
   - Example: Propan-2-ol (CH3–CH(OH)–CH3).
3. **Tertiary Alcohols (3°):** The carbon with the –OH group is attached to *three* alkyl groups.
   - Example: 2-Methylpropan-2-ol ( (CH3)3C–OH ).

---

## 3. IUPAC Nomenclature Rules
1. Identify the longest continuous carbon chain containing the –OH group.
2. Number the carbon chain starting from the end closest to the –OH group.
3. Replace the ending "-e" of the corresponding alkane with "-ol".
4. Indicate the position of the –OH group with a number.

### Examples:
- CH3–CH2–CH2–OH: **Propan-1-ol**
- CH3–CH(OH)–CH3: **Propan-2-ol**
- CH3–CH(CH3)–CH2–OH: **2-methylpropan-1-ol**

---

## 4. Isomerism in Alcohols
Alcohols exhibit two primary types of structural isomerism:
- **Chain Isomerism:** Variation in the arrangement of the carbon skeleton (e.g., Pentan-1-ol vs 3-Methylbutan-1-ol).
- **Position Isomerism:** Variation in the location of the hydroxyl group on the carbon chain (e.g., Propan-1-ol vs Propan-2-ol).
- **Functional Group Isomerism:** Monohydric alcohols are functional group isomers of **ethers** (e.g., Ethanol CH3CH2OH and Dimethyl ether CH3OCH3 share the molecular formula C2H6O).

---

## 5. Physical Properties
- **Boiling Points:** Alcohols have significantly higher boiling points than alkanes of similar molar mass due to **intermolecular hydrogen bonding** between –OH groups.
- **Solubility:** Lower alcohols (methanol, ethanol, propanol) are miscible with water in all proportions due to hydrogen bonding with water molecules. As alkyl chain length increases, solubility decreases.

---

## 6. Preparation of Ethanol
### A. Industrial Preparation by Fermentation of Sugars
Sugars (glucose or sucrose) are converted into ethanol and carbon dioxide by yeast enzymes (zymase) at optimal temperatures (25°C – 35°C) in anaerobic conditions.
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{zymase}} 2\\text{C}_2\\text{H}_5\\text{OH} + 2\\text{CO}_2$$

### B. Hydration of Ethene
Ethene is reacted with steam at 300°C and 60 atm pressure in the presence of a phosphoric acid (H3PO4) catalyst:
$$\\text{C}_2\\text{H}_4 + \\text{H}_2\\text{O} \\rightarrow \\text{C}_2\\text{H}_5\\text{OH}$$

---

## 7. Chemical Properties & Reactions
1. **Combustion:** Alcohols burn in excess oxygen with a clean blue flame producing CO2 and H2O.
   $$\\text{C}_2\\text{H}_5\\text{OH} + 3\\text{O}_2 \\rightarrow 2\\text{CO}_2 + 3\\text{H}_2\\text{O}$$
2. **Reaction with Sodium Metal:** Yields sodium ethoxide and hydrogen gas (bubbles observed).
   $$2\\text{C}_2\\text{H}_5\\text{OH} + 2\\text{Na} \\rightarrow 2\\text{C}_2\\text{H}_5\\text{ONa} + \\text{H}_2\\uparrow$$
3. **Esterification:** Reacts with carboxylic acids in the presence of concentrated H2SO4 catalyst to form sweet-smelling esters.
   $$\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\xrightarrow{\\text{H}_2\\text{SO}_4} \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}$$
4. **Oxidation of Alcohols:**
   - **Primary alcohols** oxidise to *aldehydes*, which further oxidise to *carboxylic acids* (using acidified K2Cr2O7 or KMnO4). Color changes from orange to green (K2Cr2O7).
   - **Secondary alcohols** oxidise to *ketones*.
   - **Tertiary alcohols** resist oxidation under normal conditions.

---

## 8. Laboratory Tests for Alcohols
- **Sodium Metal Test:** Evolution of effervescence (H2 gas) when sodium piece is added.
- **Esterification Test:** Fruity aroma produced when warmed with ethanoic acid and conc. H2SO4.
- **Lucas Reagent Test (Conc. HCl + ZnCl2):**
  - Tertiary alcohols react immediately forming turbidity.
  - Secondary alcohols react within 5–10 minutes.
  - Primary alcohols do not react at room temperature.

---

## 9. Key Uses of Alcohols
- Solvent in pharmaceuticals, perfumes, and cosmetics.
- Biofuel additive blended with petrol.
- Antiseptic agent in hand sanitizers (70% ethanol/isopropanol).
- Feedstock for organic chemical synthesis.
`
};

export const INITIAL_NOTES: NoteResource[] = [
  FORM4_CHEMISTRY_ALCOHOLS_NOTE,
  {
    id: 'note-bio-f4-genetics',
    title: 'Principles of Genetics & Mendel\'s Laws of Inheritance',
    description: 'Comprehensive Form IV Biology notes on monohybrid and dihybrid crosses, DNA structure, mutations, and genetic disorders.',
    category: 'NOTE',
    subjectId: 'sub-bio',
    subjectName: 'Biology',
    form: 'Form IV',
    topic: 'Genetics',
    subtopic: 'Mendelian Inheritance',
    author: 'Mr. Emmanuel Swai',
    authorRole: 'Biology Lead, Kizimba Secondary School',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-01-20',
    views: 1120,
    downloads: 290,
    rating: 4.8,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    readTimeMinutes: 15,
    pdfPages: 6,
    tags: ['Biology', 'Genetics', 'Mendel', 'DNA', 'Form IV'],
    contentMarkdown: `# Principles of Genetics & Mendelian Inheritance

## 1. Fundamental Terms in Genetics
- **Gene:** A hereditary unit consisting of a sequence of DNA that occupies a specific location on a chromosome.
- **Allele:** Alternative form of a gene located at the same locus on homologous chromosomes.
- **Phenotype:** Observable physical or biochemical characteristics of an organism.
- **Genotype:** Genetic makeup of an organism with respect to a specific trait.
- **Dominant Allele:** An allele that expresses its phenotypic effect even when heterozygous.
- **Recessive Allele:** An allele that produces its characteristic phenotype only when homozygous.

## 2. Mendel's First Law: Law of Segregation
During gamete formation, the alleles for each gene segregate from each other so that each gamete carries only one allele for each gene.

### Monohybrid Cross Example:
Crossing pure tall pea plants (TT) with pure dwarf pea plants (tt):
- F1 Generation: All heterozygous tall (Tt)
- F2 Generation Phenotypic Ratio: **3 Tall : 1 Dwarf** (3:1)
- F2 Genotypic Ratio: **1 TT : 2 Tt : 1 tt** (1:2:1)
`
  },
  {
    id: 'note-phy-f4-electronics',
    title: 'Form IV Physics: Electronics & Semiconductor Devices',
    description: 'Detailed study guide covering p-n junctions, diodes, rectifiers, transistors, and logic gates.',
    category: 'NOTE',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    form: 'Form IV',
    topic: 'Electronics',
    subtopic: 'Semiconductors & Diodes',
    author: 'ISAACK EDWARD LUNGWA',
    authorRole: 'Founder & KDLH Admin',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-02-01',
    views: 1890,
    downloads: 540,
    rating: 5.0,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    readTimeMinutes: 20,
    pdfPages: 10,
    tags: ['Physics', 'Electronics', 'Semiconductors', 'Form IV', 'Diodes'],
    contentMarkdown: `# Electronics & Semiconductor Physics

## 1. Intrinsic and Extrinsic Semiconductors
- **Intrinsic Semiconductors:** Pure semiconductor materials (e.g. pure Silicon or Germanium) without doping.
- **Extrinsic Semiconductors:** Doped semiconductors to increase conductivity.
  - **N-type:** Doped with pentavalent impurities (e.g., Phosphorus). Majority carriers = electrons.
  - **P-type:** Doped with trivalent impurities (e.g., Boron). Majority carriers = holes.

## 2. The P-N Junction Diode
When p-type and n-type semiconductors are joined, electrons diffuse across to form a **depletion region**.
- **Forward Bias:** P connected to positive terminal, N to negative. Depletion layer narrows, current flows readily.
- **Reverse Bias:** P connected to negative, N to positive. Depletion layer expands, negligible current.

## 3. Rectification
- **Half-Wave Rectifier:** Uses a single diode to convert AC to pulsating DC (uses only half cycle).
- **Full-Wave Bridge Rectifier:** Uses 4 diodes arranged in a bridge to utilize both positive and negative AC half-cycles.
`
  },
  {
    id: 'note-math-f2-algebra',
    title: 'Form II Mathematics: Linear Equations and Inequalities',
    description: 'Comprehensive guide to solving simultaneous equations, algebraic manipulation, and graph plotting.',
    category: 'NOTE',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    form: 'Form II',
    topic: 'Algebra',
    subtopic: 'Linear Equations',
    author: 'Mr. Josephat Kimaro',
    authorRole: 'Senior Math Tutor',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-01-10',
    views: 870,
    downloads: 210,
    rating: 4.7,
    featured: false,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    readTimeMinutes: 12,
    pdfPages: 5,
    tags: ['Mathematics', 'Form II', 'Algebra', 'Linear Equations']
  }
];

export const INITIAL_PAST_PAPERS: PastPaperResource[] = [
  {
    id: 'pp-chem-f4-2024',
    title: 'NECTA Form IV Chemistry Paper 1 (2024)',
    description: 'Official National Examinations Council of Tanzania (NECTA) CSEE Chemistry Paper 1 with structured theory and calculations.',
    category: 'PAST_PAPER',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'NECTA Past Examination',
    author: 'NECTA / KDLH Academic Unit',
    authorRole: 'National Examination Archive',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-05',
    views: 2450,
    downloads: 920,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'OFFICIAL_SOURCE',
    year: 2024,
    examBody: 'NECTA',
    paperNumber: 'Paper 1',
    hasMarkingScheme: true,
    sourceName: 'NECTA Official Repository',
    sourceUrl: 'https://www.necta.go.tz',
    license: 'Public Educational Access',
    tags: ['NECTA', 'Chemistry', 'Form IV', 'CSEE', '2024']
  },
  {
    id: 'pp-phy-f4-2023',
    title: 'NECTA Form IV Physics Paper 1 (2023)',
    description: 'NECTA Certificate of Secondary Education Examination Physics theory paper with solutions guide.',
    category: 'PAST_PAPER',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    form: 'Form IV',
    topic: 'NECTA Past Examination',
    author: 'NECTA / KDLH Academic Unit',
    authorRole: 'National Examination Archive',
    uploaderId: 'user-admin-1',
    dateAdded: '2024-12-12',
    views: 1980,
    downloads: 780,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'OFFICIAL_SOURCE',
    year: 2023,
    examBody: 'NECTA',
    paperNumber: 'Paper 1',
    hasMarkingScheme: true,
    sourceName: 'NECTA Official Repository',
    sourceUrl: 'https://www.necta.go.tz',
    license: 'Public Educational Access',
    tags: ['NECTA', 'Physics', 'Form IV', 'CSEE', '2023']
  },
  {
    id: 'pp-bio-f4-2023',
    title: 'NECTA Form IV Biology Paper 1 (2023)',
    description: 'CSEE Biology national exam paper focusing on genetics, ecology, human physiology, and plant transport.',
    category: 'PAST_PAPER',
    subjectId: 'sub-bio',
    subjectName: 'Biology',
    form: 'Form IV',
    topic: 'NECTA Past Examination',
    author: 'NECTA / KDLH Academic Unit',
    authorRole: 'National Examination Archive',
    uploaderId: 'user-admin-1',
    dateAdded: '2024-12-10',
    views: 1620,
    downloads: 640,
    featured: false,
    approvalStatus: 'APPROVED',
    permissionStatus: 'OFFICIAL_SOURCE',
    year: 2023,
    examBody: 'NECTA',
    paperNumber: 'Paper 1',
    hasMarkingScheme: true,
    sourceName: 'NECTA Official Repository',
    tags: ['NECTA', 'Biology', 'Form IV', '2023']
  }
];

export const INITIAL_PRACTICALS: PracticalLabResource[] = [
  {
    id: 'prac-chem-alcohols-ethanol',
    title: 'Preparation and Fractional Distillation of Ethanol from Fermentation',
    description: 'Practical lab guide for Form IV Chemistry students on fermenting sucrose, distilling ethanol, and testing its properties.',
    category: 'PRACTICAL',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Organic Chemistry',
    subtopic: 'Alcohols Laboratory Experiment',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Head Teacher',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-12',
    views: 1350,
    downloads: 410,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    objective: 'To prepare ethanol by anaerobic fermentation of glucose solution using yeast and isolate pure ethanol via fractional distillation.',
    apparatus: ['Conical flask', 'Delivery tube', 'Limewater bottle', 'Fractional distillation column', 'Liebig condenser', 'Thermometer (0-110°C)', 'Bunsen burner', 'Measuring cylinder'],
    chemicalsMaterials: ['Glucose/Sucrose sugar (50g)', 'Active dry yeast (10g)', 'Warm water (250cm³)', 'Limewater [Ca(OH)₂]', 'Acidified Potassium Dichromate [K₂Cr₂O₇]'],
    safetyPrecautions: ['Ethanol is highly flammable; ensure no open flames near distilled alcohol receiver bottle.', 'Wear protective goggles and lab apron.', 'Handle conc. H₂SO₄ for dichromate solution with extreme care.'],
    procedureSteps: [
      'Dissolve 50g of sugar in 250cm³ of warm water in a conical flask.',
      'Add 10g of yeast, stir thoroughly, and seal with a cork fitted with a delivery tube dipped into limewater.',
      'Leave in a warm place (30°C) for 3–5 days until bubbling stops.',
      'Filter the fermented mixture into a round-bottom distillation flask.',
      'Set up fractional distillation apparatus with fractionating column, thermometer, and water-cooled condenser.',
      'Heat gently and collect the fraction boiling at 78°C – 80°C.',
      'Test the distillate with sodium metal and acidified K₂Cr₂O₇ solution.'
    ],
    expectedObservations: 'Effervescence in limewater during fermentation forming white precipitate. Distillate is a clear liquid with characteristic fruity odor that turns acidified potassium dichromate from orange to green upon gentle heating.',
    calculationsFormulae: 'Percentage Yield = (Mass of Ethanol Collected / Theoretical Mass from C6H12O6 -> 2C2H5OH + 2CO2) * 100%',
    tags: ['Practical', 'Chemistry', 'Form IV', 'Ethanol', 'Fermentation', 'Distillation']
  },
  {
    id: 'prac-phy-pendulum',
    title: 'Determination of Acceleration Due to Gravity (g) Using Simple Pendulum',
    description: 'Standard Physics Form IV practical experiment measuring periodic time against pendulum length.',
    category: 'PRACTICAL',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    form: 'Form IV',
    topic: 'Mechanics',
    subtopic: 'Simple Pendulum Oscillations',
    author: 'ISAACK EDWARD LUNGWA',
    authorRole: 'Founder & KDLH Admin',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-25',
    views: 1100,
    downloads: 320,
    featured: false,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    objective: 'To determine the acceleration due to gravity (g) in Kizimba laboratory using pendulum oscillations.',
    apparatus: ['Pendulum bob', 'Inextensible string (100cm)', 'Retort stand with clamp', 'Split cork', 'Stopwatch', 'Meter rule'],
    chemicalsMaterials: ['N/A'],
    safetyPrecautions: ['Ensure small angle of oscillation (theta < 10°).', 'Avoid draughts/wind during timing.'],
    procedureSteps: [
      'Set up pendulum string length L = 90cm.',
      'Displace bob slightly and release.',
      'Time 20 complete oscillations using stopwatch.',
      'Repeat for L = 80, 70, 60, 50cm.',
      'Plot graph of T² vs L and determine slope.'
    ],
    expectedObservations: 'T² is directly proportional to L. Slope = 4pi² / g.',
    calculationsFormulae: 'g = 4 * pi² / Slope',
    tags: ['Physics', 'Practical', 'Form IV', 'Gravity', 'Pendulum']
  }
];

export const INITIAL_VIDEOS: VideoResource[] = [
  {
    id: 'vid-chem-alcohols-mastery',
    title: 'Masterclass: Organic Chemistry - Naming, Reactions & Tests of Alcohols',
    description: 'Complete step-by-step video lesson explaining structural representations, oxidation mechanisms, and esterification of alcohols for Form IV & Form VI students.',
    category: 'VIDEO',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Organic Chemistry',
    subtopic: 'Alcohols Masterclass',
    author: 'Madam Grace Mbowe',
    authorRole: 'Head of Chemistry',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-14',
    views: 3200,
    downloads: 450,
    rating: 4.9,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'AUTHORIZED',
    videoUrl: 'https://www.youtube.com/embed/bS4t9g8_CgA', // Chemistry organic alcohols tutorial
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 1420,
    difficulty: 'INTERMEDIATE',
    isTutorial: false,
    tags: ['Video', 'Chemistry', 'Form IV', 'Alcohols', 'Organic Chemistry']
  },
  {
    id: 'vid-chem-titration-prac',
    title: 'Practical Video: Acid-Base Titration & Volumetric Analysis',
    description: 'Laboratory demonstration showing correct burette reading, indicator color change at endpoint, and stoichiometry calculation.',
    category: 'VIDEO',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Acids and Bases',
    subtopic: 'Acid-Base Titration Practical',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Head Teacher',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-10',
    views: 2950,
    downloads: 510,
    rating: 5.0,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'AUTHORIZED',
    videoUrl: 'https://www.youtube.com/embed/406JvPz3U1U', // Titration practical lesson
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 1050,
    difficulty: 'INTERMEDIATE',
    isTutorial: true,
    tags: ['Practical Video', 'Chemistry', 'Form IV', 'Titration', 'Volumetric Analysis']
  },
  {
    id: 'vid-phy-circuits-tut',
    title: 'Tutorial: Solving Complex Resistor Networks & Kirchhoff\'s Laws',
    description: 'Clear chalkboard step-by-step problem-solving tutorial for series, parallel, and bridge circuits.',
    category: 'TUTORIAL',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    form: 'Form IV',
    topic: 'Current Electricity',
    subtopic: 'Kirchhoff\'s Circuit Laws',
    author: 'ISAACK EDWARD LUNGWA',
    authorRole: 'Founder & KDLH Creator',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-28',
    views: 2890,
    downloads: 610,
    rating: 5.0,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'AUTHORIZED',
    videoUrl: 'https://www.youtube.com/embed/m4jzgqZu-4s', // Kirchhoff laws physics tutorial
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 1180,
    difficulty: 'INTERMEDIATE',
    isTutorial: true,
    tags: ['Physics', 'Tutorial', 'Circuits', 'Form IV']
  }
];

export const INITIAL_BOOKS: BookResource[] = [
  {
    id: 'book-chem-advanced',
    title: 'Fundamentals of Advanced Secondary Chemistry (Form V & VI)',
    description: 'Authorized reference digital textbook covering physical, inorganic, and organic chemistry for upper secondary students in Tanzania.',
    category: 'BOOK',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form V',
    topic: 'General Chemistry Library',
    author: 'KDLH Academic Editorial Team',
    authorRole: 'Publishing Board',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-02',
    views: 1840,
    downloads: 710,
    rating: 4.8,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'OPEN_LICENSE',
    publisher: 'Kizimba Academic Press',
    publishedYear: 2024,
    isbn: '978-9987-123-45-6',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    pageCount: 380,
    tags: ['Textbook', 'Chemistry', 'Form V', 'Form VI', 'Open Library']
  },
  {
    id: 'book-bio-ordinary',
    title: 'Ordinary Level Secondary Biology Comprehensive Reference',
    description: 'Complete syllabus guide for Form I to Form IV biology students with diagrams and review questions.',
    category: 'BOOK',
    subjectId: 'sub-bio',
    subjectName: 'Biology',
    form: 'Form IV',
    topic: 'Biology Library',
    author: 'Dr. J. M. Mabula & KDLH Editors',
    authorRole: 'Senior Academic Consultants',
    uploaderId: 'user-admin-1',
    dateAdded: '2024-11-20',
    views: 2100,
    downloads: 890,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'OPEN_LICENSE',
    publisher: 'Kizimba Academic Press',
    publishedYear: 2023,
    isbn: '978-9987-987-65-4',
    coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    pageCount: 420,
    tags: ['Biology', 'Textbook', 'Form I-IV', 'Library']
  }
];

export const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 'q-chem-alc-1',
    title: 'Oxidation product of Primary Alcohols',
    description: 'Identify intermediate and final products during complete oxidation of primary alcohols.',
    category: 'QUESTION',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Organic Chemistry',
    subtopic: 'Alcohols',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Teacher',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-11',
    views: 890,
    downloads: 120,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    questionType: 'MULTIPLE_CHOICE',
    questionText: 'When ethanol is gently warmed with acidified potassium dichromate (VI) solution under reflux, what is the final organic product formed?',
    options: [
      'A. Ethanal (an aldehyde)',
      'B. Ethanoic acid (a carboxylic acid)',
      'C. Propanone (a ketone)',
      'D. Ethene (an alkene)'
    ],
    correctAnswer: 'B. Ethanoic acid (a carboxylic acid)',
    explanation: 'Primary alcohols like ethanol oxidise first to aldehydes (ethanal) and upon prolonged reflux with excess acidified K2Cr2O7 oxidise completely to carboxylic acids (ethanoic acid). The dichromate changes color from orange to green.',
    marks: 2,
    examYear: 2024,
    tags: ['Chemistry', 'Form IV', 'Alcohols', 'Multiple Choice']
  },
  {
    id: 'q-chem-alc-2',
    title: 'Preparation of Ethanol Reaction Balance',
    description: 'Short answer calculation and chemical equation balancing.',
    category: 'QUESTION',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Organic Chemistry',
    subtopic: 'Alcohols',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Teacher',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-11',
    views: 740,
    downloads: 95,
    featured: false,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    questionType: 'SHORT_ANSWER',
    questionText: 'Write a balanced chemical equation for the reaction between ethanol and sodium metal. Name the gas evolved during this reaction.',
    correctAnswer: 'Equation: 2 C2H5OH(l) + 2 Na(s) -> 2 C2H5ONa(alc) + H2(g). Gas evolved: Hydrogen gas (H2).',
    explanation: 'Sodium reacts with alcohols similarly to water, displacing hydrogen from the hydroxyl group to form sodium ethoxide and hydrogen gas.',
    marks: 4,
    examYear: 2023,
    tags: ['Chemistry', 'Form IV', 'Equations', 'Alcohols']
  },
  {
    id: 'q-phy-ohm-1',
    title: 'Ohm\'s Law Circuit Calculation',
    description: 'Calculate total resistance and circuit current.',
    category: 'QUESTION',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    form: 'Form IV',
    topic: 'Current Electricity',
    subtopic: 'Ohm\'s Law',
    author: 'ISAACK EDWARD LUNGWA',
    authorRole: 'Founder',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-30',
    views: 1050,
    downloads: 210,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    questionType: 'CALCULATION',
    questionText: 'Two resistors of 6 ohms and 12 ohms are connected in parallel across a 12V DC power source. Calculate: (a) Total effective resistance of the circuit, (b) Total current supplied by the source.',
    correctAnswer: '(a) R_total = (6 * 12) / (6 + 12) = 72 / 18 = 4 Ohms. (b) I = V / R = 12V / 4 Ohms = 3.0 Amperes.',
    explanation: 'For parallel resistors, 1/R_eq = 1/R1 + 1/R2. Then apply Ohm\'s Law I = V / R_eq.',
    marks: 5,
    examYear: 2024,
    tags: ['Physics', 'Form IV', 'Circuits', 'Calculation']
  }
];

export const INITIAL_AUDIO: AudioResource[] = [
  {
    id: 'audio-chem-alcohols-summary',
    title: 'Audio Lesson: Rapid Revision of Organic Alcohols (12 Mins)',
    description: 'Clear spoken summary of functional groups, IUPAC rules, Lucas test, and esterification reactions designed for easy listening on phones.',
    category: 'AUDIO',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Organic Chemistry',
    subtopic: 'Audio Revision',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Department',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-13',
    views: 940,
    downloads: 310,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'AUTHORIZED',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Valid MP3 stream
    durationSeconds: 720,
    audioCategory: 'LESSON',
    speaker: 'Madam Grace Mbowe',
    tags: ['Audio', 'Chemistry', 'Form IV', 'Revision']
  },
  {
    id: 'audio-podcast-study-habits',
    title: 'KDLH Podcast Episode 1: How to Master NECTA Examinations',
    description: 'Inspirational study advice by founder ISAACK EDWARD LUNGWA on timetable planning, active recall, and scientific revision methods.',
    category: 'AUDIO',
    subjectId: 'sub-cs',
    subjectName: 'General Studies / Motivation',
    form: 'Form IV',
    topic: 'Study Skills',
    subtopic: 'Exam Strategy',
    author: 'ISAACK EDWARD LUNGWA',
    authorRole: 'Founder & Creator',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-02-01',
    views: 2150,
    downloads: 820,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'AUTHORIZED',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Valid MP3 stream
    durationSeconds: 900,
    audioCategory: 'PODCAST',
    speaker: 'ISAACK EDWARD LUNGWA',
    tags: ['Podcast', 'Motivation', 'Exam Prep', 'ISAACK EDWARD LUNGWA']
  }
];

export const INITIAL_MUSIC: MusicResource[] = [
  {
    id: 'music-kdlh-anthem',
    title: 'Official Kizimba Secondary School Anthem',
    description: 'Authorized recording of the official Kizimba Secondary School anthem promoting excellence, integrity, and knowledge.',
    category: 'MUSIC',
    subjectId: 'sub-htm',
    subjectName: 'School Culture & Arts',
    form: 'Form I-VI',
    topic: 'School Anthem',
    author: 'Kizimba Choir & Band',
    authorRole: 'School Cultural Unit',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-01',
    views: 3100,
    downloads: 1200,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'AUTHORIZED',
    artist: 'Kizimba Choir',
    songTitle: 'Kizimba School Anthem (Wimbo wa Shule)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    durationSeconds: 210,
    rightsRecord: {
      id: 'rr-kdlh-01',
      artist: 'Kizimba Choir',
      songTitle: 'Kizimba School Anthem',
      publisher: 'Kizimba Secondary School Administration',
      rightsOwner: 'Kizimba Secondary School',
      licenseType: 'School Owned & Openly Licensed',
      uploadStatus: 'AUTHORIZED',
      approvalStatus: 'APPROVED',
      sourceUrl: 'https://kizimba.ac.tz/music'
    },
    tags: ['Music', 'School Anthem', 'Kizimba']
  },
  {
    id: 'music-tanzania-mungu-ibariki',
    title: 'Wimbo wa Taifa: Mungu Ibariki Afrika (Official Instrumental)',
    description: 'National Anthem of the United Republic of Tanzania (Public Domain educational audio).',
    category: 'MUSIC',
    subjectId: 'sub-htm',
    subjectName: 'Historia ya Tanzania na Maadili',
    form: 'Form I-VI',
    topic: 'National Symbols',
    author: 'Tanzania National Heritage',
    authorRole: 'Public Domain Archive',
    uploaderId: 'user-admin-1',
    dateAdded: '2025-01-01',
    views: 4200,
    downloads: 1500,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'PUBLIC_DOMAIN',
    artist: 'National Brass Band',
    songTitle: 'Mungu Ibariki Afrika',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    durationSeconds: 150,
    rightsRecord: {
      id: 'rr-nat-01',
      artist: 'National Brass Band',
      songTitle: 'Mungu Ibariki Afrika',
      publisher: 'Public Domain',
      rightsOwner: 'United Republic of Tanzania (Public Domain)',
      licenseType: 'Public Domain Educational Asset',
      uploadStatus: 'PUBLIC_DOMAIN',
      approvalStatus: 'APPROVED',
      sourceUrl: 'https://www.tanzania.go.tz'
    },
    tags: ['National Anthem', 'Tanzania', 'Public Domain']
  }
];

export const INITIAL_STUDENTS = [
  { id: 'std-001', name: 'Juma Baraka', admissionNumber: 'KDLH-2023-014', form: 'Form IV', className: 'Form IV A', bestSubject: 'Chemistry', averageScore: 84 },
  { id: 'std-002', name: 'Neema John', admissionNumber: 'KDLH-2023-028', form: 'Form IV', className: 'Form IV A', bestSubject: 'Physics', averageScore: 91 },
  { id: 'std-003', name: 'Baraka Said', admissionNumber: 'KDLH-2023-035', form: 'Form IV', className: 'Form IV B', bestSubject: 'Mathematics', averageScore: 78 },
  { id: 'std-004', name: 'Amina Hassan', admissionNumber: 'KDLH-2024-002', form: 'Form II', className: 'Form II A', bestSubject: 'Biology', averageScore: 88 },
  { id: 'std-005', name: 'David Emmanuel', admissionNumber: 'KDLH-2022-009', form: 'Form VI', className: 'Form VI PCB', bestSubject: 'Chemistry', averageScore: 82 }
];

export const INITIAL_TEACHING_RECORDS: WeeklyTeachingRecord[] = [
  {
    id: 'tr-wk6-chem',
    date: '2025-02-14',
    subject: 'Chemistry',
    form: 'Form IV',
    className: 'Form IV A',
    topic: 'Organic Chemistry',
    subtopic: 'Preparation and Oxidation of Alcohols',
    whatWasTaught: 'Taught structural formulas of primary, secondary, and tertiary alcohols. Demonstrated Lucas reagent test and dichromate oxidation in lab.',
    learningObjective: 'Students should differentiate alcohol classes and write oxidation reaction equations.',
    activity: 'Double period practical demonstration and group problem solving.',
    assessment: 'Class test of 5 short answer questions on IUPAC naming and reactions.',
    remarks: 'Class engagement was high. 85% of students scored above 70% in the quick test.',
    teacherId: 'user-teacher-1',
    teacherName: 'Madam Grace Mbowe'
  },
  {
    id: 'tr-wk6-phy',
    date: '2025-02-13',
    subject: 'Physics',
    form: 'Form IV',
    className: 'Form IV A',
    topic: 'Current Electricity',
    subtopic: 'Kirchhoff\'s Junction and Loop Laws',
    whatWasTaught: 'Derived Kirchhoff\'s first and second laws. Solved simultaneous linear equations for complex multiloop circuits.',
    learningObjective: 'Apply loop rule to determine current in any resistor in a network.',
    activity: 'Chalkboard worked examples followed by individual student worksheet practice.',
    assessment: 'Worksheet with 3 circuit calculation problems.',
    remarks: '12 students required additional coaching on simultaneous equation substitution.',
    teacherId: 'user-admin-1',
    teacherName: 'ISAACK EDWARD LUNGWA'
  }
];

export const INITIAL_STUDENT_REPORTS: WeeklyStudentReport[] = [
  {
    id: 'rep-wk6-std001',
    weekNumber: 6,
    datesRange: '10 Feb 2025 - 14 Feb 2025',
    studentId: 'std-001',
    studentName: 'Juma Baraka',
    admissionNumber: 'KDLH-2023-014',
    form: 'Form IV',
    className: 'Form IV A',
    subjectsTaught: ['Chemistry', 'Physics', 'Mathematics', 'Biology'],
    topicsCovered: ['Organic Chemistry (Alcohols)', 'Current Electricity', 'Quadratic Equations', 'Genetics'],
    testsConducted: ['Chemistry Topic Quiz 4', 'Physics Circuit Test'],
    marksObtained: [
      { subject: 'Chemistry', score: 18, total: 20, grade: 'A' },
      { subject: 'Physics', score: 16, total: 20, grade: 'B+' },
      { subject: 'Mathematics', score: 15, total: 20, grade: 'B' },
      { subject: 'Biology', score: 19, total: 20, grade: 'A' }
    ],
    attendanceDays: 5,
    totalSchoolDays: 5,
    homeworkStatus: 'Completed all 4 assignments on time',
    strengths: ['Excellent grasp of Organic Chemistry structures', 'Consistently active in lab practicals'],
    weaknesses: ['Needs careful checking of algebraic signs in Physics loop calculations'],
    teacherComments: 'Juma has demonstrated impressive academic dedication this week. His performance in Chemistry practical analysis was exemplary.',
    recommendedImprovement: 'Practice 5 extra Kirchhoff circuit problems from NECTA 2022 past paper.',
    teacherName: 'Madam Grace Mbowe',
    dateGenerated: '2025-02-14'
  },
  {
    id: 'rep-wk6-std002',
    weekNumber: 6,
    datesRange: '10 Feb 2025 - 14 Feb 2025',
    studentId: 'std-002',
    studentName: 'Neema John',
    admissionNumber: 'KDLH-2023-028',
    form: 'Form IV',
    className: 'Form IV A',
    subjectsTaught: ['Chemistry', 'Physics', 'Mathematics', 'Biology'],
    topicsCovered: ['Organic Chemistry (Alcohols)', 'Current Electricity', 'Quadratic Equations', 'Genetics'],
    testsConducted: ['Chemistry Topic Quiz 4', 'Physics Circuit Test'],
    marksObtained: [
      { subject: 'Chemistry', score: 20, total: 20, grade: 'A+' },
      { subject: 'Physics', score: 20, total: 20, grade: 'A+' },
      { subject: 'Mathematics', score: 19, total: 20, grade: 'A' },
      { subject: 'Biology', score: 20, total: 20, grade: 'A+' }
    ],
    attendanceDays: 5,
    totalSchoolDays: 5,
    homeworkStatus: 'Completed all assignments with distinction',
    strengths: ['Flawless problem solving', 'Assists peers during study group sessions'],
    weaknesses: ['None identified this week'],
    teacherComments: 'Neema continues to be top of her class. She shows exceptional scientific rigor and clarity in both theory and practical examinations.',
    recommendedImprovement: 'Attempt Advanced Level Form V challenge questions on organic mechanisms.',
    teacherName: 'ISAACK EDWARD LUNGWA',
    dateGenerated: '2025-02-14'
  }
];

export const INITIAL_TEACHER_RESOURCES: TeacherResourceItem[] = [
  {
    id: 'tr-chem-f4-scheme',
    title: 'Form IV Chemistry Annual Scheme of Work (2025 Official)',
    description: 'Complete week-by-week teaching schedule aligned with current Ministry of Education / TIE curriculum guidelines.',
    category: 'TEACHER_RESOURCE',
    resourceSubtype: 'SCHEME_OF_WORK',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Annual Teaching Schedule',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Head of Dept',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-01-08',
    views: 650,
    downloads: 320,
    featured: true,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    tags: ['Scheme of Work', 'Teacher', 'Chemistry', 'Form IV', '2025']
  },
  {
    id: 'tr-chem-alc-lp',
    title: 'Detailed Lesson Plan: Organic Chemistry - Preparation & Tests of Alcohols',
    description: 'Sample 80-minute double period lesson plan with learning objectives, teacher activities, student tasks, teaching aids, and assessment rubrics.',
    category: 'TEACHER_RESOURCE',
    resourceSubtype: 'LESSON_PLAN',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    topic: 'Organic Chemistry',
    subtopic: 'Alcohols Lesson Plan',
    author: 'Madam Grace Mbowe',
    authorRole: 'Chemistry Head of Dept',
    uploaderId: 'user-teacher-1',
    dateAdded: '2025-02-09',
    views: 480,
    downloads: 210,
    featured: false,
    approvalStatus: 'APPROVED',
    permissionStatus: 'SCHOOL_OWNED',
    tags: ['Lesson Plan', 'Chemistry', 'Form IV', 'Alcohols']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Organic Chemistry Guide Published',
    message: 'Madam Grace Mbowe uploaded new comprehensive study notes on Alcohols for Form IV Chemistry.',
    date: '2025-02-14 09:30',
    read: false,
    type: 'NEW_CONTENT',
    targetRole: 'STUDENT',
    linkRoute: '/notes'
  },
  {
    id: 'notif-2',
    title: 'KDLH AI Assistant Updated',
    message: 'Founder ISAACK EDWARD LUNGWA integrated grounded KDLH study materials into the AI Learning Assistant.',
    date: '2025-02-12 14:00',
    read: false,
    type: 'AI',
    linkRoute: '/ai-assistant'
  },
  {
    id: 'notif-3',
    title: 'Resource Approval Pending',
    message: 'New Physics tutorial video pending review in Admin Control Center.',
    date: '2025-02-10 11:15',
    read: true,
    type: 'APPROVAL',
    targetRole: 'ADMIN',
    linkRoute: '/admin'
  }
];

export const INITIAL_CMS_SETTINGS: CmsSettings = {
  heroTitle: 'KIZIMBA DIGITAL LEARNING HUB',
  heroSubtitle: 'One digital space for learning, revision, practicals, educational resources, and intelligent academic support.',
  tagline: 'LEARN • PRACTICE • ASK • IMPROVE',
  featuredResourceIds: ['note-chem-f4-alcohols', 'pp-chem-f4-2024', 'prac-chem-alcohols-ethanol', 'vid-chem-alcohols-mastery'],
  announcementText: 'Welcome to KDLH! Explore Form IV Organic Chemistry Notes, NECTA Past Papers, and Practical Guides.',
  contactEmail: 'info@kizimba.ac.tz',
  contactPhone: '+255 700 000 000'
};
