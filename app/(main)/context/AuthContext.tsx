"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// --- تعريف أنواع البيانات (Interfaces) ---
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    district?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// إنشاء الكونتيكست
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. عند تحميل التطبيق: التأكد من وجود مستخدم مسجل في الـ LocalStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            
            // ضبط Axios Header تلقائياً لكل الطلبات القادمة
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    // 2. دالة تسجيل الدخول
    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        
        // حفظ البيانات في المتصفح
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // تحديث Axios Header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    // 3. دالة تسجيل الخروج
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook مخصص لسهولة الاستخدام في أي Component
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};