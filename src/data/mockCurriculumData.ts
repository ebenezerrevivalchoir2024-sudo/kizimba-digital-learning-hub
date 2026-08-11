import { 
  ExamPaper, 
  ScannedExamScript, 
  SchemeOfWork, 
  LessonPlan, 
  NoteSummary, 
  CurriculumTopic, 
  StudentTopicProgress 
} from '../types';

export const INITIAL_CURRICULUM_TOPICS: CurriculumTopic[] = [
  // FORM IV CHEMISTRY
  {
    id: 'topic-chem-f4-1',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    level: 'ORDINARY_SECONDARY',
    name: 'Organic Chemistry - Alcohols & Carboxylic Acids',
    description: 'Nomenclature, preparation, physical/chemical properties, and industrial applications of alcohols and carboxylic acids.',
    orderIndex: 1,
    subtopics: [
      {
        id: 'subtopic-chem-f4-1-1',
        topicId: 'topic-chem-f4-1',
        name: 'Naming & Structure of Alcohols',
        competencies: ['Apply IUPAC rules to name alcohols up to 5 carbon atoms', 'Draw structural formulas of primary, secondary, and tertiary alcohols'],
        linkedResourceIds: ['note-chem-f4-alcohols', 'video-chem-f4-alcohols', 'pp-2023-chem-p1']
      },
      {
        id: 'subtopic-chem-f4-1-2',
        topicId: 'topic-chem-f4-1',
        name: 'Preparation & Properties of Ethanol',
        competencies: ['Perform glucose fermentation in laboratory', 'Demonstrate oxidation of ethanol using potassium dichromate'],
        linkedResourceIds: ['prac-chem-f4-titration', 'note-chem-f4-alcohols']
      }
    ]
  },
  {
    id: 'topic-chem-f4-2',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    form: 'Form IV',
    level: 'ORDINARY_SECONDARY',
    name: 'Qualitative Analysis',
    description: 'Identification of cations, anions, and gases using characteristic chemical tests and flame tests.',
    orderIndex: 2,
    subtopics: [
      {
        id: 'subtopic-chem-f4-2-1',
        topicId: 'topic-chem-f4-2',
        name: 'Identification of Cations (Fe2+, Fe3+, Cu2+, Zn2+, Pb2+, NH4+)',
        competencies: ['Use aqueous sodium hydroxide and ammonia solution to identify cations', 'Write ionic equations for precipitation reactions'],
        linkedResourceIds: ['prac-chem-f4-titration']
      }
    ]
  },
  // FORM II PHYSICS
  {
    id: 'topic-phys-f2-1',
    subjectId: 'sub-phys',
    subjectName: 'Physics',
    form: 'Form II',
    level: 'ORDINARY_SECONDARY',
    name: 'Current Electricity & Ohm\'s Law',
    description: 'Electric current, potential difference, resistance, Ohm\'s Law, and simple electric circuits.',
    orderIndex: 1,
    subtopics: [
      {
        id: 'subtopic-phys-f2-1-1',
        topicId: 'topic-phys-f2-1',
        name: 'Ohm\'s Law & Circuit Calculations',
        competencies: ['State Ohm\'s law and apply V=IR in series and parallel circuits', 'Calculate effective resistance'],
        linkedResourceIds: ['note-phys-f2-electricity', 'video-phys-f2-circuits']
      }
    ]
  },
  // FORM IV BIOLOGY
  {
    id: 'topic-bio-f4-1',
    subjectId: 'sub-bio',
    subjectName: 'Biology',
    form: 'Form IV',
    level: 'ORDINARY_SECONDARY',
    name: 'Genetics & Mendelian Inheritance',
    description: 'Monohybrid cross, genes, alleles, phenotype, genotype, and genetic engineering principles.',
    orderIndex: 1,
    subtopics: [
      {
        id: 'subtopic-bio-f4-1-1',
        topicId: 'topic-bio-f4-1',
        name: 'Monohybrid Cross & Punnett Squares',
        competencies: ['Construct Punnett squares for monohybrid inheritance', 'Calculate phenotypic and genotypic ratios'],
        linkedResourceIds: ['note-bio-f4-genetics']
      }
    ]
  }
];

