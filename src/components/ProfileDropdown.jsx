import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut, FiHardDrive } from 'react-icons/fi';
import './css/ProfileDropdown.css';

// Fungsi untuk mendapatkan inisial dari nama
const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

const ProfileDropdown = ({ userName, userEmail }) => {
    // Data dummy untuk penggunaan penyimpanan (total 10GB)
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
                {/* [BARU] Avatar Inisial Pengguna */}
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
                <NavLink to="/" className="profile-item-new logout">
                    <FiLogOut /><span>Logout</span>
                </NavLink>
            </div>
        </motion.div>
    );
};

export default ProfileDropdown;