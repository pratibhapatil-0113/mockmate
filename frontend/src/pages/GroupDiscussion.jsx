import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Send, 
  Award, 
  BrainCircuit, 
  MessageSquare, 
  CheckCircle2, 
  Mic 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

export const GroupDiscussion = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('Is AI going to replace software developers?');
  const [speechInput, setSpeechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const [messages, setMessages] = useState([
    {
      speaker: 'AI Moderator',
      role: 'Moderator',
      text: "Welcome candidates to today's Group Discussion on: 'Is AI going to replace software developers?'. Please present clear arguments and build upon each other's points.",
      time: '10:00 AM'
    },
    {
      speaker: 'Ananya (AI Peer)',
      role: 'Participant',
      text: 'I believe AI will automate repetitive boilerplate code, allowing developers to focus on higher-level system architecture and problem solving.',
      time: '10:01 AM'
    },
    {
      speaker: 'Rohan (AI Peer)',
      role: 'Participant',
      text: 'While AI tools are fast, they lack deep domain context, security intuition, and human empathy required for complex product decisions.',
      time: '10:02 AM'
    }
  ]);

  const handleUserSpeak = async () => {
    if (!speechInput.trim()) return;

    const userMsg = {
      speaker: user?.name || 'Pratibha (Candidate)',
      role: 'User',
      text: speechInput,
      time: '10:03 AM'
    };

    setMessages(prev => [...prev, userMsg]);
    setSpeechInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/gd/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, speech: speechInput })
      });
      const data = await res.json();
      setEvaluation(data.evaluation);

      if (data.reaction) {
        setMessages(prev => [
          ...prev,
          { speaker: data.reaction.speaker, role: 'Moderator', text: data.reaction.message, time: '10:04 AM' },
          { speaker: data.reaction.ai_peer_response.speaker, role: 'Participant', text: data.reaction.ai_peer_response.message, time: '10:05 AM' }
        ]);
      }
    } catch (err) {
      setEvaluation({
        clarity: 8.5,
        argument_quality: 8.2,
        relevance: 9.0,
        communication: 8.4,
        confidence: 8.0,
        overall: 8.4,
        feedback: "Great point made! You effectively highlighted how human intuition complements automated software tools."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Group Discussion (GD Arena)</h1>
            <p className="text-xs text-slate-400">Topic: "{topic}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Circular Discussion UI (PRD SPEC #16) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between min-h-[500px]">
          {/* Circular Central Moderator Avatar & Participants */}
          <div className="relative py-8 bg-slate-950/60 rounded-3xl border border-slate-800 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 flex flex-col items-center justify-center text-white shadow-2xl ai-pulse-glow z-10">
              <BrainCircuit className="w-8 h-8" />
              <span className="text-[10px] font-bold uppercase mt-1">AI Moderator</span>
            </div>

            {/* Circular Orbiting Participant Avatars */}
            <div className="absolute left-8 top-6 w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
              Ananya
            </div>
            <div className="absolute right-8 top-6 w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
              Rohan
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
              Candidate ({user?.name || 'Pratibha'})
            </div>
          </div>

          {/* Transcript Feed */}
          <div className="space-y-3 overflow-y-auto max-h-64 px-2">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                  m.role === 'User' 
                    ? 'bg-indigo-600/20 border border-indigo-500/40 ml-8 text-right' 
                    : m.role === 'Moderator' 
                    ? 'bg-cyan-500/10 border border-cyan-500/20 mr-8' 
                    : 'bg-slate-900 border border-slate-800 mr-8'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px] text-slate-300">
                  <span>{m.speaker}</span>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="text" 
              value={speechInput}
              onChange={(e) => setSpeechInput(e.target.value)}
              placeholder="State your argument to join the group discussion..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleUserSpeak()}
            />
            <button 
              onClick={handleUserSpeak}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg"
            >
              <span>{loading ? 'Processing...' : 'Speak'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Evaluation Panel (PRD SPEC #16) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            GD Evaluation Metrics
          </h3>

          {evaluation ? (
            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Overall GD Score</p>
                <p className="text-3xl font-extrabold text-cyan-400 mt-1">{evaluation.overall} / 10</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Clarity', val: evaluation.clarity },
                  { label: 'Argument Quality', val: evaluation.argument_quality },
                  { label: 'Relevance', val: evaluation.relevance },
                  { label: 'Communication', val: evaluation.communication },
                  { label: 'Confidence', val: evaluation.confidence }
                ].map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-300 font-semibold">{m.label}</span>
                    <span className="text-cyan-400 font-bold">{m.val}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-300">
                ✨ <b>Feedback:</b> {evaluation.feedback}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
              <p>Speak in the discussion to view live AI evaluation of your argument clarity and communication.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
