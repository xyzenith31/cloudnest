import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUploadCloud, FiFile, FiX, FiCheckCircle, FiLoader, FiAlertTriangle, FiTrash2,
    FiHardDrive, FiImage, FiVideo, FiFileText, FiArchive, FiCpu, FiMusic, FiFolderPlus
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid, FaFilePowerpoint, FaFileExcel, FaWindows, FaApple } from 'react-icons/fa';
import { uploadFile, getUserFiles } from '../../services/fileService';
import Notification from '../../components/Notification';
import './ui/UploadFile.css';

// --- (Helper Functions dan Komponen FileItem tidak berubah) ---
const getFileIcon = (fileType, fileName = '') => {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (fileType.startsWith('image/')) return <FaFileImage className="text-purple-500" />;
    if (fileType.startsWith('video/')) return <FaFileVideo className="text-indigo-500" />;
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-500" />;
    if (fileType.includes('excel')) return <FaFileExcel className="text-green-600" />;
    if (fileType.includes('powerpoint')) return <FaFilePowerpoint className="text-orange-500" />;
    if (['.zip', '.rar', '.7z', '.iso'].includes(extension)) return <FaFileArchive className="text-yellow-500" />;
    if (extension === '.apk' || fileType.includes('android.package-archive')) return <FaAndroid className="text-green-500" />;
    if (extension === '.exe' || extension === '.msi') return <FaWindows className="text-sky-500" />;
    if (extension === '.dmg' || extension === '.ipa') return <FaApple className="text-gray-600" />;
    return <FiFile className="text-gray-500" />;
};
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
const FileItem = ({ file, onRemove }) => {
    const statusIcons = { uploading: <FiLoader className="text-blue-500 animate-spin" />, completed: <FiCheckCircle className="text-green-500" />, failed: <FiAlertTriangle className="text-red-500" />, };
    return (
        <motion.div layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }} className="file-item-card" >
            <div className="file-item-icon">{getFileIcon(file.type || file.fileType || '', file.name || file.fileName || '')}</div>
            <div className="file-item-details">
                <p className="file-item-name">{file.name || file.fileName}</p>
                <p className="file-item-info">{formatBytes(file.size || file.fileSize)}</p>
                {file.status === 'uploading' && (<div className="progress-bar-container"><motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${file.progress || 0}%`}} /></div>)}
                {file.status === 'failed' && <p className="text-xs text-red-500 mt-1">{file.error || 'Gagal'}</p>}
            </div>
            <div className="file-item-status"> {file.status === 'pending' ? <motion.button whileTap={{ scale: 0.9 }} onClick={onRemove} className="p-1 rounded-full hover:bg-gray-100 text-gray-500"><FiX /></motion.button> : statusIcons[file.status]} </div>
        </motion.div>
    );
};


// --- [DIPERBAIKI] Komponen FilesSection dengan Teks Tengah ---
const FilesSection = ({ title, icon, files, onRemove, onClear, children, className = '' }) => (
    <motion.div 
        className={`files-section ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
    >
        <div className="section-header">
            <h2 className="section-title">{icon} {title}</h2>
            {onClear && files.length > 0 && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClear} className="clear-button">
                    <FiTrash2 size={14}/> Bersihkan
                </motion.button>
            )}
        </div>
        <div className="file-list">
            <AnimatePresence>
                {files.map(file => <FileItem key={file.id || file._id} file={file} onRemove={() => onRemove && onRemove(file.id)} />)}
            </AnimatePresence>
            
            {/* [PERBAIKAN] Bungkus teks dalam div flexbox untuk membuatnya pas di tengah */}
            {files.length === 0 && (
                <div className="flex-grow flex items-center justify-center h-full">
                    <p className="text-gray-500">Tidak ada file di sini.</p>
                </div>
            )}
        </div>
        {children}
    </motion.div>
);

