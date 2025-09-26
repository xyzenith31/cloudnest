import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUploadCloud, FiFile, FiX, FiCheckCircle, FiLoader, FiAlertTriangle, FiTrash2,
    FiHardDrive, FiImage, FiVideo, FiFileText, FiArchive, FiCpu, FiMusic, FiClock
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid, FaFilePowerpoint, FaFileExcel, FaWindows, FaApple } from 'react-icons/fa';
import { uploadFile, getUserFiles } from '../../services/fileService';
import Notification from '../../components/Notification';

// --- Helper Functions ---
const getFileIcon = (fileType, fileName = '') => {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (fileType.startsWith('image/')) return <FaFileImage className="text-purple-500" />;
    if (fileType.startsWith('video/')) return <FaFileVideo className="text-indigo-500" />;
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-500" />;
    if (fileType.includes('excel')) return <FaFileExcel className="text-green-600" />;
    if (fileType.includes('powerpoint')) return <FaFilePowerpoint className="text-orange-500" />;
    if (['.zip', '.rar', '.7z', '.iso'].includes(extension)) return <FaFileArchive className="text-yellow-500" />;
    if (extension === '.apk' || fileType.includes('android.package-archive')) return <FaAndroid className="text-green-500" />;
    if (extension === '.exe' || extension === '.msi') return <FaWindows className="text-sky-500" />;
    if (extension === '.dmg' || extension === '.ipa') return <FaApple className="text-gray-600" />;
    return <FiFile className="text-gray-500" />;
};

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// --- Komponen-komponen Kecil ---
const FileItem = ({ file, onRemove }) => {
    const statusIcons = {
        uploading: <FiLoader className="text-blue-500 animate-spin" />,
        completed: <FiCheckCircle className="text-green-500" />,
        failed: <FiAlertTriangle className="text-red-500" />,
    };
    return (
        <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }} className="file-item-card">
            <div className="file-item-icon">{getFileIcon(file.type || file.fileType || '', file.name || file.fileName || '')}</div>
            <div className="file-item-details">
                <p className="file-item-name" title={file.name || file.fileName}>{file.name || file.fileName}</p>
                <p className="file-item-info">{formatBytes(file.size || file.fileSize)}</p>
                {file.status === 'uploading' && (<div className="progress-bar-container"><motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${file.progress || 0}%`}} /></div>)}
                {file.status === 'failed' && <p className="text-xs text-red-500 mt-1">{file.error || 'Gagal'}</p>}
                {file.status === 'completed' && <p className="text-xs text-green-500 mt-1">Berhasil!</p>}
            </div>
            <div className="file-item-status">
                {file.status === 'pending' ? (<motion.button whileTap={{ scale: 0.9 }} onClick={onRemove} className="p-1 rounded-full hover:bg-gray-100 text-gray-500"><FiX /></motion.button>) : (statusIcons[file.status])}
            </div>
        </motion.div>
    );
};

const StorageInfoCard = ({ usedStorage, files }) => {
    const totalStorage = 10 * 1024 * 1024 * 1024;
    const usagePercentage = (usedStorage / totalStorage) * 100;
    const categoryData = useMemo(() => {
        const categories = {
            foto: { icon: FiImage, label: 'Gambar', size: 0, color: 'bg-purple-500' }, video: { icon: FiVideo, label: 'Video', size: 0, color: 'bg-indigo-500' },
            music: { icon: FiMusic, label: 'Audio', size: 0, color: 'bg-pink-500' }, dokumen: { icon: FiFileText, label: 'Dokumen', size: 0, color: 'bg-blue-500' },
            arsip: { icon: FiArchive, label: 'Arsip', size: 0, color: 'bg-yellow-500' }, apk: { icon: FiCpu, label: 'Aplikasi', size: 0, color: 'bg-green-500' },
        };
        files.forEach(file => { if (categories[file.category]) { categories[file.category].size += file.fileSize; } });
        return Object.values(categories);
    }, [files]);
    return (
        <div className="info-card"><div className="section-header"> <h2 className="section-title"><FiHardDrive />Pusat Penyimpanan</h2> </div>
            <p className="text-center text-3xl font-bold text-gray-800">{formatBytes(usedStorage, 1)} <span className="text-lg text-gray-500"> / 10 GB</span> </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-3"><motion.div className="bg-gradient-to-r from-sky-500 to-blue-500 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${usagePercentage}%`}} transition={{ duration: 1, ease: 'easeOut' }} /></div>
            <div className="storage-category-list">
                {categoryData.map(cat => (<div key={cat.label} className="category-item"><div className={`category-icon ${cat.color}`}><cat.icon /></div><div className="flex-grow"> <p className="font-semibold text-gray-700">{cat.label}</p> </div><p className="font-medium text-gray-600">{formatBytes(cat.size)}</p></div>))}
            </div>
        </div>
    );
};

