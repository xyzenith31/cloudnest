import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/users/UserDashboard';
import DashboardLayout from './layouts/AdminLayout'; // Import layout baru

function App() {
  return (
    <Routes>
      {/* Rute tanpa sidebar */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Grup rute dengan sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Tambahkan rute lain yang memerlukan sidebar di sini */}
        {/* Contoh:
          <Route path="/manage-users" element={<ManajemenPenggunaPage />} />
          <Route path="/manage-files" element={<ManajemenFilePage />} /> 
        */}
      </Route>
    </Routes>
  );
}

export default App;