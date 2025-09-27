import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiImage, FiVideo, FiFileText, FiArchive, FiGrid, FiList, FiStar, FiCpu, FiBarChart2, FiX,
    FiAperture, FiSearch, FiHardDrive, FiDownload, FiTrash2, FiAlertTriangle, FiMusic, FiFolder, FiPlus, FiMove, FiChevronRight, FiHome, FiRefreshCw, FiTrash
} from 'react-icons/fi';
import {
    FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid,
    FaFileExcel, FaFilePowerpoint, FaWindows, FaApple, FaLinux
} from 'react-icons/fa';
import SortDropdown from '../../components/SortDropdown';
import FileDetailModal from '../../components/FileDetailModal';
import NewFolderModal from '../../components/NewFolderModal';
import MoveFilesModal from '../../components/MoveFilesModal';
import DownloadAllModal from '../../components/DownloadAllModal';
import { useAuth } from '../../context/AuthContext';
import { getUserFiles, deleteFile, deleteAllFiles, createFolder, moveFiles, updateFile, downloadFile, downloadAllFiles, restoreAllFiles, emptyTrash } from '../../services/fileService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Notification from '../../components/Notification';

// --- Helper Functions ---
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (file, props = {}) => {
    const baseProps = { className: "text-4xl flex-shrink-0", ...props };
    const extension = file.fileName ? `.${file.fileName.split('.').pop().toLowerCase()}` : '';

    if (file.isDirectory) {
        return <FiFolder {...baseProps} className={`${baseProps.className} text-yellow-500`} />;
    }

    switch (file.category) {
        case 'foto': return <FaFileImage {...baseProps} className={`${baseProps.className} text-purple-500`} />;
        case 'music': return <FiMusic {...baseProps} className={`${baseProps.className} text-pink-500`} />;
        case 'video': return <FaFileVideo {...baseProps} className={`${baseProps.className} text-indigo-500`} />;
        case 'arsip': return <FaFileArchive {...baseProps} className={`${baseProps.className} text-yellow-600`} />;
        case 'apk': return <FaAndroid {...baseProps} className={`${baseProps.className} text-green-500`} />;
        case 'dokumen':
            switch (extension) {
                case '.pdf': return <FaFilePdf {...baseProps} className={`${baseProps.className} text-red-500`} />;
                case '.doc': case '.docx': return <FaFileWord {...baseProps} className={`${baseProps.className} text-blue-600`} />;
                case '.xls': case '.xlsx': return <FaFileExcel {...baseProps} className={`${baseProps.className} text-green-600`} />;
                case '.ppt': case '.pptx': return <FaFilePowerpoint {...baseProps} className={`${baseProps.className} text-orange-500`} />;
                default: return <FiFileText {...baseProps} className={`${baseProps.className} text-gray-500`} />;
            }
        case 'aplikasi':
            switch (extension) {
                case '.exe': case '.msi': return <FaWindows {...baseProps} className={`${baseProps.className} text-blue-500`} />;
                case '.dmg': return <FaApple {...baseProps} className={`${baseProps.className} text-gray-600`} />;
                case '.deb': return <FaLinux {...baseProps} className={`${baseProps.className} text-orange-400`} />;
                case '.ipa': return <FaApple {...baseProps} className={`${baseProps.className} text-blue-400`} />;
                default: return <FiCpu {...baseProps} className={`${baseProps.className} text-gray-700`} />;
            }
        default:
            if (file.fileType.startsWith('image/')) return <FaFileImage {...baseProps} className={`${baseProps.className} text-purple-500`} />;
            if (file.fileType.startsWith('audio/')) return <FiMusic {...baseProps} className={`${baseProps.className} text-pink-500`} />;
            if (file.fileType.startsWith('video/')) return <FaFileVideo {...baseProps} className={`${baseProps.className} text-indigo-500`} />;
            return <FiFileText {...baseProps} className={`${baseProps.className} text-gray-500`} />;
    }
};

