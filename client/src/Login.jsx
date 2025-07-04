import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
    <div className="flex items-center justify-center min-h-screen pt-24 bg-gray-100">
      <div className="bg-white shadow-lg rounded-md w-full max-w-md mb-16">
        <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t-md">
          <h2 className="text-xl font-semibold">Login to Your Profile</h2>
        </div>

        <form className="w-full px-6 py-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold mb-1">E-Mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-Mail"
            className="w-full mb-4 px-4 py-2 border rounded text-xs"
            required
          />

          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border rounded text-xs"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-1.5 text-sm rounded-full hover:bg-blue-700 transition font-semibold shadow w-full mb-4"
          >
            Login
          </button>

          {/* Link untuk pengguna baru */}
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