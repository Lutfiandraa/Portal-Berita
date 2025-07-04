import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Trending from './Trending';
import Article from './Article';
import Critic from './Critic';
import NewsList from './components/newlist';
import logo from './assets/logo.png';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import Login from './Login';
import { Sun, Moon } from 'lucide-react';
import Marquee from 'react-fast-marquee';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { ClipLoader } from 'react-spinners';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [initialLoading, setInitialLoading] = useState(true);
  const [marqueeTitles, setMarqueeTitles] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch judul artikel untuk marquee
    const fetchMarqueeNews = async () => {
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=01d3df6599db4d749cf23b47b150c8ce`);
        const data = await response.json();
        if (data.status === 'ok') {
          const titles = data.articles.map(a => a.title).filter(Boolean);
          setMarqueeTitles(titles);
        }
      } catch (error) {
        console.error('Gagal mengambil marquee news:', error);
      }
    };

    fetchMarqueeNews();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1E32] text-white">
        <img src={logo} alt="Logo" className="w-16 h-16 mb-4 animate-pulse" />
        <ClipLoader color="#ffffff" size={40} />
        <p className="mt-2 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="App min-h-screen font-sans bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      {/* Navbar */}
      <nav className="shadow-md py-3 sticky top-0 z-50 bg-[#0E1E32]">
        <div className="container mx-auto flex justify-between items-center px-6 text-white">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">Winnicode New's</span>
          </div>

          <ul className="flex space-x-8 font-medium text-sm md:text-base">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/trending" className="hover:text-gray-300">Trending</Link></li>
            <li><Link to="/articles" className="hover:text-gray-300">Articles</Link></li>
            <li><Link to="/critics" className="hover:text-gray-300">Critics</Link></li>
          </ul>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-white hover:text-yellow-300">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/profile">
              <FaUserCircle className="cursor-pointer hover:text-gray-300 text-2xl" />
            </Link>
            <FaSignOutAlt
              className="cursor-pointer text-red-500 hover:text-red-400 text-2xl"
              onClick={handleLogout}
            />
          </div>
        </div>
      </nav>

      {/* Marquee di bawah navbar */}
      <Marquee
        gradient={false}
        speed={50}
        className="bg-gray-100 dark:bg-[#1E293B] py-2 text-sm text-gray-800 dark:text-white font-medium"
      >
        {marqueeTitles.length > 0
          ? marqueeTitles.map((title, index) => (
              <span key={index} className="mx-6">
                ﹘ {title}
              </span>
            ))
          : 'Loading headlines...'}
      </Marquee>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/critics" element={<Critic />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-[#0E1E32] text-center py-4 mt-4">
        <div className="max-w-sm w-full mx-auto flex flex-col items-center justify-center px-4">
          <img src={logo} alt="Winnicode Logo" className="w-12 h-auto mb-1" />
          <p className="text-gray-400 text-sm">
            copyright © 2025 | Winnicode New's
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;