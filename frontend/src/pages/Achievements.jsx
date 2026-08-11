import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  Lock, 
  CheckCircle2,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export const Achievements = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([
    { id: "first_interview", badge_name: "First Interview", description: "Complete your first AI interview simulation", icon: "🏆", unlocked: true },
    { id: "streak_7", badge_name: "7-Day Streak", description: "Maintain a 7-day interview practice streak", icon: "🔥", unlocked: true },
    { id: "coding_master", badge_name: "Coding Master", description: "Solve a coding problem in Coding Lab", icon: "💻", unlocked: true },
    { id: "score_90", badge_name: "Score 90+", description: "Achieve a score of 9.0+ in an interview", icon: "🎯", unlocked: false },
    { id: "questions_100", badge_name: "100 Questions", description: "Answer 100 interview questions", icon: "🧠", unlocked: true },
    { id: "interview_ready", badge_name: "Interview Ready", description: "Achieve an overall readiness score of 80%+", icon: "🚀", unlocked: true }
  ]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-left">
      {/* Header with XP Counter & Streak */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Achievements & XP Wall</h1>
            <p className="text-xs text-slate-400">Earn badges and unlock career milestones through consistent practice</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-2xl text-amber-400 font-bold text-sm">
            <Flame className="w-5 h-5 fill-amber-400" />
            <span>{user?.streak || 7} Day Streak</span>
          </div>

          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl text-indigo-400 font-bold text-sm">
            <Zap className="w-5 h-5" />
            <span>{user?.xp || 150} XP Points</span>
          </div>
        </div>
      </div>

      {/* Achievement Wall Badges Grid (PRD SPEC #19) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b) => (
          <div 
            key={b.id}
            onClick={b.unlocked ? triggerConfetti : undefined}
            className={`glass-panel p-6 rounded-3xl border transition-all ${
              b.unlocked 
                ? 'border-indigo-500/40 glass-card-hover cursor-pointer bg-slate-900/80 shadow-lg' 
                : 'border-slate-800/60 opacity-50 grayscale select-none bg-slate-950/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
                {b.icon}
              </div>

              {b.unlocked ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Locked
                </span>
              )}
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-white">{b.badge_name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
