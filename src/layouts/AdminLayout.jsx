import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        {/* Konten halaman akan dirender di sini dan hanya area ini yang akan scroll */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;