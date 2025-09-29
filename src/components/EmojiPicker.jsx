import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import { FiSearch, FiSmile, FiClock } from 'react-icons/fi';
import { FaCat, FaHamburger, FaBus, FaTshirt, FaMusic, FaFlag } from 'react-icons/fa';

const categories = [
    { name: 'Sering Digunakan', icon: FiClock },
    { name: 'Wajah & Orang', icon: FiSmile },
    { name: 'Hewan & Alam', icon: FaCat },
    { name: 'Makanan & Minuman', icon: FaHamburger },
    { name: 'Perjalanan & Tempat', icon: FaBus },
    { name: 'Aktivitas', icon: FaTshirt },
    { name: 'Objek', icon: FaMusic },
    { name: 'Bendera', icon: FaFlag },
];

const EmojiPicker = ({ onEmojiClick, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] h-[450px] flex flex-col border border-gray-200 overflow-hidden">
            {/* Header Kustom */}
            <header className="p-3 border-b border-gray-200 flex-shrink-0">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari emoji..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-2 border-transparent focus:bg-white focus:border-blue-400 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>
            
            {/* Body dengan Picker */}
            <div className="flex-grow overflow-hidden">
                 <Picker
                    onEmojiClick={onEmojiClick}
                    searchString={searchTerm}
                    height="100%"
                    width="100%"
                    previewConfig={{ showPreview: false }}
                    skinTonesDisabled
                    lazyLoadEmojis
                 />
            </div>
        </div>
    );
};

export default EmojiPicker;