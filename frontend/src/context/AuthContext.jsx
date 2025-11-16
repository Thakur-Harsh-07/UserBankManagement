import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async (tokenToUse = null) => {
        const tokenForRequest = tokenToUse || token;
        if (!tokenForRequest) {
            setLoading(false);
            return;
        }
        
        try {
            const response = await authApi.getProfile(tokenForRequest);
            setUser(response.data);
        } catch (error) {
            console.error('Error loading user:', error);
            if (tokenToUse) {
                // If this was called from login, don't logout, just set loading to false
                setLoading(false);
            } else {
                // If this was called from useEffect, logout since token is invalid
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authApi.login({ email, password });
            if (response.data.success) {
                const newToken = response.data.token;
                setToken(newToken);
                localStorage.setItem('token', newToken);
                // Pass the new token directly to loadUser to avoid race condition
                await loadUser(newToken);
                toast.success('Login successful!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const signup = async (username, email, password, role = 'user') => {
        try {
            const response = await authApi.signup({ username, email, password, role });
            if (response.data.success) {
                toast.success('Registration successful! Please login.');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
    };

    

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

