import React, { useState } from 'react';
import {
  FileText,
  Key,
  Download,
  Printer,
  Save,
  Copy,
  Undo2,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit3,
  Check,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Share2,
  Eye,
} from 'lucide-react';
import { QuestionPaper, Question, QuestionType, AnswerItem } from '../types';
import { exportPaperToPDF } from '../utils/pdfGenerator';
import { WatermarkOverlay } from '../components/WatermarkOverlay';
import { PrintPreviewModal } from '../components/PrintPreviewModal';

interface PaperEditorViewProps {
  paper: QuestionPaper;
  onSavePaper: (updatedPaper: QuestionPaper) => void;
  onDuplicatePaper: (paperId: string) => void;
  onBackToDashboard: () => void;
}

export const PaperEditorView: React.FC<PaperEditorViewProps> = ({
  paper: initialPaper,
  onSavePaper,
  onDuplicatePaper,
  onBackToDashboard,
}) => {
  const [paper, setPaper] = useState<QuestionPaper>(initialPaper);
  const [history, setHistory] = useState<QuestionPaper[]>([initialPaper]);
  const [activeTab, setActiveTab] = useState<'paper' | 'answers' | 'solutions'>('paper');
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [regeneratingQId, setRegeneratingQId] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Push state to undo history
  const updatePaperWithHistory = (newPaper: QuestionPaper) => {
    // Recalculate total marks across all questions
    let total = 0;
    newPaper.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        total += Number(q.marks || 1);
      });
    });
    const finalPaper = {
      ...newPaper,
      totalCalculatedMarks: total,
      updatedAt: new Date().toISOString(),
    };

    setHistory((prev) => [...prev.slice(-10), paper]);
    setPaper(finalPaper);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setPaper(prev);
  };

  const handleSave = () => {
    onSavePaper(paper);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  // Re-number all questions sequentially across all sections
  const renumberPaper = (targetPaper: QuestionPaper): QuestionPaper => {
    let qCounter = 1;
    const updatedSections = targetPaper.sections.map((sec) => {
      const updatedQuestions = sec.questions.map((q) => {
        const num = qCounter++;
        return { ...q, number: num };
      });
      return {
        ...sec,
        questionCount: updatedQuestions.length,
        questions: updatedQuestions,
      };
    });

    // Update answer keys to match new numbers
    const updatedAnswerKey = targetPaper.answerKey.map((ans, idx) => {
      return {
        ...ans,
        questionNumber: idx + 1,
      };
    });

    return {
      ...targetPaper,
      sections: updatedSections,
      answerKey: updatedAnswerKey,
    };
  };

  // Delete an individual question
  const handleDeleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = paper.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        questions: sec.questions.filter((q) => q.id !== questionId),
      };
    });

    const updatedAnswers = paper.answerKey.filter((a) => a.questionId !== questionId);
    const newPaper = renumberPaper({
      ...paper,
      sections: updatedSections,
      answerKey: updatedAnswers,
    });
    updatePaperWithHistory(newPaper);
  };

  // Add a new question to a section
  const handleAddQuestion = (sectionId: string) => {
    const sec = paper.sections.find((s) => s.id === sectionId);
    if (!sec) return;

    const newQId = 'q-' + Date.now();
    const newQuestion: Question = {
      id: newQId,
      sectionId,
      number: 999, // renumber will fix
      type: sec.questionType || 'sa',
      text: `Newly added ${sec.questionType.toUpperCase()} question. Click to edit question text.`,
      options: sec.questionType === 'mcq' ? ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'] : undefined,
      correctOption: sec.questionType === 'mcq' ? 'A' : undefined,
      marks: sec.marksPerQuestion || 2,
      difficulty: 'moderate',
      chapter: paper.chapters?.[0] || 'General',
    };

    const newAnswer: AnswerItem = {
      questionNumber: 999,
      questionId: newQId,
      type: newQuestion.type,
      correctAnswer: 'Model answer for new question.',
      solutionSteps: ['Detailed solution step 1', 'Detailed solution step 2'],
      markingScheme: [{ step: 'Complete answer explanation', marks: newQuestion.marks }],
      explanation: 'Educational rationale.',
    };

    const updatedSections = paper.sections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        questions: [...s.questions, newQuestion],
      };
    });

    const newPaper = renumberPaper({
      ...paper,
      sections: updatedSections,
      answerKey: [...paper.answerKey, newAnswer],
    });
    updatePaperWithHistory(newPaper);
    setEditingQId(newQId);
  };

  // Move a question up or down within a section
  const handleMoveQuestion = (sectionId: string, qIndex: number, direction: 'up' | 'down') => {
    const sec = paper.sections.find((s) => s.id === sectionId);
    if (!sec) return;

    const targetIdx = direction === 'up' ? qIndex - 1 : qIndex + 1;
    if (targetIdx < 0 || targetIdx >= sec.questions.length) return;

    const updatedQuestions = [...sec.questions];
    const [moved] = updatedQuestions.splice(qIndex, 1);
    updatedQuestions.splice(targetIdx, 0, moved);

    const updatedSections = paper.sections.map((s) => (s.id === sectionId ? { ...s, questions: updatedQuestions } : s));
    const newPaper = renumberPaper({ ...paper, sections: updatedSections });
    updatePaperWithHistory(newPaper);
  };

  // Single Question AI Regeneration
  const handleRegenerateQuestion = async (q: Question) => {
    setRegeneratingQId(q.id);
    try {
      const res = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: paper.subject,
          classLevel: paper.classLevel,
          chapter: q.chapter || paper.subject,
          questionType: q.type,
          marks: q.marks,
          difficulty: q.difficulty,
          existingText: q.text,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.question) {
        throw new Error('Regeneration failed');
      }

      const generated = data.question;

      // Update question in paper
      const updatedSections = paper.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.map((item) => {
          if (item.id !== q.id) return item;
          return {
            ...item,
            text: generated.text || item.text,
            options: generated.options || item.options,
            correctOption: generated.correctOption || item.correctOption,
            difficulty: generated.difficulty || item.difficulty,
          };
        }),
      }));

      // Update answer in answerKey
      const updatedAnswers = paper.answerKey.map((ans) => {
        if (ans.questionId !== q.id && ans.questionNumber !== q.number) return ans;
        return {
          ...ans,
          correctAnswer: generated.answer || ans.correctAnswer,
          solutionSteps: generated.solutionSteps || ans.solutionSteps,
          markingScheme: generated.markingScheme || ans.markingScheme,
          explanation: generated.explanation || ans.explanation,
        };
      });

      updatePaperWithHistory({
        ...paper,
        sections: updatedSections,
        answerKey: updatedAnswers,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setRegeneratingQId(null);
    }
  };

  // Update specific question field
  const handleUpdateQuestion = (qId: string, updates: Partial<Question>) => {
    const updatedSections = paper.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => (q.id === qId ? { ...q, ...updates } : q)),
    }));
    updatePaperWithHistory({ ...paper, sections: updatedSections });
  };

  const marksMatch = paper.totalCalculatedMarks === paper.maxMarks;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('paper')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'paper' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Question Paper</span>
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'answers' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Answer Key</span>
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'solutions' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teacher Solutions</span>
          </button>
        </div>

        {/* Center: Live Marks Badge */}
        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 ${
              marksMatch
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {marksMatch ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>
              Total Marks: {paper.totalCalculatedMarks} / {paper.maxMarks}
            </span>
          </div>

          {history.length > 1 && (
            <button
              onClick={handleUndo}
              title="Undo recent change"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Export & Save Controls */}
        <div className="flex items-center space-x-2">
          {saveSuccessNotice && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              ✓ Saved to My Papers!
            </span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Paper</span>
          </button>

          <button
            onClick={() => onDuplicatePaper(paper.id)}
            title="Duplicate Paper"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Print Preview Button */}
          <button
            onClick={() => setIsPrintPreviewOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Preview document on A4 paper before sending to printer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Print Preview</span>
          </button>

          <button
            onClick={() => setIsPrintPreviewOpen(true)}
            title="Print Document (Opens Preview)"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* PDF Download Menu / Button */}
          <div className="relative group">
            <button
              onClick={() =>
                exportPaperToPDF(paper, {
                  type: activeTab === 'paper' ? 'question_paper' : activeTab === 'answers' ? 'answer_key' : 'detailed_solutions',
                })
              }
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Styled like physical A4 Paper) */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-12 min-h-[900px] overflow-hidden">
        {/* Ravi Kishan Watermark Overlay */}
        <WatermarkOverlay watermark={paper.watermark} />

        {/* Document Content Layer */}
        <div className="relative z-10 space-y-6">
          {/* HEADER SECTION */}
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              {paper.instituteName || 'PAPER GENIUS ACADEMY'}
            </h1>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {activeTab === 'paper'
                ? paper.title
                : activeTab === 'answers'
                ? `${paper.title} — ANSWER KEY`
                : `${paper.title} — TEACHER MARKING SCHEME & STEP SOLUTIONS`}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {paper.board} • {paper.classLevel} • Academic Year {paper.academicYear}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-bold text-slate-800">
              <span>Subject: {paper.subject}</span>
              <span>Time Allowed: {paper.durationMinutes} Minutes</span>
              <span>Maximum Marks: {paper.maxMarks}</span>
            </div>
          </div>

          {/* TAB 1: QUESTION PAPER VIEW */}
          {activeTab === 'paper' && (
            <div className="space-y-6">
              {/* General Instructions Box */}
              {paper.generalInstructions && paper.generalInstructions.length > 0 && (
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-2">
                  <span className="font-bold text-xs text-slate-800 tracking-wider uppercase block">
                    General Instructions:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                    {paper.generalInstructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Sections & Questions */}
              {paper.sections.map((sec) => (
                <div key={sec.id} className="space-y-4 pt-2">
                  {/* Section Banner */}
                  <div className="flex items-center justify-between bg-slate-100/90 px-4 py-2 rounded-xl border border-slate-200">
                    <span className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                      {sec.name}: {sec.title}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      ({sec.questions.length} Questions • {sec.marksPerQuestion} Marks each)
                    </span>
                  </div>

                  {/* Section Questions */}
                  <div className="space-y-3">
                    {sec.questions.map((q, qIdx) => {
                      const isEditing = editingQId === q.id;
                      const isRegenerating = regeneratingQId === q.id;

                      return (
                        <div
                          key={q.id}
                          className={`group relative p-4 rounded-xl border transition-all ${
                            isEditing
                              ? 'border-indigo-400 bg-indigo-50/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white/90'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Question Header & Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="font-black text-slate-900 text-sm">
                                  Q{q.number}.
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                                  {q.type}
                                </span>
                                {q.chapter && (
                                  <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
                                    {q.chapter}
                                  </span>
                                )}
                              </div>

                              {/* Question Text (Read or Edit) */}
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={q.text}
                                  onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                                  className="w-full p-2.5 text-xs sm:text-sm border border-indigo-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                                />
                              ) : (
                                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-normal whitespace-pre-wrap">
                                  {q.text}
                                </p>
                              )}

                              {/* Options for MCQs */}
                              {q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                  {q.options.map((opt, optIdx) => (
                                    <div
                                      key={optIdx}
                                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                                    >
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const newOpts = [...(q.options || [])];
                                            newOpts[optIdx] = e.target.value;
                                            handleUpdateQuestion(q.id, { options: newOpts });
                                          }}
                                          className="w-full bg-white px-2 py-1 border border-slate-300 rounded text-xs"
                                        />
                                      ) : (
                                        <span>{opt}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Internal Choice OR Question */}
                              {q.hasInternalChoice && q.orQuestion && (
                                <div className="mt-4 pt-3 border-t border-dashed border-slate-300 space-y-2">
                                  <div className="text-center font-bold text-xs text-indigo-600">
                                    — OR —
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-900 italic">
                                    {q.orQuestion.text}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Right: Marks & Interactive Toolbar */}
                            <div className="shrink-0 flex flex-col items-end space-y-2">
                              <span className="font-bold text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                              </span>

                              {/* Edit buttons */}
                              <div className="flex items-center space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleRegenerateQuestion(q)}
                                  disabled={isRegenerating}
                                  title="Regenerate this question with AI"
                                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                >
                                  <Sparkles
                                    className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`}
                                  />
                                </button>

                                <button
                                  onClick={() => setEditingQId(isEditing ? null : q.id)}
                                  title={isEditing ? 'Done Editing' : 'Edit Question'}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isEditing
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                                </button>

                                <button
                                  onClick={() => handleMoveQuestion(sec.id, qIdx, 'up')}
                                  disabled={qIdx === 0}
                                  title="Move Up"
                                  className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleMoveQuestion(sec.id, qIdx, 'down')}
                                  disabled={qIdx === sec.questions.length - 1}
                                  title="Move Down"
                                  className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteQuestion(sec.id, q.id)}
                                  title="Delete Question"
                                  className="p-1 rounded text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Question Button */}
                  <button
                    onClick={() => handleAddQuestion(sec.id)}
                    className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question to {sec.name}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2 & 3: ANSWER KEY & DETAILED SOLUTIONS */}
          {(activeTab === 'answers' || activeTab === 'solutions') && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 font-medium">
                {activeTab === 'answers'
                  ? 'Official Answer Key: Concise model answers and correct MCQ options.'
                  : 'Teacher Marking Scheme: Comprehensive step-by-step solutions with mark allocations and formulas.'}
              </div>

              <div className="space-y-4">
                {paper.answerKey.map((ans) => (
                  <div
                    key={ans.questionId || ans.questionNumber}
                    className="p-4 rounded-xl border border-slate-200 bg-white/90 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-xs text-slate-900">
                        Answer Q{ans.questionNumber} ({ans.type.toUpperCase()})
                      </span>
                    </div>

                    {/* Answer Key Summary */}
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                        Correct Answer:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-900 font-semibold mt-0.5">
                        {ans.correctAnswer}
                      </p>
                    </div>

                    {/* Step-by-Step Working */}
                    {ans.solutionSteps && ans.solutionSteps.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                          Step-by-Step Working:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {ans.solutionSteps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start space-x-1.5">
                              <span className="text-indigo-500 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Teacher Marking Scheme (Solutions mode) */}
                    {activeTab === 'solutions' && ans.markingScheme && ans.markingScheme.length > 0 && (
                      <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Teacher Step-Wise Marking Allocation:
                        </span>
                        <ul className="space-y-1 text-xs text-emerald-900">
                          {ans.markingScheme.map((ms, mIdx) => (
                            <li key={mIdx} className="flex items-center justify-between">
                              <span>✓ {ms.step}</span>
                              <span className="font-bold">[{ms.marks} M]</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Formulas / Equations */}
                    {ans.keyFormulasOrEquations && ans.keyFormulasOrEquations.length > 0 && (
                      <div className="text-xs text-amber-800 bg-amber-50/60 p-2 rounded border border-amber-100 font-mono">
                        Formula / Equation: {ans.keyFormulasOrEquations.join(' | ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Footer Preview */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Paper Genius AI • Academic Document</span>
            <span>Watermark: {paper.watermark.text || 'Ravi Kishan'}</span>
            <span>End of Examination Paper</span>
          </div>
        </div>
      </div>

      {/* Real-time A4 Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        paper={paper}
        initialTab={activeTab}
        watermarkConfig={paper.watermark}
      />
    </div>
  );
};