export const INITIAL_EXAMS: ExamPaper[] = [
  {
    id: 'exam-chem-f4-term1',
    title: 'Form IV Chemistry Terminal Examination 2026',
    form: 'Form IV',
    subject: 'Chemistry',
    topic: 'Organic Chemistry & Qualitative Analysis',
    date: '2026-06-15',
    durationMinutes: 180,
    totalMarks: 100,
    instructions: 'Answer ALL questions in Section A and B. Show all chemical equations and calculations step by step.',
    academicYear: '2026',
    createdByTeacherId: 'teacher-lungwa',
    isPublished: true,
    questions: [
      {
        id: 'q1',
        questionNumber: 1,
        questionText: 'Define functional group and state the functional group of Alcohols.',
        topic: 'Organic Chemistry',
        questionType: 'SHORT_ANSWER',
        maxMarks: 2,
        expectedAnswer: 'A functional group is an atom or group of atoms responsible for the characteristic chemical properties of an organic compound. The functional group of alcohols is hydroxyl (-OH).',
        markingPoints: [
          { id: 'mp1-1', pointNumber: 1, description: 'Correct definition of functional group', marks: 1 },
          { id: 'mp1-2', pointNumber: 2, description: 'Identification of hydroxyl group (-OH)', marks: 1 }
        ]
      },
      {
        id: 'q2',
        questionNumber: 2,
        questionText: 'Write a balanced chemical equation for the oxidation of ethanol using acidified potassium dichromate.',
        topic: 'Organic Chemistry',
        questionType: 'SHORT_ANSWER',
        maxMarks: 3,
        expectedAnswer: 'CH3CH2OH + 2[O] -> CH3COOH + H2O (or via CH3CHO intermediate).',
        markingPoints: [
          { id: 'mp2-1', pointNumber: 1, description: 'Ethanal (acetaldehyde) intermediate', marks: 1 },
          { id: 'mp2-2', pointNumber: 2, description: 'Ethanoic acid final oxidation product', marks: 1 },
          { id: 'mp2-3', pointNumber: 3, description: 'Correct balancing and water byproduct', marks: 1 }
        ]
      },
      {
        id: 'q3',
        questionNumber: 3,
        questionText: 'Calculate the percentage yield of ethanol if 180g of glucose yields 46g of ethanol during fermentation.',
        topic: 'Stoichiometry & Fermentation',
        questionType: 'CALCULATION',
        maxMarks: 5,
        expectedAnswer: 'Equation: C6H12O6 -> 2 C2H5OH + 2 CO2. Molar mass glucose = 180g/mol. 180g glucose gives 2 * 46g = 92g ethanol theoretically. Actual yield = 46g. Percentage yield = (46/92) * 100% = 50%.',
        markingPoints: [
          { id: 'mp3-1', pointNumber: 1, description: 'Fermentation reaction equation', marks: 1 },
          { id: 'mp3-2', pointNumber: 2, description: 'Molar masses setup', marks: 1 },
          { id: 'mp3-3', pointNumber: 3, description: 'Theoretical yield calculation (92g)', marks: 1 },
          { id: 'mp3-4', pointNumber: 4, description: 'Percentage yield formula setup', marks: 1 },
          { id: 'mp3-5', pointNumber: 5, description: 'Final answer 50% with units', marks: 1 }
        ]
      },
      {
        id: 'q4',
        questionNumber: 4,
        questionText: 'Draw and label a simple laboratory distillation apparatus used to separate ethanol from water.',
        topic: 'Practical Apparatus',
        questionType: 'STRUCTURED',
        maxMarks: 5,
        expectedAnswer: 'Diagram showing distillation flask with fractionating column, thermometer at outlet height, liebig condenser with water inlet/outlet, and receiver flask.',
        markingPoints: [
          { id: 'mp4-1', pointNumber: 1, description: 'Distillation flask setup', marks: 1 },
          { id: 'mp4-2', pointNumber: 2, description: 'Liebig condenser orientation', marks: 1 },
          { id: 'mp4-3', pointNumber: 3, description: 'Thermometer bulb height at distillation head', marks: 1 },
          { id: 'mp4-4', pointNumber: 4, description: 'Water inlet (bottom) and outlet (top) arrows', marks: 1 },
          { id: 'mp4-5', pointNumber: 5, description: 'Collection receiver flask', marks: 1 }
        ]
      }
    ]
  }
];

