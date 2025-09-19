import axios from 'axios';

// URL base untuk endpoint pengguna di backend
const API_URL = 'http://localhost:3001/api/users';

// Fungsi untuk mendapatkan token dari localStorage
const getToken = () => localStorage.getItem('userToken');

// Konfigurasi header dengan token otentikasi
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/**
 * Mengambil semua data pengguna dari server.
 * @returns {Promise<object>} Daftar semua pengguna.
 */
export const getAllUsers = () => {
  return axios.get(API_URL, getConfig());
};

/**
 * Menghapus pengguna berdasarkan ID.
 * @param {string} userId - ID pengguna yang akan dihapus.
 * @returns {Promise<object>} Pesan konfirmasi.
 */
export const deleteUser = (userId) => {
  return axios.delete(`${API_URL}/${userId}`, getConfig());
};

/**
 * Memperbarui data pengguna (contoh: role).
 * @param {string} userId - ID pengguna yang akan diperbarui.
 * @param {object} userData - Data baru untuk pengguna.
 * @returns {Promise<object>} Data pengguna yang sudah diperbarui.
 */
export const updateUser = (userId, userData) => {
  return axios.put(`${API_URL}/${userId}`, userData, getConfig());
};

/**
 * Memblokir (ban) seorang pengguna.
 * (Ini adalah contoh, implementasi di backend bisa bervariasi)
 * @param {string} userId - ID pengguna yang akan diblokir.
 * @returns {Promise<object>} Pesan konfirmasi.
 */
export const banUser = (userId) => {
  // Anda bisa mengimplementasikannya sebagai update status pengguna
  return updateUser(userId, { isBanned: true }); 
};