import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  Globe, 
  Briefcase, 
  Code2, 
  Award, 
  Lock, 
  Mail, 
  User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import API_BASE_URL from '../config';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onComplete }) => {
  const { loginUser, user } = useAuth();
  const { setLanguage } = useLanguage();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'onboarding'
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('Pratibha');
  const [email, setEmail] = useState('pratibha@example.com');
  const [password, setPassword] = useState('demo123');
  const [confirmPassword, setConfirmPassword] = useState('demo123');
  const [targetRole, setTargetRole] = useState('Software Developer');
  
  // Onboarding State
  const [selectedSkills, setSelectedSkills] = useState(['Java', 'Python', 'React', 'SQL']);
  const [experience, setExperience] = useState('Fresher (0-1 yrs)');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [resumeFileName, setResumeFileName] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, target_role: targetRole })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        loginUser(data.user);
        setMode('onboarding');
        setStep(1);
        return;
      }
    } catch (err) {
      // fallthrough to local onboarding
    }

    // Fallback: continue with local onboarding if register failed
    setMode('onboarding');
    setStep(1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        loginUser(data.user);
        onComplete();
        return;
      }
      // If login failed, show message
      alert(data.error || 'Login failed. Check credentials.');
    } catch (err) {
      alert('Unable to reach server. Using offline demo account.');
      loginUser({
        id: 1,
        name: name || 'Pratibha',
        email,
        target_role: targetRole,
        skills: selectedSkills,
        experience_level: experience,
        language: selectedLanguage,
        streak: 7,
        xp: 150,
        interview_readiness: 82
      });
      onComplete();
    }
  };

  const finishOnboarding = async () => {
    setLanguage(selectedLanguage);
    // If we have a server-side user (from register), persist onboarding to backend
    if (user && user.id) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/onboarding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            target_role: targetRole,
            skills: selectedSkills,
            experience_level: experience,
            language: selectedLanguage
          })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          loginUser(data.user);
          onComplete();
          return;
        }
      } catch (err) {
        // fallthrough to local update
      }
    }

    // Fallback local-only user
    const userData = {
      id: user?.id || Date.now(),
      name,
      email,
      target_role: targetRole,
      skills: selectedSkills,
      experience_level: experience,
      language: selectedLanguage,
      streak: 7,
      xp: 150,
      interview_readiness: 82
    };
    loginUser(userData);
    onComplete();
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl card-bg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-left">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">MockMate AI</h2>
            <p className="text-xs text-slate-400">Your AI Interview Partner</p>
          </div>
        </div>

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-current focus:outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-current focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 transition-all text-sm mt-2"
            >
              Sign In
            </button>

            <button 
              type="button"
              onClick={() => handleLoginSubmit({ preventDefault: () => {} })}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold py-3 rounded-xl border border-slate-700 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Continue with Google</span>
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => setMode('register')} 
                className="text-cyan-400 hover:underline font-semibold"
              >
                Register Now
              </button>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-current focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-current focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Target Role</label>
              <select 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 transition-all text-sm mt-1"
            >
              Continue to Onboarding →
            </button>

            <div className="text-center pt-1 text-xs text-slate-400">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setMode('login')} 
                className="text-cyan-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 5-STEP ONBOARDING WIZARD */}
        {mode === 'onboarding' && (
          <div className="space-y-6">
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span>Step {step} of 5</span>
                <span>{step === 1 ? 'Career Goal' : step === 2 ? 'Skills' : step === 3 ? 'Experience' : step === 4 ? 'Resume' : 'Language'}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* STEP 1: CAREER GOAL */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Choose your target career goal</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Software Developer',
                    'Full Stack Engineer',
                    'Frontend Developer',
                    'Backend Developer',
                    'Data Scientist',
                    'DevOps Engineer'
                  ].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                        targetRole === role 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SKILLS */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Select your key technical skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'Python', 'JavaScript', 'React', 'C++', 'SQL', 'Node.js', 'HTML/CSS', 'Git', 'Data Structures', 'Spring Boot'].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSkills.includes(skill)
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {skill} {selectedSkills.includes(skill) ? '✓' : '+'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: EXPERIENCE */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Select your current experience level</h3>
                <div className="space-y-2.5">
                  {[
                    'Fresher (0-1 yrs)',
                    'Junior Developer (1-2 yrs)',
                    'Mid-Level Engineer (2-5 yrs)',
                    'Senior Engineer (5+ yrs)'
                  ].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperience(exp)}
                      className={`w-full p-3.5 rounded-xl border text-left text-sm font-semibold transition-all ${
                        experience === exp 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: UPLOAD RESUME */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Upload your resume (Optional)</h3>
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-900/50 cursor-pointer transition-colors">
                  <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Drop your resume here or Browse Files</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX formats</p>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFileName(e.target.files[0]?.name || '')}
                    className="hidden" 
                    id="resume-modal-upload"
                  />
                  <label htmlFor="resume-modal-upload" className="inline-block mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                    {resumeFileName ? `Selected: ${resumeFileName}` : 'Browse Files'}
                  </label>
                </div>
              </div>
            )}

            {/* STEP 5: PREFERRED LANGUAGE */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Choose preferred interview language</h3>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setSelectedLanguage(l.code)}
                      className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                        selectedLanguage === l.code 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white font-semibold"
                >
                  ← Back
                </button>
              ) : <div></div>}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishOnboarding}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile Ready! Launch Cockpit</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
