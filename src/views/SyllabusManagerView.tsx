import React, { useState } from 'react';
import { BookOpen, Layers, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { BOARDS, SUBJECT_CHAPTERS } from '../data/curriculum';

interface SyllabusManagerViewProps {
  onStartExamForSubject: (subject: string, chapter?: string) => void;
}

export const SyllabusManagerView: React.FC<SyllabusManagerViewProps> = ({
  onStartExamForSubject,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('Science (General)');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');

  const chapters = SUBJECT_CHAPTERS[selectedSubject] || SUBJECT_CHAPTERS['Mathematics'] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum & Blueprint Standards</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Syllabus & Curriculum Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Explore board-prescribed learning objectives and launch tailored examination papers.
        </p>
      </div>

      {/* Board & Subject Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Educational Board
          </label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-hidden"
          >
            {BOARDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-hidden"
          >
            {Object.keys(SUBJECT_CHAPTERS).map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapters Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Prescribed Chapters: {selectedSubject}
            </h2>
            <p className="text-xs text-slate-500">
              {chapters.length} Units defined under {selectedBoard} syllabus
            </p>
          </div>

          <button
            onClick={() => onStartExamForSubject(selectedSubject)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Full Paper for {selectedSubject}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {chapters.map((chap, idx) => (
            <div
              key={chap}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/20 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {chap}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Includes MCQs, Numerical, Conceptual & Assertion-Reason items
                  </p>
                </div>
              </div>

              <button
                onClick={() => onStartExamForSubject(selectedSubject, chap)}
                title="Create Unit Test for this chapter"
                className="opacity-80 group-hover:opacity-100 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 text-xs font-semibold shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
