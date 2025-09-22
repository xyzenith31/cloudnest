import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // <-- [BARU] Import loading spinner

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // <-- [DIUBAH] Ambil state loading

  // [BARU] Jika masih dalam proses pengecekan, tampilkan loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  // Setelah loading selesai, baru lakukan pengecekan user
  if (!user) {
    // Jika tidak ada user, tendang ke halaman login
    return <Navigate to="/" replace />;
  }

  // Jika ada role yang diizinkan dan role user tidak termasuk di dalamnya
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Tendang ke halaman yang sesuai
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/beranda'} replace />;
  }
  
  // Jika lolos, tampilkan halaman yang dituju
  return <Outlet />;
};

export default ProtectedRoute;