import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiStar, FiClock, FiFile,
    FiHardDrive, FiGrid, FiList, FiFolder, FiUploadCloud, FiBell, FiEdit, FiShare2, FiTrash2
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive } from 'react-icons/fa';
import FileDetailModal from '../../components/FileDetailModal';

// --- DATA DUMMY ---
const files = [
  { id: 1, name: 'Proposal_Proyek.pdf', type: 'pdf', category: 'document', size: 2.3 * 1024 * 1024, date: '2023-10-26T10:00:00Z', createdAt: '2023-10-25T09:00:00Z', owner: 'Anda', starred: true },
  { id: 2, name: 'Laporan_Keuangan.docx', type: 'word', category: 'document', size: 5.1 * 1024 * 1024, date: '2023-10-25T14:30:00Z', createdAt: '2023-10-25T14:30:00Z', owner: 'Anda', starred: false },
  { id: 3, name: 'Aset_Desain.zip', type: 'archive', category: 'archive', size: 25.8 * 1024 * 1024, date: '2023-10-24T09:00:00Z', createdAt: '2023-10-24T09:00:00Z', owner: 'Anda', starred: false },
  { id: 4, name: 'Foto_Produk.jpg', type: 'image', category: 'photo', size: 1.2 * 1024 * 1024, date: '2023-10-23T18:45:00Z', createdAt: '2023-10-23T18:45:00Z', owner: 'Anda', starred: true, previewUrl: 'https://placehold.co/600x400/8b5cf6/white?text=Preview+Gambar' },
  { id: 5, name: 'Catatan_Rapat.pdf', type: 'pdf', category: 'document', size: 800 * 1024, date: '2023-10-22T11:20:00Z', createdAt: '2023-10-22T11:20:00Z', owner: 'Anda', starred: false },
  { id: 6, name: 'Kontrak_Klien.docx', type: 'word', category: 'document', size: 1.5 * 1024 * 1024, date: '2023-10-21T16:00:00Z', createdAt: '2023-10-21T16:00:00Z', owner: 'Anda', starred: true },
];

const folders = [
    { id: 1, name: 'Dokumen Penting', fileCount: 12 },
    { id: 2, name: 'Proyek Klien A', fileCount: 34 },
    { id: 3, name: 'Materi Pemasaran', fileCount: 8 },
    { id: 4, name: 'Pribadi', fileCount: 5 },
];

const activities = [
    { id: 1, user: 'Anda', action: 'mengunggah', file: 'Proposal_Proyek.pdf', time: '2 jam lalu', icon: FiUploadCloud, color: 'text-blue-500' },
    { id: 2, user: 'John Doe', action: 'membagikan', file: 'Analisis_Kompetitor.xlsx', time: '5 jam lalu', icon: FiShare2, color: 'text-green-500' },
    { id: 3, user: 'Anda', action: 'menghapus', file: 'Draft_lama.docx', time: '1 hari lalu', icon: FiTrash2, color: 'text-red-500' },
    { id: 4, user: 'Jane Smith', action: 'mengedit', file: 'Desain_UI_Kit.fig', time: '2 hari lalu', icon: FiEdit, color: 'text-yellow-500' },
]

// --- FUNGSI IKON ---
const getFileIcon = (type) => {
  switch (type) {
    case 'pdf': return <FaFilePdf className="text-red-500" />;
    case 'word': return <FaFileWord className="text-blue-500" />;
    case 'image': return <FaFileImage className="text-purple-500" />;
    case 'archive': return <FaFileArchive className="text-yellow-500" />;
    default: return <FiFile className="text-gray-500" />;
  }
};

