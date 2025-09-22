import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- [BARU] Tambahkan loading state

  useEffect(() => {
    try {
      // Cek apakah ada data user di localStorage saat aplikasi dimuat
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      // Jika terjadi error saat parsing, hapus data yang salah
      console.error("Gagal memuat data user dari localStorage", error);
      localStorage.removeItem('user');
    } finally {
      // [DIUBAH] Setelah pengecekan selesai, set loading jadi false
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // [DIUBAH] Sertakan 'loading' di dalam value provider
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};