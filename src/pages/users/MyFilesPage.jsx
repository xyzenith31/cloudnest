import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiImage, FiVideo, FiFileText, FiArchive, FiGrid, FiList, FiStar, FiCpu, 
    FiAperture, FiSearch, FiHardDrive 
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SortDropdown from '../../components/SortDropdown';
import FileDetailModal from '../../components/FileDetailModal';

// --- DATA DUMMY (DENGAN DETAIL TAMBAHAN) ---
const initialFiles = [
  { id: 1, name: 'Proposal_Proyek.pdf', type: 'pdf', category: 'document', size: 2.3 * 1024 * 1024, date: '2023-10-26T10:00:00Z', createdAt: '2023-10-25T09:00:00Z', owner: 'Anda', starred: true },
  { id: 2, name: 'Laporan_Keuangan.docx', type: 'word', category: 'document', size: 5.1 * 1024 * 1024, date: '2023-10-25T14:30:00Z', createdAt: '2023-10-25T14:30:00Z', owner: 'Anda', starred: false },
  { id: 3, name: 'Aset_Desain.zip', type: 'archive', category: 'archive', size: 25.8 * 1024 * 1024, date: '2023-10-24T09:00:00Z', createdAt: '2023-10-24T09:00:00Z', owner: 'Anda', starred: false },
  { id: 4, name: 'Foto_Liburan.jpg', type: 'image', category: 'photo', size: 1.2 * 1024 * 1024, date: '2023-10-23T18:45:00Z', createdAt: '2023-10-23T18:45:00Z', owner: 'Anda', starred: true, previewUrl: 'https://placehold.co/600x400/8b5cf6/white?text=Preview+Gambar' },
  { id: 5, name: 'Video_Tutorial.mp4', type: 'video', category: 'video', size: 120.5 * 1024 * 1024, date: '2023-10-22T11:20:00Z', createdAt: '2023-10-22T11:20:00Z', owner: 'Anda', starred: false },
  { id: 6, name: 'CloudNestApp_v1.apk', type: 'apk', category: 'apk', size: 15.2 * 1024 * 1024, date: '2023-10-21T16:00:00Z', createdAt: '2023-10-21T16:00:00Z', owner: 'Anda', starred: false },
  { id: 7, name: 'Kontrak_Klien_Final.pdf', type: 'pdf', category: 'document', size: 1.5 * 1024 * 1024, date: '2023-10-20T13:10:00Z', createdAt: '2023-10-20T13:10:00Z', owner: 'Anda', starred: true },
];

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
  switch (type) {
    case 'pdf': return <FaFilePdf {...baseProps} className={`${baseProps.className} text-red-500`} />;
    case 'word': return <FaFileWord {...baseProps} className={`${baseProps.className} text-blue-500`} />;
    case 'image': return <FaFileImage {...baseProps} className={`${baseProps.className} text-purple-500`} />;
    case 'archive': return <FaFileArchive {...baseProps} className={`${baseProps.className} text-yellow-500`} />;
    case 'video': return <FaFileVideo {...baseProps} className={`${baseProps.className} text-indigo-500`} />;
    case 'apk': return <FaAndroid {...baseProps} className={`${baseProps.className} text-green-500`} />;
    default: return <FiFileText {...baseProps} className={`${baseProps.className} text-gray-500`} />;
  }
};

const Sidebar = ({ activeFilter, setActiveFilter, usagePercentage }) => {
    const filters = [
        { id: 'all', name: 'Semua Media', icon: FiAperture },
        { id: 'photo', name: 'Foto', icon: FiImage },
        { id: 'video', name: 'Video', icon: FiVideo },
        { id: 'document', name: 'Dokumen', icon: FiFileText },
        { id: 'apk', name: 'APK', icon: FiCpu },
        { id: 'archive', name: 'File Arsip', icon: FiArchive },
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
            {/* FITUR BARU: KARTU STORAGE RING */}
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

const MyFilesPage = () => {
  const [files, setFiles] = useState(initialFiles);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sort, setSort] = useState({ by: 'date', order: 'desc' });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpdateFile = (updatedFile) => {
    setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
    setSelectedFile(updatedFile);
  }

  const filteredAndSortedFiles = useMemo(() => {
    return files
      .filter(file => filter === 'all' || file.category === filter)
      .sort((a, b) => {
        if (sort.by === 'name') return sort.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        if (sort.by === 'size') return sort.order === 'asc' ? a.size - b.size : b.size - a.size;
        return sort.order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      });
  }, [filter, sort, files]);
  
  const totalStorage = 10 * 1024 * 1024 * 1024;
  const usedStorage = useMemo(() => files.reduce((acc, file) => acc + file.size, 0), [files]);
  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="flex gap-8 p-4 md:p-8">
      <Sidebar activeFilter={filter} setActiveFilter={setFilter} usagePercentage={usagePercentage} />
      <main className="flex-1 min-w-0">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center">
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
        </motion.div>
        
        <motion.div
          key={viewMode}
          className={`mt-8 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}`}
        >
          <AnimatePresence>
            {filteredAndSortedFiles.map(file => (
              viewMode === 'list' 
                ? <FileListItem key={file.id} file={file} onSelect={() => setSelectedFile(file)} /> 
                : <FileGridItem key={file.id} file={file} onSelect={() => setSelectedFile(file)} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        <FileDetailModal file={selectedFile} onClose={() => setSelectedFile(null)} onUpdateFile={handleUpdateFile} />
      </main>
    </div>
  );
};

const FileListItem = ({ file, onSelect }) => (
    <motion.div
      layoutId={`file-card-${file.id}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      className="bg-white p-3 rounded-lg shadow-md border flex items-center gap-4 cursor-pointer"
      onClick={onSelect}
    >
      {getFileIcon(file.type, {className: "text-3xl"})}
      <div className="flex-grow min-w-0">
        <p className="font-semibold text-gray-800 truncate">{file.name}</p>
        <p className="text-sm text-gray-500">{new Date(file.date).toLocaleDateString()}</p>
      </div>
      <p className="text-sm text-gray-600 font-medium flex-shrink-0">{formatBytes(file.size)}</p>
      {file.starred && <FiStar className="text-yellow-500 flex-shrink-0" />}
    </motion.div>
);

const FileGridItem = ({ file, onSelect }) => (
    <motion.div
      layoutId={`file-card-${file.id}`}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
      className="bg-white p-5 rounded-xl shadow-lg border flex flex-col items-center text-center cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative w-full">
        {getFileIcon(file.type, { className: 'text-6xl mx-auto' })}
        {file.starred && <FiStar className="text-yellow-400 absolute top-0 right-0 text-lg" />}
      </div>
      <p className="mt-4 font-semibold text-gray-800 break-all w-full truncate">{file.name}</p>
      <p className="text-sm text-gray-500 mt-1">{formatBytes(file.size)}</p>
    </motion.div>
);

export default MyFilesPage;