import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// [PERBAIKAN] Menambahkan kembali FiUploadCloud
import { FiHome, FiFile, FiUploadCloud, FiUsers, FiHelpCircle, FiBell, FiMenu, FiX, FiActivity } from 'react-icons/fi'; 
import { FaCloud, FaRocket } from 'react-icons/fa';
import './css/Navbar.css';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../context/AuthContext';
import { useUpload } from '../context/UploadContext';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const nameParts = name.trim().split(' ').filter(Boolean);
  if (nameParts.length === 0) return '?';
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// [PERBAIKAN] Menambahkan kembali data link untuk tombol Upload File
const navLinksData = [
    { text: 'Beranda', to: '/beranda', icon: FiHome },
    { text: 'File Saya', to: '/beranda/my-files', icon: FiFile },
    { text: 'Upload File', to: '/beranda/upload', icon: FiUploadCloud },
    { text: 'Komunitas', to: '/beranda/community', icon: FiUsers },
    { text: 'Riwayat Aktivitas', to: '/beranda/history', icon: FiActivity },
    { text: 'Bantuan', to: '/beranda/help', icon: FiHelpCircle },
];

const NavLinks = ({ isMobile, onLinkClick }) => {
    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <>
            {navLinksData.map((link) => (
                <motion.div key={link.to} variants={itemVariants}>
                    <NavLink
                        to={link.to}
                        onClick={onLinkClick}
                        end={link.to === '/beranda'}
                        className={({ isActive }) => 
                            `nav-link-modern ${isActive ? 'active' : ''} ${isMobile ? 'mobile' : ''}`
                        }
                    >
                        <link.icon className="link-icon-modern" />
                        <span>{link.text}</span>
                    </NavLink>
                </motion.div>
            ))}
        </>
    );
};

const Navbar = () => {
  const { user } = useAuth();
  const { setPopupOpen, setPopupMinimized } = useUpload();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState({ left: 0, width: 0 });
  
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const activeLink = navRef.current?.querySelector('.nav-link-modern.active:not(.mobile)');
    if (activeLink) {
      setSliderPosition({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  }, [location, isMobileMenuOpen]);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const notifRef = useRef();
  const profileRef = useRef();
  const mobileMenuRef = useRef();

  useClickOutside(notifRef, () => setIsNotifOpen(false));
  useClickOutside(profileRef, () => setIsProfileOpen(false));
  useClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false));

  const notifications = [
      { id: 1, type: 'file', message: 'File "Dokumen Penting.docx" berhasil diunggah.', time: '5 menit yang lalu' },
      { id: 2, type: 'comment', message: 'Anda mendapatkan 2 komentar baru.', time: '1 jam yang lalu' },
      { id: 3, type: 'storage', message: 'Penyimpanan Anda hampir penuh!', time: '1 hari yang lalu' },
  ];
  
  const toggleNotif = () => setIsNotifOpen(prev => !prev);
  const toggleProfile = () => setIsProfileOpen(prev => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const handleQuickUploadClick = () => {
    setPopupOpen(true);
    setPopupMinimized(false);
  };

  const containerVariants = {
      hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
      visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  };
  
  const displayUsername = user ? user.username : 'Tamu';
  const userFullName = user ? user.name : 'Nama Tamu';
  const userEmail = user ? user.email : 'tamu@email.com';

  return (
    <>
      <nav className="user-navbar-fixed">
        <div className="navbar-section left">
          <Link to="/beranda" className="logo-container-modern">
            <motion.div whileHover={{ rotate: [0, -15, 15, -15, 0] }}>
              <FaCloud className="logo-icon-modern" />
            </motion.div>
            <span className="logo-text-modern">CloudNest</span>
          </Link>
        </div>

        <div className="navbar-section center hidden lg:flex">
          <div className="nav-links-modern" ref={navRef}>
            <NavLinks isMobile={false} />
            <motion.div
              className="nav-slider"
              animate={sliderPosition}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          </div>
        </div>

        <div className="navbar-section right">
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={handleQuickUploadClick} 
            className="icon-button-modern rocket-button"
            title="Upload Cepat"
          >
            <FaRocket /> 
          </motion.button>
          
          <div ref={notifRef} className="navbar-item-wrapper">
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleNotif} className="icon-button-modern">
              <FiBell />
              <AnimatePresence>
                {notifications.length > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="notification-badge-modern">
                    {notifications.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <AnimatePresence>
              {isNotifOpen && <NotificationDropdown notifications={notifications} />}
            </AnimatePresence>
          </div>
          <div ref={profileRef} className="navbar-item-wrapper">
            <motion.button whileTap={{ scale: 0.95 }} onClick={toggleProfile} className="profile-container-modern">
              <div className="profile-avatar-modern"><span>{getInitials(userFullName)}</span></div>
              <span className="profile-name-modern hidden md:block">{displayUsername}</span>
            </motion.button>
            <AnimatePresence>
              {isProfileOpen && <ProfileDropdown userName={userFullName} userEmail={userEmail} />}
            </AnimatePresence>
          </div>
          <div className="lg:hidden">
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleMobileMenu} className="icon-button-modern">
                <FiMenu />
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-menu-backdrop"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="mobile-menu-overlay"
              ref={mobileMenuRef}
            >
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={toggleMobileMenu} className="icon-button-modern">
                    <FiX />
                </motion.button>
              </div>
              <motion.nav 
                className="mobile-menu-links"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLinks isMobile={true} onLinkClick={() => setIsMobileMenuOpen(false)} />
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;