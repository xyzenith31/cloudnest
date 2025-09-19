import axios from 'axios';

// URL base dari backend NestJS Anda
const API_URL = 'http://localhost:3001/auth';

/**
 * Fungsi untuk melakukan registrasi pengguna baru.
 * @param {object} userData - Data pengguna dari form registrasi.
 * @returns {Promise<object>} Data pengguna yang berhasil didaftarkan.
 */
export const registerUserApi = (userData) => {
  // Mapping nama field dari frontend ke backend
  const payload = {
    username: userData.username,
    email: userData.email,
    name: userData.name, // 'fullName' di frontend menjadi 'name' di backend
    noHp: userData.noHp,    // 'phone' di frontend menjadi 'noHp' di backend
    age: Number(userData.age), // Pastikan umur adalah angka
    gender: userData.gender,
    password: userData.password,
    role: userData.role || 'user'
  };
  return axios.post(`${API_URL}/register`, payload);
};

/**
 * Fungsi untuk melakukan login pengguna.
 * @param {object} credentials - Kredensial pengguna (identifier & password).
 * @returns {Promise<object>} Data pengguna yang berhasil login.
 */
export const loginUserApi = (credentials) => {
  // Mapping nama field dari frontend ke backend
  const payload = {
    loginIdentifier: credentials.identifier, // 'identifier' di frontend menjadi 'loginIdentifier'
    password: credentials.password,
  };
  return axios.post(`${API_URL}/login`, payload);
};

/**
 * Fungsi untuk mendapatkan semua pengguna.
 * @returns {Promise<object>} Daftar semua pengguna.
 */
export const getAllUsers = () => {
  return axios.get(`${API_URL}/users`);
};

/**
 * Fungsi untuk memperbarui data pengguna.
 * @param {string} userId - ID pengguna yang akan diperbarui.
 * @param {object} userData - Data baru untuk pengguna.
 * @returns {Promise<object>} Data pengguna yang telah diperbarui.
 */
export const updateUser = (userId, userData) => {
  return axios.patch(`${API_URL}/users/${userId}`, userData);
};

/**
 * Fungsi untuk menghapus pengguna.
 * @param {string} userId - ID pengguna yang akan dihapus.
 * @returns {Promise<object>} Konfirmasi penghapusan.
 */
export const deleteUser = (userId) => {
  return axios.delete(`${API_URL}/users/${userId}`);
};

/**
 * Fungsi untuk mem-ban atau un-ban pengguna.
 * @param {string} userId - ID pengguna yang akan di-ban/un-ban.
 * @returns {Promise<object>} Data pengguna yang telah diperbarui statusnya.
 */
export const banUser = (userId) => {
    return axios.patch(`${API_URL}/users/${userId}/ban`);
};