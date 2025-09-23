import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiX } from 'react-icons/fi';

const NewFolderModal = ({ isOpen, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Buat Folder Baru</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <FiX />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <FiFolder className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nama Folder"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05 }} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">
                Batal
              </motion.button>
              <motion.button type="submit" whileHover={{ scale: 1.05 }} className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold">
                Buat
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewFolderModal;