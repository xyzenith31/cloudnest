import React, { useState, useEffect, useRef } from 'react'; // useRef ditambahkan
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiPhone, FiLock, FiEdit, FiUpload, FiSmile, FiTrash2,
  FiUsers, FiCheck, FiSave, FiEye, FiEyeOff, FiCalendar, FiMonitor,
  FiSmartphone, FiLogOut, FiShield, FiX, FiAlertTriangle
} from 'react-icons/fi';
import { CgDanger } from 'react-icons/cg';
import { getUserById, updateUserWithAvatar } from '../../services/userService';
import Notification from '../../components/Notification';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomSelect from '../../components/CustomSelect';

// Komponen Input Field Kustom (tidak ada perubahan)
const InputField = ({ icon: Icon, name, label, ...props }) => (
  <div className="relative">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <motion.input
        id={name} name={name} whileFocus={{ boxShadow: "0 0 0 2px #60a5fa" }}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
        {...props}
      />
    </div>
  </div>
);


const ProfileAdmin = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', noHp: '',
    age: '', gender: '', password: '', confirmPassword: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  
  // --- STATE & REF BARU UNTUK AUTO-UPLOAD AVATAR ---
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const genderOptions = [
    { id: 1, name: 'Laki-laki', value: 'Male' },
    { id: 2, name: 'Perempuan', value: 'Female' },
    { id: 3, name: 'Lainnya', value: 'Other' },
  ];
  
  const [devices, setDevices] = useState([
    { id: 1, name: 'Chrome on Windows', ip: '103.12.34.56', last_active: 'Saat ini aktif', icon: FiMonitor, current: true },
    { id: 2, name: 'Safari on iPhone 14', ip: '182.45.67.89', last_active: '2 jam lalu', icon: FiSmartphone },
  ]);
  const [deviceToRemove, setDeviceToRemove] = useState(null);

  const handleRemoveDevice = (device) => {
    setDevices(devices.filter(d => d.id !== device.id));
    setDeviceToRemove(null);
    setNotification({ message: `Sesi pada ${device.name} berhasil dihentikan.`, type: 'success' });
  };
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser._id) {
          const response = await getUserById(storedUser._id);
          const userData = response.data;
          setUser(userData);
          setFormData({ ...userData, password: '', confirmPassword: '' });
          setSelectedGender(genderOptions.find(g => g.value === userData.gender) || null);
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
  const handleGenderChange = (selectedOption) => {
    setSelectedGender(selectedOption);
    setFormData({ ...formData, gender: selectedOption.value });
  };
  
  // --- [IMPROVED] FUNGSI BARU UNTUK MENANGANI UPDATE AVATAR ---
  const handleAvatarUpdate = async (newAvatarFile) => {
      setIsAvatarUploading(true);
      const data = new FormData();

      // Lampirkan data user yang ada, tapi tanpa password jika tidak diubah
      Object.keys(formData).forEach(key => {
          if (!['password', 'confirmPassword'].includes(key)) {
              data.append(key, formData[key]);
          }
      });

      if (newAvatarFile) {
          data.append('avatar', newAvatarFile);
      } else {
          // [MODIFIED] Kirim sinyal hapus yang lebih jelas ke backend
          data.append('deleteAvatar', 'true');
      }

      try {
          const response = await updateUserWithAvatar(user._id, data);
          const updatedUser = response.data;
          setUser(updatedUser);
          // Pastikan state formData juga diupdate dengan data terbaru
          setFormData(prev => ({ ...prev, ...updatedUser, password: '', confirmPassword: '' }));
          if (updatedUser.avatar) {
              setAvatarPreview(`http://localhost:3001/${updatedUser.avatar}`);
          } else {
              setAvatarPreview(null);
          }
          setNotification({ message: 'Foto profil berhasil diperbarui!', type: 'success' });
      } catch (error) {
          setNotification({ message: error.response?.data?.message || "Gagal memperbarui foto profil", type: 'error' });
      } finally {
          setIsAvatarUploading(false);
      }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // Langsung tampilkan preview
      await handleAvatarUpdate(file); // Langsung upload
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarPreview(null); // Langsung hapus preview
    await handleAvatarUpdate(null); // Langsung kirim perintah hapus
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Konfirmasi password tidak cocok', type: 'error' });
      return;
    }
    setIsConfirmModalOpen(true);
  };
  
  const executeSave = async () => {
    setIsSaving(true);
    setIsConfirmModalOpen(false);
    const data = new FormData();
    const { confirmPassword, ...dataToSubmit } = formData;
    Object.keys(dataToSubmit).forEach(key => {
      if (key === 'password' && !dataToSubmit[key]) return;
      if (dataToSubmit[key] !== null) data.append(key, dataToSubmit[key]);
    });
    if (avatarFile) data.append('avatar', avatarFile);
    
    try {
        const response = await updateUserWithAvatar(user._id, data);
        setNotification({ message: 'Profil berhasil diperbarui!', type: 'success' });
        const updatedUser = response.data;
        setUser(updatedUser);
        setFormData({ ...updatedUser, password: '', confirmPassword: '' });
        if (updatedUser.avatar) setAvatarPreview(`http://localhost:3001/${updatedUser.avatar}`);
        else setAvatarPreview(null);
    } catch (error) {
        setNotification({ message: error.response?.data?.message || "Gagal memperbarui profil", type: 'error' });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;

  const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1, transition: { staggerChildren: 0.1 } }, out: { opacity: 0 }};
  const itemVariants = { initial: { y: 20, opacity: 0 }, in: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }};
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDoNotMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <>
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
      <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-screen flex flex-col">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Pengaturan Profil</h1>
              <p className="text-gray-500 mt-1">Perbarui foto dan detail personal Anda di sini.</p>
            </div>
            <motion.button form="profile-form" type="submit" disabled={isSaving || isAvatarUploading} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center min-w-[180px]">
              {isSaving ? <LoadingSpinner /> : <><FiSave className="mr-2"/> Simpan Perubahan</>}
            </motion.button>
        </motion.div>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-1 flex flex-col space-y-8">
                <motion.div variants={itemVariants} className="h-full">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border text-center h-full flex flex-col">
                      {/* --- [IMPROVED] AREA AVATAR DENGAN EFEK LOADING --- */}
                      <div className="relative w-32 h-32 mx-auto group">
                          <motion.img key={avatarPreview} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            src={avatarPreview || `https://ui-avatars.com/api/?name=${formData.name}&background=e0f2fe&color=0284c7&size=128&bold=true`}
                            alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                          />
                          <label onClick={() => !isAvatarUploading && avatarInputRef.current.click()} className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <FiUpload className="text-white text-3xl" />
                          </label>
                          <input ref={avatarInputRef} id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
                          
                          <AnimatePresence>
                            {isAvatarUploading && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center"
                                >
                                    <LoadingSpinner />
                                </motion.div>
                            )}
                          </AnimatePresence>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mt-4">{formData.name}</h2>
                      <p className="text-gray-500">@{formData.username}</p>
                      <div className="flex justify-center gap-3 mt-4">
                          <button onClick={() => avatarInputRef.current.click()} disabled={isAvatarUploading} className="px-4 py-2 text-sm font-semibold bg-sky-100 text-sky-800 rounded-lg cursor-pointer hover:bg-sky-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                              <FiUpload /> Ubah Foto
                          </button>
                          {avatarPreview && (
                            <button onClick={handleDeleteAvatar} disabled={isAvatarUploading} className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                              <FiTrash2 /> Hapus
                            </button>
                          )}
                      </div>
                      <div className="mt-6 pt-6 border-t text-left text-sm text-gray-600 space-y-3 flex-grow">
                          <p className="flex items-center gap-3"><FiMail className="text-gray-400"/> {formData.email}</p>
                          <p className="flex items-center gap-3"><FiPhone className="text-gray-400"/> {formData.noHp}</p>
                          <p className="flex items-center gap-3"><FiCalendar className="text-gray-400"/> Bergabung pada {user && user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                      </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Perangkat Terhubung</h3>
                        {devices.find(d => d.current) && (
                            <p className="text-sm text-gray-500 mb-4">
                                Saat ini aktif di <span className="font-semibold text-gray-700">{devices.find(d => d.current).name}</span>.
                            </p>
                        )}
                        <motion.button onClick={() => setIsDevicesModalOpen(true)} whileTap={{scale: 0.98}} className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                            Kelola Sesi
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <motion.form id="profile-form" onSubmit={handleSubmit} variants={itemVariants} className="lg:col-span-2 flex flex-col space-y-8">
                {/* Sisanya sama... */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border h-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField icon={FiEdit} label="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} />
                        <InputField icon={FiUser} label="Username" name="username" value={formData.username} onChange={handleChange} />
                        <InputField icon={FiMail} label="Email" name="email" value={formData.email} onChange={handleChange} />
                        <InputField icon={FiPhone} label="No. HP" name="noHp" value={formData.noHp} onChange={handleChange} />
                        <InputField icon={FiSmile} label="Umur" name="age" type="number" value={formData.age} onChange={handleChange} />
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
                            <CustomSelect
                                options={genderOptions}
                                selected={selectedGender}
                                onChange={handleGenderChange}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border h-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Keamanan</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="relative">
                          <InputField icon={FiLock} label="Password Baru" name="password" placeholder="Kosongkan jika tidak diubah" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                            {showPassword ? <FiEye /> : <FiEyeOff />}
                          </button>
                        </div>
                         <div className="relative">
                            <InputField icon={FiLock} label="Konfirmasi Password" name="confirmPassword" placeholder="Ulangi password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} />
                            <div className="absolute right-3 top-[38px] flex items-center space-x-2">
                              <AnimatePresence>
                                {passwordsMatch && <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="text-green-500"><FiCheck/></motion.div>}
                                {passwordsDoNotMatch && <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="text-red-500"><CgDanger/></motion.div>}
                              </AnimatePresence>
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                              </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.form>
        </div>
      </motion.div>
      
      {/* Semua Modal (tidak ada perubahan signifikan kecuali styling di 'Kelola Sesi') */}
      <AnimatePresence>{/* ... modal-modal lainnya ... */}</AnimatePresence>
      <AnimatePresence>
        {isDevicesModalOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
              <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-5 border-b">
                  <h4 className="text-lg font-bold text-gray-800">Sesi Aktif ({devices.length})</h4>
                  <button onClick={() => setIsDevicesModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full"><FiX/></button>
                </div>
                <ul className="space-y-1 p-3 max-h-96 overflow-y-auto">
                {devices.map(device => (
                    <li key={device.id} className="flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <device.icon className={`text-3xl flex-shrink-0 ${device.current ? 'text-green-500' : 'text-gray-500'}`}/>
                            <div>
                                <p className="font-semibold text-gray-800">{device.name}</p>
                                <p className={`text-sm ${device.current ? 'text-green-600' : 'text-gray-500'}`}>{device.last_active}</p>
                            </div>
                        </div>
                        {!device.current && (
                            <motion.button onClick={() => setDeviceToRemove(device)} whileTap={{scale:0.9}} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100" title="Logout from this device">
                                <FiLogOut/>
                            </motion.button>
                        )}
                    </li>
                ))}
                </ul>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deviceToRemove && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
               <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
                   <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                       <FiShield className="text-4xl text-red-500"/>
                   </div>
                   <h2 className="text-xl font-bold my-4">Hentikan Sesi Aktif?</h2>
                   <p className="text-gray-600">Anda akan keluar dari <span className="font-semibold">{deviceToRemove.name}</span>. Anda harus login kembali pada perangkat tersebut.</p>
                   <div className="flex justify-center gap-4 mt-6">
                       <motion.button onClick={() => setDeviceToRemove(null)} whileHover={{scale:1.05}} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Batal</motion.button>
                       <motion.button onClick={() => handleRemoveDevice(deviceToRemove)} whileHover={{scale:1.05}} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold">Ya, Hentikan</motion.button>
                   </div>
               </motion.div>
             </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isConfirmModalOpen && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
               <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
                   <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
                       <FiSave className="text-4xl text-sky-500"/>
                   </div>
                   <h2 className="text-xl font-bold my-4">Simpan Perubahan?</h2>
                   <p className="text-gray-600">Apakah Anda yakin ingin menyimpan perubahan pada profil Anda?</p>
                   <div className="flex justify-center gap-4 mt-6">
                       <motion.button onClick={() => setIsConfirmModalOpen(false)} whileHover={{scale:1.05}} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Batal</motion.button>
                       <motion.button onClick={executeSave} whileHover={{scale:1.05}} className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold">Ya, Simpan</motion.button>
                   </div>
               </motion.div>
             </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileAdmin;