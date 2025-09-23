import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiImage, FiVideo, FiFileText, FiArchive, FiGrid, FiList, FiStar, FiCpu,
    FiAperture, FiSearch, FiHardDrive, FiDownload, FiTrash2, FiAlertTriangle, FiMusic, FiFolder, FiPlus, FiMove
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SortDropdown from '../../components/SortDropdown';
import FileDetailModal from '../../components/FileDetailModal';
import NewFolderModal from '../../components/NewFolderModal';
import { useAuth } from '../../context/AuthContext';
import { getUserFiles, deleteAllFiles, downloadAllFiles, deleteFile, downloadFile, createFolder, moveFiles, updateFile } from '../../services/fileService';
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

const getFileIcon = (type, props = {}) => {
  const baseProps = { className: "text-4xl flex-shrink-0", ...props };
  
  if (type === 'folder') return <FiFolder {...baseProps} className={`${baseProps.className} text-yellow-500`} />;

  const fileType = type.split('/')[0];
  const fileDetail = type.split('/')[1];

  if (fileType === 'image') return <FaFileImage {...baseProps} className={`${baseProps.className} text-purple-500`} />;
  if (fileType === 'audio') return <FiMusic {...baseProps} className={`${baseProps.className} text-pink-500`} />;
  if (fileType === 'video') return <FaFileVideo {...baseProps} className={`${baseProps.className} text-indigo-500`} />;
  if (fileDetail === 'pdf') return <FaFilePdf {...baseProps} className={`${baseProps.className} text-red-500`} />;
  if (type.includes('word')) return <FaFileWord {...baseProps} className={`${baseProps.className} text-blue-500`} />;
  if (type.includes('zip') || type.includes('rar')) return <FaFileArchive {...baseProps} className={`${baseProps.className} text-yellow-500`} />;
  if (type.includes('android')) return <FaAndroid {...baseProps} className={`${baseProps.className} text-green-500`} />;
  
  return <FiFileText {...baseProps} className={`${baseProps.className} text-gray-500`} />;
};


