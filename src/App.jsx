import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserBeranda from './pages/users/UserBeranda.jsx';
import MyFilesPage from './pages/users/MyFilesPage.jsx';
import UploadPage from './pages/users/UploadFile.jsx';
import ProfileUser from './pages/users/ProfileUser.jsx';
import AdminBeranda from './pages/admin/AdminDashboard.jsx';
import ManajemenPengguna from './pages/admin/ManajemenPengguna.jsx';
import ProfileAdmin from './pages/admin/ProfileAdmin.jsx';
import QuickUploadPopup from './components/QuickUploadPopup.jsx';
import KomunitasPage from './pages/users/KomunitasPage.jsx'; // <-- IMPORT BARU

// Placeholder components
const ManageFiles = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Manajemen File</h1></div>;
const LogsPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Log Aktivitas</h1></div>;
const HelpPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Bantuan</h1></div>;
const HistoryPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Halaman Riwayat Aktivitas</h1></div>;

function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/beranda" element={<UserLayout />}>
            <Route index element={<UserBeranda />} />
            <Route path="my-files" element={<MyFilesPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="community" element={<KomunitasPage />} /> {/* <-- MODIFIKASI */}
            <Route path="history" element={<HistoryPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfileUser />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminBeranda />} />
            <Route path="manage-users" element={<ManajemenPengguna />} />
            <Route path="manage-files" element={<ManageFiles />} />
            <Route path="community" element={<KomunitasPage />} /> {/* <-- MODIFIKASI */}
            <Route path="logs" element={<LogsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfileAdmin />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <QuickUploadPopup />
    </>
  );
}

export default App;