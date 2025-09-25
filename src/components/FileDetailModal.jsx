import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDownload, FiShare2, FiTrash2, FiStar, FiEdit, FiFileText,
    FiTag, FiCalendar, FiFolder, FiClock,
    FiUser, FiHome, FiCheck, FiChevronUp, FiChevronDown
} from 'react-icons/fi';
import { FaFilePdf, FaFileImage, FaFileVideo, FaMusic } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ShareModal from './ShareModal';
import './css/FileDetailModal.css';

// --- Helper Functions (Tidak ada perubahan) ---
const getFileIcon = (type, props = {}) => {
  const baseProps = { className: "text-9xl", ...props };
  if (type.startsWith('image/')) return <FaFileImage {...baseProps} className={`${baseProps.className} text-purple-400`} />;
  if (type.startsWith('video/')) return <FaFileVideo {...baseProps} className={`${baseProps.className} text-indigo-400`} />;
  if (type.startsWith('audio/')) return <FaMusic {...baseProps} className={`${baseProps.className} text-pink-400`} />;
  if (type.includes('pdf')) return <FaFilePdf {...baseProps} className={`${baseProps.className} text-red-400`} />;
  return <FiFileText {...baseProps} className={`${baseProps.className} text-gray-400`} />;
};
const formatBytes = (bytes) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
const ActionButton = ({ icon: Icon, text, onClick, variant = 'default' }) => (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} className={`action-button variant-${variant}`}>
        <Icon className="w-5 h-5 flex-shrink-0"/>
        <span className="truncate">{text}</span>
    </motion.button>
);
const FilePreview = ({ file }) => {
    const filePath = `http://localhost:3001/${file.filePath}`;
    const fileType = file.fileType || '';
    const renderPreview = () => {
        if (fileType.startsWith('image/')) return <img src={filePath} alt={file.fileName} className="preview-content object-contain"/>;
        if (fileType.startsWith('video/')) return <video src={filePath} controls className="preview-content bg-black" />;
        if (fileType.startsWith('audio/')) return <div className="preview-content-placeholder audio-bg"> <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, repeatType: 'mirror', duration: 2 }}> <FaMusic className="text-9xl text-pink-300 drop-shadow-lg" /> </motion.div> <audio src={filePath} controls className="w-full max-w-sm mt-8" /> </div>;
        if (fileType.includes('pdf')) return <iframe src={filePath} className="preview-content" title={file.fileName} />;
        if (fileType.startsWith('text/')) return <iframe src={filePath} className="preview-content bg-white" title={file.fileName} />;
        return <div className="preview-content-placeholder"> {getFileIcon(fileType)} <p className="mt-4 text-slate-500 font-medium">Pratinjau tidak tersedia</p> </div>;
    };
    return (
        <div className="preview-container">
            <div className="preview-background-blur" style={fileType.startsWith('image/') ? { backgroundImage: `url(${filePath})` } : {}}/>
            {renderPreview()}
        </div>
    );
};

