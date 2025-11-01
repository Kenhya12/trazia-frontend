import client from './client';
import { API_ENDPOINTS } from './endpoints';

interface AuthResponse {
    token: string;
    refreshToken: string;
    username: string;
    email: string;
}

interface RefreshResponse {
    token: string;
    refreshToken: string;
}

interface Credentials {
    email: string;
    password: string;
}

interface UserData {
    username: string;
    email: string;
    password: string;
}

/**
 * Servicio para manejar el almacenamiento local
 */
const StorageService = {
    getToken: (): string | null => localStorage.getItem('token'),
    setToken: (token: string): void => localStorage.setItem('token', token),
    removeToken: (): void => localStorage.removeItem('token'),

    getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),
    setRefreshToken: (refreshToken: string): void => localStorage.setItem('refreshToken', refreshToken),
    removeRefreshToken: (): void => localStorage.removeItem('refreshToken'),

    getUsername: (): string | null => localStorage.getItem('username'),
    setUsername: (username: string): void => localStorage.setItem('username', username),
    removeUsername: (): void => localStorage.removeItem('username'),

    getUser: (): object | null => {
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    },
    setUser: (user: object): void => localStorage.setItem('user', JSON.stringify(user)),
    removeUser: (): void => localStorage.removeItem('user'),

    clearAll: (): void => {
        StorageService.removeToken();
        StorageService.removeRefreshToken();
        StorageService.removeUsername();
        StorageService.removeUser();
    }
};

export const authApi = {
    /**
     * Login de usuario
     * @param credentials - { email, password }
     * @returns Promise<AuthResponse>
     */
    login: async (credentials: Credentials): Promise<AuthResponse> => {
        try {
            const response = await client.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
            throw { message: errorMessage, status: error.response?.status };
        }
    },

    /**
     * Registro de usuario
     * @param userData - { username, email, password }
     * @returns Promise<AuthResponse>
     */
    register: async (userData: UserData): Promise<AuthResponse> => {
        try {
            const response = await client.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al registrarse';
            throw { message: errorMessage, status: error.response?.status };
        }
    },

    /**
     * Refresh token
     * @param refreshToken
     * @returns Promise<RefreshResponse>
     */
    refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
        try {
            const response = await client.post<RefreshResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Error al renovar token' };
        }
    },

    /**
     * Logout
     */
    logout: async (): Promise<void> => {
        try {
            // await client.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch {
            // No se propaga el error para evitar bloqueos en frontend
        } finally {
            StorageService.clearAll();
        }
    },

    /**
     * Validar token actual
     * @returns Promise<boolean>
     */
    validate: async (): Promise<boolean> => {
        try {
            // Implementar validación real si se dispone de endpoint
            const token = StorageService.getToken();
            return !!token;
        } catch {
            return false;
        }
    },

    /**
     * Obtener usuario actual
     * @returns object | null
     */
    getCurrentUser: (): object | null => {
        return StorageService.getUser();
    },

    /**
     * Verificar si el usuario está autenticado
     * @returns boolean
     */
    isAuthenticated: (): boolean => {
        return !!StorageService.getToken();
    },

    /**
     * Limpiar almacenamiento local (útil para testing)
     */
    clearStorage: (): void => {
        StorageService.clearAll();
    }
};