// --- (Komponen StorageHub dan Komponen Utama UploadFile tidak ada perubahan, jadi saya persingkat) ---
const StorageHub = ({ usedStorage, files }) => {
    const totalStorage = 10 * 1024 * 1024 * 1024;
    const usagePercentage = (usedStorage / totalStorage) * 100;
    const categoryData = useMemo(() => {
        const categories = { foto: { icon: FiImage, label: 'Gambar', size: 0, color: 'bg-purple-500' }, video: { icon: FiVideo, label: 'Video', size: 0, color: 'bg-indigo-500' }, music: { icon: FiMusic, label: 'Audio', size: 0, color: 'bg-pink-500' }, dokumen: { icon: FiFileText, label: 'Dokumen', size: 0, color: 'bg-blue-500' }, arsip: { icon: FiArchive, label: 'Arsip', size: 0, color: 'bg-yellow-500' }, apk: { icon: FiCpu, label: 'Aplikasi', size: 0, color: 'bg-green-500' }, };
        files.forEach(file => { if (categories[file.category]) { categories[file.category].size += file.fileSize; } });
        return Object.values(categories).filter(c => c.size > 0);
    }, [files]);
    return (
        <motion.div className="storage-hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="section-header"> <h2 className="section-title"><FiHardDrive />Pusat Penyimpanan</h2> </div>
            <p className="text-center text-3xl font-bold text-gray-800">{formatBytes(usedStorage, 1)} <span className="text-lg text-gray-500"> / 10 GB</span> </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-3"> <motion.div className="bg-gradient-to-r from-sky-500 to-blue-500 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${usagePercentage}%`}} transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }} /> </div>
            <div className="storage-category-list">
                {categoryData.map(cat => (
                    <div key={cat.label} className="category-item">
                        <div className={`category-icon ${cat.color}`}><cat.icon /></div>
                        <div className="flex-grow"> <p className="font-semibold text-gray-700">{cat.label}</p> </div>
                        <p className="font-medium text-gray-600">{formatBytes(cat.size)}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const UploadFile = () => {
    const [pendingFiles, setPendingFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [history, setHistory] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [allFiles, setAllFiles] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const fetchInitialData = async () => { try { const response = await getUserFiles(); setHistory(response.data.files.slice(0, 10)); setAllFiles(response.data.files); setTotalSize(response.data.totalSize); } catch (error) { console.error("Gagal memuat data:", error); } };
    useEffect(() => { fetchInitialData(); }, []);
    const onDrop = useCallback(acceptedFiles => {
        const storageLimit = 10 * 1024 * 1024 * 1024;
        const sizeOfPendingFiles = pendingFiles.reduce((acc, file) => acc + file.size, 0);
        const sizeOfNewFiles = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
        if (totalSize + sizeOfPendingFiles + sizeOfNewFiles > storageLimit) { setNotification({ message: 'Penyimpanan tidak cukup untuk file baru.', type: 'error' }); return; }
        const newFiles = acceptedFiles.map((file, index) => Object.assign(file, { id: `pending-${Date.now()}-${index}`, status: 'pending' }));
        setPendingFiles(prev => [...prev, ...newFiles]);
    }, [pendingFiles, totalSize]);
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true });
    const handleUpload = () => {
        const filesToUpload = pendingFiles;
        setPendingFiles([]);
        setUploadingFiles(prev => [...prev, ...filesToUpload.map(f => ({ ...f, status: 'uploading', progress: 0 }))]);
        filesToUpload.forEach(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await uploadFile(formData, (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadingFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: percentCompleted } : f));
                });
                setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
                fetchInitialData();
                setNotification({ message: `"${response.data.fileName}" berhasil diunggah!`, type: 'success' });
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Upload gagal.';
                setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
                setPendingFiles(prev => [{ ...file, status: 'failed', error: errorMessage }, ...prev]);
                setNotification({ message: `Gagal mengunggah "${file.name}": ${errorMessage}`, type: 'error' });
            }
        });
    };

    return (
        <div className="upload-page-container">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Unggah File Anda</h1>
                <p className="text-gray-500 mt-1">Seret dan letakkan file di mana saja untuk memulai.</p>
            </motion.div>

            <div className="upload-grid mt-8">
                <div className="upload-main-column flex flex-col space-y-8">
                    <motion.div {...getRootProps()} className={`dropzone-reimagined ${isDragActive ? 'active' : ''}`} whileHover={{ scale: 1.02 }} >
                        <input {...getInputProps()} />
                        <motion.div className="dropzone-content" animate={{ y: isDragActive ? -10 : 0 }}>
                            <FiUploadCloud className={`text-6xl transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            <p className="text-lg font-semibold">{isDragActive ? 'Lepaskan file di sini!' : 'Seret & Lepas File'}</p>
                            <p>atau <button onClick={(e) => {e.stopPropagation(); open();}} className="text-blue-600 font-semibold hover:underline">pilih dari perangkat</button></p>
                            <p className="text-sm text-gray-400 mt-2">Ukuran file maksimal 2GB</p>
                        </motion.div>
                    </motion.div>
                    
                    <FilesSection
                        className="flex-grow"
                        title={`Antrian (${pendingFiles.length})`}
                        icon={<FiFolderPlus />}
                        files={pendingFiles}
                        onRemove={(id) => setPendingFiles(p => p.filter(f => f.id !== id))}
                        onClear={() => setPendingFiles([])}
                    >
                        {(pendingFiles.length > 0 || uploadingFiles.length > 0) && (
                            <div className="mt-6 flex justify-end flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(59,130,246,0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUpload}
                                    disabled={pendingFiles.length === 0}
                                    className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {uploadingFiles.length > 0 ? 'Mengunggah...' : `Unggah ${pendingFiles.length} File`}
                                </motion.button>
                            </div>
                        )}
                    </FilesSection>
                </div>
                
                <div className="upload-sidebar-column flex flex-col space-y-8">
                    <StorageHub usedStorage={totalSize} files={allFiles} />
                    <FilesSection title="Riwayat Terbaru" icon={<FiFileText />} files={history} />
                </div>
            </div>
        </div>
    );
};

export default UploadFile;