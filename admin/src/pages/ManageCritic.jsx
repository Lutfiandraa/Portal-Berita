import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { API_BASE } from '../utils/api';
import { useSearch } from '../utils/SearchContext';

export default function ManageCritic() {
  const navigate = useNavigate();
  const [critics, setCritics] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const globalSearch = useSearch();

  const filteredCritics = globalSearch
    ? critics.filter(c =>
        (c.email || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
        (c.message || '').toLowerCase().includes(globalSearch.toLowerCase())
      )
    : critics;

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('Access denied. Please sign in as administrator first.');
      navigate('/admin/login');
      return;
    }

    const fetchCritics = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/critics`, { credentials: 'include' });
        const data = await res.json();

        if (Array.isArray(data)) {
          setCritics(data);
        } else {
          setCritics([]);
        }
      } catch (error) {
        console.error('Failed to fetch critics:', error);
        setCritics([]);
      }
    };

    fetchCritics();
  }, [navigate]);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const deleteCritic = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/critics/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Feedback deleted successfully');
        setCritics((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('An error occurred whilst deleting');
    }
  };

  return (
    <AdminLayout title="Manage Feedback" breadcrumbLabel="Feedback">
      <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase">
              <th className="p-4">ID</th>
              <th className="p-4">By E-Mail</th>
              <th className="p-4">Feedback</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCritics.map((critic) => (
              <tr key={critic.id} className="border-t border-gray-100 text-sm hover:bg-gray-50">
                <td className="p-4 text-gray-700">{critic.id}</td>
                <td className="p-4 font-medium text-gray-800">{critic.email}</td>
                <td className="p-4 text-gray-700">{critic.message || '-'}</td>
                <td className="p-4 text-gray-500">{critic.last_active || 'N/A'}</td>
                <td className="p-4 relative">
                  <div className="relative inline-block w-full">
                    <button
                      onClick={() => toggleDropdown(critic.id)}
                      className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-between"
                    >
                      Action <FiChevronDown />
                    </button>
                    {openDropdownId === critic.id && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div
                          onClick={() => deleteCritic(critic.id)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2 text-rose-600"
                        >
                          <FaTrashAlt className="w-4 h-4" /> Delete
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredCritics.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
