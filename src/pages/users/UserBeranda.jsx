import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiStar, FiClock, FiFile,
    FiHardDrive, FiGrid, FiList, FiFolder, FiUploadCloud, FiBell, FiEdit, FiShare2, FiTrash2
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive } from 'react-icons/fa';
import FileDetailModal from '../../components/FileDetailModal';
import { getUserFiles } from '../../services/fileService';
import { useAuth } from '../../context/AuthContext';
import { useUpload } from '../../context/UploadContext';
import LoadingSpinner from '../../components/LoadingSpinner';

// --- FUNGSI BANTU ---
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (type) => {
  if (!type) return <FiFile className="text-gray-500" />;
  if (type.startsWith('image/')) return <FaFileImage className="text-purple-500" />;
  if (type === 'application/pdf') return <FaFilePdf className="text-red-500" />;
  if (type.includes('word')) return <FaFileWord className="text-blue-500" />;
  if (type.includes('zip') || type.includes('archive')) return <FaFileArchive className="text-yellow-500" />;
  return <FiFile className="text-gray-500" />;
};


// --- KOMPONEN UTAMA ---
const UserBeranda = () => {
  const { user } = useAuth();
  // [PERBAIKAN] Ambil setPopupOpen dan setPopupMinimized dari konteks
  const { setPopupOpen, setPopupMinimized } = useUpload();
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [stats, setStats] = useState({
      totalFiles: 0,
      totalSize: 0,
      starredFiles: 0,
      totalFolders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getUserFiles();
            const filesData = response.data.files;
            setAllFiles(filesData);
            setStats({
                totalFiles: filesData.filter(f => !f.isDirectory).length,
                totalSize: response.data.totalSize,
                starredFiles: filesData.filter(f => f.starred).length,
                totalFolders: filesData.filter(f => f.isDirectory).length,
            });
        } catch (error) {
            console.error("Gagal mengambil data beranda:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredFiles = useMemo(() =>
    allFiles
      .filter(file => !file.isDirectory && file.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    [searchTerm, allFiles]
  );
  
  const quickAccessFolders = useMemo(() => 
    allFiles.filter(file => file.isDirectory), 
    [allFiles]
  );
  
  // [PERBAIKAN] Fungsi ini sekarang hanya membuka popup
  const handleQuickUploadClick = () => {
      setPopupOpen(true);
      setPopupMinimized(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 space-y-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Selamat Datang, {user?.name}!</h1>
            <p className="text-gray-500 mt-1">Kelola duniamu dalam satu tempat.</p>
          </div>
          <motion.button
            onClick={handleQuickUploadClick}
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 25px -10px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold px-8 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 w-full md:w-auto justify-center"
          >
            <FiUploadCloud />
            <span>Upload Cepat</span>
          </motion.button>
        </motion.div>

        {isLoading ? <div className="flex justify-center p-10"><LoadingSpinner/></div> : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard icon={FiFile} label="Total File" value={stats.totalFiles} color="sky" />
          <StorageStatCard usedBytes={stats.totalSize} />
          <StatCard icon={FiStar} label="File Berbintang" value={stats.starredFiles} color="yellow" />
          <StatCard icon={FiFolder} label="Total Folder" value={stats.totalFolders} color="indigo" />
        </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                animate="visible"
                className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50"
              >
                  <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
                      <h2 className="text-2xl font-semibold text-gray-700">File Terbaru</h2>
                  </div>

                  <motion.div
                    key={viewMode}
                    className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6' : 'space-y-3'}
                  >
                    <AnimatePresence>
                      {filteredFiles.map((file) => (
                        viewMode === 'list' 
                          ? <FileListItem key={file._id} file={file} onSelect={() => setSelectedFile(file)} /> 
                          : <FileGridItem key={file._id} file={file} onSelect={() => setSelectedFile(file)} />
                      ))}
                    </AnimatePresence>
                     {filteredFiles.length === 0 && !isLoading && (
                        <p className="text-center text-gray-400 py-4 col-span-full">Tidak ada file terbaru.</p>
                     )}
                  </motion.div>
              </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-8">
              <motion.div variants={itemVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Akses Cepat</h2>
                  <div className="grid grid-cols-2 gap-4">
                      {quickAccessFolders.map(folder => (
                          <motion.div
                              key={folder._id}
                              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
                              className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200/80 cursor-pointer"
                          >
                              <div className="flex justify-between items-start">
                                  <FiFolder className="text-3xl text-yellow-500"/>
                                  <span className="font-bold text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{allFiles.filter(f => f.parent === folder._id).length}</span>
                              </div>
                              <p className="mt-3 font-semibold text-gray-800 truncate">{folder.fileName}</p>
                          </motion.div>
                      ))}
                      {quickAccessFolders.length === 0 && !isLoading && (
                          <p className="text-center text-gray-400 py-4 col-span-full">Belum ada folder.</p>
                      )}
                  </div>
              </motion.div>
          </div>
        </div>
      </div>
      
      <FileDetailModal 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
      />
    </>
  );
};

// ... Sisa komponen (StatCard, StorageStatCard, FileListItem, FileGridItem) tetap sama ...
const StatCard = ({ icon: Icon, label, value, color }) => {
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' } }};
    const colors = {
        sky: { text: 'text-sky-600', bg: 'bg-sky-100', gradient: 'from-sky-500 to-cyan-400' },
        yellow: { text: 'text-yellow-600', bg: 'bg-yellow-100', gradient: 'from-yellow-500 to-amber-400' },
        indigo: { text: 'text-indigo-600', bg: 'bg-indigo-100', gradient: 'from-indigo-500 to-violet-400' },
    };
    return (
        <motion.div variants={itemVariants} className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${colors[color].text}`}>{label}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <motion.div whileHover={{scale: 1.1, rotate: 5}} className={`p-4 rounded-full text-white text-2xl bg-gradient-to-br ${colors[color].gradient}`}>
                    <Icon />
                </motion.div>
            </div>
        </motion.div>
    );
}

const StorageStatCard = ({ usedBytes }) => {
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' } }};
    const totalBytes = 10 * 1024 * 1024 * 1024;
    const percentage = (usedBytes / totalBytes) * 100;
    return (
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                 <div>
                    <p className="text-sm font-medium text-green-600">Penyimpanan</p>
                    <p className="text-2xl font-bold text-gray-800">{formatBytes(usedBytes)} <span className="text-lg font-medium text-gray-500">/ 10 GB</span></p>
                </div>
                 <motion.div whileHover={{scale: 1.1, rotate: 5}} className="p-4 rounded-full text-white text-2xl bg-gradient-to-br from-green-500 to-emerald-400">
                    <FiHardDrive />
                </motion.div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    )
}

const FileListItem = ({ file, onSelect }) => (
    <motion.div
      layoutId={`file-card-${file._id}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.015, boxShadow: '0px 10px 25px -10px rgba(0, 0, 0, 0.1)', borderColor: '#60a5fa' }}
      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 flex-grow min-w-0">
        <div className="text-4xl">{getFileIcon(file.fileType)}</div>
        <div className='flex-grow min-w-0'>
          <p className="font-semibold text-gray-800 truncate">{file.fileName}</p>
          <p className="text-sm text-gray-500">{formatBytes(file.fileSize)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiClock />
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
);

const FileGridItem = ({ file, onSelect }) => (
    <motion.div
        layoutId={`file-card-${file._id}`}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
        whileHover={{ y: -10, boxShadow: '0px 15px 30px -10px rgba(0, 0, 0, 0.15)', transition: { type: 'spring', stiffness: 300 } }}
        className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border flex flex-col items-center text-center cursor-pointer"
        onClick={onSelect}
    >
        <div className="text-5xl mb-4">{getFileIcon(file.fileType)}</div>
        <p className="font-semibold text-gray-800 break-all w-full truncate">{file.fileName}</p>
        <p className="text-sm text-gray-500 mt-1">{formatBytes(file.fileSize)}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
            <FiClock size={12} />
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>
    </motion.div>
);

export default UserBeranda;