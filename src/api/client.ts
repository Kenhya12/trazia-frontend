import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

/**
 * Instancia global de Axios configurada para el proyecto Trazia
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor de solicitud - agrega automáticamente el token JWT
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Interceptor de respuesta - maneja errores globales y expiración de sesión
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        // ❌ Desactivar refresh token porque el backend NO lo soporta aún
        if (error.response?.status === 401) {
            console.warn('⚠️ Token expirado, redirigiendo a login...');
            localStorage.clear();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
