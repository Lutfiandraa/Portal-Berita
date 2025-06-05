import React from 'react';
import './App.css';
import './index.css';
import Trending from './Trending';
import Article from './Article';
import Critic from './Critic';
import logo from './assets/logo.png';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, Routes, Route } from 'react-router-dom';
import NewsList from './components/NewsList'; // <-- pastikan path ini sesuai

function App() {
  return (
    <div className="App bg-gray-50 min-h-screen text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="shadow-md py-3 sticky top-0 z-50" style={{ backgroundColor: '#0E1E32' }}>
        <div className="container mx-auto flex justify-between items-center px-6 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">Winnicode New's</span>
          </div>
          {/* Menu */}
          <ul className="flex space-x-8 font-medium text-sm md:text-base">
            <li><Link to="/" className="hover:text-gray-300 cursor-pointer">Home</Link></li>
            <li><Link to="/trending" className="hover:text-gray-300 cursor-pointer">Trending</Link></li>
            <li><Link to="/articles" className="hover:text-gray-300 cursor-pointer">Article’s</Link></li>
            <li><Link to="/critics" className="hover:text-gray-300 cursor-pointer">Critic’s</Link></li>
          </ul>
          {/* Icons */}
          <div className="flex items-center space-x-4">
            <FaUserCircle className="cursor-pointer hover:text-gray-300 text-2xl" />
            <FaSignOutAlt className="cursor-pointer text-red-500 hover:text-red-400 text-2xl" />
          </div>
        </div>
      </nav>

      {/* Routing */}
      <Routes>
        <Route path="/" element={
          <>
            {/* Heading */}
            <div className="container mx-auto px-6 my-10">
              <div className="flex items-center justify-between bg-[#0E1E32] text-white p-3 rounded font-semibold">
                <input
                  type="text"
                  placeholder="Breaking News"
                  className="text-gray-800 px-4 py-2 rounded w-1/3"
                />
                <div className="text-center flex-1">
                  <span className="text-white text-xl font-semibold">Explore Content</span>
                </div>
              </div>
            </div>

            {/* News List dari API */}
            <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <NewsList />
            </div>

            {/* View More Button */}
            <div className="text-center my-8">
              <button className="border border-gray-400 px-6 py-2 rounded hover:bg-gray-100">View More</button>
            </div>
          </>
        } />
        <Route path="/trending" element={<Trending />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/critics" element={<Critic />} />
      </Routes>

      {/* Footer */}
      <footer className="text-white text-center py-4" style={{ backgroundColor: '#0E1E32' }}>
        <p>Copyright © 2025 | Winnicode Garuda Teknologi</p>
      </footer>
    </div>
  );
}

export default App;