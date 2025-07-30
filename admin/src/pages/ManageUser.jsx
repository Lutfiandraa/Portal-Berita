import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaChartBar } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('❌ Akses ditolak. Silakan login sebagai admin terlebih dahulu.');
      navigate('/admin/login');
      return;
    }

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
        setFilteredUsers(formatted);
      })
      .catch(err => {
        console.error('❌ Gagal ambil data user:', err);
        alert('Gagal mengambil data user dari server.');
      });
  }, [navigate]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleStatusChange = async (id, newStatus) => {
    const endpoint =
      newStatus === 'Online'
        ? `http://localhost:4000/api/users/${id}/activate`
        : `http://localhost:4000/api/users/${id}/deactivate`;

    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Gagal update status');

      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      setOpenDropdownId(null);
    } catch (err) {
      console.error('❌ Gagal ubah status:', err);
      alert('Gagal mengubah status user.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    alert('✅ Logout berhasil');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside className="fixed top-6 left-6 z-50 w-60 bg-[#0E1E32] text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between h-[90vh]">
        <div>
          <div
            className="text-white font-semibold text-lg mb-6 cursor-pointer flex items-center gap-2 hover:text-purple-300"
            onClick={() => navigate('/admin/dashboard')}
          >
            <FaChartBar /> Dashboard
          </div>
          <nav className="space-y-4 text-gray-300">
            <div className="hover:text-white cursor-pointer flex items-center gap-2 font-semibold">
              <FaUser /> Users
            </div>
            <div
              className="hover:text-white cursor-pointer flex items-center gap-2"
              onClick={() => navigate('/admin/manage-critics')}
            >
              <FaComments /> Critic’s
            </div>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 bg-gray-50 p-10 rounded-tr-3xl">
        <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Name or Email"
            className="w-1/3 px-4 py-2 rounded-full border focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredUsers.map(user => (
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
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium ${
                              user.status === 'Online' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {user.status === 'Online' ? 'Deactivate' : 'Activate'}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
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