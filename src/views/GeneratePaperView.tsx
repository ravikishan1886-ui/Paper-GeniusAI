import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  BookOpen,
  Settings,
  ChevronRight,
  ChevronLeft,
  FileText,
  Clock,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import {
  BOARDS,
  CLASSES,
  SUBJECT_CHAPTERS,
  EXAM_TYPES,
  STANDARD_TEMPLATES,
} from '../data/curriculum';
import { QuestionPaper, QuestionType, WatermarkConfig } from '../types';
import { DEFAULT_WATERMARK } from '../utils/storage';

interface GeneratePaperViewProps {
  onPaperGenerated: (paper: QuestionPaper) => void;
  watermarkSettings: WatermarkConfig;
}

export const GeneratePaperView: React.FC<GeneratePaperViewProps> = ({
  onPaperGenerated,
  watermarkSettings,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Education Details
  const [country, setCountry] = useState('India');
  const [board, setBoard] = useState('CBSE');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [subject, setSubject] = useState('Science');
  const [examType, setExamType] = useState('Annual Board Examination');
  const [language, setLanguage] = useState('English');
  const [instituteName, setInstituteName] = useState('Delhi Public Senior Secondary School');

  // Step 2: Syllabus Scope
  const [syllabusType, setSyllabusType] = useState<'complete' | 'chapters' | 'topics' | 'custom'>('complete');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [customSyllabusText, setCustomSyllabusText] = useState('');
  const [chapterInput, setChapterInput] = useState('');

  // Step 3: Exam Settings & Marks Distribution
  const [paperTitle, setPaperTitle] = useState('Class 10 Science Annual Examination 2026-27');
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [difficulty, setDifficulty] = useState('Balanced (Standard)');

  // Sections configuration
  const [sections, setSections] = useState([
    {
      id: 'sec-a',
      name: 'Section A',
      title: 'Multiple Choice Questions (Objective)',
      questionCount: 10,
      marksPerQuestion: 1,
      questionType: 'mcq' as QuestionType,
      instructions: 'Each question carries 1 mark. Choose the correct option.',
    },
    {
      id: 'sec-b',
      name: 'Section B',
      title: 'Very Short Answer Questions',
      questionCount: 5,
      marksPerQuestion: 2,
      questionType: 'vsa' as QuestionType,
      instructions: 'Each question carries 2 marks. Answer in 30-50 words.',
    },
    {
      id: 'sec-c',
      name: 'Section C',
      title: 'Short Answer Questions',
      questionCount: 5,
      marksPerQuestion: 3,
      questionType: 'sa' as QuestionType,
      instructions: 'Each question carries 3 marks. Answer in 50-80 words.',
    },
    {
      id: 'sec-d',
      name: 'Section D',
      title: 'Long Answer & Competency Questions',
      questionCount: 3,
      marksPerQuestion: 5,
      questionType: 'la' as QuestionType,
      instructions: 'Each question carries 5 marks. Show step-by-step working.',
    },
  ]);

  // Loading & generation state
  const [generating, setGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Available chapters for the selected subject
  const availableChapters = SUBJECT_CHAPTERS[subject] || [
    'Introduction & Core Concepts',
    'Foundational Principles',
    'Applied Methodology',
    'Advanced Problem Solving',
    'Practical Case Studies',
  ];

  // Update paper title when subject or class changes
  useEffect(() => {
    setPaperTitle(`${classLevel} ${subject} ${examType}`);
  }, [classLevel, subject, examType]);

  // Calculate total marks across sections
  const totalCalculatedMarks = sections.reduce(
    (sum, sec) => sum + (Number(sec.questionCount) || 0) * (Number(sec.marksPerQuestion) || 0),
    0
  );

  const marksMatch = totalCalculatedMarks === Number(maxMarks);

  // Apply a pre-built template
  const applyTemplate = (templateName: string) => {
    const tmpl = STANDARD_TEMPLATES.find((t) => t.name === templateName);
    if (!tmpl) return;
    setMaxMarks(tmpl.maxMarks);
    setDurationMinutes(tmpl.durationMinutes);
    setSections(
      tmpl.sections.map((s) => ({
        ...s,
        instructions: s.instructions || '',
      }))
    );
  };

  // Auto-balance marks to equal maxMarks
  const handleAutoBalance = () => {
    const diff = Number(maxMarks) - totalCalculatedMarks;
    if (diff === 0 || sections.length === 0) return;

    // Distribute difference or adjust last section
    const newSections = [...sections];
    const lastSec = newSections[newSections.length - 1];
    const m = lastSec.marksPerQuestion || 1;
    const extraQuestions = Math.round(diff / m);

    if (lastSec.questionCount + extraQuestions > 0) {
      lastSec.questionCount += extraQuestions;
      setSections(newSections);
    } else {
      // Adjust max marks to match
      setMaxMarks(totalCalculatedMarks);
    }
  };

  // Add a new section
  const handleAddSection = () => {
    const nextLetter = String.fromCharCode(65 + sections.length);
    setSections([
      ...sections,
      {
        id: `sec-${nextLetter.toLowerCase()}`,
        name: `Section ${nextLetter}`,
        title: 'New Section',
        questionCount: 4,
        marksPerQuestion: 2,
        questionType: 'sa' as QuestionType,
        instructions: 'Each question carries 2 marks.',
      },
    ]);
  };

  // Remove a section
  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  // Toggle chapter selection
  const toggleChapter = (chapterName: string) => {
    if (selectedChapters.includes(chapterName)) {
      setSelectedChapters(selectedChapters.filter((c) => c !== chapterName));
    } else {
      setSelectedChapters([...selectedChapters, chapterName]);
    }
  };

  // Add custom chapter tag
  const handleAddCustomChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterInput.trim()) return;
    if (!selectedChapters.includes(chapterInput.trim())) {
      setSelectedChapters([...selectedChapters, chapterInput.trim()]);
    }
    setChapterInput('');
  };

  // Main Generation Handler
  const handleGenerate = async () => {
    if (!marksMatch) {
      setError(`Marks mismatch: Sections total (${totalCalculatedMarks}) does not equal Maximum Marks (${maxMarks}). Please auto-balance or adjust sections.`);
      return;
    }

    setError(null);
    setGenerating(true);
    setGenStage(1);

    const timer1 = setTimeout(() => setGenStage(2), 1500);
    const timer2 = setTimeout(() => setGenStage(3), 3200);

    try {
      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: paperTitle,
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
          syllabusText: customSyllabusText,
          chapters: selectedChapters.length > 0 ? selectedChapters : availableChapters.slice(0, 4),
          sections,
          watermark: watermarkSettings || DEFAULT_WATERMARK,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate question paper');
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      onPaperGenerated(data.paper);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error occurred while generating paper. Please check server connection.');
      setGenerating(false);
    }
  };

  const questionTypeLabels: Record<QuestionType, string> = {
    mcq: 'Multiple Choice (MCQ)',
    vsa: 'Very Short Answer (VSA)',
    sa: 'Short Answer (SA)',
    la: 'Long Answer (LA)',
    numerical: 'Numerical Problem',
    case_study: 'Case Study / Passage',
    assertion_reason: 'Assertion-Reason',
    fill_in_blanks: 'Fill in the Blanks',
    true_false: 'True or False',
    match_the_columns: 'Match Columns',
    diagram_based: 'Diagram-Based',
    source_based: 'Source-Based',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Question Paper Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Design Your Examination Paper
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure educational board, chapters, questions, and intelligent marks distribution.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {[
            { num: 1, label: 'Education' },
            { num: 2, label: 'Syllabus' },
            { num: 3, label: 'Sections & Marks' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => !generating && setStep(s.num as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                step === s.num
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : step > s.num
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden md:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-xs text-red-700">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold">Generation Notice</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* STEP 1: EDUCATION DETAILS */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Step 1: Academic & Examination Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select standard educational board guidelines or create a customized examination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* School / Institute Name */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                School / Institute / College Name
              </label>
              <input
                type="text"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                placeholder="e.g. St. Xavier's Senior Secondary School"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Board */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Education Board
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
              >
                {BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Class / Grade
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setSelectedChapters([]);
                }}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
              >
                {Object.keys(SUBJECT_CHAPTERS).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Examination Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Examination Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
              >
                {EXAM_TYPES.map((et) => (
                  <option key={et} value={et}>
                    {et}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026-2027"
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            {/* Language / Medium */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Medium / Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual (English + Hindi)">Bilingual (English + Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <span>Next: Select Syllabus</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SYLLABUS SCOPE */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Step 2: Syllabus & Chapter Selection</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify complete curriculum, select individual units, or provide custom syllabus text.
            </p>
          </div>

          {/* Scope Radios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'complete', title: 'Complete Syllabus', desc: 'All chapters prescribed by board' },
              { id: 'chapters', title: 'Selected Chapters', desc: 'Pick specific units or periodic test chapters' },
              { id: 'custom', title: 'Custom / Specific Topics', desc: 'Paste syllabus or chapter notes' },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setSyllabusType(opt.id as any)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  syllabusType === opt.id
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold text-sm">{opt.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
              </div>
            ))}
          </div>

          {/* Chapters Checklist */}
          {(syllabusType === 'chapters' || syllabusType === 'complete') && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Prescribed Chapters for {subject}:
                </label>
                <div className="space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedChapters([...availableChapters])}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedChapters([])}
                    className="text-slate-500 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
                {availableChapters.map((chap) => {
                  const isChecked = selectedChapters.includes(chap);
                  return (
                    <div
                      key={chap}
                      onClick={() => toggleChapter(chap)}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-indigo-300 bg-indigo-50/70 text-indigo-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded-sm text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span className="truncate">{chap}</span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Chapter Tag Input */}
              <form onSubmit={handleAddCustomChapter} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  placeholder="Add custom chapter or topic name..."
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Add Chapter
                </button>
              </form>
            </div>
          )}

          {/* Custom Syllabus Text Input */}
          {syllabusType === 'custom' && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                Paste Syllabus / Learning Outcomes / Specific Questions:
              </label>
              <textarea
                rows={5}
                value={customSyllabusText}
                onChange={(e) => setCustomSyllabusText(e.target.value)}
                placeholder="Paste your curriculum outline, chapter bullet points, or specific instructions for Gemini AI..."
                className="w-full p-3.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
              />
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <span>Next: Marks & Sections</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EXAM SETTINGS & INTELLIGENT MARKS DISTRIBUTION */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Step 3: Intelligent Marks Distribution & Section Blueprint</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize questions, marks per section, and verify automatic total calculations.
            </p>
          </div>

          {/* Quick Preset Templates */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Standard Board Templates (1-Click Presets):
            </label>
            <div className="flex flex-wrap gap-2">
              {STANDARD_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => applyTemplate(tmpl.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 transition-colors"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Top Exam Variables */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Paper Title
              </label>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Maximum Marks
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="Easy">Easy (Foundation)</option>
                <option value="Moderate">Moderate</option>
                <option value="Balanced (Standard)">Balanced (Standard)</option>
                <option value="Challenging">Challenging (Advanced)</option>
                <option value="High Order Thinking (HOTS)">High Order Thinking (HOTS)</option>
              </select>
            </div>
          </div>

          {/* LIVE MARKS CALCULATOR BAR */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              marksMatch
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              {marksMatch ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <div className="text-sm font-black">
                  Total Calculated Marks: {totalCalculatedMarks} / {maxMarks} Marks
                </div>
                <div className="text-xs">
                  {marksMatch
                    ? 'Perfect match! Marks distribution matches the maximum marks exactly.'
                    : `Discrepancy: ${
                        totalCalculatedMarks > maxMarks
                          ? `Total exceeds maximum marks by ${totalCalculatedMarks - maxMarks} marks.`
                          : `Total is short of maximum marks by ${maxMarks - totalCalculatedMarks} marks.`
                      }`}
                </div>
              </div>
            </div>

            {!marksMatch && (
              <button
                type="button"
                onClick={handleAutoBalance}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Auto-Balance Marks</span>
              </button>
            )}
          </div>

          {/* Sections Builder Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Section Blueprint:
              </label>
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-3">
              {sections.map((sec, idx) => {
                const secTotal = Number(sec.questionCount || 0) * Number(sec.marksPerQuestion || 0);
                return (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs px-2 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {sec.name}
                        </span>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[idx].title = e.target.value;
                            setSections(updated);
                          }}
                          className="font-bold text-xs text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-hidden px-1"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-xs text-slate-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                          Subtotal: {secTotal} Marks
                        </span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={sec.questionCount}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[idx].questionCount = Math.max(1, Number(e.target.value));
                            setSections(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Marks Per Question
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={sec.marksPerQuestion}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[idx].marksPerQuestion = Math.max(1, Number(e.target.value));
                            setSections(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Question Type
                        </label>
                        <select
                          value={sec.questionType}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[idx].questionType = e.target.value as QuestionType;
                            setSections(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          {Object.entries(questionTypeLabels).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Watermark Banner Info */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-800">Default PDF Watermark:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-indigo-600 font-bold">
                {watermarkSettings?.text || 'Ravi Kishan'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">✓ Enabled</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Adjustable in Settings tab
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate with Paper Genius AI</span>
            </button>
          </div>
        </div>
      )}

      {/* GENERATION LOADING OVERLAY */}
      {generating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-slate-200">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-25" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md ring-2 ring-indigo-500/30">
                <img
                  src="/assets/aistudio/Screenshot_20261026-183944_2_d8c50829.jpg"
                  alt="Paper Genius AI"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-xl text-slate-900">
                Generating Examination Paper
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {genStage === 1 && 'Ingesting board curriculum and syllabus standards...'}
                {genStage === 2 && 'Synthesizing original questions & step-by-step solutions...'}
                {genStage >= 3 && 'Validating marks sum and stamping Ravi Kishan watermark...'}
              </p>
            </div>

            {/* Stage Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: genStage === 1 ? '35%' : genStage === 2 ? '75%' : '95%',
                }}
              />
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Powered by Google Gemini 3.8 Flash • Paper Genius AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
