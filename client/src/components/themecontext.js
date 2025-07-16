import React, { createContext, useContext, useEffect, useState } from 'react';


const ThemeContext = createContext();

//Provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {

    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light';
  });

  //Theme Dark Mode
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

//Hook Theme
export const useTheme = () => useContext(ThemeContext);