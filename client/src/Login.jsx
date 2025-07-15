import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [captchaSVG, setCaptchaSVG] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  // Ambil captcha dari backend
  const fetchCaptcha = async () => {
    try {
      const res = await fetch('http://localhost:4000/captcha', {
        credentials: 'include', // penting untuk session
      });
      const svg = await res.text();
      setCaptchaSVG(svg);
    } catch (err) {
      console.error('❌ Gagal ambil captcha:', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validasi captcha dulu ke backend
      const verify = await fetch('http://localhost:4000/verify-captcha', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captcha: userCaptcha }),
      });

      const verifyResult = await verify.json();
      if (!verify.ok) {
        alert(verifyResult.error || 'Captcha salah');
        fetchCaptcha();
        return;
      }

      // Jika captcha valid, lanjut login
      const res = await fetch(`http://localhost:4000/profile?email=${formData.email}`);
      const user = await res.json();

      if (res.ok) {
        if (user.password === formData.password) {
          localStorage.setItem('userEmail', formData.email);
          navigate('/profile');
        } else {
          alert('Password salah.');
        }
      } else {
        alert(user.error || 'User tidak ditemukan');
      }
    } catch (error) {
      console.error('❌ Gagal login:', error);
      alert('Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex items-center justify-center pt-24">
      <div className="w-full max-w-md bg-white text-gray-800 rounded shadow-md mb-16">
        <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t-md">
          <h2 className="text-xl font-semibold">Login to Your Profile</h2>
        </div>

        <form className="w-full px-6 py-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold mb-1 text-gray-700">E-Mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-Mail"
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

          {/* Captcha */}
          <label className="block text-sm font-semibold mb-1 text-gray-700">Captcha</label>
          <div className="flex items-center space-x-2 mb-3">
            <div dangerouslySetInnerHTML={{ __html: captchaSVG }} />
            <button
              type="button"
              onClick={fetchCaptcha}
              className="text-blue-600 hover:text-blue-800 text-sm"
              title="Refresh Captcha"
            >
              🔄
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
            className="bg-blue-600 text-white px-6 py-1.5 text-sm rounded-full hover:bg-blue-700 transition font-semibold shadow w-full mb-4"
          >
            Login
          </button>

          <Link
            to="/profile"
            className="block text-center text-sm text-blue-600 hover:underline font-medium"
          >
            Don’t have a profile? Complete it here
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;