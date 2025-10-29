export const storageService = {
    // Token de acceso
    setToken(token) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    // Refresh token
    setRefreshToken(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    },

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    // Username
    setUsername(username) {
        localStorage.setItem('username', username);
    },

    getUsername() {
        return localStorage.getItem('username');
    },

    // Email
    setEmail(email) {
        localStorage.setItem('email', email);
    },

    getEmail() {
        return localStorage.getItem('email');
    },

    // User completo
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Verificaciones
    hasToken() {
        return !!this.getToken();
    },

    // Limpiar todo
    clear() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('user');
    }
};

