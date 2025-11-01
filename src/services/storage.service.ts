export interface User {
    [key: string]: any;
}

const StorageService = {
    // Token de acceso
    setToken(token: string): void {
        localStorage.setItem('token', token);
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    // Refresh token
    setRefreshToken(refreshToken: string): void {
        localStorage.setItem('refreshToken', refreshToken);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    },

    // Username
    setUsername(username: string): void {
        localStorage.setItem('username', username);
    },

    getUsername(): string | null {
        return localStorage.getItem('username');
    },

    // Email
    setEmail(email: string): void {
        localStorage.setItem('email', email);
    },

    getEmail(): string | null {
        return localStorage.getItem('email');
    },

    // User completo
    setUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Verificaciones
    hasToken(): boolean {
        return !!this.getToken();
    },

    // Limpiar todo
    clear(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('user');
    }
};

export { StorageService };
