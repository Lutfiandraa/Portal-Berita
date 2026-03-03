import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('Access denied. Please sign in as administrator first.');
      navigate('/admin/login');
      return;
    }

    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(user => ({
          id: user.userid,
          email: user.email || '-',
          name: user.name || '-',
          status: user.status === 'aktif' ? 'Online' : 'Offline',
          lastActive: user.last_active ? new Date(user.last_active).toLocaleString() : '-'
        }));
        setUsers(formatted);
        setFilteredUsers(formatted);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        alert('Failed to fetch users from server.');
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

      if (!res.ok) throw new Error('Failed to update status');

      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      setOpenDropdownId(null);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update user status.');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:4000/api/users/${userToDelete}/delete`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete user');

      // Remove deleted user from the list
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteModalOpen(false);
      alert('User deleted successfully');
    } catch (err) {
console.error('Failed to delete user:', err);
        alert('Failed to delete user');
    }
  };

  return (
    <AdminLayout title="Manage Users" breadcrumbLabel="Users">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Name or Email"
          className="w-full max-w-md px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase">
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
              <tr key={user.id} className="border-t border-gray-100 text-sm hover:bg-gray-50">
                <td className="p-4 text-gray-700">{user.id}</td>
                <td className="p-4 font-medium text-gray-800">{user.email}</td>
                <td className="p-4 text-gray-700">{user.name}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                      user.status === 'Online' ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{user.lastActive}</td>
                <td className="p-4">
                  <div className="relative w-[110px]">
                    <button
                      onClick={() => toggleDropdown(user.id)}
                      className="border border-gray-300 bg-white text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-50 w-full flex items-center justify-between"
                    >
                      Action <FiChevronDown />
                    </button>
                    {openDropdownId === user.id && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg right-0">
                        <div
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              user.status === 'Online' ? 'Offline' : 'Online'
                            )
                          }
                          className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium ${
                            user.status === 'Online' ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {user.status === 'Online' ? 'Deactivate' : 'Activate'}
                        </div>
                        <div
                          onClick={() => {
                            setUserToDelete(user.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium text-rose-600"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl text-center max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete This User?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteUser}
                className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-500"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
