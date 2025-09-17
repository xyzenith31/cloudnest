import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Notifikasi hilang setelah 5 detik

    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === 'error';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed top-5 right-5 w-full max-w-sm p-4 rounded-lg shadow-2xl text-white ${
            isError ? 'bg-red-500' : 'bg-green-500'
          }`}
          role="alert"
        >
          <div className="flex items-center">
            {isError ? (
              <FaTimesCircle className="w-6 h-6 mr-3" />
            ) : (
              <FaCheckCircle className="w-6 h-6 mr-3" />
            )}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5">
              <span className="sr-only">Close</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;