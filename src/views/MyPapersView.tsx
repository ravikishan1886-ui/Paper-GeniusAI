import React, { useState } from 'react';
import {
  Search,
  FileText,
  Download,
  Copy,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  AlertTriangle,
  PlusCircle,
  Key,
} from 'lucide-react';
import { QuestionPaper } from '../types';
import { exportPaperToPDF } from '../utils/pdfGenerator';

interface MyPapersViewProps {
  papers: QuestionPaper[];
  onOpenPaper: (paper: QuestionPaper) => void;
  onDuplicatePaper: (paperId: string) => void;
  onDeletePaper: (paperId: string) => void;
  onNavigateToGenerate: () => void;
}

export const MyPapersView: React.FC<MyPapersViewProps> = ({
  papers,
  onOpenPaper,
  onDuplicatePaper,
  onDeletePaper,
  onNavigateToGenerate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Extract unique subjects
  const subjects = Array.from(new Set(papers.map((p) => p.subject).filter(Boolean)));

  const filtered = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(search.toLowerCase()) ||
      paper.subject.toLowerCase().includes(search.toLowerCase()) ||
      paper.classLevel.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Saved Papers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, duplicate, edit, and export your examination papers
          </p>
        </div>

        <button
          onClick={onNavigateToGenerate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Paper</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers by title, subject, or class..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white shadow-2xs"
          />
        </div>

        {subjects.length > 0 && (
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-hidden"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Papers Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-800">No question papers found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? 'Try adjusting your search criteria or clear the search filter.'
                : 'Get started by creating your first AI-generated question paper.'}
            </p>
          </div>
          <button
            onClick={onNavigateToGenerate}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Paper</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((paper) => {
            const questionCount = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

            return (
              <div
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {paper.board} • {paper.classLevel}
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {paper.maxMarks} Marks
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => onOpenPaper(paper)}
                      className="font-bold text-base text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2"
                    >
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{paper.subject}</p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{paper.durationMinutes} min</span>
                    </span>
                    <span>•</span>
                    <span>{questionCount} questions</span>
                    <span>•</span>
                    <span>{paper.sections.length} sections</span>
                  </div>
                </div>

                {/* Card Action Toolbar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenPaper(paper)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-center shadow-2xs"
                  >
                    Open Editor
                  </button>

                  <button
                    onClick={() => exportPaperToPDF(paper, { type: 'question_paper' })}
                    title="Download Question Paper PDF (Watermark: Ravi Kishan)"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDuplicatePaper(paper.id)}
                    title="Duplicate Paper"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(paper.id)}
                    title="Delete Paper"
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Delete Question Paper?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this question paper? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePaper(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
