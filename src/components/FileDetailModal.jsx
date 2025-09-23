import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiShare2, FiTrash2, FiStar, FiEdit, FiCheck, FiFileText, FiTag, FiCalendar, FiUser, FiSave, FiHardDrive, FiFolder } from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid } from 'react-icons/fa';

// --- FUNGSI BANTU ---
const getFileIcon = (type, props = {}) => {
  const baseProps = { className: "text-4xl flex-shrink-0", ...props };
  switch (type) {
    case 'pdf': return <FaFilePdf {...baseProps} className={`${baseProps.className} text-red-500`} />;
    case 'word': return <FaFileWord {...baseProps} className={`${baseProps.className} text-blue-500`} />;
    case 'image': return <FaFileImage {...baseProps} className={`${baseProps.className} text-purple-500`} />;
    case 'archive': return <FaFileArchive {...baseProps} className={`${baseProps.className} text-yellow-500`} />;
    case 'video': return <FaFileVideo {...baseProps} className={`${baseProps.className} text-indigo-500`} />;
    case 'apk': return <FaAndroid {...baseProps} className={`${baseProps.className} text-green-500`} />;
    case 'folder': return <FiFolder {...baseProps} className={`${baseProps.className} text-yellow-500`} />;
    default: return <FiFileText {...baseProps} className={`${baseProps.className} text-gray-500`} />;
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const ActionButton = ({ icon: Icon, text, onClick, variant = 'default', isFullWidth = false }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        delete: 'bg-red-50 text-red-600 hover:bg-red-100',
        favorite: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    };
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${variants[variant]} ${isFullWidth ? 'w-full' : 'flex-1'}`}
        >
            <Icon/> <span>{text}</span>
        </motion.button>
    );
};


const FileDetailModal = ({ file, onClose, onUpdateFile, onDeleteFile, onDownloadFile }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file ? file.name : '');

  useEffect(() => {
    if(file) setNewName(file.name);
  }, [file]);

  if (!file) return null;

  const handleRenameSave = () => {
    onUpdateFile({ ...file, name: newName });
    setIsRenaming(false);
  };

  const toggleFavorite = () => {
    onUpdateFile({ ...file, starred: !file.starred });
  }

  const handleDelete = () => {
    onDeleteFile(file);
  }

  const handleDownload = () => {
    onDownloadFile(file);
  }

  const FilePreview = () => {
      if (file.type === 'image' && file.previewUrl) {
          return <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover"/>
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            {getFileIcon(file.type, {className: "text-8xl text-gray-300"})}
            <p className="mt-4 text-gray-500">Pratinjau tidak tersedia</p>
        </div>
      )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          layoutId={`file-card-${file.id}`}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden h-[600px]"
          onClick={(e) => e.stopPropagation()}
        >
            <div className="w-2/3 bg-gray-200"><FilePreview /></div>
            <div className="w-1/3 flex flex-col p-6">
                <div className="flex items-start justify-between mb-4 gap-2">
                    {isRenaming ? (
                        <div className="flex-grow mr-2">
                           <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full text-xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
                                autoFocus
                           />
                        </div>
                    ) : (
                        <h2 className="text-xl font-bold text-gray-800 break-all">{file.name}</h2>
                    )}
                    <button onClick={() => isRenaming ? handleRenameSave() : setIsRenaming(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 flex-shrink-0">
                        {isRenaming ? <FiCheck onClick={handleRenameSave} className="text-green-500"/> : <FiEdit/>}
                    </button>
                </div>

                <div className="space-y-3 text-sm text-gray-600 border-t pt-4 flex-grow overflow-y-auto">
                    <h3 className="font-bold text-gray-800 text-base mb-2">Properti Lengkap</h3>
                    <div className="flex items-center gap-3"><FiTag className="text-gray-400"/><p><strong>Nama File:</strong> <span className="break-all">{file.name}</span></p></div>
                    <div className="flex items-center gap-3"><FiFileText className="text-gray-400"/><p><strong>Tipe:</strong> {file.category}</p></div>
                    <div className="flex items-center gap-3"><FiHardDrive className="text-gray-400"/><p><strong>Ukuran:</strong> {formatBytes(file.size)}</p></div>
                    <div className="flex items-center gap-3"><FiCalendar className="text-gray-400"/><p><strong>Dibuat:</strong> {new Date(file.createdAt).toLocaleString()}</p></div>
                    <div className="flex items-center gap-3"><FiCalendar className="text-gray-400"/><p><strong>Modifikasi:</strong> {new Date(file.date).toLocaleString()}</p></div>
                    <div className="flex items-center gap-3"><FiUser className="text-gray-400"/><p><strong>Pemilik:</strong> {file.owner}</p></div>
                </div>

                <div className="mt-4 space-y-2">
                    <ActionButton icon={FiStar} text={file.starred ? "Hapus Favorit" : "Jadikan Favorit"} variant="favorite" isFullWidth onClick={toggleFavorite}/>
                    <div className="flex gap-2">
                      <ActionButton icon={FiDownload} text="Unduh" onClick={handleDownload} />
                      <ActionButton icon={FiShare2} text="Bagikan" />
                    </div>
                    <ActionButton icon={FiTrash2} text="Hapus File" variant="delete" isFullWidth onClick={handleDelete} />
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/50 rounded-full p-1">
                    <FiX size={20}/>
                </button>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileDetailModal;