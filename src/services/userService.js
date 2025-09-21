import axios from 'axios';

// URL base untuk endpoint pengguna di backend
const API_URL = 'http://localhost:3001/api/users';

// Fungsi untuk mendapatkan token dari data pengguna di localStorage
const getToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Konfigurasi header standar (JSON) dengan token otentikasi
const getAuthConfig = () => {
  const token = getToken();
  if (!token) {
    console.error("No token found, user might be logged out.");
    return {};
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};

// Konfigurasi header untuk upload file (multipart/form-data)
const getMultipartAuthConfig = () => {
  const token = getToken();
  if (!token) {
    console.error("No token found, user might be logged out.");
    return {};
  }
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Mengambil semua data pengguna dari server.
 * @returns {Promise<object>} Daftar semua pengguna.
 */
export const getAllUsers = () => {
  return axios.get(API_URL, getAuthConfig());
};

/**
 * Mengambil data satu pengguna berdasarkan ID.
 * @param {string} userId - ID pengguna yang akan diambil.
 * @returns {Promise<object>} Data pengguna.
 */
export const getUserById = (userId) => {
  return axios.get(`${API_URL}/${userId}`, getAuthConfig());
};

/**
 * Menghapus pengguna berdasarkan ID.
 * @param {string} userId - ID pengguna yang akan dihapus.
 * @returns {Promise<object>} Pesan konfirmasi.
 */
export const deleteUser = (userId) => {
  return axios.delete(`${API_URL}/${userId}`, getAuthConfig());
};

/**
 * Memperbarui data pengguna, termasuk kemungkinan upload avatar.
 * **Gunakan fungsi ini untuk update, bukan 'updateUser'**.
 * @param {string} userId - ID pengguna yang akan diperbarui.
 * @param {FormData} formData - Data baru untuk pengguna dalam format FormData.
 * @returns {Promise<object>} Data pengguna yang sudah diperbarui.
 */
export const updateUserWithAvatar = (userId, formData) => {
  return axios.put(`${API_URL}/${userId}`, formData, getMultipartAuthConfig());
};

/**
 * Memblokir (ban) atau unban seorang pengguna.
 * @param {string} userId - ID pengguna.
 * @param {object} banData - Informasi ban (durasi, alasan, dll).
 * @returns {Promise<object>} Pesan konfirmasi.
 */
export const banUser = (userId, banData) => {
  return axios.post(`${API_URL}/${userId}/ban`, banData, getAuthConfig());
};