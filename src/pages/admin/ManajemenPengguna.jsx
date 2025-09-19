import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit, FiUser, FiMail, FiLock, FiShield, FiPhone, FiSmile } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import Notification from '../../components/Notification';
import CustomSelect from '../../components/CustomSelect';
import { registerUserApi } from '../../services/authService';
import { getAllUsers, updateUser } from '../../services/userService';

const genderOptions = [
    { id: 0, name: 'Pilih Gender', value: '' },
    { id: 1, name: 'Male', value: 'Male' },
    { id: 2, name: 'Female', value: 'Female' },
    { id: 3, name: 'Other', value: 'Other' },
];

const roleOptions = [
    { id: 0, name: 'Pilih Role', value: '' },
    { id: 1, name: 'User', value: 'user' },
    { id: 2, name: 'Admin', value: 'admin' },
];

// Komponen helper untuk konsistensi form
const FormField = ({ icon: Icon, name, type, placeholder, value, onChange }) => (
    <div className="relative">
        <Icon className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 z-10" />
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-transparent focus:border-blue-400"
        />
    </div>
);

const ManajemenPengguna = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    //
    // TODO: Implement real-time user status tracking (e.g., using WebSockets)
    // For now, we'll just simulate it with a static list
    const [onlineUsers, setOnlineUsers] = useState(['Donny Indra']); // Example

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
        // TODO: Set up WebSocket connection here to listen for user status changes
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

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };


    const handleAddOrUpdateUser = async (userData) => {
        setIsLoading(true);
        closeModal();
        try {
            if (editingUser) {
                if (!userData.password) {
                    delete userData.password;
                }
                await updateUser(editingUser._id, userData);
                setNotification({ message: 'Pengguna berhasil diperbarui', type: 'success' });
            } else {
                const payload = { ...userData, fullName: userData.name };
                await registerUserApi(payload);
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

    const filteredUsers = users.filter((user) =>
        user.role !== 'admin' &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    return (
        <div className="p-4 md:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pengguna</h1>
            {notification.message && (
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            )}
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
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${onlineUsers.includes(user.name) ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                    {onlineUsers.includes(user.name) ? 'Online' : 'Offline'}
                                </span>
                            </td>
                            <td className="p-4 flex gap-2">
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"><FiEdit size={18}/></motion.button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <UserModal user={editingUser} onClose={closeModal} onSubmit={handleAddOrUpdateUser} />
                )}
            </AnimatePresence>
        </div>
    );
};

const UserModal = ({ user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        name: user?.name || '',
        email: user?.email || '',
        noHp: user?.noHp || '',
        age: user?.age || '',
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
        if(formData.password !== formData.confirmPassword) {
            alert("Password tidak cocok!");
            return;
        }
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
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 50, scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-white rounded-2xl p-8 w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{user ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <FormField icon={FiUser} name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} />
                        <FormField icon={FiUser} name="name" type="text" placeholder="Nama Lengkap" value={formData.name} onChange={handleChange} />
                        <FormField icon={FiMail} name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <FormField icon={FiPhone} name="noHp" type="tel" placeholder="No. HP" value={formData.noHp} onChange={handleChange} />
                        <FormField icon={FiSmile} name="age" type="number" placeholder="Umur" value={formData.age} onChange={handleChange} />
                        
                        <CustomSelect options={genderOptions} selected={selectedGender} onChange={setSelectedGender} icon={FiUser} />
                        
                        <div className="md:col-span-2">
                            <CustomSelect options={roleOptions} selected={selectedRole} onChange={setSelectedRole} icon={FiShield} />
                        </div>
                        
                        <FormField icon={FiLock} name="password" type="password" placeholder={user ? "Password Baru (opsional)" : "Password"} value={formData.password} onChange={handleChange} />
                        <FormField icon={FiLock} name="confirmPassword" type="password" placeholder="Konfirmasi Password" value={formData.confirmPassword} onChange={handleChange} />
                    </div>

                    <div className="flex justify-end gap-4 pt-8">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={onClose} className="px-8 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">Batal</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-8 py-2.5 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors">Simpan</motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};


export default ManajemenPengguna;