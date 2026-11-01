import React, { useState, useEffect } from 'react';
import {
  Shield,
  RotateCcw,
  CheckCircle2,
  Building,
  Smartphone,
  Save,
  Eye,
  Key,
  ExternalLink,
  Trash2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { WatermarkConfig } from '../types';
import { DEFAULT_WATERMARK } from '../utils/storage';

interface SettingsViewProps {
  watermarkSettings: WatermarkConfig;
  onSaveWatermark: (config: WatermarkConfig) => void;
  openApkModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  watermarkSettings,
  onSaveWatermark,
  openApkModal,
}) => {
  const [config, setConfig] = useState<WatermarkConfig>(watermarkSettings || DEFAULT_WATERMARK);
  const [instituteName, setInstituteName] = useState(
    () => localStorage.getItem('paper_genius_institute') || 'Delhi Public Senior Secondary School'
  );
  const [defaultDuration, setDefaultDuration] = useState(90);
  const [savedNotice, setSavedNotice] = useState(false);

  // Groq API custom key state
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [savedGroqKey, setSavedGroqKey] = useState<string | null>(null);
  const [keyNotice, setKeyNotice] = useState<string | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem('paper_genius_groq_key');
    if (existing) {
      setSavedGroqKey(existing);
      setGroqKeyInput(existing);
    }
  }, []);

  const handleSaveGroqKey = () => {
    const trimmed = groqKeyInput.trim();
    if (!trimmed) {
      handleClearGroqKey();
      return;
    }
    if (!trimmed.startsWith('gsk_')) {
      setKeyNotice('Warning: Groq API keys usually start with "gsk_"');
    } else {
      setKeyNotice('Custom Groq API key saved successfully!');
    }
    localStorage.setItem('paper_genius_groq_key', trimmed);
    setSavedGroqKey(trimmed);
    setTimeout(() => setKeyNotice(null), 3000);
  };

  const handleClearGroqKey = () => {
    localStorage.removeItem('paper_genius_groq_key');
    setSavedGroqKey(null);
    setGroqKeyInput('');
    setKeyNotice('Custom Groq key removed. Reverted to server environment key.');
    setTimeout(() => setKeyNotice(null), 3000);
  };

  const handleReset = () => {
    setConfig(DEFAULT_WATERMARK);
  };

  const handleSaveAll = () => {
    onSaveWatermark(config);
    localStorage.setItem('paper_genius_institute', instituteName);
    if (groqKeyInput.trim()) {
      localStorage.setItem('paper_genius_groq_key', groqKeyInput.trim());
      setSavedGroqKey(groqKeyInput.trim());
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System & Document Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure the Ravi Kishan document watermark, Groq AI engine credentials, school branding, and APK build.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully saved and applied!</span>
        </div>
      )}

      {/* SECTION 1: GROQ AI ENGINE & API KEY FALLBACK */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Groq AI Engine & Rate Limit Fallback</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  Vision + Llama 3.3
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Uses ultra-fast Groq Llama 3.2 Vision for textbook image analysis and Llama 3.3 70B for exam papers.
              </p>
            </div>
          </div>

          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold self-start sm:self-auto bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <span>Get Free Groq Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
            <p>
              If the default system Groq API rate limit is exceeded (HTTP 429), the application automatically allows you to provide your personal Groq API key so your question paper generation is never disrupted.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-slate-500" />
                <span>Personal Groq API Key</span>
              </span>
              {savedGroqKey ? (
                <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active (Custom Key In Use)
                </span>
              ) : (
                <span className="text-slate-400 font-medium text-[11px]">
                  Using default server API key
                </span>
              )}
            </label>

            <div className="flex gap-2">
              <input
                type="password"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden bg-slate-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleSaveGroqKey}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Save Key
              </button>
              {savedGroqKey && (
                <button
                  type="button"
                  onClick={handleClearGroqKey}
                  title="Remove custom key and revert to server default"
                  className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {keyNotice && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{keyNotice}</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: RAVI KISHAN WATERMARK CONFIGURATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Document Watermark Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Default watermark: <strong className="text-slate-700">Ravi Kishan</strong> (applied to every page of PDF and print)
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-600 font-semibold self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to "Ravi Kishan" Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Controls */}
          <div className="space-y-4 text-xs">
            {/* Toggle Watermark */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm block">Enable Watermark</span>
                <span className="text-slate-500">
                  When enabled, renders on every exported PDF page and print output.
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
              />
            </div>

            {/* Watermark Text */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Watermark Text</label>
              <input
                type="text"
                value={config.text}
                onChange={(e) => setConfig({ ...config, text: e.target.value })}
                placeholder="Ravi Kishan"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
              />
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Opacity</span>
                <span className="text-indigo-600">{Math.round(config.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.01"
                value={config.opacity}
                onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">
                Recommended: 12% (unobtrusive and preserves question readability)
              </span>
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Angle / Rotation</span>
                <span className="text-indigo-600">{config.rotation}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="5"
                value={config.rotation}
                onChange={(e) => setConfig({ ...config, rotation: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Default: -35° diagonal</span>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Watermark Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="font-mono text-xs text-slate-600">{config.color} (Light Gray)</span>
              </div>
            </div>
          </div>

          {/* Live Watermark Preview Sandbox */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Real-Time Watermark Preview</span>
            </span>

            <div className="relative h-72 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 overflow-hidden flex flex-col justify-between shadow-inner">
              {/* Center Watermark rendering */}
              {config.enabled && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="font-black tracking-widest whitespace-nowrap"
                    style={{
                      transform: `rotate(${config.rotation}deg)`,
                      opacity: config.opacity,
                      color: config.color,
                      fontSize: `${config.fontSize * 0.9}px`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {config.text || 'Ravi Kishan'}
                  </div>
                </div>
              )}

              {/* Sample simulated question text */}
              <div className="relative z-10 space-y-2 text-slate-800 text-[11px]">
                <div className="font-bold border-b border-slate-200 pb-1 text-center uppercase tracking-wide text-xs">
                  SAMPLE A4 EXAMINATION PAGE PREVIEW
                </div>
                <p>
                  <strong>Q1.</strong> Define the law of conservation of momentum. Calculate the recoil velocity of a rifle having mass 4 kg when a bullet of 50 g is fired with a velocity of 35 mm/s. [3 Marks]
                </p>
                <p>
                  <strong>Q2.</strong> State two fundamental properties of magnetic field lines around a straight current-carrying conductor. [2 Marks]
                </p>
              </div>

              <div className="relative z-10 text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                <span>Page 1 of 3</span>
                <span>Watermark Status: {config.enabled ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: INSTITUTE BRANDING */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              School / Institution Branding
            </h2>
            <p className="text-xs text-slate-500">
              Default institution header appearing on generated examination papers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Default Institution Name
            </label>
            <input
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Default Exam Duration (Minutes)
            </label>
            <input
              type="number"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: ANDROID & GITHUB ACTIONS INTEGRATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Android APK & GitHub Actions Status
            </h2>
            <p className="text-xs text-slate-500">
              Continuous Integration debug APK builder setup.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <p>
            The workflow file <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">.github/workflows/build.yml</code> is configured to execute on every commit to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">main</code> or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">master</code>.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">Target Artifact Name:</span>
              <span className="font-mono text-emerald-600 block">app-debug-apk</span>
            </div>
            <button
              onClick={openApkModal}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
            >
              View Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
