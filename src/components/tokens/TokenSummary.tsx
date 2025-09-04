'use client';

import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Link } from '@mui/material';
import { apiRequest } from '@/api/apiRequest';
import useWallet from '@/hooks/useWallet';

export default function TokenSummary() {
    const [token, setToken] = useState({ balance: '0.00', symbol: '', name: '' });
    const {walletAddress, contractAddress} = useWallet()
    const explorerUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;

    useEffect(() => {
        if (!walletAddress || !contractAddress) return;
        const fetchBalance = async () => {
        const res = await apiRequest('GET', `/portfolio/wallets/${walletAddress?.id}/balance?contract_address=${contractAddress}`);
        if (!res.error) setToken(res.data);
        };
        fetchBalance();
    }, [walletAddress, contractAddress]);

    return (
        <Grid container spacing={2}>
            <Grid size={{xs:12, md:6 }} >
                <Paper variant='outlined' elevation={0} sx={{ p: 2, mb: 3, height:"100%" }}>
                    <Typography variant="subtitle2" sx={{mb:2}}>Token</Typography>
                    <Typography variant="h6">{token.name} ({token.symbol})</Typography>
                    <Typography variant="body1">Balance: {token.balance}</Typography>
                </Paper>
            </Grid>
            <Grid size={{xs:12, md:6}}>
                <Paper variant='outlined' elevation={0} sx={{ p: 2, mb: 3, height:"100%" }}>
                    <Typography variant="subtitle2" sx={{mb:2}}>More Info</Typography>
                    <Typography variant="h6">Token Contract</Typography>
                    <Typography variant="body2">

                        <Link
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                                color: '#673ab7',
                                fontWeight: 500,
                                wordBreak: 'break-all',
                                background: 'rgba(103,58,183,0.05)',
                                px: 0.5,
                                borderRadius: '4px'
                            }}
                            >
                            {contractAddress}
                        </Link>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
