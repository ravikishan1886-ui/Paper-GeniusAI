import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Key,
  Sparkles,
  Download,
  Shield,
  Sliders,
  RotateCcw,
  Eye,
  CheckCircle2,
  Info
} from 'lucide-react';
import { QuestionPaper, WatermarkConfig, Question, AnswerItem } from '../types';
import { exportPaperToPDF } from '../utils/pdfGenerator';
import { DEFAULT_WATERMARK } from '../utils/storage';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: QuestionPaper;
  watermarkConfig?: WatermarkConfig;
  initialTab?: 'paper' | 'answers' | 'solutions';
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  paper,
  watermarkConfig,
  initialTab = 'paper',
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'answers' | 'solutions'>(initialTab);
  const [zoom, setZoom] = useState<number>(85); // 85% default fit
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(
    watermarkConfig?.enabled ?? true
  );
  const [watermarkText, setWatermarkText] = useState<string>(
    watermarkConfig?.text || 'Ravi Kishan'
  );
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(
    watermarkConfig?.opacity || 0.12
  );
  const [includeInstructions, setIncludeInstructions] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'compact' | 'standard' | 'large'>('standard');
  const [spacing, setSpacing] = useState<'tight' | 'normal' | 'relaxed'>('normal');
  const [paperMargin, setPaperMargin] = useState<'normal' | 'compact'>('normal');

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeWatermark: WatermarkConfig = useMemo(() => {
    return {
      ...(watermarkConfig || DEFAULT_WATERMARK),
      enabled: watermarkEnabled,
      text: watermarkText || 'Ravi Kishan',
      opacity: watermarkOpacity,
    };
  }, [watermarkConfig, watermarkEnabled, watermarkText, watermarkOpacity]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const typeMap = {
      paper: 'question_paper' as const,
      answers: 'answer_key' as const,
      solutions: 'detailed_solutions' as const,
    };
    exportPaperToPDF(paper, {
      type: typeMap[activeTab],
      watermarkOverride: activeWatermark,
    });
  };

  // Font size classes
  const fontClasses = {
    compact: {
      title: 'text-base font-black',
      inst: 'text-[10px]',
      secTitle: 'text-xs font-bold',
      qText: 'text-[11px]',
      optText: 'text-[10px]',
      marks: 'text-[10px]',
    },
    standard: {
      title: 'text-lg font-black',
      inst: 'text-xs',
      secTitle: 'text-sm font-bold',
      qText: 'text-xs sm:text-[13px]',
      optText: 'text-xs',
      marks: 'text-xs font-semibold',
    },
    large: {
      title: 'text-xl font-black',
      inst: 'text-xs sm:text-sm',
      secTitle: 'text-base font-bold',
      qText: 'text-sm sm:text-[15px]',
      optText: 'text-xs sm:text-sm',
      marks: 'text-xs sm:text-sm font-semibold',
    },
  }[fontSize];

  // Spacing classes
  const spacingClasses = {
    tight: 'space-y-2.5',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  }[spacing];

  // Margin padding
  const marginPadding = paperMargin === 'compact' ? 'p-8 sm:p-10' : 'p-10 sm:p-14';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md overflow-hidden select-none">
      {/* Top Floating Control Bar (Hidden when printed) */}
      <header className="no-print shrink-0 bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-black text-slate-100 tracking-tight">
                  Print Preview Mode
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  A4 Sheet Standard
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                {paper.title} • {paper.classLevel} {paper.subject}
              </p>
            </div>
          </div>

          {/* Center Tabs: Paper / Answers / Solutions */}
          <div className="flex items-center space-x-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('paper')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'paper'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Question Paper</span>
            </button>

            <button
              onClick={() => setActiveTab('answers')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'answers'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Answer Key</span>
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'solutions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teacher Solutions</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Download print-ready PDF"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              title="Send to connected printer (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Send to Printer</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Settings Ribbon */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          {/* Zoom controls */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Zoom:</span>
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              disabled={zoom <= 50}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs w-10 text-center font-bold text-slate-200">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(140, z + 10))}
              disabled={zoom >= 140}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(85)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
            >
              Fit
            </button>
            <button
              onClick={() => setZoom(100)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
            >
              100%
            </button>
          </div>

          {/* Watermark toggle */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="h-3.5 w-3.5 text-indigo-600 rounded bg-slate-800 border-slate-700 cursor-pointer"
              />
              <span className="text-[11px]">
                Watermark: <strong className="text-indigo-300">{watermarkText}</strong>
              </span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeInstructions}
                onChange={(e) => setIncludeInstructions(e.target.checked)}
                className="h-3.5 w-3.5 text-indigo-600 rounded bg-slate-800 border-slate-700 cursor-pointer"
              />
              <span className="text-[11px]">General Instructions</span>
            </label>
          </div>

          {/* Typography & Layout */}
          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">Font:</span>
              {(['compact', 'standard', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-1.5 py-0.5 rounded capitalize ${
                    fontSize === sz
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-slate-400">Spacing:</span>
              {(['tight', 'normal', 'relaxed'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpacing(sp)}
                  className={`px-1.5 py-0.5 rounded capitalize ${
                    spacing === sp
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Preview Sandbox (Dark Desk Background) */}
      <div
        ref={previewContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start bg-slate-900/90"
        style={{ perspective: '1000px' }}
      >
        {/* Printable Sheet Wrapper scaled by zoom factor */}
        <div
          className="print-sheet-wrapper transition-transform origin-top my-4"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* PHYSICAL A4 SHEET SIMULATION */}
          <div
            id="printable-paper-sheet"
            className={`print-page relative bg-white text-slate-900 ${marginPadding} shadow-2xl rounded-xs border border-slate-200/80 transition-all`}
            style={{
              width: '210mm',
              minHeight: '297mm',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* RAVI KISHAN WATERMARK SIMULATION */}
            {activeWatermark.enabled && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden z-0"
                aria-hidden="true"
              >
                <div
                  className="font-black tracking-widest whitespace-nowrap text-center"
                  style={{
                    transform: `rotate(${activeWatermark.rotation}deg)`,
                    opacity: activeWatermark.opacity,
                    color: activeWatermark.color || '#64748b',
                    fontSize: `${activeWatermark.fontSize * 1.3}px`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                  }}
                >
                  {activeWatermark.text || 'Ravi Kishan'}
                </div>
              </div>
            )}

            {/* DOCUMENT CONTENT (Foreground, z-10) */}
            <div className="relative z-10 space-y-6">
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-950 font-serif">
                  {paper.instituteName || 'DELHI PUBLIC SENIOR SECONDARY SCHOOL'}
                </h1>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-700">
                  {activeTab === 'paper' && (paper.examType || 'TERM-END SUMMATIVE EXAMINATION 2025-26')}
                  {activeTab === 'answers' && `${paper.title.toUpperCase()} • OFFICIAL ANSWER KEY`}
                  {activeTab === 'solutions' && `${paper.title.toUpperCase()} • TEACHER MARKING SCHEME & STEP-BY-STEP SOLUTIONS`}
                </p>
                <p className="text-xs font-semibold text-slate-600">
                  {paper.title} • {paper.classLevel} ({paper.subject})
                </p>

                {/* Exam Metadata Row */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-800 border-t border-slate-300 mt-2">
                  <span>Time Allowed: {paper.durationMinutes || 90} Minutes</span>
                  <span>Board: {paper.board || 'CBSE'}</span>
                  <span>Maximum Marks: {paper.maxMarks || 80}</span>
                </div>
              </div>

              {/* General Instructions (if enabled and on paper tab) */}
              {activeTab === 'paper' && includeInstructions && (
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 space-y-1.5 text-slate-800">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-900">
                    General Instructions:
                  </div>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-700 leading-relaxed font-sans">
                    <li>This question paper contains {paper.sections.length} sections: {paper.sections.map((s) => s.title).join(', ')}.</li>
                    <li>All questions are compulsory. However, internal choices have been provided in certain questions.</li>
                    <li>
                      {paper.sections.map((sec) => `${sec.title} comprises ${sec.questions.length} questions of ${sec.marksPerQuestion} mark${sec.marksPerQuestion > 1 ? 's' : ''} each`).join('; ')}.
                    </li>
                    <li>Use of calculators or mathematical tables is not permitted unless explicitly specified.</li>
                    <li>Write clearly and legibly. Neatness and diagrams will be credited.</li>
                  </ol>
                </div>
              )}

              {/* TAB 1: QUESTION PAPER */}
              {activeTab === 'paper' && (
                <div className="space-y-6">
                  {paper.sections.map((sec, secIdx) => (
                    <div key={sec.id || secIdx} className="space-y-3">
                      {/* Section Title Banner */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1 pt-2">
                        <h3 className={`${fontClasses.secTitle} text-slate-950 uppercase tracking-wide`}>
                          {sec.title} • {sec.instructions || `${sec.questionType.toUpperCase()} Questions`}
                        </h3>
                        <span className="text-xs font-bold text-slate-700">
                          [{sec.questions.length} × {sec.marksPerQuestion} = {sec.questions.length * sec.marksPerQuestion} Marks]
                        </span>
                      </div>

                      {/* Section Questions */}
                      <div className={spacingClasses}>
                        {sec.questions.map((q) => (
                          <div key={q.id} className="space-y-1.5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start space-x-2 flex-1">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm shrink-0">
                                  Q{q.number}.
                                </span>
                                <div className="space-y-1.5 flex-1">
                                  <p className={`${fontClasses.qText} text-slate-900 leading-relaxed`}>
                                    {q.text}
                                  </p>

                                  {/* Diagram or Context note if present */}
                                  {q.diagramDescription && (
                                    <div className="p-2.5 my-2 border border-dashed border-slate-400 rounded bg-slate-50 text-[11px] text-slate-700 italic">
                                      [Diagram Note: {q.diagramDescription}]
                                    </div>
                                  )}

                                  {/* MCQ Options (2-column layout) */}
                                  {q.options && q.options.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                                      {q.options.map((opt, optIdx) => (
                                        <div
                                          key={optIdx}
                                          className={`${fontClasses.optText} text-slate-800 flex items-start space-x-1.5`}
                                        >
                                          <span>{opt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Question Marks Bracket */}
                              <span className={`${fontClasses.marks} text-slate-900 font-bold shrink-0`}>
                                [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                              </span>
                            </div>

                            {/* Internal Choice Alternative */}
                            {q.hasInternalChoice && q.orQuestion && (
                              <div className="pt-2 pl-6 space-y-1.5 border-t border-slate-200 mt-2">
                                <div className="text-center font-bold text-xs uppercase text-slate-600 tracking-widest">
                                  — OR —
                                </div>
                                <p className={`${fontClasses.qText} text-slate-900 leading-relaxed`}>
                                  {q.orQuestion.text}
                                </p>
                                {q.orQuestion.options && q.orQuestion.options.length > 0 && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                                    {q.orQuestion.options.map((opt, optIdx) => (
                                      <div
                                        key={optIdx}
                                        className={`${fontClasses.optText} text-slate-800 flex items-start space-x-1.5`}
                                      >
                                        <span>{opt}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: ANSWER KEY */}
              {activeTab === 'answers' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 font-semibold flex items-center justify-between">
                    <span>Examiner Quick Reference Answer Key</span>
                    <span>Total Evaluated Questions: {paper.answerKey.length}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paper.answerKey.map((ans) => (
                      <div
                        key={ans.questionNumber}
                        className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Question {ans.questionNumber}</span>
                          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {ans.type}
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          <strong className="text-indigo-700">Ans: </strong>
                          {ans.correctAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TEACHER SOLUTIONS & MARKING SCHEME */}
              {activeTab === 'solutions' && (
                <div className="space-y-6">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 font-semibold flex items-center justify-between">
                    <span>Teacher Comprehensive Solutions & Step-Wise Marking Rubric</span>
                    <span>Watermark: Ravi Kishan</span>
                  </div>

                  <div className="space-y-4">
                    {paper.answerKey.map((ans) => (
                      <div
                        key={ans.questionNumber}
                        className="p-4 border border-slate-300 rounded-xl bg-slate-50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900">
                          <span className="text-sm">Question {ans.questionNumber} Comprehensive Solution</span>
                          <span className="text-[11px] text-slate-600 uppercase font-mono">
                            Type: {ans.type}
                          </span>
                        </div>

                        {/* Model Answer */}
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                            Model Answer:
                          </span>
                          <p className="text-slate-800 leading-relaxed font-sans pl-2 border-l-2 border-indigo-500">
                            {ans.correctAnswer}
                          </p>
                        </div>

                        {/* Step By Step Solution */}
                        {ans.solutionSteps && ans.solutionSteps.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                              Derivation / Solution Steps:
                            </span>
                            <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                              {ans.solutionSteps.map((st, sIdx) => (
                                <li key={sIdx} className="leading-relaxed">
                                  {st}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Step-by-Step Marking Scheme */}
                        {ans.markingScheme && ans.markingScheme.length > 0 && (
                          <div className="pt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block mb-1">
                              Marking Scheme:
                            </span>
                            <div className="space-y-1 bg-white p-2 rounded border border-slate-200">
                              {ans.markingScheme.map((item, mIdx) => (
                                <div key={mIdx} className="flex justify-between text-[11px] text-slate-700">
                                  <span>• {item.step}</span>
                                  <span className="font-bold text-indigo-700 shrink-0 ml-2">
                                    [{item.marks} M]
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Page Footer (Prints on bottom of document) */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                <span>Paper Genius AI • Create Smarter Question Papers in Seconds</span>
                <span className="font-bold text-slate-600">Document Watermark: {activeWatermark.text}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
