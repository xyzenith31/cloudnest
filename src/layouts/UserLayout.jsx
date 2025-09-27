import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const UserLayout = () => {
  const location = useLocation();

  return (
    // [PERBAIKAN] Mengembalikan struktur layout utama agar tidak merusak halaman lain
    <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
      <Navbar />
      {/* [PERBAIKAN KUNCI] `overflow-y-auto` dikembalikan agar halaman lain bisa scroll.
          Halaman MyFilesPage akan menimpa perilaku ini secara internal. */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
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