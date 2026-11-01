import React from 'react';
import { Smartphone, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  openApkModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ openApkModal, setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-700">
                <img
                  src="/assets/aistudio/Screenshot_20261026-183944_2_d8c50829.jpg"
                  alt="Paper Genius AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Paper Genius <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              The premier AI-powered examination question paper generator. Designed specifically for teachers, schools, coaching institutes, and students.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Google Gemini 3.8 Flash</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Watermark: Ravi Kishan</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto Marks Balancing</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('generate')}
                  className="hover:text-white transition-colors"
                >
                  Generate Question Paper
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('my-papers')}
                  className="hover:text-white transition-colors"
                >
                  My Saved Papers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('question-bank')}
                  className="hover:text-white transition-colors"
                >
                  Question Bank Repository
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('syllabus')}
                  className="hover:text-white transition-colors"
                >
                  Syllabus & Blueprint Manager
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('settings')}
                  className="hover:text-white transition-colors"
                >
                  Watermark & Institute Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Android Mobile */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Android Platform
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Install Paper Genius AI directly on your Android phone using our automated GitHub Actions debug build.
            </p>
            <button
              onClick={openApkModal}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Android APK</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Paper Genius AI. Create Smarter Question Papers in Seconds.</p>
          <p className="mt-2 sm:mt-0">
            Document Watermark: <span className="text-slate-400 font-medium">Ravi Kishan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
