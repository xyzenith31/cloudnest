import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiFile, FiUploadCloud, FiUsers, FiHelpCircle, FiBell } from 'react-icons/fi';
import { FaCloud } from 'react-icons/fa';
import './css/Navbar.css';

// Import komponen dropdown baru
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const useClickOutside = (handler) => {
  const domNode = useRef();
  useEffect(() => {
    const maybeHandler = (event) => {
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener('mousedown', maybeHandler);
    return () => { document.removeEventListener('mousedown', maybeHandler); };
  });
  return domNode;
};

const getInitials = (name) => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

const Navbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userName = "Donny Indra";
  const userEmail = "donny.indra@example.com";
  const userInitials = getInitials(userName);

  const notifRef = useClickOutside(() => setIsNotifOpen(false));
  const profileRef = useClickOutside(() => setIsProfileOpen(false));
  
  const navLinks = [
    { text: 'Beranda', to: '/beranda', icon: FiHome },
    { text: 'File Saya', to: '/my-files', icon: FiFile },
    { text: 'Upload File', to: '/upload', icon: FiUploadCloud },
    { text: 'Komunitas', to: '/community', icon: FiUsers },
    { text: 'Bantuan', to: '/help', icon: FiHelpCircle },
  ];

  // Tambahkan 'type' untuk ikon notifikasi yang berbeda
  const notifications = [
    { id: 1, type: 'file', message: 'File "Dokumen Penting.docx" berhasil diunggah.', time: '5 menit yang lalu' },
    { id: 2, type: 'comment', message: 'Anda mendapatkan 2 komentar baru.', time: '1 jam yang lalu' },
    { id: 3, type: 'storage', message: 'Penyimpanan Anda hampir penuh!', time: '1 hari yang lalu' },
  ];
  
  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  return (
    <nav className="user-navbar-fixed">
      <div className="navbar-section left">
        <Link to="/beranda" className="logo-container-modern">
          <FaCloud className="logo-icon-modern" />
          <span className="logo-text-modern">CloudNest</span>
        </Link>
      </div>

      <div className="navbar-section center">
        <div className="nav-links-modern">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link-modern ${isActive ? 'active' : ''}`}>
              <link.icon className="link-icon-modern" />
              <span>{link.text}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="navbar-section right">
        <div ref={notifRef} className="navbar-item-wrapper">
          <button onClick={toggleNotif} className="icon-button-modern">
            <FiBell />
            <span className="notification-badge-modern">3</span>
          </button>
          <AnimatePresence>
            {isNotifOpen && <NotificationDropdown notifications={notifications} />}
          </AnimatePresence>
        </div>
        <div ref={profileRef} className="navbar-item-wrapper">
          <button onClick={toggleProfile} className="profile-container-modern">
            <div className="profile-avatar-modern"><span>{userInitials}</span></div>
            <span className="profile-name-modern">{userName}</span>
          </button>
          <AnimatePresence>
            {isProfileOpen && <ProfileDropdown userName={userName} userEmail={userEmail} />}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;