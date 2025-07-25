// src/pages/ManageCritic.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaChartBar, FaUser, FaComments } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

const dummyCritics = [
  {
    id: 1,
    email: 'john@example.com',
    message: 'Aplikasi sangat membantu. Terima kasih!',
    last_active: 'July 10, 2025',
  },
  {
    id: 2,
    email: 'alice@example.com',
    message: 'Tampilan kurang responsif di HP.',
    last_active: 'July 21, 2025',
  },
];

export default function ManageCritic() {
  const navigate = useNavigate();
  const [critics, setCritics] = useState(dummyCritics);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('❌ Akses ditolak. Silakan login sebagai admin terlebih dahulu.');
      navigate('/admin/login');
    }
  }, [navigate]);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const deleteCritic = (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus kritik ini?');
    if (confirmDelete) {
      setCritics((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/6 bg-white p-6 border-r flex flex-col justify-between">
        <div>
          <div
            onClick={() => navigate('/admin/dashboard')}
            className="text-purple-700 font-semibold text-lg mb-6 cursor-pointer hover:text-purple-600 flex items-center gap-2"
          >
            <FaChartBar /> Dashboard
          </div>
          <nav className="space-y-4 text-gray-700">
            <div
              onClick={() => navigate('/admin/manage-user')}
              className="hover:text-purple-600 cursor-pointer flex items-center gap-2"
            >
              <FaUser /> Users
            </div>
            <div className="hover:text-purple-600 cursor-pointer font-semibold flex items-center gap-2">
              <FaComments /> Critic’s
            </div>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('adminEmail');
            alert('✅ Logout berhasil');
            navigate('/admin/login');
          }}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-10"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-10 rounded-tr-3xl">
        <h2 className="text-2xl font-semibold mb-6">Manage Critics</h2>

        <div className="overflow-auto rounded-lg shadow bg-white">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                <th className="p-4">ID</th>
                <th className="p-4">By E-Mail</th>
                <th className="p-4">Critic's</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {critics.map((critic) => (
                <tr key={critic.id} className="border-t text-sm hover:bg-gray-50 relative">
                  <td className="p-4">{critic.id}</td>
                  <td className="p-4 font-semibold">{critic.email}</td>
                  <td className="p-4">{critic.message || '-'}</td>
                  <td className="p-4">{critic.last_active || 'N/A'}</td>
                  <td className="p-4 relative">
                    <div className="relative inline-block w-full">
                      <button
                        onClick={() => toggleDropdown(critic.id)}
                        className="w-full border border-blue-500 text-blue-600 px-3 py-1 text-sm rounded-md hover:bg-blue-50 flex items-center justify-between"
                      >
                        Action <FiChevronDown />
                      </button>

                      {openDropdownId === critic.id && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-md border rounded-md">
                          <div
                            onClick={() => deleteCritic(critic.id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2 text-red-500"
                          >
                            <FaTrashAlt className="text-sm" /> Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {critics.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No critics found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}