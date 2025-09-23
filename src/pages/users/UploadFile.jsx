import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUploadCloud, FiFile, FiX, FiCheckCircle, FiLoader, FiAlertTriangle, FiTrash2, FiClock, FiHardDrive
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid } from 'react-icons/fa';
import { uploadFile, getUserFiles } from '../../services/fileService';
import Notification from '../../components/Notification';

// --- Helper Functions (Ikon & Format Ukuran) ---
const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FaFileImage className="text-purple-500" />;
    if (fileType.startsWith('video/')) return <FaFileVideo className="text-indigo-500" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-500" />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <FaFileArchive className="text-yellow-500" />;
    if (fileType.includes('android.package-archive')) return <FaAndroid className="text-green-500" />;
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

// --- [BARU] KOMPONEN MODAL BATAS PENYIMPANAN ---
const StorageLimitModal = ({ isOpen, onClose, pendingSize, currentSize, limit }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
            >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <FiAlertTriangle className="text-4xl text-red-500" />
                </div>
                <h2 className="text-xl font-bold my-4">Kapasitas Penyimpanan Tidak Cukup</h2>
                <p className="text-gray-600">
                    Anda mencoba mengunggah <strong className="text-red-600">{formatBytes(pendingSize)}</strong>, namun sisa penyimpanan Anda hanya <strong className="text-blue-600">{formatBytes(limit - currentSize)}</strong>.
                </p>
                <p className="text-gray-600 mt-2">
                    Total penyimpanan akan menjadi <strong className="text-red-600">{formatBytes(currentSize + pendingSize)}</strong> dari <strong className="text-blue-600">{formatBytes(limit)}</strong>.
                </p>
                <div className="flex justify-center mt-6">
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.05 }}
                        className="px-8 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                    >
                        Mengerti
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- Komponen Lainnya (StorageCard, FileSection, FileItem) ---
const StorageCard = ({ usedStorage }) => {
    const totalStorage = 10 * 1024 * 1024 * 1024; // 10 GB
    const usagePercentage = (usedStorage / totalStorage) * 100;

    return (
        <motion.div
            className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><FiHardDrive />Penyimpanan</h2>
            </div>
            <div className="space-y-2">
                <p className="text-center text-3xl font-bold text-gray-800">{formatBytes(usedStorage, 1)}<span className="text-lg text-gray-500">/10 GB</span></p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                        className="bg-gradient-to-r from-sky-500 to-blue-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${usagePercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    />
                </div>
                <div className="text-center text-sm text-gray-500 pt-1">{usagePercentage.toFixed(1)}% terpakai</div>
            </div>
        </motion.div>
    );
};
const FileSection = ({ title, files, onRemove, onClear, canClear, children }) => (
    <motion.div
        className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
    >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {canClear && (
                <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={onClear} className="text-sm font-semibold text-red-500 hover:text-red-700 flex items-center gap-1">
                    <FiTrash2 /> Bersihkan
                </motion.button>
            )}
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 flex-grow">
            <AnimatePresence>
                {files.map(file => <FileItem key={file.id || file._id} file={file} onRemove={() => onRemove && onRemove(file.id)} />)}
            </AnimatePresence>
            {files.length === 0 && <p className="text-center text-gray-400 py-4">Tidak ada file.</p>}
        </div>
        {children}
    </motion.div>
);
const FileItem = ({ file, onRemove }) => {
    const statusIcons = {
        uploading: <FiLoader className="text-blue-500 text-2xl animate-spin" />,
        completed: <FiCheckCircle className="text-green-500 text-2xl" />,
        failed: <FiAlertTriangle className="text-red-500 text-2xl" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
            className="bg-white p-3 rounded-lg shadow border flex items-center gap-4"
        >
            <div className="text-3xl flex-shrink-0 w-8 text-center">{getFileIcon(file.type || file.fileType || '')}</div>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-800 truncate">{file.name || file.fileName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{formatBytes(file.size || file.fileSize)}</span>
                    {file.date && <><span>•</span> <FiClock size={12}/> <span>{new Date(file.date).toLocaleDateString()}</span></>}
                </div>
                {file.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <motion.div
                            className="bg-blue-500 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress || 0}%`}}
                        />
                    </div>
                )}
                 {file.status === 'failed' && <p className="text-xs text-red-500 mt-1">{file.error || 'Gagal'}</p>}
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
                {file.status === 'pending'
                    ? <motion.button whileTap={{ scale: 0.9 }} onClick={onRemove} className="p-1 rounded-full hover:bg-gray-100 text-gray-500"><FiX /></motion.button>
                    : statusIcons[file.status]
                }
            </div>
        </motion.div>
    );
};


