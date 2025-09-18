import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserDashboard from './pages/users/UserDashboard.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx'; 

// Placeholder components for other admin pages
const ManageUsers = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen Pengguna</h1></div>;
const ManageFiles = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen File</h1></div>;
const Community = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Komunitas</h1></div>;
const Logs = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Aktivitas Log</h1></div>;
const Help = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Bantuan</h1></div>;

// Placeholder components for user pages
const BerandaPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Beranda</h1></div>;
const MyFilesPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman File Saya</h1></div>;
const UploadFilePage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Upload File</h1></div>;
const UserCommunityPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Komunitas Pengguna</h1></div>;
const UserHelpPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Bantuan Pengguna</h1></div>;
const UserProfilePage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Profil Pengguna</h1></div>;


function App() {
  return (
    <Routes>
      {/* Rute untuk otentikasi (tanpa layout) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Grup rute untuk Pengguna Biasa menggunakan UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/beranda" element={<BerandaPage />} />
        <Route path="/my-files" element={<MyFilesPage />} />
        <Route path="/upload" element={<UploadFilePage />} />
        <Route path="/community" element={<UserCommunityPage />} />
        <Route path="/help" element={<UserHelpPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Route>

      {/* Grup rute Khusus untuk Admin menggunakan AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-files" element={<ManageFiles />} />
        <Route path="/admin/community" element={<Community />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/help" element={<Help />} />
      </Route>

      {/* Redirect jika halaman tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;