import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Auth Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// User Pages
import UserBeranda from './pages/users/UserBeranda.jsx';

// Admin Pages
import AdminBeranda from './pages/admin/AdminDashboard.jsx';

// Placeholder components for other pages (biarkan saja untuk halaman lain)
const ManageUsers = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen Pengguna</h1></div>;
const ManageFiles = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen File</h1></div>;
// ...dan placeholder lainnya...

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* User Routes */}
      <Route element={<UserLayout />}>
        {/* Mengarahkan /beranda ke komponen UserBeranda yang baru */}
        <Route path="/beranda" element={<UserBeranda />} /> 
        
        {/* Anda bisa menambahkan rute lain di sini nanti */}
        {/* <Route path="/my-files" element={<MyFilesPage />} /> */}
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
         {/* Mengarahkan /admin/beranda ke komponen AdminBeranda yang baru */}
        <Route path="/admin/dashboard" element={<AdminBeranda />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-files" element={<ManageFiles />} />
        {/* ...rute admin lainnya... */}
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;