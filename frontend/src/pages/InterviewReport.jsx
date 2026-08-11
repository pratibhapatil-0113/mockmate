import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Calendar, 
  User, 
  Briefcase,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

export const InterviewReport = ({ interviewId = 1, onBack }) => {
  const { user } = useAuth();
  const [report, setReport] = useState({
    interview_id: 1,
    candidate_name: user?.name || "Pratibha",
    role: user?.target_role || "Software Developer",
    date: "2026-08-11",
    type: "Technical Interview",
    score: 84,
    metrics: {
      technical: 86,
      communication: 79,
      problem_solving: 90,
      confidence: 76
    },
    summary: "Strong technical candidate with good problem-solving ability. Communication and confidence should be improved for high-stakes interviews.",
    recommendations: [
      "Practice behavioral questions to build fluid response structures.",
      "Improve answer structure using STAR method (Situation, Task, Action, Result).",
      "Practice speaking out loud for 10 minutes daily with MockMate voice mode."
    ],
    questions: [
      { question_text: "Explain polymorphism in Java.", user_answer: "Polymorphism allows methods to perform different tasks based on the object overriding it.", score: 8.5 },
      { question_text: "What is the difference between process and thread?", user_answer: "Processes run in separate memory spaces while threads share process memory.", score: 9.0 }
    ]
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/report/${interviewId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setReport(data);
        }
      })
      .catch(() => {});
  }, [interviewId]);

  const handleDownloadPDF = () => {
    window.open(`${API_BASE_URL}/api/report/${interviewId}/pdf`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left print:text-black print:bg-white">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between print:hidden">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold text-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        )}

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg border border-indigo-400/30 text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Formal Report Document (PRD SPEC #20) */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8 bg-[#131b2e] text-slate-100 shadow-2xl print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight print:text-slate-900">MockMate Interview Report</h1>
            <p className="text-xs text-indigo-400 font-bold tracking-wide uppercase print:text-indigo-600">AI-Powered Candidate Performance & Evaluation Summary</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">Platform Version</span>
            <p className="text-sm font-bold text-cyan-400 print:text-cyan-700">MockMate AI 1.0</p>
          </div>
        </div>

        {/* Candidate Meta Info Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase print:text-slate-600">Candidate Name</p>
            <p className="text-sm font-bold text-white print:text-slate-900">{report.candidate_name}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase print:text-slate-600">Target Role</p>
            <p className="text-sm font-bold text-white print:text-slate-900">{report.role}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase print:text-slate-600">Interview Date</p>
            <p className="text-sm font-bold text-white print:text-slate-900">{report.date}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase print:text-slate-600">Round Type</p>
            <p className="text-sm font-bold text-cyan-400 print:text-indigo-700">{report.type}</p>
          </div>
        </div>

        {/* Overall Score & Metric Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-indigo-500/30 text-center space-y-2 print:bg-slate-100 print:border-slate-300">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-slate-600">OVERALL SCORE</p>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 print:text-indigo-700">
              {report.score} / 100
            </p>
            <p className="text-xs text-emerald-400 font-semibold print:text-emerald-700">Status: Interview Ready</p>
          </div>

          <div className="sm:col-span-7 grid grid-cols-2 gap-3">
            {[
              { label: 'Technical Score', val: report.metrics.technical },
              { label: 'Communication', val: report.metrics.communication },
              { label: 'Problem Solving', val: report.metrics.problem_solving },
              { label: 'Confidence', val: report.metrics.confidence }
            ].map((m, idx) => (
              <div key={idx} className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 print:bg-slate-100 print:border-slate-300 space-y-1">
                <p className="text-xs font-semibold text-slate-400 print:text-slate-700">{m.label}</p>
                <p className="text-xl font-bold text-white print:text-slate-900">{m.val}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white print:text-slate-900">AI Executive Summary</h3>
          <p className="text-sm text-slate-300 leading-relaxed print:text-slate-700 font-medium">{report.summary}</p>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-slate-900">Actionable Recommendations</h3>
          <ul className="space-y-2 text-sm text-slate-300 print:text-slate-700">
            {report.recommendations.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Question Answers Table */}
        <div className="space-y-4 pt-4 border-t border-slate-800 print:border-slate-300">
          <h3 className="text-lg font-bold text-white print:text-slate-900">Detailed Question Performance</h3>
          
          <div className="space-y-3">
            {report.questions.map((q, idx) => (
              <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-1">
                <div className="flex justify-between text-xs font-bold text-cyan-400 print:text-indigo-700">
                  <span>Question #{idx + 1}</span>
                  <span>Score: {q.score}/10</span>
                </div>
                <p className="text-sm font-bold text-white print:text-slate-900">Q: {q.question_text}</p>
                <p className="text-xs text-slate-300 print:text-slate-700">A: "{q.user_answer}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