// --- KOMPONEN UTAMA ---
const UserBeranda = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [allFiles, setAllFiles] = useState(files);

  const filteredFiles = useMemo(() =>
    allFiles.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, allFiles]
  );

  const handleUpdateFile = (updatedFile) => {
    setAllFiles(currentFiles => currentFiles.map(f => f.id === updatedFile.id ? updatedFile : f));
    setSelectedFile(updatedFile);
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
          className="fixed top-0 left-0 -z-10 w-full h-full bg-gradient-to-br from-sky-100 via-blue-50 to-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"
        />
        <motion.div
          className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-sky-200 rounded-full filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: '2s' }}
        />

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Selamat Datang, Donny!</h1>
            <p className="text-gray-500 mt-1">Kelola duniamu dalam satu tempat.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 25px -10px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold px-8 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 w-full md:w-auto justify-center"
          >
            <FiUploadCloud />
            <span>Upload Cepat</span>
          </motion.button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard icon={FiFile} label="Total File" value="125" color="sky" />
          <StorageStatCard used={7.2} total={10} unit="GB" />
          <StatCard icon={FiStar} label="File Berbintang" value="12" color="yellow" />
          <StatCard icon={FiFolder} label="Total Folder" value="4" color="indigo" />
        </motion.div>
        
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
                      <div className='flex items-center gap-4 w-full md:w-auto'>
                          <div className="relative w-full md:w-auto flex-grow">
                              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                  type="text" 
                                  placeholder="Cari file..." 
                                  className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200/80 bg-white/70 backdrop-blur-sm rounded-full focus:ring-2 focus:ring-blue-400 outline-none transition-all" 
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                              />
                          </div>
                          <div className="flex items-center bg-gray-100 p-1 rounded-full">
                              <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white shadow' : 'text-gray-500'}`}><FiList/></button>
                              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow' : 'text-gray-500'}`}><FiGrid/></button>
                          </div>
                      </div>
                  </div>

                  <motion.div
                    key={viewMode}
                    className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6' : 'space-y-3'}
                  >
                    <AnimatePresence>
                      {filteredFiles.map((file) => (
                        viewMode === 'list' 
                          ? <FileListItem key={file.id} file={file} onSelect={() => setSelectedFile(file)} /> 
                          : <FileGridItem key={file.id} file={file} onSelect={() => setSelectedFile(file)} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
              </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-8">
              <motion.div variants={itemVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Akses Cepat</h2>
                  <div className="grid grid-cols-2 gap-4">
                      {folders.map(folder => (
                          <motion.div
                              key={folder.id}
                              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
                              className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200/80 cursor-pointer"
                          >
                              <div className="flex justify-between items-start">
                                  <FiFolder className="text-3xl text-yellow-500"/>
                                  <span className="font-bold text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{folder.fileCount}</span>
                              </div>
                              <p className="mt-3 font-semibold text-gray-800">{folder.name}</p>
                          </motion.div>
                      ))}
                  </div>
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Aktivitas Terbaru</h2>
                  <div className="space-y-3">
                      {activities.map(act => (
                          <motion.div
                            key={act.id}
                            whileHover={{x: 5, transition: { type: 'spring', stiffness: 400 }}}
                            className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow border border-gray-200/50 flex items-start gap-3"
                          >
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                                  <act.icon className={act.color}/>
                              </div>
                              <p className="text-sm text-gray-600">
                                  <span className="font-semibold text-gray-800">{act.user}</span> {act.action} <span className="font-semibold text-blue-600">{act.file}</span>.
                                  <span className="block text-xs text-gray-400 mt-0.5">{act.time}</span>
                              </p>
                          </motion.div>
                      ))}
                  </div>
              </motion.div>
          </div>
        </div>
      </div>
      
      <FileDetailModal 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
        onUpdateFile={handleUpdateFile} 
      />
    </>
  );
};

// --- KOMPONEN KARTU STATISTIK ---
const StatCard = ({ icon: Icon, label, value, color }) => {
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' } }};
    const colors = {
        sky: { text: 'text-sky-600', bg: 'bg-sky-100', gradient: 'from-sky-500 to-cyan-400' },
        green: { text: 'text-green-600', bg: 'bg-green-100', gradient: 'from-green-500 to-emerald-400' },
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

// --- KOMPONEN KARTU PENYIMPANAN ---
const StorageStatCard = ({ used, total, unit }) => {
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' } }};
    const percentage = (used / total) * 100;
    return (
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                 <div>
                    <p className="text-sm font-medium text-green-600">Penyimpanan</p>
                    <p className="text-2xl font-bold text-gray-800">{used} <span className="text-lg font-medium text-gray-500">/ {total} {unit}</span></p>
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

// --- KOMPONEN ITEM FILE (LIST VIEW) ---
const FileListItem = ({ file, onSelect }) => (
    <motion.div
      layoutId={`file-card-${file.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.015, boxShadow: '0px 10px 25px -10px rgba(0, 0, 0, 0.1)', borderColor: '#60a5fa' }}
      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 flex-grow min-w-0">
        <div className="text-4xl">{getFileIcon(file.type)}</div>
        <div className='flex-grow min-w-0'>
          <p className="font-semibold text-gray-800 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">{file.size}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiClock />
          <span>{new Date(file.date).toLocaleDateString()}</span>
      </div>
    </motion.div>
);

// --- KOMPONEN ITEM FILE (GRID VIEW) ---
const FileGridItem = ({ file, onSelect }) => (
    <motion.div
        layoutId={`file-card-${file.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
        whileHover={{ y: -10, boxShadow: '0px 15px 30px -10px rgba(0, 0, 0, 0.15)', transition: { type: 'spring', stiffness: 300 } }}
        className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border flex flex-col items-center text-center cursor-pointer"
        onClick={onSelect}
    >
        <div className="text-5xl mb-4">{getFileIcon(file.type)}</div>
        <p className="font-semibold text-gray-800 break-all w-full truncate">{file.name}</p>
        <p className="text-sm text-gray-500 mt-1">{file.size}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
            <FiClock size={12} />
            <span>{new Date(file.date).toLocaleDateString()}</span>
        </div>
    </motion.div>
);

export default UserBeranda;