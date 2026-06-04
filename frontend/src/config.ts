// Centralized API Configuration
export const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.MODE === 'production' ? 'https://business-os-b21c.vercel.app' : 'http://localhost:5000');
