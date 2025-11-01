import { authApi } from '../api/authApi';
import { StorageService } from '../services/storage.service';

interface Credentials {
    email: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    refreshToken: string;
    username: string;
    email?: string;
}

export const authService = {
    async login(credentials: Credentials): Promise<AuthResponse> {
        const data = await authApi.login(credentials);
        StorageService.setToken(data.token);
        StorageService.setRefreshToken(data.refreshToken);
        StorageService.setUsername(data.username);
        return data;
    },

    async register(userData: RegisterData): Promise<AuthResponse> {
        const data = await authApi.register(userData);
        StorageService.setToken(data.token);
        StorageService.setRefreshToken(data.refreshToken);
        StorageService.setUsername(data.username);
        return data;
    },

    async logout(): Promise<void> {
        try {
            await authApi.logout();
        } finally {
            StorageService.clear();
        }
    },

    async validateToken(): Promise<boolean> {
        if (!StorageService.hasToken()) return false;
        try {
            await authApi.validate();
            return true;
        } catch {
            StorageService.clear();
            return false;
        }
    },

    isAuthenticated(): boolean {
        const token = StorageService.getToken();
        return !!token && token !== 'undefined' && token !== 'null';
    },

    getUsername(): string | null {
        return StorageService.getUsername();
    }
};
