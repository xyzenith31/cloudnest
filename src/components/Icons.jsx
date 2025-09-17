import React from 'react';
import { FaCloud } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const CloudNestLogo = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center justify-center" 
    >
      <FaCloud className="mr-3 text-blue-500" />
      <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-700">
        CloudNest
      </h1>
    </motion.div>
  );
};

export const GenderIcon = () => {
  return <FiUsers className="form-icon" />;
};