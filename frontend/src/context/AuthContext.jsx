import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mockmate_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('mockmate_theme') || 'dark');
  const [isOnboarded, setIsOnboarded] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mockmate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockmate_user');
    }
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

  const updateUserProfile = async (fields) => {
    // Update locally first for instant UI feedback
    setUser(prev => ({ ...prev, ...fields }));

    // If user exists on backend, persist the changes
    if (user && user.id) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields)
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Ignore network errors; local state already updated
      }
    }
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
