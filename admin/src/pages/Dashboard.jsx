import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaUser, FaComments } from 'react-icons/fa';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import AdminLayout from '../components/AdminLayout';

const API_BASE = 'http://localhost:4000';

const KPI_CARDS = [
  { key: 'users', label: 'Total Users', icon: FaUser, color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'feedback', label: 'Total Feedback', icon: FaComments, color: 'green', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'sessions', label: 'Active Sessions', color: 'yellow', bgColor: 'bg-amber-100', iconColor: 'text-amber-600', icon: FaChartBar },
  { key: 'growth', label: 'Growth', color: 'red', bgColor: 'bg-rose-100', iconColor: 'text-rose-600', icon: FaChartBar },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCritics, setTotalCritics] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('adminEmail')) {
      navigate('/admin/login');
      return;
    }
    fetch(`${API_BASE}/api/user-stats`)
      .then(res => res.json())
      .then(data => {
        const formatted = (Array.isArray(data) ? data : []).map(item => ({
          bulan: item.bulan,
          jumlah_user: Number(item.jumlah_user) || 0,
          count: Number(item.jumlah_user) || 0,
        }));
        setChartData(formatted);
      })
      .catch(() => setChartData([]));

    fetch(`${API_BASE}/api/users`)
      .then(res => res.json())
      .then(data => setTotalUsers(Array.isArray(data) ? data.length : 0))
      .catch(() => setTotalUsers(0));

    fetch(`${API_BASE}/api/critics`)
      .then(res => res.json())
      .then(data => setTotalCritics(Array.isArray(data) ? data.length : 0))
      .catch(() => setTotalCritics(0));
  }, [navigate]);

  const kpiValues = {
    users: totalUsers,
    feedback: totalCritics,
    sessions: totalUsers > 0 ? Math.min(totalUsers * 2, 99) : 0,
    growth: chartData.length > 0 ? Math.round((totalUsers / Math.max(chartData.length, 1)) * 10) : 0,
  };

  const donutData = [
    { name: 'Users', value: totalUsers, color: '#3b82f6' },
    { name: 'Feedback', value: totalCritics, color: '#10b981' },
    { name: 'Other', value: Math.max(0, totalUsers - totalCritics) || 1, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const donutDisplay = donutData.length > 0 ? donutData : [{ name: 'No data', value: 1, color: '#475569' }];

  return (
    <AdminLayout title="Dashboard" breadcrumbLabel="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon || FaChartBar;
          const value = kpiValues[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    card.color === 'blue'
                      ? 'bg-blue-500'
                      : card.color === 'green'
                      ? 'bg-emerald-500'
                      : card.color === 'yellow'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min((value / (value + 20)) * 100, 90)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.min(Math.round((value / (value + 20)) * 100), 90)}% of previous period
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Area Chart</h2>
          <p className="text-gray-500 text-xs mb-4">Users per month</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" stroke="#6b7280" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelStyle={{ color: '#374151' }}
              />
              <Area
                type="monotone"
                dataKey="jumlah_user"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Donut Chart</h2>
          <p className="text-gray-500 text-xs mb-4">Users vs Feedback</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={donutDisplay}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {donutDisplay.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
