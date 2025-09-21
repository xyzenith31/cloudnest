import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEdit, FiUpload, FiSmile, FiTrash2, FiUsers, FiCheck } from 'react-icons/fi';
import { CgDanger } from 'react-icons/cg';
import { getUserById, updateUserWithAvatar } from '../../services/userService';
import Notification from '../../components/Notification';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProfileAdmin = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', noHp: '',
    age: '', gender: '', password: '', confirmPassword: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser._id) {
          const response = await getUserById(storedUser._id);
          const userData = response.data;
          setUser(userData);
          setFormData({ ...userData, password: '', confirmPassword: '' });
          if (userData.avatar) {
            setAvatarPreview(`http://localhost:3001/${userData.avatar}`);
          }
        }
      } catch (error) {
        setNotification({ message: 'Gagal memuat data pengguna', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsAvatarDeleted(false);
    }
  };
  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsAvatarDeleted(true);
    setNotification({ message: 'Foto profil akan dihapus saat disimpan.', type: 'info' });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Konfirmasi password tidak cocok', type: 'error' });
      return;
    }
    setIsSaving(true);
    
    const data = new FormData();
    const { confirmPassword, ...dataToSubmit } = formData;
    Object.keys(dataToSubmit).forEach(key => {
      if (key === 'password' && !dataToSubmit[key]) return;
      if (dataToSubmit[key] !== null) data.append(key, dataToSubmit[key]);
    });
    if (avatarFile) data.append('avatar', avatarFile);
    else if (isAvatarDeleted) data.append('avatar', ''); 
    
    try {
        const response = await updateUserWithAvatar(user._id, data);
        setNotification({ message: 'Profil berhasil diperbarui!', type: 'success' });
        const updatedUser = response.data;
        setUser(updatedUser);
        setFormData({ ...updatedUser, password: '', confirmPassword: '' });
        if (updatedUser.avatar) setAvatarPreview(`http://localhost:3001/${updatedUser.avatar}`);
        else setAvatarPreview(null);
        setIsAvatarDeleted(false);
    } catch (error) {
        const message = error.response?.data?.message || "Gagal memperbarui profil";
        setNotification({ message, type: 'error' });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDoNotMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="profile-admin-page">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
      <form onSubmit={handleSubmit}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
              <p className="text-gray-500 mt-1">Kelola informasi akun dan preferensi Anda di sini.</p>
            </div>
            <motion.button type="submit" disabled={isSaving} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-300 transition-all duration-300 disabled:bg-blue-300 disabled:shadow-none flex items-center justify-center min-w-[180px]">
              {isSaving ? <LoadingSpinner /> : 'Simpan Perubahan'}
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={avatarPreview || formData.name}
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${formData.name}&background=e0f2fe&color=0284c7&size=128&bold=true`}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md transition-all duration-300 group-hover:brightness-90"
                />
              </AnimatePresence>
              <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <FiUpload className="text-white text-3xl" />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-gray-500">@{formData.username}</p>
              <div className="flex gap-3 mt-4">
                <label htmlFor="avatar-upload" className="px-4 py-2 text-sm font-semibold bg-sky-100 text-sky-800 rounded-lg cursor-pointer hover:bg-sky-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    <FiUpload /> Ubah Foto
                </label>
                <input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
                {(avatarPreview || user?.avatar) && (
                  <motion.button type="button" onClick={handleDeleteAvatar} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2">
                    <FiTrash2 /> Hapus
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div><label className="form-label">Nama Lengkap</label><div className="input-wrapper"><FiEdit className="form-icon" /><input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} /></div></div>
              <div><label className="form-label">Username</label><div className="input-wrapper"><FiUser className="form-icon" /><input name="username" type="text" className="form-input" value={formData.username} onChange={handleChange} /></div></div>
              <div><label className="form-label">Email</label><div className="input-wrapper"><FiMail className="form-icon" /><input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} /></div></div>
              <div><label className="form-label">No. HP</label><div className="input-wrapper"><FiPhone className="form-icon" /><input name="noHp" type="tel" className="form-input" value={formData.noHp} onChange={handleChange} /></div></div>
              <div><label className="form-label">Umur</label><div className="input-wrapper"><FiSmile className="form-icon" /><input name="age" type="number" className="form-input" value={formData.age} onChange={handleChange} /></div></div>
              <div><label className="form-label">Gender</label><div className="input-wrapper"><FiUsers className="form-icon" /><select name="gender" value={formData.gender} onChange={handleChange} className="form-input w-full appearance-none"><option value="">Pilih Gender</option><option value="Male">Laki-laki</option><option value="Female">Perempuan</option><option value="Other">Lainnya</option></select></div></div>
            </div>
            <hr />
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Ubah Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="form-label">Password Baru</label>
                    <div className="input-wrapper">
                        <FiLock className="form-icon" />
                        <input name="password" placeholder="Kosongkan jika tidak diubah" type="password" className="form-input" value={formData.password} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="form-label">Konfirmasi Password Baru</label>
                    <div className="input-wrapper">
                        <FiLock className="form-icon" />
                        <input name="confirmPassword" placeholder="Ulangi password baru" type="password" className="form-input" value={formData.confirmPassword} onChange={handleChange} />
                        <AnimatePresence>
                           {passwordsMatch && <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"><FiCheck/></motion.div>}
                           {passwordsDoNotMatch && <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><CgDanger/></motion.div>}
                        </AnimatePresence>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </form>
      
      {/* [FIX] CSS disematkan di sini untuk memastikan posisinya benar */}
      <style>{`
        .profile-admin-page {
            background-color: #f3f4f6; /* bg-gray-100 */
            padding: 2rem;
            min-height: 100%;
        }
        .input-wrapper {
            position: relative;
        }
        .form-label {
            display: block;
            font-size: 0.875rem; /* 14px */
            font-weight: 600;
            color: #4b5563; /* gray-600 */
            margin-bottom: 0.5rem; /* 8px */
        }
        .form-input {
            width: 100%;
            padding-left: 2.75rem !important; /* 44px for icon */
            padding-right: 1rem;
            padding-top: 0.625rem; /* 10px */
            padding-bottom: 0.625rem;
            background-color: #f9fafb; /* bg-gray-50 */
            border: 1px solid #d1d5db; /* border-gray-300 */
            border-radius: 0.5rem; /* rounded-lg */
            color: #111827; /* text-gray-900 */
            transition: all 0.2s ease-in-out;
        }
        .form-input:focus {
            outline: none;
            border-color: #3b82f6; /* focus:border-blue-500 */
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* custom focus ring */
        }
        .form-icon {
            position: absolute;
            top: 50%;
            left: 0.75rem; /* 12px */
            transform: translateY(-50%);
            color: #9ca3af; /* text-gray-400 */
            z-index: 10;
            pointer-events: none; /* Agar ikon tidak bisa diklik */
        }
        select.form-input {
          padding-left: 2.75rem !important;
        }
      `}</style>
    </div>
  );
};

export default ProfileAdmin;