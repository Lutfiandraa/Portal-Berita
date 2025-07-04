import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Buat Context
const ThemeContext = createContext();

// 2. Provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Cek localStorage dulu
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light';
  });

  // 3. Update class 'dark' di <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Hook untuk akses theme
export const useTheme = () => useContext(ThemeContext);