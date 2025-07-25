import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaUser, FaComments, FaChartBar } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('❌ Akses ditolak. Silakan login sebagai admin terlebih dahulu.');
      navigate('/admin/login');
      return;
    }

    // ✅ Fetch data dari backend
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(user => ({
          id: user.userid,
          email: user.email,
          name: user.name,
          status: user.status === 'aktif' ? 'Online' : 'Offline',
          lastActive: new Date(user.last_active).toLocaleString()
        }));
        setUsers(formatted);
      })
      .catch(err => {
        console.error('❌ Gagal ambil data user:', err);
        alert('Gagal mengambil data user dari server.');
      });
  }, [navigate]);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setOpenDropdownId(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    }
  };

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
            <div className="hover:text-purple-600 cursor-pointer font-semibold flex items-center gap-2">
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

      <main className="flex-1 bg-gray-50 p-10 rounded-tr-3xl">
        <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Name"
            className="w-1/3 px-4 py-2 rounded-full border focus:outline-none"
          />
        </div>

        <div className="overflow-auto rounded-lg shadow bg-white">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                <th className="p-4">User ID</th>
                <th className="p-4">By E-Mail</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t text-sm hover:bg-gray-50">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4 font-semibold">{user.email}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                        user.status === 'Online' ? 'bg-green-400' : 'bg-red-500'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">{user.lastActive}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 relative">
                      <div className="relative w-[110px]">
                        <button
                          onClick={() => toggleDropdown(user.id)}
                          className="border border-blue-500 text-blue-600 px-3 py-1 text-sm rounded-md hover:bg-blue-50 w-full flex items-center justify-between"
                        >
                          Action <FiChevronDown />
                        </button>
                        {openDropdownId === user.id && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-md border rounded-md right-0">
                            <div
                              onClick={() =>
                                handleStatusChange(
                                  user.id,
                                  user.status === 'Online' ? 'Offline' : 'Online'
                                )
                              }
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {user.status === 'Online' ? 'Deactivate' : 'Activate'}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No users found.
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