import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiSmile, FiEdit } from 'react-icons/fi';

import Card from '../components/Card';
import { CloudNestLogo } from '../components/Icons';
import CustomSelect from '../components/CustomSelect';
import Notification from '../components/Notification';
import { registerUser } from '../utils/mockApi';
import LoadingSpinner from '../components/LoadingSpinner';


const genderOptions = [
  { id: 0, name: 'Pilih Gender', value: '' },
  { id: 1, name: 'Laki-laki', value: 'Laki-laki' },
  { id: 2, name: 'Perempuan', value: 'Perempuan' },
  { id: 3, name: 'Lainnya', value: 'Lainnya' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { username, fullName, email, phone, age, password, confirmPassword } = formData;
    
    if (!username) return handleValidationError("Username belum diisi");
    if (!fullName) return handleValidationError("Nama lengkap belum diisi");
    if (!email) return handleValidationError("Email belum diisi");
    if (!phone) return handleValidationError("No. HP belum diisi");
    if (!age) return handleValidationError("Umur belum diisi");
    if (!selectedGender.value) return handleValidationError("Gender belum dipilih");
    if (!password) return handleValidationError("Password belum diisi");
    if (password !== confirmPassword) return handleValidationError("Password tidak cocok");

    try {
        const userData = { ...formData, gender: selectedGender.value };
        delete userData.confirmPassword;

        await registerUser(userData);
        setNotification({ message: 'Registrasi berhasil! Anda akan diarahkan ke halaman login.', type: 'success' });
        setTimeout(() => navigate('/'), 2000);

    } catch (error) {
        setNotification({ message: error.message, type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleValidationError = (message) => {
    setNotification({ message, type: 'error' });
    setIsLoading(false);
  }

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
          <h2 className="text-2xl font-semibold text-center text-sky-800">Buat Akun Baru</h2>
          
          <form className="mt-8 space-y-4" onSubmit={handleRegister} noValidate>
            <div className="relative"><FiUser className="form-icon" /><input name="username" placeholder="Username" type="text" className="form-input" value={formData.username} onChange={handleChange}/></div>
            <div className="relative"><FiEdit className="form-icon" /><input name="fullName" placeholder="Nama Lengkap" type="text" className="form-input" value={formData.fullName} onChange={handleChange}/></div>
            <div className="relative"><FiMail className="form-icon" /><input name="email" placeholder="Email" type="email" className="form-input" value={formData.email} onChange={handleChange}/></div>
            <div className="relative"><FiPhone className="form-icon" /><input name="phone" placeholder="No. HP" type="tel" className="form-input" value={formData.phone} onChange={handleChange}/></div>
            <div className="relative"><FiSmile className="form-icon" /><input name="age" placeholder="Umur" type="number" className="form-input" value={formData.age} onChange={handleChange}/></div>
            
            <CustomSelect 
              options={genderOptions}
              selected={selectedGender}
              onChange={setSelectedGender}
            />

            <div className="relative"><FiLock className="form-icon" /><input name="password" placeholder="Password" type="password" className="form-input" value={formData.password} onChange={handleChange}/></div>
            <div className="relative"><FiLock className="form-icon" /><input name="confirmPassword" placeholder="Konfirmasi Password" type="password" className="form-input" value={formData.confirmPassword} onChange={handleChange}/></div>
            
            <motion.button disabled={isLoading} whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(59, 130, 246, 0.5)" }} whileTap={{ scale: 0.95 }} className="w-full h-[48px] flex justify-center items-center font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md !mt-6 disabled:bg-blue-300 disabled:cursor-not-allowed" type="submit">
              {isLoading ? <LoadingSpinner /> : 'Register'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-sky-800/80">
            Sudah punya akun?{' '}
            <Link to="/" className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 relative inline-block transition-all duration-300 ease-in-out after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-sky-400 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
              Login di sini
            </Link>
          </p>
        </Card>
      </div>
      <style>{`
        .form-input{width:100%;padding-left:3rem;padding-right:1rem;padding-top:.75rem;padding-bottom:.75rem;background-color:#F3F4F6;border-radius:.5rem;color:#0c4a6e;transition:all .3s;border:1px solid #E5E7EB}
        .form-input::placeholder{color:#6B7280}
        .form-input:focus{outline:none;box-shadow:0 0 0 2px #3b82f6;border-color:#3b82f6}
        .form-icon{
            position:absolute;
            top:.875rem;
            left:1rem;
            color:#9CA3AF;
            z-index: 10; 
        }
      `}</style>
    </>
  );
};

export default RegisterPage;