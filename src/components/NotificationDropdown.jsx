import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiMessageSquare, FiHardDrive } from 'react-icons/fi';
import './css/NotificationDropdown.css';

const getNotificationIcon = (type) => {
    switch (type) {
        case 'comment':
            return <FiMessageSquare className="icon comment" />;
        case 'storage':
            return <FiHardDrive className="icon storage" />;
        case 'file':
        default:
            return <FiFileText className="icon file" />;
    }
};

const NotificationDropdown = ({ notifications }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="notification-dropdown-new"
        >
            <div className="dropdown-header-new">
                <h3>Notifikasi</h3>
                <span className="mark-as-read">Tandai sudah dibaca</span>
            </div>
            <ul className="notification-list-new">
                {notifications.map(notif => (
                    <li key={notif.id} className="notification-item-new">
                        {getNotificationIcon(notif.type)}
                        <div className="notification-content">
                            <p>{notif.message}</p>
                            <span>{notif.time}</span>
                        </div>
                    </li>
                ))}
            </ul>
             <div className="dropdown-footer-new">
                <a href="#">Lihat semua notifikasi</a>
            </div>
        </motion.div>
    );
};

export default NotificationDropdown;