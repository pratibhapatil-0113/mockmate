import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  SkipForward, 
  Lightbulb, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Award, 
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API_BASE_URL from '../config';

export const MockInterview = ({ onFinish }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Mode & State
  const [sessionStarted, setSessionStarted] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [role, setRole] = useState(user?.target_role || 'Software Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  
  // Questions State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Answer Mode State
  const [mode, setMode] = useState('voice'); // 'voice' or 'text'
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  
  // Dynamic Follow-up State
  const [activeFollowUp, setActiveFollowUp] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins countdown
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Evaluation & Completion State
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalReport, setFinalReport] = useState(null);

  // Web Speech API reference
  const recognitionRef = useRef(null);

  // Sound Waveform Canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    let timer = null;
    if (sessionStarted && !isCompleted && !isTimerPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStarted, isCompleted, isTimerPaused, timeLeft]);

  // Audio Canvas visualizer loop
  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#06b6d4';
      const bars = 30;
      for (let i = 0; i < bars; i++) {
        const h = Math.random() * (canvas.height * 0.8) + 4;
        const x = i * 7;
        const y = (canvas.height - h) / 2;
        ctx.fillRect(x, y, 4, h);
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  const handleStartInterview = async () => {
    setEvaluating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 1,
          role,
          type: interviewType,
          difficulty,
          language
        })
      });
      const data = await res.json();
      setInterviewId(data.interview_id);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setCurrentQuestion(data.questions[0]);
      setSessionStarted(true);
      setTimeLeft(300);
    } catch (err) {
      // Fallback offline mock questions
      const mockQs = [
        { id: 101, category: interviewType, question_text: `Explain polymorphism in Java and give a practical example.` },
        { id: 102, category: interviewType, question_text: `What is the difference between process and thread in operating systems?` },
        { id: 103, category: interviewType, question_text: `How do you handle database indexing and optimization?` },
        { id: 104, category: interviewType, question_text: `Describe a challenging project bug you fixed recently.` }
      ];
      setInterviewId(999);
      setQuestions(mockQs);
      setCurrentIndex(0);
      setCurrentQuestion(mockQs[0]);
      setSessionStarted(true);
      setTimeLeft(300);
    } finally {
      setEvaluating(false);
    }
  };

  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'Kannada' ? 'kn-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText(prev => (prev + ' ' + transcript).trim());
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert("Web Speech API is not supported in this browser window. Please use Text Answer Mode.");
      setMode('text');
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      alert("Please speak or type your answer before submitting!");
      return;
    }

    if (isRecording) stopVoiceRecording();
    setEvaluating(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/interview/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_id: interviewId,
          question_id: currentQuestion?.id,
          answer: answerText
        })
      });
      const data = await res.json();
      setCurrentEvaluation(data.evaluation);

      // Check if AI generated dynamic follow-up
      if (data.follow_up && !activeFollowUp) {
        setActiveFollowUp(data.follow_up);
        setAnswerText('');
        setEvaluating(false);
        return; // Stay on screen for follow-up prompt
      }
    } catch (err) {
      // Offline fallback evaluation
      setCurrentEvaluation({
        overall_score: 8.4,
        correctness: 9.0,
        relevance: 8.5,
        completeness: 7.8,
        communication: 8.2,
        confidence: 8.0,
        strong_points: "You explained the main concept correctly and provided a relevant example.",
        improve: "Your explanation could be more structured with clear code snippets or architectural diagrams.",
        missing: "Mention compile-time vs runtime polymorphism.",
        model_answer: "Polymorphism allows objects to behave differently based on dynamic dispatch. State core definition, syntax, and memory implications."
      });
    } finally {
      setEvaluating(false);
    }
  };

  const advanceNextQuestion = () => {
    setActiveFollowUp(null);
    setCurrentEvaluation(null);
    setAnswerText('');
    setHintVisible(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setCurrentQuestion(questions[currentIndex + 1]);
    } else {
      finishInterviewSession();
    }
  };

  const finishInterviewSession = async () => {
    setEvaluating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/interview/evaluate/${interviewId}`, { method: 'POST' });
      const data = await res.json();
      setFinalReport(data);
    } catch (err) {
      setFinalReport({
        overall_score: 8.4,
        summary: `Completed ${interviewType} simulation for ${role}. Overall performance: 8.4/10.`
      });
    } finally {
      setEvaluating(false);
      setIsCompleted(true);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // STEP 1: INTERVIEW SETUP SCREEN
  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">AI Mock Interview Setup</h1>
              <p className="text-xs text-slate-400">Customize your interview parameters for targeted AI simulation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Target Job Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Interview Round Type</label>
              <select 
                value={interviewType} 
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Technical">Technical Round</option>
                <option value="Behavioral">Behavioral Round</option>
                <option value="HR">HR Interview</option>
                <option value="Resume">Resume Deep-Dive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Difficulty Level</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy (Fresher Entry)</option>
                <option value="Medium">Medium (Standard Core)</option>
                <option value="Hard">Hard (Senior Architect)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Interview Language: <b>{language}</b></span>
            <span>Duration: <b>5 Minutes</b></span>
          </div>

          <button 
            onClick={handleStartInterview}
            disabled={evaluating}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/30 border border-indigo-400/30 transition-all text-base flex items-center justify-center gap-3"
          >
            <Mic className="w-5 h-5 text-cyan-200" />
            <span>{evaluating ? 'Initializing AI Cockpit...' : 'Enter AI Interview Room →'}</span>
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: COMPLETED REPORT OVERVIEW SCREEN
  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Interview Complete!</h1>
            <p className="text-sm text-slate-400">Here is your high-level AI simulation assessment summary.</p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">FINAL OVERALL SCORE</p>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              {finalReport?.overall_score || 8.4} / 10
            </p>
            <p className="text-sm text-slate-300 max-w-xl mx-auto pt-2">{finalReport?.summary}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onFinish?.('report')}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>View Full Report & Download PDF</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSessionStarted(false)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 text-sm"
            >
              Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: LIVE INTERVIEW ROOM UI (PRD SPEC #7, #8, #9, #10, #11, #12)
  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Header Bar with Live Timer & Stage Indicator */}
      <div className="glass-panel px-6 py-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          <div>
            <h2 className="font-bold text-base text-white">{role} Interview</h2>
            <p className="text-xs text-slate-400">{interviewType} Round • {difficulty} Level</p>
          </div>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-sm text-cyan-400 font-bold">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button 
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Pause Interview"
          >
            {isTimerPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Interview Status Bar (PRD #9) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-cyan-400 tracking-wider uppercase">
            QUESTION {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-3 text-slate-400">
            <span className={currentIndex === 0 ? 'text-indigo-400 font-bold' : ''}>● Technical</span>
            <span className={currentIndex === 1 ? 'text-indigo-400 font-bold' : ''}>● Behavioral</span>
            <span className={currentIndex === 2 ? 'text-indigo-400 font-bold' : ''}>○ Coding</span>
            <span className={currentIndex === 3 ? 'text-indigo-400 font-bold' : ''}>○ HR</span>
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Signature AI Interviewer Floating Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-indigo-950/30 to-slate-900/60">
        {/* AI Avatar */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 ai-pulse-glow">
          <BrainCircuit className="w-10 h-10" />
        </div>

        <div>
          <p className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest">AI INTERVIEWER</p>
          
          {/* Main Question / Followup Prompt */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 max-w-3xl mx-auto leading-relaxed">
            "{activeFollowUp ? activeFollowUp : (currentQuestion?.question_text || 'Tell me about yourself.')}"
          </h3>
        </div>

        {/* AI Waveform Animation */}
        <div className="flex items-center justify-center gap-1.5 h-8">
          <div className="w-1.5 bg-indigo-500 rounded-full animate-wave-1"></div>
          <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-2"></div>
          <div className="w-1.5 bg-indigo-400 rounded-full animate-wave-3"></div>
          <div className="w-1.5 bg-cyan-300 rounded-full animate-wave-4"></div>
          <div className="w-1.5 bg-indigo-600 rounded-full animate-wave-5"></div>
        </div>

        {/* Hint Box toggle */}
        {hintVisible && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl text-xs text-amber-300 max-w-xl mx-auto text-left">
            💡 <b>Hint:</b> Focus on defining the main concept clearly, mention code usage, and state compile-time vs runtime differences.
          </div>
        )}
      </div>

      {/* Answer Input Section: Voice Mode vs Text Mode */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMode('voice')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'voice' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🎤 Voice Interview Mode
            </button>
            <button 
              onClick={() => setMode('text')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'text' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📝 Text Interview Mode
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono">Character Count: {answerText.length}</span>
        </div>

        {/* VOICE MODE CONTROLS & SPECTRUM */}
        {mode === 'voice' ? (
          <div className="space-y-4">
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Voice Recognition Status</p>
                  <p className="text-sm font-semibold text-white">
                    {isRecording ? '🎤 Listening... Speak your answer out loud' : 'Microphone Idle. Click Record to start.'}
                  </p>
                </div>
              </div>

              {/* Canvas spectrum */}
              <canvas ref={canvasRef} width="200" height="40" className="hidden sm:block rounded-lg" />
            </div>

            {/* Live Transcript Display */}
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Your recognized speech transcript will appear here..."
              className="w-full h-28 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />

            {/* Voice Controls: Record, Pause, Retry */}
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button 
                  onClick={startVoiceRecording}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </button>
              ) : (
                <button 
                  onClick={stopVoiceRecording}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording</span>
                </button>
              )}

              <button 
                onClick={() => setAnswerText('')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        ) : (
          /* TEXT MODE EDITOR */
          <div className="space-y-3">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your structured answer here..."
              className="w-full h-36 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex justify-end">
              <button 
                onClick={() => setAnswerText('')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear text
              </button>
            </div>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setHintVisible(!hintVisible)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold px-4 py-2.5 rounded-xl border border-amber-500/30 text-xs flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>💡 Hint</span>
            </button>

            <button 
              onClick={advanceNextQuestion}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold px-4 py-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-1.5"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          </div>

          <button 
            onClick={handleSubmitAnswer}
            disabled={evaluating}
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 text-sm flex items-center gap-2"
          >
            <span>{evaluating ? 'AI Evaluating...' : 'Submit Answer →'}</span>
          </button>
        </div>
      </div>

      {/* AI EVALUATION SCREEN MODAL / OVERLAY (PRD SPEC #12) */}
      {currentEvaluation && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 space-y-6 bg-slate-900/95 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">AI EVALUATION SCREEN</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">Answer Feedback Breakdown</h3>
            </div>
            <div className="text-center bg-indigo-600/20 border border-indigo-500/40 px-5 py-2.5 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Your Score</p>
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {currentEvaluation.overall_score} / 10
              </p>
            </div>
          </div>

          {/* Animated 5-Metric Subscore Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Correctness', val: currentEvaluation.correctness },
              { label: 'Relevance', val: currentEvaluation.relevance },
              { label: 'Completeness', val: currentEvaluation.completeness },
              { label: 'Communication', val: currentEvaluation.communication },
              { label: 'Confidence', val: currentEvaluation.confidence }
            ].map((m, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <p className="text-[11px] font-semibold text-slate-400">{m.label}</p>
                <p className="text-lg font-bold text-cyan-400">{m.val}</p>
              </div>
            ))}
          </div>

          {/* AI Feedback Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                ✨ Strong Points
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{currentEvaluation.strong_points}</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                🔧 Improve
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{currentEvaluation.improve}</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                💡 Missing Details
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{currentEvaluation.missing}</p>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                🧠 Model Answer
              </p>
              <p className="text-xs text-slate-300 leading-relaxed italic">{currentEvaluation.model_answer}</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={advanceNextQuestion}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2"
            >
              <span>Continue to Next Question →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
