import axios from 'axios';

// URL base dari backend Node.js Anda
const API_URL = 'http://localhost:3001/api/auth';

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
    name: userData.fullName, // 'fullName' di frontend menjadi 'name' di backend
    noHp: userData.phone,    // 'phone' di frontend menjadi 'noHp' di backend
    age: Number(userData.age), // Pastikan umur adalah angka
    gender: userData.gender,
    password: userData.password,
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