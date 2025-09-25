import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLink, FiCheck, FiUsers, FiSend } from 'react-icons/fi';
import './css/ShareModal.css';

const ShareModal = ({ file, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);
    const shareableLink = `http://localhost:3001/api/files/share/${file._id}`; // Contoh URL

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="share-modal-content"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="share-modal-header">
                        <h3 className="font-bold text-lg text-slate-800">Bagikan "{file.fileName}"</h3>
                        <button onClick={onClose} className="action-icon-button"><FiX /></button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="font-semibold text-sm text-slate-600 mb-2 block">
                                Dapatkan Tautan
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="link-container">
                                    <FiLink className="text-slate-400" />
                                    <input type="text" readOnly value={shareableLink} className="link-input" />
                                </div>
                                <motion.button
                                    onClick={handleCopyLink}
                                    className={`copy-button ${isCopied ? 'copied' : ''}`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isCopied ? <FiCheck /> : <FiLink />}
                                    <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                                </motion.button>
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold text-sm text-slate-600 mb-2 block">
                                Bagikan ke Pengguna Lain
                            </label>
                             <div className="flex items-center gap-2">
                                <div className="link-container">
                                    <FiUsers className="text-slate-400" />
                                    <input type="email" placeholder="Masukkan email pengguna..." className="link-input" />
                                </div>
                                 <motion.button className="send-invite-button" whileTap={{ scale: 0.95 }}>
                                    <FiSend />
                                    <span>Kirim</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShareModal;