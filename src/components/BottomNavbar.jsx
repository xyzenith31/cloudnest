import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiFile, FiUploadCloud, FiUsers, FiHelpCircle } from 'react-icons/fi';
import './css/BottomNavbar.css';

const navLinksData = [
    { text: 'Beranda', to: '/beranda', icon: FiHome },
    { text: 'File Saya', to: '/my-files', icon: FiFile },
    { text: 'Upload', to: '/upload', icon: FiUploadCloud },
    { text: 'Komunitas', to: '/community', icon: FiUsers },
    { text: 'Bantuan', to: '/help', icon: FiHelpCircle },
];

const BottomNavbar = () => {
    const [sliderPosition, setSliderPosition] = useState({ left: 0, width: 0 });
    const navRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const activeLink = navRef.current?.querySelector('.bottom-nav-link.active');
        if (activeLink) {
            setSliderPosition({
                left: activeLink.offsetLeft,
                width: activeLink.offsetWidth,
            });
        }
    }, [location]);

    return (
        <nav className="bottom-navbar">
            <div className="bottom-nav-links" ref={navRef}>
                {navLinksData.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <link.icon className="bottom-nav-icon" />
                        <span className="bottom-nav-text">{link.text}</span>
                    </NavLink>
                ))}
                <motion.div
                    className="bottom-nav-slider"
                    animate={sliderPosition}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
            </div>
        </nav>
    );
};

export default BottomNavbar;