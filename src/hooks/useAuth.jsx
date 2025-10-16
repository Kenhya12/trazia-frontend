/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(storageService.getUsername());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUsername = storageService.getUsername();
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setUsername(data.username);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión'
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authService.register(userData);
            setUsername(data.username);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al registrarse'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        storageService.clear();
        setUsername(null);
    };

    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    const value = {
        username,
        login,
        register,
        logout,
        loading,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

