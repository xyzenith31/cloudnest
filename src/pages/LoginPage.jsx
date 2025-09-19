import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiAlertTriangle } from 'react-icons/fi';

import Card from '../components/Card';
import { CloudNestLogo } from '../components/Icons';
import Notification from '../components/Notification';
import LoadingSpinner from '../components/LoadingSpinner';
import { loginUserApi } from '../services/authService';

// Komponen baru untuk Modal Ban
const BannedModal = ({ banInfo, onClose }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(banInfo.banUntil) - +new Date();
            let timeLeftData = {};

            if (difference > 0) {
                timeLeftData = {
                    hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    menit: Math.floor((difference / 1000 / 60) % 60),
                    detik: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeftData;
        };

        const timer = setInterval(() => {
            const timeLeftData = calculateTimeLeft();
            if (Object.keys(timeLeftData).length > 0) {
                setTimeLeft(`${timeLeftData.hari}h ${timeLeftData.jam}j ${timeLeftData.menit}m ${timeLeftData.detik}d`);
            } else {
                setTimeLeft('Akses dipulihkan.');
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [banInfo.banUntil]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
        >
            <motion.div
                initial={{ y: -50, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 50, scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-8 w-full max-w-md text-center"
            >
                <FiAlertTriangle className="text-5xl text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Akun Diblokir</h2>
                <p className="text-gray-600 mb-4">Alasan: <span className="font-semibold">{banInfo.banReason}</span></p>
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                    <p className="font-semibold text-red-700">Akses akan terbuka dalam:</p>
                    <p className="text-2xl font-bold text-red-800 tracking-wider">{timeLeft}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-8 py-2.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                    Saya Mengerti
                </motion.button>
            </motion.div>
        </motion.div>
    );
};


const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [banInfo, setBanInfo] = useState(null); // <-- State baru untuk info ban

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    if (!identifier || !password) {
        setNotification({ message: 'Semua field harus diisi', type: 'error'});
        setIsLoading(false);
        return;
    }

    try {
        const response = await loginUserApi({ identifier, password });
        const user = response.data;
        localStorage.setItem('userToken', user.token);
        
        setNotification({ message: `Login berhasil! Selamat datang, ${user.name}.`, type: 'success' });

        setTimeout(() => {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/beranda');
            }
        }, 1500);

    } catch (error) {
        // --- LOGIKA BARU UNTUK MENANGANI BAN ---
        if (error.response && error.response.status === 403) {
            setBanInfo({
                banReason: error.response.data.banReason,
                banUntil: error.response.data.banUntil,
            });
        } else {
            const errorMessage = error.response?.data?.message || 'Login gagal. Periksa kembali data Anda.';
            setNotification({ message: errorMessage, type: 'error' });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
        <AnimatePresence>
            {banInfo && <BannedModal banInfo={banInfo} onClose={() => setBanInfo(null)} />}
        </AnimatePresence>
        
        <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
        />
        <div className="flex flex-col items-center">
            <Card>
                <div className="flex items-center justify-center mb-6 text-4xl font-bold text-sky-900 drop-shadow-lg">
                    <CloudNestLogo />
                </div>
                <h2 className="text-2xl font-semibold text-center text-sky-800">Selamat Datang Kembali!</h2>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="relative">
                    <FiUser className="absolute top-3.5 left-4 text-gray-400" />
                    <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Username, Email, atau No. HP" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg text-sky-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-gray-200 focus:border-blue-400" type="text" />
                    </div>
                    <div className="relative">
                    <FiLock className="absolute top-3.5 left-4 text-gray-400" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg text-sky-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-gray-200 focus:border-blue-400" type="password" />
                    </div>
                    <motion.button disabled={isLoading} whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(59, 130, 246, 0.5)" }} whileTap={{ scale: 0.95 }} className="w-full h-[48px] flex justify-center items-center font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed" type="submit">
                    {isLoading ? <LoadingSpinner /> : 'Login'}
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-sky-800/80">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 relative inline-block transition-all duration-300 ease-in-out after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-sky-400 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
                    Daftar di sini
                    </Link>
                </p>
            </Card>
        </div>
    </>
  );
};

export default LoginPage;