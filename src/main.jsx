import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { UploadProvider } from './context/UploadContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UploadProvider> {/* <-- [BARU] Bungkus dengan UploadProvider */}
          <App />
        </UploadProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);