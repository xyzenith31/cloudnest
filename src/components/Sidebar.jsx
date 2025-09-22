import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout, FiUsers, FiFolder, FiMessageSquare, FiActivity,
  FiHelpCircle, FiLogOut, FiChevronLeft, FiChevronRight,
  FiClock, FiWifi, FiWifiOff, FiUser
} from 'react-icons/fi';
import { FaCloud } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { getUserById } from '../services/userService';

const socket = io("http://localhost:3001");

// ... (Komponen ToggleButton, DottedBackground, SidebarItem, UserProfileActions tetap sama) ...
export const ToggleButton = ({ isExpanded, onClick }) => (
    <motion.button
      onClick={onClick}
      className="absolute top-8 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 z-50 shadow-lg hover:shadow-blue-300"
      animate={{
        left: isExpanded ? '266px' : '74px',
        rotate: isExpanded ? 360 : 0,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? 'left' : 'right'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
  
const DottedBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/90" />
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 2.5 + 1.5;
        const duration = Math.random() * 7 + 5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/60"
            style={{
              width: size, height: size,
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 50 - 25, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.5, 1],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 7 }}
          />
        );
      })}
    </div>
  );

const SidebarItem = ({ icon: Icon, text, to, isExpanded, variants }) => (
    <motion.div variants={variants}>
      <NavLink to={to} className="relative group">
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div
                layoutId="active-sidebar-item"
                className="absolute inset-0 bg-blue-500 rounded-lg shadow-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            <div className={`relative flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 z-10 ${isActive ? 'text-white' : 'text-sky-900 group-hover:bg-sky-100/70'}`}>
              <motion.div animate={{ filter: isActive ? 'drop-shadow(0 0 5px #fff)' : 'none' }}>
                <Icon className="text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              </motion.div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="ml-4 font-semibold whitespace-nowrap"
                  >
                    {text}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </NavLink>
    </motion.div>
);

