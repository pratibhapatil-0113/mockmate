import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Mic, 
  BrainCircuit, 
  Zap, 
  Target,
  ChevronRight
} from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API_BASE_URL from '../config';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    readiness: 82,
    total_interviews: 15,
    avg_score: '82%',
    streak: 7,
    skills: {
      Technical: 88,
      Communication: 74,
      'Problem Solving': 91,
      Confidence: 70,
      Coding: 81
    },
    ai_insight: "Your technical performance is strong, but your communication score has remained below 75%. Recommended: Complete 3 behavioral interviews this week."
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/progress/stats/${user?.id || 1}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, [user]);

  const getGreeting = () => {
    try {
      const hour = new Date().getHours();
      if (hour < 5) return 'Good night';
      if (hour < 12) return 'Good morning';
      if (hour < 17) return 'Good afternoon';
      if (hour < 21) return 'Good evening';
      return 'Good night';
    } catch (e) {
      return 'Hello';
    }
  };

  const radarData = {
    labels: ['Technical', 'Communication', 'Problem Solving', 'Confidence', 'Coding'],
    datasets: [
      {
        label: 'Current Skill Level (%)',
        data: [
          stats.skills.Technical,
          stats.skills.Communication,
          stats.skills['Problem Solving'],
          stats.skills.Confidence,
          stats.skills.Coding
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#06b6d4'
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: {
          color: '#cbd5e1',
          font: { size: 11, weight: '600' }
        },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: { display: false }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header Greeting & CTA */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Cockpit Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {user?.name || 'Pratibha'} 👋
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Ready for your next challenge? Your AI coach has prepared customized questions.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('mock_interview')}
          className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/30 border border-indigo-400/30 transition-all hover:scale-[1.02] shrink-0"
        >
          <Mic className="w-5 h-5 text-cyan-200" />
          <span>Start Interview</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Readiness & Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Card */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">YOUR INTERVIEW READINESS</p>
              <h2 className="text-4xl font-extrabold text-white mt-2 flex items-baseline gap-2">
                {stats.readiness}%
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                  +12% from last month
                </span>
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Target className="w-7 h-7" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-md"
                style={{ width: `${stats.readiness}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>0% Baseline</span>
              <span>80% Target</span>
              <span>100% Expert</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xl font-bold text-white">{stats.total_interviews}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Interviews</p>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xl font-bold text-cyan-400">{stats.avg_score}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Avg Score</p>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
                <span>{stats.streak}</span>
                <Flame className="w-4 h-4 fill-amber-400" />
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Skill Radar Chart */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SKILL RADAR</p>
              <h3 className="text-lg font-bold text-white mt-0.5">Core Competency Matrix</h3>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Real-time
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* AI Recommendation Insight Card */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0 ai-pulse-glow">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              🤖 MockMate AI Insight
            </h4>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {stats.ai_insight}
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('mock_interview')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <span>Practice Now</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Launch Modules Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'coding_lab', label: 'Coding Lab', desc: 'Algorithm Practice', icon: Zap, color: 'text-amber-400' },
          { id: 'resume_coach', label: 'Resume Coach', desc: 'ATS Score 78/100', icon: TrendingUp, color: 'text-cyan-400' },
          { id: 'aptitude', label: 'Aptitude Arena', desc: 'Quant & Logic', icon: Target, color: 'text-emerald-400' },
          { id: 'gd_arena', label: 'Group Discussion', desc: 'Circular Room', icon: Sparkles, color: 'text-indigo-400' }
        ].map(mod => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className="glass-panel p-4 rounded-2xl border border-slate-800 glass-card-hover text-left flex flex-col justify-between space-y-3"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${mod.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{mod.label}</p>
                <p className="text-[11px] text-slate-400 font-medium">{mod.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
