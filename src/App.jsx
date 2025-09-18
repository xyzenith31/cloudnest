import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserDashboard from './pages/users/UserDashboard.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Placeholder components for other admin pages
const ManageUsers = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen Pengguna</h1></div>;
const ManageFiles = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen File</h1></div>;
const Community = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Komunitas</h1></div>;
const Logs = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Aktivitas Log</h1></div>;
const Help = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Bantuan</h1></div>;


function App() {
  return (
    <Routes>
      {/* Rute untuk otentikasi (tanpa sidebar) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Grup rute yang menggunakan AdminLayout (dengan sidebar) */}
      <Route element={<AdminLayout />}>
        {/* Rute untuk Pengguna Biasa */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* Rute Khusus untuk Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-files" element={<ManageFiles />} />
        <Route path="/admin/community" element={<Community />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/help" element={<Help />} />
      </Route>
    </Routes>
  );
}

export default App;