import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiRefreshCcw } from 'react-icons/fi';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  // Dummy captcha generator
  const generateCaptcha = () => {
    const random = Math.random().toString(36).substring(2, 8);
    setCaptchaText(random);
  };

  useEffect(() => {
    generateCaptcha();

    // Auto-login if already stored
    const adminEmail = localStorage.getItem('adminEmail');
    if (adminEmail) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      alert('❌ Email dan Password tidak boleh kosong.');
      return;
    }

    if (userCaptcha !== captchaText) {
      alert('❌ Captcha salah.');
      generateCaptcha();
      return;
    }

    // Simpan ke localStorage (dummy)
    localStorage.setItem('adminEmail', formData.email);

    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex items-center justify-center pt-24">
      <div className="w-full max-w-md bg-white text-gray-800 rounded shadow-md mb-16">
        <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t-md">
          <h2 className="text-xl font-semibold">Login Admin Panel</h2>
        </div>

        <form className="w-full px-6 py-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold mb-1 text-gray-700">E-Mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Admin Email"
            className="w-full mb-4 px-4 py-2 border rounded text-xs bg-white text-gray-800 placeholder-gray-500"
            required
          />

          <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded text-xs bg-white text-gray-800 placeholder-gray-500 pr-10"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Dummy Captcha */}
          <label className="block text-sm font-semibold mb-1 text-gray-700">Captcha</label>
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded font-mono text-sm select-none">
              {captchaText}
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-blue-600 hover:text-blue-800 text-lg p-1 rounded-full"
              title="Refresh Captcha"
            >
              <FiRefreshCcw />
            </button>
          </div>
          <input
            type="text"
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
            placeholder="Enter Captcha"
            className="w-full mb-6 px-4 py-2 border rounded text-xs bg-white text-gray-800 placeholder-gray-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-1.5 text-sm rounded-full hover:bg-blue-700 transition font-semibold shadow w-full mb-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}