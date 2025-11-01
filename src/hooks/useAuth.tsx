/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
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

interface AuthContextValue {
    username: string | null;
    login: (credentials: Credentials) => Promise<{ success: boolean; error?: string }>;
    register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(StorageService.getUsername());
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const storedUsername = StorageService.getUsername();
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const login = async (credentials: Credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setUsername(data.username);
            StorageService.setUsername(data.username);
            StorageService.setEmail(data.email);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión'
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterData) => {
        setLoading(true);
        try {
            const data = await authService.register(userData);
            setUsername(data.username);
            StorageService.setUsername(data.username);
            StorageService.setEmail(data.email);
            return { success: true };
        } catch (error: any) {
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

    const value: AuthContextValue = {
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

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
