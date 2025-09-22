import React from 'react';
import { motion, useInView, useAnimate } from 'framer-motion';
import {
    FiUsers, FiFileText, FiHardDrive, FiActivity, FiArrowUp, FiArrowDown,
    FiServer, FiDatabase, FiUploadCloud, FiShield, FiTrendingUp, FiBarChart2
} from 'react-icons/fi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// --- [HOOK KUSTOM UNTUK ANIMASI ANGKA] ---
const useCountUp = (target) => {
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope, { once: true, margin: "-50px" });

    React.useEffect(() => {
        if (isInView) {
            animate(0, target, {
                duration: 1.5,
                onUpdate: (latest) => {
                    if (scope.current) {
                        scope.current.textContent = Math.round(latest).toLocaleString('id-ID');
                    }
                }
            });
        }
    }, [isInView, target, animate, scope]);

    return scope;
};

// --- [DATA DUMMY] ---
const stats = [
    { icon: FiUsers, label: 'Total Pengguna', value: 1250, growth: 15, color: 'blue' },
    { icon: FiFileText, label: 'Total File', value: 5420, growth: 8, color: 'green' },
    { icon: FiHardDrive, label: 'Penyimpanan Total', value: 51712, unit: 'MB', growth: 2, color: 'indigo' },
    { icon: FiActivity, label: 'Pengguna Aktif (24 Jam)', value: 312, growth: -5, color: 'sky' },
];
// ... (sisa data dummy tetap sama) ...
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

const systemStatus = [
    { name: 'Server Utama', status: 'Operational', icon: FiServer, color: 'green' },
    { name: 'Database', status: 'Operational', icon: FiDatabase, color: 'green' },
    { name: 'Server Upload', status: 'Latency Tinggi', icon: FiUploadCloud, color: 'orange' },
    { name: 'Sistem Autentikasi', status: 'Operational', icon: FiShield, color: 'green' },
];

// --- [KOMPONEN CARD STATISTIK (IKON DIPERBAIKI)] ---
const StatCard = ({ icon: Icon, label, value, unit, growth, color }) => {
    const isPositive = growth >= 0;
    const countUpRef = useCountUp(value);

    // [PERBAIKAN] Mendefinisikan class warna secara eksplisit
    const colorClasses = {
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        indigo: 'from-indigo-400 to-indigo-600',
        sky: 'from-sky-400 to-sky-600',
    };
    const statusColorClasses = {
        green: 'text-green-500',
        red: 'text-red-500'
    };
    const pulseColorClasses = {
        green: 'bg-green-500',
        orange: 'bg-orange-500'
    }

    return (
      <motion.div
        whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 flex items-center space-x-4 shadow-lg"
      >
        <div className={`p-4 rounded-full bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} text-white shadow-md`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
          <p className="text-slate-500 font-medium">{label}</p>
          <div className="flex items-baseline space-x-2">
            <h2 ref={countUpRef} className="text-3xl font-bold text-slate-800">0</h2>
            {unit && <span className="text-slate-600 font-semibold">{unit}</span>}
          </div>
           <span className={`font-semibold text-sm flex items-center mt-1 ${isPositive ? statusColorClasses.green : statusColorClasses.red}`}>
              {isPositive ? <FiArrowUp size={14} className="mr-1"/> : <FiArrowDown size={14} className="mr-1"/>}
              {Math.abs(growth)}% vs bulan lalu
            </span>
        </div>
      </motion.div>
    );
};


// --- [KOMPONEN UTAMA DASHBOARD ADMIN] ---
const AdminDashboard = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="p-2 md:p-4 space-y-8 bg-dots-slate-200">
            {/* Header */}
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <h1 className="text-4xl font-bold text-slate-800">Dasbor Admin CloudNest</h1>
                <p className="text-slate-500 mt-2 text-lg">Selamat datang kembali, Admin! Berikut adalah ringkasan aktivitas platform.</p>
            </motion.div>
            
            {/* Grid Statistik Utama */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </motion.div>

            {/* Grid Chart dan Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Kolom Kiri - Grafik Utama */}
                <motion.div
                    variants={itemVariants} initial="hidden" animate="visible"
                    className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-lg"
                >
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2"><FiTrendingUp /> Tren Pertumbuhan Platform</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip contentStyle={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                <Legend wrapperStyle={{ fontSize: '14px' }} />
                                <defs>
                                    <linearGradient id="colorPengguna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorFile" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="Pengguna" stroke="#3b82f6" fill="url(#colorPengguna)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }}/>
                                <Area type="monotone" dataKey="File" stroke="#22c55e" fill="url(#colorFile)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Kolom Kanan - Distribusi & Status */}
                <div className="space-y-8">
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-800 mb-2 flex items-center gap-2"><FiBarChart2 /> Distribusi Penyimpanan</h3>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={storageDistributionData} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                                        {storageDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Status Sistem</h3>
                        <ul className="space-y-3">
                            {systemStatus.map(sys => (
                                <li key={sys.name} className="flex items-center justify-between">
                                    <span className="flex items-center gap-3">
                                        {/* [PERBAIKAN] Class warna di sini juga diperbaiki */}
                                        <sys.icon className={`w-5 h-5 ${sys.color === 'green' ? 'text-green-500' : 'text-orange-500'}`} />
                                        <p className="font-medium text-slate-700">{sys.name}</p>
                                    </span>
                                    <span className={`flex items-center gap-2 text-sm font-bold ${sys.color === 'green' ? 'text-green-600' : 'text-orange-500'}`}>
                                        <span className={`h-2 w-2 rounded-full ${sys.color === 'green' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></span>
                                        {sys.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;