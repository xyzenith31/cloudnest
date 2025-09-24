import React, { useMemo } from 'react'; // [FIX] Import useMemo
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUploadCloud, FiX, FiMinus, FiFile, FiTrash2, FiLoader, 
    FiCheckCircle, FiAlertTriangle, FiPlus, FiChevronUp 
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileVideo, FaAndroid } from 'react-icons/fa';
import { useUpload } from '../context/UploadContext';
import './css/QuickUploadPopup.css';

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// [FIX] Fungsi ini dibuat lebih aman untuk menangani 'fileType' yang mungkin undefined
const getFileIcon = (file) => {
    const fileType = file.type || file.fileType || ''; // Cek 'type' (dari browser) ATAU 'fileType' (dari backend)
    if (fileType.startsWith('image/')) return <FaFileImage className="file-item-icon text-purple-500" />;
    if (fileType.startsWith('video/')) return <FaFileVideo className="file-item-icon text-indigo-500" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="file-item-icon text-red-500" />;
    if (fileType.includes('word')) return <FaFileWord className="file-item-icon text-blue-500" />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <FaFileArchive className="file-item-icon text-yellow-500" />;
    if (fileType.includes('android.package-archive')) return <FaAndroid className="file-item-icon text-green-500" />;
    return <FiFile className="file-item-icon text-gray-500" />;
};


const FileItem = ({ file, onRemove }) => {
    const getStatusIcon = () => {
        switch (file.status) {
            case 'uploading': return <FiLoader className="animate-spin text-blue-500" />;
            case 'completed': return <FiCheckCircle className="text-green-500" />;
            case 'failed': return <FiAlertTriangle className="text-red-500" />;
            default: return (
                <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded-full">
                    <FiTrash2 size={16}/>
                </button>
            );
        }
    };
    return (
        <motion.div 
            layout 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="upload-file-item"
        >
            {getFileIcon(file)}
            <div className="file-item-details">
                <p>{file.name || file.fileName}</p>
                <span>{formatBytes(file.size || file.fileSize)}</span>
                {file.status === 'uploading' && (
                     <div className="progress-bar-bg">
                        <motion.div className="progress-bar-fg" initial={{width:0}} animate={{ width: `${file.progress || 0}%` }}/>
                    </div>
                )}
                {file.status === 'failed' && <span className="text-red-500">{file.error}</span>}
                 {file.status === 'completed' && <span className="text-green-500">Berhasil diunggah!</span>}
            </div>
            <div className="flex-shrink-0">{getStatusIcon()}</div>
        </motion.div>
    );
};


const QuickUploadPopup = () => {
    const {
        pendingFiles, uploadingFiles, addFilesToQueue, startUpload,
        setPendingFiles, isPopupOpen, setPopupOpen,
        isPopupMinimized, setPopupMinimized,
    } = useUpload();
    
    const onDrop = (acceptedFiles) => addFilesToQueue(acceptedFiles);
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true, noKeyboard: true });
    
    const allUploads = [...pendingFiles, ...uploadingFiles];
    const totalProgress = useMemo(() => {
        if(uploadingFiles.length === 0) return 0;
        const total = uploadingFiles.reduce((acc, file) => acc + (file.progress || 0), 0);
        return total / uploadingFiles.length;
    }, [uploadingFiles]);

    if (!isPopupOpen) return null;

    return (
        <motion.div
            layout
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="upload-popup-card"
        >
            <motion.header 
                layout 
                className="upload-popup-header" 
                onClick={() => setPopupMinimized(!isPopupMinimized)}
            >
                <h3 className="flex items-center gap-2">
                    <FiUploadCloud /> 
                    {uploadingFiles.length > 0 ? `Mengunggah... (${totalProgress.toFixed(0)}%)` : 'Upload Cepat'}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setPopupMinimized(!isPopupMinimized); }} className="header-icon-button">
                       {isPopupMinimized ? <FiChevronUp /> : <FiMinus />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setPopupOpen(false); }} className="header-icon-button">
                        <FiX />
                    </button>
                </div>
            </motion.header>
            <AnimatePresence>
                {!isPopupMinimized && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="upload-popup-content"
                    >
                        <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'active' : ''}`}>
                            <input {...getInputProps()} />
                            <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-2"/>
                            <p className="text-gray-600 text-sm">Seret file ke sini atau</p>
                            <button onClick={open} className="text-blue-600 font-semibold cursor-pointer hover:underline text-sm">
                                pilih dari perangkat
                            </button>
                        </div>

                        <div className="file-list-container">
                            <AnimatePresence>
                                {allUploads.map(file => (
                                    <FileItem key={file.id} file={file} onRemove={() => setPendingFiles(p => p.filter(f => f.id !== file.id))} />
                                ))}
                            </AnimatePresence>
                             {allUploads.length === 0 && <p className="text-center text-sm text-gray-400 py-4">Belum ada file.</p>}
                        </div>

                        <footer className="upload-popup-footer">
                            <button onClick={() => setPendingFiles([])} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Batal
                            </button>
                            <button onClick={startUpload} disabled={pendingFiles.length === 0 || uploadingFiles.length > 0} className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                Upload {pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}
                            </button>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default QuickUploadPopup;