const UserProfileActions = ({ user, isExpanded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/');
    };
    
    const getInitials = (name) => {
      if (!name || typeof name !== 'string') return '?';
      const nameParts = name.trim().split(' ').filter(Boolean);
      if (nameParts.length === 0) return '?';
      if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
      const firstInitial = nameParts[0][0];
      const lastInitial = nameParts[nameParts.length - 1][0];
      return `${firstInitial}${lastInitial}`.toUpperCase();
    };
  
    return (
      <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center p-2 rounded-lg transition-colors duration-300 hover:bg-gray-200/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 border-2 border-white/50 shadow-md overflow-hidden">
                  {user.avatar ? (
                      <img 
                          src={`http://localhost:3001/${user.avatar}`} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                      />
                  ) : (
                      <span>{getInitials(user.name)}</span>
                  )}
              </div>
              <AnimatePresence>
              {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="ml-3 overflow-hidden text-left"
                  >
                    <p className="font-semibold text-sm text-sky-900 truncate" title={user.name}>{user.name}</p>
                    <p className="text-xs text-gray-500 truncate" title={user.role}>{user.role}</p>
                  </motion.div>
              )}
              </AnimatePresence>
          </button>
          <AnimatePresence>
              {isOpen && (
                  <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                      className={`absolute z-20 w-48 p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 
                          ${isExpanded 
                              ? 'bottom-full left-0 right-0 mb-2' 
                              : 'bottom-4 left-full ml-5'}`
                      }
                  >
                      <NavLink to="/admin/profile" className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-sky-100 rounded-md"><FiUser /> Profile</NavLink>
                      <div className="my-1 h-px bg-gray-200" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 text-sm text-red-600 hover:bg-red-100 rounded-md"><FiLogOut /> Logout</button>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    );
  };

// --- [KOMPONEN WIDGET STATUS SISTEM (FUNGSI PING DIPERBAIKI)] ---
const SystemStatusWidget = ({ isExpanded, isOnline }) => {
    const [time, setTime] = useState(new Date());
    const [latency, setLatency] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        
        // [PERBAIKAN] Logika ping untuk mengukur latency bolak-balik
        const measureLatency = () => {
            const startTime = Date.now();
            // Kirim 'ping' bersama dengan waktu mulai
            socket.emit('ping', startTime); 
        };

        const latencyTimer = setInterval(measureLatency, 3000);
        
        // Listener untuk event 'pong' dari server
        socket.on('pong', (startTime) => {
            const duration = Date.now() - startTime;
            setLatency(duration);
        });

        return () => { 
            clearInterval(timer); 
            clearInterval(latencyTimer);
            socket.off('pong'); // Hapus listener saat komponen dilepas
        };
    }, []);

    return (
        <AnimatePresence>
            {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="my-4 pt-4 border-t border-gray-200/80 text-xs text-gray-500"
                    >
                      <div className="flex justify-between items-center"><div className="flex items-center gap-2"><FiClock /><span>Client Time</span></div><span>{time.toLocaleTimeString()}</span></div>
                      <div className="flex justify-between items-center mt-2"><div className="flex items-center gap-2"><FiWifi className="text-green-500"/><span>Ping</span></div><span className="font-mono">{latency} ms</span></div>
                      <div className="flex justify-between items-center mt-2"><div className="flex items-center gap-2">{isOnline ? <FiWifi className="text-green-500"/> : <FiWifiOff className="text-red-500" />}<span>Server Status</span></div><span className={`font-mono font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span></div>
                    </motion.div>
            )}
        </AnimatePresence>
    )
}

// ... (Komponen utama Sidebar tetap sama) ...
const Sidebar = ({ isExpanded }) => {
    const [isServerOnline, setIsServerOnline] = useState(socket.connected);
    const [user, setUser] = useState({ name: 'Guest', role: 'Guest', avatar: null });
  
    const menuItems = [
      { icon: FiLayout, text: 'Dashboard', to: '/admin/dashboard' },
      { icon: FiUsers, text: 'Manajemen Pengguna', to: '/admin/manage-users' },
      { icon: FiFolder, text: 'Manajemen File', to: '/admin/manage-files' },
      { icon: FiMessageSquare, text: 'Komunitas', to: '/admin/community' },
      { icon: FiActivity, text: 'Aktivitas Log', to: '/admin/logs' },
      { icon: FiHelpCircle, text: 'Bantuan', to: '/admin/help' },
    ];
  
    const sidebarVariants = { expanded: { width: '280px' }, collapsed: { width: '88px' } };
    const navContainerVariants = {
      visible: { transition: { staggerChildren: 0.05, delayChildren: isExpanded ? 0.2 : 0 } },
      hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    };
    const navItemVariants = { visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -10 } };
  
    useEffect(() => {
      const fetchUserData = async () => {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser && storedUser._id) {
              try {
                  const response = await getUserById(storedUser._id);
                  setUser(response.data);
              } catch (error) {
                  console.error("Gagal mengambil data user untuk sidebar:", error);
                  setUser(storedUser);
              }
          }
      };
      fetchUserData();
  
      const onConnect = () => setIsServerOnline(true);
      const onDisconnect = () => setIsServerOnline(false);
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      return () => { socket.off('connect', onConnect); socket.off('disconnect', onDisconnect); };
    }, []);
  
    return (
      <motion.aside
        variants={sidebarVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="h-screen flex flex-col p-4 border-r border-gray-200/80 shadow-2xl relative bg-slate-50/80 backdrop-blur-xl z-30"
      >
        <DottedBackground />
        <div className="absolute top-0 right-0 h-full w-1.5 bg-gradient-to-b from-sky-300 via-blue-500 to-purple-500 shadow-[0_0_20px_2px_#3b82f6] opacity-90 animate-pulse z-10"></div>
        
        <div className="flex items-center mb-6 p-3 z-10">
          <motion.div animate={{ scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 4px #3b82f6)', 'drop-shadow(0 0 12px #3b82f6)', 'drop-shadow(0 0 4px #3b82f6)'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <FaCloud className="text-4xl text-blue-500" />
          </motion.div>
          <AnimatePresence>
            {isExpanded && ( <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, delay: 0.1, ease: 'circOut' }} className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-700 whitespace-nowrap"> CloudNest </motion.h1> )}
          </AnimatePresence>
        </div>
  
        <motion.nav variants={navContainerVariants} initial="hidden" animate="visible" className="flex-grow z-10">
          {menuItems.map((item) => <SidebarItem key={item.text} {...item} isExpanded={isExpanded} variants={navItemVariants} />)}
        </motion.nav>
  
        <div className="pt-4 border-t border-gray-200/80 z-10">
          <SystemStatusWidget isExpanded={isExpanded} isOnline={isServerOnline} />
          <UserProfileActions user={user} isExpanded={isExpanded} />
        </div>
      </motion.aside>
    );
  };
  
  export default Sidebar;