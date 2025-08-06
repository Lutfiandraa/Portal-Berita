import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiRefreshCcw } from 'react-icons/fi';
import logo from '../assets/logo.png'; // ✅ Perbaikan path logo

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  const fetchCaptcha = async () => {
    try {
      const res = await fetch('http://localhost:4000/captcha', {
        credentials: 'include',
      });
      const svg = await res.text();
      setCaptchaSvg(svg);
    } catch (err) {
      console.error('❌ Gagal fetch captcha:', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();

    const adminEmail = localStorage.getItem('adminEmail');
    if (adminEmail) navigate('/admin/dashboard');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      alert('❌ Email dan Password tidak boleh kosong.');
      return;
    }

    try {
      const captchaRes = await fetch('http://localhost:4000/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ captcha: userCaptcha }),
      });

      if (!captchaRes.ok) {
        alert('❌ Captcha salah.');
        fetchCaptcha();
        return;
      }

      const loginRes = await fetch('http://localhost:4000/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const errMsg = await loginRes.json();
        alert(`❌ ${errMsg.message}`);
        return;
      }

      const result = await loginRes.json();
      localStorage.setItem('adminEmail', result.admin.email);
      alert('✅ Login berhasil');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('❌ Error saat login admin:', err);
      alert('❌ Terjadi kesalahan server.');
    }
  };

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex items-center justify-center pt-24">
      <div className="w-full max-w-md bg-white text-gray-800 rounded shadow-md mb-16">
        <div className="bg-[#0E1E32] text-white flex items-center justify-center gap-3 py-4 rounded-t-md">
          <img src={logo} alt="Logo" className="h-8 w-8" />
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

          <label className="block text-sm font-semibold mb-1 text-gray-700">Captcha</label>
          <div className="flex items-center space-x-2 mb-3">
            <div
              className="bg-gray-100 rounded overflow-hidden border"
              dangerouslySetInnerHTML={{ __html: captchaSvg }}
            />
            <button
              type="button"
              onClick={fetchCaptcha}
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