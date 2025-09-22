import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';

const UploadFile = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'*/*': []} });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };
  
  const handleUpload = () => {
    setIsUploading(true);
    // Simulasi proses upload
    files.forEach((file, index) => {
      if (file.status === 'pending') {
        const interval = setInterval(() => {
          setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            const currentFile = newFiles[index];
            if (currentFile.progress < 100) {
              currentFile.progress += 10;
            } else {
              currentFile.status = 'completed';
              clearInterval(interval);
              // Cek jika semua sudah selesai
              if (newFiles.every(f => f.status === 'completed')) {
                setIsUploading(false);
              }
            }
            return newFiles;
          });
        }, 200);
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-800">Upload File</h1>
        <p className="text-gray-500 mt-1">Seret dan lepas file Anda atau klik untuk memilih.</p>
      </motion.div>

      {/* Dropzone */}
      <motion.div 
        {...getRootProps()}
        className={`mt-8 border-4 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <motion.div
            animate={{ y: isDragActive ? -10 : 0 }}
            className="flex flex-col items-center justify-center"
        >
            <FiUploadCloud className={`text-5xl mb-4 transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            <p className="text-lg font-semibold text-gray-700">
              {isDragActive ? 'Lepaskan file di sini!' : 'Seret & Lepas file atau Klik untuk Memilih'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Ukuran file maksimal 2GB</p>
        </motion.div>
      </motion.div>

      {/* File Preview & List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold mb-4">File Siap Diunggah ({files.length})</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                    className="bg-white p-3 rounded-lg shadow border flex items-center gap-4"
                  >
                    <img src={file.preview} alt={file.name} className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <motion.div 
                            className={`h-1.5 rounded-full ${file.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%`}}
                          />
                      </div>
                    </div>
                    {file.status === 'completed' ? (
                        <FiCheckCircle className="text-green-500 text-2xl"/>
                    ) : (
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeFile(file)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                          <FiX />
                        </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
                 <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setFiles([])}
                    className="font-semibold text-gray-600 px-6 py-3 rounded-full hover:bg-gray-100"
                >
                    Batal
                </motion.button>
                 <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(59,130,246,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Mengunggah...' : `Unggah ${files.length} File`}
                </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadFile;