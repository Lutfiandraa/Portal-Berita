import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaChartBar, FaUser, FaComments } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

export default function ManageCritic() {
  const navigate = useNavigate();
  const [critics, setCritics] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('❌ Akses ditolak. Silakan login sebagai admin terlebih dahulu.');
      navigate('/admin/login');
      return;
    }

    const fetchCritics = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/critics');
        const data = await res.json();

        if (Array.isArray(data)) {
          setCritics(data);
        } else {
          console.error('❌ Respon bukan array:', data);
          setCritics([]);
        }
      } catch (error) {
        console.error('❌ Gagal ambil data kritik:', error);
        setCritics([]);
      }
    };

    fetchCritics();
  }, [navigate]);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // ✅ Fungsi deleteCritic diperbarui agar kirim request DELETE ke backend
  const deleteCritic = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus kritik ini?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:4000/api/critics/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('✅ Kritik berhasil dihapus');
        setCritics((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('❌ Gagal menghapus kritik');
      }
    } catch (error) {
      console.error('❌ Error saat menghapus kritik:', error);
      alert('❌ Terjadi kesalahan saat menghapus');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Floating Sidebar */}
      <aside className="fixed top-6 left-6 z-50 w-60 bg-[#0E1E32] text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between h-[90vh]">
        <div>
          <div
            onClick={() => navigate('/admin/dashboard')}
            className="text-white font-semibold text-lg mb-6 cursor-pointer flex items-center gap-2 hover:text-purple-300"
          >
            <FaChartBar /> Dashboard
          </div>
          <nav className="space-y-4 text-gray-300">
            <div
              onClick={() => navigate('/admin/manage-user')}
              className="hover:text-white cursor-pointer flex items-center gap-2"
            >
              <FaUser /> Users
            </div>
            <div className="hover:text-white cursor-pointer flex items-center gap-2">
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
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-72 flex-1 bg-gray-50 p-10 rounded-tr-3xl">
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