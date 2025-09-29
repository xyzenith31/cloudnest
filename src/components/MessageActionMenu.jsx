import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    FiCornerUpLeft, FiCopy, FiShare, FiStar, FiTrash2, FiCheckSquare, FiEdit 
} from 'react-icons/fi';

const MessageActionMenu = ({ position, onClose, onAction, availableEmojis }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const handleClickOutside = (event) => {
            if (menu && !menu.contains(event.target)) onClose();
        };

        const calculatePosition = () => {
            const menuRect = menu.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const buffer = 10;

            let top = position.y;
            let left = position.x;
            
            if (top + menuRect.height > windowHeight - buffer) {
                top = position.y - menuRect.height;
            }
            if (left + menuRect.width > windowWidth - buffer) {
                left = windowWidth - menuRect.width - buffer;
            }
            
            top = Math.max(buffer, top);
            left = Math.max(buffer, left);

            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
            menu.style.visibility = 'visible';
        };
        
        requestAnimationFrame(calculatePosition);

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", onClose);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", onClose);
        };
    }, [position, onClose]);

    const menuItems = [
        { icon: FiCornerUpLeft, text: 'Balas', action: 'reply' },
        { icon: FiCopy, text: 'Salin', action: 'copy' },
        { icon: FiShare, text: 'Teruskan', action: 'forward' },
        { icon: FiStar, text: 'Tandai', action: 'star' },
        { icon: FiCheckSquare, text: 'Pilih', action: 'select' },
        { icon: FiEdit, text: 'Edit', action: 'edit' },
        { icon: FiTrash2, text: 'Hapus', action: 'delete', isDanger: true },
    ];
    
    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ 
                position: 'fixed', 
                top: `${position.y}px`, 
                left: `${position.x}px`,
                visibility: 'hidden'
            }}
            className="bg-white rounded-xl shadow-2xl border border-gray-100 p-1 z-50 w-60 flex flex-col"
        >
            <div className="overflow-x-auto custom-scrollbar-horizontal border-b">
                <div className="flex items-center p-1 gap-1 whitespace-nowrap">
                    {availableEmojis.map(emoji => (
                        <button key={emoji} onClick={() => onAction('react', emoji)} className="p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 transform hover:scale-125 text-xl flex-shrink-0">
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[250px]">
                {menuItems.map(item => (
                    <button
                        key={item.action}
                        onClick={() => onAction(item.action)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm ${
                            item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon size={18} />
                        <span className="font-medium">{item.text}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default MessageActionMenu;