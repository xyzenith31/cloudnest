import React from 'react';
import { motion } from 'framer-motion';
import './css/BackgroundAuth.css';

const BackgroundAuth = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <motion.div
        className="cloud cloud1"
        animate={{ x: ['-100%', '100%'], y: [0, 20, 0] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      ></motion.div>
      <motion.div
        className="cloud cloud2"
        animate={{ x: ['-120%', '120%'], y: [10, -10, 10] }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      ></motion.div>
       <motion.div
        className="cloud cloud3"
        animate={{ x: ['-150%', '150%'], y: [-15, 15, -15] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      ></motion.div>
    </div>
  );
};

export default BackgroundAuth;