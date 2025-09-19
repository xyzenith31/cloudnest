import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiUser, FiMail, FiLock, FiShield, FiUserX, FiPhone, FiSmile } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import Notification from '../../components/Notification';
import CustomSelect from '../../components/CustomSelect';
import { getAllUsers, registerUserApi, updateUser, deleteUser, banUser } from '../../services/authService';

const genderOptions = [
  { id: 0, name: 'Pilih Gender', value: '' },
  { id: 1, name: 'Male', value: 'Male' },
  { id: 2, name: 'Female', value: 'Female' },
  { id: 3, name: 'Other', value: 'Other' },
];

const roleOptions = [
    { id: 1, name: 'User', value: 'user' },
    { id: 2, name: 'Admin', value: 'admin' },
];

const ManajemenPengguna = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setNotification({ message: 'Gagal memuat data pengguna', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleAddOrUpdateUser = async (userData) => {
    setIsLoading(true);
    closeModal();
    try {
      if (editingUser) {
        await updateUser(editingUser._id, userData);
        setNotification({ message: 'Pengguna berhasil diperbarui', type: 'success' });
      } else {
        await registerUserApi(userData);
        setNotification({ message: 'Pengguna berhasil ditambahkan', type: 'success' });
      }
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan';
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    closeDeleteModal();
    try {
      await deleteUser(userToDelete._id);
      setNotification({ message: 'Pengguna berhasil dihapus', type: 'success' });
      fetchUsers();
    } catch (error) {
      setNotification({ message: 'Gagal menghapus pengguna', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    setIsLoading(true);
    try {
        await banUser(userId);
        setNotification({ message: 'Status ban pengguna berhasil diubah', type: 'success' });
        fetchUsers();
    } catch (error) {
        setNotification({ message: 'Gagal mengubah status ban', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {notification.message && (
        <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pengguna</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg"
        >
          <FiPlus />
          <span>Tambah Pengguna</span>
        </motion.button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        {isLoading && !isModalOpen ? <LoadingSpinner/> : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">Nama Lengkap</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-200 text-indigo-800' : 'bg-green-200 text-green-800'}`}>
                        {user.role}
                    </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isBanned ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {user.isBanned ? 'Banned' : 'Aktif'}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"><FiEdit size={18}/></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleBanUser(user._id)} className={`${user.isBanned ? 'text-green-500' : 'text-yellow-500'} p-2 rounded-full hover:bg-yellow-100`}><FiUserX size={18}/></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openDeleteModal(user)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"><FiTrash2 size={18}/></motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <UserModal
            user={editingUser}
            onClose={closeModal}
            onSubmit={handleAddOrUpdateUser}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            onClose={closeDeleteModal}
            onConfirm={handleDeleteUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const UserModal = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: user ? user.username : '',
    name: user ? user.name : '',
    email: user ? user.email : '',
    noHp: user ? user.noHp : '',
    age: user ? user.age : '',
    password: '',
    confirmPassword: '',
  });

  const [selectedGender, setSelectedGender] = useState(
    user ? genderOptions.find(g => g.value === user.gender) || genderOptions[0] : genderOptions[0]
  );
  const [selectedRole, setSelectedRole] = useState(
    user ? roleOptions.find(r => r.value === user.role) || roleOptions[0] : roleOptions[0]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        gender: selectedGender.value,
        role: selectedRole.value,
    };
    onSubmit(finalData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{user ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative"><FiUser className="absolute top-3.5 left-4 text-gray-400" /><input name="username" placeholder="Username" type="text" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.username} onChange={handleChange}/></div>
            <div className="relative"><FiUser className="absolute top-3.5 left-4 text-gray-400" /><input name="name" placeholder="Nama Lengkap" type="text" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.name} onChange={handleChange}/></div>
            <div className="relative"><FiMail className="absolute top-3.5 left-4 text-gray-400" /><input name="email" placeholder="Email" type="email" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.email} onChange={handleChange}/></div>
            <div className="relative"><FiPhone className="absolute top-3.5 left-4 text-gray-400" /><input name="noHp" placeholder="No. HP" type="tel" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.noHp} onChange={handleChange}/></div>
            <div className="relative"><FiSmile className="absolute top-3.5 left-4 text-gray-400" /><input name="age" placeholder="Umur" type="number" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.age} onChange={handleChange}/></div>
            
            <CustomSelect options={genderOptions} selected={selectedGender} onChange={setSelectedGender} />
            <CustomSelect options={roleOptions} selected={selectedRole} onChange={setSelectedRole} />

            <div className="relative"><FiLock className="absolute top-3.5 left-4 text-gray-400" /><input name="password" placeholder={user ? "Password Baru (opsional)" : "Password"} type="password" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.password} onChange={handleChange}/></div>
            <div className="relative"><FiLock className="absolute top-3.5 left-4 text-gray-400" /><input name="confirmPassword" placeholder="Konfirmasi Password" type="password" className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg" value={formData.confirmPassword} onChange={handleChange}/></div>

          <div className="flex justify-end gap-4 pt-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200">Batal</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-500">Simpan</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hapus Pengguna</h2>
        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat diurungkan.</p>
        <div className="flex justify-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200">Tidak</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onConfirm} className="px-6 py-2 rounded-lg text-white bg-red-500">Hapus</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManajemenPengguna;