import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Jika tidak ada user, tendang ke halaman login
    return <Navigate to="/" replace />;
  }

  // Jika ada role yang diizinkan dan role user tidak termasuk di dalamnya
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Tendang ke halaman yang sesuai (misal: user ke beranda, admin ke dashboard)
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/beranda'} replace />;
  }
  
  // Jika lolos, tampilkan halaman yang dituju
  return <Outlet />;
};

export default ProtectedRoute;