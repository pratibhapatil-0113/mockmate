import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Sliders, 
  Moon, 
  Sun, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export const SettingsPage = () => {
  const { user, updateUserProfile, theme, setTheme } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('account');

  // Form states
  const [name, setName] = useState(user?.name || 'Pratibha');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [length, setLength] = useState('5 Minutes');
  const [notifications, setNotifications] = useState({
    reminders: true,
    achievements: true,
    weekly: true
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    updateUserProfile({ name, target_role: targetRole });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="glass-panel card-bg p-6 sm:p-8 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Platform Settings & Profile</h1>
            <p className="text-xs text-slate-400">Configure interview parameters, theme preferences, and privacy options</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Navigation Tabs */}
      <div className="lg:col-span-4 glass-panel card-bg p-4 rounded-3xl space-y-2">
          {[
            { id: 'account', label: 'Account Profile', icon: User },
            { id: 'interview', label: 'Interview Preferences', icon: Sliders },
            { id: 'appearance', label: 'Appearance & Theme', icon: Moon },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600/12 text-indigo-300 shadow-md border border-indigo-500/16' 
                    : 'text-muted hover:text-current hover:bg-slate-800/8'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-8 glass-panel card-bg p-6 sm:p-8 rounded-3xl space-y-6">
          {savedSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl text-xs text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* ACCOUNT PROFILE */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Account Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-current focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email"
                    value={user?.email || 'pratibha@example.com'}
                    disabled
                    className="w-full bg-transparent border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Target Job Role</label>
                  <input 
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-transparent border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-current focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW PREFERENCES */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Interview Default Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Default Difficulty</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Easy">Easy (Fresher Entry)</option>
                    <option value="Medium">Medium (Standard Core)</option>
                    <option value="Hard">Hard (Senior Architect)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Default Interview Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Theme & Visual Identity</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-left space-y-2 ${
                    theme === 'dark' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <p className="font-bold text-sm">Dark Mode (Recommended)</p>
                  <p className="text-xs opacity-75">Futuristic AI Career Cockpit theme</p>
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-left space-y-2 ${
                    theme === 'light' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-400" />
                  <p className="font-bold text-sm">Light Mode</p>
                  <p className="text-xs opacity-75">Clean white surface styling</p>
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: 'reminders', label: 'Daily Practice Reminders' },
                  { key: 'achievements', label: 'Achievement Badge Notifications' },
                  { key: 'weekly', label: 'Weekly Progress Reports' }
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                    <input 
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Privacy & Data Control</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => alert("Resume data cleared!")}
                  className="w-full text-left p-3.5 bg-slate-900/60 hover:bg-slate-800 rounded-2xl border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  Clear Resume & Parser History
                </button>
                <button 
                  onClick={() => alert("Interview history reset!")}
                  className="w-full text-left p-3.5 bg-slate-900/60 hover:bg-slate-800 rounded-2xl border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  Clear Interview Simulation Logs
                </button>
                <button 
                  onClick={() => alert("Account deletion requested.")}
                  className="w-full text-left p-3.5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/30 text-xs font-bold text-red-400 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete MockMate Account</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              onClick={handleSaveSettings}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
