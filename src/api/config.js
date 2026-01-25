// Backend API Configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                      ? 'http://localhost:3000' 
                      : 'https://website-gudang-backend.up.railway.app');

export default BACKEND_URL;
