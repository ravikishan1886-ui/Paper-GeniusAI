import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ApkDownloadModal } from './views/ApkDownloadModal';
import { DashboardView } from './views/DashboardView';
import { GeneratePaperView } from './views/GeneratePaperView';
import { PaperEditorView } from './views/PaperEditorView';
import { MyPapersView } from './views/MyPapersView';
import { QuestionBankView } from './views/QuestionBankView';
import { SyllabusManagerView } from './views/SyllabusManagerView';
import { SettingsView } from './views/SettingsView';
import { QuestionPaper, BankQuestion, WatermarkConfig } from './types';
import {
  getSavedPapers,
  savePaper,
  deletePaper,
  duplicatePaper,
  getBankQuestions,
  saveBankQuestion,
  deleteBankQuestion,
  getWatermarkSettings,
  saveWatermarkSettings,
  DEFAULT_WATERMARK,
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [papers, setPapers] = useState<QuestionPaper[]>(() => getSavedPapers());
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>(() => getBankQuestions());
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkConfig>(() =>
    getWatermarkSettings()
  );
  const [activePaper, setActivePaper] = useState<QuestionPaper | null>(() => {
    const list = getSavedPapers();
    return list.length > 0 ? list[0] : null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);

  // Synchronize papers when state changes
  const handleSavePaper = (updatedPaper: QuestionPaper) => {
    savePaper(updatedPaper);
    setPapers(getSavedPapers());
    setActivePaper(updatedPaper);
  };

  const handleDeletePaper = (paperId: string) => {
    deletePaper(paperId);
    const updated = getSavedPapers();
    setPapers(updated);
    if (activePaper?.id === paperId) {
      setActivePaper(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleDuplicatePaper = (paperId: string) => {
    const copy = duplicatePaper(paperId);
    if (copy) {
      const updated = getSavedPapers();
      setPapers(updated);
      setActivePaper(copy);
      setCurrentTab('editor');
    }
  };

  const handlePaperGenerated = (newPaper: QuestionPaper) => {
    savePaper(newPaper);
    setPapers(getSavedPapers());
    setActivePaper(newPaper);
    setCurrentTab('editor');
  };

  const handleOpenPaper = (paper: QuestionPaper) => {
    setActivePaper(paper);
    setCurrentTab('editor');
  };

  const handleSaveWatermark = (newConfig: WatermarkConfig) => {
    saveWatermarkSettings(newConfig);
    setWatermarkSettings(newConfig);
    // Also update active paper watermark if present
    if (activePaper) {
      const updated = { ...activePaper, watermark: newConfig };
      handleSavePaper(updated);
    }
  };

  const handleAddBankQuestion = (newQ: BankQuestion) => {
    saveBankQuestion(newQ);
    setBankQuestions(getBankQuestions());
  };

  const handleDeleteBankQuestion = (qId: string) => {
    deleteBankQuestion(qId);
    setBankQuestions(getBankQuestions());
  };

  const handleStartExamForSubject = (subject: string, chapter?: string) => {
    setCurrentTab('generate');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          openAuthModal={() => setAuthModalOpen(true)}
          openApkModal={() => setApkModalOpen(true)}
        />

        {/* Main Content Router */}
        <main className="flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView
              papers={papers}
              bankCount={bankQuestions.length}
              onOpenPaper={handleOpenPaper}
              onNavigate={setCurrentTab}
              openApkModal={() => setApkModalOpen(true)}
            />
          )}

          {currentTab === 'generate' && (
            <GeneratePaperView
              onPaperGenerated={handlePaperGenerated}
              watermarkSettings={watermarkSettings}
            />
          )}

          {currentTab === 'editor' && activePaper && (
            <PaperEditorView
              paper={activePaper}
              onSavePaper={handleSavePaper}
              onDuplicatePaper={handleDuplicatePaper}
              onBackToDashboard={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'my-papers' && (
            <MyPapersView
              papers={papers}
              onOpenPaper={handleOpenPaper}
              onDuplicatePaper={handleDuplicatePaper}
              onDeletePaper={handleDeletePaper}
              onNavigateToGenerate={() => setCurrentTab('generate')}
            />
          )}

          {currentTab === 'question-bank' && (
            <QuestionBankView
              questions={bankQuestions}
              onAddQuestion={handleAddBankQuestion}
              onDeleteQuestion={handleDeleteBankQuestion}
            />
          )}

          {currentTab === 'syllabus' && (
            <SyllabusManagerView onStartExamForSubject={handleStartExamForSubject} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              watermarkSettings={watermarkSettings}
              onSaveWatermark={handleSaveWatermark}
              openApkModal={() => setApkModalOpen(true)}
            />
          )}
        </main>

        {/* Global Modals */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        <ApkDownloadModal
          isOpen={apkModalOpen}
          onClose={() => setApkModalOpen(false)}
        />

        {/* Footer */}
        <Footer
          openApkModal={() => setApkModalOpen(true)}
          setCurrentTab={setCurrentTab}
        />
      </div>
    </AuthProvider>
  );
}
