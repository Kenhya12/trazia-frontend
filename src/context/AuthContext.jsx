/* @refresh reload */
import { createContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage.service';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, setState] = useState({
        isAuthenticated: false,
        isLoading: true,
        username: null
    });

    useEffect(() => {
        const token = storageService.getToken();
        const username = storageService.getUsername();

        setState({
            isAuthenticated: !!token,
            isLoading: false,
            username: username
        });
    }, []);

    const login = (token, username) => {
        storageService.setToken(token);
        storageService.setUsername(username);
        setState({
            isAuthenticated: true,
            isLoading: false,
            username
        });
    };

    const logout = () => {
        storageService.clear();
        setState({
            isAuthenticated: false,
            isLoading: false,
            username: null
        });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

