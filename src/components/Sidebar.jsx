import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout, FiUsers, FiFolder, FiMessageSquare,
  FiActivity, FiHelpCircle, FiLogOut, FiChevronLeft, FiChevronRight
} from 'react-icons/lib/fi'; // Jalur impor diperbaiki
import { FaCloud } from 'react-icons/lib/fa'; // Jalur impor diperbaiki

// Komponen untuk setiap item di sidebar
const SidebarItem = ({ icon: Icon, text, to, isExpanded }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-300
         ${isActive
          ? 'bg-blue-500 text-white shadow-lg scale-105'
          : 'text-sky-900 hover:bg-sky-100 hover:shadow-inner'
        }`
      }
    >
      <Icon className="text-2xl flex-shrink-0" />
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="ml-4 font-semibold whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

// Komponen profil pengguna yang lebih simpel
const UserProfile = ({ name, role, isExpanded }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="flex items-center p-2 rounded-lg transition-colors duration-300 hover:bg-slate-200/50">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {initials}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="ml-3 overflow-hidden"
          >
            <p className="font-semibold text-sm text-sky-900 whitespace-nowrap">{name}</p>
            <p className="text-xs text-gray-500 whitespace-nowrap">{role}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { icon: FiLayout, text: 'Dashboard', to: '/admin/dashboard' },
    { icon: FiUsers, text: 'Manajemen Pengguna', to: '/admin/manage-users' },
    { icon: FiFolder, text: 'Manajemen File', to: '/admin/manage-files' },
    { icon: FiMessageSquare, text: 'Komunitas', to: '/admin/community' },
    { icon: FiActivity, text: 'Aktivitas Log', to: '/admin/logs' },
    { icon: FiHelpCircle, text: 'Bantuan', to: '/admin/help' },
  ];
  
  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '88px' },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-gradient-to-b from-white to-slate-50 h-screen flex flex-col p-4 border-r border-gray-200/80 shadow-2xl relative"
    >
      {/* [NEW] Efek cahaya pemisah */}
      <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-sky-300 via-blue-500 to-purple-500 shadow-[0_0_10px_#60a5fa] opacity-70 animate-pulse"></div>

      {/* Tombol Minimize/Maximize dengan efek baru */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4 top-10 bg-white border-2 border-blue-500 text-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-500 hover:text-white hover:scale-110 transition-all duration-300 z-10"
      >
        {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
      </button>

      {/* Logo dengan ikon animasi */}
      <div className="flex items-center mb-8 p-3">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaCloud className="text-4xl text-blue-500" />
        </motion.div>
        <AnimatePresence>
        {isExpanded && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-700 whitespace-nowrap"
            >
              CloudNest
            </motion.h1>
        )}
        </AnimatePresence>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-grow">
        {menuItems.map((item) => (
          <SidebarItem key={item.text} {...item} isExpanded={isExpanded} />
        ))}
      </nav>

      {/* Profile dan Logout dengan area terpisah */}
      <div className="mt-auto pt-4 border-t border-gray-200/80">
        <UserProfile name="Admin" role="Admin Role" isExpanded={isExpanded} />
        <NavLink
            to="/"
            className="flex items-center p-3 mt-1 rounded-lg cursor-pointer text-red-600 hover:bg-red-100 transition-colors duration-300"
        >
            <FiLogOut className="text-2xl flex-shrink-0" />
            <AnimatePresence>
                {isExpanded && (
                <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="ml-4 font-semibold whitespace-nowrap"
                >
                    Logout
                </motion.span>
                )}
            </AnimatePresence>
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;