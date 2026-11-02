
/* ==========================================
   pura lectura — inicio de react
   ========================================== */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';

// conecta la aplicación con el elemento root.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

