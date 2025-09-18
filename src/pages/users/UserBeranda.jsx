import React from 'react';
import { motion } from 'framer-motion';
// PERBAIKAN: Menambahkan FiFile dan FiHardDrive di sini
import { FiPlus, FiSearch, FiStar, FiClock, FiTrash2, FiShare2, FiFile, FiHardDrive } from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';

const files = [
  { name: 'Dokumen Proposal.pdf', type: 'pdf', size: '2.3 MB', lastModified: '2 jam lalu', starred: true },
  { name: 'Presentasi Proyek.docx', type: 'word', size: '5.1 MB', lastModified: '1 hari lalu', starred: false },
  { name: 'Gambar Produk.jpg', type: 'image', size: '1.2 MB', lastModified: '3 hari lalu', starred: true },
  { name: 'Laporan Keuangan.pdf', type: 'pdf', size: '800 KB', lastModified: '5 hari lalu', starred: false },
];

const getFileIcon = (type) => {
  switch (type) {
    case 'pdf': return <FaFilePdf className="text-red-500" />;
    case 'word': return <FaFileWord className="text-blue-500" />;
    case 'image': return <FaFileImage className="text-purple-500" />;
    default: return <FiFile className="text-gray-500" />;
  }
};

const UserBeranda = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Selamat Datang Kembali, Donny!</h1>
          <p className="text-gray-500">Kelola file Anda dengan mudah dan cepat.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(59, 130, 246, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
        >
          <FiPlus />
          <span>Upload File</span>
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500">Total File</p>
                <p className="text-3xl font-bold text-sky-800">125</p>
            </div>
            <div className="p-3 bg-sky-100 rounded-full text-sky-600 text-2xl"><FiFile /></div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500">Penyimpanan Terpakai</p>
                <p className="text-3xl font-bold text-green-800">7.2 / 10 GB</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600 text-2xl"><FiHardDrive /></div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500">File Berbintang</p>
                <p className="text-3xl font-bold text-yellow-800">12</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 text-2xl"><FiStar /></div>
        </motion.div>
      </motion.div>

      {/* Recent Files */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">File Terbaru</h2>
            <div className="relative w-full md:w-auto">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Cari file..." className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {files.map((file, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: '0px 10px 25px -10px rgba(0, 0, 0, 0.1)',
                borderColor: '#60a5fa'
              }}
              className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-300"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-3xl">{getFileIcon(file.type)}</div>
                <div>
                  <p className="font-semibold text-gray-800 break-all">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full md:w-auto md:gap-6 text-gray-500">
                <div className="flex items-center gap-2 text-sm">
                  <FiClock />
                  <span>{file.lastModified}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 text-lg">
                  <motion.button whileTap={{ scale: 0.9 }} className={`p-2 rounded-full hover:bg-yellow-100 ${file.starred ? 'text-yellow-500' : 'hover:text-yellow-600'}`}><FiStar /></motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-600"><FiShare2 /></motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-red-100 text-red-500"><FiTrash2 /></motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UserBeranda;