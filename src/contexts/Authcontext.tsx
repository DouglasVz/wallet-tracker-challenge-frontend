'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/api/apiRequest';

type User = {
  email: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<  {error:string, message:string }| void>;
    signup: (email: string, password: string) => Promise<{error:string, message:string } | void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [expiredTimer, setExpiredTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('user_email');
        if (token && email) {
            setIsAuthenticated(true);
            setUser({ email });
        }
        setIsLoading(false)
        const _timer = checkAccessTokenExpiration()
        return () => {
            if (_timer) clearInterval(_timer);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await apiRequest('POST', '/auth/login', { email, password });
        if (!res.error && res.data?.access_token) {
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('token_exp', res.data.exp);
            localStorage.setItem('user_email', email);
            setUser({ email });
            setIsAuthenticated(true);
            checkAccessTokenExpiration()
            // router.push('/');
        }else {
            return {error: res.error, message: res.message }
        }
    };

    const signup = async (email: string, password: string) => {
        const res = await apiRequest('POST', '/auth/register', { email, password });
        if (!res.error) {
            await login(email, password);
        }else {
            return {error: res.error, message: res.message }
        }
    };

    const checkAccessTokenExpiration = () => {
        let timer: NodeJS.Timeout | null = null;
        const checkExpiry = () => {
            const exp = parseInt(localStorage.getItem('token_exp') || '0', 10);
            const isAtFiveMinToExpire = Math.floor(Date.now() / 1000) + (5 * 60);
            if (isAtFiveMinToExpire >= exp) {
                logout();
                if (timer) clearInterval(timer);
            }
        };

        checkExpiry(); // initial check
        timer = setInterval(checkExpiry, 60000); // check every minute
        setExpiredTimer(timer)
        return timer
    }

    const logout = () => {
        localStorage.clear()
        setUser(null);
        setIsAuthenticated(false);
        if (expiredTimer) clearInterval(expiredTimer);
        // router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider}