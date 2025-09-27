import axios from 'axios';

const API_URL = 'http://localhost:3001/api/files';

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

// [MODIFIKASI] Tambahkan parameter `permanent`
export const deleteFile = (fileId, permanent = false) => {
    const config = getAuthHeaders();
    if (permanent) {
        config.params = { permanent: true };
    }
    return axios.delete(`${API_URL}/${fileId}`, config);
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


export const downloadAllFiles = async (downloadData) => {
    const { fileIds, zipName } = downloadData;
    try {
        const response = await axios.post(`${API_URL}/download-all`, 
            { fileIds, zipName },
            {
                ...getAuthHeaders(),
                responseType: 'blob'
            }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const finalFileName = (zipName.endsWith('.zip') ? zipName : `${zipName}.zip`);
        link.setAttribute('download', finalFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Gagal mengunduh semua file:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Gagal memulai unduhan.');
    }
};

export const createFolder = (folderName, parentId = null) => {
    return axios.post(`${API_URL}/folder`, { folderName, parentId }, getAuthHeaders());
};

export const moveFiles = (fileIds, destinationFolderId) => {
    return axios.post(`${API_URL}/move`, { fileIds, destinationFolderId }, getAuthHeaders());
};

export const updateFile = (fileId, updateData) => {
    return axios.put(`${API_URL}/${fileId}`, updateData, getAuthHeaders());
};

export const restoreAllFiles = () => {
    return axios.post(`${API_URL}/restore-all`, {}, getAuthHeaders());
};

export const emptyTrash = () => {
    return axios.delete(`${API_URL}/empty-trash`, getAuthHeaders());
};