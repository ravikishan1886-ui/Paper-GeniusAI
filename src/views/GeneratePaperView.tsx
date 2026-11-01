import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Clock,
  RotateCcw,
  Camera,
  Image as ImageIcon,
  Eye,
  FileUp,
  Scan,
  Loader2,
  CheckCircle2,
  ArrowRight,
  X,
  Key,
  ExternalLink,
} from 'lucide-react';
import {
  BOARDS,
  CLASSES,
  STANDARD_TEMPLATES,
} from '../data/curriculum';
import { QuestionPaper, QuestionType, WatermarkConfig, TextbookAnalysisResult } from '../types';
import { DEFAULT_WATERMARK } from '../utils/storage';

interface UploadedTextbookImage {
  id: string;
  name: string;
  mimeType: string;
  data: string; // base64
  previewUrl: string;
  size: number;
}

interface GeneratePaperViewProps {
  onPaperGenerated: (paper: QuestionPaper) => void;
  watermarkSettings: WatermarkConfig;
}

export const GeneratePaperView: React.FC<GeneratePaperViewProps> = ({
  onPaperGenerated,
  watermarkSettings,
}) => {
  // Pure 2-Step Flow
  const [step, setStep] = useState<1 | 2>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // User Groq API Key management
  const [userGroqKey, setUserGroqKey] = useState<string>(
    () => localStorage.getItem('paper_genius_groq_key') || ''
  );
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(userGroqKey);
  const [rateLimitNotice, setRateLimitNotice] = useState(false);

  // Step 1: Textbook Page Images & Vision Analysis
  const [uploadedImages, setUploadedImages] = useState<UploadedTextbookImage[]>([]);
  const [analyzingImages, setAnalyzingImages] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TextbookAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  // Academic Details (Extracted & User Adjusted)
  const [subject, setSubject] = useState('Science');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [board, setBoard] = useState('CBSE');
  const [country, setCountry] = useState('India');
  const [chapterTitle, setChapterTitle] = useState('');
  const [instituteName, setInstituteName] = useState('Delhi Public Senior Secondary School');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [language, setLanguage] = useState('English');

  // Step 2: Exam Settings & Marks Distribution
  const [paperTitle, setPaperTitle] = useState('Class 10 Science - Textbook Examination 2026-27');
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

  // Calculate total marks across sections
  const totalCalculatedMarks = sections.reduce(
    (sum, sec) => sum + (Number(sec.questionCount) || 0) * (Number(sec.marksPerQuestion) || 0),
    0
  );
  const marksMatch = totalCalculatedMarks === Number(maxMarks);

  // Save user custom Groq key
  const handleSaveGroqKey = (key: string) => {
    const trimmed = key.trim();
    setUserGroqKey(trimmed);
    localStorage.setItem('paper_genius_groq_key', trimmed);
    setShowKeyModal(false);
    setRateLimitNotice(false);
  };

  // Helper to get request headers with custom Groq key
  const getRequestHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userGroqKey && userGroqKey.trim()) {
      headers['x-groq-api-key'] = userGroqKey.trim();
    }
    return headers;
  };

  // Handle uploading textbook page images
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: UploadedTextbookImage[] = [];
    const fileArray = Array.from(files);

    let processed = 0;
    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        processed++;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultStr = e.target?.result as string;
        newItems.push({
          id: 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          name: file.name,
          mimeType: file.type || 'image/jpeg',
          data: resultStr,
          previewUrl: resultStr,
          size: file.size,
        });
        processed++;
        if (processed === fileArray.length) {
          setUploadedImages((prev) => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => {
      const remaining = prev.filter((img) => img.id !== id);
      if (remaining.length === 0) {
        setAnalysisResult(null);
      }
      return remaining;
    });
  };

  // Analyze textbook images with Groq AI Vision
  const handleAnalyzeImages = async () => {
    if (uploadedImages.length === 0) return;
    setAnalyzingImages(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-textbook', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
          images: uploadedImages.map((img) => ({
            name: img.name,
            mimeType: img.mimeType,
            data: img.data,
          })),
        }),
      });

      const res = await response.json();

      if (response.status === 429 || res.rateLimitExceeded) {
        setRateLimitNotice(true);
        setShowKeyModal(true);
        throw new Error('Groq API rate limit exceeded. Please enter your personal Groq API key.');
      }

      if (!res.success || !res.analysis) {
        throw new Error(res.error || 'Vision analysis could not be completed.');
      }

      const analysis = res.analysis;
      setAnalysisResult(analysis);

      // Auto-apply findings
      if (analysis.detectedSubject) setSubject(analysis.detectedSubject);
      if (analysis.detectedClass) setClassLevel(analysis.detectedClass);
      if (analysis.detectedChapter) setChapterTitle(analysis.detectedChapter);
      if (analysis.recommendedExamTitle) setPaperTitle(analysis.recommendedExamTitle);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err?.message || 'Failed to analyze textbook pages.');
    } finally {
      setAnalyzingImages(false);
    }
  };

  // Auto-balance marks to equal maxMarks
  const handleAutoBalance = () => {
    const diff = Number(maxMarks) - totalCalculatedMarks;
    if (diff === 0 || sections.length === 0) return;

    const newSections = [...sections];
    const lastSec = newSections[newSections.length - 1];
    const m = lastSec.marksPerQuestion || 1;
    const extraQuestions = Math.round(diff / m);

    if (lastSec.questionCount + extraQuestions > 0) {
      lastSec.questionCount += extraQuestions;
      setSections(newSections);
    } else {
      setMaxMarks(totalCalculatedMarks);
    }
  };

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

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  // Main Generation Handler using Groq API
  const handleGenerate = async () => {
    if (!marksMatch) {
      setError(`Marks mismatch: Sections total (${totalCalculatedMarks}) does not equal Maximum Marks (${maxMarks}). Please auto-balance or adjust sections.`);
      return;
    }

    if (uploadedImages.length === 0) {
      setError('Please upload at least one textbook page image in Step 1 to generate questions.');
      setStep(1);
      return;
    }

    setError(null);
    setGenerating(true);
    setGenStage(1);

    const timer1 = setTimeout(() => setGenStage(2), 1600);
    const timer2 = setTimeout(() => setGenStage(3), 3400);

    try {
      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
          title: paperTitle,
          instituteName,
          country,
          board,
          classLevel,
          academicYear,
          subject,
          examType: 'Textbook Chapter Examination',
          language,
          durationMinutes,
          maxMarks,
          difficulty,
          syllabusType: 'textbook_images',
          chapters: chapterTitle ? [chapterTitle] : [`${subject} Chapter`],
          sections,
          textbookImages: uploadedImages.map((img) => ({
            name: img.name,
            mimeType: img.mimeType,
            data: img.data,
          })),
          watermark: watermarkSettings || DEFAULT_WATERMARK,
        }),
      });

      const data = await response.json();

      if (response.status === 429 || data.rateLimitExceeded) {
        setRateLimitNotice(true);
        setShowKeyModal(true);
        throw new Error('Groq API rate limit exceeded. Please enter your personal Groq API key.');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate question paper');
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      onPaperGenerated(data.paper);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error occurred while generating paper.');
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
            <Camera className="w-3.5 h-3.5" />
            <span>Textbook AI Question Paper Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Question Paper from Textbook Pages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload textbook photos or scans. Groq AI analyzes the images and formats authentic questions in 2 simple steps.
          </p>
        </div>

        {/* 2-Step Indicator & API Key Pill */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Custom Groq Key Badge */}
          <button
            onClick={() => {
              setKeyInput(userGroqKey);
              setShowKeyModal(true);
            }}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              userGroqKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{userGroqKey ? 'Custom Groq Key: Active' : 'Configure Groq API Key'}</span>
          </button>

          {/* Steps */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStep(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                step === 1 ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Upload Textbook Pages
            </button>
            <button
              onClick={() => {
                if (uploadedImages.length > 0) setStep(2);
                else setError('Please upload at least one textbook page image first.');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                step === 2 ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Marks & Sections
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-xs text-red-700">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold">Notice</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* STEP 1: UPLOAD TEXTBOOK PAGE IMAGES & VISION ANALYSIS */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              <span>Step 1: Upload Textbook Pages & Extract Concepts</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Take photos or upload textbook pages. Groq AI Vision will read all paragraphs, diagrams, formulas, and exercise problems.
            </p>
          </div>

          {/* Upload Drop Zone */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <FileUp className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Upload Textbook Pages or Chapter Photos
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Snap photos with your phone camera or select images (PNG, JPG, WebP). You can upload multiple pages of the same chapter.
              </p>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            {/* Upload Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Choose Images from Device</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs shadow-2xs transition-colors"
              >
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Capture Page with Camera</span>
              </button>
            </div>
          </div>

          {/* Uploaded Pages Gallery */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Uploaded Textbook Pages ({uploadedImages.length}):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImages([]);
                    setAnalysisResult(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear All Pages
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={img.previewUrl}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900/80 text-white backdrop-blur-xs">
                        Page {idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => setPreviewModalImg(img.previewUrl)}
                        className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Eye className="w-6 h-6 drop-shadow" />
                      </button>
                    </div>

                    <div className="p-2.5 bg-white flex items-center justify-between text-[11px] border-t border-slate-100">
                      <span className="truncate max-w-[100px] text-slate-700 font-medium">
                        {img.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trigger Analysis Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-bold text-xs text-indigo-950 flex items-center justify-center sm:justify-start space-x-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Run AI Vision Analysis</span>
                  </div>
                  <p className="text-[11px] text-indigo-800">
                    Groq AI analyzes concepts, formulas, solved examples, and figures on your uploaded pages.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={analyzingImages}
                  onClick={handleAnalyzeImages}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                >
                  {analyzingImages ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Pages...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-3.5 h-3.5" />
                      <span>Analyze Textbook Pages with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Analysis Error Alert */}
          {analysisError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Analysis Findings */}
          {analysisResult && (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Textbook Pages Comprehension Complete
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Extracted from {uploadedImages.length} uploaded page(s)
                  </p>
                </div>
              </div>

              {/* Editable Academic Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chapter / Unit Title</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Chapter Title"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Summary */}
              {analysisResult.summary && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Pedagogical Summary:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {analysisResult.summary}
                  </p>
                </div>
              )}

              {/* Key Topics Extracted */}
              {analysisResult.keyTopics && analysisResult.keyTopics.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Extracted Core Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.keyTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                      >
                        ✓ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas / Equations */}
              {analysisResult.extractedFormulas && analysisResult.extractedFormulas.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Formulas, Laws & Equations Found:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-amber-900 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    {analysisResult.extractedFormulas.map((form, i) => (
                      <span key={i} className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                        {form}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1 Footer Action */}
          <div className="pt-4 flex justify-end border-t border-slate-100">
            <button
              onClick={() => {
                if (uploadedImages.length === 0) {
                  setError('Please upload at least one textbook page image to proceed to Step 2.');
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <span>Continue to Step 2: Marks & Sections</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: MARKS DISTRIBUTION & SECTION BLUEPRINT */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Step 2: Marks Distribution & Section Blueprint</span>
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
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step 1</span>
            </button>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate with Groq AI</span>
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
                {genStage === 1 && `Reading and analyzing ${uploadedImages.length} textbook page(s) with Groq Vision...`}
                {genStage === 2 && 'Synthesizing authentic questions strictly from textbook pages & step solutions...'}
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
              Powered by Groq AI • Paper Genius AI
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN TEXTBOOK IMAGE PREVIEW MODAL */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between text-xs font-bold border-b border-slate-700">
              <span className="flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>Textbook Page Preview</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center max-h-[80vh]">
              <img
                src={previewModalImg}
                alt="Textbook Page"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* GROQ API KEY CONFIGURATION & RATE LIMIT MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {rateLimitNotice ? 'Groq API Limit Reached' : 'Configure Groq API Key'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provide your personal key for uninterrupted generation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {rateLimitNotice && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Standard Groq Rate Limit Exceeded</span>
                </p>
                <p>
                  You can upload your own free Groq API key to continue generating without waiting.
                </p>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Groq API Key (starts with gsk_...)
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Don't have a key? It's free from Groq Console:</span>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-0.5 text-indigo-600 hover:underline font-bold"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveGroqKey(keyInput)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Key & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