const FilesSection = ({ title, icon, files, emptyText, children, className }) => (
    <div className={`info-card ${className}`}>
        <div className="section-header">
            <h2 className="section-title">{icon} {title}</h2>
        </div>
        <div className="file-list-container">
            <AnimatePresence>
                {files.map(file => (<FileItem key={file.id || file._id} file={file} />))}
            </AnimatePresence>
            {files.length === 0 && (<div className="empty-list-placeholder"><p>{emptyText}</p></div>)}
        </div>
        {children}
    </div>
);

// --- Komponen Utama ---
const UploadFile = () => {
    const [pendingFiles, setPendingFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [history, setHistory] = useState([]);
    const [allUserFiles, setAllUserFiles] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchInitialData = async () => {
        try {
            const response = await getUserFiles();
            const filesData = response.data.files;
            setAllUserFiles(filesData);
            setHistory(filesData.slice(0, 3).map(f => ({...f, status: 'completed'})));
            setTotalSize(response.data.totalSize);
        } catch (error) { console.error("Gagal memuat data:", error); }
    };

    useEffect(() => { fetchInitialData(); }, []);

    const onDrop = useCallback(acceptedFiles => {
        const storageLimit = 10 * 1024 * 1024 * 1024;
        const sizeOfPendingFiles = pendingFiles.reduce((acc, file) => acc + file.size, 0);
        const sizeOfNewFiles = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
        if (totalSize + sizeOfPendingFiles + sizeOfNewFiles > storageLimit) {
            setNotification({ message: 'Penyimpanan tidak cukup.', type: 'error' });
            return;
        }
        const newFiles = acceptedFiles.map((file, i) => Object.assign(file, { id: `pending-${Date.now()}-${i}`, status: 'pending' }));
        setPendingFiles(prev => [...prev, ...newFiles]);
    }, [pendingFiles, totalSize]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true });

    const handleUpload = () => {
        const filesToUpload = pendingFiles;
        setPendingFiles([]);
        setUploadingFiles(prev => [...prev, ...filesToUpload.map(f => ({ ...f, status: 'uploading', progress: 0 }))]);
        filesToUpload.forEach(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await uploadFile(formData, (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setUploadingFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: percent } : f));
                });
                setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
                fetchInitialData();
                setNotification({ message: `"${response.data.fileName}" berhasil diunggah!`, type: 'success' });
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Upload gagal.';
                setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
                setPendingFiles(prev => [{ ...file, status: 'failed', error: errorMessage }, ...prev]);
                setNotification({ message: `Gagal mengunggah "${file.name}": ${errorMessage}`, type: 'error' });
            }
        });
    };
    
    return (
        <div className="p-8">
            <style>{`
                .upload-page-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media (min-width: 1024px) { .upload-page-grid { grid-template-columns: 1fr 1fr; } }

                .column-wrapper { display: flex; flex-direction: column; gap: 2rem; height: 100%; }
                .top-section { flex-grow: 1; display: flex; flex-direction: column; }
                
                .dropzone-reimagined-new {
                    background-color: white; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 2rem;
                    cursor: pointer; transition: all 0.3s ease-in-out;
                    flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
                }
                .dropzone-reimagined-new:hover { border-color: #3b82f6; transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1); }
                .dropzone-reimagined-new.active { border-color: #3b82f6; background-color: #eff6ff; }

                .info-card {
                    background-color: white; border: 1px solid #e2e8f0; border-radius: 16px;
                    padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    display: flex; flex-direction: column;
                }
                
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-shrink: 0; }
                .section-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
                
                .file-list-container { 
                    flex-grow: 1; min-height: 200px; overflow-y: auto; padding-right: 0.5rem; 
                    display: flex; flex-direction: column;
                }
                .empty-list-placeholder {
                    flex-grow: 1; display: flex; align-items: center; justify-content: center;
                    color: #9ca3af; text-align: center;
                }

                .file-item-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 1rem; }
                .file-item-icon { font-size: 2rem; width: 2rem; text-align: center; flex-shrink: 0; }
                .file-item-details { flex-grow: 1; min-width: 0; }
                .file-item-name { font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .file-item-info { font-size: 0.875rem; color: #64748b; }
                .file-item-status { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem; }
                .progress-bar-container { width: 100%; height: 6px; background-color: #e2e8f0; border-radius: 9999px; margin-top: 0.25rem; overflow: hidden; }
                .progress-bar-fill { height: 100%; background-color: #3b82f6; border-radius: 9999px; }

                .storage-category-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
                .category-item { display: flex; align-items: center; gap: 1rem; }
                .category-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; }
                
                .animated-link {
                    font-weight: 500; background-clip: text; -webkit-background-clip: text; color: transparent;
                    background-image: linear-gradient(to right, #3b82f6, #60a5fa);
                    position: relative; display: inline-block; transition: all 0.3s ease-in-out;
                }
                .animated-link::after {
                    content: ''; position: absolute; width: 100%; height: 2px; bottom: 0; left: 0;
                    background-color: #60a5fa; transform-origin: bottom right; transform: scaleX(0);
                    transition: transform 0.3s ease-in-out;
                }
                .animated-link:hover::after { transform-origin: bottom left; transform: scaleX(1); }

                .card-footer-actions {
                    margin-top: 1.5rem; display: flex; justify-content: flex-end;
                    align-items: center; gap: 0.75rem; flex-shrink: 0;
                }
                .button-primary {
                    background-color: #3b82f6; color: white; font-weight: 700;
                    padding: 0.75rem 2rem; border-radius: 9999px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
                }
                .button-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                
                /* [PERBAIKAN] Desain tombol Bersihkan */
                .button-danger {
                    background-color: #ef4444; /* bg-red-500 */
                    color: white;
                    font-weight: 600;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                }
                .button-danger:hover {
                    background-color: #dc2626; /* hover:bg-red-600 */
                }

            `}</style>
            
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Unggah File Baru</h1>
                <p className="text-gray-500 mt-1">Seret dan letakkan file untuk memulai.</p>
            </motion.div>

            <div className="upload-page-grid">
                <div className="column-wrapper">
                    <div className="top-section">
                        <motion.div {...getRootProps()} className={`dropzone-reimagined-new ${isDragActive ? 'active' : ''}`}>
                            <input {...getInputProps()} />
                            <motion.div className="flex flex-col items-center gap-3" animate={{ y: isDragActive ? -10 : 0 }}>
                                <FiUploadCloud className={`text-6xl transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                <p className="text-lg font-semibold">Seret & Lepas File</p>
                                <p>atau <button onClick={(e) => { e.stopPropagation(); open(); }} className="animated-link">pilih dari perangkat</button></p>
                                <p className="text-sm text-gray-400 mt-2">Ukuran file maksimal 2GB</p>
                            </motion.div>
                        </motion.div>
                    </div>
                    <FilesSection title="Riwayat Upload" icon={<FiClock />} files={history} emptyText="Belum ada riwayat." />
                </div>
                
                <div className="column-wrapper">
                    <div className="top-section">
                        <FilesSection
                            className="h-full"
                            title="Daftar Unggahan" icon={<FiFileText />}
                            files={[...pendingFiles, ...uploadingFiles]}
                            emptyText="Antrian unggahan kosong."
                            onRemove={(id) => setPendingFiles(p => p.filter(f => f.id !== id))}
                        >
                            {(pendingFiles.length > 0 || uploadingFiles.length > 0) && (
                                <div className="card-footer-actions">
                                    {pendingFiles.length > 0 && (
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPendingFiles([])} className="button-danger">
                                            Bersihkan
                                        </motion.button>
                                    )}
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleUpload} disabled={pendingFiles.length === 0} className="button-primary">
                                        {uploadingFiles.length > 0 ? `Mengunggah...` : `Unggah ${pendingFiles.length} File`}
                                    </motion.button>
                                </div>
                            )}
                        </FilesSection>
                    </div>
                    <StorageInfoCard usedStorage={totalSize} files={allUserFiles} />
                </div>
            </div>
        </div>
    );
};

export default UploadFile;