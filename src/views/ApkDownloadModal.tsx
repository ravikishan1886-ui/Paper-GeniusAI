import React, { useState } from 'react';
import {
  X,
  Smartphone,
  GitBranch,
  PlayCircle,
  Download,
  CheckCircle,
  FolderArchive,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const gitCommands = `# 1. Push project to your GitHub repository
git add .
git commit -m "Configure Paper Genius AI with Android debug APK build"
git branch -M main
git push -u origin main`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Smartphone className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Android APK Installation Guide</h3>
              <p className="text-xs text-emerald-100">
                Automated Continuous Integration via GitHub Actions (.github/workflows/build.yml)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-slate-700">
          {/* Workflow Status Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-emerald-900">
                Continuous Integration Workflow Ready: <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">.github/workflows/build.yml</code>
              </p>
              <p className="text-emerald-700">
                Every push to branch <code>main</code> or manual <code>workflow_dispatch</code> trigger automatically compiles the Android module and packages the installable debug APK.
              </p>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Step-by-Step Instructions to Download APK</span>
            </h4>

            <ol className="space-y-3.5 text-xs text-slate-600">
              <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Push to your GitHub repository</p>
                  <p className="mt-0.5 text-slate-500">
                    Ensure the workflow file and Android source are pushed to your remote GitHub repository on the <code>main</code> branch.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Open Actions Tab in GitHub</p>
                  <p className="mt-0.5 text-slate-500">
                    Navigate to your GitHub repository in your browser and click on the <strong className="text-slate-700">Actions</strong> tab along the top bar.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Select "Build APK" Workflow</p>
                  <p className="mt-0.5 text-slate-500">
                    In the left sidebar, click <strong className="text-slate-700">Build APK</strong>. You can watch the live running build or trigger one manually using <strong className="text-slate-700">Run workflow</strong>.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">
                  4
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Download the "app-debug-apk" Artifact</p>
                  <p className="mt-0.5 text-slate-500">
                    Click on the completed workflow run. Scroll down to the <strong className="text-slate-700">Artifacts</strong> section at the bottom of the summary page and click <strong className="text-indigo-600">app-debug-apk</strong>.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">
                  5
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Extract & Install APK on Android Phone</p>
                  <p className="mt-0.5 text-slate-500">
                    The downloaded artifact is a ZIP file. Extract it to find <code className="text-indigo-600 font-mono">app-debug.apk</code>. Transfer it to your phone or download directly, tap the APK, allow installation from this source in Android settings, and launch Paper Genius AI!
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Quick Push Commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quick Git Push Commands</span>
              </span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
              {gitCommands}
            </pre>
          </div>

          {/* Notice box about security */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Security Guarantee:</strong> No private API keys or secrets are embedded inside the Android APK. Generation requests communicate securely with your verified backend endpoints.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
