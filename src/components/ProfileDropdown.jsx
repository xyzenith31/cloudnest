import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import './css/ProfileDropdown.css';

const ProfileDropdown = ({ userName, userEmail }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="profile-dropdown-new"
        >
            <div className="profile-header-new">
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="profile-links-new">
                <NavLink to="/profile" className="profile-item-new">
                    <FiUser /><span>Profil</span>
                </NavLink>
                <NavLink to="/settings" className="profile-item-new">
                    <FiSettings /><span>Pengaturan</span>
                </NavLink>
                <NavLink to="/" className="profile-item-new logout">
                    <FiLogOut /><span>Logout</span>
                </NavLink>
            </div>
        </motion.div>
    );
};

export default ProfileDropdown;