import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout, FiUsers, FiFolder, FiMessageSquare,
  FiActivity, FiHelpCircle, FiLogOut, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { FaCloud } from 'react-icons/fa';

// Komponen untuk setiap item di sidebar
const SidebarItem = ({ icon: Icon, text, to, isExpanded }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-300
         ${isActive
          ? 'bg-blue-500 text-white shadow-lg'
          : 'text-sky-900 hover:bg-sky-100'
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

// Komponen untuk profil pengguna
const UserProfile = ({ name, isExpanded }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="flex items-center p-3 rounded-lg bg-sky-50 border border-sky-200">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
        {initials}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="ml-4 overflow-hidden"
          >
            <p className="font-bold text-sky-900 whitespace-nowrap">{name}</p>
            <p className="text-sm text-gray-500 whitespace-nowrap">User Role</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { icon: FiLayout, text: 'Dashboard', to: '/dashboard' },
    { icon: FiUsers, text: 'Manajemen Pengguna', to: '/manage-users' },
    { icon: FiFolder, text: 'Manajemen File', to: '/manage-files' },
    { icon: FiMessageSquare, text: 'Komunitas', to: '/community' },
    { icon: FiActivity, text: 'Aktivitas Log', to: '/logs' },
    { icon: FiHelpCircle, text: 'Bantuan', to: '/help' },
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
      className="bg-white h-screen flex flex-col p-4 border-r border-gray-200 shadow-lg relative"
    >
      {/* Tombol Minimize/Maximize */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4 top-10 bg-white border-2 border-blue-500 text-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300 z-10"
      >
        {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
      </button>

      {/* Logo */}
      <div className="flex items-center mb-8 p-3">
        <FaCloud className="text-4xl text-blue-500" />
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

      {/* Profile dan Logout */}
      <div className="mt-auto">
        <UserProfile name="Donny Indra" isExpanded={isExpanded} />
        <NavLink
            to="/logout"
            className="flex items-center p-3 mt-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-100 transition-colors duration-300"
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