import { QuestionPaper, BankQuestion, WatermarkConfig } from '../types';

const PAPERS_STORAGE_KEY = 'paper_genius_saved_papers';
const QUESTION_BANK_STORAGE_KEY = 'paper_genius_question_bank';
const WATERMARK_STORAGE_KEY = 'paper_genius_watermark_settings';

export const DEFAULT_WATERMARK: WatermarkConfig = {
  text: 'Ravi Kishan',
  enabled: true,
  opacity: 0.12,
  rotation: -35,
  color: '#64748b',
  fontSize: 48,
};

// Initial sample paper so user immediately has a complete paper to inspect & print
const SAMPLE_PAPER: QuestionPaper = {
  id: 'paper-cbse-10-sci-demo',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  title: 'Class 10 CBSE Science Annual Assessment',
  instituteName: 'Delhi Public Senior Secondary School',
  country: 'India',
  board: 'CBSE',
  classLevel: 'Class 10',
  academicYear: '2026-2027',
  subject: 'Science (Physics, Chemistry & Biology)',
  examType: 'Annual Board Examination',
  language: 'English',
  durationMinutes: 90,
  maxMarks: 50,
  totalCalculatedMarks: 50,
  difficulty: 'Balanced (Standard)',
  syllabusType: 'complete',
  chapters: [
    'Chemical Reactions and Equations',
    'Acids, Bases and Salts',
    'Life Processes',
    'Light: Reflection & Refraction',
    'Electricity',
  ],
  generalInstructions: [
    'This question paper consists of 4 Sections: Section A, Section B, Section C, and Section D.',
    'All questions are compulsory. Internal choices are provided in question 21 and question 23.',
    'Section A consists of 10 Multiple Choice Questions carrying 1 mark each.',
    'Section B consists of 5 Very Short Answer Questions carrying 2 marks each.',
    'Section C consists of 5 Short Answer Questions carrying 3 marks each.',
    'Section D consists of 3 Long Answer Questions carrying 5 marks each.',
    'Calculators or mathematical tables are not allowed.',
  ],
  watermark: DEFAULT_WATERMARK,
  sections: [
    {
      id: 'sec-a',
      name: 'Section A',
      title: 'Multiple Choice Questions (Objective)',
      instructions: 'Each question carries 1 mark. Select the single best option.',
      questionCount: 10,
      marksPerQuestion: 1,
      totalMarks: 10,
      questionType: 'mcq',
      questions: [
        {
          id: 'q-1',
          sectionId: 'sec-a',
          number: 1,
          type: 'mcq',
          text: 'Which gas is released when dilute hydrochloric acid reacts with active zinc granules?',
          options: ['A. Oxygen gas', 'B. Carbon dioxide gas', 'C. Hydrogen gas', 'D. Chlorine gas'],
          correctOption: 'C',
          marks: 1,
          difficulty: 'easy',
          chapter: 'Chemical Reactions and Equations',
        },
        {
          id: 'q-2',
          sectionId: 'sec-a',
          number: 2,
          type: 'mcq',
          text: 'The focal length of a concave mirror having a radius of curvature of 30 cm is:',
          options: ['A. +15 cm', 'B. -15 cm', 'C. -30 cm', 'D. +60 cm'],
          correctOption: 'B',
          marks: 1,
          difficulty: 'moderate',
          chapter: 'Light: Reflection & Refraction',
        },
        {
          id: 'q-3',
          sectionId: 'sec-a',
          number: 3,
          type: 'mcq',
          text: 'In human alimentary canal, the site where complete digestion of carbohydrates, proteins and fats takes place is:',
          options: ['A. Stomach', 'B. Large Intestine', 'C. Small Intestine', 'D. Liver'],
          correctOption: 'C',
          marks: 1,
          difficulty: 'easy',
          chapter: 'Life Processes',
        },
        {
          id: 'q-4',
          sectionId: 'sec-a',
          number: 4,
          type: 'mcq',
          text: 'What happens when ferrous sulphate crystals are heated in a dry boiling tube?',
          options: [
            'A. Crystals melt into a colourless liquid',
            'B. Green colour changes to white and reddish-brown with smell of burning sulphur',
            'C. Brown fumes of nitrogen dioxide are evolved',
            'D. A dazzling white flame is produced',
          ],
          correctOption: 'B',
          marks: 1,
          difficulty: 'moderate',
          chapter: 'Chemical Reactions and Equations',
        },
        {
          id: 'q-5',
          sectionId: 'sec-a',
          number: 5,
          type: 'mcq',
          text: 'Two resistors of 6 Ω and 3 Ω are connected in parallel. Their effective equivalent resistance is:',
          options: ['A. 9 Ω', 'B. 18 Ω', 'C. 2 Ω', 'D. 0.5 Ω'],
          correctOption: 'C',
          marks: 1,
          difficulty: 'moderate',
          chapter: 'Electricity',
        },
        {
          id: 'q-6',
          sectionId: 'sec-a',
          number: 6,
          type: 'mcq',
          text: 'The pH of a neutral solution at 25°C is:',
          options: ['A. 0', 'B. 7', 'C. 14', 'D. 1'],
          correctOption: 'B',
          marks: 1,
          difficulty: 'easy',
          chapter: 'Acids, Bases and Salts',
        },
        {
          id: 'q-7',
          sectionId: 'sec-a',
          number: 7,
          type: 'mcq',
          text: 'Which blood vessels carry deoxygenated blood from the heart to the lungs?',
          options: ['A. Pulmonary Veins', 'B. Aorta', 'C. Pulmonary Artery', 'D. Vena Cava'],
          correctOption: 'C',
          marks: 1,
          difficulty: 'easy',
          chapter: 'Life Processes',
        },
        {
          id: 'q-8',
          sectionId: 'sec-a',
          number: 8,
          type: 'mcq',
          text: 'Assertion (A): Silver chloride turns grey in sunlight.\nReason (R): Decomposition of silver chloride into silver and chlorine occurs by light.',
          options: [
            'A. Both A and R are true and R is the correct explanation of A',
            'B. Both A and R are true but R is not the correct explanation of A',
            'C. A is true but R is false',
            'D. A is false but R is true',
          ],
          correctOption: 'A',
          marks: 1,
          difficulty: 'moderate',
          chapter: 'Chemical Reactions and Equations',
        },
        {
          id: 'q-9',
          sectionId: 'sec-a',
          number: 9,
          type: 'mcq',
          text: 'A ray of light traveling from water into air bends:',
          options: ['A. Towards the normal', 'B. Away from the normal', 'C. Undeviated', 'D. Back into water at 90°'],
          correctOption: 'B',
          marks: 1,
          difficulty: 'easy',
          chapter: 'Light: Reflection & Refraction',
        },
        {
          id: 'q-10',
          sectionId: 'sec-a',
          number: 10,
          type: 'mcq',
          text: 'Electric power consumed by an appliance with resistance R at voltage V is given by:',
          options: ['A. V² / R', 'B. I² / R', 'C. V / R²', 'D. V · R'],
          correctOption: 'A',
          marks: 1,
          difficulty: 'moderate',
          chapter: 'Electricity',
        },
      ],
    },
    {
      id: 'sec-b',
      name: 'Section B',
      title: 'Very Short Answer Questions',
      instructions: 'Each question carries 2 marks. Answers should be brief and point-wise (30-50 words).',
      questionCount: 5,
      marksPerQuestion: 2,
      totalMarks: 10,
      questionType: 'vsa',
      questions: [
        {
          id: 'q-11',
          sectionId: 'sec-b',
          number: 11,
          type: 'vsa',
          text: 'Why does distilled water not conduct electricity, whereas rainwater does? Give two distinct scientific reasons.',
          marks: 2,
          difficulty: 'moderate',
          chapter: 'Acids, Bases and Salts',
        },
        {
          id: 'q-12',
          sectionId: 'sec-b',
          number: 12,
          type: 'vsa',
          text: 'State two differences between aerobic respiration and anaerobic respiration with reference to end products and energy released.',
          marks: 2,
          difficulty: 'easy',
          chapter: 'Life Processes',
        },
        {
          id: 'q-13',
          sectionId: 'sec-b',
          number: 13,
          type: 'vsa',
          text: 'Define refractive index of a medium. Write the relationship connecting absolute refractive index of a medium with speed of light.',
          marks: 2,
          difficulty: 'easy',
          chapter: 'Light: Reflection & Refraction',
        },
        {
          id: 'q-14',
          sectionId: 'sec-b',
          number: 14,
          type: 'vsa',
          text: 'Write balanced chemical equations for the reaction when:\n(a) Quicklime reacts vigorously with water.\n(b) Lead nitrate powder is heated.',
          marks: 2,
          difficulty: 'moderate',
          chapter: 'Chemical Reactions and Equations',
        },
        {
          id: 'q-15',
          sectionId: 'sec-b',
          number: 15,
          type: 'vsa',
          text: 'State Joule\'s Law of Heating. Write its mathematical formulation with standard SI units.',
          marks: 2,
          difficulty: 'moderate',
          chapter: 'Electricity',
        },
      ],
    },
    {
      id: 'sec-c',
      name: 'Section C',
      title: 'Short Answer Questions',
      instructions: 'Each question carries 3 marks. Answers should be 50-80 words with step-by-step reasoning.',
      questionCount: 5,
      marksPerQuestion: 3,
      totalMarks: 15,
      questionType: 'sa',
      questions: [
        {
          id: 'q-16',
          sectionId: 'sec-c',
          number: 16,
          type: 'sa',
          text: 'A concave lens has a focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens? Also, find the magnification produced by the lens.',
          marks: 3,
          difficulty: 'challenging',
          chapter: 'Light: Reflection & Refraction',
        },
        {
          id: 'q-17',
          sectionId: 'sec-c',
          number: 17,
          type: 'sa',
          text: 'Describe the double circulation of blood in human beings with the help of a flow diagram. Why is it necessary to separate oxygenated and deoxygenated blood in mammals and birds?',
          marks: 3,
          difficulty: 'moderate',
          chapter: 'Life Processes',
        },
        {
          id: 'q-18',
          sectionId: 'sec-c',
          number: 18,
          type: 'sa',
          text: 'Compounds like alcohols and glucose also contain hydrogen but are not categorized as acids. Describe an activity with an experimental diagram to prove this statement.',
          marks: 3,
          difficulty: 'challenging',
          chapter: 'Acids, Bases and Salts',
        },
        {
          id: 'q-19',
          sectionId: 'sec-c',
          number: 19,
          type: 'sa',
          text: 'Three resistors of resistances R₁ = 4 Ω, R₂ = 6 Ω, and R₃ = 12 Ω are connected to a 6 V battery.\nCalculate:\n(a) Equivalent resistance when connected in parallel.\n(b) Total current flowing in the main circuit.\n(c) Current through the 6 Ω resistor.',
          marks: 3,
          difficulty: 'moderate',
          chapter: 'Electricity',
        },
        {
          id: 'q-20',
          sectionId: 'sec-c',
          number: 20,
          type: 'sa',
          text: 'What is a redox reaction? Identify the substance oxidized, reduced, oxidizing agent, and reducing agent in the reaction:\nMnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂',
          marks: 3,
          difficulty: 'moderate',
          chapter: 'Chemical Reactions and Equations',
        },
      ],
    },
    {
      id: 'sec-d',
      name: 'Section D',
      title: 'Long Answer & Competency-Based Questions',
      instructions: 'Each question carries 5 marks. Show complete step-by-step working and labeled explanations.',
      questionCount: 3,
      marksPerQuestion: 5,
      totalMarks: 15,
      questionType: 'la',
      questions: [
        {
          id: 'q-21',
          sectionId: 'sec-d',
          number: 21,
          type: 'la',
          text: '(a) Draw a labeled diagram of the human nephron and explain the mechanism of urine formation under the steps:\n    (i) Glomerular filtration\n    (ii) Tubular reabsorption\n    (iii) Tubular secretion\n(b) Name two factors on which the amount of water reabsorbed in nephron tubules depends.',
          marks: 5,
          difficulty: 'challenging',
          chapter: 'Life Processes',
          hasInternalChoice: true,
          orQuestion: {
            text: '(a) Draw a neat sectional diagram of the human heart and label: Right atrium, Left ventricle, Pulmonary artery, and Aorta.\n(b) Mention the function of valves present inside heart chambers.\n(c) Why do ventricles have thicker muscular walls than atria?',
            answer: 'Full anatomical description of human heart valves and ventricular myocardium adaptations.',
            solutionSteps: [
              'Neat diagram with 4 required labels (2 Marks)',
              'Valves prevent backflow of blood during systole and diastole (1 Mark)',
              'Ventricles pump blood to distant body organs at high pressure (2 Marks)',
            ],
          },
        },
        {
          id: 'q-22',
          sectionId: 'sec-d',
          number: 22,
          type: 'la',
          text: '(a) State Snell\'s law of refraction.\n(b) A convex lens of focal length 20 cm produces a real, inverted image three times larger than the object. Calculate:\n    (i) Object distance from the lens\n    (ii) Image distance from the lens\n(c) Draw a ray diagram to show the formation of this image.',
          marks: 5,
          difficulty: 'challenging',
          chapter: 'Light: Reflection & Refraction',
        },
        {
          id: 'q-23',
          sectionId: 'sec-d',
          number: 23,
          type: 'la',
          text: '(a) Write the chemical formula and commercial name of Plaster of Paris. How is it prepared from gypsum? Write the chemical equation.\n(b) State two important precautions to be observed during the preparation of Plaster of Paris.\n(c) What happens when Plaster of Paris is mixed with water? Write the equation and explain its setting property.',
          marks: 5,
          difficulty: 'moderate',
          chapter: 'Acids, Bases and Salts',
        },
      ],
    },
  ],
  answerKey: [
    {
      questionNumber: 1,
      questionId: 'q-1',
      type: 'mcq',
      correctAnswer: 'Option C: Hydrogen gas (H₂)',
      solutionSteps: [
        'Active metals react with dilute mineral acids to liberate hydrogen gas and form corresponding metal salts.',
        'Equation: Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑',
        'Testing with a burning splinter produces a characteristic pop sound confirming H₂.',
      ],
      markingScheme: [{ step: 'Correct option C and reaction principle', marks: 1 }],
      keyFormulasOrEquations: ['Zn + 2HCl → ZnCl₂ + H₂↑'],
      explanation: 'Zinc displaces hydrogen from hydrochloric acid due to its higher position in reactivity series.',
    },
    {
      questionNumber: 2,
      questionId: 'q-2',
      type: 'mcq',
      correctAnswer: 'Option B: -15 cm',
      solutionSteps: [
        'By Cartesian sign convention, the focal length of a concave mirror is negative.',
        'Relationship: f = R / 2',
        'Here R = -30 cm => f = -30 / 2 = -15 cm.',
      ],
      markingScheme: [{ step: 'Formula f = R/2 with negative sign convention', marks: 1 }],
      explanation: 'Concave mirror has real focus situated in front of reflective surface (left side).',
    },
    {
      questionNumber: 3,
      questionId: 'q-3',
      type: 'mcq',
      correctAnswer: 'Option C: Small Intestine',
      solutionSteps: [
        'Small intestine receives bile juice from liver, pancreatic juice from pancreas, and intestinal juice (succus entericus).',
        'These enzymes completely convert carbohydrates to glucose, proteins to amino acids, and fats to fatty acids and glycerol.',
      ],
      markingScheme: [{ step: 'Option C (Small Intestine)', marks: 1 }],
      explanation: 'Villi and microvilli in the ileum maximize absorptive surface area after complete enzymatic breakdown.',
    },
    {
      questionNumber: 4,
      questionId: 'q-4',
      type: 'mcq',
      correctAnswer: 'Option B: Green colour changes to white and reddish-brown with smell of burning sulphur',
      solutionSteps: [
        'Thermal decomposition of hydrated ferrous sulphate FeSO₄·7H₂O loses water molecules forming anhydrous white FeSO₄.',
        'On further heating: 2FeSO₄(s) → Fe₂O₃(s) + SO₂(g) + SO₃(g).',
        'Fe₂O₃ is reddish-brown solid; SO₂ and SO₃ give suffocating smell of burning sulphur.',
      ],
      markingScheme: [{ step: 'Option B with correct observations', marks: 1 }],
      keyFormulasOrEquations: ['2FeSO₄ → Fe₂O₃ + SO₂↑ + SO₃↑'],
      explanation: 'Thermal decomposition reaction producing gaseous non-metal oxides.',
    },
    {
      questionNumber: 5,
      questionId: 'q-5',
      type: 'mcq',
      correctAnswer: 'Option C: 2 Ω',
      solutionSteps: [
        'Formula for parallel resistors: 1/R_p = 1/R₁ + 1/R₂',
        '1/R_p = 1/6 + 1/3 = (1 + 2)/6 = 3/6 = 1/2',
        'R_p = 2 Ω.',
      ],
      markingScheme: [{ step: 'Calculation of parallel equivalent resistance', marks: 1 }],
      explanation: 'Equivalent resistance of parallel resistors is always smaller than the smallest individual resistor.',
    },
    {
      questionNumber: 6,
      questionId: 'q-6',
      type: 'mcq',
      correctAnswer: 'Option B: 7',
      solutionSteps: [
        'At 25°C (room temperature), [H⁺] = [OH⁻] = 10⁻⁷ M in pure water.',
        'pH = -log₁₀[H⁺] = -log₁₀(10⁻⁷) = 7.',
      ],
      markingScheme: [{ step: 'Option B', marks: 1 }],
      explanation: 'Neutral pH scale standard.',
    },
    {
      questionNumber: 7,
      questionId: 'q-7',
      type: 'mcq',
      correctAnswer: 'Option C: Pulmonary Artery',
      solutionSteps: [
        'Right ventricle pumps deoxygenated blood into pulmonary artery.',
        'Pulmonary artery is the only artery in human body that carries deoxygenated blood to lungs for oxygenation.',
      ],
      markingScheme: [{ step: 'Option C (Pulmonary Artery)', marks: 1 }],
      explanation: 'All arteries carry oxygenated blood except the pulmonary artery.',
    },
    {
      questionNumber: 8,
      questionId: 'q-8',
      type: 'mcq',
      correctAnswer: 'Option A: Both A and R are true and R is the correct explanation of A',
      solutionSteps: [
        'In sunlight, photolytic decomposition occurs: 2AgCl(s) → 2Ag(s) + Cl₂(g).',
        'Silver metal formed is grey in colour, directly validating the assertion and reason.',
      ],
      markingScheme: [{ step: 'Option A', marks: 1 }],
      keyFormulasOrEquations: ['2AgCl → 2Ag + Cl₂↑'],
      explanation: 'Photochemical reaction used in black and white photography.',
    },
    {
      questionNumber: 9,
      questionId: 'q-9',
      type: 'mcq',
      correctAnswer: 'Option B: Away from the normal',
      solutionSteps: [
        'Water is optically denser than air.',
        'When light travels from an optically denser medium to a rarer medium, its speed increases and it bends away from the normal.',
      ],
      markingScheme: [{ step: 'Option B (Away from the normal)', marks: 1 }],
      explanation: 'Consequence of Snell\'s law (sin i / sin r = n₂ / n₁).',
    },
    {
      questionNumber: 10,
      questionId: 'q-10',
      type: 'mcq',
      correctAnswer: 'Option A: V² / R',
      solutionSteps: [
        'Power P = V · I',
        'By Ohm\'s law, I = V / R',
        'Substituting gives P = V(V / R) = V² / R.',
      ],
      markingScheme: [{ step: 'Option A', marks: 1 }],
      keyFormulasOrEquations: ['P = V · I = I²R = V² / R'],
      explanation: 'Standard electrical power relations.',
    },
    {
      questionNumber: 11,
      questionId: 'q-11',
      type: 'vsa',
      correctAnswer: 'Presence of free mobile ions in rainwater versus absence in pure distilled water.',
      solutionSteps: [
        '1. Distilled water is pure and does not contain any dissolved salts or minerals, so it lacks free ions to conduct electric charges.',
        '2. Rainwater dissolves atmospheric gases like carbon dioxide (CO₂) and sulphur dioxide (SO₂) forming weak acids like carbonic acid (H₂CO₃), which dissociate into free H⁺ and HCO₃⁻ ions, allowing conduction.',
      ],
      markingScheme: [
        { step: 'Reason for distilled water having no dissolved ions', marks: 1 },
        { step: 'Reason for rainwater forming carbonic acid with free ions', marks: 1 },
      ],
      keyFormulasOrEquations: ['H₂O + CO₂ → H₂CO₃ ⇌ H⁺ + HCO₃⁻'],
      explanation: 'Ionic mobility is mandatory for electrolytic conduction.',
    },
    {
      questionNumber: 12,
      questionId: 'q-12',
      type: 'vsa',
      correctAnswer: 'Tabular difference between Aerobic and Anaerobic respiration.',
      solutionSteps: [
        '• End Products: Aerobic respiration produces CO₂ and H₂O; Anaerobic respiration produces ethanol + CO₂ (yeast) or lactic acid (muscle cells).',
        '• Energy Released: Aerobic produces large amount of energy (~36-38 ATP per glucose molecule); Anaerobic produces small amount (~2 ATP).',
      ],
      markingScheme: [
        { step: 'Difference based on end products', marks: 1 },
        { step: 'Difference based on ATP energy yield', marks: 1 },
      ],
      explanation: 'Complete versus incomplete breakdown of pyruvate.',
    },
    {
      questionNumber: 13,
      questionId: 'q-13',
      type: 'vsa',
      correctAnswer: 'n = c / v (Ratio of speed of light in vacuum to speed in medium).',
      solutionSteps: [
        'Definition: Absolute refractive index of a medium is defined as the ratio of the speed of light in vacuum (c) to the speed of light in that medium (v).',
        'Mathematical expression: n = c / v (it is a dimensionless quantity).',
      ],
      markingScheme: [
        { step: 'Definition of refractive index', marks: 1 },
        { step: 'Mathematical formula n = c / v', marks: 1 },
      ],
      keyFormulasOrEquations: ['n = c / v'],
      explanation: 'Indicates the optical density and optical deceleration of the medium.',
    },
    {
      questionNumber: 14,
      questionId: 'q-14',
      type: 'vsa',
      correctAnswer: 'Balanced chemical equations for CaO slaking and lead nitrate decomposition.',
      solutionSteps: [
        '(a) CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat (Exothermic combination reaction).',
        '(b) 2Pb(NO₃)₂(s) → 2PbO(s) + 4NO₂(g) + O₂(g) (Thermal decomposition).',
      ],
      markingScheme: [
        { step: 'Correct balanced equation for quicklime slaking', marks: 1 },
        { step: 'Correct balanced equation for lead nitrate with NO₂ brown fumes', marks: 1 },
      ],
      keyFormulasOrEquations: ['CaO + H₂O → Ca(OH)₂ + Heat', '2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑'],
      explanation: 'Fundamental chemical combination and thermal decomposition demonstrations.',
    },
    {
      questionNumber: 15,
      questionId: 'q-15',
      type: 'vsa',
      correctAnswer: 'H = I²Rt (Joule\'s Law of Heating).',
      solutionSteps: [
        'Statement: Heat produced in a conductor is directly proportional to (i) square of current (I²), (ii) resistance (R), and (iii) time (t) for which current flows.',
        'Formula: H = I²Rt Joules (where I in Amperes, R in Ohms, t in Seconds).',
      ],
      markingScheme: [
        { step: 'Statement of three proportionality factors', marks: 1 },
        { step: 'Formula H = I²Rt with SI unit Joule', marks: 1 },
      ],
      keyFormulasOrEquations: ['H = I² · R · t'],
      explanation: 'Electric kinetic energy dissipated as thermal energy due to molecular collisions.',
    },
    {
      questionNumber: 16,
      questionId: 'q-16',
      type: 'sa',
      correctAnswer: 'Object distance u = -30 cm; Magnification m = +0.33',
      solutionSteps: [
        'Given for concave lens: focal length f = -15 cm, image distance v = -10 cm (virtual image formed on same side).',
        'Lens formula: 1/f = 1/v - 1/u => 1/u = 1/v - 1/f',
        '1/u = 1/(-10) - 1/(-15) = -1/10 + 1/15 = (-3 + 2)/30 = -1/30',
        'Therefore, u = -30 cm. Object should be placed 30 cm in front of the lens.',
        'Magnification m = v / u = (-10) / (-30) = +1/3 = +0.33.',
      ],
      markingScheme: [
        { step: 'Lens formula statement and substitution', marks: 1 },
        { step: 'Calculation of u = -30 cm with proper sign', marks: 1 },
        { step: 'Calculation of magnification m = +0.33', marks: 1 },
      ],
      keyFormulasOrEquations: ['1/f = 1/v - 1/u', 'm = v / u'],
      explanation: 'Concave lens always forms virtual, erect, and diminished images.',
    },
    {
      questionNumber: 17,
      questionId: 'q-17',
      type: 'sa',
      correctAnswer: 'Systemic and pulmonary circulation cycles; high energy requirement justification.',
      solutionSteps: [
        '1. Double circulation consists of: (a) Pulmonary Circulation: Deoxygenated blood from right ventricle to lungs and back to left atrium as oxygenated blood; (b) Systemic Circulation: Oxygenated blood from left ventricle to whole body and back to right atrium as deoxygenated blood.',
        '2. Flow summary: Body → Right Atrium → Right Ventricle → Lungs → Left Atrium → Left Ventricle → Body.',
        '3. Necessity: Warm-blooded animals (mammals & birds) need continuous high energy to maintain constant body temperature irrespective of surrounding temperature. Complete separation prevents mixing and ensures highly efficient oxygen supply.',
      ],
      markingScheme: [
        { step: 'Explanation of pulmonary and systemic circulation pathways', marks: 1.5 },
        { step: 'Justification for endothermic thermoregulation energy needs', marks: 1.5 },
      ],
      explanation: 'Double circulation enables high metabolic efficiency in homoeothermic organisms.',
    },
    {
      questionNumber: 18,
      questionId: 'q-18',
      type: 'sa',
      correctAnswer: 'Experimental demonstration showing bulb does not glow with alcohol or glucose solution.',
      solutionSteps: [
        '1. Apparatus: Fix two iron nails on a rubber cork and place it in a 100 mL beaker. Connect nails to two terminals of a 6V battery through a switch and bulb.',
        '2. Procedure: Pour dilute HCl; switch on current -> Bulb glows vigorously (presence of H⁺ ions).',
        '3. Next, replace HCl with glucose (C₆H₁₂O₆) and ethyl alcohol (C₂H₅OH) solutions -> Bulb does NOT glow.',
        '4. Conclusion: Although alcohol and glucose contain hydrogen, they do not ionize in aqueous solution to give free hydrogen ions [H⁺(aq)], hence they do not show acidic character.',
      ],
      markingScheme: [
        { step: 'Experimental setup and circuit description', marks: 1 },
        { step: 'Observation: bulb glows with acid but not with glucose/alcohol', marks: 1 },
        { step: 'Scientific deduction regarding non-ionization of H atoms', marks: 1 },
      ],
      explanation: 'Acidity strictly depends on the generation of hydronium [H₃O⁺] ions.',
    },
    {
      questionNumber: 19,
      questionId: 'q-19',
      type: 'sa',
      correctAnswer: 'Equivalent resistance R_p = 2 Ω; Total current I = 3 A; Current through 6 Ω resistor = 1 A.',
      solutionSteps: [
        '(a) 1/R_p = 1/4 + 1/6 + 1/12 = (3 + 2 + 1)/12 = 6/12 = 1/2 => R_p = 2 Ω.',
        '(b) Total Current I = V / R_p = 6 V / 2 Ω = 3 A.',
        '(c) Current through 6 Ω resistor I₂ = V / R₂ = 6 V / 6 Ω = 1 A.',
      ],
      markingScheme: [
        { step: 'Calculation of equivalent resistance R_p = 2 Ω', marks: 1 },
        { step: 'Calculation of total current I = 3 A', marks: 1 },
        { step: 'Calculation of branch current I₂ = 1 A', marks: 1 },
      ],
      keyFormulasOrEquations: ['1/R_p = ∑(1/Rᵢ)', 'I = V / R'],
      explanation: 'Parallel branches share uniform potential difference of 6V.',
    },
    {
      questionNumber: 20,
      questionId: 'q-20',
      type: 'sa',
      correctAnswer: 'Substance oxidized: HCl; Reduced: MnO₂; Oxidizing agent: MnO₂; Reducing agent: HCl.',
      solutionSteps: [
        'Definition: A chemical reaction in which oxidation and reduction occur simultaneously is called a redox reaction.',
        'In MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂:',
        '• Substance oxidized: HCl (losses hydrogen/gains oxidation state to form Cl₂).',
        '• Substance reduced: MnO₂ (losses oxygen to form MnCl₂).',
        '• Oxidizing agent: MnO₂ (causes oxidation of HCl while getting reduced itself).',
        '• Reducing agent: HCl (causes reduction of MnO₂ while getting oxidized itself).',
      ],
      markingScheme: [
        { step: 'Definition of redox reaction', marks: 1 },
        { step: 'Identification of oxidized and reduced species', marks: 1 },
        { step: 'Identification of oxidizing and reducing agents', marks: 1 },
      ],
      explanation: 'Oxidation corresponds to removal of hydrogen or addition of oxygen.',
    },
    {
      questionNumber: 21,
      questionId: 'q-21',
      type: 'la',
      correctAnswer: 'Nephron structure and 3-stage urine formation mechanism; water reabsorption factors.',
      solutionSteps: [
        '(a) Nephron Structure: Bowman\'s capsule enclosing glomerulus, Proximal Convoluted Tubule (PCT), Loop of Henle, Distal Convoluted Tubule (DCT), and Collecting duct.',
        '1. Glomerular Filtration: High hydrostatic pressure in glomerulus forces water, glucose, amino acids, urea, and salts through podocytes into Bowman\'s space forming nephric filtrate.',
        '2. Tubular Reabsorption: As filtrate flows through PCT and Loop of Henle, essential substances like glucose, amino acids, and major water are selectively reabsorbed into peritubular capillaries.',
        '3. Tubular Secretion: Extra ions (K⁺, H⁺) and drugs are actively secreted from blood into renal tubule to maintain pH balance.',
        '(b) Factors regulating water reabsorption: (1) Amount of excess water present in the body, (2) Amount of dissolved wastes to be excreted (ADH/Vasopressin hormone level).',
      ],
      markingScheme: [
        { step: 'Labeled diagram / structural overview of nephron', marks: 1.5 },
        { step: 'Detailed explanation of filtration, reabsorption, and secretion', marks: 2.5 },
        { step: 'Two factors regulating water volume in body', marks: 1 },
      ],
      explanation: 'Homeostasis of fluid balance and nitrogenous waste elimination.',
    },
    {
      questionNumber: 22,
      questionId: 'q-22',
      type: 'la',
      correctAnswer: 'Snell\'s law: sin i / sin r = constant; Object distance u = -26.67 cm; Image distance v = +80 cm.',
      solutionSteps: [
        '(a) Snell\'s Law: The ratio of the sine of angle of incidence to the sine of angle of refraction is a constant for a given pair of media and given colour of light: sin i / sin r = n₂₁ = constant.',
        '(b) For convex lens: focal length f = +20 cm. Real and inverted image means magnification m = -3.',
        'm = v / u = -3 => v = -3u.',
        'From lens formula: 1/f = 1/v - 1/u',
        '1/20 = 1/(-3u) - 1/u = (-1 - 3)/(3u) = -4 / (3u)',
        '3u = -4 × 20 = -80 => u = -80/3 = -26.67 cm.',
        'Image distance v = -3u = -3(-80/3) = +80 cm (formed on other side).',
        '(c) Ray diagram shows object between F₁ and 2F₁ (since 20 < 26.67 < 40), and enlarged real inverted image formed beyond 2F₂.',
      ],
      markingScheme: [
        { step: 'Snell\'s law statement and formula', marks: 1 },
        { step: 'Setting magnification m = -3 and lens formula', marks: 1.5 },
        { step: 'Calculations: u = -26.67 cm and v = +80 cm', marks: 1.5 },
        { step: 'Ray diagram representation with arrow marks', marks: 1 },
      ],
      keyFormulasOrEquations: ['sin i / sin r = constant', '1/f = 1/v - 1/u', 'm = v / u'],
      explanation: 'Convex lens magnification dynamics for real inverted projection.',
    },
    {
      questionNumber: 23,
      questionId: 'q-23',
      type: 'la',
      correctAnswer: 'POP: CaSO₄·½H₂O (Calcium sulphate hemihydrate); Preparation from gypsum and hydration reaction.',
      solutionSteps: [
        '(a) Chemical formula: CaSO₄·½H₂O; Chemical name: Calcium sulphate hemihydrate; Commercial name: Plaster of Paris.',
        'Preparation: Prepared by heating gypsum (CaSO₄·2H₂O) at 373 K (100°C):',
        'CaSO₄·2H₂O (Gypsum) --[373 K]--> CaSO₄·½H₂O (POP) + 1½ H₂O.',
        '(b) Precautions during preparation:',
        '1. Temperature must not exceed 373 K (100°C), otherwise all water of crystallization is lost forming anhydrous calcium sulphate (dead burnt plaster), which loses the property of setting with water.',
        '2. Plaster of Paris must be stored in moisture-proof containers because it absorbs ambient atmospheric moisture and hardens into gypsum.',
        '(c) Setting property: When mixed with water, POP rehydrates back into a hard solid crystalline mass of gypsum within 10-15 minutes:',
        'CaSO₄·½H₂O + 1½ H₂O → CaSO₄·2H₂O (Hard Gypsum).',
      ],
      markingScheme: [
        { step: 'Formula, chemical name, and preparation equation at 373K', marks: 2 },
        { step: 'Two precautions regarding temperature and moisture control', marks: 1.5 },
        { step: 'Setting reaction with equation explaining rehydration into gypsum', marks: 1.5 },
      ],
      keyFormulasOrEquations: [
        'CaSO₄·2H₂O --[373K]--> CaSO₄·½H₂O + 1½ H₂O',
        'CaSO₄·½H₂O + 1½ H₂O → CaSO₄·2H₂O',
      ],
      explanation: 'Hydration crystallization produces an interlocking needle structure causing rapid setting.',
    },
  ],
};

