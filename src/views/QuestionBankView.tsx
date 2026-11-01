import React, { useState } from 'react';
import {
  Search,
  Database,
  Filter,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { BankQuestion, QuestionType } from '../types';

interface QuestionBankViewProps {
  questions: BankQuestion[];
  onAddQuestion: (q: BankQuestion) => void;
  onDeleteQuestion: (qId: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New question form state
  const [newText, setNewText] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [newClass, setNewClass] = useState('Class 10');
  const [newChapter, setNewChapter] = useState('General');
  const [newType, setNewType] = useState<QuestionType>('mcq');
  const [newMarks, setNewMarks] = useState(1);
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'moderate' | 'challenging' | 'hots'>('moderate');
  const [newAnswer, setNewAnswer] = useState('');
  const [newOptions, setNewOptions] = useState(['A. ', 'B. ', 'C. ', 'D. ']);

  // Extract unique subjects
  const subjects = Array.from(new Set(questions.map((q) => q.subject).filter(Boolean)));

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.chapter.toLowerCase().includes(search.toLowerCase()) ||
      q.answer.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
    const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || q.type === typeFilter;
    return matchesSearch && matchesSubject && matchesDiff && matchesType;
  });

  const handleCopyQuestion = (q: BankQuestion) => {
    const fullText = `${q.text}\n${q.options ? q.options.join('\n') : ''}\nAnswer: ${q.answer}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const created: BankQuestion = {
      id: 'bank-custom-' + Date.now(),
      subject: newSubject,
      classLevel: newClass,
      chapter: newChapter,
      difficulty: newDifficulty,
      type: newType,
      marks: Number(newMarks),
      text: newText,
      options: newType === 'mcq' ? newOptions : undefined,
      answer: newAnswer || 'Model answer on file.',
      createdAt: new Date().toISOString(),
    };

    onAddQuestion(created);
    setShowAddModal(false);
    setNewText('');
    setNewAnswer('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Curated Repository</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter, reuse, and curate questions across boards and difficulty tiers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by text, chapter, formula, or concept..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Subject Filter */}
          <div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Subjects ({questions.length})</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="hots">HOTS (High Order Thinking)</option>
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Question Types</option>
              <option value="mcq">MCQ</option>
              <option value="vsa">Very Short Answer</option>
              <option value="sa">Short Answer</option>
              <option value="la">Long Answer</option>
              <option value="case_study">Case Study</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <Database className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800">No matching questions</h3>
            <p className="text-xs text-slate-500">Try modifying search filters or add a new question.</p>
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {q.subject} • {q.classLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 capitalize">
                      {q.difficulty}
                    </span>
                    <span className="text-slate-400 font-normal">
                      Chapter: {q.chapter}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed pt-1">
                    {q.text}
                  </p>

                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col items-end space-y-2">
                  <span className="font-bold text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopyQuestion(q)}
                      title="Copy Question & Answer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      title="Delete from Bank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Answer summary preview */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="truncate max-w-xl">
                  <strong className="text-slate-800">Answer:</strong> {q.answer}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900">Add Question to Bank</h3>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  rows={3}
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter the question text..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chapter</label>
                  <input
                    type="text"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="vsa">VSA</option>
                    <option value="sa">SA</option>
                    <option value="la">LA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                    <option value="hots">HOTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Answer / Solution</label>
                <textarea
                  rows={2}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter the correct answer and explanation..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Save to Question Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
