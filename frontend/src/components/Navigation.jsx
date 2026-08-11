import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  Code2, 
  Calculator, 
  FileText, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Trophy, 
  Settings, 
  User, 
  Flame, 
  Globe, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label_key: 'dashboard', icon: LayoutDashboard },
  { id: 'mock_interview', label_key: 'mock_interview', icon: Mic, badge: 'AI' },
  { id: 'coding_lab', label_key: 'coding_lab', icon: Code2 },
  { id: 'aptitude', label_key: 'aptitude', icon: Calculator },
  { id: 'resume_coach', label_key: 'resume_coach', icon: FileText },
  { id: 'gd_arena', label_key: 'gd_arena', icon: Users },
  { id: 'question_bank', label_key: 'question_bank', icon: BookOpen },
  { id: 'progress', label_key: 'progress', icon: TrendingUp },
  { id: 'achievements', label_key: 'achievements', icon: Trophy }
];

export const Navigation = ({ activeTab, setActiveTab }) => {
  const { user, theme, setTheme, logoutUser } = useAuth();
  const { language, setLanguage, languages, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0f172a]/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">MockMate</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{user?.streak || 7}</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] border-r border-slate-800 h-screen sticky top-0 z-40 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight leading-none flex items-center gap-1.5">
                MockMate
                <span className="text-[10px] uppercase font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">v1.0</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">AI Career Cockpit</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{t(item.label_key)}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Preferences & Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#0b0f19]/40">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language}</span>
              </div>
              <span className="text-[10px] text-slate-500">▼</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between ${
                      language === l.code ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{l.name}</span>
                    {language === l.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings & Theme */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' 
                  : 'text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('settings')}</span>
            </button>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
              className="p-2 text-slate-400 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          </div>

          {/* User Profile Card */}
          <div 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600/10 border-indigo-500/40'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user?.name?.[0] || 'P'}
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Pratibha'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.target_role || 'Software Developer'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-lg text-[10px] font-bold">
              <Flame className="w-3 h-3 fill-amber-400" />
              <span>{user?.streak || 7}d</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-lg text-white">MockMate Navigation</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-base ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{t(item.label_key)}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button 
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <Settings className="w-5 h-5" />
                <span>{t('settings')}</span>
              </button>
              <button 
                onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <User className="w-5 h-5" />
                <span>{t('profile')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around py-2 px-1">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'mock_interview', label: 'Interview', icon: Mic },
          { id: 'coding_lab', label: 'Coding', icon: Code2 },
          { id: 'resume_coach', label: 'Resume', icon: FileText },
          { id: 'progress', label: 'Progress', icon: TrendingUp }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