// Functions to load and save
export function getSavedPapers(): QuestionPaper[] {
  try {
    const raw = localStorage.getItem(PAPERS_STORAGE_KEY);
    if (!raw) {
      // Seed with initial sample paper
      const initial = [SAMPLE_PAPER];
      localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const papers: QuestionPaper[] = JSON.parse(raw);
    return papers;
  } catch (e) {
    console.error('Failed to load saved papers', e);
    return [SAMPLE_PAPER];
  }
}

export function savePaper(paper: QuestionPaper): void {
  try {
    const papers = getSavedPapers();
    const index = papers.findIndex((p) => p.id === paper.id);
    const updatedPaper = { ...paper, updatedAt: new Date().toISOString() };
    if (index >= 0) {
      papers[index] = updatedPaper;
    } else {
      papers.unshift(updatedPaper);
    }
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(papers));
  } catch (e) {
    console.error('Failed to save paper', e);
  }
}

export function deletePaper(paperId: string): boolean {
  try {
    const papers = getSavedPapers().filter((p) => p.id !== paperId);
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(papers));
    return true;
  } catch (e) {
    console.error('Failed to delete paper', e);
    return false;
  }
}

export function duplicatePaper(paperId: string): QuestionPaper | null {
  try {
    const papers = getSavedPapers();
    const source = papers.find((p) => p.id === paperId);
    if (!source) return null;

    const copy: QuestionPaper = {
      ...JSON.parse(JSON.stringify(source)),
      id: 'paper-' + Date.now(),
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    papers.unshift(copy);
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(papers));
    return copy;
  } catch (e) {
    console.error('Failed to duplicate paper', e);
    return null;
  }
}

