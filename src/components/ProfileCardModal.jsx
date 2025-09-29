import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Helper function
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const nameParts = name.trim().split(' ').filter(Boolean);
  if (nameParts.length === 0) return '?';
  if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const ProfileCardModal = ({ user, onClose }) => {
    const navigate = useNavigate();

    if (!user) return null;

    const handleNavigateProfile = () => {
        // Asumsi: Anda punya halaman profil user di /beranda/profile/:userId
        // Jika tidak, arahkan ke halaman profil pengguna yang sedang login
        navigate('/beranda/profile'); 
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Banner */}
                    <div className={`h-28 ${user.color || 'bg-gray-500'}`}>
                        {/* Bisa ditambahkan gambar banner di sini jika ada */}
                    </div>

                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"
                    >
                        <FiX size={20} />
                    </button>

                    <div className="p-6 pt-0">
                        {/* Profile Picture */}
                        <div className="relative -mt-16 w-32 h-32 mx-auto">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg" />
                            ) : (
                                <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white text-4xl border-4 border-white shadow-lg ${user.color}`}>
                                    <span>{getInitials(user.name)}</span>
                                </div>
                            )}
                             {user.online && <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>}
                        </div>

                        {/* User Info */}
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-sm text-gray-500">@{user.id}</p>
                            <p className="text-md text-gray-600 mt-1">{user.email || `${user.id}@example.com`}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-3 mt-6">
                             <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <FiMessageSquare /> Pesan
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNavigateProfile}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FiUser /> Profil
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileCardModal;