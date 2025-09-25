import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiMinimize2, FiMaximize2, FiPause, FiPlay, FiRotateCcw, FiCheckCircle, FiEdit3 } from 'react-icons/fi';
import CustomSelect from './CustomSelect';
import LoadingSpinner from './LoadingSpinner';

const formatOptions = [
    { id: 1, name: 'Unduh Satu Persatu', value: 'each' },
    { id: 2, name: 'Kompres ke format .ZIP', value: 'zip' },
    { id: 3, name: 'Kompres ke format .RAR ', value: 'rar' },
    { id: 4, name: 'Kompres ke format .7z ', value: '7z' },
];

const DownloadAllModal = ({ isOpen, onClose, allFiles, onDownload, user, setNotification }) => {
    const [view, setView] = useState('form');
    const [selectedFormat, setSelectedFormat] = useState(formatOptions[1]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isMinimized, setIsMinimized] = useState(false);
    
    // --- [BARU] State untuk nama file kompresi ---
    const [zipName, setZipName] = useState(`CloudNest_Archive_${user.username}`);

    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Memulai...');
    const [isPaused, setIsPaused] = useState(false);

    // --- [DIPERBARUI] Logika progres dan pemanggilan API ---
    useEffect(() => {
        let interval;
        if (view === 'progress' && !isPaused) {
            interval = setInterval(async () => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    if (prev < 50) setStatusText(`Mengompres ${selectedFiles.length} file...`);
                    else setStatusText('Menyiapkan unduhan...');
                    return prev + 10;
                });
            }, 300);
        }

        // Ketika progress mencapai 100, trigger download
        if (progress >= 100 && view === 'progress') {
             (async () => {
                try {
                    await onDownload({ fileIds: selectedFiles, zipName, username: user.username });
                    setStatusText('Unduhan selesai!');
                    setView('done');
                } catch (error) {
                    setNotification({ message: error.message, type: 'error' });
                    setView('form'); // Kembali ke form jika gagal
                }
             })();
        }

        return () => clearInterval(interval);
    }, [view, isPaused, progress]);


    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFiles(allFiles.map(f => f._id));
        } else {
            setSelectedFiles([]);
        }
    };

    const handleFileSelect = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
        );
    };

    const handleContinue = () => {
        if (selectedFiles.length === 0) return;
        setProgress(0); // Reset progress sebelum memulai
        setView('progress');
    };
    
    const resetState = () => {
        setView('form');
        setSelectedFiles([]);
        setProgress(0);
        setStatusText('Memulai...');
        setIsPaused(false);
        setZipName(`CloudNest_Archive_${user.username}`);
    }
    
    const handleClose = () => {
        resetState();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={handleClose}
            >
                <motion.div
                    layout
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.header layout className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-bold">Unduh Banyak File</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 rounded-full hover:bg-gray-100">
                                {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                            </button>
                            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100"><FiX /></button>
                        </div>
                    </motion.header>
                    
                    <AnimatePresence>
                    {!isMinimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {view === 'form' && (
                                <>
                                    <div className="p-5 space-y-4">
                                        {/* --- [BARU] Form untuk nama file --- */}
                                        <div>
                                            <label className="font-semibold text-gray-700 block mb-2">Nama File Kompresi</label>
                                            <div className="relative">
                                                <FiEdit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                                <input 
                                                    type="text"
                                                    value={zipName}
                                                    onChange={(e) => setZipName(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-semibold text-gray-700">Pilih Format Unduhan</label>
                                            <CustomSelect options={formatOptions} selected={selectedFormat} onChange={setSelectedFormat} />
                                        </div>
                                        <div>
                                            <label className="font-semibold text-gray-700">Pilih File ({selectedFiles.length}/{allFiles.length})</label>
                                            <div className="mt-2 p-3 border rounded-lg max-h-60 overflow-y-auto space-y-2 bg-gray-50">
                                                <div className="flex items-center">
                                                    <input type="checkbox" id="select-all" onChange={handleSelectAll} checked={allFiles.length > 0 && selectedFiles.length === allFiles.length} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                                                    <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-900">Pilih Semua File</label>
                                                </div>
                                                <hr/>
                                                {allFiles.map(file => (
                                                    <div key={file._id} className="flex items-center">
                                                         <input type="checkbox" id={`file-${file._id}`} checked={selectedFiles.includes(file._id)} onChange={() => handleFileSelect(file._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                                                         <label htmlFor={`file-${file._id}`} className="ml-2 text-sm text-gray-900 truncate">{file.fileName}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <footer className="p-4 border-t flex justify-end">
                                        <motion.button
                                            onClick={handleContinue}
                                            disabled={selectedFiles.length === 0}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            Lanjutkan
                                        </motion.button>
                                    </footer>
                                </>
                            )}

                            {(view === 'progress' || view === 'done') && (
                                <div className="p-8 flex flex-col items-center justify-center text-center">
                                    {view === 'progress' ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <FiCheckCircle className="text-6xl text-green-500 mb-4" />
                                    )}
                                    <h3 className="text-xl font-bold mt-4">{statusText}</h3>
                                    <p className="text-gray-500">Progres: {Math.round(progress)}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
                                        <motion.div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, ease: "linear" }}
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        {view === 'progress' && (
                                            <>
                                                <button onClick={() => setIsPaused(!isPaused)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg">
                                                    {isPaused ? <FiPlay/> : <FiPause />} {isPaused ? 'Lanjutkan' : 'Jeda'}
                                                </button>
                                                <button onClick={handleClose} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                                                    <FiX/> Batalkan
                                                </button>
                                            </>
                                        )}
                                        {view === 'done' && (
                                            <button onClick={resetState} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
                                                <FiRotateCcw/> Unduh Lagi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DownloadAllModal;