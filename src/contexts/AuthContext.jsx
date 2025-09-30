import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Debug при каждом рендере
    console.log('AuthContext state:', { isAuthenticated, user, loading });

    const login = async (username, password) => {
        setLoading(true);
        try {
            const data = await authApi.login(username, password);

            console.log('=== LOGIN RESPONSE ===');
            console.log('Full response:', data);
            console.log('Token:', data.token);
            console.log('User object:', data.user);

            // Обработка разных форматов ответа от бэкенда
            let userData = null;

            if (data.user && data.user.id) {
                // Формат: { token, user: { id, username, email } }
                userData = {
                    ...data.user,
                    role: 'OWNER'
                };
            } else if (data.userId) {
                // Формат: { token, userId, username, email }
                userData = {
                    id: data.userId,
                    username: data.username || username,
                    email: data.email,
                    role: 'OWNER'
                };
            } else if (data.id) {
                // Формат: { token, id, username, email }
                userData = {
                    id: data.id,
                    username: data.username || username,
                    email: data.email,
                    role: 'OWNER'
                };
            } else {
                // Fallback - создаем минимальный объект
                console.warn('Unknown response format, creating fallback user');
                userData = {
                    id: 1, // ВРЕМЕННО! Замените когда узнаете формат
                    username: username,
                    role: 'OWNER'
                };
            }

            console.log('Processed user data:', userData);

            setUser(userData);
            setIsAuthenticated(true);

            console.log('=== LOGIN COMPLETE ===');
            console.log('User set to:', userData);

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await authApi.register(username, email, password);

            console.log('=== REGISTER RESPONSE ===');
            console.log('Full response:', data);

            // Та же обработка что и для login
            let userData = null;

            if (data.user && data.user.id) {
                userData = { ...data.user, role: 'OWNER' };
            } else if (data.userId) {
                userData = {
                    id: data.userId,
                    username: data.username || username,
                    email: data.email || email,
                    role: 'OWNER'
                };
            } else if (data.id) {
                userData = {
                    id: data.id,
                    username: data.username || username,
                    email: data.email || email,
                    role: 'OWNER'
                };
            } else {
                userData = {
                    id: 1,
                    username: username,
                    email: email,
                    role: 'OWNER'
                };
            }

            console.log('Processed user data:', userData);

            setUser(userData);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};