import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArchive, FiVolumeX, FiTrash2, FiUserX, FiAlertCircle } from 'react-icons/fi';

const ChatActionMenu = ({ position, chat, onClose, onAction }) => {
    const menuRef = useRef(null);

    // Efek untuk menutup menu jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", onClose);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", onClose);
        };
    }, [onClose]);
    
    // Daftar aksi yang bisa dilakukan
    const menuItems = [
        { icon: FiArchive, text: 'Arsipkan', action: 'archive' },
        { icon: FiVolumeX, text: 'Bisukan', action: 'mute' },
        { icon: FiTrash2, text: 'Hapus Chat', action: 'delete' },
        { icon: FiUserX, text: 'Blokir Kontak', action: 'block', isDanger: true },
        { icon: FiAlertCircle, text: 'Laporkan', action: 'report', isDanger: true },
    ];

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ top: position.y, left: position.x }}
            className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 w-56 flex flex-col"
        >
            <div className="px-3 py-2 border-b mb-1">
                <p className="font-bold text-gray-800 truncate">{chat.name}</p>
            </div>
            {menuItems.map(item => (
                <button
                    key={item.action}
                    onClick={() => onAction(item.action, chat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm ${
                        item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <item.icon size={18} />
                    <span className="font-medium">{item.text}</span>
                </button>
            ))}
        </motion.div>
    );
};

export default ChatActionMenu;