// Ganti nilai ini sesuai environment
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Wrapper fetch yang selalu include credentials dan header JSON
export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
};
