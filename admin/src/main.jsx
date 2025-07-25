import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginAdmin from './pages/LoginAdmin_temp';
import Dashboard from './pages/Dashboard';
import ManageUser from './pages/ManageUser';
import ManageCritic from './pages/ManageCritic';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        
        {/* Halaman utama setelah login */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/manage-user" element={<ManageUser />} />
        <Route path="/admin/manage-critics" element={<ManageCritic />} />
      </Routes>
    </Router>
  );
}

export default App;