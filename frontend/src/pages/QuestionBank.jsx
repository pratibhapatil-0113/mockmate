import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText,
  Star
} from 'lucide-react';
import API_BASE_URL from '../config';

export const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [treeExpanded, setTreeExpanded] = useState({ Java: true, OOP: true });
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [selectedRole, selectedCategory, selectedDifficulty]);

  const fetchQuestions = () => {
    let url = `${API_BASE_URL}/api/questions/bank?`;
    if (selectedRole) url += `role=${encodeURIComponent(selectedRole)}&`;
    if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (selectedDifficulty) url += `difficulty=${encodeURIComponent(selectedDifficulty)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions);
          if (data.questions.length > 0) setActiveQuestion(data.questions[0]);
        }
      })
      .catch(() => {});
  };

  const toggleBookmark = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/questions/bookmark/${id}`, { method: 'POST' });
      const data = await res.json();
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, bookmarked: data.bookmarked } : q));
      if (activeQuestion?.id === id) {
        setActiveQuestion(prev => ({ ...prev, bookmarked: data.bookmarked }));
      }
    } catch (err) {}
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-left">
      {/* Header & Search Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Curated Question Bank</h1>
            <p className="text-xs text-slate-400">Comprehensive interview question library with bookmarking and tree navigation</p>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
              placeholder="Search questions or answers..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-semibold text-white px-3 py-2.5 rounded-xl focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Java">Java</option>
            <option value="Web">Web Frontend</option>
            <option value="Python">Python</option>
            <option value="System Design">System Design</option>
          </select>

          <select 
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-semibold text-white px-3 py-2.5 rounded-xl focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Topic Tree View + Right Question Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Topic Tree Navigation (PRD SPEC #17) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topic Directory Tree</h3>

          <div className="space-y-2 text-xs font-semibold text-slate-300">
            {/* Java Category Folder */}
            <div>
              <div 
                onClick={() => setTreeExpanded(prev => ({ ...prev, Java: !prev.Java }))}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-indigo-400"
              >
                {treeExpanded.Java ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Folder className="w-4 h-4 fill-indigo-500/20" />
                <span>Java Programming</span>
              </div>

              {treeExpanded.Java && (
                <div className="pl-6 space-y-1 mt-1 border-l border-slate-800 ml-3">
                  {['OOP', 'Collections', 'Exception Handling', 'Multithreading'].map(topic => (
                    <div 
                      key={topic}
                      onClick={() => { setSelectedCategory('Java'); fetchQuestions(); }}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/80 cursor-pointer text-slate-400 hover:text-white"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Web Development Folder */}
            <div 
              onClick={() => { setSelectedCategory('Web'); fetchQuestions(); }}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-cyan-400"
            >
              <Folder className="w-4 h-4 fill-cyan-500/20" />
              <span>Web Development</span>
            </div>

            {/* System Design Folder */}
            <div 
              onClick={() => { setSelectedCategory('System Design'); fetchQuestions(); }}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-amber-400"
            >
              <Folder className="w-4 h-4 fill-amber-500/20" />
              <span>System Design Architecture</span>
            </div>
          </div>
        </div>

        {/* Right Questions List & Detail Pane */}
        <div className="lg:col-span-8 space-y-4">
          {questions.map((q) => (
            <div 
              key={q.id}
              onClick={() => setActiveQuestion(q)}
              className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                activeQuestion?.id === q.id 
                  ? 'border-indigo-500 bg-slate-900/80 shadow-lg' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {q.category} • {q.topic}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    q.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(q.id); }}
                  className="p-1.5 text-slate-400 hover:text-amber-400"
                >
                  <Bookmark className={`w-4 h-4 ${q.bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              <h3 className="text-base font-bold text-white">{q.question}</h3>
              <p className="text-xs text-slate-300 leading-relaxed italic">{q.answer_guide}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
