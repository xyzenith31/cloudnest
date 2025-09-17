import React, { useState, useEffect } from 'react';
import BackgroundAuth from '../components/BackgroundAuth';

// Fungsi untuk menentukan waktu (pagi, sore, malam)
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 17) return 'day';    // 5 AM - 4:59 PM
  if (hour >= 17 && hour < 19) return 'sunset'; // 5 PM - 6:59 PM
  return 'night';                               // 7 PM - 4:59 AM
};

// Fungsi untuk mendapatkan kelas gradien berdasarkan waktu
const getGradientClass = (time) => {
  switch (time) {
    case 'sunset':
      return 'from-orange-300 via-red-500 to-indigo-800';
    case 'night':
      return 'from-gray-900 via-indigo-900 to-black';
    case 'day':
    default:
      return 'from-sky-400 to-blue-500';
  }
};

const AuthLayout = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  // Cek waktu setiap menit, jika diperlukan
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
      }
    }, 60000); // Cek setiap 60 detik
    return () => clearInterval(interval);
  }, [timeOfDay]);
  
  const gradientClass = getGradientClass(timeOfDay);

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center p-4 overflow-hidden transition-colors duration-1000`}>
      <BackgroundAuth timeOfDay={timeOfDay} />
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;