import React from 'react';
import BackgroundAuth from '../components/BackgroundAuth';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-400 to-light-blue flex items-center justify-center p-4">
      <BackgroundAuth />
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;