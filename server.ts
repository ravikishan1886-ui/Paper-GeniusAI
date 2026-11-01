import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    appName: 'Paper Genius AI',
  });
});

// Generate question paper endpoint
app.post('/api/generate-paper', async (req, res) => {
  try {
    const {
      title,
      instituteName = 'Paper Genius Academy',
      country = 'India',
      board = 'CBSE',
      classLevel = 'Class 10',
      academicYear = '2026-2027',
      subject = 'Science',
      examType = 'Annual Examination',
      language = 'English',
      durationMinutes = 90,
      maxMarks = 50,
      difficulty = 'Balanced (Standard)',
      syllabusType = 'complete',
      syllabusText = '',
      chapters = [],
      sections = [],
      watermark = {
        text: 'Ravi Kishan',
        enabled: true,
        opacity: 0.12,
        rotation: -35,
        color: '#64748b',
        fontSize: 48,
      },
    } = req.body;

    const ai = getGeminiClient();

    // If Gemini API is available, generate using Gemini-3.8-flash
    if (ai) {
      try {
        const sectionsSummary = sections
          .map(
            (s: any, idx: number) =>
              `Section ${String.fromCharCode(65 + idx)} (${s.name || 'Section ' + (idx + 1)}): ${s.questionCount} questions of ${s.marksPerQuestion} mark(s) each (Total: ${s.questionCount * s.marksPerQuestion} marks), Type: ${s.questionType}`
          )
          .join('\n');

        const prompt = `You are a master academic examination controller and question paper creator for Paper Genius AI.
Generate a complete, high-quality, authentic examination question paper and matching answer key with detailed step-by-step solutions based on the specifications below.

EXAMINATION DETAILS:
- Title: ${title}
- School / Institute: ${instituteName}
- Country & Board: ${country} - ${board}
- Class / Grade: ${classLevel}
- Academic Year: ${academicYear}
- Subject: ${subject}
- Examination Type: ${examType}
- Medium / Language: ${language}
- Maximum Marks: ${maxMarks}
- Duration: ${durationMinutes} Minutes
- Target Difficulty: ${difficulty}
- Syllabus Scope: ${syllabusType} (${chapters.length > 0 ? chapters.join(', ') : 'All prescribed topics'})
${syllabusText ? `Additional Syllabus Content: ${syllabusText}` : ''}

REQUIRED SECTION STRUCTURE (Strictly follow this marks distribution):
${sectionsSummary}

STRICT ACADEMIC GUIDELINES:
1. Every question must be original, pedagogically sound, and error-free.
2. For Multiple Choice Questions (MCQs), provide exactly 4 clear options (A, B, C, D) and specify the single correct option.
3. For Numerical problems, ensure figures are clean, verified, and include correct SI units.
4. For Assertion-Reason questions, clearly state Assertion (A) and Reason (R) with standard options.
5. For Case-Based / Passage-based questions, provide an engaging case scenario followed by sub-questions.
6. The total sum of marks across all mandatory questions MUST equal exactly ${maxMarks} marks.
7. For the Answer Key and Detailed Solutions:
   - Provide the complete solution for every question matching the question numbering.
   - For numericals, show step-by-step mathematical working.
   - For Science/Chemistry, provide balanced chemical equations.
   - Include a Teacher Marking Scheme showing point-by-point mark distribution (e.g. Formula: 1M, Calculation: 1M, Answer with units: 1M).
8. Return ONLY valid JSON with no markdown backticks, matching this exact schema:

{
  "generalInstructions": [
    "This question paper consists of ${sections.length} sections and questions totaling ${maxMarks} marks.",
    "All questions are compulsory. Internal choices are provided in specific questions.",
    "Calculators and electronic devices are strictly not permitted.",
    "Write legibly and show all calculation steps where applicable."
  ],
  "sections": [
    {
      "id": "section-a",
      "name": "Section A",
      "title": "Multiple Choice Questions",
      "instructions": "All questions carry 1 mark each.",
      "questionCount": 10,
      "marksPerQuestion": 1,
      "totalMarks": 10,
      "questionType": "mcq",
      "questions": [
        {
          "id": "q-1",
          "sectionId": "section-a",
          "number": 1,
          "type": "mcq",
          "text": "Question text here...",
          "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
          "correctOption": "B",
          "marks": 1,
          "difficulty": "moderate",
          "chapter": "Chapter Name",
          "hasInternalChoice": false
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionNumber": 1,
      "questionId": "q-1",
      "type": "mcq",
      "correctAnswer": "Option B: ...",
      "solutionSteps": [
        "Step 1: Reason...",
        "Step 2: Conclusion..."
      ],
      "markingScheme": [
        {"step": "Correct option selected with correct rationale", "marks": 1}
      ],
      "explanation": "Brief student explanation..."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are Paper Genius AI, a professional question paper generator. You output pure JSON without conversational filler or markdown wrappers.',
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        let cleanText = rawText.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsedData = JSON.parse(cleanText);

        // Calculate verified total marks
        let calculatedTotal = 0;
        parsedData.sections.forEach((sec: any) => {
          sec.questions.forEach((q: any) => {
            calculatedTotal += Number(q.marks || sec.marksPerQuestion || 1);
          });
        });

        const completePaper = {
          id: 'paper-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title,
          instituteName,
          country,
          board,
          classLevel,
          academicYear,
          subject,
          examType,
          language,
          durationMinutes: Number(durationMinutes),
          maxMarks: Number(maxMarks),
          totalCalculatedMarks: calculatedTotal || Number(maxMarks),
          difficulty,
          syllabusType,
          syllabusText,
          chapters,
          generalInstructions: parsedData.generalInstructions || [
            'All questions are compulsory.',
            'Marks are indicated against each question.',
          ],
          sections: parsedData.sections,
          answerKey: parsedData.answerKey,
          watermark: {
            text: watermark.text || 'Ravi Kishan',
            enabled: watermark.enabled !== false,
            opacity: watermark.opacity || 0.12,
            rotation: watermark.rotation || -35,
            color: watermark.color || '#64748b',
            fontSize: watermark.fontSize || 48,
          },
        };

        return res.json({ success: true, paper: completePaper, source: 'gemini-ai' });
      } catch (geminiError: any) {
        console.error('Gemini generation error, using fallback generator:', geminiError?.message || geminiError);
        // Fall back to built-in generator so user workflow never breaks
      }
    }

    // Built-in intelligent generator (fallback / offline mode)
    const fallbackPaper = generateOfflinePaper({
      title,
      instituteName,
      country,
      board,
      classLevel,
      academicYear,
      subject,
      examType,
      language,
      durationMinutes,
      maxMarks,
      difficulty,
      syllabusType,
      syllabusText,
      chapters,
      sections,
      watermark,
    });

    return res.json({
      success: true,
      paper: fallbackPaper,
      source: ai ? 'fallback' : 'offline-engine',
      notice: !ai ? 'Generated using Paper Genius AI Standard Engine (Set GEMINI_API_KEY in environment for Gemini 3.8 Flash live generations).' : undefined,
    });
  } catch (err: any) {
    console.error('Error generating question paper:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to generate question paper. Please try again.',
    });
  }
});

// Single Question Regeneration Endpoint
app.post('/api/regenerate-question', async (req, res) => {
  try {
    const {
      subject = 'Science',
      classLevel = 'Class 10',
      chapter = 'General',
      questionType = 'mcq',
      marks = 1,
      difficulty = 'moderate',
      existingText = '',
    } = req.body;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are Paper Genius AI. Regenerate a single, fresh, original academic question for:
Subject: ${subject}
Class: ${classLevel}
Chapter: ${chapter}
Question Type: ${questionType}
Marks: ${marks}
Difficulty: ${difficulty}
Previous question to replace (do NOT repeat this): "${existingText}"

Return JSON matching:
{
  "text": "New question text...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctOption": "C",
  "marks": ${marks},
  "difficulty": "${difficulty}",
  "chapter": "${chapter}",
  "answer": "Correct answer summary...",
  "solutionSteps": ["Step 1...", "Step 2..."],
  "markingScheme": [{"step": "...", "marks": ${marks}}],
  "explanation": "Clear educational explanation."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const raw = response.text || '{}';
        const parsed = JSON.parse(raw);
        return res.json({ success: true, question: parsed });
      } catch (err) {
        console.error('AI question regeneration failed, using deterministic alternative', err);
      }
    }

    // Deterministic fallback question
    const fallbackQ = generateSingleQuestionFallback(subject, chapter, questionType, marks, difficulty);
    return res.json({ success: true, question: fallbackQ });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Offline Paper Generator for robust reliability
function generateOfflinePaper(params: any) {
  const {
    title,
    instituteName,
    country,
    board,
    classLevel,
    academicYear,
    subject,
    examType,
    language,
    durationMinutes,
    maxMarks,
    difficulty,
    syllabusType,
    syllabusText,
    chapters = [],
    sections = [],
    watermark,
  } = params;

  let currentQNum = 1;
  const builtSections: any[] = [];
  const answerKey: any[] = [];

  const defaultSections = sections.length > 0 ? sections : [
    { name: 'Section A', title: 'Objective Type Questions', questionCount: 10, marksPerQuestion: 1, questionType: 'mcq' },
    { name: 'Section B', title: 'Very Short Answer Questions', questionCount: 5, marksPerQuestion: 2, questionType: 'vsa' },
    { name: 'Section C', title: 'Short Answer Questions', questionCount: 5, marksPerQuestion: 3, questionType: 'sa' },
    { name: 'Section D', title: 'Long Answer Questions', questionCount: 3, marksPerQuestion: 5, questionType: 'la' },
  ];

  defaultSections.forEach((sec: any, sIdx: number) => {
    const secId = sec.id || `sec-${String.fromCharCode(97 + sIdx)}`;
    const questions: any[] = [];
    const count = Number(sec.questionCount) || 5;
    const qMarks = Number(sec.marksPerQuestion) || 1;
    const qType = sec.questionType || (qMarks === 1 ? 'mcq' : qMarks === 2 ? 'vsa' : qMarks === 3 ? 'sa' : 'la');

    for (let i = 0; i < count; i++) {
      const qId = `q-${currentQNum}`;
      const chName = chapters.length > 0 ? chapters[i % chapters.length] : `${subject} Chapter ${(i % 5) + 1}`;
      const qData = generateSingleQuestionFallback(subject, chName, qType, qMarks, difficulty, currentQNum);

      questions.push({
        id: qId,
        sectionId: secId,
        number: currentQNum,
        type: qType,
        text: qData.text,
        options: qData.options,
        correctOption: qData.correctOption,
        marks: qMarks,
        difficulty: qData.difficulty,
        chapter: chName,
        hasInternalChoice: i === count - 1 && qMarks >= 3,
        orQuestion: i === count - 1 && qMarks >= 3 ? {
          text: `Alternative: ${qData.text.replace('Calculate', 'Explain the significance of').replace('Define', 'Contrast')} with practical illustrations.`,
          answer: 'Comprehensive alternative answer discussing core concepts and application principles.',
          solutionSteps: ['Definition & context (1 Mark)', 'Core explanation (2 Marks)', 'Illustration / Diagram (2 Marks)'],
        } : undefined,
      });

      answerKey.push({
        questionNumber: currentQNum,
        questionId: qId,
        type: qType,
        correctAnswer: qData.answer,
        solutionSteps: qData.solutionSteps,
        markingScheme: qData.markingScheme,
        explanation: qData.explanation,
        keyFormulasOrEquations: qData.keyFormulasOrEquations,
      });

      currentQNum++;
    }

    builtSections.push({
      id: secId,
      name: sec.name || `Section ${String.fromCharCode(65 + sIdx)}`,
      title: sec.title || `${sec.name} Questions`,
      instructions: sec.instructions || `Each question carries ${qMarks} mark${qMarks > 1 ? 's' : ''}.`,
      questionCount: count,
      marksPerQuestion: qMarks,
      totalMarks: count * qMarks,
      questionType: qType,
      questions,
    });
  });

  const totalCalc = builtSections.reduce((acc, s) => acc + s.totalMarks, 0);

  return {
    id: 'paper-' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: title || `${classLevel} ${subject} ${examType}`,
    instituteName: instituteName || 'Paper Genius AI Academy',
    country: country || 'India',
    board: board || 'CBSE',
    classLevel: classLevel || 'Class 10',
    academicYear: academicYear || '2026-2027',
    subject: subject || 'Science',
    examType: examType || 'Annual Examination',
    language: language || 'English',
    durationMinutes: Number(durationMinutes) || 90,
    maxMarks: Number(maxMarks) || 50,
    totalCalculatedMarks: totalCalc,
    difficulty: difficulty || 'Balanced (Standard)',
    syllabusType: syllabusType || 'complete',
    syllabusText: syllabusText || '',
    chapters: chapters || [],
    generalInstructions: [
      `This question paper consists of ${builtSections.length} sections: ${builtSections.map(s => s.name).join(', ')}.`,
      'All questions are compulsory. Internal choice has been provided in selected questions.',
      `Maximum marks: ${maxMarks}. Time allowed: ${durationMinutes} Minutes.`,
      'Section A comprises objective type questions of 1 mark each.',
      'Sections B, C, and D contain subjective questions. Show all working steps clearly.',
      'Use of calculators or any electronic communication devices is strictly prohibited.',
    ],
    sections: builtSections,
    answerKey,
    watermark: {
      text: watermark?.text || 'Ravi Kishan',
      enabled: watermark?.enabled !== false,
      opacity: watermark?.opacity || 0.12,
      rotation: watermark?.rotation || -35,
      color: watermark?.color || '#64748b',
      fontSize: watermark?.fontSize || 48,
    },
  };
}

function generateSingleQuestionFallback(subject: string, chapter: string, type: string, marks: number, difficulty: string, qIndex = 1) {
  const isMath = subject.toLowerCase().includes('math');
  const isPhys = subject.toLowerCase().includes('phys');
  const isChem = subject.toLowerCase().includes('chem');
  const isBio = subject.toLowerCase().includes('bio') || subject.toLowerCase().includes('science');

  if (type === 'mcq') {
    if (isMath) {
      return {
        text: `If the roots of the quadratic equation 2x² - 8x + k = 0 are real and equal, find the value of k.`,
        options: ['A. k = 4', 'B. k = 8', 'C. k = 16', 'D. k = 2'],
        correctOption: 'B',
        marks: 1,
        difficulty: 'moderate',
        chapter,
        answer: 'Option B (k = 8)',
        solutionSteps: [
          'For equal roots, discriminant D = b² - 4ac = 0',
          'Here a = 2, b = -8, c = k',
          '(-8)² - 4(2)(k) = 0 => 64 - 8k = 0 => 8k = 64 => k = 8.',
        ],
        markingScheme: [{ step: 'Correct condition D = 0 and value k = 8', marks: 1 }],
        explanation: 'The discriminant condition ensures quadratic roots are identical and real.',
      };
    } else if (isChem) {
      return {
        text: `Which of the following compounds turns blue litmus solution red and produces effervescence with sodium bicarbonate?`,
        options: ['A. Ethanol (C₂H₅OH)', 'B. Ethanoic acid (CH₃COOH)', 'C. Ethyl acetate', 'D. Acetone'],
        correctOption: 'B',
        marks: 1,
        difficulty: 'moderate',
        chapter,
        answer: 'Option B (Ethanoic acid)',
        solutionSteps: [
          'Carboxylic acids are acidic in nature and turn blue litmus red.',
          'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑ (effervescence is due to CO₂ gas).',
        ],
        markingScheme: [{ step: 'Identification of Ethanoic acid with reaction basis', marks: 1 }],
        keyFormulasOrEquations: ['CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑'],
        explanation: 'Carboxylic group reacts with weak carbonates to liberate carbon dioxide gas.',
      };
    } else {
      return {
        text: `Which component of blood is primarily responsible for forming clots at the site of injury to prevent excessive bleeding?`,
        options: ['A. Red Blood Cells (RBCs)', 'B. White Blood Cells (WBCs)', 'C. Platelets (Thrombocytes)', 'D. Blood Plasma'],
        correctOption: 'C',
        marks: 1,
        difficulty: 'easy',
        chapter,
        answer: 'Option C (Platelets)',
        solutionSteps: [
          'Platelets circulate in blood and aggregate at the site of damaged blood vessels.',
          'They release thromboplastin, which converts prothrombin to thrombin, forming a fibrin clot.',
        ],
        markingScheme: [{ step: 'Correct option C (Platelets)', marks: 1 }],
        explanation: 'Platelets plug the ruptured vessel and release clotting factors.',
      };
    }
  }

  if (type === 'vsa' || marks === 2) {
    if (isMath) {
      return {
        text: `Find the 20th term from the end of the Arithmetic Progression: 3, 8, 13, ..., 253.`,
        marks: 2,
        difficulty: 'moderate',
        chapter,
        answer: '158',
        solutionSteps: [
          'Reversing the AP gives: 253, 248, 243, ..., 3',
          'First term a = 253, common difference d = -5',
          'nth term formula: aₙ = a + (n - 1)d',
          'a₂₀ = 253 + (20 - 1)(-5) = 253 - 95 = 158.',
        ],
        markingScheme: [
          { step: 'Writing reversed AP or identifying formula', marks: 1 },
          { step: 'Correct calculation and final answer 158', marks: 1 },
        ],
        explanation: 'Working backwards with reversed common difference simplifies nth term from the end.',
      };
    } else {
      return {
        text: `State Ohm's Law. Write the mathematical expression and define the SI unit of resistance.`,
        marks: 2,
        difficulty: 'moderate',
        chapter,
        answer: 'V = IR; 1 Ohm = 1 Volt / 1 Ampere',
        solutionSteps: [
          'Statement: Potential difference V across metallic conductor is directly proportional to current I passing through it, provided physical conditions (temperature) remain constant: V ∝ I => V = IR.',
          'Unit: The SI unit of resistance is Ohm (Ω). One Ohm is the resistance when a potential difference of 1 Volt causes a current of 1 Ampere.',
        ],
        markingScheme: [
          { step: 'Ohm\'s law statement and formula V = IR', marks: 1 },
          { step: 'Definition of 1 Ohm with SI units', marks: 1 },
        ],
        keyFormulasOrEquations: ['V = I · R', '1 Ω = 1 V / 1 A'],
        explanation: 'Defines linear electrical conduction behavior under constant temperature.',
      };
    }
  }

  if (type === 'sa' || marks === 3) {
    return {
      text: `An electric lamp of 100 Ω, a toaster of resistance 50 Ω, and a water filter of resistance 500 Ω are connected in parallel to a 220 V source.
(a) What is the equivalent resistance of the combination?
(b) What is the total current drawn from the line?`,
      marks: 3,
      difficulty: 'moderate',
      chapter,
      answer: 'Equivalent Resistance R_p = 31.25 Ω; Total Current I = 7.04 A',
      solutionSteps: [
        '1/R_p = 1/R₁ + 1/R₂ + 1/R₃ = 1/100 + 1/50 + 1/500',
        'LCM(100, 50, 500) = 500 => 1/R_p = (5 + 10 + 1)/500 = 16/500',
        'R_p = 500 / 16 = 31.25 Ω',
        'Current I = V / R_p = 220 / 31.25 = 7.04 A.',
      ],
      markingScheme: [
        { step: 'Formula for parallel resistance and calculation', marks: 1.5 },
        { step: 'Calculation of total current with units (Amperes)', marks: 1.5 },
      ],
      keyFormulasOrEquations: ['1/R_p = 1/R₁ + 1/R₂ + 1/R₃', 'I = V / R_p'],
      explanation: 'In parallel circuits, voltage across every appliance remains identical (220V).',
    };
  }

  // Long Answer / 5 Marks
  return {
    text: `(a) State the principle of working of an electric generator (or AC dynamo).
(b) With the help of a labeled diagram, explain the function of:
    (i) Armature coil
    (ii) Slip rings and carbon brushes
(c) How can the magnitude of induced electromotive force (EMF) be increased?`,
    marks: 5,
    difficulty: 'challenging',
    chapter,
    answer: 'Electromagnetic induction principle; mechanical to electrical energy conversion with detailed step allocation.',
    solutionSteps: [
      'Principle: Works on Faraday\'s law of electromagnetic induction—when a coil rotates in a uniform magnetic field, magnetic flux linked with it changes, inducing an alternating EMF.',
      'Armature coil: Rectangular copper coil wound over a soft iron core to increase magnetic field intensity.',
      'Slip rings: Rotate with coil to maintain continuous electrical contact without twisting wires.',
      'Carbon brushes: Press lightly against slip rings to conduct current to external circuit.',
      'Ways to increase EMF: (1) Increasing speed of rotation, (2) Increasing number of turns in coil, (3) Using stronger permanent magnets.',
    ],
    markingScheme: [
      { step: 'Statement of principle of electromagnetic induction', marks: 1 },
      { step: 'Labeled diagram / structural overview', marks: 1 },
      { step: 'Function of armature, slip rings, and brushes', marks: 2 },
      { step: 'Factors to increase induced EMF', marks: 1 },
    ],
    keyFormulasOrEquations: ['e = -N(dΦ/dt)'],
    explanation: 'Rotational kinetic energy is converted to alternating electrical energy.',
  };
}

// Development Vite integration vs Production static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Paper Genius AI server running on port ${PORT}`);
  });
}

startServer();