// --- Storage Detail Modal Component ---
const StorageDetailModal = ({ isOpen, onClose, totalSize, categoryData, trashedSize }) => {
    if (!isOpen) return null;
    const totalStorage = 10 * 1024 * 1024 * 1024; // 10 GB
    const usagePercentage = (totalSize / totalStorage) * 100;

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
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FiHardDrive /> Total Penyimpanan
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><FiX /></button>
                    </div>

                    <p className="text-center text-3xl font-bold text-gray-800 my-4">
                        {formatBytes(totalSize, 1)} <span className="text-lg text-gray-500 font-medium"> / 10 GB</span>
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-3">
                        <motion.div
                            className="bg-gradient-to-r from-sky-500 to-blue-500 h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>

                    <div className="mt-6 pt-4 border-t space-y-3">
                        {categoryData.length > 0 ? categoryData.map(cat => (
                            <div key={cat.label} className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center text-white`}>
                                        <cat.icon />
                                    </span>
                                    <span className="font-semibold text-gray-700">{cat.label}</span>
                                </span>
                                <span className="font-medium text-gray-800">{formatBytes(cat.size)}</span>
                            </div>
                        )) : <p className="text-sm text-center text-gray-400">Penyimpanan Anda masih kosong.</p>}
                        
                        {trashedSize > 0 && (
                             <div className="flex justify-between items-center text-sm pt-3 border-t mt-3">
                                <span className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white">
                                        <FiTrash2 />
                                    </span>
                                    <span className="font-semibold text-gray-700">File di Sampah</span>
                                </span>
                                <span className="font-medium text-gray-800">{formatBytes(trashedSize)}</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


// --- Sidebar ---
const Sidebar = ({ activeFilter, setActiveFilter, usagePercentage, totalSize, onStorageDetailClick }) => {
    const filters = [
        { id: 'all', name: 'Semua Media', icon: FiAperture },
        { id: 'foto', name: 'Foto', icon: FiImage },
        { id: 'video', name: 'Video', icon: FiVideo },
        { id: 'music', name: 'Musik', icon: FiMusic },
        { id: 'dokumen', name: 'Dokumen', icon: FiFileText },
        { id: 'apk', name: 'APK', icon: FiCpu },
        { id: 'arsip', name: 'File Arsip', icon: FiArchive },
        { id: 'trash', name: 'Tempat Sampah', icon: FiTrash2 },
    ];

    return (
        <aside className="w-64 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
                <h3 className="px-4 pt-2 pb-4 text-lg font-bold text-gray-800">Kategori</h3>
                {filters.map(filter => (
                    <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 relative ${
                            activeFilter === filter.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {activeFilter === filter.id && <motion.div layoutId="activeFilterBubble" className={`absolute inset-0 rounded-lg z-0 ${filter.id === 'trash' ? 'bg-red-500' : 'bg-blue-500'}`} />}
                        <filter.icon className="relative z-10"/>
                        <span className="relative z-10 font-semibold">{filter.name}</span>
                    </button>
                ))}
            </div>
            
            <motion.div layout className="bg-white rounded-2xl shadow-lg p-5">
                <motion.div layout className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">Penyimpanan</h3>
                    <FiHardDrive className="text-gray-400" />
                </motion.div>
                <motion.div layout className="w-full bg-gray-200 rounded-full h-2 my-3">
                    <motion.div
                        className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${usagePercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </motion.div>
                <motion.p layout className="text-sm text-center text-gray-600">
                    <span className="font-bold text-gray-800">{formatBytes(totalSize)}</span> dari 10 GB terpakai
                </motion.p>
                
                <div className="text-center mt-4">
                    <motion.button
                        onClick={onStorageDetailClick}
                        className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100/70 rounded-full hover:bg-blue-200/70 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiBarChart2 />
                        <span>Rincian</span>
                    </motion.button>
                </div>
            </motion.div>
        </aside>
    );
};

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Ya, Lanjutkan", color = "red" }) => {
    if (!isOpen) return null;
    const colorClasses = {
        red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', iconBg: 'bg-red-100', iconText: 'text-red-500' },
        blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', iconBg: 'bg-blue-100', iconText: 'text-blue-500' }
    };
    const currentTheme = colorClasses[color] || colorClasses.red;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
                    >
                        <div className={`w-16 h-16 ${currentTheme.iconBg} rounded-full flex items-center justify-center mx-auto`}>
                            <FiAlertTriangle className={`text-4xl ${currentTheme.iconText}`} />
                        </div>
                        <h2 className="text-xl font-bold my-4">{title}</h2>
                        <p className="text-gray-600">{message}</p>
                        <div className="flex justify-center gap-4 mt-6">
                            <motion.button onClick={onClose} whileHover={{ scale: 1.05 }} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">
                                Batal
                            </motion.button>
                            <motion.button onClick={onConfirm} whileHover={{ scale: 1.05 }} className={`px-6 py-2 rounded-lg ${currentTheme.bg} text-white ${currentTheme.hover} font-semibold`}>
                                {confirmText}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Main Page Component ---
const MyFilesPage = () => {
    const { user } = useAuth();
    const [allFiles, setAllFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [totalSize, setTotalSize] = useState(0);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [sort, setSort] = useState({ by: 'createdAt', order: 'desc' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, items: [] });
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [isDownloadAllModalOpen, setIsDownloadAllModalOpen] = useState(false);
    const [isRestoreAllModalOpen, setIsRestoreAllModalOpen] = useState(false);
    const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);
    const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
    const [folderPath, setFolderPath] = useState([{ _id: null, fileName: 'Home' }]);
    const currentFolderId = folderPath[folderPath.length - 1]._id;

    const fetchFiles = useCallback(async () => {
        if (!isLoading) setIsLoading(true);
        try {
            const response = await getUserFiles();
            setAllFiles(response.data.files);
            setTotalSize(response.data.totalSize);
        } catch (error) {
            setNotification({ message: 'Gagal memuat file', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]); 

    useEffect(() => {
        fetchFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    const filteredAndSortedFiles = useMemo(() => {
        return allFiles
            .filter(file => {
                const isInTrash = file.status === 'trashed';
                if (filter === 'trash') {
                    return isInTrash && file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (isInTrash) return false;
                return (
                    (file.parent === currentFolderId) &&
                    (filter === 'all' || file.category === filter) &&
                    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })
            .sort((a, b) => {
                if (a.isDirectory !== b.isDirectory) {
                    return a.isDirectory ? -1 : 1;
                }
                if (sort.by === 'starred') {
                    if (a.starred !== b.starred) return a.starred ? -1 : 1;
                }
                let comparison = 0;
                switch (sort.by) {
                    case 'name':
                        comparison = a.fileName.localeCompare(b.fileName);
                        break;
                    case 'size':
                        if (!a.isDirectory && !b.isDirectory) {
                            comparison = a.fileSize - b.fileSize;
                        }
                        break;
                    case 'createdAt':
                    case 'starred':
                    default:
                        comparison = new Date(a.createdAt) - new Date(b.createdAt);
                        break;
                }
                return sort.order === 'asc' ? comparison : -comparison;
            });
    }, [filter, sort, allFiles, searchTerm, currentFolderId]);
    
    const { categoryData, trashedSize } = useMemo(() => {
        const categories = {
            foto: { icon: FiImage, label: 'Gambar', size: 0, color: 'bg-purple-500' },
            video: { icon: FiVideo, label: 'Video', size: 0, color: 'bg-indigo-500' },
            music: { icon: FiMusic, label: 'Audio', size: 0, color: 'bg-pink-500' },
            dokumen: { icon: FiFileText, label: 'Dokumen', size: 0, color: 'bg-blue-500' },
            arsip: { icon: FiArchive, label: 'Arsip', size: 0, color: 'bg-yellow-500' },
            apk: { icon: FiCpu, label: 'Aplikasi', size: 0, color: 'bg-green-500' },
        };
        let calculatedTrashedSize = 0;
        allFiles.forEach(file => {
            if (file.status === 'trashed') {
                calculatedTrashedSize += file.fileSize;
            } else if (!file.isDirectory && categories[file.category]) {
                categories[file.category].size += file.fileSize;
            }
        });
        return {
            categoryData: Object.values(categories).filter(cat => cat.size > 0).sort((a, b) => b.size - a.size),
            trashedSize: calculatedTrashedSize,
        };
    }, [allFiles]);

    const totalStorage = 10 * 1024 * 1024 * 1024;
    const usagePercentage = (totalSize / totalStorage) * 100;

    // ... (sisa fungsi handle tetap sama)
    const handleItemClick = (item, event) => {
        if (event.detail >= 2) {
            if (item.isDirectory) {
                setFolderPath(prev => [...prev, item]);
            } else {
                setSelectedFile(item);
            }
        }
    };
    const handleBreadcrumbClick = (index) => setFolderPath(prev => prev.slice(0, index + 1));
    const handleToggleSelect = (itemId) => setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    const handleSelectAll = () => setSelectedItems(selectedItems.length === filteredAndSortedFiles.length ? [] : filteredAndSortedFiles.map(f => f._id));
    const handleUpdateFile = async (updateData) => {
        const fileIdToUpdate = selectedFile?._id || updateData._id;
        if (!fileIdToUpdate) return;
        setAllFiles(prev => prev.map(f => f._id === fileIdToUpdate ? { ...f, ...updateData } : f));
        if (selectedFile) setSelectedFile(prev => ({ ...prev, ...updateData }));
        try {
            await updateFile(fileIdToUpdate, updateData);
            setNotification({ message: 'File berhasil diperbarui', type: 'success' });
            await fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal memperbarui file', type: 'error' });
            await fetchFiles();
        } finally {
            if (selectedFile) setSelectedFile(null);
        }
    };
    const handleDeleteConfirmation = () => {
        const itemsToDelete = allFiles.filter(f => selectedItems.includes(f._id));
        const title = filter === 'trash' ? `Hapus Permanen ${itemsToDelete.length} Item?` : `Hapus ${itemsToDelete.length} Item?`;
        const message = filter === 'trash' ? `Anda akan menghapus ${itemsToDelete.length} item secara permanen. Tindakan ini tidak dapat dibatalkan.` : `Anda akan memindahkan ${itemsToDelete.length} item ke tempat sampah.`;
        setDeleteConfirmation({ isOpen: true, items: itemsToDelete, title, message });
    };
    const executeDeleteAll = async () => {
        setIsDeleteAllModalOpen(false);
        try {
            await deleteAllFiles();
            setNotification({ message: 'Semua file berhasil dipindahkan ke sampah', type: 'success' });
            setSelectedItems([]);
            await fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal menghapus semua file', type: 'error' });
        }
    };
    const executeDelete = async () => {
        const itemsToDelete = deleteConfirmation.items;
        setDeleteConfirmation({ isOpen: false, items: [] });
        const isPermanent = filter === 'trash';
        try {
            for (const item of itemsToDelete) {
                await deleteFile(item._id, isPermanent);
            }
            const message = isPermanent ? `${itemsToDelete.length} item berhasil dihapus permanen` : `${itemsToDelete.length} item dipindahkan ke sampah`;
            setNotification({ message, type: 'success' });
            setSelectedItems([]);
            await fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal menghapus item.', type: 'error' });
        }
    };
    const handleCreateFolder = async (folderName) => {
        setCreateFolderModalOpen(false);
        try {
            await createFolder(folderName, currentFolderId);
            setNotification({ message: 'Folder berhasil dibuat', type: 'success' });
            await fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal membuat folder', type: 'error' });
        }
    };
    const handleMoveSelected = async (destinationFolderId) => {
        try {
            await moveFiles(selectedItems, destinationFolderId);
            setNotification({ message: 'Item berhasil dipindahkan', type: 'success' });
            setSelectedItems([]);
            await fetchFiles();
        } catch (error) {
            setNotification({ message: error.response?.data?.message || 'Gagal memindahkan item', type: 'error' });
        }
    };
    const handleRestoreAll = async () => {
        setIsRestoreAllModalOpen(false);
        try {
            await restoreAllFiles();
            setNotification({ message: 'Semua file berhasil dipulihkan', type: 'success' });
            await fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal memulihkan file', type: 'error' });
        }
    };
    const handleEmptyTrash = async () => {
        setIsEmptyTrashModalOpen(false);
        try {
            await emptyTrash();
            setNotification({ message: 'Tempat sampah berhasil dikosongkan', type: 'success' });
            await fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal mengosongkan sampah', type: 'error' });
        }
    };


    return (
        <div 
          className="flex flex-col lg:flex-row lg:items-start gap-8"
          style={{ height: 'calc(100vh - 65px - 4rem)' }} 
        >
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            <div className="lg:w-64 lg:flex-shrink-0">
                <div className="sticky top-0">
                    <Sidebar 
                        activeFilter={filter} 
                        setActiveFilter={setFilter} 
                        usagePercentage={usagePercentage} 
                        totalSize={totalSize}
                        onStorageDetailClick={() => setIsStorageModalOpen(true)}
                    />
                </div>
            </div>

            <main className="flex-1 min-w-0 flex flex-col h-full">
                <motion.div
                    className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">{filter === 'trash' ? 'File Sampah' : 'File Saya'}</h1>
                                <p className="text-gray-500">Total {filteredAndSortedFiles.length} item di sini.</p>
                            </div>
                            {filter !== 'trash' && (
                                <div className="flex items-center gap-2">
                                    <SortDropdown sort={sort} setSort={setSort} />
                                    <div className="flex items-center bg-gray-200 p-1 rounded-full">
                                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white text-blue-500 shadow' : 'text-gray-500'}`}><FiList/></button>
                                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-500 shadow' : 'text-gray-500'}`}><FiGrid/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                             <div className="relative flex-grow">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={filter === 'trash' ? "Cari di tempat sampah..." : "Cari file di folder ini..."}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {filter === 'trash' ? (
                                <>
                                    <motion.button onClick={() => setIsRestoreAllModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600">
                                        <FiRefreshCw /> <span>Pulihkan Semua</span>
                                    </motion.button>
                                    <motion.button onClick={() => setIsEmptyTrashModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600">
                                        <FiTrash /> <span>Kosongkan Sampah</span>
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <motion.button onClick={() => setCreateFolderModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600">
                                        <FiPlus /> <span>Folder Baru</span>
                                    </motion.button>
                                    <motion.button onClick={() => setIsDownloadAllModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600">
                                        <FiDownload /> <span>Unduh Semua</span>
                                    </motion.button>
                                    <motion.button onClick={() => setIsDeleteAllModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600">
                                        <FiTrash2 /> <span>Hapus Semua</span>
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {filter !== 'trash' && (
                            <div className="flex items-center text-sm text-gray-500 mb-4 p-1 bg-gray-100 rounded-lg flex-wrap">
                                {folderPath.map((folder, index) => (
                                    <div key={folder._id || 'root'} className="flex items-center">
                                        <motion.button onClick={() => handleBreadcrumbClick(index)} className="font-semibold px-3 py-1 rounded-md flex items-center gap-2 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700" whileTap={{ scale: 0.95 }}>
                                            {index === 0 ? <FiHome className="inline-block" /> : ''} {folder.fileName}
                                        </motion.button>
                                        {index < folderPath.length - 1 && <FiChevronRight className="mx-1 text-gray-400" />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedItems.length > 0 && (
                            <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="font-semibold text-blue-800">{selectedItems.length} item dipilih</p>
                                {filter !== 'trash' && (
                                    <motion.button onClick={() => setIsMoveModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 text-sm">
                                        <FiMove /> <span>Pindahkan</span>
                                    </motion.button>
                                )}
                                <motion.button onClick={handleDeleteConfirmation} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 text-sm">
                                    <FiTrash2 /> <span>{filter === 'trash' ? 'Hapus Permanen' : 'Hapus'}</span>
                                </motion.button>
                            </div>
                        )}

                        <div className="flex items-center px-4 py-2 mb-2">
                            <input type="checkbox" className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" onChange={handleSelectAll} checked={filteredAndSortedFiles.length > 0 && selectedItems.length === filteredAndSortedFiles.length} />
                            <label className="ml-3 text-sm font-medium text-gray-700">Pilih Semua</label>
                        </div>
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto pr-4">
                        {isLoading ? <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
                            : filteredAndSortedFiles.length > 0 ? (
                                <motion.div key={viewMode} className={`mt-4 ${viewMode === 'grid' && filter !== 'trash' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}`}>
                                    <AnimatePresence>
                                        {filteredAndSortedFiles.map(file => ((viewMode === 'list' || filter === 'trash')
                                            ? <FileListItem key={file._id} file={file} allFiles={allFiles} onItemClick={(e) => handleItemClick(file, e)} onToggleSelect={() => handleToggleSelect(file._id)} isSelected={selectedItems.includes(file._id)} />
                                            : <FileGridItem key={file._id} file={file} allFiles={allFiles} onItemClick={(e) => handleItemClick(file, e)} onToggleSelect={() => handleToggleSelect(file._id)} isSelected={selectedItems.includes(file._id)} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
                                    <FiFolder size={48} className="mb-4" />
                                    <p className="font-semibold">{filter === 'trash' ? 'Tempat Sampah Kosong' : 'Folder ini kosong'}</p>
                                </div>
                            )
                        }
                    </div>
                </motion.div>
                
                {/* Modals */}
                <StorageDetailModal isOpen={isStorageModalOpen} onClose={() => setIsStorageModalOpen(false)} totalSize={totalSize} categoryData={categoryData} trashedSize={trashedSize} />
                <FileDetailModal file={selectedFile} allFiles={allFiles} onClose={() => setSelectedFile(null)} onUpdateFile={handleUpdateFile}
                    onDeleteFile={(file) => {
                        setDeleteConfirmation({ isOpen: true, items: [file], title: `Hapus File "${file.fileName}"?`, message: `Anda akan memindahkan file ini ke tempat sampah.` });
                        setSelectedFile(null);
                    }}
                    onDownloadFile={(file) => downloadFile(file._id, file.fileName)}
                />
                <ConfirmationModal isOpen={deleteConfirmation.isOpen} onClose={() => setDeleteConfirmation({ isOpen: false, items: [] })} onConfirm={executeDelete} title={deleteConfirmation.title} message={deleteConfirmation.message} />
                <ConfirmationModal isOpen={isDeleteAllModalOpen} onClose={() => setIsDeleteAllModalOpen(false)} onConfirm={executeDeleteAll} title="Hapus Semua File?" message="Apakah Anda yakin ingin memindahkan SEMUA file Anda ke tempat sampah? Anda masih bisa memulihkannya nanti." />
                <ConfirmationModal isOpen={isRestoreAllModalOpen} onClose={() => setIsRestoreAllModalOpen(false)} onConfirm={handleRestoreAll} title="Pulihkan Semua File?" message="Semua item di tempat sampah akan dikembalikan ke lokasi aslinya." confirmText="Ya, Pulihkan" color="blue" />
                <ConfirmationModal isOpen={isEmptyTrashModalOpen} onClose={() => setIsEmptyTrashModalOpen(false)} onConfirm={handleEmptyTrash} title="Kosongkan Tempat Sampah?" message="Semua item akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan." confirmText="Ya, Hapus Permanen" color="red" />
                <MoveFilesModal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} onMove={handleMoveSelected} allFiles={allFiles.filter(f => f.status !== 'trashed')} currentFolderId={currentFolderId} />
                <NewFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setCreateFolderModalOpen(false)} onCreate={handleCreateFolder} />
                <DownloadAllModal isOpen={isDownloadAllModalOpen} onClose={() => setIsDownloadAllModalOpen(false)} allFiles={allFiles.filter(f => !f.isDirectory)} onDownload={downloadAllFiles} user={user} setNotification={setNotification} />
            </main>
        </div>
    );
};

const FileListItem = ({ file, onItemClick, onToggleSelect, isSelected, allFiles }) => (
    <motion.div
        layoutId={`file-card-${file._id}`}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
        className={`bg-white p-3 rounded-lg shadow-md border flex items-center gap-4 transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
        onClick={onItemClick}
    >
        <input type="checkbox" checked={isSelected} onChange={(e) => { e.stopPropagation(); onToggleSelect(); }} onClick={(e) => e.stopPropagation()} className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0" />
        <div className="flex-grow min-w-0 flex items-center gap-4 cursor-pointer">
            {getFileIcon(file, { className: "text-3xl" })}
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-800 truncate flex items-center gap-2">{file.fileName} {file.starred && <FiStar className="text-yellow-400 flex-shrink-0" />}</p>
                <p className="text-sm text-gray-500">{new Date(file.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-gray-600 font-medium flex-shrink-0 w-24 text-right">{!file.isDirectory ? formatBytes(file.fileSize) : `${allFiles.filter(f => f.parent === file._id).length} item`}</p>
        </div>
    </motion.div>
);

const FileGridItem = ({ file, onItemClick, onToggleSelect, isSelected, allFiles }) => (
    <motion.div
        layoutId={`file-card-${file._id}`}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
        whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
        className={`bg-white p-5 rounded-xl shadow-lg border flex flex-col items-center text-center cursor-pointer relative transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
        onClick={onItemClick}
    >
        <input type="checkbox" checked={isSelected} onChange={(e) => { e.stopPropagation(); onToggleSelect(); }} onClick={(e) => e.stopPropagation()} className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 absolute top-3 right-3 z-10" />
        {file.starred && <FiStar className="text-yellow-400 absolute top-3 left-3 z-10" />}
        <div className="relative w-full h-20 flex items-center justify-center">
            {getFileIcon(file, { className: 'text-6xl mx-auto' })}
        </div>
        <p className="mt-4 font-semibold text-gray-800 break-all w-full truncate">{file.fileName}</p>
        <p className="text-sm text-gray-500 mt-1">{!file.isDirectory ? formatBytes(file.fileSize) : `${allFiles.filter(f => f.parent === file._id).length} item`}</p>
    </motion.div>
);

export default MyFilesPage;