export const INITIAL_SCANNED_SCRIPTS: ScannedExamScript[] = [
  {
    id: 'script-juma-001',
    examId: 'exam-chem-f4-term1',
    examTitle: 'Form IV Chemistry Terminal Examination 2026',
    studentId: 'student-juma',
    studentName: 'Juma Baraka',
    form: 'Form IV',
    subject: 'Chemistry',
    teacherId: 'teacher-lungwa',
    teacherName: 'Mwl. Isaack Edward Lungwa',
    scanDate: '2026-08-10 14:30',
    scannedPages: [
      {
        id: 'page-1',
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        confidence: 96,
        processedText: 'Page 1: Q1 Functional group definition and alcohol hydroxyl group -OH. Q2 Oxidation reaction equation.',
        adjustments: { brightness: 100, contrast: 105, rotate: 0, cropApplied: true }
      },
      {
        id: 'page-2',
        pageNumber: 2,
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
        confidence: 94,
        processedText: 'Page 2: Q3 Fermentation percentage yield calculation steps (180g glucose -> 46g ethanol).',
        adjustments: { brightness: 100, contrast: 100, rotate: 0, cropApplied: false }
      },
      {
        id: 'page-3',
        pageNumber: 3,
        imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
        confidence: 82,
        processedText: 'Page 3: Q4 Handdrawn diagram of distillation apparatus with condenser and thermometer.',
        adjustments: { brightness: 110, contrast: 115, rotate: 0, cropApplied: true }
      }
    ],
    overallScore: 13,
    totalMarks: 15,
    percentage: 87,
    grade: 'A',
    ocrConfidence: 94,
    markingConfidence: 91,
    status: 'NEEDS_TEACHER_REVIEW',
    questionResults: [
      {
        questionId: 'q1',
        questionNumber: 1,
        questionText: 'Define functional group and state the functional group of Alcohols.',
        studentAnswerText: 'A functional group is an atom or group of atoms in an organic molecule that determines its characteristic chemical properties. For alcohols, the functional group is hydroxyl group (-OH).',
        expectedAnswerText: 'Functional group: Atom/group responsible for chemical properties (1 mark). Hydroxyl group / -OH (1 mark).',
        maxMarks: 2,
        awardedMarks: 2,
        confidence: 96,
        explanation: 'Student correctly defined functional group and accurately identified the hydroxyl (-OH) group.',
        markingPointsBreakdown: [
          { pointDescription: 'Definition of functional group', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Identification of hydroxyl (-OH) group', awarded: 1, max: 1, status: 'CORRECT' }
        ],
        diagramDetected: false,
        isUncertain: false
      },
      {
        questionId: 'q2',
        questionNumber: 2,
        questionText: 'Write a balanced chemical equation for the oxidation of ethanol using acidified potassium dichromate.',
        studentAnswerText: 'CH3CH2OH + [O] -> CH3CHO + H2O and then CH3CHO + [O] -> CH3COOH',
        expectedAnswerText: 'CH3CH2OH + 2[O] -> CH3COOH + H2O (Or stepwise: ethanol to ethanal then ethanoic acid).',
        maxMarks: 3,
        awardedMarks: 3,
        confidence: 94,
        explanation: 'Stepwise oxidation mechanism shown correctly including formation of ethanal and ethanoic acid.',
        markingPointsBreakdown: [
          { pointDescription: 'Ethanal intermediate step', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Ethanoic acid final product', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Water byproduct & balancing', awarded: 1, max: 1, status: 'CORRECT' }
        ],
        diagramDetected: false,
        isUncertain: false
      },
      {
        questionId: 'q3',
        questionNumber: 3,
        questionText: 'Calculate the percentage yield of ethanol if 180g of glucose yields 46g of ethanol during fermentation.',
        studentAnswerText: 'Theoretical mass = 92g from equation C6H12O6 -> 2 C2H5OH + 2 CO2. % Yield = (46g / 92g) * 100% = 50%',
        expectedAnswerText: 'Molar mass glucose = 180g/mol. 1 mol produces 2 mol ethanol = 92g. Actual = 46g. % Yield = 46/92 * 100 = 50%.',
        maxMarks: 5,
        awardedMarks: 5,
        confidence: 98,
        explanation: 'Calculation steps, stoichiometric ratio (1:2), and final percentage yield of 50% are completely accurate.',
        markingPointsBreakdown: [
          { pointDescription: 'Fermentation balanced equation setup', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Molar mass calculations for glucose & ethanol', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Theoretical yield calculation (92g)', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Percentage yield formula application', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Final answer 50% with correct unit', awarded: 1, max: 1, status: 'CORRECT' }
        ],
        diagramDetected: false,
        isUncertain: false
      },
      {
        questionId: 'q4',
        questionNumber: 4,
        questionText: 'Draw and label a simple laboratory distillation apparatus used to separate ethanol from water.',
        studentAnswerText: '[Handwritten diagram scanned with round bottom flask, fractionating column, condenser, thermometer, receiver flask]',
        expectedAnswerText: 'Diagram showing: Round bottom flask (1), Fractionating column (1), Liebig condenser with water inlet/outlet (1), Thermometer at bulb height (1), Collection vessel (1).',
        maxMarks: 5,
        awardedMarks: 3,
        confidence: 72,
        explanation: 'Handdrawn diagram detected. Round bottom flask, condenser, and thermometer identified. Water inlet/outlet arrows unclear on scan. Flagged for teacher review.',
        markingPointsBreakdown: [
          { pointDescription: 'Distillation flask setup', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Liebig condenser orientation', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Thermometer bulb placement', awarded: 1, max: 1, status: 'CORRECT' },
          { pointDescription: 'Water inlet and outlet directional arrows', awarded: 0, max: 1, status: 'INCORRECT' },
          { pointDescription: 'Fractionating column for fractional distillation', awarded: 0, max: 1, status: 'MISSING' }
        ],
        diagramDetected: true,
        isUncertain: true
      }
    ],
    topicPerformance: [
      { topic: "Organic Chemistry - Alcohols", score: 5, total: 5, percentage: 100 },
      { topic: "Stoichiometry & Fermentation", score: 5, total: 5, percentage: 100 },
      { topic: "Practical Laboratory Apparatus", score: 3, total: 5, percentage: 60 }
    ],
    teacherComments: "Impressive mastery of chemical formulas and yield calculations. Review condenser water flow labels on apparatus diagrams.",
    aiFeedback: "Strong performance in numerical and theoretical organic chemistry. Small diagram labeling omission on water inlet."
  }
];

export const INITIAL_SCHEMES_OF_WORK: SchemeOfWork[] = [
  {
    id: 'scheme-chem-f4-2026',
    title: 'Chemistry Form IV Scheme of Work 2026',
    academicYear: '2026',
    term: 'Term 1',
    form: 'Form IV',
    subject: 'Chemistry',
    teacherName: 'Mwl. Isaack Edward Lungwa',
    schoolName: 'Kizimba Secondary School',
    weeksCount: 12,
    periodsPerWeek: 4,
    status: 'APPROVED',
    isAiGenerated: true,
    dateCreated: '2026-01-10',
    items: [
      {
        id: 'sow-1',
        weekNumber: 1,
        datesRange: 'Jan 12 - Jan 16',
        topic: 'Organic Chemistry',
        subtopic: 'Introduction to Alcohols & Functional Group',
        periods: 4,
        competenceObjectives: 'Students should be able to define alcohols, classify primary/secondary/tertiary alcohols, and apply IUPAC naming rules.',
        teachingActivities: 'Teacher leads brainstorming on hydroxyl group, demonstrates structural ball-and-stick models.',
        learningActivities: 'Learners draw structures of methanol, ethanol, propanol, and construct molecular models in groups.',
        resourcesRequired: 'KDLH Organic Chemistry Note, Molecular model kits, Chart of IUPAC rules.',
        assessmentMethod: 'Oral questioning & Board work exercises on IUPAC naming.',
        remarks: 'Covered successfully. 95% of students mastered naming up to Pentanol.'
      },
      {
        id: 'sow-2',
        weekNumber: 2,
        datesRange: 'Jan 19 - Jan 23',
        topic: 'Organic Chemistry',
        subtopic: 'Preparation of Ethanol & Fermentation',
        periods: 4,
        competenceObjectives: 'Students should be able to describe fermentation of sugar using yeast and industrial hydration of ethene.',
        teachingActivities: 'Teacher sets up fermentation mixture (sugar + yeast + water) in a conical flask with limewater tube.',
        learningActivities: 'Students observe CO2 gas evolution, record temperature, and write chemical equations.',
        resourcesRequired: 'KDLH Practical Guide, Conical flask, Yeast, Glucose, Limewater.',
        assessmentMethod: 'Practical lab report & Short quiz on fermentation parameters.',
        remarks: 'Fermentation apparatus setup completed in lab.'
      }
    ]
  }
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-chem-f4-alcohols',
    title: 'Lesson Plan: IUPAC Naming & Structure of Alcohols',
    schoolName: 'Kizimba Secondary School',
    teacherName: 'Mwl. Isaack Edward Lungwa',
    subject: 'Chemistry',
    form: 'Form IV',
    date: '2026-08-12',
    durationMinutes: 80,
    topic: 'Organic Chemistry',
    subtopic: 'Naming & Structure of Alcohols',
    mainCompetence: 'Ability to use IUPAC nomenclature to name and draw functional organic compounds.',
    specificCompetence: 'Correctly name primary, secondary, and tertiary alcohols up to C5 and draw their structural isomers.',
    learningObjectives: [
      'Define an alcohol and identify the -OH hydroxyl functional group.',
      'State IUPAC rules for naming mono-hydric alcohols.',
      'Draw structural formulas for propan-1-ol, propan-2-ol, and 2-methylpropan-2-ol.'
    ],
    teachingMethods: ['Guided Discovery', 'Group Model Building', 'Problem Solving'],
    learningActivities: [
      'Analyze structural formulas on KDLH digital whiteboard.',
      'Construct molecular models of ethanol and propanol.',
      'Solve IUPAC naming worksheet in small study pairs.'
    ],
    teachingResources: ['KDLH Digital Note: Alcohols', 'Molecular Model Kits', 'Worksheet 4B'],
    introduction: '5 mins: Review alkanes (methane to pentane). Ask students what happens when one hydrogen atom is substituted by a hydroxyl (-OH) group.',
    lessonDevelopment: '45 mins: Step 1: Explain longest carbon chain rule. Step 2: Numbering rule to give -OH lowest position number. Step 3: Differentiate primary, secondary, and tertiary alcohols using structural drawings.',
    practice: '15 mins: Students complete naming exercise for 5 structural isomers on individual whiteboards.',
    assessment: '10 mins: Exit ticket quiz with 3 structural formulas to name.',
    conclusion: '3 mins: Summarize IUPAC suffix -ol and numbering priority.',
    homework: 'Complete KDLH Revision Questions #1-5 in Organic Chemistry module.',
    reflection: 'Learners engaged actively with molecular models. Propan-2-ol numbering needed extra clarification.',
    isAiGenerated: false,
    dateCreated: '2026-08-11'
  }
];

export const INITIAL_NOTE_SUMMARIES: NoteSummary[] = [
  {
    id: 'sum-chem-alcohols-01',
    sourceResourceId: 'note-chem-f4-alcohols',
    sourceTitle: 'Form IV Chemistry - Organic Chemistry: Alcohols',
    sourceType: 'KDLH Official Study Note',
    summaryLength: 'MEDIUM',
    targetLevel: 'INTERMEDIATE',
    language: 'ENGLISH',
    shortSummary: 'Alcohols are organic compounds with the general formula CnH2n+1OH containing the hydroxyl (-OH) group. Ethanol is produced via glucose fermentation or ethene hydration, and oxidizes to ethanoic acid.',
    detailedSummary: 'Alcohols form a homologous series of organic compounds containing one or more hydroxyl (-OH) functional groups. They are classified into primary (1°), secondary (2°), and tertiary (3°) alcohols based on the number of alkyl groups attached to the carbon bearing the -OH group.\n\nEthanol (C2H5OH) is the most economically significant alcohol, prepared industrially by catalytic hydration of ethene (C2H4 + H2O -> C2H5OH) at 300°C and 60 atm, or biologically by fermentation of carbohydrates using yeast at 30-37°C in anaerobic conditions.\n\nOxidation of primary alcohols with acidified potassium dichromate (K2Cr2O7) or potassium permanganate (KMnO4) produces aldehydes (ethanal) first, followed by carboxylic acids (ethanoic acid). The orange color of dichromate turns green (Cr3+ ions formed).',
    keyPoints: [
      'General formula of monohydric alcohols: CnH2n+1OH.',
      'Functional group: Hydroxyl group (-OH).',
      'Fermentation equation: C6H12O6 -(zymase)-> 2 C2H5OH + 2 CO2.',
      'Oxidation of primary alcohols: Primary Alcohol -> Aldehyde -> Carboxylic Acid.',
      'Dichromate test: Orange (Cr2O7 2-) turns Green (Cr3+).'
    ],
    importantDefinitions: [
      { term: 'Alcohol', definition: 'An organic compound containing a hydroxyl (-OH) group bonded to a saturated carbon atom.' },
      { term: 'Fermentation', definition: 'The enzymatic breakdown of sugars into ethanol and carbon dioxide by yeast under anaerobic conditions.' },
      { term: 'Primary Alcohol', definition: 'An alcohol in which the hydroxyl (-OH) carbon atom is attached to only one alkyl group or no other carbon atoms.' }
    ],
    formulas: [
      { name: 'General Formula of Alcohols', formula: 'C_n H_{2n+1} OH' },
      { name: 'Fermentation Equation', formula: 'C6H12O6 -> 2 C2H5OH + 2 CO2' },
      { name: 'Complete Combustion', formula: 'C2H5OH + 3 O2 -> 2 CO2 + 3 H2O' }
    ],
    flashcards: [
      { question: 'What is the functional group of alcohols?', answer: 'Hydroxyl group (-OH)' },
      { question: 'What color change occurs when ethanol reacts with acidified K2Cr2O7?', answer: 'Orange to Green' },
      { question: 'What gas is produced during yeast fermentation of glucose?', answer: 'Carbon Dioxide (CO2)' }
    ],
    examQuestions: [
      { question: 'State TWO industrial uses of ethanol.', marks: 2 },
      { question: 'Write a balanced equation for the reaction between sodium metal and ethanol.', marks: 3 }
    ],
    dateCreated: '2026-08-11'
  }
];

export const INITIAL_TOPIC_PROGRESS: StudentTopicProgress[] = [
  {
    studentId: 'student-juma',
    topicId: 'topic-chem-f4-1',
    topicName: 'Organic Chemistry - Alcohols',
    subjectName: 'Chemistry',
    form: 'Form IV',
    percentCompleted: 80,
    notesReadCount: 3,
    testsAttemptedCount: 2,
    averageScore: 87,
    lastActivityDate: '2026-08-10',
    weakAreas: ['Organic Chemistry – Naming of Alcohols (3-methylbutan-2-ol IUPAC numbering rules)'],
    strongAreas: ['Fermentation equations', 'Stoichiometric yield calculations'],
    recommendedResourceIds: ['note-chem-f4-alcohols', 'video-chem-f4-alcohols', 'prac-chem-f4-titration']
  }
];