const UploadFile = () => {
    const [pendingFiles, setPendingFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [history, setHistory] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isStorageModalOpen, setIsStorageModalOpen] = useState(false); // <-- [BARU] State untuk modal
    const [pendingUploadSize, setPendingUploadSize] = useState(0); // <-- [BARU] State untuk ukuran file yg akan diupload

    const fetchInitialData = async () => {
        try {
            const response = await getUserFiles();
            setHistory(response.data.files);
            setTotalSize(response.data.totalSize);
        } catch (error) {
            console.error("Gagal memuat riwayat upload:", error);
        }
    };
    
    useEffect(() => {
        fetchInitialData();
    }, []);

    const onDrop = useCallback(acceptedFiles => {
        const newFiles = acceptedFiles.map((file, index) => Object.assign(file, {
            id: `pending-${Date.now()}-${index}`,
            preview: URL.createObjectURL(file),
            status: 'pending'
        }));
        setPendingFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { '*': [] } });

    const removeFile = (id, listSetter) => {
        listSetter(prev => prev.filter(f => f.id !== id));
    };
    
    // --- [DIUBAH] Fungsi handleUpload dengan pengecekan kapasitas ---
    const handleUpload = () => {
        const storageLimit = 10 * 1024 * 1024 * 1024; // 10 GB
        const sizeOfPendingFiles = pendingFiles.reduce((acc, file) => acc + file.size, 0);

        if (totalSize + sizeOfPendingFiles > storageLimit) {
            setPendingUploadSize(sizeOfPendingFiles);
            setIsStorageModalOpen(true);
            return; // Hentikan proses upload
        }

        const filesToUpload = pendingFiles;
        setPendingFiles([]);
        setUploadingFiles(prev => [...prev, ...filesToUpload.map(f => ({ ...f, status: 'uploading', progress: 0 }))]);
    
        filesToUpload.forEach(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                const response = await uploadFile(formData, (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadingFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: percentCompleted } : f));
                });
    
                setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
                setHistory(h => [response.data, ...h]);
                setTotalSize(prevSize => prevSize + response.data.fileSize);
    
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Upload gagal';
                setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
                setHistory(h => [{ ...file, status: 'failed', date: new Date().toISOString(), error: errorMessage }, ...h]);
            }
        });
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            {/* [BARU] Render Modal Peringatan Kapasitas */}
            <StorageLimitModal 
                isOpen={isStorageModalOpen}
                onClose={() => setIsStorageModalOpen(false)}
                pendingSize={pendingUploadSize}
                currentSize={totalSize}
                limit={10 * 1024 * 1024 * 1024}
            />

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-gray-800">Unggah File Anda</h1>
                <p className="text-gray-500 mt-1">Seret dan letakkan file di sini untuk memulai.</p>
            </motion.div>

            <motion.div
                {...getRootProps()}
                className={`relative border-4 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
                whileHover={{ scale: 1.01 }}
            >
                <input {...getInputProps()} />
                <motion.div
                    animate={{ y: isDragActive ? -10 : 0 }}
                    className="flex flex-col items-center justify-center space-y-3"
                >
                    <FiUploadCloud className={`text-6xl transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className="text-lg font-semibold text-gray-700">
                        {isDragActive ? 'Lepaskan file di sini!' : 'Seret & Lepas atau Klik untuk Memilih'}
                    </p>
                    <p className="text-sm text-gray-500">Ukuran file maksimal 2GB</p>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <FileSection
                        title={`Siap Diunggah (${pendingFiles.length})`}
                        files={pendingFiles}
                        onRemove={(id) => removeFile(id, setPendingFiles)}
                        onClear={() => setPendingFiles([])}
                        canClear={pendingFiles.length > 0}
                    >
                        {pendingFiles.length > 0 && (
                            <div className="mt-6 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(59,130,246,0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUpload}
                                    className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-lg"
                                >
                                    Unggah {pendingFiles.length} File
                                </motion.button>
                            </div>
                        )}
                    </FileSection>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <FileSection
                        title={`Sedang Diunggah (${uploadingFiles.length})`}
                        files={uploadingFiles}
                    />
                    <StorageCard usedStorage={totalSize} />
                    <FileSection
                        title="Riwayat Upload"
                        files={history}
                        onClear={() => setHistory([])}
                        canClear={history.length > 0}
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadFile;