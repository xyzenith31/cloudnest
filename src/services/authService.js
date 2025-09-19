import axios from 'axios';

// URL base dari backend Node.js Anda
const API_URL = 'http://localhost:3001/api/auth';

/**
 * Fungsi untuk melakukan registrasi pengguna baru.
 * Dibuat lebih fleksibel untuk menerima nama state yang berbeda dari berbagai form.
 * @param {object} userData - Data pengguna dari form.
 * @returns {Promise<object>} Data pengguna yang berhasil didaftarkan.
 */
export const registerUserApi = (userData) => {
  // Mapping nama field dari frontend ke backend
  const payload = {
    username: userData.username,
    email: userData.email,
    name: userData.name || userData.fullName, // <-- Terima 'name' ATAU 'fullName'
    noHp: userData.noHp || userData.phone,    // <-- Terima 'noHp' ATAU 'phone'
    age: Number(userData.age),
    gender: userData.gender,
    password: userData.password,
    role: userData.role || 'user' // Menambahkan role saat registrasi dari admin
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
    loginIdentifier: credentials.identifier,
    password: credentials.password,
  };
  return axios.post(`${API_URL}/login`, payload);
};