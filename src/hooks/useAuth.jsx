/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

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
            storageService.setUsername(data.username);
            storageService.setEmail(data.email);
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
            storageService.setUsername(data.username);
            storageService.setEmail(data.email);
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
        authService.logout();
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
