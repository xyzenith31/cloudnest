import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut, FiHardDrive } from 'react-icons/fi';
import './css/ProfileDropdown.css';

// [FIX] Logika inisial nama yang lebih baik
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

const ProfileDropdown = ({ userName, userEmail, onLogout }) => {
    const storage = {
        used: '7.2 GB',
        total: '10 GB',
        percentage: (7.2 / 10) * 100,
    };

    const userInitials = getInitials(userName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="profile-dropdown-new"
        >
            <div className="profile-header-new">
                <motion.div 
                    className="profile-avatar-initials"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                    <span>{userInitials}</span>
                </motion.div>
                <p className="font-semibold text-lg mt-3">{userName}</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
            
            <div className="profile-section-new">
                <div className="profile-storage-info">
                    <div className="flex justify-between items-center mb-1">
                        <span className="flex items-center text-sm font-medium text-gray-700">
                            <FiHardDrive className="mr-2" /> Penyimpanan
                        </span>
                        <span className="text-xs font-semibold text-gray-500">{storage.used} / {storage.total}</span>
                    </div>
                    <div className="storage-bar">
                        <motion.div 
                            className="storage-bar-inner" 
                            initial={{ width: 0 }}
                            animate={{ width: `${storage.percentage}%`}}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            <div className="profile-links-new">
                <NavLink to="/profile" className="profile-item-new">
                    <FiUser /><span>Profil Saya</span>
                </NavLink>
            </div>
            
            <div className="profile-footer-new">
                <button onClick={onLogout} className="profile-item-new logout w-full text-left">
                    <FiLogOut /><span>Logout</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileDropdown;