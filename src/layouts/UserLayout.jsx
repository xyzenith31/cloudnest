import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const UserLayout = () => {
  const location = useLocation();

  return (
    // [DIPERBAIKI] Layout diubah menjadi flex-col setinggi layar (h-screen)
    // dan overflow-hidden untuk mencegah scrollbar di body utama.
    <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
      <Navbar />
      {/* [DIPERBAIKI] Area <main> sekarang menjadi fleksibel (flex-1) 
          dan akan memiliki scrollbar sendiri (overflow-y-auto) jika kontennya panjang. */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
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