import client from './client';
import { API_ENDPOINTS } from './endpoints';

export const authApi = {
    /**
     * Login de usuario
     * @param {Object} credentials - { email, password }
     * @returns {Promise} - { token, refreshToken, username, email }
     */
    login: async (credentials) => {
        try {
            const response = await client.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión' };
        }
    },

    /**
     * Registro de usuario
     * @param {Object} userData - { username, email, password }
     * @returns {Promise} - { token, refreshToken, username, email }
     */
    register: async (userData) => {
        try {
            const response = await client.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrarse' };
        }
    },

    /**
     * Refresh token (renovar token expirado)
     * @param {string} refreshToken - Token de refresco
     * @returns {Promise} - { token, refreshToken }
     */
    refreshToken: async (refreshToken) => {
        try {
            const response = await client.post(API_ENDPOINTS.AUTH.REFRESH, {
                refreshToken
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al renovar token' };
        }
    },

    /**
     * Logout (opcional - solo frontend)
     * En tu backend actual no hay endpoint de logout,
     * pero lo dejamos para compatibilidad futura
     */
    logout: async () => {
        // Por ahora solo limpia el storage en el cliente
        // Si implementas blacklist de tokens, descomenta esto:
        // try {
        //   await client.post(API_ENDPOINTS.AUTH.LOGOUT);
        // } catch (error) {
        //   console.error('Error en logout:', error);
        // }

        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Validar token actual
     * @returns {Promise} - true si es válido
     */
    validate: async () => {
        try {
            const response = await client.get(API_ENDPOINTS.AUTH.VALIDATE);
            return response.data;
        } catch (error) {
            return false;
        }
    },

    /**
     * Obtener usuario actual (usando token del localStorage)
     * @returns {Object|null} - Datos del usuario
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    }
};

