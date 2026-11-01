import React from 'react';
import {
  PlusCircle,
  FileText,
  Database,
  Smartphone,
  Sparkles,
  Download,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { QuestionPaper } from '../types';
import { exportPaperToPDF } from '../utils/pdfGenerator';

interface DashboardViewProps {
  papers: QuestionPaper[];
  bankCount: number;
  onOpenPaper: (paper: QuestionPaper) => void;
  onNavigate: (tab: string) => void;
  openApkModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  papers,
  bankCount,
  onOpenPaper,
  onNavigate,
  openApkModal,
}) => {
  const latestPaper = papers.length > 0 ? papers[0] : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-700/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Next-Gen Examination Engine • Groq Vision AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Create Smarter Question Papers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-200">
                in Seconds
              </span>
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Generate curriculum-aligned exam papers with automatic marks distribution, step-by-step marking schemes, full answer keys, and professional PDF export with the <strong className="text-white">Ravi Kishan</strong> watermark.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('generate')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Create New Question Paper</span>
              </button>

              <button
                onClick={() => onNavigate('generate')}
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-indigo-400/30 transition-colors"
              >
                <Camera className="w-4 h-4 text-purple-300" />
                <span>Upload Textbook Pages</span>
              </button>

              <button
                onClick={openApkModal}
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/50 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Get Android APK</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill Panel */}
          <div className="grid grid-cols-2 gap-3 lg:w-80 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
                <span>My Papers</span>
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{papers.length}</div>
              <div className="text-[11px] text-indigo-200/80 mt-1">Available to edit</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
                <span>Question Bank</span>
                <Database className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{bankCount}</div>
              <div className="text-[11px] text-indigo-200/80 mt-1">Curated questions</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
                <span>Boards</span>
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">10+</div>
              <div className="text-[11px] text-indigo-200/80 mt-1">CBSE, ICSE, State</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
                <span>Watermark</span>
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-white truncate">Ravi Kishan</div>
              <div className="text-[11px] text-emerald-300 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 inline" />
                <span>Active on PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured / Recent Papers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Question Papers</h2>
            <p className="text-xs text-slate-500">View, edit, duplicate, or export your exam papers</p>
          </div>
          <button
            onClick={() => onNavigate('my-papers')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All ({papers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {papers.slice(0, 3).map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {paper.board} • {paper.classLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {paper.maxMarks} Marks
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{paper.subject}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                  <span>⏱ {paper.durationMinutes} mins</span>
                  <span>📄 {paper.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions</span>
                  <span>📑 {paper.sections.length} sections</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenPaper(paper)}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-center shadow-2xs"
                >
                  Edit & Preview
                </button>
                <button
                  onClick={() => exportPaperToPDF(paper, { type: 'question_paper' })}
                  title="Download Question Paper PDF"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights & Capabilities Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Core Architectural Capabilities</h2>
          <p className="text-xs text-slate-500">Built to standards requested for Indian and international educational boards</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Groq Vision AI Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes uploaded textbook pages and generates HOTS, competency-based, and numerical problems with ultra-low latency.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Automatic Marks Balancer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates marks automatically across sections and validates total sum against requested maximum marks with error prevention.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Ravi Kishan Watermark</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Professional vector watermark embedded on every single page of exported PDFs and printable sheets behind text without obstruction.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Android APK in CI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configured GitHub Actions workflow automatically builds an installable Android debug APK on every commit to main.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
