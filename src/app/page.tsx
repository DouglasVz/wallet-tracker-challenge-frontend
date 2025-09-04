
'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import useWallet from '@/hooks/useWallet';
import { Alert } from '@mui/material';

export default function DashboardPage() {
    const {isConnected} = useWallet();
    return (
        <AuthGuard>
            <DashboardLayout>
                {
                    isConnected ?
                    <>
                        <PortfolioSummary />
                    </>:
                    <Alert severity='error'>There is no Wallet Connected. Please connect one.</Alert>
                }
            </DashboardLayout>
        </AuthGuard>
    );
}
