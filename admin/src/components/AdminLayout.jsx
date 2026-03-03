import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartBar, FaUser, FaComments, FaSearch, FaExpandArrowsAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';

const API_BASE = 'http://localhost:4000';

export default function AdminLayout({ children, title, breadcrumbLabel }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('adminEmail')) {
      navigate('/admin/login');
      return;
    }
    fetch(`${API_BASE}/api/users`)
      .then(res => res.json())
      .then(data => setTotalUsers(Array.isArray(data) ? data.length : 0))
      .catch(() => setTotalUsers(0));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    alert('Signed out successfully');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;
  const breadcrumb = breadcrumbLabel || title || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 flex">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#fafaf8] border-b border-gray-200 z-40 flex items-center px-6 gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-90 bg-white border border-gray-200"
          >
            <img src={logo} alt="Garuda Tribune" className="w-full h-full object-contain" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-200/80 text-gray-600" aria-label="Menu">
            <span className="text-xl">☰</span>
          </button>
        </div>

        <div className="flex-1 max-w-md relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Garuda Tribune</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{breadcrumb}</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2 rounded-lg hover:bg-gray-200/80 text-gray-600" title="Full screen">
            <FaExpandArrowsAlt className="w-4 h-4" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-gray-200/80 text-gray-600">
            <FaBell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-16 w-56 h-[calc(100vh-4rem)] bg-[#fafaf8] border-r border-gray-200 pt-6 flex flex-col z-30">
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
              isActive('/admin/dashboard')
                ? 'bg-indigo-100 text-indigo-700'
                : 'hover:bg-gray-200/80 text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaChartBar className="w-5 h-5" />
            Dashboard
            {totalUsers > 0 && (
              <span className="ml-auto bg-indigo-200/80 text-indigo-700 text-xs px-2 py-0.5 rounded">
                {totalUsers}+
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/admin/manage-user')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
              isActive('/admin/manage-user')
                ? 'bg-indigo-100 text-indigo-700'
                : 'hover:bg-gray-200/80 text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaUser className="w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => navigate('/admin/manage-critics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
              isActive('/admin/manage-critics')
                ? 'bg-indigo-100 text-indigo-700'
                : 'hover:bg-gray-200/80 text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaComments className="w-5 h-5" />
            Feedback
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 pt-20 pb-10 px-6 bg-[#f5f5f0]">
        {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
