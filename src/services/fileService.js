import axios from 'axios';

const API_URL = 'http://localhost:3001/api/files'; // Sesuaikan dengan URL backend Anda

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };
};

export const getUserFiles = () => {
    return axios.get(API_URL, getAuthHeaders());
};

export const uploadFile = (formData, onUploadProgress) => {
    return axios.post(`${API_URL}/upload`, formData, {
        ...getAuthHeaders(),
        onUploadProgress
    });
};


export const deleteFile = (fileId) => {
    return axios.delete(`${API_URL}/${fileId}`, getAuthHeaders());
};

export const deleteAllFiles = () => {
    return axios.delete(`${API_URL}/delete-all`, getAuthHeaders());
};

export const downloadFile = async (fileId, fileName) => {
    const response = await axios.get(`${API_URL}/${fileId}`, {
        ...getAuthHeaders(),
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
};


export const downloadAllFiles = async (username) => {
    const response = await axios.get(`${API_URL}/download-all`, {
        ...getAuthHeaders(),
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${username}_all_files.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// --- [FUNGSI BARU] ---
export const createFolder = (folderName, parentId = null) => {
    return axios.post(`${API_URL}/folder`, { folderName, parentId }, getAuthHeaders());
};

export const moveFiles = (fileIds, destinationFolderId) => {
    return axios.post(`${API_URL}/move`, { fileIds, destinationFolderId }, getAuthHeaders());
};

export const updateFile = (fileId, updateData) => {
    return axios.put(`${API_URL}/${fileId}`, updateData, getAuthHeaders());
};