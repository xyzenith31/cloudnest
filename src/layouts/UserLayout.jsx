import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // -> Diubah dari UserNavbar ke Navbar

const UserLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar /> {/* -> Diubah dari UserNavbar ke Navbar */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;