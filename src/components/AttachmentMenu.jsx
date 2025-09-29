import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiImage, FiVideo, FiFileText, FiMusic, FiCpu, FiUploadCloud, FiHardDrive 
} from 'react-icons/fi';

const AttachmentMenu = ({ onSelect }) => {

    const fileTypes = [
        { name: 'Foto', icon: FiImage, color: 'text-purple-500', action: 'image' },
        { name: 'Video', icon: FiVideo, color: 'text-indigo-500', action: 'video' },
        { name: 'Dokumen', icon: FiFileText, color: 'text-blue-500', action: 'document' },
        { name: 'Musik', icon: FiMusic, color: 'text-pink-500', action: 'music' },
        { name: 'Aplikasi', icon: FiCpu, color: 'text-green-500', action: 'app' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute bottom-full left-0 mb-2 z-20 bg-white rounded-2xl shadow-2xl w-80 border border-gray-200 overflow-hidden"
        >
            <div className="p-3">
                {/* Opsi Sumber Upload */}
                <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                        <FiUploadCloud size={18} />
                        <span>Perangkat</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                        <FiHardDrive size={18} />
                        <span>CloudNest</span>
                    </button>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Opsi Tipe File */}
            <div className="p-2">
                {fileTypes.map((type) => (
                    <button 
                        key={type.action}
                        onClick={() => onSelect(type.action)}
                        className="w-full flex items-center gap-4 p-3 text-left rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <type.icon className={`w-6 h-6 flex-shrink-0 ${type.color}`} />
                        <span className="font-semibold text-gray-700">{type.name}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default AttachmentMenu;