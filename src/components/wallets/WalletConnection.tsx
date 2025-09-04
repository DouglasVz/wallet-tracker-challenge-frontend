'use client';

import { useState } from 'react';
import { Box, Button, Alert, Typography, Snackbar } from '@mui/material';
import useWallet from '@/hooks/useWallet';
import { LinkOff } from '@mui/icons-material';

export default function Walletconnection() {
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(false);
    const {isConnected, isNotLoggedMeta, connectWallet, disconnectWallet} = useWallet();
    
    const isMetaMaskInstalled = typeof window !== 'undefined' && !!window.ethereum;
    
  return (
        <Box >
            {!isMetaMaskInstalled ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    MetaMask is not installed.{' '}
                    <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">
                        Install MetaMask
                    </a>{' '}
                    to connect your wallet.
                </Alert>
            ) : (
                <>
                {isConnected ?
                    <Box sx={{mb:2}}>
                        
                        <Button color="error" variant='contained' endIcon={<LinkOff />} onClick={disconnectWallet}>
                        Disconnect Wallet
                        </Button>
                    </Box>
                    :
                    <Button variant="contained" onClick={connectWallet} sx={{ mb: 2 }}>
                        Connect Wallet
                    </Button>

                }
                </>
            )}

            {
                error && 
                <Snackbar
                    open={Boolean(error)}
                    onClose={() => {setError('')}}
                    autoHideDuration={6000}
                >
                    <Alert 
                        severity="error" 
                        sx={{ mb: 2 }}
                        onClose={() => {setError('')}}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            }
        </Box>
  );
}

