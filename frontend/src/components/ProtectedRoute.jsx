import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkSession } from '../utils/security';
import { API_BASE } from '../utils/api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    checkSession(API_BASE).then(ok => setStatus(ok ? 'ok' : 'denied'));
  }, []);

  if (status === 'checking') return null; // tidak tampilkan apapun saat cek
  if (status === 'denied') return <Navigate to="/login" replace />;
  return children;
}
