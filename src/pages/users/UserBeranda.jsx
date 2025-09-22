import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, FiStar, FiClock, FiTrash2, FiShare2, FiFile, 
    FiHardDrive, FiGrid, FiList, FiFolder, FiUploadCloud 
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive } from 'react-icons/fa';

// --- DATA DUMMY (DIPERBANYAK UNTUK DEMO) ---
const files = [
  { id: 1, name: 'Proposal Proyek Inovasi.pdf', type: 'pdf', size: '2.3 MB', lastModified: '2 jam lalu', starred: true },
  { id: 2, name: 'Laporan Keuangan Q3.docx', type: 'word', size: '5.1 MB', lastModified: '1 hari lalu', starred: false },
  { id: 3, name: 'Aset Desain Landing Page.zip', type: 'archive', size: '25.8 MB', lastModified: '2 hari lalu', starred: false },
  { id: 4, name: 'Foto Produk - Batch 1.jpg', type: 'image', size: '1.2 MB', lastModified: '3 hari lalu', starred: true },
  { id: 5, name: 'Catatan Rapat Mingguan.pdf', type: 'pdf', size: '800 KB', lastModified: '5 hari lalu', starred: false },
  { id: 6, name: 'Revisi Kontrak Klien.docx', type: 'word', size: '1.5 MB', lastModified: '1 minggu lalu', starred: true },
  { id: 7, name: 'Presentasi Final.pdf', type: 'pdf', size: '12.3 MB', lastModified: '2 minggu lalu', starred: true },
  { id: 8, name: 'Logo Perusahaan Final.png', type: 'image', size: '300 KB', lastModified: '1 bulan lalu', starred: false },
];

const folders = [
    { id: 1, name: 'Dokumen Penting', fileCount: 12 },
    { id: 2, name: 'Proyek Klien A', fileCount: 34 },
    { id: 3, name: 'Materi Pemasaran', fileCount: 8 },
    { id: 4, name: 'Pribadi', fileCount: 5 },
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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 overflow-hidden">
      
      {/* --- EFEK GRADIENT BACKGROUND --- */}
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


      {/* --- HEADER --- */}
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

      {/* --- QUICK STATS --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard icon={FiFile} label="Total File" value="125" color="sky" />
        <StatCard icon={FiHardDrive} label="Penyimpanan" value="7.2/10 GB" color="green" />
        <StatCard icon={FiStar} label="File Bintang" value="12" color="yellow" />
        <StatCard icon={FiFolder} label="Total Folder" value="4" color="indigo" />
      </motion.div>

      {/* --- FOLDER SECTION --- */}
       <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Folder Anda</h2>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
            {folders.map(folder => (
                <motion.div
                    key={folder.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
                    className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-200/80 cursor-pointer"
                >
                    <div className="flex justify-between items-center">
                        <FiFolder className="text-3xl text-yellow-500"/>
                        <span className="font-bold text-gray-700">{folder.fileCount}</span>
                    </div>
                    <p className="mt-4 font-semibold text-gray-800">{folder.name}</p>
                </motion.div>
            ))}
        </motion.div>
      </div>


      {/* --- DAFTAR FILE --- */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">File Terbaru</h2>
            <div className='flex items-center gap-4 w-full md:w-auto'>
                <div className="relative w-full md:w-auto flex-grow">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Cari file..." className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200/80 bg-white/70 backdrop-blur-sm rounded-full focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                </div>
                <div className="flex items-center bg-gray-100 p-1 rounded-full">
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white shadow' : 'text-gray-500'}`}><FiList/></button>
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow' : 'text-gray-500'}`}><FiGrid/></button>
                </div>
            </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}
            >
              {files.map((file) => (
                viewMode === 'list' 
                  ? <FileListItem key={file.id} file={file} /> 
                  : <FileGridItem key={file.id} file={file} />
              ))}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- KOMPONEN KARTU STATISTIK ---
const StatCard = ({ icon: Icon, label, value, color }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring' } }
    };
    return (
        <motion.div variants={itemVariants} className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-${color}-200/50 flex items-center justify-between`}>
            <div>
                <p className={`text-sm font-medium text-${color}-600`}>{label}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`p-4 bg-${color}-100 rounded-full text-${color}-600 text-2xl`}>
                <Icon />
            </div>
        </motion.div>
    );
}

// --- KOMPONEN ITEM FILE (LIST VIEW) ---
const FileListItem = ({ file }) => (
    <motion.div
      layout
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
      whileHover={{ scale: 1.015, boxShadow: '0px 10px 25px -10px rgba(0, 0, 0, 0.1)', borderColor: '#60a5fa' }}
      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300"
    >
      <div className="flex items-center gap-4 w-full md:w-auto flex-grow">
        <div className="text-4xl">{getFileIcon(file.type)}</div>
        <div>
          <p className="font-semibold text-gray-800 break-all">{file.name}</p>
          <p className="text-sm text-gray-500">{file.size}</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full md:w-auto md:gap-6 text-gray-500 mt-2 md:mt-0">
        <div className="flex items-center gap-2 text-sm">
          <FiClock />
          <span>{file.lastModified}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2 text-lg">
          <ActionButton icon={FiStar} isStarred={file.starred} />
          <ActionButton icon={FiShare2} />
          <ActionButton icon={FiTrash2} isDelete />
        </div>
      </div>
    </motion.div>
);

// --- KOMPONEN ITEM FILE (GRID VIEW) ---
const FileGridItem = ({ file }) => (
    <motion.div
        layout
        variants={{ hidden: { y: 20, opacity: 0, scale: 0.9 }, visible: { y: 0, opacity: 1, scale: 1 } }}
        whileHover={{ y: -10, boxShadow: '0px 15px 30px -10px rgba(0, 0, 0, 0.15)', transition: { type: 'spring', stiffness: 300 } }}
        className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border flex flex-col items-center text-center cursor-pointer"
    >
        <div className="text-5xl mb-4">{getFileIcon(file.type)}</div>
        <p className="font-semibold text-gray-800 break-all w-full truncate">{file.name}</p>
        <p className="text-sm text-gray-500 mt-1">{file.size}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
            <FiClock size={12} />
            <span>{file.lastModified}</span>
        </div>
         <div className="flex items-center gap-2 mt-4 text-xl">
          <ActionButton icon={FiStar} isStarred={file.starred} />
          <ActionButton icon={FiShare2} />
          <ActionButton icon={FiTrash2} isDelete />
        </div>
    </motion.div>
);

// --- KOMPONEN TOMBOL AKSI ---
const ActionButton = ({ icon: Icon, isStarred, isDelete }) => (
    <motion.button 
        whileTap={{ scale: 0.85 }} 
        className={`p-2 rounded-full transition-colors duration-200 
            ${isStarred ? 'text-yellow-500 bg-yellow-100' : ''} 
            ${isDelete ? 'hover:bg-red-100 hover:text-red-600' : 'hover:bg-gray-200'}
        `}
    >
        <Icon />
    </motion.button>
);


export default UserBeranda;