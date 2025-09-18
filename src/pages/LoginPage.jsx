import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock } from 'react-icons/fi';

import Card from '../components/Card';
import { CloudNestLogo } from '../components/Icons';
import Notification from '../components/Notification';
import { loginUser } from '../utils/mockApi';
import LoadingSpinner from '../components/LoadingSpinner';


const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

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
        const user = await loginUser({ identifier, password });
        setNotification({ message: `Login berhasil! Selamat datang, ${user.fullName}.`, type: 'success' });

        setTimeout(() => {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }, 1500);

    } catch (error) {
        setNotification({ message: error.message, type: 'error' });
        setIsLoading(false);
    }
  };

  return (
    <>
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
             {/* Efek Link diperbarui di sini */}
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