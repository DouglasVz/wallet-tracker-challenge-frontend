'use client';

import { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, useMediaQuery, Button, Alert } from '@mui/material';
import Sidebar from './SideBar';
import Header from './Header';
import useWallet from '@/hooks/useWallet';
import Walletconnection from '../wallets/WalletConnection';
import useAuth from '@/hooks/useAuth';
import { Logout } from '@mui/icons-material';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openConnectionAlert, setOpenConnectionAlert] = useState(false);
    const {isConnected, unAuthorizedWallet, isNotLoggedMeta, contractAddress} = useWallet()
    const {logout} = useAuth()
    const isMobile = useMediaQuery('(max-width:900px)');

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    useEffect(() => {
        if (!isConnected) {
            setOpenConnectionAlert(true)
        }else {
            setOpenConnectionAlert(false)
        }
    },[isConnected])

    return (
        <Box display="flex" height="100vh">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Box flex={1} display="flex" flexDirection="column">
                <Header onToggleSidebar={toggleSidebar} />
                <Box flex={1} p={2} sx={{ml: isMobile ? "0" :"270px", width: isMobile ? "100vw" :"auto", bgcolor:"grey.200"}}  overflow="auto">
                    {!contractAddress &&
                        <Box sx={{mb:2}}>
                            <Alert severity='error'>Please enter a 'Contract Address' to continue.</Alert>
                        </Box>
                    }
                    {children}
                </Box>
            </Box>
            <Dialog
                open={openConnectionAlert && !unAuthorizedWallet && !isNotLoggedMeta}
                onClose={() => {setOpenConnectionAlert(false)}}
            >
                <DialogContent>
                    There is no 'Wallet Connected'. Please connect one.
                    <Box sx={{display:'flex', justifyContent:"center", mt:3}}>
                        <Walletconnection />
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog
                open={unAuthorizedWallet}
            >
                <DialogContent>
                    The current wallet connected to <strong>MetaMask</strong> is already registered to another account in this app. You can either connect a new wallet or log out to access the correct account.
                    <Box sx={{display:'flex', justifyContent:"center", mt:3}}>
                        <Button startIcon={<Logout />} variant='outlined' color='error' onClick={() => logout()}>Logout</Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isNotLoggedMeta}
            >
                <DialogContent>
                    Ensure <strong>MetaMask</strong> is installed and connected to your account.
                </DialogContent>
            </Dialog>
        </Box>
    );
}
