import axios from 'axios';

const API_URL = 'http://localhost:3001/api/files';

// Fungsi untuk mendapatkan token dari localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

// Konfigurasi header dengan token otentikasi
const getAuthConfig = (config = {}) => {
  const token = getToken();
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Mengunggah satu file.
 * @param {FormData} formData - Data file yang akan diunggah.
 * @param {Function} onUploadProgress - Callback untuk melacak progres upload.
 * @returns {Promise<object>} Data file yang berhasil diunggah.
 */
export const uploadFile = (formData, onUploadProgress) => {
  return axios.post(`${API_URL}/upload`, formData, getAuthConfig({
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  }));
};

/**
 * Mengambil semua file milik pengguna yang sedang login.
 * @returns {Promise<object>} Daftar file dan total ukuran.
 */
export const getUserFiles = () => {
  return axios.get(API_URL, getAuthConfig());
};

/**
 * Menghapus satu file berdasarkan ID.
 * @param {string} fileId - ID file yang akan dihapus.
 * @returns {Promise<object>} Pesan konfirmasi.
 */
export const deleteFile = (fileId) => {
  return axios.delete(`${API_URL}/${fileId}`, getAuthConfig());
};

/**
 * Menghapus semua file milik pengguna.
 * @returns {Promise<object>} Pesan konfirmasi.
 */
export const deleteAllFiles = () => {
  return axios.delete(`${API_URL}/delete-all`, getAuthConfig());
};

/**
 * Mengunduh satu file berdasarkan ID.
 * @param {string} fileId - ID file yang akan diunduh.
 * @param {string} fileName - Nama file untuk disimpan.
 */
export const downloadFile = async (fileId, fileName) => {
  const response = await axios.get(`${API_URL}/${fileId}`, getAuthConfig({ responseType: 'blob' }));
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

/**
 * Mengunduh semua file pengguna dalam bentuk zip.
 * @param {string} username - Username pengguna untuk nama file zip.
 */
export const downloadAllFiles = async (username) => {
  const response = await axios.get(`${API_URL}/download-all`, getAuthConfig({ responseType: 'blob' }));
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${username}_all_files.zip`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};