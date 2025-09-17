import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-gray-100"
    >
      {children}
    </motion.div>
  );
};

export default Card;