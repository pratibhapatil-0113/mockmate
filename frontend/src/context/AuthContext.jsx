import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mockmate_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      name: 'Pratibha',
      email: 'pratibha@example.com',
      target_role: 'Software Developer',
      skills: ['Java', 'Python', 'React', 'SQL'],
      experience_level: 'Fresher (0-1 yrs)',
      language: 'English',
      streak: 7,
      xp: 150,
      interview_readiness: 82
    };
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('mockmate_theme') || 'dark');
  const [isOnboarded, setIsOnboarded] = useState(true);

  useEffect(() => {
    localStorage.setItem('mockmate_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mockmate_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('mockmate_user');
  };

  const updateUserProfile = (fields) => {
    setUser(prev => ({ ...prev, ...fields }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      theme,
      setTheme,
      isOnboarded,
      setIsOnboarded
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
