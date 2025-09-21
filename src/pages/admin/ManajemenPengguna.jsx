import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiSearch, FiEdit, FiTrash2, FiSlash, FiCheckCircle } from 'react-icons/fi';
import { getAllUsers, deleteUser, updateUserWithAvatar, banUser } from '../../services/userService';
import Notification from '../../components/Notification';
import LoadingSpinner from '../../components/LoadingSpinner';

// Komponen Modal sebagai dasar
const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

const ManajemenPengguna = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // State untuk Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  // Mengambil data pengguna saat komponen dimuat
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setNotification({ message: 'Gagal memuat data pengguna', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Logika untuk membuka modal
  const openEditModal = (user) => { setSelectedUser(user); setIsEditModalOpen(true); };
  const openDeleteModal = (user) => { setSelectedUser(user); setIsDeleteModalOpen(true); };
  const openBanModal = (user) => { setSelectedUser(user); setIsBanModalOpen(true); };

  // Logika untuk menutup semua modal
  const closeModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsBanModalOpen(false);
  };
  
  // Handler untuk aksi dari modal
  const handleDeleteUser = async () => {
    try {
        await deleteUser(selectedUser._id);
        setNotification({ message: 'Pengguna berhasil dihapus', type: 'success' });
        fetchUsers(); // Muat ulang data
    } catch (error) {
        setNotification({ message: 'Gagal menghapus pengguna', type: 'error' });
    } finally {
        closeModal();
    }
  };

  const handleBanUser = async (banData) => {
    try {
        await banUser(selectedUser._id, banData);
        setNotification({ message: `Status ban pengguna berhasil diperbarui`, type: 'success' });
        fetchUsers();
    } catch (error) {
        setNotification({ message: 'Gagal memperbarui status ban', type: 'error' });
    } finally {
        closeModal();
    }
  };
  
  // Filter pengguna berdasarkan pencarian
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3"><FiUsers />Manajemen Pengguna</h1>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari pengguna..." 
              className="pl-10 pr-4 py-2 border rounded-full w-64 focus:ring-2 focus:ring-blue-400 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <motion.tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50" layout>
                    <td className="p-4 flex items-center gap-3">
                        <img src={user.avatar ? `http://localhost:3001/${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></td>
                    <td className="p-4">{user.isBanned ? <span className="text-red-500 font-bold">Banned</span> : <span className="text-green-500">Aktif</span>}</td>
                    <td className="p-4 text-center">
                        <button onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700 p-2"><FiEdit /></button>
                        <button onClick={() => openDeleteModal(user)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 /></button>
                        <button onClick={() => openBanModal(user)} className={`p-2 ${user.isBanned ? 'text-green-500 hover:text-green-700' : 'text-yellow-600 hover:text-yellow-800'}`}>
                            {user.isBanned ? <FiCheckCircle /> : <FiSlash />}
                        </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <Modal onClose={closeModal}>
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold">{selectedUser?.name}</span>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Batal</button>
              <button onClick={handleDeleteUser} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Hapus</button>
            </div>
          </Modal>
        )}
        {isBanModalOpen && <BanModal user={selectedUser} onClose={closeModal} onConfirm={handleBanUser} />}
        {isEditModalOpen && <EditModal user={selectedUser} onClose={closeModal} onUpdate={fetchUsers} setNotification={setNotification} />}

      </AnimatePresence>
    </>
  );
};

// --- Komponen Modal Ban ---
const BanModal = ({ user, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState(1);
    const [unit, setUnit] = useState('hari');

    if (user.isBanned) {
        return (
            <Modal onClose={onClose}>
                <h2 className="text-xl font-bold mb-4">Konfirmasi Unban</h2>
                <p>Apakah Anda yakin ingin membuka blokir (unban) untuk pengguna <span className="font-semibold">{user.name}</span>?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Batal</button>
                    <button onClick={() => onConfirm({})} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">Unban</button>
                </div>
            </Modal>
        )
    }

    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">Blokir Pengguna: {user.name}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Durasi Blokir</label>
                    <div className="flex gap-2">
                        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="form-input w-1/2" min="1"/>
                        <select value={unit} onChange={e => setUnit(e.target.value)} className="form-input w-1/2">
                            <option value="hari">Hari</option>
                            <option value="minggu">Minggu</option>
                            <option value="bulan">Bulan</option>
                            <option value="tahun">Tahun</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Alasan</label>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows="3" className="form-input w-full" placeholder="Contoh: Melanggar aturan komunitas"></textarea>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Batal</button>
                <button onClick={() => onConfirm({ reason, duration, unit })} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Blokir Pengguna</button>
            </div>
        </Modal>
    );
};

// --- Komponen Modal Edit (Mirip dengan ProfileAdmin.jsx) ---
const EditModal = ({ user, onClose, onUpdate, setNotification }) => {
    // Kodenya sama persis dengan ProfileAdmin, hanya disajikan dalam bentuk modal
    const [formData, setFormData] = useState({ name: '', username: '', email: '', noHp: '', age: '', gender: '', password: '', confirmPassword: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData({ ...user, password: '', confirmPassword: ''});
        if (user.avatar) {
            setAvatarPreview(`http://localhost:3001/${user.avatar}`);
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            setNotification({ message: 'Konfirmasi password tidak cocok', type: 'error' });
            return;
        }
        setIsLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });
        if (avatarFile) data.append('avatar', avatarFile);
        
        try {
            await updateUserWithAvatar(user._id, data);
            setNotification({ message: 'Profil berhasil diperbarui!', type: 'success' });
            onUpdate(); // Panggil fungsi untuk refresh data di tabel
            onClose();
        } catch (error) {
            setNotification({ message: error.response?.data?.message || "Gagal memperbarui profil", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-bold mb-6">Edit Pengguna: {user.name}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="username" placeholder="Username" type="text" className="form-input" value={formData.username} onChange={handleChange}/>
                    <input name="email" placeholder="Email" type="email" className="form-input" value={formData.email} onChange={handleChange}/>
                    <input name="name" placeholder="Nama Lengkap" type="text" className="form-input" value={formData.name} onChange={handleChange}/>
                    <input name="noHp" placeholder="No. HP" type="tel" className="form-input" value={formData.noHp} onChange={handleChange}/>
                    <input name="age" placeholder="Umur" type="number" className="form-input" value={formData.age} onChange={handleChange}/>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-input w-full">
                        <option value="">Pilih Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="password" placeholder="Password Baru (opsional)" type="password" className="form-input" value={formData.password} onChange={handleChange}/>
                    <input name="confirmPassword" placeholder="Konfirmasi Password" type="password" className="form-input" value={formData.confirmPassword} onChange={handleChange}/>
                 </div>
                 <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Batal</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">{isLoading ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
            </form>
        </Modal>
    );
};


export default ManajemenPengguna;