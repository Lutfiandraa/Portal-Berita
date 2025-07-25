import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaUser, FaComments } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    alert('✅ Logout berhasil');
    navigate('/admin/login');
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/user-stats')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          bulan: item.bulan,
          jumlah_user: Number(item.jumlah_user)
        }));
        setChartData(formatted);
      })
      .catch(err => console.error('Gagal ambil data chart:', err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-1/6 bg-white p-6 border-r flex flex-col justify-between">
        <div>
          <div
            className="text-purple-700 font-semibold text-lg mb-6 cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/admin/dashboard')}
          >
            <FaChartBar /> Dashboard
          </div>
          <nav className="space-y-4 text-gray-700">
            <div
              className="hover:text-purple-600 cursor-pointer flex items-center gap-2"
              onClick={() => navigate('/admin/manage-user')}
            >
              <FaUser /> Users
            </div>
            <div
              className="hover:text-purple-600 cursor-pointer flex items-center gap-2"
              onClick={() => navigate('/admin/manage-critics')}
            >
              <FaComments /> Critic’s
            </div>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-10"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-50 p-10 rounded-tr-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang di Dashboard Admin</h1>
        <p className="text-gray-600 mb-8">
          Gunakan panel di sebelah kiri untuk mengelola data pengguna dan kritik pengguna.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Grafik Pendaftaran Pengguna</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="jumlah_user" stroke="#7e22ce" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}