// --- Sidebar ---
const Sidebar = ({ activeFilter, setActiveFilter, usagePercentage }) => {
    const filters = [
        { id: 'all', name: 'Semua Media', icon: FiAperture },
        { id: 'foto', name: 'Foto', icon: FiImage },
        { id: 'video', name: 'Video', icon: FiVideo },
        { id: 'music', name: 'Musik', icon: FiMusic },
        { id: 'dokumen', name: 'Dokumen', icon: FiFileText },
        { id: 'apk', name: 'APK', icon: FiCpu },
        { id: 'arsip', name: 'File Arsip', icon: FiArchive },
    ];
    return (
        <motion.aside
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-64 space-y-6 sticky top-8 self-start"
        >
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
                <h3 className="px-4 pt-2 pb-4 text-lg font-bold text-gray-800">Kategori</h3>
                {filters.map(filter => (
                    <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 relative ${
                            activeFilter === filter.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {activeFilter === filter.id && <motion.div layoutId="activeFilterBubble" className="absolute inset-0 bg-blue-500 rounded-lg z-0"/>}
                        <filter.icon className="relative z-10"/>
                        <span className="relative z-10 font-semibold">{filter.name}</span>
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <h3 className="font-bold text-gray-800">Penyimpanan</h3>
                <div className="w-40 h-40 mx-auto relative flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={[{value: usagePercentage}, {value: 100 - usagePercentage}]} dataKey="value" innerRadius="80%" outerRadius="100%" startAngle={90} endAngle={450} cornerRadius={50}>
                                <Cell fill="#3b82f6"/>
                                <Cell fill="#e5e7eb"/>
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold text-blue-600">{Math.round(usagePercentage)}%</p>
                        <p className="text-sm text-gray-500">Terpakai</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
  
    return (
      <AnimatePresence>
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <FiAlertTriangle className="text-4xl text-red-500" />
            </div>
            <h2 className="text-xl font-bold my-4">{title}</h2>
            <p className="text-gray-600">{message}</p>
            <div className="flex justify-center gap-4 mt-6">
              <motion.button onClick={onClose} whileHover={{ scale: 1.05 }} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">
                Batal
              </motion.button>
              <motion.button onClick={onConfirm} whileHover={{ scale: 1.05 }} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold">
                Ya, Hapus
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
};


// --- Main Page Component ---
const MyFilesPage = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [totalSize, setTotalSize] = useState(0);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState({ by: 'date', order: 'desc' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedItems, setSelectedItems] = useState([]);
    const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, items: [] });
    const [currentFolder, setCurrentFolder] = useState(null); // Untuk navigasi folder

    const fetchFiles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getUserFiles();
            setFiles(response.data.files);
            setTotalSize(response.data.totalSize);
        } catch (error) {
            setNotification({ message: 'Gagal memuat file', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const filteredAndSortedFiles = useMemo(() => {
        return files
            .filter(file => 
                (file.parent === currentFolder) &&
                (filter === 'all' || file.category === filter) && 
                file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                if (sort.by === 'name') return sort.order === 'asc' ? a.fileName.localeCompare(b.fileName) : b.fileName.localeCompare(a.fileName);
                if (sort.by === 'size') return sort.order === 'asc' ? a.fileSize - b.fileSize : b.fileSize - a.fileSize;
                return sort.order === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [filter, sort, files, searchTerm, currentFolder]);

    const totalStorage = 10 * 1024 * 1024 * 1024; // 10 GB
    const usagePercentage = (totalSize / totalStorage) * 100;

    const handleItemClick = (item) => {
        if (item.isDirectory) {
            setCurrentFolder(item._id);
        } else {
            setSelectedFile(item);
        }
    };

    const handleToggleSelect = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredAndSortedFiles.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredAndSortedFiles.map(f => f._id));
        }
    };
    
    // --- Actions ---
    const handleDownloadAll = async () => {
        try {
            await downloadAllFiles(user.username);
        } catch (error) {
            setNotification({ message: 'Gagal mengunduh semua file', type: 'error' });
        }
    };
    
    const handleDeleteConfirmation = () => {
        const itemsToDelete = files.filter(f => selectedItems.includes(f._id));
        setDeleteConfirmation({ 
            isOpen: true, 
            items: itemsToDelete,
            title: `Hapus ${itemsToDelete.length} Item?`,
            message: `Anda akan menghapus ${itemsToDelete.length} item. Tindakan ini tidak dapat dibatalkan.`
        });
    };

    const executeDelete = async () => {
        const itemsToDelete = deleteConfirmation.items;
        try {
            for (const item of itemsToDelete) {
                await deleteFile(item._id);
            }
            setNotification({ message: `${itemsToDelete.length} item berhasil dihapus`, type: 'success' });
            fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal menghapus item', type: 'error' });
        } finally {
            setDeleteConfirmation({ isOpen: false, items: [] });
            setSelectedItems([]);
        }
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await createFolder(folderName, currentFolder);
            setNotification({ message: 'Folder berhasil dibuat', type: 'success' });
            fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal membuat folder', type: 'error' });
        } finally {
            setCreateFolderModalOpen(false);
        }
    };

    const handleMoveSelected = async () => {
        // Di sini Anda bisa membuka modal lain untuk memilih folder tujuan
        // Untuk saat ini, kita akan memindahkannya ke root (null)
        const destinationFolderId = null; 
        try {
            await moveFiles(selectedItems, destinationFolderId);
            setNotification({ message: 'Item berhasil dipindahkan', type: 'success' });
            fetchFiles();
            setSelectedItems([]);
        } catch (error) {
            setNotification({ message: 'Gagal memindahkan item', type: 'error' });
        }
    };
    
    const handleUpdateFile = async (updatedFile) => {
        try {
            await updateFile(updatedFile._id, {
                name: updatedFile.name,
                starred: updatedFile.starred,
            });
            setNotification({ message: 'File berhasil diperbarui', type: 'success' });
            fetchFiles();
        } catch (error) {
            setNotification({ message: 'Gagal memperbarui file', type: 'error' });
        }
    };
    

    return (
        <div className="flex gap-8 p-4 md:p-8">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <Sidebar activeFilter={filter} setActiveFilter={setFilter} usagePercentage={usagePercentage} />
            <main className="flex-1 min-w-0">
                <motion.div
                    className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">File Saya</h1>
                            <p className="text-gray-500">Total {filteredAndSortedFiles.length} item ditemukan.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <SortDropdown sort={sort} setSort={setSort} />
                            <div className="flex items-center bg-gray-200 p-1 rounded-full">
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white text-blue-500 shadow' : 'text-gray-500'}`}><FiList/></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-500 shadow' : 'text-gray-500'}`}><FiGrid/></button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8 flex-wrap">
                         <div className="relative flex-grow">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari file..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <motion.button onClick={() => setCreateFolderModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600">
                            <FiPlus />
                            <span>Folder Baru</span>
                        </motion.button>
                        {selectedItems.length > 0 && (
                            <>
                            <motion.button onClick={handleMoveSelected} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600">
                                <FiMove />
                                <span>Pindahkan</span>
                            </motion.button>
                             <motion.button onClick={handleDeleteConfirmation} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600">
                                <FiTrash2 />
                                <span>Hapus ({selectedItems.length})</span>
                            </motion.button>
                            </>
                        )}
                    </div>
                    
                    {isLoading ? <div className="flex justify-center p-10"><LoadingSpinner/></div> :
                    <>
                    <div className="flex items-center px-4 py-2">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            onChange={handleSelectAll}
                            checked={selectedItems.length > 0 && selectedItems.length === filteredAndSortedFiles.length}
                        />
                        <label className="ml-2">Pilih Semua</label>
                    </div>
                    <motion.div
                        key={viewMode}
                        className={`mt-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}`}
                    >
                        <AnimatePresence>
                            {filteredAndSortedFiles.map(file => (
                                viewMode === 'list'
                                    ? <FileListItem 
                                        key={file._id} 
                                        file={file} 
                                        onSelect={() => handleItemClick(file)} 
                                        onToggleSelect={() => handleToggleSelect(file._id)}
                                        isSelected={selectedItems.includes(file._id)}
                                      />
                                    : <FileGridItem 
                                        key={file._id} 
                                        file={file} 
                                        onSelect={() => handleItemClick(file)}
                                        onToggleSelect={() => handleToggleSelect(file._id)}
                                        isSelected={selectedItems.includes(file._id)}
                                      />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    </>
                    }
                </motion.div>

                <FileDetailModal 
                    file={selectedFile} 
                    onClose={() => setSelectedFile(null)} 
                    onUpdateFile={handleUpdateFile}
                    onDeleteFile={(file) => {
                        setDeleteConfirmation({ 
                            isOpen: true, 
                            items: [file],
                            title: `Hapus File "${file.fileName}"?`,
                            message: `Anda akan menghapus file ini secara permanen.`
                        });
                        setSelectedFile(null);
                    }}
                    onDownloadFile={(file) => downloadFile(file._id, file.fileName)}
                />

                <ConfirmationModal 
                    isOpen={deleteConfirmation.isOpen} 
                    onClose={() => setDeleteConfirmation({ isOpen: false, items: [] })} 
                    onConfirm={executeDelete} 
                    title={deleteConfirmation.title}
                    message={deleteConfirmation.message}
                />
                
                <NewFolderModal
                    isOpen={isCreateFolderModalOpen}
                    onClose={() => setCreateFolderModalOpen(false)}
                    onCreate={handleCreateFolder}
                />
            </main>
        </div>
    );
};

// --- Komponen Item File ---
const FileListItem = ({ file, onSelect, onToggleSelect, isSelected }) => (
    <motion.div
      layoutId={`file-card-${file._id}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      className={`bg-white p-3 rounded-lg shadow-md border flex items-center gap-4 transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
    >
      <input 
        type="checkbox" 
        checked={isSelected} 
        onChange={(e) => { e.stopPropagation(); onToggleSelect(); }} 
        className="form-checkbox h-5 w-5 text-blue-600 rounded" 
      />
      <div 
        className="flex-grow min-w-0 flex items-center gap-4 cursor-pointer"
        onClick={onSelect}
        onDoubleClick={onSelect}
      >
        {getFileIcon(file.isDirectory ? 'folder' : file.fileType, {className: "text-3xl"})}
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-gray-800 truncate">{file.fileName}</p>
          <p className="text-sm text-gray-500">{new Date(file.createdAt).toLocaleDateString()}</p>
        </div>
        <p className="text-sm text-gray-600 font-medium flex-shrink-0">{!file.isDirectory ? formatBytes(file.fileSize) : '-'}</p>
      </div>
    </motion.div>
);

const FileGridItem = ({ file, onSelect, onToggleSelect, isSelected }) => (
    <motion.div
      layoutId={`file-card-${file._id}`}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
      className={`bg-white p-5 rounded-xl shadow-lg border flex flex-col items-center text-center cursor-pointer relative transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
      onClick={onSelect}
      onDoubleClick={onSelect}
    >
       <input 
        type="checkbox" 
        checked={isSelected} 
        onChange={(e) => { e.stopPropagation(); onToggleSelect(); }} 
        onClick={(e) => e.stopPropagation()}
        className="form-checkbox h-5 w-5 text-blue-600 rounded absolute top-3 right-3 z-10" 
      />
      <div className="relative w-full">
        {getFileIcon(file.isDirectory ? 'folder' : file.fileType, { className: 'text-6xl mx-auto' })}
      </div>
      <p className="mt-4 font-semibold text-gray-800 break-all w-full truncate">{file.fileName}</p>
      <p className="text-sm text-gray-500 mt-1">{!file.isDirectory ? formatBytes(file.fileSize) : '-'}</p>
    </motion.div>
);


export default MyFilesPage;