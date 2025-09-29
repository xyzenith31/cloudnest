import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const UserLayout = () => {
  const location = useLocation();

  // --- [LOGIKA KUNCI] ---
  // Cek apakah path URL saat ini adalah halaman komunitas
  const isCommunityPage = location.pathname === '/beranda/community';

  // Tentukan kelas CSS secara kondisional berdasarkan halaman yang aktif
  const mainContainerClasses = isCommunityPage
    ? "flex-1 overflow-hidden" // Gaya khusus untuk halaman komunitas (tanpa padding, tanpa scroll)
    : "flex-1 overflow-y-auto p-4 md:p-8"; // Gaya default untuk halaman lainnya

  const motionDivClasses = isCommunityPage ? "h-full" : ""; // Tambahkan h-full hanya untuk komunitas

  return (
    <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Container <main> sekarang menggunakan kelas dinamis */}
      <main className={mainContainerClasses}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className={motionDivClasses} // Div ini juga menggunakan kelas dinamis
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserLayout;