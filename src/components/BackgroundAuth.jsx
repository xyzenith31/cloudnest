  import React from 'react';
  import { motion } from 'framer-motion';
  import './css/BackgroundAuth.css';

  const random = (min, max) => Math.random() * (max - min) + min;

  // === KOMPONEN AWAN ===
  const Cloud = ({ i, cloudClass }) => {
    // ... (Kode Cloud tidak berubah, biarkan seperti sebelumnya)
    const variants = {
      initial: {
        x: '-250px',
        top: `${random(5, 75)}%`,
        scale: random(0.6, 1.3),
        opacity: random(0.7, 1),
      },
      animate: {
        x: '100vw',
        transition: {
          duration: random(25, 60),
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          delay: i * 1.2,
        },
      },
    };
    return (
      <motion.div className={`cloud-wrapper ${cloudClass}`} variants={variants} custom={i} initial="initial" animate="animate">
        <div className="cloud-part part-base"></div>
        <div className="cloud-part part-top-right"></div>
        <div className="cloud-part part-top-left"></div>
        <div className="cloud-part part-center"></div>
      </motion.div>
    );
  };


  // === KOMPONEN BINTANG ===
  const Star = ({ delay }) => (
      // ... (Kode Star tidak berubah, biarkan seperti sebelumnya)
    <motion.div
      className="star"
      style={{ top: `${random(0, 95)}%`, left: `${random(0, 95)}%`, scale: random(0.5, 1.2) }}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: random(2, 4), repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );

  // === [PERBAIKAN] KOMPONEN BINTANG JATUH ===
  const ShootingStar = () => (
    <motion.div
      className="shooting-star"
      style={{
        // Mulai dari posisi acak di ATAS (di luar layar)
        top: `${random(-10, -5)}%`,
        left: `${random(5, 95)}%`,
      }}
      animate={{
        // Jatuh ke bawah hingga menghilang
        y: [0, window.innerHeight + 100],
      }}
      transition={{
        duration: random(1.5, 3), // Durasi jatuh lebih cepat
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay: random(3, 15), // Muncul di waktu yang berbeda
      }}
    />
  );


  // === KOMPONEN ADEGAN (SCENES) ===
  const DayScene = () => (
    <>
      {[...Array(12)].map((_, i) => <Cloud key={i} i={i} cloudClass="day-cloud" />)}
    </>
  );

  const SunsetScene = () => (
    <>
      <div className="sun"></div>
      {[...Array(8)].map((_, i) => <Cloud key={i} i={i} cloudClass="sunset-cloud" />)}
    </>
  );

  const NightScene = () => (
    <>
      <div className="moon"></div>
      {[...Array(40)].map((_, i) => <Star key={i} delay={i * 0.1} />)}
      {/* [PERBAIKAN] Memanggil komponen ShootingStar yang baru */}
      <ShootingStar />
      <ShootingStar />
      {[...Array(6)].map((_, i) => <Cloud key={i} i={i} cloudClass="night-cloud" />)}
    </>
  );

  // === KOMPONEN UTAMA ===
  const BackgroundAuth = ({ timeOfDay }) => {
    return (
      <div className="background-dynamic-container">
        {timeOfDay === 'day' && <DayScene />}
        {timeOfDay === 'sunset' && <SunsetScene />}
        {timeOfDay === 'night' && <NightScene />}
      </div>
    );
  };

  export default BackgroundAuth;