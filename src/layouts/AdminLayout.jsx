import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { ToggleButton } from '../components/Sidebar';

// --- Komponen Layout Utama untuk Halaman Admin ---
const AdminLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Wrapper ini penting untuk posisi tombol */}
      <div className="relative">
        <Sidebar isExpanded={isSidebarExpanded} />
        <ToggleButton 
          isExpanded={isSidebarExpanded} 
          onClick={() => setSidebarExpanded(!isSidebarExpanded)} 
        />
      </div>

      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;