import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { ToggleButton } from '../components/Sidebar';
import './AdminLayout.css'; // Kita akan buat file CSS ini

const AdminLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="admin-layout">
      <Sidebar isExpanded={isExpanded} />
      <ToggleButton isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;