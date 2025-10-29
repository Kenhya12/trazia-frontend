import client from './client';
import { API_ENDPOINTS } from './endpoints';

export const authApi = {
    /**
     * Login de usuario con logs detallados
     * @param {Object} credentials - { email, password }
     * @returns {Promise} - { token, refreshToken, username, email }
     */
    login: async (credentials) => {
        console.log('🔧 authApi.login - Iniciando login...');
        console.log('📤 URL:', API_ENDPOINTS.AUTH.LOGIN);
        console.log('📦 Email:', credentials.email);
        
        try {
            const response = await client.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            
            console.log('✅ authApi.login - Éxito');
            console.log('📨 Status:', response.status);
            console.log('👤 Usuario:', response.data.username);
            console.log('🔑 Token recibido:', response.data.token ? 'SÍ' : 'NO');
            console.log('🔄 RefreshToken recibido:', response.data.refreshToken ? 'SÍ' : 'NO');
            
            return response.data;
        } catch (error) {
            console.error('❌ authApi.login - Error completo:', error);
            console.error('📊 Status error:', error.response?.status);
            console.error('📝 Mensaje error:', error.response?.data);
            console.error('🔍 Config request:', error.config);
            
            const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
            throw { message: errorMessage, status: error.response?.status };
        }
    },

    /**
     * Registro de usuario con logs detallados
     * @param {Object} userData - { username, email, password }
     * @returns {Promise} - { token, refreshToken, username, email }
     */
    register: async (userData) => {
        console.log('🔧 authApi.register - Iniciando registro...');
        console.log('📤 URL:', API_ENDPOINTS.AUTH.REGISTER);
        console.log('📦 Datos:', { 
            username: userData.username, 
            email: userData.email,
            password: '***' 
        });
        
        try {
            const response = await client.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            
            console.log('✅ authApi.register - Éxito');
            console.log('📨 Status:', response.status);
            console.log('👤 Usuario registrado:', response.data.username);
            console.log('🔑 Token recibido:', response.data.token ? 'SÍ' : 'NO');
            
            return response.data;
        } catch (error) {
            console.error('❌ authApi.register - Error completo:', error);
            console.error('📊 Status error:', error.response?.status);
            console.error('📝 Mensaje error:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || 'Error al registrarse';
            throw { message: errorMessage, status: error.response?.status };
        }
    },

    /**
     * Refresh token con logs
     * @param {string} refreshToken - Token de refresco
     * @returns {Promise} - { token, refreshToken }
     */
    refreshToken: async (refreshToken) => {
        console.log('🔧 authApi.refreshToken - Renovando token...');
        
        try {
            const response = await client.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
            
            console.log('✅ authApi.refreshToken - Token renovado');
            return response.data;
        } catch (error) {
            console.error('❌ authApi.refreshToken - Error:', error.response?.data);
            throw error.response?.data || { message: 'Error al renovar token' };
        }
    },

    /**
     * Logout mejorado
     */
    logout: async () => {
        console.log('🔧 authApi.logout - Cerrando sesión...');
        
        try {
            // Si tu backend tiene endpoint de logout, descomenta:
            // await client.post(API_ENDPOINTS.AUTH.LOGOUT);
            // console.log('✅ authApi.logout - Backend notificado');
        } catch (error) {
            console.warn('⚠️ authApi.logout - Error notificando al backend:', error);
        } finally {
            // Siempre limpiar el frontend
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            console.log('✅ authApi.logout - Storage limpiado');
        }
    },

    /**
     * Validar token actual
     * @returns {Promise} - true si es válido
     */
    validate: async () => {
        console.log('🔧 authApi.validate - Validando token...');
        
        try {
            // Si tienes endpoint de validación, implementa aquí:
            // const response = await client.get(API_ENDPOINTS.AUTH.VALIDATE);
            // return true;
            
            // Por ahora, validación básica con el token en localStorage
            const token = localStorage.getItem('token');
            const isValid = !!token;
            console.log('✅ authApi.validate - Token válido:', isValid);
            return isValid;
        } catch (error) {
            console.error('❌ authApi.validate - Error:', error);
            return false;
        }
    },

    /**
     * Obtener usuario actual con validación
     * @returns {Object|null} - Datos del usuario
     */
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            console.log('🔧 authApi.getCurrentUser - Usuario:', user?.username || 'No autenticado');
            return user;
        } catch (error) {
            console.error('❌ authApi.getCurrentUser - Error parseando usuario:', error);
            return null;
        }
    },

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const isAuth = !!token;
        console.log('🔧 authApi.isAuthenticated - Autenticado:', isAuth);
        return isAuth;
    },

    /**
     * Limpiar almacenamiento local (útil para testing)
     */
    clearStorage: () => {
        console.log('🔧 authApi.clearStorage - Limpiando storage...');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
    }
};