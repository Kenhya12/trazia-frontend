import { authApi } from '../api/authApi';
import { storageService } from './storageService';

export const authService = {
    async login(credentials) {
        // ✅ authApi.login() ya devuelve data directamente
        const data = await authApi.login(credentials);
        storageService.setToken(data.token);
        storageService.setRefreshToken(data.refreshToken); // Agregar esto
        storageService.setUsername(data.username);
        return data;
    },

    async register(userData) {
        // ✅ authApi.register() ya devuelve data directamente
        const data = await authApi.register(userData);
        storageService.setToken(data.token);
        storageService.setRefreshToken(data.refreshToken); // Agregar esto
        storageService.setUsername(data.username);
        return data;
    },

    async logout() {
        try {
            await authApi.logout();
        } finally {
            storageService.clear();
        }
    },

    async validateToken() {
        if (!storageService.hasToken()) return false;
        try {
            await authApi.validate();
            return true;
        } catch {
            storageService.clear();
            return false;
        }
    },

    isAuthenticated() {
        return storageService.hasToken();
    },

    getUsername() {
        return storageService.getUsername();
    }
};


