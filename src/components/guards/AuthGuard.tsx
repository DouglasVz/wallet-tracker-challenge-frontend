'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Intro from '../intro';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (!isAuthenticated || isLoading) return <Intro />; // prevent flicker

    return <>{children}</>;
}
