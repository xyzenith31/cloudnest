import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiHardDrive, FiActivity, FiLogOut } from 'react-icons/fi';

// Data dummy untuk statistik
const stats = [
  { icon: FiUsers, label: 'Total Pengguna', value: '1,250', growth: '+15%', color: 'blue' },
  { icon: FiFileText, label: 'Total File', value: '5,420', growth: '+8%', color: 'green' },
  { icon: FiHardDrive, label: 'Total Penyimpanan', value: '50.5 GB', growth: '+5%', color: 'indigo' },
  { icon: FiActivity, label: 'Aktivitas Hari Ini', value: '520', growth: '-2%', color: 'red' },
];

const StatCard = ({ icon: Icon, label, value, growth, color }) => {
  const isPositive = growth.startsWith('+');
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className={`bg-white p-6 rounded-xl border border-gray-200 shadow-md flex items-center space-x-4`}
    >
      <div className={`p-4 rounded-full bg-${color}-100 text-${color}-600`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-gray-500 font-medium">{label}</p>
        <div className="flex items-baseline space-x-2">
          <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
          <span className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {growth}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-4">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-gray-800">Selamat Datang, Admin!</h1>
        <p className="text-gray-500 mt-2">Berikut adalah ringkasan aktivitas di CloudNest.</p>
      </motion.div>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom kiri: Chart atau data lainnya */}
        <motion.div 
          className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-800">Grafik Pertumbuhan Pengguna</h3>
          <div className="mt-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Tempat untuk komponen grafik</p>
          </div>
        </motion.div>

        {/* Kolom kanan: Aktivitas Terbaru */}
        <motion.div 
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-800">Aktivitas Terbaru</h3>
          <ul className="mt-4 space-y-4">
            {/* Contoh aktivitas */}
            <li className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full"><FiUsers className="text-green-600"/></div>
              <p className="text-sm text-gray-600"><span className="font-bold">John Doe</span> baru saja mendaftar.</p>
            </li>
            <li className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full"><FiFileText className="text-blue-600"/></div>
              <p className="text-sm text-gray-600"><span className="font-bold">Jane Smith</span> mengunggah 3 file baru.</p>
            </li>
            <li className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full"><FiLogOut className="text-red-600"/></div>
              <p className="text-sm text-gray-600"><span className="font-bold">Admin</span> mengubah pengaturan sistem.</p>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;  