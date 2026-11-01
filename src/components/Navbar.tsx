import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  FolderOpen,
  Database,
  BookOpen,
  Settings,
  Smartphone,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
  openApkModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openApkModal,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'generate', label: 'Generate Paper', icon: PlusCircle, highlight: true },
    { id: 'my-papers', label: 'My Papers', icon: FolderOpen },
    { id: 'question-bank', label: 'Question Bank', icon: Database },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs ring-1 ring-slate-200 group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/Screenshot_20261026-183944_2_d8c50829.jpg"
                alt="Paper Genius AI Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Paper Genius <span className="text-indigo-600">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-indigo-500" />
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Create Smarter Question Papers in Seconds
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    link.highlight
                      ? isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      : isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight && !isActive ? 'text-indigo-600' : ''}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Android APK Button */}
            <button
              onClick={openApkModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android APK</span>
            </button>

            {/* Auth User Info / Login */}
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-100 pl-2 pr-1 py-1 rounded-full border border-slate-200 text-xs">
                <span className="font-medium text-slate-800 truncate max-w-[120px]">
                  {user.displayName || user.email || 'Teacher'}
                </span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 rounded-full text-slate-500 hover:text-red-600 hover:bg-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={openApkModal}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="Android APK"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
            <button
              onClick={() => {
                openApkModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Download Android APK</span>
            </button>

            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span className="text-xs font-medium text-slate-700">{user.email || user.displayName}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
              >
                <User className="w-4 h-4" />
                <span>Sign In or Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
