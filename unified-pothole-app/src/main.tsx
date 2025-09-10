import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { authService } from './auth/authService.ts'

// Initialize authentication service
authService.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
