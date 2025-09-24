import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiX, FiChevronRight, FiHome } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const MoveFilesModal = ({ isOpen, onClose, onMove, allFiles, currentFolderId }) => {
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableFolders = useMemo(() => {
    return allFiles.filter(file => file.isDirectory && file._id !== currentFolderId);
  }, [allFiles, currentFolderId]);

  const handleMove = async () => {
    setIsLoading(true);
    await onMove(destination);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

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
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Pindahkan Item Ke...</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><FiX /></button>
          </div>
          
          <ul className="p-2 max-h-72 overflow-y-auto">
            {/* Opsi untuk pindah ke Root */}
            <li
              onClick={() => setDestination(null)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${destination === null ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              <FiHome />
              <span className="font-semibold">Root (Folder Utama)</span>
            </li>
            
            {/* Daftar folder lain */}
            {availableFolders.map(folder => (
              <li
                key={folder._id}
                onClick={() => setDestination(folder._id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${destination === folder._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                <FiFolder />
                <span className="font-semibold">{folder.fileName}</span>
              </li>
            ))}
            {availableFolders.length === 0 && (
                 <li className="p-4 text-center text-gray-400">Tidak ada folder tujuan lain.</li>
            )}
          </ul>

          <div className="p-4 border-t flex justify-end">
            <motion.button
              onClick={handleMove}
              disabled={destination === undefined || isLoading}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? <LoadingSpinner /> : 'Pindahkan'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoveFilesModal;