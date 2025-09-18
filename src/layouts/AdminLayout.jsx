import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8">
        {/* Konten halaman akan dirender di sini */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;