// Question Bank Store
export function getBankQuestions(): BankQuestion[] {
  try {
    const raw = localStorage.getItem(QUESTION_BANK_STORAGE_KEY);
    if (!raw) {
      // Seed question bank from sample paper questions
      const initialBank: BankQuestion[] = [];
      SAMPLE_PAPER.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          const ans = SAMPLE_PAPER.answerKey.find((a) => a.questionNumber === q.number);
          initialBank.push({
            id: 'bank-' + q.id,
            subject: SAMPLE_PAPER.subject,
            classLevel: SAMPLE_PAPER.classLevel,
            chapter: q.chapter || 'Core Chapter',
            difficulty: q.difficulty,
            type: q.type,
            marks: q.marks,
            text: q.text,
            options: q.options,
            answer: ans?.correctAnswer || 'Answer on file.',
            solution: ans?.solutionSteps?.join('\n') || '',
            createdAt: new Date().toISOString(),
          });
        });
      });
      localStorage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(initialBank));
      return initialBank;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load question bank', e);
    return [];
  }
}

export function saveBankQuestion(question: BankQuestion): void {
  try {
    const bank = getBankQuestions();
    const idx = bank.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      bank[idx] = question;
    } else {
      bank.unshift(question);
    }
    localStorage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(bank));
  } catch (e) {
    console.error('Failed to save question to bank', e);
  }
}

export function deleteBankQuestion(questionId: string): void {
  try {
    const bank = getBankQuestions().filter((q) => q.id !== questionId);
    localStorage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(bank));
  } catch (e) {
    console.error('Failed to delete question from bank', e);
  }
}

// Watermark Settings Store
export function getWatermarkSettings(): WatermarkConfig {
  try {
    const raw = localStorage.getItem(WATERMARK_STORAGE_KEY);
    if (!raw) return DEFAULT_WATERMARK;
    return { ...DEFAULT_WATERMARK, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_WATERMARK;
  }
}

export function saveWatermarkSettings(config: WatermarkConfig): void {
  try {
    localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save watermark settings', e);
  }
}