const FileDetailModal = ({ file, onClose, onUpdateFile, onDeleteFile, onDownloadFile }) => {
  const { user: currentUser } = useAuth();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (file) setNewName(file.fileName);
  }, [file]);

  if (!file) return null;

  const handleRenameSave = () => {
    if (newName.trim() === '' || newName === file.fileName) {
        setIsRenaming(false);
        return;
    }
    onUpdateFile({ _id: file._id, fileName: newName });
    setIsRenaming(false);
  };
  
  const tabs = [{ id: 'details', label: 'Detail' }, { id: 'activity', label: 'Aktivitas' }];
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <AnimatePresence>
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
              layout transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="modal-content" onClick={(e) => e.stopPropagation()} >
                <div className="w-3/5 relative"><FilePreview file={file} /></div>
                
                <div className="w-2/5 flex flex-col relative">
                    <div className="p-5 border-b border-slate-200">
                         <div className="flex items-start justify-between gap-2">
                            <motion.div layout="position" className="w-full">
                                <AnimatePresence mode="wait">
                                    {isRenaming ? (
                                        <motion.input key="input" type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                                            className="w-full text-xl font-bold text-slate-800 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                                            autoFocus onBlur={handleRenameSave} onKeyDown={(e) => e.key === 'Enter' && handleRenameSave}/>
                                    ) : (
                                        <motion.h2 key="text" className="text-xl font-bold text-slate-800 break-all">{file.fileName}</motion.h2>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            <div className="flex">
                                <motion.button layout onClick={() => setIsMinimized(!isMinimized)} className="action-icon-button">
                                    {isMinimized ? <FiChevronDown /> : <FiChevronUp />}
                                </motion.button>
                                
                                {/* [PERBAIKAN] Tombol Edit/Simpan yang dinamis */}
                                <AnimatePresence mode="wait">
                                    <motion.button
                                        key={isRenaming ? 'save' : 'edit'}
                                        layout
                                        onClick={isRenaming ? handleRenameSave : () => setIsRenaming(true)}
                                        className="action-icon-button"
                                        initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isRenaming ? <FiCheck className="text-green-500" size={22} /> : <FiEdit />}
                                    </motion.button>
                                </AnimatePresence>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{formatBytes(file.fileSize)}</p>
                    </div>
                    
                    <AnimatePresence>
                    {!isMinimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col flex-grow overflow-hidden"
                        >
                            <div className="flex-grow overflow-y-auto">
                                <nav className="border-b px-5">
                                <div className="flex space-x-4">
                                    {tabs.map(tab => (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}>
                                            {tab.label}
                                            {activeTab === tab.id && <motion.div className="tab-underline" layoutId="tab-underline-detail" />}
                                        </button>
                                    ))}
                                </div>
                                </nav>
                                <div className="p-5 relative min-h-[200px]">
                                     <AnimatePresence mode="wait">
                                        {activeTab === 'details' && (
                                            <motion.div key="details" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <div className="space-y-4">
                                                    <motion.h3 variants={itemVariants} className="font-bold text-slate-800">Properti</motion.h3>
                                                    <motion.div variants={itemVariants} className="detail-grid">
                                                        <div className="detail-item"><FiUser/><span>Pemilik</span><p>{file.user?.name || 'N/A'}</p></div>
                                                        <div className="detail-item"><FiHome/><span>Lokasi</span><p>{file.parent ? 'Dalam Folder' : 'Root'}</p></div>
                                                        <div className="detail-item"><FiTag/><span>Tipe File</span><p>{file.fileType}</p></div>
                                                        <div className="detail-item"><FiFolder/><span>Kategori</span><p>{file.category}</p></div>
                                                        <div className="detail-item"><FiCalendar/><span>Dibuat</span><p>{new Date(file.createdAt).toLocaleString('id-ID')}</p></div>
                                                        <div className="detail-item"><FiClock/><span>Diubah</span><p>{new Date(file.updatedAt).toLocaleString('id-ID')}</p></div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                         {activeTab === 'activity' && ( <motion.div key="activity" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}></motion.div> )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <motion.div className="p-3 border-t border-slate-200 space-y-1 bg-white" variants={containerVariants} initial="hidden" animate="visible">
                                <motion.div variants={itemVariants}>
                                    <ActionButton 
                                        icon={FiStar} 
                                        text={file.starred ? "Hapus dari Favorit" : "Tandai sebagai Favorit"} 
                                        variant={file.starred ? 'favorite-active' : 'favorite'} 
                                        onClick={() => onUpdateFile({ _id: file._id, starred: !file.starred })}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}><ActionButton icon={FiDownload} text="Unduh File" variant="download" onClick={() => onDownloadFile(file)}/></motion.div>
                                <motion.div variants={itemVariants}><ActionButton icon={FiShare2} text="Bagikan" variant="default" onClick={() => setIsShareModalOpen(true)} /></motion.div>
                                <motion.div variants={itemVariants}><ActionButton icon={FiTrash2} text="Hapus File" variant="delete" onClick={() => onDeleteFile(file)}/></motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </motion.div>
      </motion.div>
      </AnimatePresence>
      
      {isShareModalOpen && <ShareModal file={file} onClose={() => setIsShareModalOpen(false)} />}
    </>
  );
};

export default FileDetailModal;