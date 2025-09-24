import React, { createContext, useState, useContext, useCallback } from 'react';
import { uploadFile as uploadFileApi } from '../services/fileService';

const UploadContext = createContext();

export const useUpload = () => useContext(UploadContext);

export const UploadProvider = ({ children }) => {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupMinimized, setPopupMinimized] = useState(false);

  const addFilesToQueue = (files) => {
    const newFiles = files.map((file, index) => Object.assign(file, {
      id: `pending-${Date.now()}-${index}`,
      status: 'pending',
    }));
    setPendingFiles(prev => [...prev, ...newFiles]);
    setPopupOpen(true); // Otomatis buka popup saat file ditambahkan
    setPopupMinimized(false);
  };

  const startUpload = useCallback(() => {
    const filesToUpload = pendingFiles;
    setPendingFiles([]);
    setUploadingFiles(prev => [...prev, ...filesToUpload.map(f => ({ ...f, status: 'uploading', progress: 0 }))]);

    filesToUpload.forEach(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await uploadFileApi(formData, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: percentCompleted } : f));
        });

        // Setelah selesai, tandai sebagai completed lalu hapus setelah beberapa saat
        setUploadingFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f));
        setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
        }, 3000);

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Upload gagal';
        setUploadingFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'failed', error: errorMessage } : f));
      }
    });
  }, [pendingFiles]);

  const value = {
    pendingFiles,
    uploadingFiles,
    addFilesToQueue,
    startUpload,
    setPendingFiles,
    isPopupOpen,
    setPopupOpen,
    isPopupMinimized,
    setPopupMinimized,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
};