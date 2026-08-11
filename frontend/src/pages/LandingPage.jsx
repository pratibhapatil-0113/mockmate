import React from 'react';
import { 
  Sparkles, 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Award, 
  Code2, 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  Play
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">MockMate</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onStart}
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onStart}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 transition-all hover:scale-[1.02]"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Career Cockpit v1.0 • BCA Mini Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Your AI <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Interview Partner</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed font-medium">
            Practice realistic interviews, receive instant AI feedback, and build the confidence to crack your next technical or behavioral job interview.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={onStart}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base px-7 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/30 border border-indigo-400/30 transition-all hover:scale-[1.03]"
            >
              <Mic className="w-5 h-5 text-cyan-200" />
              <span>Start Mock Interview</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a 
              href="#features"
              className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 font-semibold text-base px-6 py-3.5 rounded-2xl transition-all"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-xl">
            <div>
              <p className="text-2xl font-bold text-white">82%</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Avg Readiness Improvement</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">100+</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Curated Tech Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">Instant</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">AI Score & Feedback</p>
            </div>
          </div>
        </div>

        {/* Hero Visual - Floating AI Interview Room */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-30 blur-2xl animate-pulse"></div>
          
          <div className="relative glass-panel rounded-3xl p-6 border border-slate-700/60 shadow-2xl space-y-6 text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold text-sm text-slate-200 tracking-wide">MOCKMATE AI</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                04:32 Live
              </span>
            </div>

            {/* AI Avatar & Question Prompt */}
            <div className="text-center py-4 space-y-4 bg-slate-900/60 rounded-2xl p-5 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/40 ai-pulse-glow">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">AI Interviewer</p>
                <p className="text-lg font-bold text-white mt-1 italic">"Tell me about yourself and your practical experience with Java."</p>
              </div>

              {/* Animated AI Waveform */}
              <div className="flex items-center justify-center gap-1.5 h-10 pt-2">
                <div className="w-1.5 bg-indigo-500 rounded-full animate-wave-1"></div>
                <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-2"></div>
                <div className="w-1.5 bg-indigo-400 rounded-full animate-wave-3"></div>
                <div className="w-1.5 bg-cyan-300 rounded-full animate-wave-4"></div>
                <div className="w-1.5 bg-indigo-600 rounded-full animate-wave-5"></div>
              </div>
            </div>

            {/* Candidate Response Status */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Candidate Mic</p>
                  <p className="text-sm text-slate-200 font-medium">🎤 Listening to your answer...</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl w-full mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Complete AI Career Cockpit</h2>
          <p className="text-slate-400">Everything you need to prepare, simulate, evaluate, improve, and track your interview performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: Mic, title: "Dynamic AI Mock Interviews", desc: "Adaptive dynamic follow-up questions tailored to your exact responses across Technical, HR, and Behavioral rounds." },
            { icon: FileText, title: "Resume ATS Coach", desc: "Upload your resume for instant ATS scoring, keyword analysis, and custom resume-based interview questions." },
            { icon: Code2, title: "Live Coding Lab", desc: "Full IDE experience supporting Python, Java, C, C++, and JavaScript with test case execution." },
            { icon: BrainCircuit, title: "Aptitude Arena", desc: "Interactive timed tests covering Quantitative, Logical Reasoning, Verbal Ability, and Data Interpretation." },
            { icon: Zap, title: "Group Discussion (GD)", desc: "Circular discussion room with AI Moderator and AI candidate peers simulating real placement GD rounds." },
            { icon: Award, title: "Formal PDF Reports", desc: "Detailed metric scoring, AI feedback, recommendations, and downloadable PDF interview performance reports." }
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 glass-card-hover text-left space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 MockMate AI • BCA Mini Project • All Rights Reserved</p>
      </footer>
    </div>
  );
};
