import axios from 'axios';
import { StorageService } from '../services/storage.service';

const API_BASE_URL = 'http://localhost:9090';

// Instancia de Axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request - Agregar token automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = StorageService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Response - Manejar errores
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado - Limpiar y redirigir
            StorageService.clearAuth();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
