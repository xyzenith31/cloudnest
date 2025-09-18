import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiUsers, FiFileText, FiHardDrive, FiActivity, FiArrowUp, FiArrowDown, 
    FiFolder, FiClock, FiUploadCloud, FiServer, FiDatabase, FiShield,
    FiShare2, FiCloud, FiMail, FiRefreshCw // [BARU] Menambahkan ikon baru
} from 'react-icons/fi';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// --- DATA DUMMY ---
const stats = [
    { icon: FiUsers, label: 'Total Pengguna', value: '1,250', growth: 15, color: 'blue' },
    { icon: FiActivity, label: 'Pengguna Aktif', value: '312', growth: 5, color: 'teal' },
    { icon: FiFileText, label: 'Total File', value: '5,420', growth: 8, color: 'green' },
    { icon: FiUploadCloud, label: 'File Hari Ini', value: '128', growth: -10, color: 'sky' },
    { icon: FiHardDrive, label: 'Penyimpanan', value: '50.5 GB', growth: 2, color: 'indigo' },
    { icon: FiFolder, label: 'Total Folder', value: '890', growth: 7, color: 'purple' },
];
const chartData = [
    { name: 'Jan', Pengguna: 400, File: 240 }, { name: 'Feb', Pengguna: 300, File: 139 },
    { name: 'Mar', Pengguna: 500, File: 980 }, { name: 'Apr', Pengguna: 700, File: 390 },
    { name: 'Mei', Pengguna: 600, File: 480 }, { name: 'Jun', Pengguna: 800, File: 380 },
    { name: 'Jul', Pengguna: 900, File: 430 },
];
const storageDistributionData = [
    { name: 'Dokumen', value: 400 }, { name: 'Gambar', value: 300 },
    { name: 'Video', value: 300 }, { name: 'Lainnya', value: 200 },
];
const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#a855f7'];
const recentActivities = [
    { user: 'Donny Indra', action: 'mengunggah 2 file baru.', time: '10m lalu' },
    { user: 'Siti Aminah', action: 'baru saja mendaftar.', time: '30m lalu' },
    { user: 'Budi Santoso', action: 'menghapus folder "Lama".', time: '1j lalu' },
];
const recentUsers = [
    { name: 'Siti Aminah', email: 'siti.a@example.com', time: '30 menit lalu' },
    { name: 'Rizky Pratama', email: 'rizky.p@example.com', time: '2 jam lalu' },
    { name: 'Dewi Lestari', email: 'dewi.l@example.com', time: '5 jam lalu' },
];
// [DIPERBARUI] Menambahkan 4 status sistem baru
const systemStatus = [
    { name: 'Server Utama', status: 'Operational', icon: FiServer, color: 'green' },
    { name: 'Database', status: 'Operational', icon: FiDatabase, color: 'green' },
    { name: 'Server Upload', status: 'Latency Tinggi', icon: FiUploadCloud, color: 'orange' },
    { name: 'Autentikasi', status: 'Operational', icon: FiShield, color: 'green' },
    { name: 'API Gateway', status: 'Operational', icon: FiShare2, color: 'green' },
    { name: 'CDN Service', status: 'Operational', icon: FiCloud, color: 'green' },
    { name: 'Email Service', status: 'Maintenance', icon: FiMail, color: 'orange' },
    { name: 'Backup System', status: 'Operational', icon: FiRefreshCw, color: 'green' },
];

// Komponen Card Statistik
const StatCard = ({ icon: Icon, label, value, growth, color }) => {
    const isPositive = growth >= 0;
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center space-x-3"
      >
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}><Icon className="w-6 h-6" /></div>
        <div>
          <p className="text-gray-500 text-xs font-medium">{label}</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-lg font-bold text-gray-800">{value}</h2>
            <span className={`font-semibold text-xs flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <FiArrowUp size={12}/> : <FiArrowDown size={12}/>}
              {Math.abs(growth)}%
            </span>
          </div>
        </div>
      </motion.div>
    );
};

// Komponen Utama AdminBeranda
const AdminBeranda = () => {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800">Dasbor Admin</h1>
                <p className="text-gray-500 mt-1">Selamat datang di pusat kendali CloudNest.</p>
            </motion.div>
            
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                {stats.map((stat, index) => <motion.div key={index} variants={itemVariants}><StatCard {...stat} /></motion.div>)}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Kolom Kiri - 3/5 Lebar */}
                <div className="lg:col-span-3 space-y-6">
                    <motion.div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tren Pertumbuhan Platform</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                    <Tooltip contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <defs>
                                        <linearGradient id="colorPengguna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                        <linearGradient id="colorFile" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="Pengguna" stroke="#3b82f6" fill="url(#colorPengguna)" strokeWidth={2.5} />
                                    <Area type="monotone" dataKey="File" stroke="#22c55e" fill="url(#colorFile)" strokeWidth={2.5} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                    <motion.div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Sistem</h3>
                        {/* [DIRAPIKAN] Mengubah layout grid agar muat 8 item */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {systemStatus.map(sys => (
                                <div key={sys.name} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <sys.icon className={`w-8 h-8 ${sys.color === 'green' ? 'text-green-500' : 'text-orange-500'}`} />
                                    <p className="text-sm font-semibold mt-2 text-gray-700 text-center">{sys.name}</p>
                                    <p className={`text-xs font-bold ${sys.color === 'green' ? 'text-green-600' : 'text-orange-500'}`}>{sys.status}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Kolom Kanan - 2/5 Lebar */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Distribusi Penyimpanan</h3>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={storageDistributionData} innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                                        {storageDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '14px' }}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                    <motion.div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengguna Terbaru</h3>
                        <ul className="space-y-4">
                            {recentUsers.map((user, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex-shrink-0 flex items-center justify-center text-sm">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-auto">{user.time}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                        <ul className="space-y-4">
                            {recentActivities.map((activity, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full mt-0.5">
                                        <FiClock className="text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-tight">
                                            <span className="font-semibold text-gray-900">{activity.user}</span> {activity.action}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{activity.time}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminBeranda;